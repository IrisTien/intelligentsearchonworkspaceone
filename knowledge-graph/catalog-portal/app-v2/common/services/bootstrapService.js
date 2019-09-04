(function(module) {
    'use strict';

    module.service('BootstrapService', [
                        '$rootScope',
                        '$q',
                        'Resource',
                        'UtilService',
                        'ConfigService',
                        'UserAgent',
                        'PasswordVaultService',
                        'LaunchUtilityService',
                        'HttpProxyService',
                        'LocalStorageConstants',
                        '$timeout',
                        'TenantCustomizationService',
                        function(
                            $rootScope,
                            $q,
                            Resource,
                            UtilService,
                            ConfigService,
                            UserAgent,
                            PasswordVaultService,
                            LaunchUtilityService,
                            HttpProxyService,
                            LocalStorageConstants,
                            $timeout,
                            TenantCustomizationService) {
        var bootstrapService = this;
        var excludeThinAppsInLauncher = !UserAgent.isThinAppSortSupportedBrowser();
        var checkForPVapps = UserAgent.isPasswordVaultPluginSupportedBrowser();
        var directEnrollmentEnabled = false;
        var hasInstallEvents = false;
        var initAppCallPromise;
        var bookmarkedAppsCount = 0;
        var appTypeInfo = {};

        bootstrapService.getBootstrapInfo = function(excludeThinAppsInLauncher, clearEntitlementsCache) {
            var params = {};
            params.excludeThinAppsInLauncher = excludeThinAppsInLauncher;
            if (clearEntitlementsCache) {
                params.clearEntitlementsCache = clearEntitlementsCache;
                HttpProxyService.clearAll();
            }
            return ConfigService.getBootstrapUrl().then(function(bootstrapUrl) {
                if (UtilService.hideVirtualApps()) {
                    bootstrapUrl = bootstrapUrl + "?displayMode=phone";
                }
                if (bootstrapUrl) {
                    return HttpProxyService.get(LocalStorageConstants.BOOTSTRAP, bootstrapUrl, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params});
                }
            });
        };

        bootstrapService.init = function() {
            return bootstrapService.getBootstrapInfo(excludeThinAppsInLauncher).then(function(bootstrapData) {
                var tenantCustomizations = TenantCustomizationService.getCustomizationSettings();
                if (tenantCustomizations) {
                    LaunchUtilityService.setUseNonNPAPIForCitrixLaunch(tenantCustomizations.useNonNPAPIForCitrixLaunch);
                    if (UserAgent.isWindows()) {
                        LaunchUtilityService.setSuppressLaunchDialog(tenantCustomizations.suppressLaunchDialog.WINDOWS);
                    } else if (UserAgent.isMac()) {
                        LaunchUtilityService.setSuppressLaunchDialog(tenantCustomizations.suppressLaunchDialog.MAC);
                    } else if (UserAgent.isMobile()) {
                        LaunchUtilityService.setSuppressLaunchDialog(tenantCustomizations.suppressLaunchDialog.MOBILE);
                    }
                }
                if (bootstrapData && checkForPVapps) {
                    if (bootstrapData.passwordVaultRootResponse) {
                        var downloadUrl = UtilService.getObjValue(bootstrapData, 'passwordVaultRootResponse[body]["_links"]["hw-pwvault-extension"]["href"]', '');
                        PasswordVaultService.setPVExtensionDownloadUrl(downloadUrl);
                    }
                    PasswordVaultService.setHasPvApps((parseInt(bootstrapData.appInfo.pvapps.entitledCount) > 0));
                    $rootScope.$broadcast('evt-passwordvault-pingextension', (parseInt(bootstrapData.appInfo.pvapps.entitledCount) > 0));
                }
            });
        };

        bootstrapService.setDirectEnrollmentStatus = function(enabled) {
            directEnrollmentEnabled = enabled;
        };

        bootstrapService.getDirectEnrollmentStatus = function() {
            return directEnrollmentEnabled;
        };

        bootstrapService.getInitAppCallsPromise = function() {
            return initAppCallPromise;
        };
        bootstrapService.setInitAppCallsPromise = function(promsie) {
            initAppCallPromise = promsie;
        };

        bootstrapService.hasInstallEvents = function() {
            return hasInstallEvents;
        };

        bootstrapService.setInstallEventsStatus = function(installEvents) {
            hasInstallEvents = installEvents;
        };

        bootstrapService.getBookmarkedAppsCount = function() {
            return bookmarkedAppsCount;
        };

        bootstrapService.setBookmarkedAppsCount = function(count) {
            bookmarkedAppsCount = count;
        };

        bootstrapService.getAppTypeInfo = function() {
            return appTypeInfo;
        };

        bootstrapService.setAppTypeInfo = function(appInfo) {
            appTypeInfo = appInfo;
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

