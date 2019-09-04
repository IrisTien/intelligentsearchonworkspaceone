(function(module) {
    'use strict';
    module.service('AppLaunchService', [
        'UtilService',
        'UserAgent',
        'Localization',
        'ClientRuntimeService',
        'hznLocalStorage',
        'ModalService',
        'LaunchUtilityService',
        'ConfigService',
        'HttpProxyService',
        'SignOutService',
        'EventsService',
        function(
            UtilService,
            UserAgent,
            Localization,
            ClientRuntimeService,
            hznLocalStorage,
            ModalService,
            LaunchUtilityService,
            ConfigService,
            HttpProxyService,
            SignOutService,
            EventsService) {
            var appLaunchService = this;
            var isHubApp = UtilService.isHub();

            appLaunchService.launchApp = function(app) {
                if (app.type === 'OKTA') {
                    appLaunchService.launchOktaApp(app);
                } else if (appLaunchService.checkIfNativeClientIsInstalledFor(app)) {
                    ClientRuntimeService.launchApp(app);
                }
            };

            appLaunchService.launchOktaApp = function(app) {
                if (app.type !== 'OKTA') {
                    return;
                }
                if (!appLaunchService.isOktaAppLaunchSupporedWebView()) {
                    ClientRuntimeService.launchApp(app);
                    return;
                }
                // If this is an OKTA app and if the current view is Native app
                // Then check if the device enrollment status changed from container enrolled to MDM Enrolled.
                // If so clear the local storage and proceed to logout.

                // iOS WS1 app when a device goes from unmanged to managed, the deviceID is changes
                // hence for the new device ID the previous values are not correct
                // and there is no way to correlate the 2 device IDs in the UI.
                // Hence storing a different variable for enrollemnt status and mgmt status from the
                // existing one in local storage just for this Okta launch
                var prevEnrollmentStatus = HttpProxyService.getDeviceEnrollmentStatusForOktaAppLaunch();
                var prevDeviceMgmtStatus = HttpProxyService.getDeviceMgmtStatusForOktaAppLaunch();
                var isDeviceSteppedUp = HttpProxyService.getStepupStatusForOktaAppLaunch();
                // If the device is already in MDM managed state then just launch the app
                if (!isDeviceSteppedUp && 'MDM' === prevDeviceMgmtStatus && 'ENROLLED' === prevEnrollmentStatus) {
                    ClientRuntimeService.launchApp(app);
                    return;
                }
                // Query for the device reg details.
                ConfigService.getDeviceRegistrationDetail().then(function(deviceDetails) {
                    if (!deviceDetails) {
                        ClientRuntimeService.launchApp(app);
                        return;
                    }
                    deviceDetails.get().then(function(deviceStatus) {
                        var deviceMgmtDetails = deviceStatus.deviceMgmtDetails;
                        if (!deviceMgmtDetails) {
                            ClientRuntimeService.launchApp(app);
                            return;
                        }
                        var deviceEnrollStatusType = deviceMgmtDetails.deviceEnrollStatusType;
                        var deviceMgmtStatus = deviceMgmtDetails.deviceMgmtType;
                        // store the current Enrollement state and Mgmt state in local storage
                        if (deviceMgmtStatus) {
                            HttpProxyService.setDeviceMgmtStatusForOktaAppLaunch(deviceMgmtStatus);
                        }
                        if (deviceEnrollStatusType) {
                            HttpProxyService.setDeviceEnrollmentStatusForOktaAppLaunch(deviceEnrollStatusType);
                        }
                        // if current state is MDM enrolled
                        if ('MDM' === deviceMgmtStatus && 'ENROLLED' === deviceEnrollStatusType) {
                            // If the previous state empty means this is the first time here
                            // And the device is already managed.
                            // Hence no need to do anything and proceed to the Launch
                            if (isDeviceSteppedUp) { // Means device has gone through adaptive Mgmt or Direct enrollment. Hence state is changed.
                                HttpProxyService.clearAllAlongWithEnrollmentStatus();
                                SignOutService.continueSignOut();
                            } else if (!prevEnrollmentStatus && !prevDeviceMgmtStatus) {
                                if (isHubApp) {
                                    EventsService.addHubEventWithUrl('LAUNCH_APP', app.appId);
                                    SignOutService.continueSignOut();
                                } else {
                                    // this means started with MDM managed device
                                    ClientRuntimeService.launchApp(app);
                                }
                            } else { // Means the device state changed. Hence signout.
                                HttpProxyService.clearAllAlongWithEnrollmentStatus();
                                SignOutService.continueSignOut();
                            }
                        } else {
                            ClientRuntimeService.launchApp(app);
                        }
                    }, function() {
                        ClientRuntimeService.launchApp(app);
                    });
                });
            };

            appLaunchService.isOktaAppLaunchSupporedWebView = function(app) {
                return UserAgent.isNativeAppVersionIsEqualOrAbove('2.1') && UtilService.getQueryParams().deviceUdid && !UserAgent.isAndroid();
            };

            appLaunchService.checkIfNativeClientIsInstalledFor = function(app) {
                if (LaunchUtilityService.isSuppressLaunchDialog() || UserAgent.isAWJade()) {
                    return true;
                }
                switch (app.subType) {
                    case "THINAPP":
                    case "APPV":
                        if (!UserAgent.isHorizonDesktopInstalled()) {
                            appLaunchService.openAppDownloadDialog(app);
                            return false;
                        }
                        break;
                    case "XENAPP":
                    case "XENAPPDELIVERYGROUP":
                        if (!UserAgent.isCitrixReceiverInstalled()) {
                            appLaunchService.openAppDownloadDialog(app);
                            return false;
                        }
                        break;
                }
                return true;
            };

            appLaunchService.openAppDownloadDialog = function(app) {
                var title = Localization.getLocalizedString('myapps.launch.title');
                switch (app.subType) {
                    case 'THINAPP':
                    case 'APPV':
                        var workspaceDownloadUrl = Localization.getLocalizedString('workspaceDownloadUrl');
                        message = Localization.getLocalizedString('horizonDesktopNotDetected', [workspaceDownloadUrl]);
                        break;
                    case 'XENAPP':
                    case "XENAPPDELIVERYGROUP":
                        var citrixReceiverDownloadUrl = Localization.getLocalizedString('citrixReceiverDownloadUrl');
                        var message = Localization.getLocalizedString('xenAppsReceiverNotDetected', [citrixReceiverDownloadUrl]);
                        break;
                }

                var template = isHubApp ? "app-v2/components/shared/clientAppDownloadDialog.html" : "app-v2/common/appLaunch/clientAppDownloadDialog.html";
                ModalService
                    .getCurrentModal()
                    .open(template, {title: title, app: app, message: message})
                    .then(function() {
                        appLaunchService.appInstalled(app);
                    });
            };

            appLaunchService.isAppNew = function(app) {
                return app.displayStatus === 'NEW';
            };

            appLaunchService.appInstalled = function(app) {
                switch (app.subType) {
                    case 'XENAPP':
                    case "XENAPPDELIVERYGROUP":
                        hznLocalStorage[UserAgent.hznCitrixReceiverInstalled] = "1";
                        break;
                    case 'THINAPP':
                        hznLocalStorage[UserAgent.hznHorizonWorkspaceInstalled] = "1";
                        break;
                    case 'APPV':
                        hznLocalStorage[UserAgent.hznHorizonWorkspaceInstalled] = "1";
                        break;
                    default:
                        break;
                }
                ModalService.getCurrentModal().close();
                //try to launch the app
                ClientRuntimeService.launchApp(app);
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
