# prase the result from
#
#
# http://buildweb.eng.vmware.com/ob/api/legacy/builds_search/?branch=bfg-main

import scrapy
import sys
from scrapy.spiders import XMLFeedSpider
from wsoSpider.items import BuildItem
from wsoSpider import settings


class BuildInfoSpider(XMLFeedSpider):
   name = "BuildInfoSpider"
   allowed_domains = "eng.vmware.com"
   start_urls = [
       "http://buildapi.eng.vmware.com/ob/build/?product=hcmac&branch=cart-20fq3&buildstate=succeeded"] # set count to 1 for debugging
   itertag = 'product'

   def parse_node(self, response, node):
      logging.info(response.text)
      item = OfficalBuildItem()
      self.add_if_not_none(item, 'build_num',
                           node.xpath("@build_num").extract()[0])
      self.add_if_not_none(item, 'name',
                           node.xpath("@name").extract()[0])
      self.add_if_not_none(item, 'branch',
                           node.xpath("@branch").extract()[0])
      self.add_if_not_none(item, 'make_target',
                           node.xpath("@make_target").extract()[0])
      self.add_if_not_none(item, 'release_type',
                           node.xpath("@release_type").extract()[0])
      self.add_if_not_none(item, 'change',
                           node.xpath("@change").extract()[0])
      self.add_if_not_none(item, 'start_date',
                           node.xpath("@start_date").extract()[0])
      self.add_if_not_none(item, 'end_time',
                           node.xpath("@end_time").extract()[0])
      self.add_if_not_none(item, 'build_tree',
                           node.xpath("@build_tree").extract()[0])
      self.add_if_not_none(item, 'ondisk',
                           node.xpath("@ondisk").extract()[0])
      self.add_if_not_none(item, 'change',
                           node.xpath("@change").extract()[0])

      build_machine = set()
      downloads = node.xpath('//file/@url')
      for url in downloads.extract():
         # print url
         if "compcache" in url and url.endswith('manifest.xml'):
            build_machine.add(url.split('/')[-2])
      # print build_machine
      item['file_urls'] = []
      for machine in build_machine:
         item['file_urls'].append('http://build-squid.eng.vmware.com' + item['build_tree']
                            + '/logs/' + machine + '/gobuilds.log')
      yield item

   def add_if_not_none(self, dict_item, key, value):
      if value is not None:
         dict_item[key] = value
