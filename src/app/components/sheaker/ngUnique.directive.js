(function() {
    'use strict';

    angular
        .module('sheaker')
        .directive('ngUnique', ngUnique);

    function ngUnique($routeParams, User) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('change paste keyup', function () {
                    if (!ngModel || !element.val()) {
                        element.parent().removeClass('has-success').addClass('has-error');
                        ngModel.$setValidity('unique', false);
                        return;
                    }
                    var resourceObj = {};
                    var currentValue = element.val();

                    resourceObj[attrs.ngUnique] = currentValue;

                    User.get(resourceObj).$promise
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
                });
            }
        };
    }

})();
