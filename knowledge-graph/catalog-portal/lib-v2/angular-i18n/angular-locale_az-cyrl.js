"use strict";angular.module("ngLocale",[],["$provide",function(e){var m="one",E="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["АМ","ПМ"],DAY:["базар","базар ертәси","чәршәнбә ахшамы","чәршәнбә","ҹүмә ахшамы","ҹүмә","шәнбә"],ERANAMES:["ерамыздан әввәл","јени ера"],ERAS:["е.ә.","ј.е."],FIRSTDAYOFWEEK:0,MONTH:["јанвар","феврал","март","апрел","май","ијун","ијул","август","сентјабр","октјабр","нојабр","декабр"],SHORTDAY:["Б.","Б.Е.","Ч.А.","Ч.","Ҹ.А.","Ҹ.","Ш."],SHORTMONTH:["јан","фев","мар","апр","май","ијн","ијл","авг","сен","окт","ној","дек"],STANDALONEMONTH:["Јанвар","Феврал","Март","Апрел","Май","Ијун","Ијул","Август","Сентјабр","Октјабр","Нојабр","Декабр"],WEEKENDRANGE:[5,6],fullDate:"d MMMM y, EEEE",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",mediumTime:"HH:mm:ss",short:"dd.MM.yy HH:mm",shortDate:"dd.MM.yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"₼",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"az-cyrl",localeID:"az_Cyrl",pluralCat:function(e,M){return 1==e?m:E}})}]);