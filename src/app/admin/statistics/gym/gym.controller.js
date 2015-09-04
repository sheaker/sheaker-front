(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('GymStatisticsCtrl', GymStatisticsCtrl);

    function GymStatisticsCtrl($rootScope, $scope, User) {
        var startOfYear = moment().startOf('year').format();

        $scope.newUsers = {
            labels: {},
            data: {}
        };

        User.getNewUsers({interval: 'month', from_date: startOfYear}).$promise
        .then(function(response) {
            $scope.newUsers.labels = response.labels;
            $scope.newUsers.data = response.data;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the graphs.'});
        });
    }

})();
