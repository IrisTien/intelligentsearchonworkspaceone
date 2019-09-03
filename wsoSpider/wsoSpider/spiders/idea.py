# -*- coding: utf-8 -*-
import logging
import re
import sys
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.selector import Selector 
from scrapy.linkextractors import LinkExtractor
from scrapy.http import Request, FormRequest, HtmlResponse
from wsoSpider.items import IdeaInfoItem
from wsoSpider import settings

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler(sys.stdout)])


class IdeaSpider(scrapy.Spider):
   name = 'idea'
   allowed_domains = ['submissions.eng.vmware.com']
   start_urls = ['https://submissions.eng.vmware.com/inception/submissions/listing']


   post_headers = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36",
      "Referer": "https://submissions.eng.vmware.com/",
   }

   def start_requests(self):
      return [Request("https://submissions.eng.vmware.com/signin",
                      meta={'cookiejar': 1}, callback=self.post_login)]

   # FormRequeset
   def post_login(self, response):
      authenticity_token = response.xpath(
            '//input[@name="authenticity_token"]/@value').extract_first()
      logging.info('authenticity_token=' + authenticity_token)
      # Post sign request
      return [FormRequest.from_response(response,
                                       url='https://submissions.eng.vmware.com/sessions',
                                       meta = {'cookiejar' : response.meta['cookiejar']},
                                       headers=self.post_headers,
                                       method = "POST",
                                       formdata={
                                          'utf8': '✓',
                                          'session[username]': settings.userName,
                                          'session[password]': settings.userPwd,
                                          'authenticity_token': authenticity_token,
                                          'commit': 'Sign+In'
                                       }, 
                                       callback=self.after_login,
                                       dont_filter=True
                                       )]

   def after_login(self, response):
      cookieData = response.request.headers.getlist('Cookie')
      logging.info("Cookie: " + str(cookieData))
      #cookieList = cookieData[0].split('=')
      #cookiesMap = {cookieList[0]:cookieList[1]}
      # Start to grab data
      for url in self.start_urls:
            logging.info('Idea url=' + url)
            yield Request(url,
                        dont_filter=True,
                        meta={'dont_redirect': True,
                              'handle_httpstatus_list': [302],
                              "cookiejar": response.meta["cookiejar"]
                              },
                        #cookies=cookiesMap, 
                        callback=self.parse_page,)

   def parse_page(self, response):
      logging.info('Start to parge idea page...')
      #logging.info(str(response.text))

      #table = sel.xpath("//*[@class='dataTable table table-left table-striped']")
      #logging.info(str(table))
      trs = response.xpath("//*[@class='dataTable table table-left table-striped']/tbody/tr")
       
      # List to store all ideas
      ideas = []

      logging.info("Before getting idea data...")
      #logging.info(ideaRows)
      for row in trs:
         logging.info('Parse idea data...')
         item = IdeaInfoItem()
         item['title'] = row.xpath('.//td[1]/a/text()').extract()
         logging.info('title:')
         logging.info(item['title'])
         item['authors'] = row.xpath('.//td[2]/text()').extract()
         item['eventRegistration'] = row.xpath('.//td[3]/text()').extract()
         item['votes'] = row.xpath('.//td[4]/form/button/span[2]/text()').extract()
         item['submitter'] = row.xpath('.//td[5]/text()').extract()
         item['created'] = row.xpath('.//td[6]/span/text()').extract()
         yield item
         #ideas.append(item)

      #return ideas
