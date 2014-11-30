'use strict';
angular.module('widgets.cashaccounts', ['storage'])

.controller('CashAccountsCtrl', function($scope, $http, storage, ngTableParams){
  $scope.cashAccounts = storage.getCashAccounts();
  $scope.cashAccount = {
    currency : 'DKK'
  };
  $scope.tableParams = new ngTableParams({
    count: $scope.cashAccounts.length 
    },{
    counts: [] 
    });
  $scope.addCashAccount = function() {
  	if (!$scope.cashAccount.name) {
  		$scope.error = "Name should not be empty";
  		return;
  	}
    $http.post('/auth/cash-account', $scope.cashAccount)
        .success(function(cashAccount) {
                console.log(cashAccount);
                $scope.cashAccounts.push(cashAccount)
                storage.addCashAccount(cashAccount);
                $scope.cashAccount = { currency: 'DKK'};
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
  };

  $scope.isAddCashAccountAllowed = function() {
  	return $scope.cashAccounts.length<5;
  };
});