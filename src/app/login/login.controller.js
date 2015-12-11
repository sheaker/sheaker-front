(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('LoginCtrl', LoginCtrl);

    /** @ngInject */
    function LoginCtrl($rootScope, $scope, $location, $window, $log, jwtHelper, User) {
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
                    switch (error.status) {
                        case 401:
                            $rootScope.alertsMsg.error('Wrong credentials id or password (#' + error.data.errors[0].code + ')');
                            break;
                        default:
                            $log.error(error);
                            $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                    }
                });
        };
    }

})();
