'use strict';

angular.module('sheaker')
.factory('Payment', function ($resource, GYM_API_URL) {
    var Payment;

    Payment = $resource(GYM_API_URL + '/payments/:id', {id: '@id'});
    return Payment;
});
