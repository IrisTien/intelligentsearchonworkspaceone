"use strict";angular.module("ngLocale",[],["$provide",function(a){var o="one",M="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["Munkyo","Eigulo"],DAY:["Sabiiti","Balaza","Owokubili","Owokusatu","Olokuna","Olokutaanu","Olomukaaga"],ERANAMES:["Kulisto nga azilawo","Kulisto nga affile"],ERAS:["AZ","AF"],FIRSTDAYOFWEEK:0,MONTH:["Janwaliyo","Febwaliyo","Marisi","Apuli","Maayi","Juuni","Julaayi","Agusito","Sebuttemba","Okitobba","Novemba","Desemba"],SHORTDAY:["Sabi","Bala","Kubi","Kusa","Kuna","Kuta","Muka"],SHORTMONTH:["Jan","Feb","Mar","Apu","Maa","Juu","Jul","Agu","Seb","Oki","Nov","Des"],STANDALONEMONTH:["Janwaliyo","Febwaliyo","Marisi","Apuli","Maayi","Juuni","Julaayi","Agusito","Sebuttemba","Okitobba","Novemba","Desemba"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d MMMM y",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"dd/MM/y HH:mm",shortDate:"dd/MM/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"UGX",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"xog",localeID:"xog",pluralCat:function(a,i){var u=0|a,e=function(a,i){var u,e,o=i;void 0===o&&(o=Math.min((u=a,-1==(e=(u+="").indexOf("."))?0:u.length-e-1),3));var M=Math.pow(10,o);return{v:o,f:(a*M|0)%M}}(a,i);return 1==u&&0==e.v?o:M}})}]);