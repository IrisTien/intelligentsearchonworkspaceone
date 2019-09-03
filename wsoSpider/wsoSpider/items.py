# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class WsospiderItem(scrapy.Item):
   # define the fields for your item here like:
   # name = scrapy.Field()
   pass

class IdeaInfoItem(scrapy.Item):
   title = scrapy.Field()
   shortName = scrapy.Field()
   submitter = scrapy.Field()
   teamMembers = scrapy.Field()
   #eventRegistration = scrapy.Field()
   votes = scrapy.Field()
   created = scrapy.Field()
   description = scrapy.Field()
   theme = scrapy.Field()   
   link = scrapy.Field()

class PersonItem(scrapy.Item):
   personId = scrapy.Field()
   employeeNumber = scrapy.Field()
   firstName = scrapy.Field()
   lastName = scrapy.Field()
   emailAddress = scrapy.Field()
   phoneNumber = scrapy.Field()
   title = scrapy.Field()
   address = scrapy.Field()
   imageURL = scrapy.Field()
   mobile = scrapy.Field()
   country = scrapy.Field()
   region = scrapy.Field()
   physicalDeliveryOfficeName = scrapy.Field()
   businessUnit = scrapy.Field()
   managerDN = scrapy.Field()
   distinguishedName = scrapy.Field()
   link = scrapy.Field()
   orgLink = scrapy.Field()

class BuildItem(scrapy.Item):
   # define the fields for your item here like:
   buildId = scrapy.Field()
   link = scrapy.Field()
   branch = scrapy.Field()
   version = scrapy.Field()
   product = scrapy.Field()   
   changeset = scrapy.Field()
   changeset_link = scrapy.Field()
   clog_link = scrapy.Field()
   releaseType = scrapy.Field()


class BuildComponentItem(scrapy.Item):
   buildId = scrapy.Field()
   componentId = scrapy.Field()
   buildType = scrapy.Field()
   product = scrapy.Field()
   kind = scrapy.Field()
   scmserver = scrapy.Field()
   branch = scrapy.Field()
   changeset = scrapy.Field()
   p4web_url = scrapy.Field()

class ChangeListItem(scrapy.Item):
   changelist = scrapy.Field()
   title = scrapy.Field()
   date = scrapy.Field()
   client = scrapy.Field()
   user = scrapy.Field()
   description = scrapy.Field()
   #affectedFiles = scrapy.Field()
   bugNumbers = scrapy.Field()
   reviewedBy = scrapy.Field()
   reviewURL = scrapy.Field()














