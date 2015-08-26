(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('Checkin', Checkin);

    function Checkin($resource, BACKEND_URL) {
        var resource, actions;

        actions = {
            statsNew: {
                method: 'GET',
                url:     BACKEND_URL + '/checkins/stats/new',
                isArray: true
            }
        };

        resource = $resource(BACKEND_URL + '/checkins/:checkin_id', {checkin_id: '@checkin_id'}, actions);
        return resource;
    }

})();
