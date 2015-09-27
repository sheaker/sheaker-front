(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('graphOptions', graphOptions);

    function graphOptions() {
        var directive = {
            restrict: 'AE',
            templateUrl: '/app/components/admin/graph/graph-options.template.html',
            replace: true,
            link: link
        };

        return directive;
        ////////////

        function link(scope) {
            scope.availableIntervals = ['year', 'quarter', 'month', 'week', 'day'];

            scope.endOfYesterday = moment().subtract(1, 'day').endOf('day').format();

            scope.fromDateSelector = {
                isOpen: false,
                openCal: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.fromDateSelector.isOpen = true;
                }
            };
            scope.toDateSelector = {
                isOpen: false,
                openCal: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.toDateSelector.isOpen = true;
                }
            };

            scope.dateSelectorsOptions = {
                startingDay: 1
            };
        }
    }

})();
