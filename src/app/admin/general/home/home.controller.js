(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('HomeAdminCtrl', HomeAdminCtrl);

    function HomeAdminCtrl($rootScope, $scope, $location, User, Payment, Checkin) {

        var today            = moment().startOf('day').format(),
            startOfYesterday = moment().subtract(1, 'day').startOf('day').format(),
            endOfYesterday   = moment().subtract(1, 'day').endOf('day').format(),
            startOfWeek      = moment().startOf('isoweek').format(),
            startOfMonth     = moment().startOf('month').format(),
            startOfYear      = moment().startOf('year').format();

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

        $scope.checkinByMonths = {
            labels: {},
            data: {},
            series: ['Checkins by months'],
            onClick: function (points, evt) {
                console.log(points, evt);
            }
        };

        User.getActiveUsers().$promise
        .then(function (res) {
            $scope.users.active = res.total;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of today.'});
        });

        User.getNewUsersFromDate({from_date: startOfWeek}).$promise
        .then(function (res) {
            $scope.users.new = res.total;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving new users of this week.'});
        });

        Payment.getGainsFromDate({from_date: today}).$promise
        .then(function (gains) {
            $scope.gains.today = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of today.'});
        });

        Payment.getGainsFromDate({from_date: startOfYesterday, to_date: endOfYesterday}).$promise
        .then(function (gains) {
            $scope.gains.yesterday = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of yesterday.'});
        });

        Payment.getGainsFromDate({from_date: startOfWeek}).$promise
        .then(function (gains) {
            $scope.gains.week = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of this week.'});
        });

        Payment.getGainsFromDate({from_date: startOfMonth}).$promise
        .then(function (gains) {
            $scope.gains.month = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of this month.'});
        });

        Checkin.getCheckinsFromDate({from_date: today}).$promise
        .then(function (res) {
            $scope.checkins.check = res.total;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving checkins of this week.'});
        });

        Checkin.getCheckinsFromDateGraph({from_date: startOfYear, interval: 'month'}).$promise
        .then(function(response) {
            $scope.checkinByMonths.labels = response.labels;
            $scope.checkinByMonths.data = response.data;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving checkins graphs.'});
        });
    }

})();
