(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideScheduleCtrl', NavbarSubsideScheduleCtrl);

    /** @ngInject */
    function NavbarSubsideScheduleCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
