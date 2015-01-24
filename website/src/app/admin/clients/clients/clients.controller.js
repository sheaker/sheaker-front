'use strict';

angular.module('sheaker')
.controller('ClientsCtrl', function ($scope, $location) {

    if ($location.search().search)
        $scope.searchText = $location.search().search;

    $scope.$watch('searchText', function(newValue, oldValue) {
        $location.search('search', newValue);
    });

    $scope.clientlist= [
    {
        'id': '1',
        'name': 'Justin',
        'lastname': 'Mariette',
        'subscription': 'true',
    },
    {
        'id': '2',
        'name': 'Paul',
        'lastname': 'Lulu',
        'subscription': 'true',
    },
    {
        'id': '3',
        'name': 'Plop',
        'lastname': 'Mama',
        'subscription': 'true',
    },
    {
        'id': '4',
        'name': 'Mamadous',
        'lastname': 'Coulibali',
        'subscription': 'true',
    },
    {
        'id': '5',
        'name': 'Jusdd',
        'lastname': 'Ted',
        'subscription': 'false',
    },
    {
        'id': '6',
        'name': 'Frank',
        'lastname': 'bite',
        'subscription': 'true',
    }
    ];
});
