(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('GymStatisticsCtrl', GymStatisticsCtrl);

    function GymStatisticsCtrl($rootScope, $scope, Payment, User) {
        var startOfYear = moment().startOf('year').format();

        $scope.gains = {
            labels: {},
            data: {}
        };

        $scope.newUsers = {
            labels: {},
            data: {}
        };

        Payment.getGainsGraph({interval: 'month', from_date: startOfYear}).$promise
        .then(function(response) {
            $scope.gains.labels = response.labels;
            $scope.gains.data = response.data;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alertsMsg.error('Error while retrieving gains graphs.');
        });

        User.getNewUsers({interval: 'month', from_date: startOfYear}).$promise
        .then(function(response) {
            $scope.newUsers.labels = response.labels;
            $scope.newUsers.data = response.data;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alertsMsg.error('Error while retrieving new clients graphs.');
        });
    }

})();
