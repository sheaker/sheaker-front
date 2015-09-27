(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('GymStatisticsCtrl', GymStatisticsCtrl);

    function GymStatisticsCtrl($rootScope, $scope, Payment, User) {
        $scope.gains = {
            labels: {},
            data: {}
        };
        $scope.newUsers = {
            labels: {},
            data: {}
        };

        $scope.fromDate = moment().startOf('year').format();
        $scope.toDate = moment().format();
        $scope.interval = 'month';

        $scope.$watchGroup(['fromDate','toDate', 'interval'], function() {
            getGains();
            getNewUsers();
        });

        function getGains() {
            Payment.getGainsGraph({from_date: $scope.fromDate, to_date: $scope.toDate, interval: $scope.interval}).$promise
                .then(function(response) {
                    $scope.gains.labels = response.labels;
                    $scope.gains.data = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Error while retrieving gains graphs.');
                });
        }

        function getNewUsers() {
            User.getNewUsers({from_date: $scope.fromDate, to_date: $scope.toDate, interval: $scope.interval}).$promise
                .then(function(response) {
                    $scope.newUsers.labels = response.labels;
                    $scope.newUsers.data = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Error while retrieving new clients graphs.');
                });
        }
    }

})();
