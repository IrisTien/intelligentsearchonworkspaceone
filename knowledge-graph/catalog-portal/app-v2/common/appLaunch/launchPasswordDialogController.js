(function(module) {
    'use strict';
    module.controller('LaunchPasswordController', [
        '$scope',
        'UserAgent',
        'VirtualAppLaunchService',
        'SettingsService',
        'ModalService',
        'ProgressIndicatorService',
        function($scope,
                  UserAgent,
                  VirtualAppLaunchService,
                  SettingsService,
                  ModalService,
                  ProgressIndicatorService) {
        var currentUser = SettingsService.getCurrentUser();
        var vm = this;
        vm.pwd = "";
        vm.userName = "";
        vm.errMsg = "";
        if (currentUser) {
            vm.userName = currentUser.userName;
        }
        var getUrls = function() {
            ProgressIndicatorService.showProgressIndicator();
            VirtualAppLaunchService.getLaunchUrls($scope.app, vm.pwd, _.get($scope, "$modalOptions.preferredClient")).then(function(launchUrls) {
                ProgressIndicatorService.hideProgressIndicator();
                if (launchUrls) {
                    ModalService.getCurrentModal().close(launchUrls);
                }
            }, function(error) {
                ProgressIndicatorService.hideProgressIndicator();
                vm.errMsg = error.data.message;
            });
        };
        vm.getLaunchUrls = function() {
            getUrls();
        };

        vm.handleEnter = function(keyEvent) {
            ProgressIndicatorService.hideProgressIndicator();
            if (keyEvent.which === 13) {
                getUrls();
            }
        };

        vm.handleCancel = function() {
            ProgressIndicatorService.hideProgressIndicator();
            ModalService.getCurrentModal().cancel();
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

