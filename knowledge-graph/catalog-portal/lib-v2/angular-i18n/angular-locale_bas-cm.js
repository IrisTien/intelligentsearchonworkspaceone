"use strict";angular.module("ngLocale",[],["$provide",function(m){var a="one",i="other";m.value("$locale",{DATETIME_FORMATS:{AMPMS:["I bikɛ̂glà","I ɓugajɔp"],DAY:["ŋgwà nɔ̂y","ŋgwà njaŋgumba","ŋgwà ûm","ŋgwà ŋgê","ŋgwà mbɔk","ŋgwà kɔɔ","ŋgwà jôn"],ERANAMES:["bisū bi Yesù Krǐstò","i mbūs Yesù Krǐstò"],ERAS:["b.Y.K","m.Y.K"],FIRSTDAYOFWEEK:0,MONTH:["Kɔndɔŋ","Màcɛ̂l","Màtùmb","Màtop","M̀puyɛ","Hìlòndɛ̀","Njèbà","Hìkaŋ","Dìpɔ̀s","Bìòôm","Màyɛsèp","Lìbuy li ńyèe"],SHORTDAY:["nɔy","nja","uum","ŋge","mbɔ","kɔɔ","jon"],SHORTMONTH:["kɔn","mac","mat","mto","mpu","hil","nje","hik","dip","bio","may","liɓ"],STANDALONEMONTH:["Kɔndɔŋ","Màcɛ̂l","Màtùmb","Màtop","M̀puyɛ","Hìlòndɛ̀","Njèbà","Hìkaŋ","Dìpɔ̀s","Bìòôm","Màyɛsèp","Lìbuy li ńyèe"],WEEKENDRANGE:[5,6],fullDate:"EEEE d MMMM y",longDate:"d MMMM y",medium:"d MMM, y HH:mm:ss",mediumDate:"d MMM, y",mediumTime:"HH:mm:ss",short:"d/M/y HH:mm",shortDate:"d/M/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"FCFA",DECIMAL_SEP:",",GROUP_SEP:" ",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"bas-cm",localeID:"bas_CM",pluralCat:function(m,M){var e=0|m,n=function(m,M){var e,n,a=M;void 0===a&&(a=Math.min((e=m,-1==(n=(e+="").indexOf("."))?0:e.length-n-1),3));var i=Math.pow(10,a);return{v:a,f:(m*i|0)%i}}(m,M);return 1==e&&0==n.v?a:i}})}]);