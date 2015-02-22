'use strict';

angular.module('sheaker')
.controller('AddClientCtrl', function ($rootScope, $scope, User) {

    // Birthdate Calendar
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
    $scope.dt = new Date();
    $scope.status = {
      isopen: false
    };

    // Submit new user to API
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
