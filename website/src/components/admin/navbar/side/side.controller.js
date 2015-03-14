'use strict';

angular.module('sheaker')
.controller('NavbarSideCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
         if ($location.path().indexOf(path) !== -1) {
             return true;
         }
         return false;
    };
});
