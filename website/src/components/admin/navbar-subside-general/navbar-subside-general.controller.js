'use strict';

angular.module('sheaker')
  .controller('NavbarSubSideGeneralCtrl', function ($scope, $location) {
      $scope.isActive = function(path) {
          if ($location.path() === path) {
              return true;
          }
          return false;
      };
  });
