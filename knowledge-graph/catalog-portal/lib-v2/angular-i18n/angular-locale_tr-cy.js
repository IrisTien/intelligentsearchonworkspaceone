"use strict";angular.module("ngLocale",[],["$provide",function(a){var M="one",m="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["ÖÖ","ÖS"],DAY:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],ERANAMES:["Milattan Önce","Milattan Sonra"],ERAS:["MÖ","MS"],FIRSTDAYOFWEEK:0,MONTH:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],SHORTDAY:["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"],SHORTMONTH:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],STANDALONEMONTH:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],WEEKENDRANGE:[5,6],fullDate:"d MMMM y EEEE",longDate:"d MMMM y",medium:"d MMM y h:mm:ss a",mediumDate:"d MMM y",mediumTime:"h:mm:ss a",short:"d.MM.y h:mm a",shortDate:"d.MM.y",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"€",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"tr-cy",localeID:"tr_CY",pluralCat:function(a,e){return 1==a?M:m}})}]);