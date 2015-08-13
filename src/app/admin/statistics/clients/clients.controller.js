(function() {
    'use strict';

angular.module('sheaker')
.controller('ClientsStatisticsCtrl', function ($scope, User) {

    $scope.series = ['New users by months'];

    User.graphNew().$promise
    .then(function(response) {
        console.log(response);
        $scope.labels = response.labels;
        $scope.data = response.data;
    })
    .catch(function() {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the graphs.'});
    });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});

})();
