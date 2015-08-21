(function() {
    'use strict';

    angular
        .module('sheaker')
        .config(config);

    /** @ngInject */
    function config($httpProvider, jwtInterceptorProvider, cfpLoadingBarProvider) {
        jwtInterceptorProvider.tokenGetter = getToken;
        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.interceptors.push('backendRequestInterceptor');

        cfpLoadingBarProvider.includeSpinner = false;

        /*@ngInject*/
        function getToken(jwtHelper, config, $rootScope, $window, User) {
            // Skip authentication for any requests ending in .html
            if (config.url.substr(config.url.length - 5) === '.html') {
                return null;
            }

            var token = $window.localStorage.getItem('token');
            if (token && jwtHelper.isTokenExpired(token)) {
                User.renewToken({oldToken: token}).$promise
                    .then(function(response) {
                        $window.localStorage.setItem('token', response.token);
                        var decodedToken = jwtHelper.decodeToken(response.token);
                        $rootScope.connectedUser = decodedToken.user;
                        return response.token;
                    })
                    .catch(function(error) {
                        console.log(error);
                        return null;
                    });
            } else {
                return token;
            }
        }
    }

})();
