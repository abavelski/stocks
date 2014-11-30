'use strict';
angular.module('widgets.assetoverview', [])

.controller('AssetOverviewCtrl', function($scope, $http, $routeParams, ngTableParams){
  $scope.tableParams = new ngTableParams({
        page: 1,            
        count: 10           
    }, {
        getData: function($defer, params) {
            $http.get('/auth/custodies/'+$routeParams.id).success(function(data){
              $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });            
        }
    });
});