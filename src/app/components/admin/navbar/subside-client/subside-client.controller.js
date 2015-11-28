(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideClientCtrl', NavbarSubsideClientCtrl);

    /** @ngInject */
    function NavbarSubsideClientCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
