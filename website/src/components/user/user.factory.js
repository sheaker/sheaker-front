'use strict';

angular.module('sheaker')
.factory('User', function ($resource, GYM_API_URL) {
    var User, actions;

    actions = {
        login: {
            method: 'POST',
            url: GYM_API_URL + '/users/login',
            skipAuthorization: true
        },
        renewToken: {
            method: 'POST',
            url: GYM_API_URL + '/users/renew_token',
            skipAuthorization: true
        },
        update: {
            method:'PUT'
        }
    };

    User = $resource(GYM_API_URL + '/users', null, actions);
    return User;
});
