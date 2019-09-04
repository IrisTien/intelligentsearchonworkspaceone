(function(module) {

    'use strict';

    module.service('BootstrapService', [
                        '$rootScope',
                        'Resource',
                        'UtilService',
                        'ConfigService',
                        'UserAgent',
                        'PasswordVaultService',
                        function(
                            $rootScope,
                            Resource,
                            UtilService,
                            ConfigService,
                            UserAgent,
                            PasswordVaultService) {

        var bootstrapService = this;
        var excludeThinAppsInLauncher = !UserAgent.isThinAppSupportedBrowser();
        var checkForPVapps = UserAgent.isPasswordVaultPluginSupportedBrowser();

        bootstrapService.getBootstrapInfo = function(excludeThinAppsInLauncher){
            var params = {};
            params.excludeThinAppsInLauncher = excludeThinAppsInLauncher;
            return ConfigService.getBootstrapUrl().then(function(bootstrapUrl){
                if (bootstrapUrl) {
                    return Resource(bootstrapUrl, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params}).get();
                }
                return;
            });
        };

        bootstrapService.init = function() {
            return bootstrapService.getBootstrapInfo(excludeThinAppsInLauncher).then(function(bootstrapData){
                if (bootstrapData && checkForPVapps) {
                    if (bootstrapData.passwordVaultRootResponse) {
                        var downloadUrl = UtilService.getObjValue(bootstrapData, 'passwordVaultRootResponse[body]["_links"]["hw-pwvault-extension"]["href"]', '');
                        PasswordVaultService.setPVExtensionDownloadUrl(downloadUrl);
                    }
                    PasswordVaultService.setHasPvApps((parseInt(bootstrapData.appInfo.pvapps.entitledCount) > 0));
                    $rootScope.$broadcast('evt-passwordvault-pingextension',(parseInt(bootstrapData.appInfo.pvapps.entitledCount) > 0));
                }
                return;
            });
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));