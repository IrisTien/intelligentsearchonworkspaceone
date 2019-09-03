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
from wsoSpider.items import BuildItem, BuildComponentItem, ChangeListItem
from wsoSpider import settings

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler(sys.stdout)])

class BuildCompSpider(scrapy.Spider):
   name = "changelist"
   allowed_domains = "eng.vmware.com"
   buildinfo_url = "http://buildapi.eng.vmware.com/ob/build/?product=hcwin&branch=cart-20fq3&buildstate=succeeded&_format=json&_limit=1000"
   buildweb_url = "https://buildweb.eng.vmware.com"
   login_url2 = "https://buildweb.eng.vmware.com/login/"
   p4_login_start = 'https://p4web.eng.vmware.com'
   p4_login_post = 'https://p4web.eng.vmware.com/@md=d&cd=//&c=YVc@/'
   p4_login_response = None
   builds = {}
   comList = []

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

   post_headers2 = {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36",
      "Referer": "https://p4web.eng.vmware.com",
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
         self.builds[build['buildId']] = build
                                 
         logging.info(str(build))

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
                                 callback=self.get_build_com_info,
                                 dont_filter=True
                                 )]

   def get_build_com_info(self, response):
      logging.info("------------Get Build Info------------")
      buildCompUrl = 'https://buildweb.eng.vmware.com/ob/api/dep_info_ajax/'
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
         compUrl = buildCompUrl + buildInfo['buildId'] + '/'
         logging.info("Yield url=%s", compUrl)
         yield Request(compUrl,
                       dont_filter=True,
                       meta={'dont_redirect': True,
                             'handle_httpstatus_list': [302],
                             "cookiejar": response.meta["cookiejar"]
                            },
                       callback=self.parse_build_comp)
         break  #Only for debug purpose for 1 item

   def parse_build_comp(self, response):
      logging.info("------------Parse Build Comp------------")
      logging.info(str(response.meta))
      resUrl = response.url
      idx1 = resUrl.rindex('/', 0,len(resUrl)-1)
      buildNum = resUrl[idx1+1:-1]

      compList = json.loads(response.text)['components']

      for comInfo in compList:
         comItem = BuildComponentItem()
         comItem['buildId'] = buildNum
         comItem['componentId'] = comInfo['id']
         comItem['p4web_url'] = comInfo['p4web_url']
         if comInfo['p4web_url'] is None:
            continue # Ignore the comonents without p4 change
         self.comList.append(comItem)
         logging.info(str(comItem))

         '''
         yield [FormRequest.from_response(self.p4_login_response,
                                 comItem['p4web_url'],
                                 headers=self.post_headers,
                                 method = "GET",
                                 formdata={
                                    'ac': '10'
                                 }, 
                                 callback=self.parse_changelist,
                                 )]'''
         #break #Just for debugging purpose
      return [Request(self.p4_login_start,
                      meta={'cookiejar': 2},
                      callback=self.start_p4_login,
                      dont_filter=True)]

   def start_p4_login(self, response):
      logging.info("------------------start_p4_login------------" )
      #logging.info(response.text)  
      logging.info(str(response.meta))
      ac = response.xpath('//form[@name="l"]/@action').extract()
      
      postUrl = self.p4_login_post + str(ac[0])
      logging.info("Url = %s", postUrl)
      return [FormRequest.from_response(response,
                     url=postUrl,
                     headers=self.post_headers2,
                     method = "POST",
                     meta={"cookiejar": response.meta["cookiejar"]},
                     formdata={
                               'c': '',
                               'orgurl': '',
                               'u': settings.userName,
                               'p': settings.userPwd,
                               'Submit': 'Log+In'
                               }, 
                     callback=self.parse_p4_login,
                     dont_filter=True
                     )]

   def parse_p4_login(self, response):
      logging.info("------------------parse_p4_login------------" )
      #logging.info(response.text)
      logging.info(str(response.meta))
      
      # Get build's change list
      for buildId, buildInfo in self.builds.items():
         changeUrl = 'http://p4web.eng.vmware.com/@md=d&cd=//&c=UXC@/' + buildInfo['changeset'] + '?ac=10'
         logging.info("changelist url=%s", changeUrl)
         yield Request(changeUrl,
                       dont_filter=True,
                       meta={
                             #'handle_httpstatus_list': [302],
                             "cookiejar": response.meta["cookiejar"]
                            },
                       callback=self.parse_changelist)

      # Get Build Component's change list
      for comInfo in self.comList:
         logging.info("changelist component url=%s", comInfo['p4web_url'])
         yield Request(comInfo['p4web_url'],
                       meta={'dont_redirect': True,
                             'handle_httpstatus_list': [302],
                              'cookiejar': response.meta['cookiejar']
                             },
                       callback=self.parse_changelist)


   def parse_changelist(self, response):
      #logging.info(response.text)
      resUrl = response.url

      idx1 = resUrl.rindex('/')
      idx2 = resUrl.rindex('?')
      changelist = resUrl[idx1+1:idx2]

      changeItem = ChangeListItem()

      table = response.xpath('//td/table//td/table//td/table//td/table')
      logging.info(str(table))

      changeItem['changelist'] = changelist
      changeItem['date'] =       self.remove_space(response.xpath('.//tr[2]/td[2]/text()').extract()[1])
      changeItem['client'] =     self.remove_space(response.xpath('.//tr[3]/td[2]/text()').extract()[0])
      changeItem['user'] =       self.remove_space(response.xpath('.//tr[4]/td[2]/text()').extract()[0])
      
      description = response.xpath('.//tr[5]/td[2]/pre/text()').extract()[0]
      changeItem['description'] = description

      #Ignore CBOT change list
      desc = description.strip()
      if desc.find('CBOT:') != -1:
         logging.info("*************Ignore CBOT change list.*************")
         return
      elif desc.find('setup bumps') != -1:
         logging.info("*************Ignore setup bumps change list.*************")
         return
      #changeItem['affectedFiles'] = response.xpath('.//tr[6]/td[2]//a/text()').extract()

      logging.info(response.xpath('.//tr[6]/td[2]//a/text()'))
      descList = description.split('\n')
      changeItem['title'] = descList[1]
      for line in descList:
         line = self.remove_space(line)
         lineItems = line.split(':')
         if len(lineItems) == 2:
            if lineItems[0] == 'Bug Number':
               changeItem['bugNumbers'] = lineItems[1]
               logging.info(changeItem['bugNumbers'])
            elif lineItems[0] == 'Reviewed by':
               changeItem['reviewedBy'] = lineItems[1]
               logging.info(changeItem['reviewedBy'])
            elif lineItems[0] == 'Review URL':
               changeItem['reviewURL'] = lineItems[1]
               logging.info(changeItem['reviewURL'])
         elif len(lineItems) == 3:
            if lineItems[0] == 'Review URL':
               changeItem['reviewURL'] = lineItems[1] + lineItems[2]
               logging.info(changeItem['reviewURL'])
      
      #logging.info(str(changeItem))
      yield changeItem


   def remove_space(self, text):
      if text is None:
         return text
      
      return text.strip()

