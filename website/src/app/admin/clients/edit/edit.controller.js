'use strict';

angular.module('sheaker')
.controller('EditClientCtrl', function ($rootScope, $scope, $routeParams, $location) {

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to edit before going to this page.'});
        $location.path('/admin/clients/search');
    }

});
