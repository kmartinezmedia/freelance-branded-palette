!function(){"use strict";angular.module("app.services").factory("CartService",["localStorageService","$rootScope",function(t,r){var a={};return a.setCurrentUserCart=function(a){r.cart=a,t.set("cart",a),t.bind(r,"cart")},a.setRootScopeCart=function(){this.userHasCart()?void 0==r.cart&&(r.cart=this.getCurrentCart(),t.bind(r,"cart")):(r.cart={products:[]},t.set("cart",[]),t.bind(r,"cart"))},a.addToCart=function(t){r.cart.push(t)},a.getCurrentCart=function(){return t.get("cart")},a.userHasCart=function(){var t=this.getCurrentCart();return null!=t},a.empty=function(){t.clearAll()},a}])}();