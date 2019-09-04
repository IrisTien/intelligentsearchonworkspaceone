(function(module) {
    'use strict';

    module.directive('installButton', [
                        'OfflineService',
                        'CatalogService',
                        'INSTALL_STATUS',
                        '$window',
                        '$filter',
                        'LauncherService',
                        '$sce',
                        '$notify',
                        '$timeout',
                        'UtilService',
                        'UserAgent',
                        'ConfigService',
                        'EventsService',
                        'ThinappMultiDeviceActivationService',
                        'ClientRuntimeService',
                        function (OfflineService,
                                  CatalogService,
                                  INSTALL_STATUS,
                                  $window,
                                  $filter,
                                  LauncherService,
                                  $sce,
                                  $notify,
                                  $timeout,
                                  UtilService,
                                  UserAgent,
                                  ConfigService,
                                  EventsService,
                                  ThinappMultiDeviceActivationService,
                                  ClientRuntimeService) {

        function postLink(scope, element, attrs) {
            if(attrs.normalWidth){
                element.removeClass('full-width-');
            }

        }

        function controller () {
            var installAppCtrl = this;
            var installApp = installAppCtrl.app;
            installAppCtrl.deviceReqs = [];
            installApp.isMdmApp = CatalogService.isMdmApp(installApp.type, installApp.subType);
            installApp.isMdmWebApp = CatalogService.isMdmWebApp(installApp.type, installApp.subType);

            function updateStatus (status, currentApp) {
                currentApp.installAction = CatalogService.getInstallStatusText(status, currentApp);
                currentApp.appNeedToActivated = status === 'NOT_ACTIVATED' || status === 'UPDATE';
                currentApp.installStatus = status;
            }

            function handleStatus (appActivationResponse, app) {
                if (appActivationResponse.status === INSTALL_STATUS.REDIRECT_FOR_ENROLL.name) {
                    installApp.installAction = INSTALL_STATUS.REDIRECT.value;
                    installApp.appNeedToActivated = false;
                    var title = $filter('i18n')('beforeInstallation');
                    var privacyUrl = $sce.trustAsHtml(appActivationResponse.privacyUrl);
                    installAppCtrl.modal.open('app/common/enrollModal.html', {
                            name: app.name,
                            title: title,
                            privacyUrl: privacyUrl,
                            modal: installAppCtrl.modal
                        }
                    ).then(function () {
                            EventsService.addEvent('INSTALL', app.appId);
                            ClientRuntimeService.enroll(appActivationResponse.redirectUrl);
                        },
                        function () {
                            updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                        }
                    );

                } else if (appActivationResponse.status === INSTALL_STATUS.REDIRECT.name) {
                    if(UserAgent.isWindows() && app && app.externalStoreAppId){
                        appActivationResponse.redirectUrl = '&appId=' + app.externalStoreAppId;
                    }
                    ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                } else if (appActivationResponse.status === INSTALL_STATUS.ACCEPT_EULA.name) {
                    handleEula(appActivationResponse, app);
                } else if (appActivationResponse.status === INSTALL_STATUS.VPP_ACCEPT.name) {
                    if (appActivationResponse.message) {
                        handleVppAcceptInvite(appActivationResponse);
                    }
                }
                else {
                    installApp.installAction = CatalogService.getInstallStatusText(appActivationResponse.status, app);
                    installApp.appNeedToActivated = false;
                    installApp.installStatus = appActivationResponse.status;
                    if(UserAgent.isWindows() && app && app.externalStoreAppId){
                        windowsAppInstallCallback(app.externalStoreAppId);
                    }
                }
            }

            var windowsAppInstallCallback = function (appId) {
                ClientRuntimeService.windowsInstallProgress(appId);
            };

            var handleEula = function(appActivationResponse, app){
                var title = $filter('i18n')('termsOfUse');
                var message = $sce.trustAsHtml(appActivationResponse.message);
                installAppCtrl.modal.open('app/common/eulaModal.html', { title: title,
                        message: message, modal: installAppCtrl.modal }
                ).then(function(){
                        //User accepted EULA.
                        CatalogService.acceptEula(app.appId, appActivationResponse.eulaContentId).then(function(acceptEulaResponse){
                            app.installAction = INSTALL_STATUS.PROCESSING.value;
                            app.appNeedToActivated = false;
                            /* Once EULA is accepted proceed to normal install app flow. For instance if
                             status is returned as REDIRECT then redirect to app store etc. */
                            handleStatus(acceptEulaResponse.data, app);
                        });
                    },
                    function() {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , app);
                    }

                );
            };

            var handleVppAcceptInvite = function(appActivationResponse) {
                var title = $filter('i18n')('appCenter.vppInviteTitle');
                installAppCtrl.modal.open( "app/catalog/vppInviteAccept.html",
                    { message: appActivationResponse.message , title: title, modal: installAppCtrl.modal }
                ).then(
                    function () {
                        // User accepted invite
                        installApp.installAction = INSTALL_STATUS.REDIRECT.value;
                        installApp.appNeedToActivated = false;
                        ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                    },
                    function () {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , installApp);
                    }
                );
            };

            var showConfirmationMessage = function(app) {
                var title = $filter('i18n')('appCenter.appInstallConfirmPromptTitle');
                var message = '<h2>' + app.name +'</h2>';
                if(app.size) {
                    message += '<p>' + $filter('i18n')('app.details.label.size') + ': ' + (app.size/1000000).toPrecision(3) + $filter('i18n')('app.details.abbrev.megabytes') + '</p>';
                }
                if(app.price) {
                    message += '<p>' + $filter('i18n')('app.details.label.price') + ': ' + app.price+ '</p>';
                }
                message += '<p>' +app.installMessage + '</p>';

                var messageHtml = $sce.trustAsHtml(message);
                var template = "app/common/appInstallConfirmPrompt.html";
                if(UserAgent.isIOS() && installAppCtrl.deviceStatus === "MDM_DEVICE_CONTAINER_ENROLLED" && !app.mgmtRequired && app.subType == 'INTERNAL') {
                    template = "app/common/privateAppInstructionsModal.html";
                }
                installAppCtrl.modal.open( template,
                    { message: messageHtml , modal: installAppCtrl.modal, title: title }
                ).then(
                    function () {
                        continueWithActivateApp(app);
                    },
                    function () {
                        installAppCtrl.isLoading = false;
                    }
                );
            };

            function continueWithActivateApp(app) {
                updateStatus(INSTALL_STATUS.PROCESSING.name , app);
                CatalogService.activateApp(app.installUrl, true).then(function (appActivationResponse) {
                    installAppCtrl.isLoading = false;
                    handleStatus(appActivationResponse, app);
                }, function (error) {
                    //TODO: We need to better the error handling
                    if(!!error.handled) {//When system is under maintenance
                        return;
                    }
                    installAppCtrl.isLoading = false;
                    var title = 'requestFailed';
                    var message;
                    if (error.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name) {
                        //If compliance check has failed, show the message returned form server.
                        message = error.message;
                    } else if (error.responseJSON && error.responseJSON.code === "device.unenrolled"){
                        message = 'installStatus.unenrolledDevice'
                        title = 'changeOccurred'
                    } else {
                        message = 'installStatus.installFailedMessage'
                        title = 'requestFailed'
                    }
                    installAppCtrl.modal.alert({
                        title: title,
                        message: message,
                        ok: 'ok'
                    }).then(  function() {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , app);
                        if (error.responseJSON.code === "device.unenrolled"){
                            $notify.warning('api.updateApps');
                            ConfigService.refreshCache().then(function() {
                                $timeout(function() {
                                    if (!ConfigService.isReloading) {
                                        ConfigService.isReloading = true;
                                        location.reload();
                                    }
                                }, 1000, false);
                            });
                        }
                    });
                });
            }



            installAppCtrl.requestThinAppOnADevice = function(deviceId) {
                CatalogService.activateApp(installApp.installUrl, true, deviceId).then(function (appActivationResponse) {
                    installAppCtrl.modal.close();
                }, function (error) {
                    installAppCtrl.isLoading = false;
                    var message = 'installStatus.installFailedMessage'
                    installAppCtrl.modal.alert({
                        title: 'requestFailed',
                        message: message,
                        ok: 'ok'
                    });
                });
            };

            installAppCtrl.openDevicesDialog = function(app) {

                ThinappMultiDeviceActivationService.getDeviceReqs(app).then(function(devReqs){
                    installAppCtrl.deviceReqs = devReqs;
                    installAppCtrl.modal.open('app/catalog/thinappMultiDeviceActivation.html', { title: 'Request App',
                            ctrl: installAppCtrl}
                    );
                });
            }

            installAppCtrl.getThinappRequestStatusMsg = function(device) {
                if (device.activationState && device.activationState != '') {
                    var statusKey = 'app.thinappMultiDeviceAct.activationState.'+ device.activationState;
                    var statusMsg = $filter('i18n')(statusKey);
                    if (device.message && device.message != '') {
                        statusMsg = statusMsg + ': ' + device.message;
                    }
                    return statusMsg;
                }
                return '';
            };

            installAppCtrl.isRequestable = function(device) {
                return (device.activationState == '' || device.activationState == 'deniedActivation' || device.activationState == 'notActivated');
            };

            installAppCtrl.activateApp = function(app) {
                if (app.subType === 'THINAPP' && app.perDeviceActivationRequired) {
                    installAppCtrl.openDevicesDialog(app);
                    return;
                }

                installAppCtrl.isLoading = true;
                if (OfflineService.isDeviceOnline()) {
                    //Mdm apps should be able to activate anytime
                    if(!installApp.isMdmWebApp && (app.installStatus === 'NOT_ACTIVATED' || app.installStatus === 'ACTIVATION_FAILED' || installApp.isMdmApp)) {
                        if(app.installMessage &&  (!app.mgmtRequired || installAppCtrl.deviceStatus === "MDM_DEVICE_FULLY_ENROLLED")){
                            showConfirmationMessage(app);
                        }else{
                            continueWithActivateApp(app);
                        }

                    } else if (!app.visible) {
                        updateStatus(INSTALL_STATUS.PROCESSING.name , app);
                        LauncherService.setAppVisible(app).then(function(data){
                            if(data) {
                                //success
                                app.visible = true;
                                updateStatus(INSTALL_STATUS.ACTIVATED.name , app);
                                installAppCtrl.isLoading = false;
                            }  else {
                                updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , app);
                                installAppCtrl.isLoading = false;
                                installAppCtrl.modal.alert({
                                    title: 'requestFailed',
                                    message: 'error.failToShowApp',
                                    ok: 'ok'
                                });
                            }
                        });
                    }
                }else{
                    installAppCtrl.isLoading = false;
                    installAppCtrl.modal.alert({
                        title: 'requestFailed',
                        message: 'installStatus.offlineInstallMessage',
                        ok: 'ok'
                    });
                }
                installAppCtrl.isLoading = false;
            };
        }

        return {
            restrict: 'A',
            replace: true,
            scope: { app : '=', isLoading: '=', modal: '=modalObj', deviceStatus: '=' },
            templateUrl: 'app/catalog/installAppButtonTemplate.html',
            controller: controller,
            link: postLink,
            controllerAs: 'installAppCtrl',
            bindToController: true
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
