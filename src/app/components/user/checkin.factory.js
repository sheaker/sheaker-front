(function() {
    'use strict';

angular.module('sheaker')
.factory('Checkin', function ($resource, GYM_API_URL) {
    var Checkin;

    Checkin = $resource(GYM_API_URL + '/checkin/:id', {id: '@id'});
    return Checkin;
});

})();
