(function() {
    'use strict';

    angular
        .module('sheaker', [
            'sheaker.config',
            'ngResource',
            'ngRoute',
            'ui.bootstrap',
            'angular-jwt',
            'webcam',
            'ui.bootstrap.showErrors',
            'infinite-scroll',
            'angular-spinkit',
            'headroom',
            'chart.js'
        ]);

})();
