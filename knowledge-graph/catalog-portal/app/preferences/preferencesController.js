(function(module) {
    'use strict';

    module.controller('PreferencesController', ['$scope', 'DesktopLaunchService', function ($scope, DesktopLaunchService) {
        var vm = this;
        vm.preferredClient = DesktopLaunchService.getPreferredClient() || DesktopLaunchService.CLIENT_NATIVE;

        vm.saveLaunchDesktopPreference = function () {
            DesktopLaunchService.setPreferredClient(vm.preferredClient);
            vm.backAction();
        }

        vm.backAction = function () {
            window.history.back();
        };

        $scope.$on('open-modal-dialog', function(event, args) {
            var template = args.dialogtemplate;
            $scope.$modal.open(template, $scope, {params: args.dialogparams});
        });
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

