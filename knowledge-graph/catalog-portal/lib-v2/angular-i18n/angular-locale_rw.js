"use strict";angular.module("ngLocale",[],["$provide",function(a){var r="one",M="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Ku cyumweru","Kuwa mbere","Kuwa kabiri","Kuwa gatatu","Kuwa kane","Kuwa gatanu","Kuwa gatandatu"],ERANAMES:["BCE","CE"],ERAS:["BCE","CE"],FIRSTDAYOFWEEK:0,MONTH:["Mutarama","Gashyantare","Werurwe","Mata","Gicuransi","Kamena","Nyakanga","Kanama","Nzeli","Ukwakira","Ugushyingo","Ukuboza"],SHORTDAY:["cyu.","mbe.","kab.","gtu.","kan.","gnu.","gnd."],SHORTMONTH:["mut.","gas.","wer.","mat.","gic.","kam.","nya.","kan.","nze.","ukw.","ugu.","uku."],STANDALONEMONTH:["Mutarama","Gashyantare","Werurwe","Mata","Gicuransi","Kamena","Nyakanga","Kanama","Nzeli","Ukwakira","Ugushyingo","Ukuboza"],WEEKENDRANGE:[5,6],fullDate:"y MMMM d, EEEE",longDate:"y MMMM d",medium:"y MMM d HH:mm:ss",mediumDate:"y MMM d",mediumTime:"HH:mm:ss",short:"y-MM-dd HH:mm",shortDate:"y-MM-dd",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"RF",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"rw",localeID:"rw",pluralCat:function(a,e){var u=0|a,n=function(a,e){var u,n,r=e;void 0===r&&(r=Math.min((u=a,-1==(n=(u+="").indexOf("."))?0:u.length-n-1),3));var M=Math.pow(10,r);return{v:r,f:(a*M|0)%M}}(a,e);return 1==u&&0==n.v?r:M}})}]);