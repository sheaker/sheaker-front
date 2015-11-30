(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl)
        .controller('SearchClientCtrl', SearchClientCtrl);

    /** @ngInject */
    function ModalInstanceCtrl($rootScope, $scope, $modalInstance, user, User) {

        $scope.user = user;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.deleteUser = function () {
            $modalInstance.close();

            User.delete({user_id: user.id}).$promise
                .then(function(user) {
                    $rootScope.alertsMsg.success(user.first_name + ' ' + user.last_name + ' has been deleted.');
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Error while deleting the user.');
                });
        };
    }

    /** @ngInject */
    function SearchClientCtrl($rootScope, $scope, $location, $window, $modal, User) {

        $scope.users = [];
        $scope.searchParams = {
            query: '',
            busy: false,
            limit: 25,
            offset: 0,
            noMoreApi: false
        };

        $scope.search = function () {

            if ($scope.searchParams.query === '') {
                $scope.users = [];
                $scope.searchParams.limit = 25;
                $scope.searchParams.offset = 0;
                $scope.searchParams.noMoreApi = false;

                $scope.loadUsers();
                return;
            }

            User.search({query: $scope.searchParams.query}).$promise
                .then(function (users) {
                    $scope.users = users;
                    $scope.searchParams.noMoreApi = true;
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Error while retrieving queried the users.');
                });
        };

        if ($location.search().query) {
            $scope.searchParams.query = $location.search().query;
            $scope.search();
        }

        $scope.$watch('searchParams.query', function(newValue) {
            $location.search('query', newValue);
        });

        $scope.loadUsers = function () {
            if ($scope.searchParams.busy || $scope.searchParams.noMoreApi || $scope.searchParams.query) {
                return;
            }

            $scope.searchParams.busy = true;

            User.query({limit: $scope.searchParams.limit, offset: $scope.searchParams.offset, sortBy: 'created_at', order: 'desc'}).$promise
                .then(function(users) {
                    if (users.length === 0) {
                        $scope.searchParams.noMoreApi = true;
                        return;
                    }

                    $scope.users = $scope.users.concat(users);

                    $scope.searchParams.limit *= 2;
                    $scope.searchParams.offset += users.length;
                    $scope.searchParams.busy = false;
                })
                .catch(function(error) {
                    console.log(error);
                    $rootScope.alertsMsg.error('Error while retrieving the users.');
                });
        };

        $scope.clearQuery = function () {
            $scope.searchParams.query = '';
            $scope.search();
        };

        $scope.openModal = function (user) {
            $modal.open({
                animation: true,
                templateUrl: 'app/components/admin/modal/deleteUser.template.html',
                controller: 'ModalInstanceCtrl',
                size: 'md',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
        };
    }

})();
