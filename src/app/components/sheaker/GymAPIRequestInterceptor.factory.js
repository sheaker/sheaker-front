(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('GymAPIRequestInterceptor', GymAPIRequestInterceptor);

    function GymAPIRequestInterceptor($rootScope, BACKEND_URL) {
        var service = {
            request: request
        };

        return service;
        ////////////

        function request(req) {
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
