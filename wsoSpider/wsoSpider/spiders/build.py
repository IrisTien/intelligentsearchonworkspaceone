# prase the result from
#
#
# http://buildweb.eng.vmware.com/ob/api/legacy/builds_search/?branch=cart-20fq3&product=hcwin

import logging
import re
import sys
import scrapy
import json
from scrapy.spiders import CrawlSpider, Rule
from scrapy.selector import Selector 
from scrapy.linkextractors import LinkExtractor
from scrapy.http import Request, FormRequest, HtmlResponse
from wsoSpider.items import PersonItem
from urllib.parse import urlparse
import urllib
from wsoSpider.items import BuildItem
from wsoSpider import settings

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler(sys.stdout)])

class BuildSpider(scrapy.Spider):
   name = "build"
   allowed_domains = "eng.vmware.com"
   buildinfo_url = "http://buildapi.eng.vmware.com/ob/build/?product=hcandroid&branch=cart-20fq3&buildstate=succeeded&_format=json&_limit=1000"
   buildweb_url = "https://buildweb.eng.vmware.com"
   login_url2 = "https://buildweb.eng.vmware.com/login/"   
   itertag = 'product'
   builds = {}

   post_headers = {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36",
      "Referer": "https://buildweb.eng.vmware.com/login/?next=%2F",
   }

   def start_requests(self):
      logging.info("------------------start_requests..." )
      return [Request(self.buildinfo_url,
                      meta={'cookiejar': 1}, callback=self.parse_build_response)]

   def parse_build_response(self, response):
      logging.info("------------------parse_build_response------------" )
       #logging.info(response.text)

      buildRes = json.loads(response.text)
      for buildInfo in buildRes["_list"]:
         build = BuildItem()
         build['buildId'] = str(buildInfo['id'])
         build['changeset'] = buildInfo['changeset']
         build['version'] = buildInfo['version']
         build['branch'] = buildInfo['branch']
         build['product'] = buildInfo['product']
         build['link'] = self.buildweb_url + buildInfo['_this_url']
         build['releaseType'] = buildInfo['releasetype']
         self.builds[build['buildId']] = build
         #logging.info(build['buildId'])

      return [Request(self.buildweb_url,
                      meta={'cookiejar': 1}, callback=self.post_login1,
                      dont_filter=True)]

   def post_login1(self,response):
      logging.info("------------------post_login1------------" )
      logging.info("Post Login url: %s", response.url);
      cookieData = response.request.headers.getlist('Cookie')
      logging.info("Cookie: " + str(cookieData))
      return Request(self.login_url2,
                    dont_filter=True,
                    meta={'dont_redirect': True,
                         'handle_httpstatus_list': [302],
                         "cookiejar": response.meta["cookiejar"]
                        },
                   callback=self.post_login2)

   def post_login2(self, response):
      logging.info("------------------post_login2------------" )
      cookieData = response.request.headers.getlist('Cookie')
      logging.info("Cookie: " + str(cookieData))
      return [FormRequest.from_response(response,
                                 url=self.login_url2,
                                 meta = {'cookiejar' : response.meta['cookiejar']},
                                 headers=self.post_headers,
                                 method = "POST",
                                 formdata={
                                    'username': settings.userName,
                                    'password': settings.userPwd
                                 }, 
                                 callback=self.get_build_info,
                                 dont_filter=True
                                 )]

   def get_build_info(self, response):
      logging.info("------------Get Build Info------------")
      buildObUrl = 'https://buildweb.eng.vmware.com/ob/'
      '''
      # Just for test 1 build
      yield Request("https://buildweb.eng.vmware.com/ob/14056716/",
                       dont_filter=True,
                       meta={'dont_redirect': True,
                             'handle_httpstatus_list': [302],
                             "cookiejar": response.meta["cookiejar"]
                            },
                       callback=self.parse_build)
      '''
      
      for buildId, buildInfo in self.builds.items():
         buildUrl = buildObUrl + buildInfo['buildId'] + '/'
         logging.info("Yield url=%s", buildUrl)
         yield Request(buildUrl,
                       dont_filter=True,
                       meta={'dont_redirect': True,
                             'handle_httpstatus_list': [302],
                             "cookiejar": response.meta["cookiejar"]
                            },
                       callback=self.parse_build)
         
   def byteify(self, input, encoding='utf-8'):
    if isinstance(input, dict):
        return {byteify(key): byteify(value) for key, value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode(encoding)
    else:
        return input

   def parse_build(self, response):
      logging.info("------------Parse Build------------")
      resUrl = response.url
      idx1 = resUrl.rindex('/', 0,len(resUrl)-1)
      buildNum = resUrl[idx1+1:-1]
      changeSetLink = response.xpath("//*[@class='info']/tbody/tr[4]/td[2]/a[1]/@href").extract()
      clog_link = response.xpath("//*[@class='info']/tbody/tr[4]/td[2]/a[2]/@href").extract()
      clog_link = self.buildweb_url + str(clog_link[0])

      logging.info(buildNum)
      if buildNum in self.builds:
         buildItem = self.builds[buildNum]
         buildItem['changeset_link'] = changeSetLink
         buildItem['clog_link'] = clog_link

         #logging.info(str(buildItem))
         yield buildItem

