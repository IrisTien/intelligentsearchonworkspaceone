"use strict";angular.module("ngLocale",[],["$provide",function(e){var r="one",i="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],ERANAMES:["BCE","CE"],ERAS:["BCE","CE"],FIRSTDAYOFWEEK:5,MONTH:["جانڤیە","فئڤریە","مارس","آڤریل","مئی","جوٙأن","جوٙلا","آگوست","سئپتامر","ئوکتوڤر","نوڤامر","دئسامر"],SHORTDAY:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],SHORTMONTH:["جانڤیە","فئڤریە","مارس","آڤریل","مئی","جوٙأن","جوٙلا","آگوست","سئپتامر","ئوکتوڤر","نوڤامر","دئسامر"],STANDALONEMONTH:["جانڤیە","فئڤریە","مارس","آڤریل","مئی","جوٙأن","جوٙلا","آگوست","سئپتامر","ئوکتوڤر","نوڤامر","دئسامر"],WEEKENDRANGE:[4,5],fullDate:"y MMMM d, EEEE",longDate:"y MMMM d",medium:"y MMM d h:mm:ss a",mediumDate:"y MMM d",mediumTime:"h:mm:ss a",short:"y-MM-dd h:mm a",shortDate:"y-MM-dd",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"din",DECIMAL_SEP:"٫",GROUP_SEP:"٬",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"lrc-iq",localeID:"lrc_IQ",pluralCat:function(e,M){var a=0|e,n=function(e,M){var a,n,r=M;void 0===r&&(r=Math.min((a=e,-1==(n=(a+="").indexOf("."))?0:a.length-n-1),3));var i=Math.pow(10,r);return{v:r,f:(e*i|0)%i}}(e,M);return 1==a&&0==n.v?r:i}})}]);