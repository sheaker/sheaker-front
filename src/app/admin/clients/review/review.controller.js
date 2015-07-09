'use strict';

angular.module('sheaker')
.controller('ReviewClientCtrl', function ($rootScope, $scope, $routeParams, $location, User, Payment, Checkin, GYM_API_URL) {

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to review before going to this page.'});
        $location.path('/admin/clients/search');
    }

    $scope.formDatas = {};
    $scope.lastCheckins = [];

    User.get({id: $routeParams.id}, function(user) {
        user.photo = '//static.sheaker.com/sheaker-gym/assets/images/user_unknow.png';
        if ($scope.formDatas.photo) {
            user.photo = GYM_API_URL + '/' + user.photo;
        }

        $scope.totalPricePayments = 0;

        Payment.query({user: user.id}).$promise
        .then(function(payments) {
            user.payments = payments;
            for(var i= 0; i < user.payments.length; i++) {
                $scope.totalPricePayments+=user.payments[i].price;
            }
        })
        Checkin.query({user: user.id, limit: 50}).$promise
        .then(function(checkins) {
            $scope.lastCheckins = $scope.lastCheckins.concat(checkins);
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user payments.'});
        });

        if (user.lastCheckins) {
            user.lastCheckins.forEach(function (checkin) {
                var userObject = {
                    user: {
                        id: user.id,
                        customId: user.customId,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                };
                checkin = angular.extend(checkin, userObject);
            });
        }
        $scope.user = user;

    }, function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retriving the user informations.'});
        $location.path('/admin/clients/search');
    });

    /// Collapse Part
    $scope.selIdx= -1;

    $scope.selPayment=function(payment,idx){
        if (idx===$scope.selIdx) {
            $scope.selIdx=-1;
            $scope.selectedPayment=false;
        }
        else {
        $scope.selectedPayment=payment;
        $scope.selIdx=idx;
        }
    }

    $scope.isSelPayment=function(payment){
        return $scope.selectedPayment===payment;
    }
    /// End of collapse

});
