(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('Payment', Payment);

    function Payment($resource, BACKEND_URL) {
        var resource, actions;

        actions = {
            statsNew: {
                method: 'GET',
                url:     BACKEND_URL + '/payments/stats/new',
                isArray: true
            },
            statsEnding: {
                method: 'GET',
                url:     BACKEND_URL + '/payments/stats/ending',
                isArray: true
            }
        };

        resource = $resource(BACKEND_URL + '/payments/:payment_id', {payment_id: '@payment_id'}, actions);
        return resource;
    }

})();
