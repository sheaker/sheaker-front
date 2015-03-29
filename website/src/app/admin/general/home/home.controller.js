'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, $location, User, Payment) {
    $scope.usersMemberships = {
        active: 0,
        inactive: 0
    };

    $scope.gym = {
        gainToday: 0
    };

    var today = moment();
    var statsToFurtherDate = moment().add(3, 'day');
    var statsToPreviousDate = moment().subtract(3, 'day');

    User.query().$promise
    .then(function(usersList) {
        usersList.forEach(function (user) {
            user.hasMembershipActive = false;
            user.hasInactiveMembershipInc = false;
            user.hasNewActiveMembership = false;

            // Calculate if his birthday is in now and 3 days
            var furtherBirthdate = moment(user.birthdate).add(today.diff(user.birthdate, 'years') + 1, 'years');
            user.hasBirthdayInc = furtherBirthdate.isBetween(today, statsToFurtherDate, 'day');

            // Load user payments
            Payment.query({user: user.id}).$promise
            .then(function(payments) {
                payments.forEach(function (payment) {
                    delete payment.user; // no need to duplicate user object

                    if (user.hasMembershipActive === false) {
                        user.hasMembershipActive = today.isBetween(payment.startDate, user.membershipEnd);
                    }

                    // Calculate if his membership will expire in 3 days
                    user.membershipEndingDate = moment(payment.startDate).add(payment.days, 'd');
                    user.hasInactiveMembershipInc = user.membershipEndingDate.isBetween(today, statsToFurtherDate, 'day');

                    // format after playing with it, to display it
                    user.membershipEndingDate = user.membershipEndingDate.format();

                    // Calculate if it's a recent membership
                    user.hasNewActiveMembership = moment(payment.paymentDate).isBetween(statsToPreviousDate, today, 'day');

                    // Calculate gym gain for today
                    if (moment(payment.paymentDate).format('YYYY-MM-DD') === today.format('YYYY-MM-DD')) {
                        $scope.gym.gainToday += payment.price;
                    }
                });

                if (user.hasMembershipActive) {
                    $scope.usersMemberships.active += 1;
                } else {
                    $scope.usersMemberships.inactive += 1;
                }

                user.payments = payments;
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving user payments, please contact a developper.'});
            });
        });

        $scope.usersList = usersList;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
    });
});
