"use strict";angular.module("ngLocale",[],["$provide",function(a){var M="one",m="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Alahady","Alatsinainy","Talata","Alarobia","Alakamisy","Zoma","Asabotsy"],ERANAMES:["Alohan’i JK","Aorian’i JK"],ERAS:["BC","AD"],FIRSTDAYOFWEEK:0,MONTH:["Janoary","Febroary","Martsa","Aprily","Mey","Jona","Jolay","Aogositra","Septambra","Oktobra","Novambra","Desambra"],SHORTDAY:["Alah","Alats","Tal","Alar","Alak","Zom","Asab"],SHORTMONTH:["Jan","Feb","Mar","Apr","Mey","Jon","Jol","Aog","Sep","Okt","Nov","Des"],STANDALONEMONTH:["Janoary","Febroary","Martsa","Aprily","Mey","Jona","Jolay","Aogositra","Septambra","Oktobra","Novambra","Desambra"],WEEKENDRANGE:[5,6],fullDate:"EEEE d MMMM y",longDate:"d MMMM y",medium:"y MMM d HH:mm:ss",mediumDate:"y MMM d",mediumTime:"HH:mm:ss",short:"y-MM-dd HH:mm",shortDate:"y-MM-dd",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"Ar",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"mg-mg",localeID:"mg_MG",pluralCat:function(a,r){var e=0|a,o=function(a,r){var e,o,M=r;void 0===M&&(M=Math.min((e=a,-1==(o=(e+="").indexOf("."))?0:e.length-o-1),3));var m=Math.pow(10,M);return{v:M,f:(a*m|0)%m}}(a,r);return 1==e&&0==o.v?M:m}})}]);