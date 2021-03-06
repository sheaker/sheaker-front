(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('GymStatisticsCtrl', GymStatisticsCtrl);

    /** @ngInject */
    function GymStatisticsCtrl($rootScope, $scope, $log, User, Payment, Checkin) {
        $scope.gains = {
            labels: {},
            data: {}
        };
        $scope.newUsers = {
            labels: {},
            data: {}
        };
        $scope.checkins = {
            labels: {},
            data: {}
        };

        $scope.fromDate = moment().subtract(12, 'months').startOf('day').format();
        $scope.toDate = moment().format();
        $scope.interval = 'month';

        $scope.$watchGroup(['fromDate','toDate', 'interval'], function() {
            getGains();
            getNewUsers();
            getCheckins();
        });

        function getGains() {
            Payment.getGainsGraph({from_date: $scope.fromDate, to_date: $scope.toDate, interval: $scope.interval}).$promise
                .then(function(response) {
                    $scope.gains.labels = response.labels;
                    $scope.gains.data = response.data;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }

        function getNewUsers() {
            User.getNewUsersGraph({from_date: $scope.fromDate, to_date: $scope.toDate, interval: $scope.interval}).$promise
                .then(function(response) {
                    $scope.newUsers.labels = response.labels;
                    $scope.newUsers.data = response.data;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }

        function getCheckins() {
            Checkin.getCheckinsGraph({from_date: $scope.fromDate, to_date: $scope.toDate, interval: $scope.interval}).$promise
                .then(function(response) {
                    $scope.checkins.labels = response.labels;
                    $scope.checkins.data = response.data;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }
    }

})();
