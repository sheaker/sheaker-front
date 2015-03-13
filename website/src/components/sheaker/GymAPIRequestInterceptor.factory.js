'use strict';

angular.module('sheaker')
.factory('GymAPIRequestInterceptor', function ($rootScope, GYM_API_URL) {
    return {
        request: function (request) {
            if (request.url && request.url.indexOf(GYM_API_URL) != -1) {
                request.params = request.params || {};
                angular.extend(request.params, {client: $rootScope.client.id});
            }

            return request;
        }
    };
});
