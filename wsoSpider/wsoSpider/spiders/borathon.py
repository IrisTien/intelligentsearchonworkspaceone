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


class BorathonSpider(scrapy.Spider):
   name = 'borathon'
   allowed_domains = ['submissions.eng.vmware.com']
   submissions_url = 'https://submissions.eng.vmware.com'
   start_urls = ['https://submissions.eng.vmware.com/borathon-china-q3-2019/submissions/listing']
   ideas = {}

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
      logging.info("------------------post_login------------------" )
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
      logging.info("------------------after_login------------------" )
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
      logging.info("------------------parse_page------------------" )
      logging.info('Start to parge idea page...')
      #logging.info(str(response.text))

      #table = sel.xpath("//*[@class='dataTable table table-left table-striped']")
      #logging.info(str(table))
      #trs = response.xpath('//*[@id="DataTables_Table_0"]/tbody/tr')
      trs = response.xpath('//div/table/tbody/tr')
      logging.info("tr length:%d", len(trs))
      # List to store all ideas
      ideas = []

      logging.info("Before getting idea data...")
      #logging.info(ideaRows)
      for row in trs:
         logging.info('Parse idea data...')
         item = IdeaInfoItem()
         item['title'] = row.xpath('.//td[1]/a/text()').extract()[0].strip()
         link = row.xpath('.//td[1]/a/@href').extract()[0]
         idx1 = link.rindex('/')
         item['shortName'] = link[idx1+1:]
         item['link'] = self.submissions_url + link         
         item['teamMembers'] = row.xpath('.//td[2]/text()').extract()[0].strip()
         item['submitter'] = row.xpath('.//td[6]/text()').extract()[0].strip()
         item['created'] = row.xpath('.//td[7]/span/text()').extract()[0].strip()
         self.ideas[item['link']] = item

         logging.info("Yield link: %s", item['link'])
         yield Request(item['link'],
                        dont_filter=True,
                        meta={'dont_redirect': True,
                              'handle_httpstatus_list': [302],
                              "cookiejar": response.meta["cookiejar"]
                              },
                        callback=self.parse_idea_page)
         #yield item
         #ideas.append(item)

   def parse_idea_page(self, response):
      logging.info("------------------parse_idea_page------------------" )
      logging.info('Start to parse idea page')
      url = response.url

      description = response.xpath('//*[@id="js-submission"]/div[1]/p/text()').extract()
      logging.info("Description: %s", ' '.join(description))

      theme = response.xpath('//*[@id="js-submission"]/div[2]/p/text()').extract()
      logging.info("theme: %s", theme[0].strip())

      idea = self.ideas[url]
      idea['description'] = ' '.join(description)
      idea['theme'] = theme[0].strip()
      yield idea
   
