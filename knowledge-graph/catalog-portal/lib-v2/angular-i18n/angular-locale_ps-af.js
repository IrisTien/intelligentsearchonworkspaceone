"use strict";angular.module("ngLocale",[],["$provide",function(e){var m="one",r="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["غ.م.","غ.و."],DAY:["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],ERANAMES:["له میلاد څخه وړاندې","له میلاد څخه وروسته"],ERAS:["له میلاد وړاندې","م."],FIRSTDAYOFWEEK:5,MONTH:["جنوري","فبروري","مارچ","اپریل","مۍ","جون","جولای","اګست","سپتمبر","اکتوبر","نومبر","دسمبر"],SHORTDAY:["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],SHORTMONTH:["جنوري","فبروري","مارچ","اپریل","مۍ","جون","جولای","اګست","سپتمبر","اکتوبر","نومبر","دسمبر"],STANDALONEMONTH:["جنوري","فبروري","مارچ","اپریل","مۍ","جون","جولای","اګست","سپتمبر","اکتوبر","نومبر","دسمبر"],WEEKENDRANGE:[3,4],fullDate:"EEEE د y د MMMM d",longDate:"د y د MMMM d",medium:"y MMM d H:mm:ss",mediumDate:"y MMM d",mediumTime:"H:mm:ss",short:"y/M/d H:mm",shortDate:"y/M/d",shortTime:"H:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"Af.",DECIMAL_SEP:"٫",GROUP_SEP:"٬",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"ps-af",localeID:"ps_AF",pluralCat:function(e,M){var a=0|e,n=function(e,M){var a,n,m=M;void 0===m&&(m=Math.min((a=e,-1==(n=(a+="").indexOf("."))?0:a.length-n-1),3));var r=Math.pow(10,m);return{v:m,f:(e*r|0)%r}}(e,M);return 1==a&&0==n.v?m:r}})}]);