(function() {
    'use strict';

angular.module('sheaker')
.factory('User', function ($resource, BACKEND_URL) {
    var User, actions;

    actions = {
        login: {
            method: 'POST',
            url:     BACKEND_URL + '/users/login',
            skipAuthorization: true
        },
        renewToken: {
            method: 'POST',
            url:    BACKEND_URL + '/users/renew_token',
            skipAuthorization: true
        },
        update: {
            method: 'PUT'
        },
        search: {
            method:  'GET',
            url:     BACKEND_URL + '/users/search',
            isArray: true
        },
        queryPayments: {
            method: 'GET',
            url:     BACKEND_URL + '/users/:user_id/payments',
            isArray: true
        },
        savePayment: {
            method: 'POST',
            url:     BACKEND_URL + '/users/:user_id/payments'
        },
        queryCheckins: {
            method: 'GET',
            url:     BACKEND_URL + '/users/:user_id/checkins',
            isArray: true
        },
        saveCheckin: {
            method: 'POST',
            url:     BACKEND_URL + '/users/:user_id/checkins'
        },
        stats: {
            method: 'GET',
            url:     BACKEND_URL + '/users/stats'
        },
        statsNew: {
            method: 'GET',
            url:     BACKEND_URL + '/users/stats/new',
            isArray: true
        },
        statsIncBirthday: {
            method: 'GET',
            url:     BACKEND_URL + '/users/stats/incbirthday',
            isArray: true
        },
        graphNew: {
            method: 'GET',
            url:     BACKEND_URL + '/users/graph/new'
        },
        graphSex: {
            method: 'GET',
            url:     BACKEND_URL + '/users/graph/sex'
        }
    };

    User = $resource(BACKEND_URL + '/users/:user_id', {user_id: '@user_id'}, actions);
    return User;
});

})();
