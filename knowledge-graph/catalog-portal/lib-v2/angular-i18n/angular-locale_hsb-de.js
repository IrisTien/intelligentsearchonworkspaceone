"use strict";angular.module("ngLocale",[],["$provide",function(e){var o="one",m="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["dopołdnja","popołdnju"],DAY:["njedźela","póndźela","wutora","srjeda","štwórtk","pjatk","sobota"],ERANAMES:["před Chrystowym narodźenjom","po Chrystowym narodźenju"],ERAS:["př.Chr.n.","po Chr.n."],FIRSTDAYOFWEEK:0,MONTH:["januara","februara","měrca","apryla","meje","junija","julija","awgusta","septembra","oktobra","nowembra","decembra"],SHORTDAY:["nje","pón","wut","srj","štw","pja","sob"],SHORTMONTH:["jan.","feb.","měr.","apr.","mej.","jun.","jul.","awg.","sep.","okt.","now.","dec."],STANDALONEMONTH:["januar","februar","měrc","apryl","meja","junij","julij","awgust","september","oktober","nowember","december"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d. MMMM y",longDate:"d. MMMM y",medium:"d.M.y H:mm:ss",mediumDate:"d.M.y",mediumTime:"H:mm:ss",short:"d.M.yy H:mm 'hodź'.",shortDate:"d.M.yy",shortTime:"H:mm 'hodź'."},NUMBER_FORMATS:{CURRENCY_SYM:"€",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"hsb-de",localeID:"hsb_DE",pluralCat:function(e,a){var r=0|e,n=function(e,a){var r,n,o=a;void 0===o&&(o=Math.min((r=e,-1==(n=(r+="").indexOf("."))?0:r.length-n-1),3));var m=Math.pow(10,o);return{v:o,f:(e*m|0)%m}}(e,a);return 1==r&&0==n.v?o:m}})}]);