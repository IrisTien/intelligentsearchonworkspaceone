"use strict";angular.module("ngLocale",[],["$provide",function(i){var r="one",s="few",o="many",n="other";i.value("$locale",{DATETIME_FORMATS:{AMPMS:["priešpiet","popiet"],DAY:["sekmadienis","pirmadienis","antradienis","trečiadienis","ketvirtadienis","penktadienis","šeštadienis"],ERANAMES:["prieš Kristų","po Kristaus"],ERAS:["pr. Kr.","po Kr."],FIRSTDAYOFWEEK:0,MONTH:["sausio","vasario","kovo","balandžio","gegužės","birželio","liepos","rugpjūčio","rugsėjo","spalio","lapkričio","gruodžio"],SHORTDAY:["sk","pr","an","tr","kt","pn","št"],SHORTMONTH:["saus.","vas.","kov.","bal.","geg.","birž.","liep.","rugp.","rugs.","spal.","lapkr.","gruod."],STANDALONEMONTH:["sausis","vasaris","kovas","balandis","gegužė","birželis","liepa","rugpjūtis","rugsėjis","spalis","lapkritis","gruodis"],WEEKENDRANGE:[5,6],fullDate:"y 'm'. MMMM d 'd'., EEEE",longDate:"y 'm'. MMMM d 'd'.",medium:"y-MM-dd HH:mm:ss",mediumDate:"y-MM-dd",mediumTime:"HH:mm:ss",short:"y-MM-dd HH:mm",shortDate:"y-MM-dd",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"€",DECIMAL_SEP:",",GROUP_SEP:" ",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"lt-lt",localeID:"lt_LT",pluralCat:function(i,e){var a=function(i,e){var a,r,s=e;void 0===s&&(s=Math.min((a=i,-1==(r=(a+="").indexOf("."))?0:a.length-r-1),3));var o=Math.pow(10,s);return{v:s,f:(i*o|0)%o}}(i,e);return i%10==1&&(i%100<11||19<i%100)?r:2<=i%10&&i%10<=9&&(i%100<11||19<i%100)?s:0!=a.f?o:n}})}]);