(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('ClientsStatisticsCtrl', ClientsStatisticsCtrl);

    /** @ngInject */
    function ClientsStatisticsCtrl($rootScope, $scope, User) {
        $scope.genderRep = {
            labels: {},
            data: {}
        };

        $scope.fromDate = moment().startOf('year').format();
        $scope.toDate = moment().format();
        $scope.interval = 'month';

        $scope.$watchGroup(['fromDate','toDate', 'interval'], function() {
            getGenderRepartition();
        });

        function getGenderRepartition() {
            User.getGenderRepartition({from_date: $scope.fromDate, to_date: $scope.toDate}).$promise
                .then(function(response) {
                    $scope.genderRep.labels = response.labels;
                    $scope.genderRep.data = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Error while retrieving the graphs.');
                });
        }
    }

})();
