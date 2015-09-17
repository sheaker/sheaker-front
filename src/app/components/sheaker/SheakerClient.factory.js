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
            },
            index: {
                method: 'PUT',
                url:     BACKEND_URL + '/clients/index'
            }
        };

        resource = $resource(BACKEND_URL + '/clients', {subdomain: '@subdomain', id_client: '@id_client'}, actions);
        return resource;
    }

})();
