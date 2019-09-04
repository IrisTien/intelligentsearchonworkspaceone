// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.service('JadeV2RuntimeService', [
                        'UtilService',
                        'ConfigService',
                        'AppLauncherForJade',
                        'UserAgent',
                        'JadeV2Scheme',
                        '$http',
                        'RequestFactory',
                        'ModalService',
                        function(UtilService,
                                  ConfigService,
                                  AppLauncherForJade,
                                  UserAgent,
                                  JadeV2Scheme,
                                  $http,
                                  RequestFactory,
                                  ModalService) {
            this.logout = function logout(apiLogoutUrl) {
                var logoutRequest = RequestFactory(apiLogoutUrl, {method: 'GET', params: {}});
                $http(logoutRequest).then(function() {
                    if (UserAgent.isNativeAppVersionIsEqualOrBelow("2.0")) {
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_POPUP);
                    } else if (UserAgent.isHubApp()) {
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_HUB);
                    } else {
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_NO_POPUP);
                    }
                });
            };

            this.about = function about() {
                UtilService.openURIScheme(JadeV2Scheme.ABOUT);
            };

            this.notification = function about() {
                UtilService.openURIScheme(JadeV2Scheme.NOTIFICATION_SETTINGS);
            };

            this.launchApp = function launchApp(app) {
                app.launching = false;
                AppLauncherForJade.launchUrl(app).then(function(launchUrl) {
                    if (launchUrl && launchUrl !== '') {
                        if (UserAgent.isWindows()) {
                            UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&uri=" + launchUrl);
                        } else {
                            UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&url=" + launchUrl);
                        }
                    }
                });
            };

             this.installApp = function installApp(redirectUrl) {
                 if (redirectUrl && redirectUrl !== '') {
                     if (UserAgent.isWindows()) {
                         UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&uri=" + redirectUrl);
                     } else {
                         UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&url=" + encodeURIComponent(redirectUrl));
                     }
                 }
             };

            this.installProgress = function(appId) {
                if (appId && (UserAgent.isWindows() || UserAgent.isMacJade())) {
                    UtilService.openURIScheme(JadeV2Scheme.INSTALL_APP + "&appId=" + appId);
                }
            };

            this.showAppInstall = function() {
                if (UserAgent.isWindowsTabletJade() || UserAgent.isMacJade()) {
                    UtilService.openURIScheme(JadeV2Scheme.LAUNCH_NATIVE_NOTIFICATION_TRAY);
                }
            };

            this.enroll = function enroll(mdmUrl) {
                if (UserAgent.isWindows()) {
                    UtilService.openURIScheme(JadeV2Scheme.MDM_ENROLL + '&uri=' + mdmUrl);
                } else {
                    UtilService.openURIScheme(JadeV2Scheme.MDM_ENROLL + '&url=' + encodeURIComponent(mdmUrl));
                }
            };

            this.unEnroll = function unEnroll(onlyLogout) {
                if (onlyLogout) {
                    logoutWithoutMdm();
                } else if (UtilService.getQueryParams().deviceUdid) {
                    ConfigService.getDeviceUnRegistrationUrl().then(function(url) {
                        var unEnrollRequest = RequestFactory(url.replace('{deviceId}', UtilService.getQueryParams().deviceUdid), {
                            method: 'DELETE',
                            params: {}
                        });
                        $http(unEnrollRequest).then(function() {
                            logoutWithoutMdm();
                        }, function() {
                            showRemoveAccountFailedMessage();
                        });
                    });
                }
            };

            function logoutWithoutMdm() {
                ConfigService.doNotRefreshCache = true;
                ConfigService.getLogoutUrl().then(function(logoutUrl) {
                    var logoutRequest = RequestFactory(logoutUrl, {method: 'GET', params: {}});
                    $http(logoutRequest).then(function() {
                        UtilService.openURIScheme(JadeV2Scheme.MDM_UNENROLL);
                    }, function() {
                        showRemoveAccountFailedMessage();
                    });
                });
            }

            function showRemoveAccountFailedMessage() {
                ModalService.getCurrentModal().alert({
                    title: 'requestFailed',
                    message: 'error.failedToRemoveAccount',
                    ok: 'ok'
                });
            }

            this.register = function register() {
                UtilService.openURIScheme(JadeV2Scheme.CONTAINER_ENROLL);
            };

            this.openUrl = function openUrl(extUrl, type) {
                //openType 1 - internal webview, 2 - AW browser, 3 - external browser
                //default action is internal webview
                //all social urls such as linkedin, slack should always be opened in external browser
                var openType = type || 1;
                if (UserAgent.isWindows()) {
                    UtilService.openURIScheme(JadeV2Scheme.OPEN_URL + "&uri=" + extUrl + "&type=" + openType);
                } else {
                    UtilService.openURIScheme(JadeV2Scheme.OPEN_URL + "&url=" + encodeURIComponent(extUrl) + "&type=" + openType);
                }
            };

            this.openEmail = function openEmail(email) {
                UtilService.openURIScheme(JadeV2Scheme.MAILTO_SCHEME + email);
            };

            this.openTel = function openTel(tel) {
                if (UserAgent.isMobile()) {
                    UtilService.openURIScheme(JadeV2Scheme.TEL_SCHEME + tel);
                }
            };

            this.openSms = function openSms(tel) {
                if (UserAgent.isMobile()) {
                    UtilService.openURIScheme(JadeV2Scheme.SMS_SCHEME + tel);
                }
            };

            this.openMaps = function openMaps(address) {
                if (UserAgent.isMobile()) {
                    UtilService.openURIScheme(JadeV2Scheme.GEO_SCHEME + address);
                }
            };

            this.accounts = function() {
                if (UserAgent.isAWJade()) {
                    UtilService.openURIScheme(JadeV2Scheme.ACCOUNT_PAGE);
                }
            };

            this.closePassword = function() {
                if (UserAgent.isAWJadeMobile()) {
                    UtilService.openURIScheme(JadeV2Scheme.PASSWORD_CLOSE);
                }
            };

            this.refreshUCC = function() {
                if (UserAgent.isAWJadeMobile()) {
                    UtilService.openURIScheme(JadeV2Scheme.UCC_REFRESH);
                }
            };

            this.openNativeAppDetails = function(appId) {
                UtilService.openURIScheme(JadeV2Scheme.LAUNCH_NATIVE_APP_DETAILS + appId);
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

