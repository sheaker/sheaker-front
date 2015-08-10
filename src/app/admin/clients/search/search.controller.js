(function() {
    'use strict';

angular.module('sheaker')
.controller('ModalInstanceCtrl', function ($rootScope, $scope, $modalInstance, user, User) {

    $scope.user = user;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.deleteUser = function () {
        $modalInstance.close();

        User.delete({user_id: user.id}).$promise
        .then(function(user) {
            $rootScope.alerts.push({type: 'success', msg: user.first_name + ' ' + user.last_name + ' has been deleted.'});
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while deleting the user.'});
        });
    };
})
.controller('SearchClientCtrl', function ($rootScope, $scope, $location, $window, $modal, User) {

    $scope.usersList = {
        users: [],
        busy: false,
        limit: 25,
        offset: 0,
        noMoreApi: false
    };

    $scope.search = function () {

        if ($scope.query === '') {
            $scope.usersList.noMoreApi = false;
            $scope.usersList.users = [];
            $scope.usersList.limit = 25;
            $scope.usersList.offset = 0;
            $scope.loadUsers();
        }

        User.search({query: $scope.query}).$promise
        .then(function (users) {
            $scope.usersList.users = users;
            $scope.usersList.noMoreApi = true;
        })
        .catch(function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
        });
    };

    if ($location.search().text) {
        $scope.query = $location.search().query;
        $scope.search();
    }

    $scope.$watch('query', function(newValue) {
        $location.search('query', newValue);
    });

    $scope.loadUsers = function () {
        if ($scope.usersList.busy || $scope.usersList.noMoreApi) {
            return;
        }

        $scope.usersList.busy = true;

        User.query({limit:$scope.usersList.limit, offset:$scope.usersList.offset, sortBy:'created_at', order:'desc'}).$promise
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

    $scope.openModal = function (user) {
        $modal.open({
            animation: true,
            templateUrl: 'app/components/modal/deleteUser.template.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });
    };
});

})();
