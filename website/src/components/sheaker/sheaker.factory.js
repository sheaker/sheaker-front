'use strict';

angular.module('sheaker')
.factory('Sheaker', function ($resource, SHEAKER_MAIN_API_URL) {
    var Sheaker, actions;

    actions = {
        exist: {
            method: 'GET',
            url: SHEAKER_MAIN_API_URL + '/clients',
            params: {
                subdomain: '@subdomain'
            },
            skipAuthorization: true
        }
    };

    Sheaker = $resource(SHEAKER_MAIN_API_URL + '/clients/:id', {id: '@id'}, actions);
    return Sheaker;
});
