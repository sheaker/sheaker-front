'use strict';

angular.module('sheaker')
.controller('AddClientCtrl', function ($rootScope, $scope, User) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.maxDate = new Date();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.addUser = function () {
        var newUser = new User($scope.formDatas);

        newUser
        .$save()
        .then(function(data) {
            $rootScope.alerts.push({type: 'success', msg: 'The new user have been created.'});
        })
        .catch(function(error) {
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new user, please contact a developper.'});
        });
    }
});
