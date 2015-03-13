'use strict';

angular.module('sheaker')
.factory('GymAPIRequestInterceptor', function ($rootScope, GYM_API_URL) {
    return {
        request: function (request) {
            request.headers = request.headers || {};

            if (request.url.indexOf(GYM_API_URL) != -1) {
                angular.extend(request.params, {client: $rootScope.client.id});
            }

            return request;
        }
    };
});
