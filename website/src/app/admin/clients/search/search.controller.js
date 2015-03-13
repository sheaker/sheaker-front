'use strict';

angular.module('sheaker')
.controller('SearchClientCtrl', function ($rootScope, $scope, $location, User) {

    if ($location.search().search) {
        $scope.searchText = $location.search().search;
    }

    $scope.$watch('searchText', function(newValue) {
        $location.search('text', newValue);
    });

    // Load the last 50 clients, order by ID desc
    User.query({limit:50, offset:0, sortingBy:'subscription_date', order:'DESC'}).$promise
    .then(function(usersList) {
        $scope.clientsList = usersList;
    })
    .catch(function(error) {
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retrieving the users.'});
        $location.path('/admin/clients/search');
    });
    // @Todo: load more clients on scroll
    // or in case of a search, if results are empty until API return nothing
});
