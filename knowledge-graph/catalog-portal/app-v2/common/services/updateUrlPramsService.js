(function(module) {
    'use strict';

    module.service('UpdateUrlParamsService', ['$location', '$timeout', '$q', function($location, $timeout, $q) {
        var UpdateUrlParamsService = this;

        // Hide and show nativenav are handle by ios and android clients, GB only passes the params
        UpdateUrlParamsService.hideNativenav = function() {
            var deferred = $q.defer();
            $timeout(function() {
                $location.search('nativenav', 'Hide');
                $location.replace();
                deferred.resolve();
            }, 0);
            return deferred.promise;
        };

        UpdateUrlParamsService.showNativenav = function() {
            var deferred = $q.defer();
                $timeout(function() {
                    $location.search('nativenav', null);
                    $location.replace();
                    deferred.resolve();
                }, 0);
            return deferred.promise;
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

