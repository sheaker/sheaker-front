(function() {
    'use strict';

angular.module('sheaker')
.controller('NavbarTopCtrl', function ($window, $scope, $location) {
    $scope.isActive = function(path) {
        if ($location.path() === path) {
            return true;
        }
        return false;
    };

    $scope.dropdown = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dropdown.isopen = !$scope.dropdown.isopen;
    };

    // Close dropdown when scrolling
    angular.element($window).bind('scroll', function(){
        $scope.dropdown.isopen = false;
    });
});

})();
