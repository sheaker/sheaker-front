(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('backendRequestInterceptor', backendRequestInterceptor);

    /** @ngInject */
    function backendRequestInterceptor($rootScope, BACKEND_URL) {
        var service = {
            request: appendIdClient
        };

        return service;
        ////////////

        function appendIdClient(req) {
            // For some api calls we MUST add id_client= params to requests.
            // Here we make sure is added to avoid fetch wrong infos from wrong client
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
