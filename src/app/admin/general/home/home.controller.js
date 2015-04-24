'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, $location, User, Checkin) {

    var today = moment();
    var statsToFurtherDate = moment().add(3, 'day');
    var statsToPreviousDate = moment().subtract(3, 'day');

    $scope.staffMember = [0, 0, 0, 0];

    User.query().$promise
    .then(function(usersList) {
        usersList.forEach(function (user) {
            // Calculate if his birthday is in 3 days
            var furtherBirthdate = moment(user.birthdate).add(today.diff(user.birthdate, 'years') + 1, 'years');
            user.hasBirthdayInc = furtherBirthdate.isBetween(today, statsToFurtherDate, 'second');

            // Calculate if his membership (for users which have one) will expire in 3 days
            user.hasInactiveMembershipInc = false;
            if (user.activeMembershipId) {
                user.hasInactiveMembershipInc = moment(user.activeMembership.endDate).isBetween(today, statsToFurtherDate, 'second');
            }

            // Calculate if it's a recent membership (for users which have one)
            user.hasNewActiveMembership = false;
            if (user.activeMembershipId) {
                user.hasNewActiveMembership = moment(user.activeMembership.paymentDate).isBetween(statsToPreviousDate, today, 'second');
            }

            if (user.userLevel !== 0) {
                $scope.staffMember[user.userLevel] += 1;
            }

        });

        $scope.usersList = usersList;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
    });

    Checkin.query({limit:10, offset:0, sortBy:'created_at', order:'DESC'}).$promise
    .then(function (checkin) {
        $scope.checkin = checkin;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving checkins.'});
    });
});
