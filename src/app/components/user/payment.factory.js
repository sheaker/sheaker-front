(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('Payment', Payment);

    /** @ngInject */
    function Payment($resource, BACKEND_URL) {
        var resource, customActions;

        customActions = {
            getGains: {
                method: 'GET',
                url:     BACKEND_URL + '/payments/stats/gains'
            },
            getGainsGraph: {
                method: 'GET',
                url:     BACKEND_URL + '/payments/graph/gains'
            }
        };

        resource = $resource(BACKEND_URL + '/payments/:payment_id', { payment_id: '@payment_id' }, customActions);

        return resource;
    }

})();
