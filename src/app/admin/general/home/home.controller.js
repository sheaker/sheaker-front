(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('HomeAdminCtrl', HomeAdminCtrl);

    function HomeAdminCtrl($rootScope, $scope, $location, User, Payment, Checkin) {

        var todayDate        = moment().format('DD/MM/YYYY'),
            yesterdayDate    = moment().subtract(1, 'day').format('DD/MM/YYYY'),
            startOfWeekDate  = moment().startOf('week').format('DD/MM/YYYY'),
            startOfMonthDate = moment().startOf('month').format('DD/MM/YYYY');

        $scope.users = {
            active: 0,
            new:    0
        };

        $scope.gains = {
            today:     0,
            yesterday: 0,
            week:      0,
            month:     0
        };

        $scope.checkins = {
            check: 0
        };

        Payment.getGainsFromDate({from_date: todayDate}).$promise
        .then(function (gains) {
            $scope.gains.today = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of today.'});
        });

        Payment.getGainsFromDate({from_date: yesterdayDate, to_date: yesterdayDate}).$promise
        .then(function (gains) {
            $scope.gains.yesterday = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of yesterday.'});
        });

        Payment.getGainsFromDate({from_date: startOfWeekDate}).$promise
        .then(function (gains) {
            $scope.gains.week = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of this week.'});
        });

        Payment.getGainsFromDate({from_date: startOfMonthDate}).$promise
        .then(function (gains) {
            $scope.gains.month = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of this month.'});
        });
    }

})();
