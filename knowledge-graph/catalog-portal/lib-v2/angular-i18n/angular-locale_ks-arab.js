"use strict";angular.module("ngLocale",[],["$provide",function(e){var n="one",m="other";e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["اَتھوار","ژٔنٛدرٕروار","بوٚموار","بودوار","برٛٮ۪سوار","جُمہ","بٹوار"],ERANAMES:["قبٕل مسیٖح","عیٖسوی سنہٕ"],ERAS:["بی سی","اے ڈی"],FIRSTDAYOFWEEK:6,MONTH:["جنؤری","فرؤری","مارٕچ","اپریل","میٔ","جوٗن","جوٗلایی","اگست","ستمبر","اکتوٗبر","نومبر","دسمبر"],SHORTDAY:["آتھوار","ژٔنٛدٕروار","بوٚموار","بودوار","برٛٮ۪سوار","جُمہ","بٹوار"],SHORTMONTH:["جنؤری","فرؤری","مارٕچ","اپریل","میٔ","جوٗن","جوٗلایی","اگست","ستمبر","اکتوٗبر","نومبر","دسمبر"],STANDALONEMONTH:["جنؤری","فرؤری","مارٕچ","اپریل","میٔ","جوٗن","جوٗلایی","اگست","ستمبر","اکتوٗبر","نومبر","دسمبر"],WEEKENDRANGE:[6,6],fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",medium:"MMM d, y h:mm:ss a",mediumDate:"MMM d, y",mediumTime:"h:mm:ss a",short:"M/d/yy h:mm a",shortDate:"M/d/yy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"₹",DECIMAL_SEP:"٫",GROUP_SEP:"٬",PATTERNS:[{gSize:2,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:2,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤ ",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"ks-arab",localeID:"ks_Arab",pluralCat:function(e,M){var a=0|e,r=function(e,M){var a,r,n=M;void 0===n&&(n=Math.min((a=e,-1==(r=(a+="").indexOf("."))?0:a.length-r-1),3));var m=Math.pow(10,n);return{v:n,f:(e*m|0)%m}}(e,M);return 1==a&&0==r.v?n:m}})}]);