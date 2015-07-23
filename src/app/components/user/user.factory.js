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
        },
        stats: {
            method: 'GET',
            url: GYM_API_URL + '/users/stats'
        },
        statsNew: {
            method: 'GET',
            url: GYM_API_URL + '/users/stats/new',
            isArray: true
        },
        statsIncBirthday: {
            method: 'GET',
            url: GYM_API_URL + '/users/stats/incbirthday',
            isArray: true
        },
    };

    User = $resource(GYM_API_URL + '/users/:id', {id: '@id'}, actions);
    return User;
});

})();
