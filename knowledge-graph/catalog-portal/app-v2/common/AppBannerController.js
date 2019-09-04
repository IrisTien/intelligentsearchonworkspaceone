// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('appBannerController', ['UserAgent', '$window', 'hznLocalStorage', 'JadeV2Scheme', 'AppDownloadService', function(UserAgent, $window, hznLocalStorage, JadeV2Scheme, AppDownloadService) {
        var vm = this;

        vm.showPromoBanner = false;

        vm.setPromoBannerPreference = function() {
            if (vm.pvsettings) {
                hznLocalStorage.setItem("hidePromoBanner", true);
            } else {
                hznLocalStorage.removeItem("hidePromoBanner");
            }
        };

        vm.showPromoBanner = !hznLocalStorage.hidePromoBanner;

        vm.close = function() {
            vm.showPromoBanner = false;
        };

        vm.openWorkspaceOneApp = function() {
            window.location.href = JadeV2Scheme.JADE_SCHEME;
        };

        vm.downloadApp = function() {
            AppDownloadService.downloadApp();
        };
    }]);
})(angular.module("com.vmware.greenbox.appCenter"));

