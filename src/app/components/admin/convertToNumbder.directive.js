(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('convertToNumber', convertToNumber);

    /** @ngInject */
    function convertToNumber() {
        var directive = {
            link:    linkFct,
            require: 'ngModel'
        };

        return directive;
        ////////////

        function linkFct(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    }

})();
