(function() {
    'use strict';

angular.module('sheaker')
.controller('ClientsStatisticsCtrl', function ($scope, User) {

    $scope.newclients = {
        labels: {},
        data: {},
        series: ['New users by months'],
        onClick: function (points, evt) {
            console.log(points, evt);
        }
    };

    $scope.genderRep = {
        labels: {},
        data: {}
    };

    User.graphNew().$promise
    .then(function(response) {
        $scope.newclients.labels = response.labels;
        $scope.newclients.data = response.data;
    })
    .catch(function() {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the graphs.'});
    });

    User.graphSex().$promise
    .then(function(response) {
        $scope.genderRep.labels = response.labels;
        $scope.genderRep.data = response.data;
    })
    .catch(function() {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the graphs.'});
    });
});

})();
