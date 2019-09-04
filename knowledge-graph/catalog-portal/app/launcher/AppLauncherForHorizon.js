(function(module) {
    'use strict';
    module.service('AppLauncherForHorizon', ['LauncherService', 'UtilService', 'HorizonClientScheme',
        function(LauncherService, UtilService, HorizonClientScheme) {

            //Service functions
            this.launch = function(app) {
                if (!app || !app.launch) {
                    return;
                }

                var launchParams = {
                    url: app.launch,
                    itemName: app.name
                };

                switch(app.subType) {
                    case "XENAPP":
                    case "XENAPPDELIVERYGROUP":
                        LauncherService.getOta(app.launch).then(function(ota) {
                            launchParams.url += '?ota=' + ota;
                            UtilService.openLinkInIframe(UtilService.buildScheme(
                                HorizonClientScheme.XENAPP_LAUNCH, launchParams));
                        });
                        break;
                    case "VIEWPOOL":
                    case "VIEWAPP":
                    case "DESKTONEDESKTOP":
                    case "DESKTONEAPPLICATION":
                        UtilService.openLinkInIframe(UtilService.buildScheme(
                            HorizonClientScheme.VIEW_LAUNCH, launchParams));
                        break;
                    default:
                        LauncherService.getOta(app.launch).then(function(ota) {
                            _openAppWithOTA(app, ota);
                        });
                }
            };

            /**
             *
             * Using iframe for launching the SAAS application
             * helps to retain the current webview on Jade & Horizon
             *
             * @param app App to be launched
             * @param ota OTA token
             * @private
             */
            function _openAppWithOTA(app, ota) {
                app.launching = false;
                var launchParams = {
                    url: app.launch + '?ota=' + ota
                };
                UtilService.openURIScheme(UtilService.buildScheme(
                    HorizonClientScheme.SAAS_LAUNCH, launchParams));
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));