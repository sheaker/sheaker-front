'use strict';

angular.module('sheaker')
.controller('NavbarSideCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
         if ($location.path() === path) {
             return true;
         }
         return false;
    };
});
