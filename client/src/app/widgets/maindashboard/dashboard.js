'use strict';
angular.module('widgets.dashboard', [])
    .controller('DashboardCtrl', function($scope, $http){
        $scope.summary = {};
        $http.get('/auth/user/summary').success(function(data){
           $scope.summary = data;
        });

    });