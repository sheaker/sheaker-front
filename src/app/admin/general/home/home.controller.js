'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, $location, User) {

    var today = moment();
    var statsToFurtherDate = moment().add(3, 'day');
    var statsToPreviousDate = moment().subtract(3, 'day');

    User.query().$promise
    .then(function(usersList) {
        usersList.forEach(function (user) {
            // Calculate if his birthday is in now and 3 days
            var furtherBirthdate = moment(user.birthdate).add(today.diff(user.birthdate, 'years') + 1, 'years');
            user.hasBirthdayInc = furtherBirthdate.isBetween(today, statsToFurtherDate, 'day');

            // Calculate if his membership will expire in 3 days
            user.hasInactiveMembershipInc = moment(user.payments.endDate).isBetween(today, statsToFurtherDate, 'day');

            // Calculate if it's a recent membership
            user.hasNewActiveMembership = moment(user.payments.paymentDate).isBetween(statsToPreviousDate, today, 'day');
        });

        $scope.usersList = usersList;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
    });
});
