'use strict';

angular.module('sheaker')
.controller('SearchClientCtrl', function ($rootScope, $scope, $location, $window, User) {

    if ($location.search().text) {
        $scope.searchText = $location.search().text;
    }

    $scope.$watch('searchText', function(newValue) {
        $location.search('text', newValue);
    });

    $scope.usersList = {
        users: [],
        busy: false,
        limit: 50,
        offset: 0,
        noMoreApi: false
    };

    $scope.loadUsers = function () {
        if ($scope.usersList.busy || $scope.usersList.noMoreApi) {
            return;
        }

        $scope.usersList.busy = true;

        User.query({limit:$scope.usersList.limit, offset:$scope.usersList.offset, sortBy:'created_at', order:'DESC'}).$promise
        .then(function(usersList) {
            $scope.usersList.busy = false;

            if (usersList.length === 0) {
                $scope.usersList.noMoreApi = true;
                return;
            }

            $scope.usersList.users = $scope.usersList.users.concat(usersList);
            $scope.usersList.limit *= 2;
            $scope.usersList.offset += usersList.length;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
        });
    };

    $scope.loadUsers();

    $scope.deleteUser = function (user) {
        var sure = $window.confirm('Are you sure you want to delete ' + user.firstName + ' ' + user.lastName + '?');

        if (sure) {
            User.delete({id: user.id}).$promise
            .then(function(user) {
                $rootScope.alerts.push({type: 'success', msg: user.firstName + ' ' + user.lastName + ' has been deleted.'});
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'Error while deleting the user.'});
            });
        }
    };
});
