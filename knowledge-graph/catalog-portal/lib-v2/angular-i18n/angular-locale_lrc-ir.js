"use strict";angular.module("ngLocale",[],["$provide",function(e){var a="one",i="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],ERANAMES:["BCE","CE"],ERAS:["BCE","CE"],FIRSTDAYOFWEEK:5,MONTH:["جانڤیە","فئڤریە","مارس","آڤریل","مئی","جوٙأن","جوٙلا","آگوست","سئپتامر","ئوکتوڤر","نوڤامر","دئسامر"],SHORTDAY:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],SHORTMONTH:["جانڤیە","فئڤریە","مارس","آڤریل","مئی","جوٙأن","جوٙلا","آگوست","سئپتامر","ئوکتوڤر","نوڤامر","دئسامر"],STANDALONEMONTH:["جانڤیە","فئڤریە","مارس","آڤریل","مئی","جوٙأن","جوٙلا","آگوست","سئپتامر","ئوکتوڤر","نوڤامر","دئسامر"],WEEKENDRANGE:[4,4],fullDate:"y MMMM d, EEEE",longDate:"y MMMM d",medium:"y MMM d HH:mm:ss",mediumDate:"y MMM d",mediumTime:"HH:mm:ss",short:"y-MM-dd HH:mm",shortDate:"y-MM-dd",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"Rial",DECIMAL_SEP:"٫",GROUP_SEP:"٬",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"lrc-ir",localeID:"lrc_IR",pluralCat:function(e,M){var n=0|e,r=function(e,M){var n,r,a=M;void 0===a&&(a=Math.min((n=e,-1==(r=(n+="").indexOf("."))?0:n.length-r-1),3));var i=Math.pow(10,a);return{v:a,f:(e*i|0)%i}}(e,M);return 1==n&&0==r.v?a:i}})}]);