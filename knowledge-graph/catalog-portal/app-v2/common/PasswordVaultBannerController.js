// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('PasswordVaultBannerController',
        ['$toast',
            'UserAgent',
            'PasswordVaultService',
            'hznLocalStorage',
            'BootstrapService',
            function($toast,
                     $location,
                     PasswordVaultService,
                     hznLocalStorage,
                     BootstrapService) {
                var vm = this;

                vm.storeInstallLink = PasswordVaultService.getPVExtensionDownloadUrl();

                vm.setPVBannerPreference = function() {
                    if (vm.pvsettings) {
                        hznLocalStorage.setItem("hidePVBanner", true);
                    } else {
                        hznLocalStorage.removeItem("hidePVBanner");
                    }
                };

                vm.installPasswordVaultPlugin = function() {
                    $toast.close('app.passwordVault.banner.msg');
                    window.open(vm.storeInstallLink);
                };
            }]);
})(angular.module("com.vmware.greenbox.appCenter"));

