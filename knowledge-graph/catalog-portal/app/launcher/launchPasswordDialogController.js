(function(module) {
    'use strict';
    module.controller('LaunchPasswordController', [ '$scope', 'UserAgent', 'DesktopLaunchService', 'SettingsService', function ($scope, UserAgent, DesktopLaunchService, SettingsService) {
        var currentUser = SettingsService.getCurrentUser();
        var vm = this;
        vm.pwd = "";
        vm.userName = "";
        vm.errMsg = "";
        vm.processing =  false;
        if (currentUser) {
            vm.userName = currentUser.userName;
        }
        var getUrls = function() {
            vm.processing = true;
            DesktopLaunchService.getLaunchUrls($scope.app, vm.pwd, _.get($scope,"$modalOptions.preferredClient")).then(function(launchUrls) {
                vm.processing = false;
                if (launchUrls) {
                    $scope.$modal.close(launchUrls);
                }
            }, function(error) {
                vm.processing = false;
                vm.errMsg = error.data.message;
            });
        };
        vm.getLaunchUrls = function () {
            getUrls();
        };

        vm.handleEnter = function(keyEvent) {
            vm.processing = false;
            if (keyEvent.which === 13) {
                getUrls();
            }
        };

        vm.handleCancel = function () {
            vm.processing = false;
            $scope.$modal.cancel();
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

