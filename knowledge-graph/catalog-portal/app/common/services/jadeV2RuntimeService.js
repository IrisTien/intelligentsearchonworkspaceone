// (c) 2016 VMware, Inc.  All rights reserved.

(function(module){
    'use strict';
    module.service('JadeV2RuntimeService',[ 
                        'LauncherService',
                        'UtilService',
                        'ConfigService',
                        'AppLauncherForJade',
                        'UserAgent', 
                        'JadeV2Scheme',
                        '$http',
                        'RequestFactory',
                        function( LauncherService, 
                                  UtilService,
                                  ConfigService,
                                  AppLauncherForJade, 
                                  UserAgent, 
                                  JadeV2Scheme,
                                  $http,
                                  RequestFactory){

            this.logout = function logout(apiLogoutUrl) {
                var logoutRequest = RequestFactory(apiLogoutUrl, {method: 'GET', params: {}});
                $http(logoutRequest).then(function(){
                    if (UserAgent.isNativeAppVersionIsEqualOrBelow("2.0")){
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_POPUP);
                    } else {
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_NO_POPUP);
                    }
                });
            };

            this.about = function about(){
                UtilService.openURIScheme(JadeV2Scheme.ABOUT);
            };

            this.launchApp = function launchApp(app,$scope) {
                app.launching = false;
                AppLauncherForJade.launchUrl(app,$scope).then(function(launchUrl){
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

            this.windowsInstallProgress = function (appId) {
                if(appId && UserAgent.isWindows()){
                    UtilService.openURIScheme(JadeV2Scheme.INSTALL_APP + "&appId=" + appId);
                }
            };

            this.enroll = function enroll(mdmUrl) {
                if(UserAgent.isWindows()){
                    UtilService.openURIScheme(JadeV2Scheme.MDM_ENROLL+'&uri='+mdmUrl);
                }else{
                    UtilService.openURIScheme(JadeV2Scheme.MDM_ENROLL+'&url='+encodeURIComponent(mdmUrl));
                }
            };

            this.unEnroll = function unEnroll(onlyLogout) {
                if(onlyLogout) {
                    logoutWithoutMdm();
                }else if(UtilService.getQueryParams().deviceUdid) {
                    ConfigService.getDeviceUnRegistrationUrl().then(function (url) {
                        var unEnrollRequest = RequestFactory(url.replace('{deviceId}', UtilService.getQueryParams().deviceUdid), {
                            method: 'DELETE',
                            params: {}
                        });
                        $http(unEnrollRequest).then(function () {
                            logoutWithoutMdm();
                        }, function() {
                            showRemoveAccountFailedMessage();
                        });
                    });
                }
            };

            function logoutWithoutMdm(){
                ConfigService.doNotRefreshCache = true;
                ConfigService.getLogoutUrl().then(function(logoutUrl){
                    var logoutRequest = RequestFactory(logoutUrl, {method: 'GET', params: {}});
                    $http(logoutRequest).then(function () {
                        UtilService.openURIScheme(JadeV2Scheme.MDM_UNENROLL);
                    }, function(){
                        showRemoveAccountFailedMessage();
                    });
                });
            };

            function showRemoveAccountFailedMessage() {
                ModalService.getCurrentModal().alert({
                    title: 'requestFailed',
                    message: 'error.failedToRemoveAccount',
                    ok: 'ok'
                })
            };

            this.register = function register() {
                UtilService.openURIScheme(JadeV2Scheme.CONTAINER_ENROLL);
            };

            this.openUrl = function openUrl(extUrl) {
                if(UserAgent.isWindows()){
                    UtilService.openURIScheme(JadeV2Scheme.OPEN_URL + "&uri=" + extUrl);
                } else {
                    UtilService.openURIScheme(JadeV2Scheme.OPEN_URL + "&url=" + encodeURIComponent(extUrl));
                }
            }

        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

