'use strict';
angular.module('widgets.tradebuttons', ['storage', 'security'])
    .controller('TradeButtonsCtrl', function($scope, $routeParams, storage, security){
        $scope.symbol = $routeParams.symbol;
        var sell = false;
        storage.getCustodies().map(function(custody) {
            for( var i =0; i<custody.holdings.length; i++) {
              if(custody.holdings[i].symbol===$scope.symbol) {
                  sell = true;
              }
            }
        });
        $scope.sellDisabled = !sell;
        $scope.isLoggedIn = security.isAuthenticated();
    });