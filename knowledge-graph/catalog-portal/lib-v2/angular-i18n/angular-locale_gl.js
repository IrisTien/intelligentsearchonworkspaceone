"use strict";angular.module("ngLocale",[],["$provide",function(e){var m="one",n="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["a.m.","p.m."],DAY:["domingo","luns","martes","mércores","xoves","venres","sábado"],ERANAMES:["antes de Cristo","despois de Cristo"],ERAS:["a.C.","d.C."],FIRSTDAYOFWEEK:0,MONTH:["xaneiro","febreiro","marzo","abril","maio","xuño","xullo","agosto","setembro","outubro","novembro","decembro"],SHORTDAY:["dom.","luns","mar.","mér.","xov.","ven.","sáb."],SHORTMONTH:["xan.","feb.","mar.","abr.","maio","xuño","xul.","ago.","set.","out.","nov.","dec."],STANDALONEMONTH:["Xaneiro","Febreiro","Marzo","Abril","Maio","Xuño","Xullo","Agosto","Setembro","Outubro","Novembro","Decembro"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d 'de' MMMM 'de' y",longDate:"d 'de' MMMM 'de' y",medium:"d 'de' MMM 'de' y HH:mm:ss",mediumDate:"d 'de' MMM 'de' y",mediumTime:"HH:mm:ss",short:"dd/MM/yy HH:mm",shortDate:"dd/MM/yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"€",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"gl",localeID:"gl",pluralCat:function(e,o){var r=0|e,a=function(e,o){var r,a,m=o;void 0===m&&(m=Math.min((r=e,-1==(a=(r+="").indexOf("."))?0:r.length-a-1),3));var n=Math.pow(10,m);return{v:m,f:(e*n|0)%n}}(e,o);return 1==r&&0==a.v?m:n}})}]);