(function() {
    'use strict';

angular.module('sheaker')
.controller('NavbarSubSideClientCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
        if ($location.path() === path) {
            return true;
        }
        return false;
    };
});

})();
