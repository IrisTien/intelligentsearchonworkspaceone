"use strict";angular.module("ngLocale",[],["$provide",function(e){var n="one",i="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["ꕞꕌꔵ","ꗳꗡꘉ","ꕚꕞꕚ","ꕉꕞꕒ","ꕉꔤꕆꕢ","ꕉꔤꕀꕮ","ꔻꔬꔳ"],ERANAMES:["BCE","CE"],ERAS:["BCE","CE"],FIRSTDAYOFWEEK:0,MONTH:["ꖨꕪꖃ ꔞꕮ","ꕒꕡꖝꖕ","ꕾꖺ","ꖢꖕ","ꖑꕱ","6","7","ꗛꔕ","ꕢꕌ","ꕭꖃ","ꔞꘋꕔꕿ ꕸꖃꗏ","ꖨꕪꕱ ꗏꕮ"],SHORTDAY:["ꕞꕌꔵ","ꗳꗡꘉ","ꕚꕞꕚ","ꕉꕞꕒ","ꕉꔤꕆꕢ","ꕉꔤꕀꕮ","ꔻꔬꔳ"],SHORTMONTH:["ꖨꕪꖃ ꔞꕮ","ꕒꕡꖝꖕ","ꕾꖺ","ꖢꖕ","ꖑꕱ","6","7","ꗛꔕ","ꕢꕌ","ꕭꖃ","ꔞꘋꕔꕿ ꕸꖃꗏ","ꖨꕪꕱ ꗏꕮ"],STANDALONEMONTH:["ꖨꕪꖃ ꔞꕮ","ꕒꕡꖝꖕ","ꕾꖺ","ꖢꖕ","ꖑꕱ","6","7","ꗛꔕ","ꕢꕌ","ꕭꖃ","ꔞꘋꕔꕿ ꕸꖃꗏ","ꖨꕪꕱ ꗏꕮ"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d MMMM y",longDate:"d MMMM y",medium:"d MMM y h:mm:ss a",mediumDate:"d MMM y",mediumTime:"h:mm:ss a",short:"dd/MM/y h:mm a",shortDate:"dd/MM/y",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"$",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"vai",localeID:"vai",pluralCat:function(e,M){var a=0|e,E=function(e,M){var a,E,n=M;void 0===n&&(n=Math.min((a=e,-1==(E=(a+="").indexOf("."))?0:a.length-E-1),3));var i=Math.pow(10,n);return{v:n,f:(e*i|0)%i}}(e,M);return 1==a&&0==E.v?n:i}})}]);