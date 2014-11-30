'use strict';
angular.module('widgets.graph', [])

.directive('graph', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          scope.getData(function(data){
            element.highcharts('StockChart', {
              rangeSelector : {
                  inputEnabled: false
              },
              credits: {
                enabled: false
              },
              series : [{
                name : 'Stock',
                data : data
              }]
            });
          });
      }
    };
})

.controller('GraphCtrl', function($scope, $http, $routeParams){
  $scope.getData = function(callback) {
    $http.get('/api/companies/history/'+$routeParams.symbol).success(callback);
  };

});