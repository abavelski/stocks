'use strict';
angular.module('storage', [])

.factory('storage', function($window) {
    var storage = {
        updateSymbols : function(instruments) {
            $window.sessionStorage.instruments = JSON.stringify(instruments);
        },
        getInstruments : function() {
            return JSON.parse($window.sessionStorage.instruments);
        },
    	saveUser : function(user) {
    		$window.sessionStorage.user = JSON.stringify(user);
          },
         saveToken : function(token) {
         	$window.sessionStorage.token = token;
         },
         clearStorage : function() {
         	delete $window.sessionStorage.user;
         	delete $window.sessionStorage.token;
         },
         getToken : function() {
         	return $window.sessionStorage.token;
         },
         getUser : function() {
         	return $window.sessionStorage.user ? JSON.parse($window.sessionStorage.user): null;
         },
         getCustodies : function() {
            var user = storage.getUser();
            var custodies = [];
            if (user) {
                custodies = user.custodyAccounts;
            } 
            return custodies;
         },
         getCashAccounts: function() {
            var user = storage.getUser();
            var cashAccounts = [];
            if (user) {
                cashAccounts = user.cashAccounts;
            } 
            return cashAccounts;
         },
         addCustody : function(custody) {
            var user = storage.getUser();
            user.custodyAccounts.push(custody);
            storage.saveUser(user);
         },         
         addCashAccount : function(cashAccount) {
            var user = storage.getUser();
            user.cashAccounts.push(cashAccount);
            storage.saveUser(user);
         },
         getUserName : function() {
         	var user = storage.getUser();
         	if (user) {
         		return user.login;
         	} else {
         		return null;
         	}
         }
    };
    return storage;
})