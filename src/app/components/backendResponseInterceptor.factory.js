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
            // For responses from the api we "rewrite" the content to remove the top level field "data"
            // See http://jsonapi.org/format/#document-top-level
            if (response.config.url.indexOf(BACKEND_URL) !== -1) {
                response.data = response.data.data;
            }

            return response;
        }
    }

})();
