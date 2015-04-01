'use strict';

angular.module('sheaker')
.controller('SearchClientCtrl', function ($rootScope, $scope, $location, User, Payment) {

    if ($location.search().text) {
        $scope.searchText = $location.search().text;
    }

    $scope.$watch('searchText', function(newValue) {
        $location.search('text', newValue);
    });

    $scope.usersList = {
        users: [],
        busy: false,
        offset: 0
    };

    $scope.loadUsers = function () {
        if ($scope.usersList.busy) {
            return;
        }

        $scope.usersList.busy = true;

        // Load the last 25 clients, order by ID desc
        User.query({limit:25, offset:$scope.usersList.offset, sortBy:'created_at', order:'DESC'}).$promise
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

            $scope.usersList.users = $scope.usersList.users.concat(usersList);
            $scope.usersList.busy = false;
            $scope.usersList.offset += usersList.length;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users, please contact a developper.'});
        });
    };

    $scope.loadUsers();
});
