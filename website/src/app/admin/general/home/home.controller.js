'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, User) {

    /* Filter Birthday */
    $scope.dateToday        = new Date();
    $scope.todayMonth       = moment($scope.dateToday).get('month') + 1;
    $scope.todayDate        = moment($scope.dateToday).get('date');
    $scope.todayBirthday    = $scope.todayMonth + '-' + $scope.todayDate;

    User.query().$promise
    .then(function(usersList) {
        $scope.clientsList = usersList;
    })
    .catch(function(error) {
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
        $location.path('/admin/clients/search');
    });
});
