(function(module) {
    'use strict';
    module.directive('passwordVaultExtension', [
                            '$notify',
                            'PasswordVaultService',
                            function ($notify,
                                      PasswordVaultService) {
        return {
            restrict: 'A',
            scope: true,
            link: postLink
        };
        function postLink (scope, element, attrs) {
            scope.$on('evt-passwordvault-pingextension', function(event,appsPresent){
                if (appsPresent) {
                    PasswordVaultService.pingExtension().then(function (extentionDetected) {
                        if (!extentionDetected && PasswordVaultService.getPVExtensionDownloadUrl() != '') {
                            $notify.info('app.passwordVault.banner.msg', [], 'app/common/passwordVaultBanner.html');
                        }
                    });
                }
            });

        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
