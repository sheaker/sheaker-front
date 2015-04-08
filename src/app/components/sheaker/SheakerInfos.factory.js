'use strict';

angular.module('sheaker')
.factory('SheakerInfos', function ($resource, GYM_API_URL) {
    var SheakerInfos, actions;

    actions = {
        get: {
            skipAuthorization: true
        }
    };

    SheakerInfos = $resource(GYM_API_URL + '/infos', null, actions);
    return SheakerInfos;
});
