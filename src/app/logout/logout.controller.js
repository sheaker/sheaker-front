(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('LogoutCtrl', LogoutCtrl);

    function LogoutCtrl($rootScope, $window, $location) {
        delete $rootScope.connectedUser;
        $window.localStorage.removeItem('token');

        $location.path('/');
        $window.location.reload();
    }

})();
