(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('ngUnique', ngUnique);

    /** @ngInject */
    function ngUnique($routeParams, User) {
        var directive = {
            link:     linkFct,
            require:  'ngModel',
            restrict: 'A'
        };

        return directive;
        ////////////

        function linkFct(scope, element, attrs, ngModel) {
            element.bind('change paste keyup', onUpdate);

            function onUpdate() {
                if (!ngModel || !element.val()) {
                    element.parent().removeClass('has-success').addClass('has-error');
                    ngModel.$setValidity('unique', false);
                    return;
                }

                var currentValue = element.val();

                User.get({user_id: currentValue}).$promise
                .then(function () {
                    //Ensure value that being checked hasn't changed
                    if (currentValue === element.val() && currentValue !== $routeParams.id) {
                        ngModel.$setValidity('unique', false);
                        element.parent().removeClass('has-success').addClass('has-error');
                    }
                })
                .catch(function () { // return 404, resource doesn't exist, not really an error here
                    //Ensure value that being checked hasn't changed
                    if (currentValue === element.val() && currentValue !== $routeParams.id) {
                        ngModel.$setValidity('unique', true);
                        element.parent().removeClass('has-error').addClass('has-success');
                    }
                });
            }
        }
    }

})();
