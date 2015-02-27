'use strict';

angular.module('sheaker')
.factory('UserPayment', function ($resource, API_URL) {
    var UserPayment;

    UserPayment = $resource(API_URL + '/users/:id/charge', {id: '@id'});
    return UserPayment;
});
