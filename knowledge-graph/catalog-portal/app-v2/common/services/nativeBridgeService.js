(function(module) {
    'use strict';
    module.service('NativeBridgeService', ['UserAgent', '$injector', '$rootScope', 'UtilService',
        function(UserAgent, $injector, $rootScope, UtilService) {
            var service = this;
            var isNotContainerMode;

            service.registerBridge = function() {
                if (UtilService.isNativeBridge()) {
                    window.setAppStatus = function(apps) {
                        if (apps) {
                            var catalogService = $injector.get('CatalogService');
                            catalogService.setNativeAppStatus(apps);
                        }
                    };
                    window.setAppFavorite = function(app) {
                        if (app) {
                            $rootScope.$broadcast('native-bridge-app-bookmarked', app);
                        }
                    };
                }
            };

            service.getAppStatus = function(apps) {
                if (UtilService.isWindowsNativeBridge()) {
                    window.NativeBridge.getAppStatus(apps);
                } else if (UtilService.isMacNativeBridge()
                    && UtilService.getObjValue(window, 'webkit.messageHandlers.NativeBridge', false)) {
                    window.webkit.messageHandlers.NativeBridge.postMessage(["getAppStatus", apps]);
                }
            };

            service.setContainerMode = function(value) {
                isNotContainerMode = value;
                service.registerBridge();
            };

            service.getContainerMode = function() {
                return isNotContainerMode;
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));

