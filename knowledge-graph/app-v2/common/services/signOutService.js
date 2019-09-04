(function(module) {
    'use strict';

    module.service('SignOutService', [
        'hznLocalStorage',
        'ClientRuntimeService',
        'ConfigService',
        'HttpProxyService',
        'UserAgent',
        function(
            hznLocalStorage,
            ClientRuntimeService,
            ConfigService,
            HttpProxyService,
            UserAgent) {
        var signOutService = this;
            signOutService.continueSignOut = function($event) {
            if ($event) {
                $event.preventDefault();
            }
            if (UserAgent.isHubApp()) {
                HttpProxyService.clearAll();
            } else {
                HttpProxyService.clearAllAlongWithEnrollmentStatus();
            }
            HttpProxyService.clearPeopleSearch();
            ConfigService.doNotRefreshCache = true;
            ConfigService.getLogoutUrl().then(function(logoutUrl) {
                delete hznLocalStorage.deviceDetailDelay;
                ClientRuntimeService.logout(logoutUrl);
            });
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
