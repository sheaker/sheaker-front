(function() {
    'use strict';

angular.module('sheaker')
.factory('Checkin', function ($resource, GYM_API_URL) {
    var Checkin, actions;

    actions = {
        statsNew: {
            method: 'GET',
            url: GYM_API_URL + '/checkins/stats/new',
            isArray: true
        }
    };

    Checkin = $resource(GYM_API_URL + '/checkins/:id', {id: '@id'}, actions);
    return Checkin;
});

})();
