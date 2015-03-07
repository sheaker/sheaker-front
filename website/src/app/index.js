'use strict';

angular.module('sheaker', ['ngResource', 'ngRoute', 'ui.bootstrap', 'angular-jwt', 'webcam', 'internationalPhoneNumber'])
.constant('SHEAKER_MAIN_API_URL', '//sheaker.dev/api')
.constant('SHEAKER_API_URL', '//gym4devs.sheaker.dev/api')
.config(function ($routeProvider, $httpProvider, jwtInterceptorProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
    })
    .when('/login', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
    })
    .when('/admin/general/home', {
        templateUrl: 'app/admin/general/home/home.html',
        controller: 'HomeAdminCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/general/settings', {
        templateUrl: 'app/admin/general/settings/settings.html',
        controller: 'SettingsCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/clients/search', {
        templateUrl: 'app/admin/clients/search/search.html',
        controller: 'SearchClientCtrl',
        reloadOnSearch : false,
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/clients/add', {
        templateUrl: 'app/admin/clients/add/add.html',
        controller: 'AddClientCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/clients/edit/:id?', {
        templateUrl: 'app/admin/clients/edit/edit.html',
        controller: 'EditClientCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/clients/charge/:id?', {
        templateUrl: 'app/admin/clients/charge/charge.html',
        controller: 'ChargeClientCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/clients/review/:id?', {
        templateUrl: 'app/admin/clients/review/review.html',
        controller: 'ReviewClientCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .otherwise({
        redirectTo: '/'
    });

     jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, $window, SHEAKER_API_URL) {
         var token = $window.localStorage.getItem('token');

        if (token && jwtHelper.isTokenExpired(token)) {

        } else {
            return token;
        }
    };

    $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function ($rootScope, $window, $location, $timeout, $interval, jwtHelper, Sheaker, Authorization) {

    var address = $location.host().split(".");
    var prohibitedSubs = ['www'];

    if (address.length === 3 && prohibitedSubs.indexOf(address[0].toLowerCase()) === -1) {
        Sheaker.exist({subdomain: address[0]}).$promise
        .then(function(client) {
            $rootScope.gymname = client.name;
        })
        .catch(function(error) {
            if (error.status === 404) {
                $window.location.href = 'http://sheaker.com/register/' + address[0];
            }
        });
    }

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

    if ($window.localStorage.getItem('token') && !$rootScope.user) {
        // If the user refresh the page with F5, redecode again the token.
        var decodedToken = jwtHelper.decodeToken($window.localStorage.getItem('token'));
        $rootScope.user = decodedToken.user;
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
        if ($rootScope.user && next.originalPath === '/login') {
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
        $rootScope.alerts.forEach(function (element, index, array) {
            var exp = 10000; // Default timeout
            if (element.exp) {
                exp = element.exp;
            }

            $timeout(function() {
                $rootScope.closeAlert(index);
            }, exp);
        })
    }, 1000);
})
;
