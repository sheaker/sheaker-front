(function() {
    'use strict';

angular.module('sheaker')
.factory('User', function ($resource, GYM_API_URL) {
    var User, actions;

    actions = {
        login: {
            method: 'POST',
            url: GYM_API_URL + '/login',
            skipAuthorization: true
        },
        renewToken: {
            method: 'POST',
            url: GYM_API_URL + '/renew_token',
            skipAuthorization: true
        },
        update: {
            method:'PUT'
        }
    };

    User = $resource(GYM_API_URL + '/users/:id', {id: '@id'}, actions);
    return User;
});

})();
