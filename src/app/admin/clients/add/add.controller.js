(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('AddClientCtrl', AddClientCtrl);

    function AddClientCtrl($rootScope, $scope, $window, $location, $anchorScroll, User) {
        $scope.formDatas = {};

        $scope.isButtonSaveDisabled = false;

        $scope.formDatas.user_level = 0;
        $scope.formDatas.user_level = $scope.formDatas.user_level.toString();

        $scope.birthdateCal = {
            today: new Date(),
            isOpen: false,
            openCal: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.birthdateCal.isOpen = true;
            }
        };

        // Setup a channel to receive a video property
        // with a reference to the video element
        $scope.channel = {};

        $scope.webcam = {
            isLoading: true,
            hasErrors: false,
            wantNewPhoto: true
        };
        var webcam = null,
            patOpts = {x: 0, y: 0, w: 25, h: 25};

        $scope.onWebcamError = function(err) {
            $scope.webcam.hasErrors = err;
        };

        $scope.onWebcamSuccess = function() {
            $scope.webcam.isLoading = false;
            webcam = $scope.channel.video;
            patOpts.w = webcam.width;
            patOpts.h = webcam.height;
        };

        var getImageFromVideo = function(x, y, w, h) {
            var hiddenCanvas = $window.document.createElement('canvas');
            hiddenCanvas.width = webcam.width;
            hiddenCanvas.height = webcam.height;

            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(webcam, 0, 0, webcam.width, webcam.height);
            return ctx.getImageData(x, y, w, h);
        };

        $scope.takeSnapshot = function() {
            if (webcam) {
                $scope.webcam.wantNewPhoto = false;

                var snapshotCanvas = $window.document.querySelector('#snapshot');
                if (snapshotCanvas) {
                    snapshotCanvas.width = webcam.width;
                    snapshotCanvas.height = webcam.height;

                    var imgData = getImageFromVideo(patOpts.x, patOpts.y, patOpts.w, patOpts.h);
                    var ctxSnapshot = snapshotCanvas.getContext('2d');
                    ctxSnapshot.putImageData(imgData, 0, 0);

                    $scope.formDatas.photo = snapshotCanvas.toDataURL('image/jpeg', 0.5);
                }
            }
        };

        // Submit new user to API
        $scope.addUser = function () {
            $scope.isButtonSaveDisabled = true;

            User.save($scope.formDatas).$promise
            .then(function(user) {
                $rootScope.alerts.push({type: 'success', msg: 'The new user has been created with id: ' + user.id + '.'});
                $scope.formDatas = {};
                $scope.isButtonSaveDisabled = false;
                $location.hash('top');
                $anchorScroll();
                $location.hash('');
            })
            .catch(function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'An error happen while submitting new user.'});
                $scope.isButtonSaveDisabled = false;
            });
        };

        $scope.helpPopoverAccessLevel = {
            templateUrl: 'app/components/admin/modal/help-popover-accessLevel.template.html',
            title: 'Access level'
        };

        $scope.helpPopoverSponsor = {
            templateUrl: 'app/components/admin/modal/help-popover-sponsor.template.html',
            title: 'Sponsor'
        };
    }

})();
