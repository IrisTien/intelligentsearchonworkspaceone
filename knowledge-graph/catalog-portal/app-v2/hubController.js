(function(module) {
    'use strict';

    module.controller('HubController', [
        '$q',
        'Localization',
        'UserAgent',
        'SettingsService',
        'HttpProxyService',
        'ConfigService',
        'UtilService',
        'BootstrapService',
        'TenantCustomizationService',
        'HubBrandingService',
        'ModalService',
        '$scope',
        'CatalogService',
        'NativeBridgeService',
        'MobileFlowsService',
        '$rootScope',
        'NotificationService',
        function(
            $q,
            Localization,
            UserAgent,
            SettingsService,
            HttpProxyService,
            ConfigService,
            UtilService,
            BootstrapService,
            TenantCustomizationService,
            HubBrandingService,
            ModalService,
            $scope,
            CatalogService,
            NativeBridgeService,
            MobileFlowsService,
            $rootScope,
            NotificationService) {
            NativeBridgeService.registerBridge();
            var vm = this;
            var initAppCallsDefer = $q.defer();
            var initAppCallsPromise = initAppCallsDefer.promise;
            var v2Notifications = _.get(window, 'workspaceOne.featureFlags.V2_HUB_NOTIFICATIONS', false);
            BootstrapService.setInitAppCallsPromise(initAppCallsPromise);
            vm.pageTitle = Localization.getLocalizedString('hub');
            vm.appsLoaded = false;
            vm.toggles = UtilService.getObjValue(window, 'workspaceOne.featureFlags', {});
            vm.user = {};
            vm.isIOS = UserAgent.isIOS();
            vm.isAndroid = UserAgent.isAndroid();
            vm.isAWJade = UserAgent.isAWJade();
            vm.isMacJade = UserAgent.isMacJade();
            vm.appLoaded = false;
            // Notify Native app at least default Avatar is rendered
            // this is to address https://jira-euc.eng.vmware.com/jira/browse/HW-90914
            // If GB UI loads this controller means GB UI already loaded the default Avatar
            // and hence informing the native app.
            // Incase if something goes wrong, there is a way to bail the user out.
            // If Native app did not receive this callback, that means
            // GB did not receive a request to load UI or something else must happened
            // Native app can listen to this callback and if it did not receive this callback,
            // Native app will render the gear icon to bailout the user.
            if (UtilService.isHubNative()) {
                UtilService.informAvatarLoaded();
            }
            ModalService.setCurrentModal($scope.$modal);

            //If the page load is because of clicking on refresh button
            if (window.performance && window.performance.navigation.type === 1) {
                HttpProxyService.clearAll();
                HttpProxyService.clearPeopleSearch();
                ConfigService.refreshCache(true);
            }

            if (_.get(window, 'workspaceOne.featureFlags.HUB_MOBILE_FLOWS_INTEGRATION', false)) {
                MobileFlowsService.register();
            }

            $q.all([SettingsService.getUserInfo(), ConfigService.getFeatureCustomization(false),
                ConfigService.getCatalogCustomizations(false)]).then(function(data) {
                var userInfo = data[0] || {};
                var customizationSettings = data[1] || {};
                var catalogCustomizationSettings = data[2] || {};
                var properties = ['userName', 'firstName', 'lastName', 'emailAddress', 'numOfManagedDevices',
                    'phoneNumber', 'adminUser', 'internalUserType', 'changePasswordAllowed', 'localUser', 'imageURL', 'title', 'employeeNumber', 'businessUnit'];
                var mdmOnlyWS1 = UtilService.isMdmOnlyMode();
                _.extend(vm.user, _.pick(userInfo, properties));
                SettingsService.setCurrentUser(vm.user);
                if (!mdmOnlyWS1) {
                    checkTermsOfUse(vm.user.userName);
                }
                ConfigService.mdmOnlyWS1(mdmOnlyWS1);
                SettingsService.setCurrentUser(vm.user);
                vm.passwordChangeEnabled = vm.user.changePasswordAllowed && !mdmOnlyWS1;
                vm.appLoaded = true;
                TenantCustomizationService.setCustomizationSettings(customizationSettings);
                TenantCustomizationService.setCatalogCustomizationSettings(catalogCustomizationSettings);
                TenantCustomizationService.setLaunchOptions();
                initAppCallsDefer.resolve();
                $rootScope.$broadcast('customizations-loaded');
            }, function(error) {
                if (!vm.isAWJade && _.get(error, "data.code", undefined) === "admin.terms.not.accepted") {
                    ConfigService.getAdminConsoleTermsUrl().then(function(url) {
                        window.location = url;
                    });
                }
            });

            //this will reduce the initial ribbon branding flicker
            var cachedBranding = HttpProxyService.getHubBranding();
            _.extend(vm, cachedBranding);

            HubBrandingService.getUpdateValues(vm).then(function(customBranding) {
                HttpProxyService.setHubBranding(customBranding);
                _.extend(vm, customBranding);
            }, function() {
                HttpProxyService.setHubBranding({});
                _.extend(vm, {
                    customized: false
                });
            });

            function checkTermsOfUse(userName) {
                //Terms of use will not be checked in Android less than 3.3 versions because native client should add document.referer header to display vIDM TOU page
                if (UtilService.checkTermsOfUseStatus()) {
                    ConfigService.getTermsOfUseStatus().then(function(response) {
                        if (!_.get(response, 'termsOfUseAcceptanceStatus.accepted', true)) {
                            $q.all([ConfigService.getUserConsoleTermsUrl(), ConfigService.getLogoutUrl()])
                                .then(function(promisesData) {
                                    window.location = UtilService.constructTouRedirectUrl(promisesData[0], promisesData[1], userName);
                                });
                        }
                    });
                }
            }

            if (v2Notifications) {
                NotificationService.checkForPriorityNotifications();
            }
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
