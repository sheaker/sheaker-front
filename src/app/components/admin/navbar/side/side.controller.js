(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('NavbarSideCtrl', NavbarSideCtrl);

    /** @ngInject */
    function NavbarSideCtrl($scope, $location) {
        $scope.isActive = function(path) {
             if ($location.path().indexOf(path) !== -1) {
                 return true;
             }
             return false;
        };
    }

})();
