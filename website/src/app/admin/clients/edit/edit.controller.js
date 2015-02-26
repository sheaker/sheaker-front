'use strict';

angular.module('sheaker')
.controller('EditClientCtrl', function ($rootScope, $scope, $routeParams, $location, User) {

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to edit before going to this page.'});
        $location.path('/admin/clients/search');
    }

    $scope.webcam = {
        isLoading: true,
        hasErrors: false,
        userPhoto: null
    };

    User.get({id: $routeParams.id}, function(user) {
        $scope.formDatas = user;
        $scope.webcam.userPhoto = $scope.formDatas.photo

        var snapshotCanvas = document.querySelector('#snapshot');
        if (snapshotCanvas) {
            snapshotCanvas.width = 320;
            snapshotCanvas.height = 240;

            var ctxSnapshot = snapshotCanvas.getContext('2d');
            var imageObj = new Image();

            imageObj.onload = function() {
                ctxSnapshot.drawImage(this, 0, 0);
            };

            imageObj.src = $scope.formDatas.photo;
        }
    }, function(error) {
        $rootScope.alerts.push({type: 'danger', msg: 'Error while retriving the user informations.'});
        $location.path('/admin/clients/search');
    });

    // Birthdate Calendar
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
    $scope.dt = new Date();
    $scope.status = {
      isopen: false
    };

    var webcam = null,
        patOpts = {x: 0, y: 0, w: 25, h: 25};

    $scope.onWebcamError = function(err) {
        $scope.webcam.hasErrors = err;
    };

    $scope.onWebcamSuccess = function() {
        $scope.webcam.isLoading = false;

        if ($scope.mywebcam) { // null if the webcam is already in use
            webcam = $scope.mywebcam;
            patOpts.w = webcam.width;
            patOpts.h = webcam.height;
        } else {
            $scope.onWebcamError(true);
        }
    };

    var getImageFromVideo = function(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = webcam.width;
        hiddenCanvas.height = webcam.height;

        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(webcam, 0, 0, webcam.width, webcam.height);
        return ctx.getImageData(x, y, w, h);
    };

    $scope.takeSnapshot = function() {
        if (webcam) {
            var snapshotCanvas = document.querySelector('#snapshot');
            if (snapshotCanvas) {
                snapshotCanvas.width = webcam.width;
                snapshotCanvas.height = webcam.height;

                var imgData = getImageFromVideo(patOpts.x, patOpts.y, patOpts.w, patOpts.h);
                var ctxSnapshot = snapshotCanvas.getContext('2d');
                ctxSnapshot.putImageData(imgData, 0, 0);

                $scope.webcam.userPhoto = imgData;
                $scope.formDatas.photo = snapshotCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            }
        }
    };

    // Submit new user to API
    $scope.editUser = function () {
        console.log($scope.formDatas);
        User.update($scope.formDatas).$promise
        .then(function(data) {
            $rootScope.alerts.push({type: 'success', msg: 'The new user informations has been saved.'});
        })
        .catch(function(error) {
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new user, please contact a developper.'});
        });
    };
});
