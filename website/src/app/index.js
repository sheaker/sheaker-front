'use strict';

angular.module('sheaker', ['ngResource', 'ngRoute', 'ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
      })
      .when('/profil', {
          templateUrl: 'app/profil/profil.html',
          controller: 'ProfilCtrl'
      })
      .when('/admin', {
          templateUrl: 'app/admin/home-admin/home-admin.html',
          controller: 'HomeAdminCtrl'
      })
      .when('/admin/setting-gym', {
          templateUrl: 'app/admin/setting-gym/setting-gym.html',
          controller: 'SettingGymCtrl'
      })
      .when('/admin/clients', {
          templateUrl: 'app/admin/clients/clients.html',
          controller: 'ClientsCtrl'
      })
      .when('/admin/add-client', {
          templateUrl: 'app/admin/add-client/add-client.html',
          controller: 'AddClientCtrl'
      })
      .when('/admin/edit-client', {
          templateUrl: 'app/admin/edit-client/edit-client.html',
          controller: 'EditClientCtrl'
      })
      .when('/admin/charge-client', {
          templateUrl: 'app/admin/charge-client/charge-client.html',
          controller: 'ChargeClientCtrl'
      })
      .when('/admin/review-client', {
          templateUrl: 'app/admin/review-client/review-client.html',
          controller: 'ReviewClientCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
