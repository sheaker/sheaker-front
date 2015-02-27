'use strict';

angular.module('sheaker')
.factory('User', function ($resource, API_URL) {
    var User, actions;

    actions = {
        login: {
            method: 'POST',
            url: API_URL + '/users/login',
            skipAuthorization: true
        },
        update: {
            method:'PUT'
        }
    };

    User = $resource(API_URL + '/users/:id', {id: '@id'}, actions);
    return User;
});
