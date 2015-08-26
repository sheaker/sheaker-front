(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('backendRequestInterceptor', backendRequestInterceptor);

    function backendRequestInterceptor($rootScope, BACKEND_URL) {
        var service = {
            request: appendIdClient
        };

        return service;
        ////////////

        function appendIdClient(req) {
            if (req.url && req.url.indexOf(BACKEND_URL) !== -1 &&
                req.url.indexOf(BACKEND_URL + '/clients') === -1 &&
                req.url.indexOf(BACKEND_URL + '/infos') === -1) {
                req.params = req.params || {};
                angular.extend(req.params, {'id_client': $rootScope.client.id});
            }

            return req;
        }
    }

})();
