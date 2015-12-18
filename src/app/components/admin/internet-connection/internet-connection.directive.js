(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('internetConnection', internetConnection);

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
        function InternetConnectionController($scope, $interval, $resource, BACKEND_URL) {
            var updateIntervalInSec = 1,
                baseBackendCallIntervalInSec = 5;

            $scope.isOffline = false;
            $scope.nextBackendCallInSec = baseBackendCallIntervalInSec;

            $interval(update, updateIntervalInSec * 1000);

            function update() {
                if ($scope.nextBackendCallInSec === 1) {
                    $resource(BACKEND_URL)
                        .get().$promise
                        .then(function() {
                            $scope.isOffline = false;
                            baseBackendCallIntervalInSec = 5;
                            $scope.nextBackendCallInSec = baseBackendCallIntervalInSec;
                        })
                        .catch(function() {
                            $scope.isOffline = true;
                            baseBackendCallIntervalInSec *= 2;
                            $scope.nextBackendCallInSec = baseBackendCallIntervalInSec;
                        });
                }
                else {
                    $scope.nextBackendCallInSec -= updateIntervalInSec;
                }
            }
        }
    }

})();
