(function(module) {
    'use strict';
    module.controller('InstallPasswordVaultExtensionController', [
                            '$scope',
                            '$filter',
                            '$sce',
                            'hznLocalStorage',
                            'UserAgent',
                            'PasswordVaultAppLaunchService',
                            'PasswordVaultService',
                            function (
                                $scope,
                                $filter,
                                $sce,
                                hznLocalStorage,
                                UserAgent,
                                PasswordVaultAppLaunchService,
                                PasswordVaultService) {
        var vm = this;

        vm.extensionDescription = $sce.trustAsHtml($filter('i18n')('myapps.launch.passwordvault.installExtension.description', PasswordVaultService.getPVExtensionDownloadUrl()));

        vm.openApp = function () {
            hznLocalStorage[UserAgent.passwordVaultExtensionInstalled] = "1" ;
            PasswordVaultAppLaunchService.openApp($scope.app);
            //popdown the dialog
            $scope.$modal.close();
        };

     }]);

})(angular.module('com.vmware.greenbox.appCenter'));

