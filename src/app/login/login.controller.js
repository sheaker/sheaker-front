(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('LoginCtrl', LoginCtrl);

    /** @ngInject */
    function LoginCtrl($rootScope, $scope, $location, $window, jwtHelper, User) {
        $scope.login = function () {
            User.login($scope.loginForm).$promise
                .then(function(response) {
                    $window.localStorage.setItem('token', response.token);

                    var decodedToken = jwtHelper.decodeToken(response.token);
                    $rootScope.connectedUser = decodedToken.user;

                    if ($rootScope.connectedUser.permissions.length) {
                        $location.path('/admin/general/home');
                    }
                    else {
                        $location.path('/');
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Your login information was incorrect.');
                });
        };
    }

})();
