(function(module) {
    'use strict';

    module.service('PasswordVaultAppLaunchService', [
                                    'ProgressIndicatorService',
                                    'UserAgent',
                                    'ConfigService',
                                    'LaunchUtilityService',
                                    'PasswordVaultService',
                                    'ModalService',
                                    function(
                                        ProgressIndicatorService,
                                        UserAgent,
                                        ConfigService,
                                        LaunchUtilityService,
                                        PasswordVaultService,
                                        ModalService) {
            var pvAppLaunchService = this;
            pvAppLaunchService.checkForPVExtension = UserAgent.isPasswordVaultPluginSupportedBrowser();

            pvAppLaunchService.launchPVApp = function(app) {
                if (pvAppLaunchService.checkForPVExtension && !UserAgent.isPVExtensionMarkedAsInstalled()) {
                    ProgressIndicatorService.showProgressIndicator();
                    PasswordVaultService.pingExtension().then(function(extentionDetected) {
                        ProgressIndicatorService.hideProgressIndicator();
                        if (extentionDetected == true || LaunchUtilityService.isSuppressLaunchDialog()) {
                            pvAppLaunchService.openApp(app);
                        } else if (PasswordVaultService.getPVExtensionDownloadUrl() != '') {
                            showPasswordVaultExtensionDownloadDialog(app);
                        } else {
                            pvAppLaunchService.openApp(app);
                        }
                    });
                } else {
                    pvAppLaunchService.openApp(app);
                }
            };

            pvAppLaunchService.openApp = function(app) {
                openAppInNewWindow(app);
            };

            function showPasswordVaultExtensionDownloadDialog(app) {
                ModalService.getCurrentModal().open('app-v2/common/appLaunch/passwordvault/installPasswordVaultExtensionDialog.html', { app: app });
            }

            function openAppInNewWindow(app) {
                window.open(app.launch);
            }
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
