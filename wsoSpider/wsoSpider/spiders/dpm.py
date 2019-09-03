# -*- coding: utf-8 -*-
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
from wsoSpider import settings
import urllib

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler(sys.stdout)])

def json_loads_byteified(json_text):
    return _byteify(
        json.loads(json_text, object_hook=_byteify),
        ignore_dicts=True
    )

def _byteify(data, ignore_dicts = False):
    # if this is a unicode string, return its string representation
    if isinstance(data, unicode):
        return data.encode('utf-8')
    # if this is a list of values, return list of byteified values
    if isinstance(data, list):
        return [ _byteify(item, ignore_dicts=True) for item in data ]
    # if this is a dictionary, return dictionary of byteified keys and values
    # but only if we haven't already byteified it
    if isinstance(data, dict) and not ignore_dicts:
        return {
            _byteify(key, ignore_dicts=True): _byteify(value, ignore_dicts=True)
            for key, value in data.iteritems()
        }
    # if it's anything else, return it in its original form
    return data

class DpmSpider(scrapy.Spider):
   name = 'dpm'
   allowed_domains = ['workspaceair.com']
   url = 'https://myvmware.workspaceair.com/catalog-portal/services/api/users/'
   #cindyId = '8715f517-7c70-4d78-856c-4d0f93f343e5'
   managerId = 'c10a99f6-6f37-4ebb-a817-81016012e1c9' # CEO
   persons = []
   start_urls = ['https://myvmware.workspaceair.com/SAAS/auth/authenticatedUserDispatcher',
                'https://myvmware.workspaceair.com/web',
                'https://myvmware.workspaceair.com/SAAS/apps/',
                'https://myvmware.workspaceair.com/catalog-portal/ui?isOnPremise=false&isMobile=false&userId=151034']
   post_headers = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36",
      "Referer": "https://myvmware.workspaceair.com/",
   }

   post_headers2 = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36",
      "Referer": "https://jira.eng.vmware.com/",
   }

   def start_requests(self):
      logging.info("Start login..." )

      return [Request("https://myvmware.workspaceair.com/SAAS/auth/login/embeddedauthbroker/callback",
                      meta={'cookiejar': 1}, callback=self.post_login1)]

   # FormRequeset
   def post_login1(self, response):
      logging.info("url: %s", response.url);
      #logging.info("Post login response:" + response.text)

      RelayState = response.xpath("//textarea[@name='RelayState']/text()").extract()
      logging.info("relaystate = %s", RelayState)

      # Post sign request
      return [FormRequest.from_response(response,
                                       url='https://myvmware.workspaceair.com/SAAS/auth/login/embeddedauthbroker/callback',
                                       meta = {'cookiejar' : response.meta['cookiejar']},
                                       headers=self.post_headers,
                                       method = "POST",
                                       formdata={
                                          'horizonRelayState': RelayState,
                                          'requestTimeout': '20'
                                       }, 
                                       callback=self.post_login2
                                       )]

   def post_login2(self, response):
      logging.info("post login 2: %s", response.url);
      #logging.info("Post login 2 response:" + response.text)
      #par = urlparse.parse_qs(urlparse.urlparse(response.url).query)
      '''
      loginUlr = par['EAB_CALLBACK_URL']
      if (loginUlr == None):
         logging.info("login url 2 is null")
         return

      #horizonRelayState = par['horizonRelayState']
      #requestTimeout = par['requestTimeout']

      logging.info("login url: %s", urllib)
      '''
      RelayState = response.xpath("//textarea[@name='RelayState']/text()").extract()
      logging.info("relaystate = %s", RelayState)

      # Post sign request
      return [FormRequest.from_response(response,
                                       url='https://myvmware.workspaceair.com/SAAS/auth/login/embeddedauthbroker/callback',
                                       meta = {'cookiejar' : response.meta['cookiejar']},
                                       headers=self.post_headers,
                                       method = "POST",
                                       formdata={
                                          'horizonRelayState': RelayState,
                                          'requestTimeout': '20'
                                       }, 
                                       callback=self.post_login3
                                       )]

   def post_login3(self, response):
      logging.info("Post Login 3 url: %s", response.url);
      #logging.info("Post login 3 response:" + response.text)
    
      protected_state = response.xpath("//input[@id='protected_state']/@value").extract()
      horizonRelayState = response.xpath("//input[@name='horizonRelayState']/@value").extract()
      stickyConnectorId = response.xpath("//input[@name='stickyConnectorId']/@value").extract()

      logging.info("protected_state=%s", protected_state)
      logging.info("horizonRelayState=%s", horizonRelayState)
      logging.info("stickyConnectorId=%s", stickyConnectorId)
      logging.info("Post URL: https://myvmware.workspaceair.com/SAAS/auth/login/embeddedauthbroker/callback")
      # Post sign request
      return [FormRequest.from_response(response,
                                       url='https://myvmware.workspaceair.com/SAAS/auth/login/embeddedauthbroker/callback',
                                       meta = {'cookiejar' : response.meta['cookiejar']},
                                       headers=self.post_headers,
                                       method = "POST",
                                       formdata={
                                          'userstore': 'vmware.com',
                                          'domain': 'vmware.com',
                                          'username': settings.userName,
                                          'password': settings.userPwd,
                                          'userstoreDisplay': 'vmware.com',
                                          'action': 'Sign+in',
                                          'protected_state': protected_state
                                       }, 
                                       callback=self.parse_post_login,
                                       dont_filter=True
                                       )]

   def after_login(self, response):
      cookieData = response.request.headers.getlist('Cookie')
      logging.info("Cookie: " + str(cookieData))
      logging.info("After login Reponse Code: %d", response.status)
      #cookieList = cookieData[0].split('=')
      #cookiesMap = {cookieList[0]:cookieList[1]}
      # Start to grab data


      for url in self.start_urls:
         logging.info("Post url: %s", url)
         yield Request(url,
                       dont_filter=True,
                       meta={'dont_redirect': True,
                             'handle_httpstatus_list': [302],
                              "cookiejar": response.meta["cookiejar"]
                             },
                        #cookies=cookiesMap, 
                        callback=self.parse_post_login,)

 
   def parse_post_login(self, response):
      logging.info("%s response code: %d", response.url, response.status)

      #if (str(response.url).find('catalog-portal') != -1):
      dpmUrl = "https://jira.eng.vmware.com/"
      yield Request(dpmUrl,
                  dont_filter=True,
                  meta={'dont_redirect': True,
                        'handle_httpstatus_list': [302],
                        "cookiejar": response.meta["cookiejar"]
                        },
                  headers=self.post_headers2,
                  callback=self.parse_dpm)

 
   def parse_dpm(self, response):
      logging.info('Start to parge dpm info...')
      #
      logging.info("%s response code: %d", response.url, response.status)
      logging.info(response.text)

 
   
   def getMapValueIfExit(self, keyMap, key):
      if key in keyMap:
         return keyMap[key]
      else:
         return None

   def getPersonUrl(self, personId):
      return self.url + personId

   def getPersonOrgUrl(self, personId):
      return self.url + personId + '/orgHierarchy'