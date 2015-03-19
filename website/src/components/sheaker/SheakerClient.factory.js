'use strict';

angular.module('sheaker')
.factory('SheakerClient', function ($resource, GYM_API_URL) {
    var SheakerClient, actions;

    actions = {
        get: {
            skipAuthorization: true
        }
    };

    SheakerClient = $resource(GYM_API_URL + '/clients', {subdomain: '@subdomain'}, actions);
    return SheakerClient;
});
