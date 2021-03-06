(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('ChargeClientCtrl', ChargeClientCtrl);

    /** @ngInject */
    function ChargeClientCtrl($rootScope, $scope, $routeParams, $location, $anchorScroll, $log, STATIC_URL, User) {

        $scope.isButtonSaveDisabled = false;

        if (typeof $routeParams.id === 'undefined') {
            $rootScope.alertsMsg.warning('Please search a user to charge before going to this page.');
            $location.path('/admin/clients/search');
        }

        $scope.formDatas = {
            days: 31
        };
        $scope.beenCustomDays = false;

        // Available payment methods
        $scope.availablePaymentMethods = [
            {id: 0, name: 'Cash'},
            {id: 1, name: 'Credit Card'},
            {id: 2, name: 'Debit Card'}
        ];

        // Load user
        User.get({user_id: $routeParams.id}).$promise
            .then(function(user) {
                if (!user.photo) {
                    user.photo = STATIC_URL + '/sheaker-front/assets/images/user_unknow.png';
                }

                $scope.totalPricePayments = 0;

                User.queryPayments({user_id: user.id}).$promise
                    .then(function(payments) {
                        angular.forEach(payments, function(payment) {
                            $scope.totalPricePayments += parseInt(payment.price);
                        });

                        $scope.user.payments = payments;
                    })
                    .catch(function(error) {
                        $log.error(error);
                        $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                    });

                $scope.user = user;
            })
            .catch(function(error) {
                $log.error(error);
                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                $location.path('/admin/clients/search');
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

                    $rootScope.alertsMsg.success('The user has been charged.');
                    $location.hash('top');
                    $anchorScroll();
                    $location.hash('');
                    $scope.isButtonSaveDisabled = false;
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
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

        $scope.helpPopoverCustomDays = {
            templateUrl: 'app/components/admin/modal/help-popover-customDays.template.html',
            title: 'Custom Days'
        };
    }

})();
