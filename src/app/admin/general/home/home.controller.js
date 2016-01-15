(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('HomeAdminCtrl', HomeAdminCtrl);

    /** @ngInject */
    function HomeAdminCtrl($rootScope, $scope, $location, $log, User, Payment, Checkin, Authorization) {

        var today            = moment().startOf('day').format(),
            startOfYesterday = moment().subtract(1, 'day').startOf('day').format(),
            endOfYesterday   = moment().subtract(1, 'day').endOf('day').format(),
            startOfWeek      = moment().startOf('isoweek').format(),
            startOfMonth     = moment().startOf('month').format(),
            lastXMonths      = moment().subtract(3, 'months').startOf('day').format();

        var adminAutorization = false;
        if (Authorization.authorize(true, ['admin'], 'atLeastOne') === $rootScope.authVars.authorised.authorised) {
            adminAutorization = true;
        }

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
            colours: [{
                fillColor: 'rgba(229, 57, 53, 0.3)',
                strokeColor: 'rgba(229, 57, 53, 0.8)',
                pointColor: "rgba(229, 57, 53,0.8)"
            }],
            chartOptions: {
                scaleShowVerticalLines: false,
                scaleShowHorizontalLines: false,
                scaleShowLabels : false
            }
        };

        User.getActiveUsers().$promise
            .then(function (res) {
                $scope.users.active = res.total;
            })
            .catch(function(error) {
                $log.error(error);
                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
            });

        User.getNewUsers({from_date: startOfWeek}).$promise
            .then(function (res) {
                $scope.users.new = res.total;
            })
            .catch(function(error) {
                $log.error(error);
                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
            });

        if (adminAutorization) {
            Payment.getGains({from_date: today}).$promise
                .then(function (gains) {
                    $scope.gains.today = gains.value;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }

        if (adminAutorization) {
            Payment.getGains({from_date: startOfYesterday, to_date: endOfYesterday}).$promise
                .then(function (gains) {
                    $scope.gains.yesterday = gains.value;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }

        if (adminAutorization) {
            Payment.getGains({from_date: startOfWeek}).$promise
                .then(function (gains) {
                    $scope.gains.week = gains.value;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }

        if (adminAutorization) {
            Payment.getGains({from_date: startOfMonth}).$promise
                .then(function (gains) {
                    $scope.gains.month = gains.value;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                });
        }

        Checkin.getCheckins({from_date: today}).$promise
            .then(function (res) {
                $scope.checkins.check = res.total;
            })
            .catch(function(error) {
                $log.error(error);
                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
            });

        Checkin.getCheckinsGraph({from_date: lastXMonths, interval: 'week'}).$promise
            .then(function(response) {
                $scope.checkinByMonths.labels = response.labels;
                $scope.checkinByMonths.data = response.data;
            })
            .catch(function(error) {
                $log.error(error);
                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
            });
    }

})();
