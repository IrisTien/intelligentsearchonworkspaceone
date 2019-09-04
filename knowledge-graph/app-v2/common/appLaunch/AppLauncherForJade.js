(function(module) {
    'use strict';
    module.service('AppLauncherForJade', [
                        'ConfigService',
                        'UtilService',
                        'UserAgent',
                        '$q',
                        'LaunchUtilityService',
                        'HorizonResourcesLaunchService',
                        'VirtualAppLaunchService',
                        'ProgressIndicatorService',
                        'ModalService',
                        function(ConfigService,
                                 UtilService,
                                 UserAgent,
                                 $q,
                                 LaunchUtilityService,
                                 HorizonResourcesLaunchService,
                                 VirtualAppLaunchService,
                                 ProgressIndicatorService,
                                 ModalService) {
            this.launchUrl = function(app) {
                //AWJade is going to open the application in external browser hence need to obtain OTA

                if (UserAgent.isAWJadeV2() && (VirtualAppLaunchService.isViewApp(app)
                    || VirtualAppLaunchService.isXenApp(app)
                    || VirtualAppLaunchService.isDesktoneApp(app))) {
                    ProgressIndicatorService.showProgressIndicator();
                    app.useNonNPAPIForCitrixLaunch = LaunchUtilityService.isUseNonNPAPIForCitrixLaunch();
                    return VirtualAppLaunchService.getLaunchUrls(app).then(function(launchUrlsResponse) {
                        ProgressIndicatorService.hideProgressIndicator();
                        if (launchUrlsResponse) {
                            return getLaunchUrlForApp(launchUrlsResponse, app);
                        }
                    }, function(error) {
                        ProgressIndicatorService.hideProgressIndicator();
                        if (error && error.data.code === 'appLaunch.passwordNotFound.error') {
                            return VirtualAppLaunchService.showPasswordDialog(app).then(function(launchUrlsResponse) {
                                if (launchUrlsResponse) {
                                    return getLaunchUrlForApp(launchUrlsResponse, app);
                                }
                            });
                        } else {
                            ModalService.getCurrentModal().alert({
                                title: 'requestFailed',
                                message: error.data.message,
                                ok: 'ok'
                            });
                        }
                    });
                } else if (app.subType === "MDMWEB") {
                    return getMdmWebUrl(app);
                } else {
                    return getOtaForUrl(app.launch).then(function(launchUrl) {
                        return getLaunchUrlForResource(app, encodeURIComponent(launchUrl));
                    });
                }
            };

            function getLaunchUrlForApp(launchUrlResponse, app) {
                var deferred = $q.defer();
                if (launchUrlResponse.applyAuthPolicy) {
                    getOtaForUrl(launchUrlResponse.accessPolicyUrl).then(function(otaWrappedLaunchUrl) {
                        var accessPolicyLaunchUrl = encodeURIComponent(otaWrappedLaunchUrl);
                        if (VirtualAppLaunchService.isViewApp(app)
                            || VirtualAppLaunchService.isDesktoneApp(app)) {
                            accessPolicyLaunchUrl += "&appType=1";
                        } else if (VirtualAppLaunchService.isXenApp(app)) {
                            accessPolicyLaunchUrl += "&appType=2";
                        }
                        deferred.resolve(accessPolicyLaunchUrl);
                    });
                } else {
                    if (VirtualAppLaunchService.isViewApp(app)
                        || VirtualAppLaunchService.isDesktoneApp(app)) {
                        var launchUrl = encodeURIComponent(launchUrlResponse.nativeLaunchUrl) + "&appType=1";
                        if (launchUrlResponse.browserLaunchUrl && HorizonResourcesLaunchService.isClientLaunchable(app, 'BROWSER')) {
                            launchUrl = launchUrl + "&fallback=" + encodeURIComponent(launchUrlResponse.browserLaunchUrl);
                        }
                        deferred.resolve(launchUrl);
                    }
                    if (VirtualAppLaunchService.isXenApp(app)) {
                        //In case of ica download URL no OTA flow needed hence directly open in new window
                        launchUrl = getLaunchUrlForResource(app, launchUrlResponse.browserLaunchUrl);
                        deferred.resolve(launchUrl);
                    }
                }
                return deferred.promise;
            }
            function getOtaForUrl(url) {
                return LaunchUtilityService.getOta(url).then(function(ota) {
                    if (url.indexOf('?') >= 0) {
                        return url + "&ota=" + ota;
                    } else {
                        return url + "?ota=" + ota;
                    }
                });
            }

            function getLaunchUrlForResource(app, launchUrl) {
                switch (app.subType) {
                    case "SAML11":
                    case "SAML20":
                    case "WSFED12":
                    case "WEBAPPLINK":
                    case "MDMWEB":
                        var featureFlags = workspaceOne.featureFlags;
                        if (!UserAgent.isWindows() && app.useAirwatchBrowser) {
                            launchUrl += "&openInAWB=true";
                        }
                        break;
                    case "VIEWPOOL":
                    case "VIEWAPP":
                    case "DESKTONEDESKTOP":
                    case "DESKTONEAPPLICATION":
                        var launchableClients = HorizonResourcesLaunchService.getLaunchableClients(app);
                        var supportsBlast = false;
                        if (launchableClients.length > 0) {
                            supportsBlast = (launchableClients.indexOf("BROWSER") > 0);
                        }
                        var fallbackUrl = UtilService.appendQueryToUrl(launchUrl, "p", 'BROWSER');
                        // Use appType=1 for Horizon Client (view or Horizon Air)
                        // And use appType=2 for citrix receiver
                        launchUrl = launchUrl + "&appType=1";

                        if (supportsBlast) {
                            launchUrl = launchUrl + "&fallback=" + fallbackUrl;
                        }
                        break;
                    case "XENAPP":
                    case "XENAPPDELIVERYGROUP":
                        launchUrl = launchUrl + "&appType=2";
                        break;
                    default:
                        break;
                }
                return launchUrl;
            }

            function getMdmWebUrl(app) {
                var deferred = $q.defer();
                deferred.resolve(getLaunchUrlForResource(app, app._links.launch.href));
                return deferred.promise;
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
