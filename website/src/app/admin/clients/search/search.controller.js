'use strict';

angular.module('sheaker')
.controller('SearchClientCtrl', function ($scope, $location, User) {

    if ($location.search().search) {
        $scope.searchText = $location.search().search;
    }

    $scope.$watch('searchText', function(newValue) {
        $location.search('text', newValue);

        if (newValue && newValue.length > 3) {
            $scope.clientlist = User.query({'text': newValue});
        }
    });
});
