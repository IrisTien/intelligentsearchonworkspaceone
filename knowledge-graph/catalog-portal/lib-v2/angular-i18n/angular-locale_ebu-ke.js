"use strict";angular.module("ngLocale",[],["$provide",function(a){var r="one",w="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["KI","UT"],DAY:["Kiumia","Njumatatu","Njumaine","Njumatano","Aramithi","Njumaa","NJumamothii"],ERANAMES:["Mbere ya Kristo","Thutha wa Kristo"],ERAS:["MK","TK"],FIRSTDAYOFWEEK:6,MONTH:["Mweri wa mbere","Mweri wa kaĩri","Mweri wa kathatũ","Mweri wa kana","Mweri wa gatano","Mweri wa gatantatũ","Mweri wa mũgwanja","Mweri wa kanana","Mweri wa kenda","Mweri wa ikũmi","Mweri wa ikũmi na ũmwe","Mweri wa ikũmi na Kaĩrĩ"],SHORTDAY:["Kma","Tat","Ine","Tan","Arm","Maa","NMM"],SHORTMONTH:["Mbe","Kai","Kat","Kan","Gat","Gan","Mug","Knn","Ken","Iku","Imw","Igi"],STANDALONEMONTH:["Mweri wa mbere","Mweri wa kaĩri","Mweri wa kathatũ","Mweri wa kana","Mweri wa gatano","Mweri wa gatantatũ","Mweri wa mũgwanja","Mweri wa kanana","Mweri wa kenda","Mweri wa ikũmi","Mweri wa ikũmi na ũmwe","Mweri wa ikũmi na Kaĩrĩ"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d MMMM y",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"dd/MM/y HH:mm",shortDate:"dd/MM/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"Ksh",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"ebu-ke",localeID:"ebu_KE",pluralCat:function(a,e){var i=0|a,M=function(a,e){var i,M,r=e;void 0===r&&(r=Math.min((i=a,-1==(M=(i+="").indexOf("."))?0:i.length-M-1),3));var w=Math.pow(10,r);return{v:r,f:(a*w|0)%w}}(a,e);return 1==i&&0==M.v?r:w}})}]);