(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl($rootScope, $scope, $location, $window, jwtHelper, User) {
        $scope.login = function () {
            User.login($scope.loginForm).$promise
            .then(function(response) {
                if (response.token) {
                    $window.localStorage.setItem('token', response.token);

                    var decodedToken = jwtHelper.decodeToken(response.token);
                    $rootScope.connectedUser = decodedToken.user;

                    if ($rootScope.connectedUser.permissions.length) {
                        $location.path('/admin/general/home');
                    }
                    else {
                        $location.path('/');
                    }
                }
                else {
                    $rootScope.alertsMsg.error('Username or password are wrong.');
                }
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alertsMsg.error('Error while trying to connect.');
            });
        };
    }

})();
