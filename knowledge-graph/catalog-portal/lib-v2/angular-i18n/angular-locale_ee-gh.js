"use strict";angular.module("ngLocale",[],["$provide",function(a){var i="one",o="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["ŋdi","ɣetrɔ"],DAY:["kɔsiɖa","dzoɖa","blaɖa","kuɖa","yawoɖa","fiɖa","memleɖa"],ERANAMES:["Hafi Yesu Va Do ŋgɔ","Yesu Ŋɔli"],ERAS:["hY","Yŋ"],FIRSTDAYOFWEEK:0,MONTH:["dzove","dzodze","tedoxe","afɔfĩe","dama","masa","siamlɔm","deasiamime","anyɔnyɔ","kele","adeɛmekpɔxe","dzome"],SHORTDAY:["kɔs","dzo","bla","kuɖ","yaw","fiɖ","mem"],SHORTMONTH:["dzv","dzd","ted","afɔ","dam","mas","sia","dea","any","kel","ade","dzm"],STANDALONEMONTH:["dzove","dzodze","tedoxe","afɔfĩe","dama","masa","siamlɔm","deasiamime","anyɔnyɔ","kele","adeɛmekpɔxe","dzome"],WEEKENDRANGE:[5,6],fullDate:"EEEE, MMMM d 'lia' y",longDate:"MMMM d 'lia' y",medium:"MMM d 'lia', y a 'ga' h:mm:ss",mediumDate:"MMM d 'lia', y",mediumTime:"a 'ga' h:mm:ss",short:"M/d/yy a 'ga' h:mm",shortDate:"M/d/yy",shortTime:"a 'ga' h:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"GHS",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"ee-gh",localeID:"ee_GH",pluralCat:function(a,e){var m=0|a,d=function(a,e){var m,d,i=e;void 0===i&&(i=Math.min((m=a,-1==(d=(m+="").indexOf("."))?0:m.length-d-1),3));var o=Math.pow(10,i);return{v:i,f:(a*o|0)%o}}(a,e);return 1==m&&0==d.v?i:o}})}]);