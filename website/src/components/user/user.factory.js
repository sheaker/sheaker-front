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
        search: {
            method: 'GET',
            url: API_URL + '/users/search',
            skipAuthorization: true
        }
    };

    User = $resource(API_URL + '/users/:id', null, actions);
    return User;
});
