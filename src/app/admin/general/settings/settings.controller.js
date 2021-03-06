(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('SettingsCtrl', SettingsCtrl);

    /** @ngInject */
    function SettingsCtrl($scope) {

        $scope.isButtonSaveDisabled = false;

        $scope.formDatas = {};

        $scope.days = [
            {id: 0, day: 'Monday'},
            {id: 1, day: 'Tuesday'},
            {id: 2, day: 'Wednesday'},
            {id: 3, day: 'Thursday'},
            {id: 4, day: 'Friday'},
            {id: 5, day: 'Saturday'},
            {id: 6, day: 'Sunday'},
        ];

        $scope.mytime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.changed = function () {
            //$log.log('Time changed to: ' + $scope.mytime);
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };
    }

})();
