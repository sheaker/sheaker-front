(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('GymStatisticsCtrl', GymStatisticsCtrl);

    function GymStatisticsCtrl($rootScope, $scope, User) {

        $scope.newUsers = {
            labels: {},
            data: {},
            series: ['New users by months'],
            onClick: function (points, evt) {
                console.log(points, evt);
            }
        };

        User.getNewUsers().$promise
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
