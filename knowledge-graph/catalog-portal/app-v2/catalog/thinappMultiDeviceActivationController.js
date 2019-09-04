(function(module) {
    'use strict';
    module.controller('ThinappMultiDeviceActivationController', [
        '$scope',
        '$filter',
        '$notify',
        'ThinappMultiDeviceActivationService',
        'CatalogService',
        'ModalService',
        'ProgressIndicatorService',
        function($scope,
                  $filter,
                  $notify,
                  ThinappMultiDeviceActivationService,
                  CatalogService,
                  ModalService,
                  ProgressIndicatorService) {
            var vm = this;
            vm.app = $scope.app;
            vm.deviceReqs = [];

            ProgressIndicatorService.showProgressIndicator();
            ThinappMultiDeviceActivationService.getDeviceReqs(vm.app).then(function(devReqs) {
                vm.deviceReqs = devReqs;
                ProgressIndicatorService.hideProgressIndicator();
            });

            vm.getThinappRequestStatusMsg = function(device) {
                var statusMsg = '';
                if (device.activationState) {
                    var statusKey = 'app.thinappMultiDeviceAct.activationState.' + device.activationState;
                    statusMsg = $filter('i18n')(statusKey);
                    if (device.message) {
                        statusMsg = statusMsg + ': ' + device.message;
                    }
                }
                return statusMsg;
            };

            vm.isRequestable = function(device) {
                return (device.activationState == '' || device.activationState == 'deniedActivation' || device.activationState == 'notActivated');
            };

            vm.requestThinAppOnADevice = function(deviceId) {
                CatalogService.activate(vm.app.installUrl, true, deviceId).then(function(appActivationResponse) {
                    ModalService.getCurrentModal().close();
                }, function(error) {
                    $notify.error('installStatus.installFailedMessage');
                });
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
