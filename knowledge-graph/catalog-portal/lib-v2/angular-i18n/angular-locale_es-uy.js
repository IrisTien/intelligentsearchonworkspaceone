"use strict";angular.module("ngLocale",[],["$provide",function(e){var r="one",m="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["a. m.","p. m."],DAY:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],ERANAMES:["antes de Cristo","después de Cristo"],ERAS:["a. C.","d. C."],FIRSTDAYOFWEEK:0,MONTH:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"],SHORTDAY:["dom.","lun.","mar.","mié.","jue.","vie.","sáb."],SHORTMONTH:["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","set.","oct.","nov.","dic."],STANDALONEMONTH:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d 'de' MMMM 'de' y",longDate:"d 'de' MMMM 'de' y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"d/M/yy HH:mm",shortDate:"d/M/yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"$",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"es-uy",localeID:"es_UY",pluralCat:function(e,o){return 1==e?r:m}})}]);