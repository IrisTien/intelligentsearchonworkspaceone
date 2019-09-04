(function(module) {
    'use strict';

    module.service('PasswordVaultAppLaunchService', [
                                    'UtilService',
                                    'UserAgent',
                                    'ConfigService',
                                    'LauncherService',
                                    'PasswordVaultService',
                                    function(
                                        UtilService,
                                        UserAgent,
                                        ConfigService,
                                        LauncherService,
                                        PasswordVaultService){
            var pvAppLaunchService = this;
            pvAppLaunchService.checkForPVExtension = UserAgent.isPasswordVaultPluginSupportedBrowser();

            pvAppLaunchService.launchPVApp = function(app, modal) {
                if (pvAppLaunchService.checkForPVExtension && !UserAgent.isPVExtensionMarkedAsInstalled()) {
                    UtilService.showLaunchProgressContainer();
                    PasswordVaultService.pingExtension().then(function (extentionDetected) {
                        UtilService.hideLaunchProgressContainer()
                        if (extentionDetected == true || LauncherService.isSuppressLaunchDialog()) {
                            pvAppLaunchService.openApp(app);
                        } else {
                            if (PasswordVaultService.getPVExtensionDownloadUrl() != '') {
                                showPasswordVaultExtensionDownloadDialog(app, modal);
                            } else {
                                pvAppLaunchService.openApp(app);
                            }
                        }
                    });
                } else {
                    pvAppLaunchService.openApp(app);
                }
            };

            pvAppLaunchService.openApp = function(app) {
                openAppInNewWindow(app);
            }

            function showPasswordVaultExtensionDownloadDialog(app, modal) {
                modal.open('app/launcher/passwordvault/installPasswordVaultExtensionDialog.html', { app: app , modal: modal });
            };

            function openAppInNewWindow(app) {
                window.open(app.launch);
            }
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
