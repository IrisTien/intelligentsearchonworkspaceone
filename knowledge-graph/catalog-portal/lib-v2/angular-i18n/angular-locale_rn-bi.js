"use strict";angular.module("ngLocale",[],["$provide",function(a){var r="one",M="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["Z.MU.","Z.MW."],DAY:["Ku w’indwi","Ku wa mbere","Ku wa kabiri","Ku wa gatatu","Ku wa kane","Ku wa gatanu","Ku wa gatandatu"],ERANAMES:["Mbere ya Yezu","Nyuma ya Yezu"],ERAS:["Mb.Y.","Ny.Y"],FIRSTDAYOFWEEK:0,MONTH:["Nzero","Ruhuhuma","Ntwarante","Ndamukiza","Rusama","Ruheshi","Mukakaro","Nyandagaro","Nyakanga","Gitugutu","Munyonyo","Kigarama"],SHORTDAY:["cu.","mbe.","kab.","gtu.","kan.","gnu.","gnd."],SHORTMONTH:["Mut.","Gas.","Wer.","Mat.","Gic.","Kam.","Nya.","Kan.","Nze.","Ukw.","Ugu.","Uku."],STANDALONEMONTH:["Nzero","Ruhuhuma","Ntwarante","Ndamukiza","Rusama","Ruheshi","Mukakaro","Nyandagaro","Nyakanga","Gitugutu","Munyonyo","Kigarama"],WEEKENDRANGE:[5,6],fullDate:"EEEE d MMMM y",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"d/M/y HH:mm",shortDate:"d/M/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"FBu",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-",negSuf:"¤",posPre:"",posSuf:"¤"}]},id:"rn-bi",localeID:"rn_BI",pluralCat:function(a,u){var e=0|a,n=function(a,u){var e,n,r=u;void 0===r&&(r=Math.min((e=a,-1==(n=(e+="").indexOf("."))?0:e.length-n-1),3));var M=Math.pow(10,r);return{v:r,f:(a*M|0)%M}}(a,u);return 1==e&&0==n.v?r:M}})}]);