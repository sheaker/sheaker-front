'use strict';

angular.module('sheaker')
.controller('NavbarSubSideGeneralCtrl', function ($scope, $location) {
    $scope.isActive = function(path) {
        if ($location.path() === path) {
            return true;
        }
        return false;
    };

    $(window).scroll(function() {
        $('.subsidebar').css('top', Math.max(-70, 0 - $(this).scrollTop()));
        $('.headroom--pinned').css('top', Math.max(-75, 0 - $(this).scrollTop()));
    });
});
