"use strict";angular.module("ngLocale",[],["$provide",function(e){var a="one",m="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"],ERANAMES:["খ্রিস্টপূর্ব","খৃষ্টাব্দ"],ERAS:["খ্রিস্টপূর্ব","খৃষ্টাব্দ"],FIRSTDAYOFWEEK:4,MONTH:["জানুয়ারী","ফেব্রুয়ারী","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"],SHORTDAY:["রবি","সোম","মঙ্গল","বুধ","বৃহস্পতি","শুক্র","শনি"],SHORTMONTH:["জানু","ফেব","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"],STANDALONEMONTH:["জানুয়ারী","ফেব্রুয়ারী","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"],WEEKENDRANGE:[5,6],fullDate:"EEEE, d MMMM, y",longDate:"d MMMM, y",medium:"d MMM, y h:mm:ss a",mediumDate:"d MMM, y",mediumTime:"h:mm:ss a",short:"d/M/yy h:mm a",shortDate:"d/M/yy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"৳",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:2,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:2,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:"¤",posPre:"",posSuf:"¤"}]},id:"bn",localeID:"bn",pluralCat:function(e,M){return 0==(0|e)||1==e?a:m}})}]);