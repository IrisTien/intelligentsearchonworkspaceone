(function(module) {
    'use strict';
    module.controller('ViewDesktopLaunchController', [
        '$scope',
        '$filter',
        '$sce',
        'hznLocalStorage',
        'UserAgent',
        'HorizonResourcesLaunchService',
        'ModalService',
        function($scope,
                  $filter,
                  $sce,
                  hznLocalStorage,
                  UserAgent,
                  HorizonResourcesLaunchService,
                  ModalService) {
            var vm = this;
            vm.byViewClientDescription = $sce.trustAsHtml($filter('i18n')('myapps.launch.view.preferredClient.byViewClient.description', HorizonResourcesLaunchService.getDownloadLink()));
            vm.preferredClient = HorizonResourcesLaunchService.getPreferredClient() || HorizonResourcesLaunchService.CLIENT_NATIVE;

        vm.launchByViewClient = function() {
            hznLocalStorage[UserAgent.hznViewClientInstalled] = "1";
            HorizonResourcesLaunchService.doLaunchByViewClient($scope.app);
                //popdown the dialog
            ModalService.getCurrentModal().close();
        };

        vm.launchByBrowser = function() {
            HorizonResourcesLaunchService.launchByBrowser($scope.app);
                //popdown the dialog
            ModalService.getCurrentModal().close();
            };

        vm.launchByPreference = function() {
            if (this.preferredClient === HorizonResourcesLaunchService.CLIENT_BROWSER) {
                this.launchByBrowser();
            } else {
                vm.launchByViewClient();
            }
            HorizonResourcesLaunchService.setPreferredClient(this.preferredClient);
        };

        vm.isClientPreferred = function(clientType) {
            return HorizonResourcesLaunchService.getPreferredClient() === clientType;
        };

        vm.showInstallViewClientMsg = function() {
            // Show install view client message when users select by Horizon View and View client is not
            // Installed.
            return this.preferredClient === HorizonResourcesLaunchService.CLIENT_NATIVE
                && !HorizonResourcesLaunchService.isHorizonViewClientInstalled();
        };
}]);
})(angular.module('com.vmware.greenbox.appCenter'));
