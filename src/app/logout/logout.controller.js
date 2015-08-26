(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('LogoutCtrl', LogoutCtrl);

    function LogoutCtrl($window, $location) {
            $window.localStorage.removeItem('token');
            $location.path('/');
            $window.location.reload();
    }

})();
