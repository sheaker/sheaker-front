(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('backendResponseInterceptor', backendResponseInterceptor);

    /** @ngInject */
    function backendResponseInterceptor(BACKEND_URL) {
        var service = {
            response: removeDataField
        };

        return service;
        ////////////

        function removeDataField(response) {
            // For responses from the api we "rewrite" the content to remove top level fields "data" and "errors"
            // See http://jsonapi.org/format/#document-top-level
            if (response.config.url.indexOf(BACKEND_URL) !== -1) {
                if (angular.isDefined(response.data.data)) {
                    response.data = response.data.data;
                }
                if (angular.isDefined(response.data.errors)) {
                    response.data = response.data.errors;
                }
            }

            return response;
        }
    }

})();
