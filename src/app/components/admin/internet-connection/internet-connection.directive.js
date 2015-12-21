(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('internetConnection', internetConnection)
        .run(checkConnection);

    /** @ngInject */
    function internetConnection() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/admin/internet-connection/internet-connection.html',
            scope: {},
            controller: InternetConnectionController
        };

        return directive;

        /** @ngInject */
        function InternetConnectionController() {}
    }

    /** @ngInject */
    function checkConnection($rootScope, $interval, $resource, BACKEND_URL) {
        var updateIntervalInSec = 1,
            baseBackendCallIntervalInSec = 5;

        $rootScope.app = {
            isOffline: false,
            nextBackendCallInSec: baseBackendCallIntervalInSec
        };

        $interval(update, updateIntervalInSec * 1000);

        function update() {
            if ($rootScope.app.nextBackendCallInSec === 1) {
                $resource(BACKEND_URL, null, {get: {ignoreLoadingBar: true}})
                    .get().$promise
                    .then(function() {
                        $rootScope.app.isOffline = false;
                        baseBackendCallIntervalInSec = 5;
                        $rootScope.app.nextBackendCallInSec = baseBackendCallIntervalInSec;
                    })
                    .catch(function() {
                        $rootScope.app.isOffline = true;
                        baseBackendCallIntervalInSec *= 2;
                        $rootScope.app.nextBackendCallInSec = baseBackendCallIntervalInSec;
                    });
            }
            else {
                $rootScope.app.nextBackendCallInSec -= updateIntervalInSec;
            }
        }
    }

})();
