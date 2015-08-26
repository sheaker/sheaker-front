(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSubsideStatisticsCtrl', NavbarSubsideStatisticsCtrl);

    function NavbarSubsideStatisticsCtrl($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    }

})();
