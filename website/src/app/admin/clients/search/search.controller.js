'use strict';

angular.module('sheaker')
.controller('SearchClientCtrl', function ($rootScope, $scope, $location, User, Payment) {

    if ($location.search().search) {
        $scope.searchText = $location.search().search;
    }

    $scope.$watch('searchText', function(newValue) {
        $location.search('text', newValue);
    });

    // Load the last 50 clients, order by ID desc
    User.query({limit:50, offset:0, sortBy:'created_at', order:'DESC'}).$promise
    .then(function(usersList) {
        usersList.forEach(function (user) {
            user.hasMembershipActive = false;

            // Load user payments
            Payment.query({user: user.id}).$promise
            .then(function(payments) {
                payments.forEach(function (payment) {
                    delete payment.user; // no need to duplicate user object

                    if (user.hasMembershipActive === false) {
                        user.hasMembershipActive = moment().isBetween(payment.startDate, moment(payment.startDate).add(payment.days, 'd'));
                    }
                });

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
        $location.path('/admin/clients/search');
    });
    // @Todo: load more clients on scroll
    // or in case of a search, if results are empty until API return nothing
});
