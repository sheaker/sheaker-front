'use strict';

angular.module('sheaker')
.factory('UserPayment', function ($resource, GYM_API_URL) {
    var UserPayment;

    UserPayment = $resource(GYM_API_URL + '/users/:id/charge', {id: '@id'});
    return UserPayment;
});
