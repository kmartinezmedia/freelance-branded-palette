/**
 * An Angular module that gives you access to the browsers local storage
 * @version v0.2.2 - 2015-05-29
 * @link https://github.com/grevory/angular-local-storage
 * @author grevory <greg@gregpike.ca>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(e,t,o){"use strict";var r=t.isDefined,i=t.isUndefined,n=t.isNumber,a=t.isObject,c=t.isArray,s=t.extend,u=t.toJson,l=t.module("LocalStorageModule",[]);l.provider("localStorageService",function(){this.prefix="ls",this.storageType="localStorage",this.cookie={expiry:30,path:"/"},this.notify={setItem:!0,removeItem:!1},this.setPrefix=function(e){return this.prefix=e,this},this.setStorageType=function(e){return this.storageType=e,this},this.setStorageCookie=function(e,t){return this.cookie.expiry=e,this.cookie.path=t,this},this.setStorageCookieDomain=function(e){return this.cookie.domain=e,this},this.setNotify=function(e,t){return this.notify={setItem:e,removeItem:t},this},this.$get=["$rootScope","$window","$document","$parse",function(e,t,o,l){var g=this,f=g.prefix,d=g.cookie,h=g.notify,m=g.storageType,p;o?o[0]&&(o=o[0]):o=document,"."!==f.substr(-1)&&(f=f?f+".":"");var S=function(e){return f+e},T=function(){try{var o=m in t&&null!==t[m],r=S("__"+Math.round(1e7*Math.random()));return o&&(p=t[m],p.setItem(r,""),p.removeItem(r)),o}catch(i){return m="cookie",e.$broadcast("LocalStorageModule.notification.error",i.message),!1}}(),y=function(t,o){if(o=i(o)?null:u(o),!T||"cookie"===g.storageType)return T||e.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),h.setItem&&e.$broadcast("LocalStorageModule.notification.setitem",{key:t,newvalue:o,storageType:"cookie"}),M(t,o);try{p&&p.setItem(S(t),o),h.setItem&&e.$broadcast("LocalStorageModule.notification.setitem",{key:t,newvalue:o,storageType:g.storageType})}catch(r){return e.$broadcast("LocalStorageModule.notification.error",r.message),M(t,o)}return!0},v=function(t){if(!T||"cookie"===g.storageType)return T||e.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),_(t);var o=p?p.getItem(S(t)):null;if(!o||"null"===o)return null;try{return JSON.parse(o)}catch(r){return o}},O=function(){var t,o;for(t=0;t<arguments.length;t++)if(o=arguments[t],T&&"cookie"!==g.storageType)try{p.removeItem(S(o)),h.removeItem&&e.$broadcast("LocalStorageModule.notification.removeitem",{key:o,storageType:g.storageType})}catch(r){e.$broadcast("LocalStorageModule.notification.error",r.message),x(o)}else T||e.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),h.removeItem&&e.$broadcast("LocalStorageModule.notification.removeitem",{key:o,storageType:"cookie"}),x(o)},b=function(){if(!T)return e.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),!1;var t=f.length,o=[];for(var r in p)if(r.substr(0,t)===f)try{o.push(r.substr(t))}catch(i){return e.$broadcast("LocalStorageModule.notification.error",i.Description),[]}return o},k=function(t){var o=f?new RegExp("^"+f):new RegExp,r=t?new RegExp(t):new RegExp;if(!T||"cookie"===g.storageType)return T||e.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),w();var i=f.length;for(var n in p)if(o.test(n)&&r.test(n.substr(i)))try{O(n.substr(i))}catch(a){return e.$broadcast("LocalStorageModule.notification.error",a.message),w()}return!0},L=function(){try{return t.navigator.cookieEnabled||"cookie"in o&&(o.cookie.length>0||(o.cookie="test").indexOf.call(o.cookie,"test")>-1)}catch(r){return e.$broadcast("LocalStorageModule.notification.error",r.message),!1}}(),M=function(t,r,s){if(i(r))return!1;if((c(r)||a(r))&&(r=u(r)),!L)return e.$broadcast("LocalStorageModule.notification.error","COOKIES_NOT_SUPPORTED"),!1;try{var l="",g=new Date,f="";if(null===r?(g.setTime(g.getTime()+-864e5),l="; expires="+g.toGMTString(),r=""):n(s)&&0!==s?(g.setTime(g.getTime()+24*s*60*60*1e3),l="; expires="+g.toGMTString()):0!==d.expiry&&(g.setTime(g.getTime()+24*d.expiry*60*60*1e3),l="; expires="+g.toGMTString()),t){var h="; path="+d.path;d.domain&&(f="; domain="+d.domain),o.cookie=S(t)+"="+encodeURIComponent(r)+l+h+f}}catch(m){return e.$broadcast("LocalStorageModule.notification.error",m.message),!1}return!0},_=function(t){if(!L)return e.$broadcast("LocalStorageModule.notification.error","COOKIES_NOT_SUPPORTED"),!1;for(var r=o.cookie&&o.cookie.split(";")||[],i=0;i<r.length;i++){for(var n=r[i];" "===n.charAt(0);)n=n.substring(1,n.length);if(0===n.indexOf(S(t)+"=")){var a=decodeURIComponent(n.substring(f.length+t.length+1,n.length));try{return JSON.parse(a)}catch(c){return a}}}return null},x=function(e){M(e,null)},w=function(){for(var e=null,t=null,r=f.length,i=o.cookie.split(";"),n=0;n<i.length;n++){for(e=i[n];" "===e.charAt(0);)e=e.substring(1,e.length);var a=e.substring(r,e.indexOf("="));x(a)}},E=function(){return m},R=function(e,t,o,i){i=i||t;var n=v(i);return null===n&&r(o)?n=o:a(n)&&a(o)&&(n=s(o,n)),l(t).assign(e,n),e.$watch(t,function(e){y(i,e)},a(e[t]))},I=function(){for(var e=0,o=t[m],r=0;r<o.length;r++)0===o.key(r).indexOf(f)&&e++;return e};return{isSupported:T,getStorageType:E,set:y,add:y,get:v,keys:b,remove:O,clearAll:k,bind:R,deriveKey:S,length:I,cookie:{isSupported:L,set:M,add:M,get:_,remove:x,clearAll:w}}}]})}(window,window.angular);