(function(module) {
    'use strict';

    module.controller('SupportController', [
        '$scope',
        'ModalService',
        'UserAgent',
        '$timeout',
        '$state',
        '$location',
        function($scope,
                 ModalService,
                 UserAgent,
                 $timeout,
                 $state,
                 $location) {
            var vm = this;

            var appCenterCtrl = $scope.appCenterCtrl;
            // need this to bring handle the stacking on the headers so the detail page will be on top of the header and footer
            appCenterCtrl.settingsDetailIn = false;
            vm.hideDevicesTab = appCenterCtrl.mdmOnlyWS1;

            var init = function() {
                vm.isAWJadeMobile = UserAgent.isAWJadeMobile();
                vm.isAndroid = UserAgent.isAndroid();
                vm.isIOS = UserAgent.isIOS();
            };

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                //remember the initial route the user start before they land on the settings page
                if (toState.url !== "/support") {
                    //Need timeout to able the animation otherwise the detail panel just come on suddenly
                    $timeout(function() {
                        vm.settingActiveTab = $state.params.pageLink;
                        appCenterCtrl.settingsDetailIn = true;
                    }, 10);
                }
                if (vm.settingActiveTab) {
                    vm.settingActiveTab = "";
                    appCenterCtrl.settingsDetailIn = false;
                }
            });

            vm.dismissSupportDetail = function() {
                vm.settingActiveTab = "";

                // wait for the animation to finish to change the route, 350 is the animation sliding out
                $timeout(function() {
                    $location.path('/support');
                    appCenterCtrl.settingsDetailIn = false;
                }, 350);
            };

            init();
        }]);
})(angular.module("com.vmware.greenbox.appCenter"));
