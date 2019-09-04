
(function(module) {
    'use strict';
    module.service('CatalogService', [
                                '$http',
                                '$q',
                                'RequestFactory',
                                'Resource',
                                '$sce',
                                'ConfigService',
                                'INSTALL_STATUS',
                                'Localization',
                                'OfflineService',
                                '$filter',
                                'ClientRuntimeService',
                                '$notify',
                                '$timeout',
                                'EventsService',
                                'UserAgent',
                                'UtilService',
                                function(
                                    $http,
                                    $q,
                                    RequestFactory,
                                    Resource,
                                    $sce,
                                    ConfigService,
                                    INSTALL_STATUS,
                                    Localization,
                                    OfflineService,
                                    $filter,
                                    ClientRuntimeService,
                                    $notify,
                                    $timeout,
                                    EventsService,
                                    UserAgent,
                                    UtilService){

        var ALL_APPS_LABEL = {
            name: Localization.getLocalizedString('myapp.nav.allApps'),
            type:'all',
            isDefault:true
        };
        var EULA_TEMPLATE_URL = '/catalog-portal/services/api/activate/{appId}/acceptEula/{eulaContentId}';
        var selectedCategory = ALL_APPS_LABEL;
        var featureFlags = workspaceOne.featureFlags;

        var catalogService = this;

        function getCategoryName (category){
            if( category && category.type && category.type === 'all' || !category)
                return '';
            else {
                return category.name;
            }
        }

        this.setSelectedCategory = function(selCategory) {
            selectedCategory = selCategory;
        }

        this.getSelectedCategory = function() {
            return selectedCategory;
        }

        this.getFirstPage = function(appCenterContext){
            return ConfigService.getEntitlementsUrl().then(function(url){
                var params = {};
                var response = {};
                params.q = appCenterContext.searchText;
                params.category = getCategoryName(appCenterContext.selectedCategory);

                var request = Resource(url, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params});
                return request.get().then(function(entitlementsResponse){
                    response.allEntitlementsLoaded = entitlementsResponse['allEntitlementsLoaded'];
                    var entitlements = UtilService.getObjValue(entitlementsResponse, '_embedded[entitlements]', [])
                    response.entitlements = _.uniq(entitlements, 'appId');
                    response.deviceStatus = UtilService.getObjValue(entitlementsResponse, 'deviceInfo.[deviceStatus]', undefined)
                    response.authErrorType = entitlementsResponse['authErrorType'];
                    return response;
                });
            });
        };

        this.activateApp = function (activationUrl, useJQ, deviceId) {
            var params = {};
            if (deviceId) {
                params.deviceId = deviceId;
            }
            if (useJQ) {
                var req = RequestFactory(activationUrl, {method:'POST', data: params});
                var defer = $q.defer();
                $.ajax(req).then(function(appActivationResponse){
                    if(appActivationResponse.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name){
                        defer.reject(appActivationResponse);
                    }else{
                        defer.resolve(appActivationResponse);
                    }
                }, function(error){
                    defer.reject(error);
                });
                return defer.promise;
            } else {
                var req = RequestFactory(activationUrl, {method:'POST', params: params});
                return $http(req);
            }
        };

        this.getDefaultLabels = function() {
            return [ALL_APPS_LABEL];
        }


        this.activateAppAfterEnrollment = function(app, deviceStatus, modal) {
            if (OfflineService.isDeviceOnline()) {
                //Mdm apps should be able to activate anytime
                if(app.installStatus === 'NOT_ACTIVATED' || app.installStatus === 'ACTIVATION_FAILED') {
                    catalogService.showConfirmationMessage(app, modal, deviceStatus);
                }
            }else{
                modal.alert({
                    title: 'requestFailed',
                    message: 'installStatus.offlineInstallMessage',
                    ok: 'ok'
                });
            }
        };


        this.acceptEula = function(appId, eulaId){
            var eulaAcceptUrl = ConfigService.getBaseUrl() + EULA_TEMPLATE_URL;
            eulaAcceptUrl = eulaAcceptUrl.replace('{appId}', appId);
            eulaAcceptUrl = eulaAcceptUrl.replace('{eulaContentId}', eulaId);

            var eulaRequest = RequestFactory(eulaAcceptUrl, {method: 'POST', params: {}});
            return $http(eulaRequest);
        };

        this.getInstallStatusText = function(installStatus, app) {
            if(app.type === 'NATIVE' && app.subType !== 'THINAPP'){
                return INSTALL_STATUS[installStatus].nativeAction || INSTALL_STATUS[installStatus].value;
            } else if(this.isMdmWebApp(app.type, app.subType)) {
                if(app.visible) {
                    return INSTALL_STATUS["ACTIVATED"].action;
                } else {
                    return INSTALL_STATUS["NOT_ACTIVATED"].action;
                }
            } else{
                return INSTALL_STATUS[installStatus].action || INSTALL_STATUS[installStatus].value;
            }
        };

        this.isMdmApp = function(appType, subType) {
            return appType === 'NATIVE' && subType !== 'THINAPP';
        };

        this.isMdmWebApp = function(appType, subType) {
            return appType === 'WEB' && subType === 'MDMWEB';
        };

        this.showConfirmationMessage = function(app, modal, deviceStatus) {
            var title = $filter('i18n')('appCenter.appInstallConfirmPromptTitle');
            if (!app.installMessage){
                app.installMessage = $filter('i18n')('installMessage.proceedToInstall');
            }
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
            if(app && UserAgent.isIOS() && deviceStatus === "MDM_DEVICE_CONTAINER_ENROLLED" && !app.mgmtRequired && app.subType == 'INTERNAL') {
                template = "app/common/privateAppInstructionsModal.html";
            }
            modal.open( template,
                { message: messageHtml , modal: modal, title: title }
            ).then(
                function () {
                    catalogService.continueWithActivateApp(app, modal);
                }
            );
        };

        function handleStatus (appActivationResponse, app, modal) {
            if (appActivationResponse.status === INSTALL_STATUS.REDIRECT_FOR_ENROLL.name) {
                app.installAction = INSTALL_STATUS.REDIRECT.value;
                app.appNeedToActivated = false;
                var title = $filter('i18n')('beforeInstallation');
                var privacyUrl = $sce.trustAsHtml(appActivationResponse.privacyUrl);
                modal.open('app/common/enrollModal.html', {
                        name: app.name,
                        title: title,
                        privacyUrl: privacyUrl,
                        modal: modal
                    }
                ).then(function () {
                        EventsService.addEvent();
                        ClientRuntimeService.enroll(appActivationResponse.redirectUrl);
                    }
                );

            } else if (appActivationResponse.status === INSTALL_STATUS.REDIRECT.name) {
                ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
            } else if (appActivationResponse.status === INSTALL_STATUS.ACCEPT_EULA.name) {
                catalogService.handleEula(appActivationResponse, app, modal);
            } else if (appActivationResponse.status === INSTALL_STATUS.VPP_ACCEPT.name) {
                if (appActivationResponse.message) {
                    catalogService.handleVppAcceptInvite(appActivationResponse, modal);
                }
            }
            else {
                ConfigService.refreshCache().then(function() {
                    $timeout(function() {
                        if (!ConfigService.isReloading) {
                            ConfigService.isReloading = true;
                            location.reload();
                        }
                    }, 1000, false)});;
            }
        }

        this.handleVppAcceptInvite = function(appActivationResponse, modal) {
            var title = $filter('i18n')('appCenter.vppInviteTitle');
            modal.open( "app/catalog/vppInviteAccept.html",
                { message: appActivationResponse.message , title: title, modal: modal }
            ).then(
                function () {
                    ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                }
            );
        };


        this.handleEula = function(appActivationResponse, app, modal){
            var title = $filter('i18n')('termsOfUse');
            var message = $sce.trustAsHtml(appActivationResponse.message);
            modal.open('app/common/eulaModal.html', { title: title,
                    message: message, modal: modal }
            ).then(function(){
                    //User accepted EULA.
                    catalogService.acceptEula(app.appId, appActivationResponse.eulaContentId).then(function(acceptEulaResponse){
                        app.installAction = INSTALL_STATUS.PROCESSING.value;
                        app.appNeedToActivated = false;
                        /* Once EULA is accepted proceed to normal install app flow. For instance if
                         status is returned as REDIRECT then redirect to app store etc. */
                        handleStatus(acceptEulaResponse.data, app, modal);
                    });
                }
            );
        };


        this.continueWithActivateApp = function(app, modal) {
            catalogService.activateApp(app.installUrl, true).then(function (appActivationResponse) {
                handleStatus(appActivationResponse, app, modal);
            }, function (error) {
                //TODO: We need to better the error handling
                if(!!error.handled) {//When system is under maintenance
                    return;
                }
                var message;
                var title;
                if (error.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name) {
                    //If compliance check has failed, show the message returned form server.
                    message = error.message;
                } else if (error.responseJSON.code === "device.unenrolled"){
                    message = 'installStatus.unenrolledDevice'
                    title = 'changeOccurred'
                } else {
                    message = 'installStatus.installFailedMessage'
                    title = 'requestFailed'
                }
                modal.alert({
                    title: title,
                    message: message,
                    ok: 'ok'
                }).then(  function() {
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


        }]);

})(angular.module('com.vmware.greenbox.appCenter'));