'use strict';

angular.module('sheaker')
.controller('ChargeClientCtrl', function ($rootScope, $scope, $routeParams, $location, $anchorScroll, User, Payment, GYM_API_URL) {

    $scope.isButtonSaveDisabled = false;

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to charge before going to this page.'});
        $location.path('/admin/clients/search');
    }

    $scope.formDatas = {};
    $scope.beenCustomDays = false;
    $scope.formDatas.days = 31;

    // Available payment methods
    $scope.availablePaymentMethods = [
        {id: 0, name: 'Cash'},
        {id: 1, name: 'Credit Card'},
        {id: 2, name: 'Debit Card'}
    ];

    // Load user
    User.get({id: $routeParams.id}).$promise
    .then(function(user) {
        user.photo = '//static.sheaker.com/sheaker-gym/assets/images/user_unknow.png';
        if ($scope.formDatas.photo) {
            user.photo = GYM_API_URL + '/' + user.photo;
        }

        Payment.query({user: user.id}).$promise
        .then(function(payments) {
            user.payments = payments;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user payments.'});
        });

        $scope.user = user;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user informations.'});
    });

    $scope.setNumberDaysInput = function () {
        if (!$scope.beenCustomDays) {
            $scope.formDatas.days = 31;
        }
        else {
            $scope.formDatas.days = null;
        }
    };

    // Payment calendar
    $scope.paymentCal = {
        isOpen: false,
        openCal: function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.paymentCal.isOpen = true;
        },
        calculateEndDate: function() {
            $scope.formDatas.endDate = moment($scope.formDatas.startDate).add($scope.formDatas.days, 'days');
        }
    };

    $scope.chargeUser = function () {
        $scope.formDatas.user = $scope.user.id;
        $scope.isButtonSaveDisabled = true;

        Payment.save($scope.formDatas).$promise
        .then(function(payment) {
            $scope.user.payments.push(payment);

            $rootScope.alerts.push({type: 'success', msg: 'The user has been charged.'});
            $location.hash('top');
            $anchorScroll();
            $location.hash('');
            $scope.isButtonSaveDisabled = false;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new charge.'});
            $scope.isButtonSaveDisabled = false;
        });
    };
});
