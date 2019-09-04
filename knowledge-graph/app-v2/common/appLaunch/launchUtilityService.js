(function(module) {
    'use strict';

    module.service('LaunchUtilityService', [
        'RequestFactory',
        'Resource',
        'ConfigService',
        function(RequestFactory,
                 Resource,
                 ConfigService) {
            var launchUtilityService = this;

            var shouldSuppressLaunchDialog;
            var useNonNPAPIForCitrixLaunch;

            launchUtilityService.setSuppressLaunchDialog = function(shouldSuppressLaunchDialog) {
                this.shouldSuppressLaunchDialog = shouldSuppressLaunchDialog;
            };
            launchUtilityService.isSuppressLaunchDialog = function() {
                return this.shouldSuppressLaunchDialog;
            };

            launchUtilityService.setUseNonNPAPIForCitrixLaunch = function(useNonNPAPIForCitrixLaunch) {
                this.useNonNPAPIForCitrixLaunch = useNonNPAPIForCitrixLaunch;
            };
            launchUtilityService.isUseNonNPAPIForCitrixLaunch = function() {
                return this.useNonNPAPIForCitrixLaunch;
            };

            launchUtilityService.getOta = function(url) {
                return ConfigService.getOtaUrl().then(function(otaUrl) {
                    var req = Resource(otaUrl + '?url=' + url, { method: 'GET', Accept: 'application/json' });
                    return req.get().then(function(otaResponse) {
                        return otaResponse.ota;
                    });
                });
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
