'use strict';
angular.module('widgets.custodyselector', ['storage'])

.controller('CustodySelectorCtrl', function($scope, storage, $routeParams){
  $scope.custodies = storage.getCustodies();
  
  $scope.custodies.unshift({_id: 'ALL', name: 'ALL'});
  $scope.custody = $scope.custodies[0];
    
  $scope.custodies.forEach(function(custody){
    if (custody._id===$routeParams.id) {
      $scope.custody = custody;
    }
  });

  $scope.status = {
    isopen: false
  };


});