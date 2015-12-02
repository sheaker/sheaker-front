(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideStatisticsCtrl', NavbarSubsideStatisticsCtrl);

    /** @ngInject */
    function NavbarSubsideStatisticsCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
