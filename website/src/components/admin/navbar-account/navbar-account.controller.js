'use strict';

angular.module('sheaker')
.controller('NavbarAccountCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
        if ($location.path() === path) {
            return true;
        }
        return false;
    };
});
