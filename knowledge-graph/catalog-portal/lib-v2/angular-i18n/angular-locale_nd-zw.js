"use strict";angular.module("ngLocale",[],["$provide",function(a){var n="one",l="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Sonto","Mvulo","Sibili","Sithathu","Sine","Sihlanu","Mgqibelo"],ERANAMES:["UKristo angakabuyi","Ukristo ebuyile"],ERAS:["BC","AD"],FIRSTDAYOFWEEK:6,MONTH:["Zibandlela","Nhlolanja","Mbimbitho","Mabasa","Nkwenkwezi","Nhlangula","Ntulikazi","Ncwabakazi","Mpandula","Mfumfu","Lwezi","Mpalakazi"],SHORTDAY:["Son","Mvu","Sib","Sit","Sin","Sih","Mgq"],SHORTMONTH:["Zib","Nhlo","Mbi","Mab","Nkw","Nhla","Ntu","Ncw","Mpan","Mfu","Lwe","Mpal"],STANDALONEMONTH:["Zibandlela","Nhlolanja","Mbimbitho","Mabasa","Nkwenkwezi","Nhlangula","Ntulikazi","Ncwabakazi","Mpandula","Mfumfu","Lwezi","Mpalakazi"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d MMMM y",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"dd/MM/y HH:mm",shortDate:"dd/MM/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"$",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"nd-zw",localeID:"nd_ZW",pluralCat:function(a,i){var M=0|a,e=function(a,i){var M,e,n=i;void 0===n&&(n=Math.min((M=a,-1==(e=(M+="").indexOf("."))?0:M.length-e-1),3));var l=Math.pow(10,n);return{v:n,f:(a*l|0)%l}}(a,i);return 1==M&&0==e.v?n:l}})}]);