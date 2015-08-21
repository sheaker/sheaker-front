(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('ReviewClientCtrl', ReviewClientCtrl);

    function ReviewClientCtrl($rootScope, $scope, $routeParams, $location, STATIC_URL, User) {

        if (typeof $routeParams.id === 'undefined') {
            $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to review before going to this page.'});
            $location.path('/admin/clients/search');
        }

        $scope.formDatas = {};
        $scope.lastCheckins = [];

        User.get({user_id: $routeParams.id}, function(user) {
            if (user.photo) {
                user.photo = STATIC_URL + '/sheaker-back/' + user.photo;
            }
            else {
                user.photo = STATIC_URL + '/sheaker-front/assets/images/user_unknow.png';
            }

            $scope.totalPricePayments = 0;

            User.queryPayments({user_id: user.id}).$promise
            .then(function(payments) {
                angular.forEach(payments, function(payment) {
                    $scope.totalPricePayments += payment.price;
                });

                $scope.user.payments = payments;
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user payments.'});
            });

            User.queryCheckins({user_id: user.id}).$promise
            .then(function(checkins) {
                $scope.user.checkins = checkins;
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user checkins.'});
            });

            $scope.user = user;
            if ($scope.user.birthdate) {
            $scope.birthdateFormat = moment($scope.user.birthdate).format('DD MMM YYYY');
            }

        }, function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retriving the user informations.'});
            $location.path('/admin/clients/search');
        });

        /// Collapse Part
        $scope.selIdx = -1;
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
        /// End of collapse
    }

})();
