(function() {
    'use strict';

angular.module('sheaker')
.factory('Payment', function ($resource, GYM_API_URL) {
    var Payment, actions;

    actions = {
        statsNew: {
            method: 'GET',
            url:     GYM_API_URL + '/payments/stats/new',
            isArray: true
        },
        statsEnding: {
            method: 'GET',
            url:     GYM_API_URL + '/payments/stats/ending',
            isArray: true
        }
    };

    Payment = $resource(GYM_API_URL + '/payments/:payment_id', {payment_id: '@payment_id'}, actions);
    return Payment;
});

})();
