(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('Checkin', Checkin);

    /** @ngInject */
    function Checkin($resource, BACKEND_URL) {
        var resource, customActions;

        customActions = {
            getCheckins: {
                method: 'GET',
                url:     BACKEND_URL + '/checkins/stats/new'
            },
            getCheckinsGraph: {
                method: 'GET',
                url:     BACKEND_URL + '/checkins/graph/new'
            }
        };

        resource = $resource(BACKEND_URL + '/checkins/:checkin_id', { checkin_id: '@checkin_id' }, customActions);

        return resource;
    }

})();
