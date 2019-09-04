(function(module) {
    'use strict';
    module.directive('passwordVaultExtension', [
                            '$toast',
                            'PasswordVaultService',
                            'hznLocalStorage',
                            function($toast,
                                      PasswordVaultService,
                                      hznLocalStorage) {
        return {
            restrict: 'A',
            scope: true,
            link: postLink
        };
        function postLink(scope, element, attrs) {
            scope.$on('evt-passwordvault-pingextension', function(event, appsPresent) {
                if (appsPresent) {
                    PasswordVaultService.pingExtension().then(function(extentionDetected) {
                        if (!extentionDetected && PasswordVaultService.getPVExtensionDownloadUrl() != '' && !hznLocalStorage.hidePVBanner) {
                            $toast.toast('', [], 'app-v2/common/passwordVaultBanner.html');
                        }
                    });
                }
            });
        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
