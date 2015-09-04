(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('ClientsStatisticsCtrl', ClientsStatisticsCtrl);

    function ClientsStatisticsCtrl($rootScope, $scope, User) {

        $scope.genderRep = {
            labels: {},
            data: {}
        };

        User.getGenderRepartition().$promise
        .then(function(response) {
            $scope.genderRep.labels = response.labels;
            $scope.genderRep.data = response.data;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the graphs.'});
        });
    }

})();
