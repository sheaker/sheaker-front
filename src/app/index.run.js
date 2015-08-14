(function() {
    'use strict';

angular.module('sheaker')
.run(function ($rootScope, $window, $location, $timeout, $interval, jwtHelper, Authorization) {
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

    if ($window.localStorage.getItem('token') && !$rootScope.connectedUser) {
        // If the user refresh the page with F5, redecode again the token.
        var decodedToken = jwtHelper.decodeToken($window.localStorage.getItem('token'));
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

        // Avoid a connected user to go to login and register pages
        if ($rootScope.connectedUseruser && next.originalPath === '/login') {
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
});

})();
