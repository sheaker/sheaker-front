(function() {
    'use strict';

angular.module('sheaker')
.factory('SheakerClient', function ($resource, BACKEND_URL) {
    var SheakerClient, actions;

    actions = {
        get: {
            skipAuthorization: true
        }
    };

    SheakerClient = $resource(BACKEND_URL + '/clients', {subdomain: '@subdomain'}, actions);
    return SheakerClient;
});

})();
