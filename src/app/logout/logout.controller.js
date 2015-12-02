(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('LogoutCtrl', LogoutCtrl);

    /** @ngInject */
    function LogoutCtrl($rootScope, $window, $location) {
        delete $rootScope.connectedUser;
        $window.localStorage.removeItem('token');

        $location.path('/');
        $window.location.reload();
    }

})();
