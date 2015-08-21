(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideGeneralCtrl', NavbarSubsideGeneralCtrl);

    function NavbarSubsideGeneralCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
