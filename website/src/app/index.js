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
          controller: 'ProfilCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin', {
          templateUrl: 'app/admin/home/home.html',
          controller: 'HomeAdminCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin/setting-gym', {
          templateUrl: 'app/admin/setting-gym/setting-gym.html',
          controller: 'SettingGymCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin/clients', {
          templateUrl: 'app/admin/clients/clients/clients.html',
          controller: 'ClientsCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin/clients/add', {
          templateUrl: 'app/admin/clients/add/add.html',
          controller: 'AddClientCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin/clients/edit/:id?', {
          templateUrl: 'app/admin/clients/edit/edit.html',
          controller: 'EditClientCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin/clients/charge/:id?', {
          templateUrl: 'app/admin/clients/charge/charge.html',
          controller: 'ChargeClientCtrl',
          access: {
              loginRequired: true
          }
      })
      .when('/admin/clients/review/:id?', {
          templateUrl: 'app/admin/clients/review/review.html',
          controller: 'ReviewClientCtrl',
          access: {
              loginRequired: true
          }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
