(function() {
    'use strict';

    angular
        .module('sheaker')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $window, $location, $timeout, $interval, jwtHelper, Authorization) {
        $rootScope.client = {
            id: -1,
            name: ''
        };

        $rootScope.authVars = {
            authorised: {
                authorised: 0,
                loginRequired: 1,
                notAuthorised: 2
            },
            permissionCheckTypes: {
                atLeastOne: 0,
                combinationRequired: 1
            }
        };

        var token = $window.localStorage.getItem('token');
        if (token && !$rootScope.connectedUser) {
            var decodedToken = jwtHelper.decodeToken(token);
            $rootScope.connectedUser = decodedToken.user;
        }

        var routeChangeRequiredAfterLogin = false;
        var loginRedirectUrl;

        $rootScope.$on('$routeChangeStart', function (event, next, previous) {
            var authorised;

            if (routeChangeRequiredAfterLogin && next.originalPath !== '/login') {
                routeChangeRequiredAfterLogin = false;
                $location.path(loginRedirectUrl).replace();
            } else if (next.access !== undefined) {
                authorised = Authorization.authorize(next.access.loginRequired, next.access.permissionsRequired, next.access.permissionType);

                if (authorised === $rootScope.authVars.authorised.loginRequired) {
                    routeChangeRequiredAfterLogin = true;
                    loginRedirectUrl = next.originalPath;
                    $location.path('/login');
                } else if (authorised === $rootScope.authVars.authorised.notAuthorised) {
                    $location.path(previous ? previous.originalPath : '/').replace();
                }
            }

            var token = $window.localStorage.getItem('token');
            if (token && jwtHelper.isTokenExpired(token)) {
                delete $rootScope.connectedUser;
                $window.localStorage.setItem('token', '');
                $location.path('/login');
            }

            // Avoid a connected user to go to login and register pages
            if ($rootScope.connectedUser && next.originalPath === '/login') {
                $location.path(previous ? previous.originalPath : '/').replace();
            }
        });

        $rootScope.alerts = [];
        $rootScope.closeAlert = function(index) {
            $rootScope.alerts.splice(index, 1);
        };
        // Check every second if there is alerts to remove
        // Alert expiration can be override by adding a 'exp' key with value in ms in the alert obj
        $interval(function() {
            $rootScope.alerts.forEach(function (element, index) {
                var exp = 10000; // Default timeout
                if (element.exp) {
                    exp = element.exp;
                }

                $timeout(function() {
                    $rootScope.closeAlert(index);
                }, exp);
            });
        }, 1000);
    }

})();
