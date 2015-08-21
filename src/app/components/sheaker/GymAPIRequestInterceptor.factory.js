(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('GymAPIRequestInterceptor', GymAPIRequestInterceptor);

    function GymAPIRequestInterceptor($rootScope, BACKEND_URL) {
        var service = {
            request: request
        }

        return service;
        ////////////

        function request(request) {
            if (request.url && request.url.indexOf(BACKEND_URL) !== -1 &&
                request.url.indexOf(BACKEND_URL + '/clients') === -1 &&
                request.url.indexOf(BACKEND_URL + '/infos') === -1) {
                request.params = request.params || {};
                angular.extend(request.params, {'id_client': $rootScope.client.id});
            }

            return request;
        }
    }

})();
