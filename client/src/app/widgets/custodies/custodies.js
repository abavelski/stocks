'use strict';
angular.module('widgets.custodies', ['storage'])

.controller('CustodiesCtrl', function($scope, $http, storage, ngTableParams){
  $scope.custody = {};
  $scope.custodies = storage.getCustodies();  
  $scope.custodiesTotal = 0;
  $scope.tableParams = new ngTableParams({
        page: 1,            
        count: 5
    }, {
        total : 5,
        counts : [],
        getData: function($defer, params) {
          var custodies = storage.getCustodies();  
          $http.get('/auth/instruments').success(function(instruments) {
          console.log(instruments);
          custodies = custodies.map(function(custody) {
                custody.total = 0;
                for( var i =0; i<custody.holdings.length; i++) {
                  var instr = instruments[custody.holdings[i].symbol];
                  custody.total+=(instr.lastTradePrice*custody.holdings[i].amount);
                }
                $scope.custodiesTotal+=custody.total;
                return custody;
              });
          $defer.resolve(custodies);
          });            
        }
    });

  $scope.addCustody = function() {
  	if (!$scope.custody.name) {
  		$scope.error = "Name should not be empty";
  		return;
  	}
    $http.post('/auth/custody', $scope.custody)
        .success(function(custody) {
                console.log(custody);
                $scope.custodies.push(custody);
                storage.addCustody(custody);
                $scope.custody = {};
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
  };

  $scope.isAddCustodyAllowed = function() {
  	return $scope.custodies.length<5;
  };
});