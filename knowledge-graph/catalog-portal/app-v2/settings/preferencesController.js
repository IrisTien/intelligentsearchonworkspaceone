(function(module) {
    'use strict';

    module.controller('PreferencesController', ['$scope',
        '$notify',
        '$filter',
        'HorizonResourcesLaunchService',
        'PasswordVaultService',
        'BootstrapService',
        function($scope,
                  $notify,
                  $filter,
                  HorizonResourcesLaunchService,
                  PasswordVaultService,
                  BootstrapService) {
            var vm = this;
            vm.preferredClient = HorizonResourcesLaunchService.getPreferredClient();
            vm.showPVPreference = false;
            vm.showActions = false;
            vm.changeThenCancel = false;
            vm.notificationPreference = _.get(window, 'workspaceOne.featureFlags.HUB_MOBILE_FLOWS_INTEGRATION', false);

            $scope.$on('$locationChangeStart', function(event, newURL, oldURL) {
                // When leaving preferences, the last saved option is highlighted.
                if (oldURL.toString().indexOf("preferences") > -1) {
                    vm.preferredClientTemp = vm.preferredClient;
                }
                // When getting to preferences, hide action buttons
                if (newURL.toString().indexOf("preferences") > -1) {
                    vm.showActions = false;
                }
            });
            /*
                Watch the preferredClientTemp variable and show action buttons when user toggles options except in the
                change-then-cancel scenario when the highlight is reset to the last saved option and the button are hidden.
             */
            $scope.$watch(function() {
                return vm.preferredClientTemp;
            }, function(newValue, oldValue) {
                if (newValue && oldValue) {
                    if (!vm.changeThenCancel) {
                        vm.showActions = true;
                    } else {
                        vm.changeThenCancel = false;
                    }
                }
            });

            if (!vm.preferredClient) {
                vm.preferredClient = HorizonResourcesLaunchService.CLIENT_NATIVE;
                HorizonResourcesLaunchService.setPreferredClient(vm.preferredClient);
            }

            vm.installLink = HorizonResourcesLaunchService.getDownloadLink();

            //change-then-cancel scenario - highlight is reset to the last saved option and the buttons are hidden.
            vm.cancelPreferenceChange = function() {
                if (vm.preferredClientTemp != vm.preferredClient) {
                    vm.preferredClientTemp = vm.preferredClient;
                    vm.changeThenCancel = true;
                    vm.showActions = false;
                } else {
                    vm.showActions = false;
                }
            };

            /*
                If user saves a new selection, highlighted option updates and action buttons disappear.
             */
            vm.saveLaunchDesktopPreference = function() {
                vm.preferredClient = vm.preferredClientTemp;
                HorizonResourcesLaunchService.setPreferredClient(vm.preferredClient);
                vm.showActions = false;
                $notify.success('myapps.launch.view.preferredClient.saveSuccess');
            };

            BootstrapService.init().then(function() {
                if (PasswordVaultService.getHasPvApps) {
                    PasswordVaultService.pingExtension().then(function(extentionDetected) {
                        if (!extentionDetected) {
                            vm.showPVPreference = true;
                            vm.pvstoreInstallLink = PasswordVaultService.getPVExtensionDownloadUrl();
                        }
                    });
                }
            });

            vm.installPasswordVaultPlugin = function() {
                window.open(vm.pvstoreInstallLink);
            };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
