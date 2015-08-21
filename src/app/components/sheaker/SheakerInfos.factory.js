(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('SheakerInfos', SheakerInfos);

    function SheakerInfos($resource, BACKEND_URL) {
        var SheakerInfos, actions;

        actions = {
            get: {
                skipAuthorization: true
            }
        };

        SheakerInfos = $resource(BACKEND_URL + '/infos', null, actions);
        return SheakerInfos;
    }

})();
