'use strict';

angular.module('sheaker')
.controller('LogoutCtrl', function ($window, $location) {
    $window.localStorage.removeItem('token');
    $location.path('/');
    $window.location.reload();
});