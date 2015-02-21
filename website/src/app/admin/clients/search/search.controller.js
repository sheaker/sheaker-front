'use strict';

angular.module('sheaker')
.controller('SearchClientCtrl', function ($scope, $location, User) {

    if ($location.search().search) {
        $scope.searchText = $location.search().search;
    }

    $scope.$watch('searchText', function(newValue) {
        $location.search('text', newValue);
    });

    // Load the last 50 clients, order by ID desc
    $scope.clientsList = User.query();
    // @Todo: load more clients on scroll
    // or in case of a search, if results are empty until API return nothing
});
