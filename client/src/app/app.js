'use strict';
angular.module('app', [ 'templates.app', 'templates.common', 'security','layouts', 'widget', 'widgets'])

.controller('AppCtrl', ['$scope', function($scope) {}])

.controller('HeaderCtrl', function ($scope, $location, security) {
  		$scope.isActive = function(str){ return $location.path().search(str)>-1; };
  		$scope.isAuthenticated = security.isAuthenticated;
  		$location.path('/instruments');

		$scope.$watch(function() {
			return security.currentUser;
		}, function(currentUser, oldUser) {
			if (currentUser && !oldUser) {
				$location.path('/home');
			}
		});

})
.run(function(security, $window){
	$window.addToHomescreen();
	security.updateCurrentUser();
});