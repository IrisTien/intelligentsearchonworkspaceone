"use strict";angular.module("ngLocale",[],["$provide",function(a){var n="one",m="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["Taparachu","Ebongi"],DAY:["Nakaejuma","Nakaebarasa","Nakaare","Nakauni","Nakaung’on","Nakakany","Nakasabiti"],ERANAMES:["Kabla ya Christo","Baada ya Christo"],ERAS:["KK","BK"],FIRSTDAYOFWEEK:0,MONTH:["Orara","Omuk","Okwamg’","Odung’el","Omaruk","Omodok’king’ol","Ojola","Opedel","Osokosokoma","Otibar","Olabor","Opoo"],SHORTDAY:["Jum","Bar","Aar","Uni","Ung","Kan","Sab"],SHORTMONTH:["Rar","Muk","Kwa","Dun","Mar","Mod","Jol","Ped","Sok","Tib","Lab","Poo"],STANDALONEMONTH:["Orara","Omuk","Okwamg’","Odung’el","Omaruk","Omodok’king’ol","Ojola","Opedel","Osokosokoma","Otibar","Olabor","Opoo"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d MMMM y",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"dd/MM/y HH:mm",shortDate:"dd/MM/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"UGX",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:0,minFrac:0,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"teo-ug",localeID:"teo_UG",pluralCat:function(a,o){var e=0|a,r=function(a,o){var e,r,n=o;void 0===n&&(n=Math.min((e=a,-1==(r=(e+="").indexOf("."))?0:e.length-r-1),3));var m=Math.pow(10,n);return{v:n,f:(a*m|0)%m}}(a,o);return 1==e&&0==r.v?n:m}})}]);