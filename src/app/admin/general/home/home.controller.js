(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('HomeAdminCtrl', HomeAdminCtrl);

    function HomeAdminCtrl($rootScope, $scope, $location, User, Payment, Checkin) {

        $scope.staffMember = [0, 0, 0, 0];

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

        Payment.getGainsFromDate({from_date: '24/08/2015', to_date: '24/08/2015'}).$promise
        .then(function (gains) {
            $scope.gains.today = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of today.'});
        });

        Payment.getGainsFromDate({from_date: '31/07/2015', to_date: '31/07/2015'}).$promise
        .then(function (gains) {
            $scope.gains.yesterday = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of yesterday.'});
        });

        Payment.getGainsFromDate({from_date: '25/07/2015', to_date: '01/08/2015'}).$promise
        .then(function (gains) {
            $scope.gains.week = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of this week.'});
        });

        Payment.getGainsFromDate({from_date: '01/07/2015', to_date: '31/08/2015'}).$promise
        .then(function (gains) {
            $scope.gains.month = gains.total.value;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving gains of this month.'});
        });
    }

})();
