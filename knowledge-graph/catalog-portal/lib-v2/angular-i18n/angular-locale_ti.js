"use strict";angular.module("ngLocale",[],["$provide",function(e){var i="one",n="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["ንጉሆ ሰዓተ","ድሕር ሰዓት"],DAY:["ሰንበት","ሰኑይ","ሠሉስ","ረቡዕ","ኃሙስ","ዓርቢ","ቀዳም"],ERANAMES:["ዓ/ዓ","ዓመተ ምህረት"],ERAS:["ዓ/ዓ","ዓ/ም"],FIRSTDAYOFWEEK:6,MONTH:["ጥሪ","ለካቲት","መጋቢት","ሚያዝያ","ግንቦት","ሰነ","ሓምለ","ነሓሰ","መስከረም","ጥቅምቲ","ሕዳር","ታሕሳስ"],SHORTDAY:["ሰን","ሰኑ","ሰሉ","ረቡ","ሓሙ","ዓር","ቀዳ"],SHORTMONTH:["ጥሪ","ለካ","መጋ","ሚያ","ግን","ሰነ","ሓም","ነሓ","መስ","ጥቅ","ሕዳ","ታሕ"],STANDALONEMONTH:["ጥሪ","ለካቲት","መጋቢት","ሚያዝያ","ግንቦት","ሰነ","ሓምለ","ነሓሰ","መስከረም","ጥቅምቲ","ሕዳር","ታሕሳስ"],WEEKENDRANGE:[5,6],fullDate:"EEEE፣ dd MMMM መዓልቲ y G",longDate:"dd MMMM y",medium:"dd-MMM-y h:mm:ss a",mediumDate:"dd-MMM-y",mediumTime:"h:mm:ss a",short:"dd/MM/yy h:mm a",shortDate:"dd/MM/yy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"Birr",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"ti",localeID:"ti",pluralCat:function(e,M){var a=0|e,r=function(e,M){var a,r,i=M;void 0===i&&(i=Math.min((a=e,-1==(r=(a+="").indexOf("."))?0:a.length-r-1),3));var n=Math.pow(10,i);return{v:i,f:(e*n|0)%n}}(e,M);return 1==a&&0==r.v?i:n}})}]);