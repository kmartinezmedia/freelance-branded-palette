!function(){"use strict";angular.module("app.services").factory("MenuService",["$rootScope",function(i){var r={};return r.isAndroid=function(){return navigator.userAgent.match(/Android/i)},r.isBlackberry=function(){return navigator.userAgent.match(/BlackBerry/i)},r.isIos=function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},r.isOpera=function(){return navigator.userAgent.match(/Opera Mini/i)},r.isWindows=function(){return navigator.userAgent.match(/IEMobile/i)||navigator.userAgent.match(/WPDesktop/i)},r.isMobile=function(){return this.isAndroid()||this.isBlackberry()||this.isIos()||this.isOpera()||this.isWindows()?!0:!1},r}])}();