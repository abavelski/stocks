'use strict';
angular.module('widgets.search', ['ui.bootstrap.typeahead', 'ui.bootstrap.tpls'])

.controller('SearchCtrl', function ($scope, $http, $location) {
  $scope.getCompanies = function(val) {
    return $http.get('/api/companies/lookup/'+val).then(function(response){
      return response.data;
    });
  };

  $scope.onSelect = function (item) {
    $location.path('/instrument/'+item.symbol+'/details');
  };
});