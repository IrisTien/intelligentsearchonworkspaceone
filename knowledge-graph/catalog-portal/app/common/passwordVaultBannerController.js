// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('PasswordVaultBannerController',
        ['$notify',
            'UserAgent',
            'PasswordVaultService',
            function($notify,
                     UserAgent,
                     PasswordVaultService){
                var vm = this;
                vm.storeInstallLink = PasswordVaultService.getPVExtensionDownloadUrl();

                vm.installPasswordVaultPlugin = function () {
                    $notify.close('app.passwordVault.banner.msg');
                    window.open(vm.storeInstallLink);
                }
            }]);
})(angular.module("com.vmware.greenbox.appCenter"));

