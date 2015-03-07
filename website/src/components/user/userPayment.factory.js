'use strict';

angular.module('sheaker')
.factory('UserPayment', function ($resource, SHEAKER_API_URL) {
    var UserPayment;

    UserPayment = $resource(SHEAKER_API_URL + '/users/:id/charge', {id: '@id'});
    return UserPayment;
});
