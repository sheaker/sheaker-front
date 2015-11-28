(function() {
    'use strict';

    angular
        .module('sheaker')
        .factory('SheakerInfos', SheakerInfos);

    /** @ngInject */
    function SheakerInfos($resource, BACKEND_URL) {
        var resource, actions;

        actions = {
            get: {
                skipAuthorization: true
            }
        };

        resource = $resource(BACKEND_URL + '/infos', null, actions);
        return resource;
    }

})();
