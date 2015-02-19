'use strict';

angular.module('sheaker', ['ngResource', 'ngRoute', 'ui.bootstrap', 'angular-jwt'])
.constant('API_URL', '//api.sheaker.perso.dev')
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
    .when('/profil', {
        templateUrl: 'app/profil/profil.html',
        controller: 'ProfilCtrl',
        access: {
              loginRequired: true
        }
    })
    .when('/admin/general', {
        templateUrl: 'app/admin/home/home.html',
        controller: 'HomeAdminCtrl',
        access: {
            loginRequired: true,
            permissionsRequired: ['Modo', 'Admin'],
            permissionType: 'atLeastOne'
        }
    })
    .when('/admin/general/setting-gym', {
        templateUrl: 'app/admin/setting-gym/setting-gym.html',
        controller: 'SettingGymCtrl',
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

     jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, $window, API_URL) {
         var token = $window.localStorage.getItem('token');

        if (token && jwtHelper.isTokenExpired(token)) {

        } else {
            return token;
        }
    };

    $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function ($rootScope, $window, $timeout, $location, jwtHelper, Authorization) {

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

    var routeChangeRequiredAfterLogin = false,
    loginRedirectUrl;

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

    // Every 3secondes alerts are removed
    // TODO: It's better to set a duration for each alerts, and remove them here if expired
    // $timeout(function() {
    //     $rootScope.alerts.forEach(function (element, index, array) {
    //         array.splice(index, 1);
    //     })
    // }, 3000);

    $rootScope.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };
})
;
