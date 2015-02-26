'use strict';

angular.module('sheaker')
.controller('ChargeClientCtrl', function ($rootScope, $scope, $routeParams, $location, User) {
    $scope.formDatas = {};

    $scope.availablepaymentmethods = [
    {name:0},
    {name:1},
    {name:2}
    ];

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

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to charge before going to this page.'});
        $location.path('/admin/clients/search');
    }

    $scope.chargeUser = function () {
        $scope.formDatas.id = $routeParams.id;

        User.charge($scope.formDatas).$promise
        .then(function(data) {
            $rootScope.alerts.push({type: 'success', msg: 'The user has been charged.'});
        })
        .catch(function(error) {
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new charge, please contact a developper.'});
        });
    };
});
