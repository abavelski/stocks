angular.module('widgets.register', [])
    .controller('RegisterUserCtrl', function ($scope, $http, $location, security) {
        $scope.user = {};
        $scope.register = function() {
            $http.post('/api/register', $scope.user)
            .success(function(data) {
                $location.path('/registerok');
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
        };
    });

