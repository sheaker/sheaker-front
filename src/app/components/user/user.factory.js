(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('User', User);

    /** @ngInject */
    function User($resource, BACKEND_URL) {
        var resource, customActions;

        customActions = {
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
            getActiveUsers: {
                method: 'GET',
                url:     BACKEND_URL + '/users/stats/active'
            },
            getNewUsers: {
                method: 'GET',
                url:     BACKEND_URL + '/users/stats/new'
            },
            getNewUsersGraph: {
                method: 'GET',
                url:     BACKEND_URL + '/users/graph/new'
            },
            getGenderRepartition: {
                method: 'GET',
                url:     BACKEND_URL + '/users/graph/sex'
            }
        };

        resource = $resource(BACKEND_URL + '/users/:user_id', { user_id: '@user_id' }, customActions);

        return resource;
    }

})();
