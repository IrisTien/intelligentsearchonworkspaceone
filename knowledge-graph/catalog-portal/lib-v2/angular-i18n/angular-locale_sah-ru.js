"use strict";angular.module("ngLocale",[],["$provide",function(e){var r="one",m="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["ЭИ","ЭК"],DAY:["баскыһыанньа","бэнидиэнньик","оптуорунньук","сэрэдэ","чэппиэр","Бээтиҥсэ","субуота"],ERANAMES:["б. э. и.","б. э"],ERAS:["б. э. и.","б. э"],FIRSTDAYOFWEEK:0,MONTH:["Тохсунньу","Олунньу","Кулун тутар","Муус устар","Ыам ыйын","Бэс ыйын","От ыйын","Атырдьых ыйын","Балаҕан ыйын","Алтынньы","Сэтинньи","ахсынньы"],SHORTDAY:["бс","бн","оп","сэ","чп","бэ","сб"],SHORTMONTH:["Тохс","Олун","Клн","Мсу","Ыам","Бэс","Отй","Атр","Блҕ","Алт","Сэт","Ахс"],STANDALONEMONTH:["тохсунньу","олунньу","кулун тутар","муус устар","ыам ыйа","бэс ыйа","от ыйа","атырдьых ыйа","балаҕан ыйа","алтынньы","сэтинньи","ахсынньы"],WEEKENDRANGE:[5,6],fullDate:"y 'сыл' MMMM d 'күнэ', EEEE",longDate:"y, MMMM d",medium:"y, MMM d HH:mm:ss",mediumDate:"y, MMM d",mediumTime:"HH:mm:ss",short:"yy/M/d HH:mm",shortDate:"yy/M/d",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"₽",DECIMAL_SEP:",",GROUP_SEP:" ",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"sah-ru",localeID:"sah_RU",pluralCat:function(e,M){var a=0|e,n=function(e,M){var a,n,r=M;void 0===r&&(r=Math.min((a=e,-1==(n=(a+="").indexOf("."))?0:a.length-n-1),3));var m=Math.pow(10,r);return{v:r,f:(e*m|0)%m}}(e,M);return 1==a&&0==n.v?r:m}})}]);