(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('routeLoadingIndicator', routeLoadingIndicator);

    function routeLoadingIndicator($rootScope) {
        return {
            restrict: 'E',
            template:   '<div ng-show="isRouteLoading" class="loading-indicator">'+
                        '<div class="loading-indicator-body">' +
                        '<div class="spinner"><circle-spinner></circle-spinner></div>' +
                        '</div>' +
                        '</div>',
            replace: true,
            link: function(scope) {
                scope.isRouteLoading = false;

                $rootScope.$on('$routeChangeStart', function() {
                    scope.isRouteLoading = true;
                });
                $rootScope.$on('$routeChangeSuccess', function() {
                    scope.isRouteLoading = false;
                });
                $rootScope.$on('$routeChangeError', function() {
                    scope.isRouteLoading = false;
                });
            }
        };
    }

})();
