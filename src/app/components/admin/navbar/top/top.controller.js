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

    $scope.status = {
      isopen: false
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $(window).scroll(function(){
      $scope.status.isopen = false;
    });

    $(".navbar-fixed-top").headroom({
    "offset": 20,
    "tolerance": 5
    });
});
