angular.module('com.vmware.greenbox.appCenter')
    .service('HorizonResourcesLaunchService', ['UserAgent',
        'Localization',
        'hznLocalStorage',
        'UtilService',
        '$timeout',
        'ConfigService',
        'ModalService',
        'LaunchUtilityService',
        'VirtualAppLaunchService',
        'HorizonResourcesLaunchUtilService',
        'ProgressIndicatorService',
        function(
            UserAgent,
            Localization,
            hznLocalStorage,
            UtilService,
            $timeout,
            ConfigService,
            ModalService,
            LaunchUtilityService,
            VirtualAppLaunchService,
            HorizonResourcesLaunchUtilService,
            ProgressIndicatorService) {
            'use strict';

            var horizonResourcesLaunchService = this;
            horizonResourcesLaunchService.PERSISTENT_PREFERRED_CLIENT = "HZN_LAUNCH_DESKTOP_PREFERRED_CLIENT";
            horizonResourcesLaunchService.CLIENT_BROWSER = "BROWSER";
            horizonResourcesLaunchService.CLIENT_NATIVE = "NATIVE";

            var isHubApp = UtilService.isHub();

            /**
             * Launch a view desktop.
             *
             * @param view {Object} app
             */

            horizonResourcesLaunchService.launchViewApp = function(viewResource) {
                var launchableClients = horizonResourcesLaunchService.getLaunchableClients(viewResource);
                var preferredClient = horizonResourcesLaunchService.getPreferredClient();

                //if preferredClient client not set, send use the defaultLaunchClient from backend
                var defaultLaunchClient = _.get(viewResource, 'optionalAppInfo.defaultLaunchClient', undefined);
                if (!preferredClient && defaultLaunchClient && defaultLaunchClient !== 'NONE') {
                    preferredClient = defaultLaunchClient;
                }
                //If user has no launch preference and if launch pref popup is disabled in Admin UI,
                //then set the preferred client to Native client.
                // So that we don't display the launch pref popup.
                // In case if the popup is not disabled, if there is no preferred client,
                // user can select the launch option between Client and Browser
                if (LaunchUtilityService.isSuppressLaunchDialog() && launchableClients.length > 1 && !preferredClient) {
                    preferredClient = horizonResourcesLaunchService.CLIENT_NATIVE;
                }
                //No other choices, launch by this client type.
                if (launchableClients.length === 1) {
                    if (launchableClients[0] === horizonResourcesLaunchService.CLIENT_NATIVE) {
                        horizonResourcesLaunchService.launchByViewClient(viewResource);
                    } else if (launchableClients[0] === horizonResourcesLaunchService.CLIENT_BROWSER) {
                        horizonResourcesLaunchService.launchByBrowser(viewResource);
                    }
                    return;
                }

                //If with more than 1 choice, check the preference.
                if (preferredClient === horizonResourcesLaunchService.CLIENT_NATIVE) {
                    horizonResourcesLaunchService.launchByViewClient(viewResource);
                    return;
                }

                if (preferredClient === horizonResourcesLaunchService.CLIENT_BROWSER) {
                    horizonResourcesLaunchService.launchByBrowser(viewResource);
                    return;
                }

                horizonResourcesLaunchService.showLaunchDesktopDialog(viewResource);
            };

            /**
             * Launch by view client
             *
             * @param viewResource  {Object} app
             */
            horizonResourcesLaunchService.launchByViewClient = function(viewResource) {
                if (horizonResourcesLaunchService.isHorizonViewClientInstalled() || LaunchUtilityService.isSuppressLaunchDialog()) {
                    horizonResourcesLaunchService.doLaunchByViewClient(viewResource);
                } else {
                    horizonResourcesLaunchService._showLaunchViewClientDialog(viewResource);
                }
            };

            /**
             * Launch by browser
             *
             * @param view {Object} app
             */
            horizonResourcesLaunchService.launchByBrowser = function(view) {
                VirtualAppLaunchService.launchByLaunchUrl(view, function(app, launchUrlResponse) {
                    VirtualAppLaunchService.launchResourceInBrowser(launchUrlResponse.applyAuthPolicy ? launchUrlResponse.accessPolicyUrl : launchUrlResponse.browserLaunchUrl);
                }, "BROWSER");
            };

            horizonResourcesLaunchService._showLaunchViewClientDialog = function(view) {
                var template = isHubApp ?
                    'app-v2/common/appLaunch/horizonResources/hubLaunchViewClientDialog.html' :
                    'app-v2/common/appLaunch/horizonResources/launchViewClientDialog.html';
                ModalService.getCurrentModal().open(template, {app: view});
            };

            /**
             * Launch with view client without checking if view client is installed.
             *
             * @param view {Object} app
             */
            horizonResourcesLaunchService.doLaunchByViewClient = function(view) {
                VirtualAppLaunchService.launchByLaunchUrl(view, function(app, launchUrls) {
                    horizonResourcesLaunchService.launchResourceInViewClient(launchUrls);
                }, "NATIVE");
            };

            horizonResourcesLaunchService.launchDesktoneApps = function(view) {
                var w = 500;
                var h = 500;
                var $this = this;
                var left = (screen.width / 2) - (w / 2);
                var top = (screen.height / 2) - (h / 2);
                var openAppWindow = window.open('about:blank', "AppLaunchWindow", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ',modal=yes,alwaysRaised=yes');
                if (view.subType === "DESKTONEAPPLICATION" || view.subType === "VIEWAPP") {
                    openAppWindow.document.write(Localization.getLocalizedString('myapps.launch.msg.launching.application', [view.name]));
                } else {
                    openAppWindow.document.write(Localization.getLocalizedString('myapps.launch.msg.launching.desktop', [view.name]));
                }
                $timeout(function() {
                    openAppWindow.location.href = UtilService.appendQueryToUrl(view.launch, "p", $this.CLIENT_NATIVE);
                }, 2000);
            };

            horizonResourcesLaunchService.launchResourceInViewClient = function(urlResponse) {
                ProgressIndicatorService.hideProgressIndicator();
                if (urlResponse.applyAuthPolicy) {
                    VirtualAppLaunchService.launchResourceInBrowser(urlResponse.accessPolicyUrl);
                } else {
                    ConfigService.doNotRefreshCache = true;
                    //TODO: Why not use iframe based launch, try it if it works in all cases and browsers
                    window.location.href = urlResponse.nativeLaunchUrl;
                }
            };

            horizonResourcesLaunchService.isAppLaunchV2Supported = function(app) {
                var appLaunchUrlV2 = _.get(app, '_links.appLaunchUrlsV2.href', undefined);
                return angular.isString(appLaunchUrlV2);
            };

            horizonResourcesLaunchService.getLaunchLink = function(app) {
                return horizonResourcesLaunchService.isAppLaunchV2Supported(app) ? _.get(app, '_links.appLaunchUrlsV2.href', undefined) : _.get(app, '_links.appLaunchUrls.href');
            };

            horizonResourcesLaunchService.isLaunchableInBrowser = function(launchableClients) {
                return launchableClients.indexOf(horizonResourcesLaunchService.CLIENT_BROWSER) > -1;
            };

            horizonResourcesLaunchService.showLaunchDesktopDialog = function(view) {
                var template = isHubApp ?
                    'app-v2/common/appLaunch/horizonResources/hubLaunchDesktopDialog.html' :
                    'app-v2/common/appLaunch/horizonResources/launchDesktopDialog.html';
                ModalService.getCurrentModal().open(template, {app: view});
            };

            /**
             * Calculate the launchable clients supported on current browser.
             *
             * @param view {Object}
             * @private
             */
            horizonResourcesLaunchService.getLaunchableClients = function(view) {
                return HorizonResourcesLaunchUtilService.getLaunchableClients(view);
            };

            /**
             * Get user preferred client.
             *
             * @return {*}
             */
            horizonResourcesLaunchService.getPreferredClient = function() {
                return hznLocalStorage[horizonResourcesLaunchService.PERSISTENT_PREFERRED_CLIENT];
            };

            horizonResourcesLaunchService.setPreferredClient = function(clientType) {
                if (clientType === null) {
                    delete hznLocalStorage[horizonResourcesLaunchService.PERSISTENT_PREFERRED_CLIENT];
                } else {
                    hznLocalStorage[horizonResourcesLaunchService.PERSISTENT_PREFERRED_CLIENT] = clientType;
                }
            };

            horizonResourcesLaunchService.isClientLaunchable = function(view, clientType) {
                return HorizonResourcesLaunchUtilService.isClientLaunchable(view, clientType);
            };

            /**
             * Check if Horizon View client is installed by 1 of the following conditions:
             * * A mobile device on managed mode;
             * * Users confirmed View client was installed,
             *
             * @return boolean
             */
            horizonResourcesLaunchService.isHorizonViewClientInstalled = function() {
                return UserAgent.isHorizonViewClientMarkedAsInstalled();
            };

            horizonResourcesLaunchService.getDownloadLink = function() {
                if (UserAgent.isIOS()) {
                    return 'javascript:window.location="' + Localization.getLocalizedString('viewDownloadUrlIOS') + '";';
                } else if (UserAgent.isAndroid()) {
                    return Localization.getLocalizedString('viewDownloadUrlAndroid');
                } else {
                    return Localization.getLocalizedString('viewDownloadUrl');
                }
            };

            horizonResourcesLaunchService.isViewOptionSupported = function(app, clientType) {
                if (app.subType !== 'VIEWPOOL' && app.subType !== 'VIEWAPP' && app.subType !== 'DESKTONEDESKTOP' && app.subType !== 'DESKTONEAPPLICATION') {
                    return false;
                }
                return horizonResourcesLaunchService.isClientLaunchable(app, clientType);
            };
        }]);
