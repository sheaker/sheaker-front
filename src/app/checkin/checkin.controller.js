'use strict';

angular.module('sheaker')
.controller('CheckinCtrl', function ($rootScope, $scope, $location, $timeout, User, Checkin, GYM_API_URL) {

    var today = moment();

    $scope.checkin = function (userId) {
        User.get({id: userId}, function(user) {
            user.photo = GYM_API_URL + '/' + user.photo;

            user.remainingDays = 0;
            if (user.activeMembershipId) {
                user.remainingDays = today.subtract(user.payments.endDate).days();
            }

            Checkin.save({user: user.id}).$promise
            .then(function () {
                $scope.userCheckin = user;
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'An error happen while checked in the user.', exp: 5000});
            });

            $timeout(function() {
                $scope.userCheckin = null;
                $scope.userCheckinId = null;
            }, 5000);
        }, function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'This user doesn\'t exist.', exp: 5000});
        });

    };
});
