(function(module) {
    'use strict';
    module.controller('DesktopLaunchController', [ '$scope', '$filter', '$sce', 'hznLocalStorage', 'UserAgent', 'DesktopLaunchService',  function ($scope, $filter, $sce, hznLocalStorage, UserAgent, DesktopLaunchService) {
        var vm = this;


            vm.byViewClientDescription = $sce.trustAsHtml($filter('i18n')('myapps.launch.view.preferredClient.byViewClient.description', DesktopLaunchService.getDownloadLink()));
            vm.preferredClient = DesktopLaunchService.getPreferredClient() || DesktopLaunchService.CLIENT_NATIVE;



        vm.launchByViewClient = function (){
                hznLocalStorage[UserAgent.hznViewClientInstalled] = "1" ;
                DesktopLaunchService.doLaunchByViewClient($scope, $scope.app);
                //popdown the dialog
                $scope.$modal.close();
            };

        vm.launchByBrowser = function (){
                DesktopLaunchService.launchByBrowser($scope, $scope.app);
                //popdown the dialog
            $scope.$modal.close();
            };

        vm.launchByPreference = function (){
                if (this.preferredClient == DesktopLaunchService.CLIENT_BROWSER) {
                     this.launchByBrowser();
                } else {
                    vm.launchByViewClient();
                }
                DesktopLaunchService.setPreferredClient(this.preferredClient);
            };

        vm.isClientPreferred = function (clientType) {
                return DesktopLaunchService.getPreferredClient() === clientType;
        };

        vm.showInstallViewClientMsg = function() {
                // Show install view client message when users select by Horizon View and View client is not
                // Installed.
                return this.preferredClient == DesktopLaunchService.CLIENT_NATIVE
                    && !DesktopLaunchService.isHorizonViewClientInstalled();
        }

}]);

})(angular.module('com.vmware.greenbox.appCenter'));

