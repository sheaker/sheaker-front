(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('Checkin', Checkin);

    function Checkin($resource, BACKEND_URL) {
        var resource, customActions;

        customActions = {
            getCheckinsFromDate: {
                method: 'GET',
                url:     BACKEND_URL + '/checkins/stats/new'
            }
        };

        resource = $resource(BACKEND_URL + '/checkins/:checkin_id', { checkin_id: '@checkin_id' }, customActions);

        return resource;
    }

})();
