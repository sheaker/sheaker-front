'use strict';

angular.module('sheaker')
.controller('EditClientCtrl', function ($rootScope, $scope, $routeParams, $location, $anchorScroll, GYM_API_URL, User) {

    $scope.isButtonSaveDisabled = false;

    if (typeof $routeParams.id === 'undefined') {
        $rootScope.alerts.push({type: 'warning', msg: 'Please search a user to edit before going to this page.'});
        $location.path('/admin/clients/search');
    }

    $scope.webcam = {
        isLoading: true,
        hasErrors: false,
        wantNewPhoto: false
    };

    User.get({id: $routeParams.id}, function(user) {
        $scope.hasCustomId = user.customId ? true : false;
        $scope.formDatas = user;

        var snapshotCanvas = document.querySelector('#snapshot');
        if (snapshotCanvas) {
            snapshotCanvas.width = 320;
            snapshotCanvas.height = 240;

            var ctxSnapshot = snapshotCanvas.getContext('2d');
            var imageObj = new Image();

            imageObj.onload = function() {
                ctxSnapshot.drawImage(this, 0, 0);
            };

            imageObj.src = GYM_API_URL + '/' + $scope.formDatas.photo;
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
            $scope.onWebcamError({error: 'Can\'t load webcam feed'});
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
            $scope.webcam.wantNewPhoto = false;

            var snapshotCanvas = document.querySelector('#snapshot');
            if (snapshotCanvas) {
                // Delete the previous canvas and recreate another
                var parent = snapshotCanvas.parentNode;
                var newElement = document.createElement('canvas');
                newElement.id = 'snapshotActual';
                parent.insertBefore(newElement, snapshotCanvas);
                parent.removeChild(snapshotCanvas);

                snapshotCanvas = newElement;
                snapshotCanvas.width = webcam.width;
                snapshotCanvas.height = webcam.height;

                var imgData = getImageFromVideo(patOpts.x, patOpts.y, patOpts.w, patOpts.h);
                var ctxSnapshot = snapshotCanvas.getContext('2d');
                ctxSnapshot.putImageData(imgData, 0, 0);

                $scope.formDatas.photo = snapshotCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            }
        }
    };

    // Submit new user to API
    $scope.editUser = function () {
        if ($scope.hasCustomId === false && $scope.formDatas.customId) {
            $scope.formDatas.customId = 0;
        }
        $scope.isButtonSaveDisabled = true;

        User.update($scope.formDatas).$promise
        .then(function(data) {
            $rootScope.alerts.push({type: 'success', msg: 'The new user informations has been saved.'});
            $location.hash('top');
            $anchorScroll();
            $location.hash('');
            $scope.isButtonSaveDisabled = false;
        })
        .catch(function(error) {
            $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new user, please contact a developper.'});
            $scope.isButtonSaveDisabled = false;
        });
    };
});
