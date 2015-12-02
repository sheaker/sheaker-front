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
        $httpProvider.interceptors.push('backendResponseInterceptor');

        cfpLoadingBarProvider.includeSpinner = false;

        /** @ngInject */
        function getToken(config, $window) {
            // Skip authentication for any requests ending in .html
            if (config.url.substr(config.url.length - 5) === '.html') {
                return null;
            }

            return $window.localStorage.getItem('token');
        }
    }

})();
