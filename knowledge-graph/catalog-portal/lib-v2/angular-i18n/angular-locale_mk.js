"use strict";angular.module("ngLocale",[],["$provide",function(e){var a="one",r="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["претпладне","попладне"],DAY:["недела","понеделник","вторник","среда","четврток","петок","сабота"],ERANAMES:["пред нашата ера","од нашата ера"],ERAS:["пр.н.е.","н.е."],FIRSTDAYOFWEEK:0,MONTH:["јануари","февруари","март","април","мај","јуни","јули","август","септември","октомври","ноември","декември"],SHORTDAY:["нед.","пон.","вт.","сре.","чет.","пет.","саб."],SHORTMONTH:["јан.","фев.","мар.","апр.","мај","јун.","јул.","авг.","септ.","окт.","ноем.","дек."],STANDALONEMONTH:["јануари","февруари","март","април","мај","јуни","јули","август","септември","октомври","ноември","декември"],WEEKENDRANGE:[5,6],fullDate:"EEEE, dd MMMM y",longDate:"dd MMMM y",medium:"dd.M.y HH:mm:ss",mediumDate:"dd.M.y",mediumTime:"HH:mm:ss",short:"dd.M.yy HH:mm",shortDate:"dd.M.yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"din",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"mk",localeID:"mk",pluralCat:function(e,m){var n=0|e,M=function(e,m){var n,M,a=m;void 0===a&&(a=Math.min((n=e,-1==(M=(n+="").indexOf("."))?0:n.length-M-1),3));var r=Math.pow(10,a);return{v:a,f:(e*r|0)%r}}(e,m);return 0==M.v&&n%10==1||M.f%10==1?a:r}})}]);