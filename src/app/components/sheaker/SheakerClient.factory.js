(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('SheakerClient', SheakerClient);

    function SheakerClient($resource, BACKEND_URL) {
        var resource, actions;

        actions = {
            get: {
                skipAuthorization: true
            }
        };

        resource = $resource(BACKEND_URL + '/clients', {subdomain: '@subdomain'}, actions);
        return resource;
    }

})();
