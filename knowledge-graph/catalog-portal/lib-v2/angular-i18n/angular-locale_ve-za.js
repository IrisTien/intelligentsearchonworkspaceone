"use strict";angular.module("ngLocale",[],["$provide",function(a){var i="one",n="other";a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Swondaha","Musumbuluwo","Ḽavhuvhili","Ḽavhuraru","Ḽavhuṋa","Ḽavhuṱanu","Mugivhela"],ERANAMES:["BCE","CE"],ERAS:["BCE","CE"],FIRSTDAYOFWEEK:6,MONTH:["Phando","Luhuhi","Ṱhafamuhwe","Lambamai","Shundunthule","Fulwi","Fulwana","Ṱhangule","Khubvumedzi","Tshimedzi","Ḽara","Nyendavhusiku"],SHORTDAY:["Swo","Mus","Vhi","Rar","Ṋa","Ṱan","Mug"],SHORTMONTH:["Pha","Luh","Ṱhf","Lam","Shu","Lwi","Lwa","Ṱha","Khu","Tsh","Ḽar","Nye"],WEEKENDRANGE:[5,6],fullDate:"y MMMM d, EEEE",longDate:"y MMMM d",medium:"y MMM d HH:mm:ss",mediumDate:"y MMM d",mediumTime:"HH:mm:ss",short:"y-MM-dd HH:mm",shortDate:"y-MM-dd",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"R",DECIMAL_SEP:",",GROUP_SEP:" ",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"¤-",negSuf:"",posPre:"¤",posSuf:""}]},id:"ve-za",pluralCat:function(a,u){var e=0|a,M=function(a,u){var e,M,i=u;void 0===i&&(i=Math.min((e=a,-1==(M=(e+="").indexOf("."))?0:e.length-M-1),3));var n=Math.pow(10,i);return{v:i,f:(a*n|0)%n}}(a,u);return 1==e&&0==M.v?i:n}})}]);