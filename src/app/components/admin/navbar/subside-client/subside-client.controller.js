(function() {
    'use strict';

angular.module('sheaker')
.controller('NavbarSubsideClientCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
        if ($location.path() === path) {
            return true;
        }
        return false;
    };
});

})();
