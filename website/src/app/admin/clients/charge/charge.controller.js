'use strict';

angular.module('sheaker')
.controller('ChargeClientCtrl', function ($rootScope, $scope, $routeParams, $location, $anchorScroll, User, UserPayment) {

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to charge before going to this page.'});
        $location.path('/admin/clients/search');
    }

    $scope.formDatas = {};

    // Available payment methods
    $scope.availablePaymentMethods = [
        {id: 0, name: 'Cash'},
        {id: 1, name: 'Credit Card'},
        {id: 2, name: 'Debit Card'}
    ];

    // Load user
    User.get({id: $routeParams.id}).$promise
    .then(function(user) {
        $scope.user = user;

        // Load payment history
        UserPayment.query({id: $scope.user.id}).$promise
        .then(function(paymentHistory) {
            $scope.paymentHistory = paymentHistory;
        })
        .catch(function(error) {
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user payments, please contact a developper.'});
        });
    })
    .catch(function(error) {
        $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user informations, please contact a developper.'});
    });

    // Calculate ending date
    $scope.calculateEndDate = function () {
        $scope.formDatas.endDate = moment($scope.formDatas.startDate).add($scope.formDatas.days , 'days').format("YYYY-MM-DD");
    };

    // Starting date calendar
    $scope.dt = new Date();
    $scope.status = {
        isopen: false
    };
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

    $scope.chargeUser = function () {
        $scope.formDatas.id = $scope.user.id;

        UserPayment.save($scope.formDatas).$promise
        .then(function(payment) {
            $scope.paymentHistory.push(payment);

            $rootScope.alerts.push({type: 'success', msg: 'The user has been charged.'});
            $location.hash('top');
            $anchorScroll();
            $location.hash('');
        })
        .catch(function(error) {
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new charge, please contact a developper.'});
        });
    };
});
