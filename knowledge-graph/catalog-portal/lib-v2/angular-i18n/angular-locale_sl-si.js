"use strict";angular.module("ngLocale",[],["$provide",function(e){var t="one",n="two",m="few",u="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["dop.","pop."],DAY:["nedelja","ponedeljek","torek","sreda","četrtek","petek","sobota"],ERANAMES:["pred Kristusom","po Kristusu"],ERAS:["pr. Kr.","po Kr."],FIRSTDAYOFWEEK:0,MONTH:["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"],SHORTDAY:["ned.","pon.","tor.","sre.","čet.","pet.","sob."],SHORTMONTH:["jan.","feb.","mar.","apr.","maj","jun.","jul.","avg.","sep.","okt.","nov.","dec."],STANDALONEMONTH:["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"],WEEKENDRANGE:[5,6],fullDate:"EEEE, dd. MMMM y",longDate:"dd. MMMM y",medium:"d. MMM y HH:mm:ss",mediumDate:"d. MMM y",mediumTime:"HH:mm:ss",short:"d. MM. yy HH:mm",shortDate:"d. MM. yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"€",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"sl-si",localeID:"sl_SI",pluralCat:function(e,r){var a=0|e,o=function(e,r){var a,o,t=r;void 0===t&&(t=Math.min((a=e,-1==(o=(a+="").indexOf("."))?0:a.length-o-1),3));var n=Math.pow(10,t);return{v:t,f:(e*n|0)%n}}(e,r);return 0==o.v&&a%100==1?t:0==o.v&&a%100==2?n:0==o.v&&3<=a%100&&a%100<=4||0!=o.v?m:u}})}]);