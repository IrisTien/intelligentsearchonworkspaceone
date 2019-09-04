(function(module) {
    'use strict';

    module.service('AppDownloadService', ['UserAgent', '$window', 'ConfigService', 'Resource', 'UtilService',
        function(UserAgent, $window, ConfigService, Resource, UtilService) {
            var appDownloadService = this,
                IOS_APP_STORE_LINK = 'https://itunes.apple.com/us/app/vmware-workspace-one/id1031603080?mt=8',
                ANDROID_APP_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.airwatch.vmworkspace&hl=en',
                HUB_IOS_APP_STORE_LINK = 'https://itunes.apple.com/us/app/intelligent-hub/id338761996',
                HUB_ANDROID_APP_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.airwatch.androidagent';

            function downloadAppForWS1() {
                if (UserAgent.isIOS()) {
                    appDownloadService.appStoreInstallLink = IOS_APP_STORE_LINK;
                } else if (UserAgent.isAndroid()) {
                    appDownloadService.appStoreInstallLink = ANDROID_APP_STORE_LINK;
                } else if (UserAgent.isMac()) {
                    appDownloadService.downloadMacApp();
                }
            }

            function downloadAppForHub() {
                if (UserAgent.isIOS()) {
                    appDownloadService.appStoreInstallLink = HUB_IOS_APP_STORE_LINK;
                } else if (UserAgent.isAndroid()) {
                    appDownloadService.appStoreInstallLink = HUB_ANDROID_APP_STORE_LINK;
                }
            }

            appDownloadService.downloadApp = function() {
                if (!UtilService.isHubBrowsers()) {
                    downloadAppForWS1();
                } else {
                    downloadAppForHub();
                }
                if (appDownloadService.appStoreInstallLink) {
                    return $window.open(appDownloadService.appStoreInstallLink, '_blank');
                }
            };

            appDownloadService.downloadMacApp = function() {
                appDownloadService.checkIfMacAppExists().then(function(data) {
                    var anchor = angular.element('<a/>');
                    anchor.css({display: 'none'}); // Make sure it's not visible
                    angular.element(document.body).append(anchor); // Attach to document

                    anchor.attr({
                        target: '_blank',
                        download: 'workspace.dmg',
                        href: data.downloadUrl
                    })[0].click();

                    anchor.remove();
                });
            };

            appDownloadService.checkIfMacAppExists = function(appVersion) {
                return ConfigService.getMacAppDownloadLink().then(function(url) {
                    url = url.replace('{deviceType}', 'APPLEOSX')
                        .replace('{deviceOem}', 'apple')
                        .replace('{osVersion}', UserAgent.getMacOsVersion())
                        .replace('{appId}', 'com.air-watch.appcenter.mac');
                    //appVersion is optional
                    if (appVersion) {
                        url.replace('{appVersion}', appVersion);
                    } else {
                        url = url.indexOf('&appVersion') ? url.substring(0, url.indexOf('&appVersion')) : url;
                    }
                    return Resource(url, {
                        headers: {
                            'Accept': 'application/hal+json',
                            'method': 'GET'
                        }
                    }).get();
                });
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
