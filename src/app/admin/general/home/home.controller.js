(function() {
    'use strict';

angular.module('sheaker')
.controller('HomeAdminCtrl', function ($rootScope, $scope, $location, User, Payment, Checkin) {

    var now = moment();
    var today = moment().startOf('day');
    var statsToFurtherDate = moment().add(3, 'day').endOf('day');
    var statsToPreviousDate = moment().subtract(3, 'day').startOf('day');

    $scope.staffMember = [0, 0, 0, 0];

    // Retrieve members stats
    User.stats().$promise
    .then(function (stats) {
        $scope.stats = stats;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving stats of the gym.'});
    });

    // Retrieve last checkins
    Checkin.statsNew().$promise
    .then(function (checkins) {
        $scope.lastCheckins = checkins;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving stats of the last checkins.'});
    });

    // Retrieve new clients
    User.statsNew().$promise
    .then(function (clients) {
        $scope.newClients = clients;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving stats of new clients.'});
    });

    // Retrieve ending memberships
    Payment.statsEnding().$promise
    .then(function (memberships) {
        $scope.endingMemberships = memberships;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving stats of the ending memberships.'});
    });

    // Retrieve new memberships
    Payment.statsNew().$promise
    .then(function (memberships) {
        memberships.forEach(function (user) {
            Payment.get({payment_id: user.active_membership_id}).$promise
            .then(function(payment) {
                user.days = payment.days;
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving payment for new memberships stats.', exp: 5000});
            });
        });

        $scope.newMemberships = memberships;
    })
    .catch(function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving stats of the new memberships.'});
    });
});

})();
