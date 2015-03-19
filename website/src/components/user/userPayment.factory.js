'use strict';

angular.module('sheaker')
.factory('UserPayment', function ($resource, GYM_API_URL) {
    var UserPayment;

    UserPayment = $resource(GYM_API_URL + '/payment/:id', {id: '@id'});
    return UserPayment;
});
