(function() {
    'use strict';

    angular
        .module('sheaker')
        .constant('ClientFlags', {
            'NONE': 0x00,
            'INDEX_ELASTICSEARCH': 0x01
        });

})();
