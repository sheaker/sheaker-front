(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('Payment', Payment);

    function Payment($resource, BACKEND_URL) {
        var resource, customActions;

        customActions = {
            getGainsFromDate: {
                method: 'GET',
                url:     BACKEND_URL + '/payments/stats/gains'
            }
        };

        resource = $resource(BACKEND_URL + '/payments/:payment_id', { payment_id: '@payment_id' }, customActions);

        return resource;
    }

})();
