'use strict';

angular.module('sheaker')
.factory('SheakerClient', function ($resource, SHEAKER_API_URL) {
    var SheakerClient, actions;

    actions = {
        get: {
            skipAuthorization: true
        }
    };

    SheakerClient = $resource(SHEAKER_API_URL + '/clients', {subdomain: '@subdomain'}, actions);
    return SheakerClient;
});
