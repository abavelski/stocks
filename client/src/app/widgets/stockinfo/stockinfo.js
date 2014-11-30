'use strict';
angular.module('widgets.stockinfo', ['ngTable'])

.factory('StockInfoLabels', function() {
	return {
    	ask : "Ask",
    	bid : "Bid",
    	lastTradeDate: "Last Traded Date",
    	lastTradePrice: "Last Traded Price",
    	daysLow : "Days Low",
    	daysHigh: "Days High",
    	yearLow : "Years Low",
    	yearHigh: "Years High",
    	symbol : "Symbol",
    	name : "Name",
    	volume : "Volume",
    	exchange : "Exchange",
    	change : "Change",
    	changePercent : "Change Percent",
    	marketCap : "Market Capitalization",
    	priceBook : "Price Book",
    	yearTargetPrice : "Year Target Price"
	};
})

.controller('StockInfoCtrl', function($scope, $http, ngTableParams, $routeParams, StockInfoLabels){
  $scope.symbol = $routeParams.symbol;
  $scope.tableParams = new ngTableParams({
        count: 12           // count per page
    }, {
        total: 12, 
        counts: [],
        getData: function($defer, params) {
            $http.get('/api/companies/'+$routeParams.symbol).success(function(data){

              var result = [];
              for (var prop in data) {
                if(data.hasOwnProperty(prop)){
                result.push({name : StockInfoLabels[prop], value: data[prop]});
                }
              }
              $defer.resolve(result);
            });            
        }
    });
});