'use strict';

angular.module('sheaker')
.controller('NavbarTopCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
        if ($location.path() === path) {
            return true;
        }
        return false;
    };

    $scope.dt = new Date();
});
