'use strict';

angular.module('sheaker')
  .controller('ClientsCtrl', function ($scope) {
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
},
];
  });
