(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideLogsCtrl', NavbarSubsideLogsCtrl);

    /** @ngInject */
    function NavbarSubsideLogsCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
