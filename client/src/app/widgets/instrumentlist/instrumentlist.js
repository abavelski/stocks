'use strict';
angular.module('widgets.instrumentlist', [])

.controller('InstrumentListCtrl', function($scope, $http, ngTableParams){
  $scope.tableParams = new ngTableParams({
        page: 1,            
        count: 10           
    }, {
        total: 155,
        getData: function($defer, params) {
            $http.get('/api/companies').success(function(data){
              $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });            
        }
    });
});