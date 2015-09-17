(function() {
    'use strict';

    angular
        .module('sheaker')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        var customResolves = {
            sheaker: getSheakerAuthorization
        };

        var customRouteProvider = {
            when: customWhen
        };

        /*@ngInject*/
        function getSheakerAuthorization($rootScope, $location, $window, jwtHelper, FRONTEND_URL, SheakerClient, SheakerInfos, ClientFlags) {
            var address = $location.host().split('.');

            if ($rootScope.client.id === -1 && address.length === 3) {
                return SheakerInfos.get().$promise
                    .then(function (infos) {
                        if (infos.reservedSubdomains.indexOf(address[0].toLowerCase()) === -1) {
                            return SheakerClient.get({subdomain: address[0]}).$promise
                                .then(function (client) {
                                    $rootScope.client = {
                                        id: client.id,
                                        name: client.name
                                    };

                                    if (client.flags & ClientFlags.INDEX_ELASTICSEARCH) {
                                        return SheakerClient.index({id_client: client.id}).$promise
                                    }
                                });
                        }
                    })
                    .catch(function(error) {
                        if (error.status === 404 || error.status === 0) {
                            $window.location.href = FRONTEND_URL + '#/create/' + address[0];
                        }
                    });
            }
        }

        function customWhen(path, route) {
            route.resolve = (route.resolve) ? route.resolve : {};
            angular.extend(route.resolve, customResolves);
            $routeProvider.when(path, route);
            return this;
        }

        var sheakerRouteProvider = angular.extend({}, $routeProvider, customRouteProvider);

        sheakerRouteProvider
            .when('/', {
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'app/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'app/logout/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/checkin', {
                templateUrl: 'app/checkin/checkin.html',
                permissionsRequired: ['user', 'modo', 'admin'],
                controller: 'CheckinCtrl',
                permissionType: 'atLeastOne'
            })
            .when('/admin/general/home', {
                templateUrl: 'app/admin/general/home/home.html',
                controller: 'HomeAdminCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/general/settings', {
                templateUrl: 'app/admin/general/settings/settings.html',
                controller: 'SettingsCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/clients/search', {
                templateUrl: 'app/admin/clients/search/search.html',
                controller: 'SearchClientCtrl',
                reloadOnSearch : false,
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/clients/add', {
                templateUrl: 'app/admin/clients/add/add.html',
                controller: 'AddClientCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/clients/edit/:id?', {
                templateUrl: 'app/admin/clients/edit/edit.html',
                controller: 'EditClientCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/clients/charge/:id?', {
                templateUrl: 'app/admin/clients/charge/charge.html',
                controller: 'ChargeClientCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/clients/review/:id?', {
                templateUrl: 'app/admin/clients/review/review.html',
                controller: 'ReviewClientCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/schedule', {
                templateUrl: 'app/admin/schedule/home/schedule.html',
                controller: 'ScheduleCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/statistics/home', {
                templateUrl: 'app/admin/statistics/home/home.html',
                controller: 'HomeStatisticsCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/statistics/gym', {
                templateUrl: 'app/admin/statistics/gym/gym.html',
                controller: 'GymStatisticsCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .when('/admin/statistics/clients', {
                templateUrl: 'app/admin/statistics/clients/clients.html',
                controller: 'ClientsStatisticsCtrl',
                access: {
                    loginRequired: true,
                    permissionsRequired: ['user', 'modo', 'admin'],
                    permissionType: 'atLeastOne'
                }
            })
            .otherwise({
                redirectTo: '/'
        });
    }

})();
