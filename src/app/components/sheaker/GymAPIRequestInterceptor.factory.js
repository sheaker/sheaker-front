(function() {
    'use strict';

angular.module('sheaker')
.factory('GymAPIRequestInterceptor', function ($rootScope, GYM_API_URL) {
    return {
        request: function (request) {
            if (request.url && request.url.indexOf(GYM_API_URL) !== -1 &&
                request.url.indexOf(GYM_API_URL + '/clients') === -1 &&
                request.url.indexOf(GYM_API_URL + '/infos') === -1) {
                request.params = request.params || {};
                angular.extend(request.params, {'id_client': $rootScope.client.id});
            }

            return request;
        }
    };
});

})();
