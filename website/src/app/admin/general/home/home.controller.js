'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, User) {

    /* Filter date */
    $scope.dateToday        = new Date();
    $scope.todayBirthday    = moment($scope.dateToday).format('MM-DD');
    $scope.dateTodayParse   = moment($scope.dateToday).format('YYYY-MM-DD');;

    User.query({offset:0, sortingBy:'subscription_date', order:'DESC'}).$promise
    .then(function(usersList) {
        $scope.clientsList = usersList;
        $scope.clientsTotalNumber = $scope.clientsList.length;
    })
    .catch(function(error) {
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
        $location.path('/admin/clients/search');
    });
});
