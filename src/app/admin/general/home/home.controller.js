(function() {
    'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, $location, User) {

    var now = moment();
    var today = moment().startOf('day');
    var statsToFurtherDate = moment().add(3, 'day').endOf('day');
    var statsToPreviousDate = moment().subtract(3, 'day').startOf('day');

    $scope.staffMember = [0, 0, 0, 0];

    // Count members
    User.query().$promise
    .then(function (clients) {
        $scope.newClients = clients;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the new clients.'});
    });

    // Retrieve last checkins
    Checkin.query({limit: 10, sortBy: 'created_at', order: 'desc'}).$promise
    .then(function (checkins) {
        $scope.lastCheckins = checkins;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the last checkins.'});
    });

    // Retrieve new clients
    User.query({limit: 10, sortBy: 'created_at', order: 'desc'}).$promise
    .then(function (clients) {
        $scope.newClients = clients;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the new clients.'});
    });

    User.query().$promise
    .then(function(usersList) {
        usersList.forEach(function (user) {
            // Calculate if his birthday is in 3 days
            // Add years between birthdate and now to calculate next anniversary
            var furtherBirthdate = moment(user.birthdate).add(today.diff(user.birthdate, 'years') + 1, 'years');
            user.hasBirthdayInc = furtherBirthdate.isBetween(today, statsToFurtherDate, 'second');
            if (user.hasBirthdayInc) {
                user.furtherBirthdate = furtherBirthdate;
            }

            // Calculate if his membership (for users which have one) will expire in 3 days
            user.hasInactiveMembershipInc = false;
            if (user.activeMembershipId) {
                user.hasInactiveMembershipInc = moment(user.activeMembership.endDate).isBetween(today, statsToFurtherDate, 'second');
            }

            // Calculate if it's a recent membership (for users which have one)
            user.hasNewActiveMembership = false;
            if (user.activeMembershipId) {
                user.hasNewActiveMembership = moment(user.activeMembership.paymentDate).isBetween(statsToPreviousDate, now, 'second');
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
});

})();
