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

        Payment.query({user: user.id}).$promise
        .then(function(payments) {
            user.payments = payments;
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
            $scope.lastCheckins = $scope.lastCheckins.concat(user.lastCheckins);
        }
        $scope.user = user;

    }, function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retriving the user informations.'});
        $location.path('/admin/clients/search');
    });

});
