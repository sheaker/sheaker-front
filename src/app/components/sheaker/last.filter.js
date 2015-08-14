(function() {
    'use strict';

    angular.module('sheaker')
    .filter('last', function() {
        return function(collection) {
            return collection && collection.length && collection[collection.length - 1] || '';
        }
    });

})();
