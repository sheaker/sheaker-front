'use strict';

angular.module('sheaker')
.controller('LogoutCtrl', function ($window, $location, $route) {
    $window.localStorage.removeItem('token');
    $location.path('/');
    $route.reload();
});
