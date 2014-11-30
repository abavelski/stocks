'use strict';
angular.module('security.login.form', [])

.controller('LoginFormController', function($scope, $modalInstance, security) {
  $scope.user = {};
  $scope.authError = null;

  $scope.login = function() {
    $scope.authError = null;

    security.login($scope.user.username, $scope.user.password, function(err) {
        console.log('err');
      if (err) {
        $scope.authError = err;
      }
    });
  };

  $scope.cancelLogin = function() {
    $modalInstance.dismiss();
  };
});
