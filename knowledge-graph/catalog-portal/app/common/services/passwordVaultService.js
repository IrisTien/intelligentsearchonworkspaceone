(function(module) {
    'use strict';

    module.service('PasswordVaultService', [
                        '$q',
                        '$timeout',
                        'Resource',
                        'ConfigService',
                        'SettingsService',
                        function(
                                $q,
                                $timeout,
                                Resource,
                                ConfigService,
                                SettingsService){
        var TIME_TO_WAIT = 2000; //wait time before pinging the extension and later on wait till the call back is executed.
        var pvService = this;

        pvService.extensionDetected = false;
        pvService.pvExtensionDownloadUrl = '';
        pvService.hasPvApps = false;

        pvService.setHasPvApps = function(hasPvApps) {
            pvService.hasPvApps = hasPvApps;
        };

        pvService.getHasPvApps = function() {
            return pvService.hasPvApps;
        };

        pvService.setPVExtensionDownloadUrl = function(downloadUrl) {
            pvService.pvExtensionDownloadUrl = downloadUrl;
        };

        pvService.getPVExtensionDownloadUrl = function() {
            return pvService.pvExtensionDownloadUrl
        };

        pvService.pingExtension = function () {
            var defer = $q.defer();
            if (pvService.getHasPvApps()) {
                ConfigService.getPasswordVaultRootUrl().then(function (pvRootUrl) {
                    if (pvRootUrl) {
                        var branding = SettingsService.getCurrentBranding();

                        // In Some Browsers like IE the CustomEvent is not available.
                        // This is a polyfill for that.
                        (function () {

                            if ( typeof window.CustomEvent === "function" ) return false;

                            function CustomEvent ( event, params ) {
                                params = params || { bubbles: false, cancelable: false, detail: undefined };
                                var evt = document.createEvent( 'CustomEvent' );
                                evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
                                return evt;
                            }

                            CustomEvent.prototype = window.Event.prototype;

                            window.CustomEvent = CustomEvent;
                        })();

                        var event = new CustomEvent('ping', {detail: {url: pvRootUrl, name: branding.pageTitle}});
                        event.callback = pingCallback;

                        var pvConduit = document.getElementById("PVConduit");
                        if (pvConduit && !pvService.extensionDetected) {
                            pvConduit.dispatchEvent(event);
                        }
                        $timeout(function () {
                            defer.resolve(pvService.extensionDetected);
                        }, TIME_TO_WAIT);
                    }
                });
            }
            return defer.promise;
        };

        function pingCallback(pvExtensionVersion, linkedWithCurrentvIDM) {
            // pvExtensionVersion - Password Vault Extension Version.
            // linkedWithCurrentvIDM - Boolean value to indicate if the extension is linked to current vIDM.
            // Currently we are not making use of these 2 callback parameters.
            pvService.extensionDetected = true;
        }
}]);

})(angular.module('com.vmware.greenbox.appCenter'));
