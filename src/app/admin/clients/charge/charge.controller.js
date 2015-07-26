(function() {
    'use strict';

angular.module('sheaker')
.controller('ChargeClientCtrl', function ($rootScope, $scope, $routeParams, $location, $anchorScroll, GYM_API_URL, User) {

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
    User.get({user_id: $routeParams.id}).$promise
    .then(function(user) {
        user.photo = '//static.sheaker.com/sheaker-gym/assets/images/user_unknow.png';
        if ($scope.formDatas.photo) {
            user.photo = GYM_API_URL + '/' + user.photo;
        }

        User.queryPayments({user_id: user.id}).$promise
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
        calculateEndingDate: function() {
            if (!$scope.formDatas.start_date || !$scope.formDatas.days) {
                return;
            }
            console.log(typeof $scope.formDatas.days);
            $scope.calculatedEndingDate = moment($scope.formDatas.start_date).add($scope.formDatas.days - 1, 'days').format('DD MMM YYYY');
        }
    };

    $scope.chargeUser = function () {
        $scope.isButtonSaveDisabled = true;

        $scope.formDatas.start_date = moment($scope.formDatas.start_date).startOf('day').format();
        $scope.formDatas.end_date = moment($scope.calculatedEndingDate, 'DD MMM YYYY').endOf('day').format();

        User.savePayment({user_id: $scope.user.id}, $scope.formDatas).$promise
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

    $scope.selIdx= -1;

    $scope.selPayment = function(payment, idx) {
        if (idx === $scope.selIdx) {
            $scope.selIdx = -1;
            $scope.selectedPayment = false;
        }
        else {
            $scope.selectedPayment = payment;
            $scope.selIdx = idx;
        }
    };

    $scope.isSelPayment = function(payment) {
        return $scope.selectedPayment === payment;
    };
});

})();
