(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('EditClientCtrl', EditClientCtrl);

    /** @ngInject */
    function EditClientCtrl($rootScope, $scope, $window, $routeParams, $location, $anchorScroll, $filter, $log, STATIC_URL, User) {

        $scope.isButtonSaveDisabled = false;

        if (typeof $routeParams.id === 'undefined') {
            $rootScope.alertsMsg.warning('Please search a user to edit before going to this page.');
            $location.path('/admin/clients/search');
        }

        // Setup a channel to receive a video property
        // with a reference to the video element
        $scope.channel = {};

        $scope.webcam = {
            isLoading: true,
            hasErrors: false,
            wantNewPhoto: false
        };

        User.get({user_id: $routeParams.id}).$promise
            .then(function(user) {
                $scope.formDatas = user;

                if ($scope.formDatas.birthdate === '0000-00-00') {
                    $scope.formDatas.birthdate = null;
                }
                if ($scope.formDatas.user_level === null) {
                    $scope.formDatas.user_level = 0;
                }

                $scope.formDatas.user_level = $scope.formDatas.user_level.toString();

                var snapshotCanvas = $window.document.querySelector('#snapshot');
                if (snapshotCanvas) {
                    snapshotCanvas.width = 320;
                    snapshotCanvas.height = 240;

                    var ctxSnapshot = snapshotCanvas.getContext('2d');
                    var imageObj = new Image();

                    imageObj.onload = function() {
                        ctxSnapshot.drawImage(this, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
                    };

                    imageObj.src = STATIC_URL + '/sheaker-front/assets/images/user_unknow.png';
                    if ($scope.formDatas.photo) {
                        imageObj.src = $scope.formDatas.photo;
                        // We just need the photo to be displayed, we refill that variable just in case of modifications
                        $scope.formDatas.photo = '';
                    }
                }
            })
            .catch(function(error) {
                $log.error(error);
                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                $location.path('/admin/clients/search');
            });

        // Birthdate Calendar
        $scope.birthdateCal = {
            today: new Date(),
            isOpen: false,
            openCal: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.birthdateCal.isOpen = true;
            }
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
                    // Delete the previous canvas and recreate another
                    var parent = snapshotCanvas.parentNode;
                    var newElement = $window.document.createElement('canvas');
                    newElement.id = 'snapshotActual';
                    parent.insertBefore(newElement, snapshotCanvas);
                    parent.removeChild(snapshotCanvas);

                    snapshotCanvas = newElement;
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
        $scope.editUser = function () {
            $scope.isButtonSaveDisabled = true;

            $scope.formDatas.birthdate = $filter('date')($scope.formDatas.birthdate, 'yyyy-MM-dd');

            User.update({user_id: $scope.formDatas.id}, $scope.formDatas).$promise
                .then(function(/*user*/) {
                    $rootScope.alertsMsg.success('The new user informations has been saved.');
                    $scope.isButtonSaveDisabled = false;
                    $location.hash('top');
                    $anchorScroll();
                    $location.hash('');
                })
                .catch(function(error) {
                    $log.error(error);
                    $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
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
