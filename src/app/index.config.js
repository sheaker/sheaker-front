(function() {
    'use strict';

angular.module('sheaker')
.config(function ($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = /*@ngInject*/ function(jwtHelper, config, $rootScope, $window, User) {
        // Skip authentication for any requests ending in .html
        if (config.url.substr(config.url.length - 5) === '.html') {
            return null;
        }

        var token = $window.localStorage.getItem('token');
        if (token && jwtHelper.isTokenExpired(token)) {
            return User.renewToken({oldToken: token}).$promise
            .then(function (response) {
                $window.localStorage.setItem('token', response.token);
                var decodedToken = jwtHelper.decodeToken(response.token);
                $rootScope.connectedUser = decodedToken.user;
                return response.token;
            })
            .catch(function (error) {
                console.log(error);
            });
        } else {
            return token;
        }
    };

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push('GymAPIRequestInterceptor');
});

})();
