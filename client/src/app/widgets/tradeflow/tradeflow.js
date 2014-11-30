'use strict';
angular.module('widgets.tradeflow', ['mgo-angular-wizard', 'storage'])

.controller('TradeFlowCtrl', function($scope, WizardHandler, $routeParams, $http, storage, $location){
	$scope.instrument = {};
	$http.get('/api/companies/'+$routeParams.symbol).success(function(data){
  		$scope.instrument = data;
    }); 
    $scope.nextBtn = 'Next';
    $scope.currentStep = '';
	$scope.orderTypes = ['Instant'];
	$scope.custodies = storage.getCustodies();
	$scope.cashAccounts = storage.getCashAccounts();
	$scope.order = {
		action : $routeParams.action,
		symbol : $routeParams.symbol,
		orderType : $scope.orderTypes[0],
		custody : $scope.custodies[0],
		cashAccount : $scope.cashAccounts[0],
		amount : 1
	};
	var updateBuyTotal = function() {
		$scope.total = $scope.order.amount * $scope.instrument.ask + $scope.commission;
	};
	var updateSellTotal = function() {
		$scope.total = $scope.order.amount * $scope.instrument.bid + $scope.commission;
	};
	var updateTotal = function() {
		if ($scope.order.action==='buy') {
			updateBuyTotal();
		} else {
			updateSellTotal();
		}
	};
	$scope.next = function() {
		if ($scope.currentStep==='select') {
			updateTotal();
			WizardHandler.wizard().next();
		}
		if ($scope.currentStep==='confirm') {
			$scope.nextBtn = 'Finish';
			$http.post('/auth/order', $scope.order)
			 .success(function(res) {
                storage.saveUser(res);
                WizardHandler.wizard().next();
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
		} 
		if ($scope.currentStep==='reciept') {
			$location.path('/home');
		}		
  		
  	};

  	$scope.commission = 29;
  	$scope.total = 0;

  
});
