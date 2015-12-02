(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideGeneralCtrl', NavbarSubsideGeneralCtrl);

    /** @ngInject */
    function NavbarSubsideGeneralCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
