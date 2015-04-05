'use strict';

angular.module('sheaker')
.controller('LoginCtrl', function ($rootScope, $scope, $location, $window, jwtHelper, User) {
    $scope.login = function () {
        User.login($scope.loginForm).$promise
        .then(function(response) {
            if (response.token) {
                $window.localStorage.setItem('token', response.token);

                var decodedToken = jwtHelper.decodeToken(response.token);
                $rootScope.user = decodedToken.user;

                if ($rootScope.user.permissions.length) {
                    $location.path('/admin/general/home');
                }
                else {
                    $location.path('/');
                }
            }
            else {
                $rootScope.alerts.push({type: 'danger', msg: 'Username or password are wrong.'});
            }
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while trying to connect, please contact a developper.'});
        });
    };
});
