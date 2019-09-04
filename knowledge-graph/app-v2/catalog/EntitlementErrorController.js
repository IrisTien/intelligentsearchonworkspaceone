// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('EntitlementErrorController', ['$scope', 'Localization', 'UtilService', 'UserAgent', 'ClientRuntimeService', function($scope, Localization, UtilService, UserAgent, ClientRuntimeService) {
        var vm = this;
        vm.hideDetail = true;
        vm.isAndroid = UserAgent.isAndroid();
        vm.isAWJade2_0 = UserAgent.isNativeAppVersionIsEqualOrBelow("2.0");
        var deviceStatus = $scope.message.argument;

        if (deviceStatus === 'MDM_DEVICE_BLACKLISTED') {
            vm.detail = Localization.getLocalizedString('appCenter.device.status.blackListed');
        } else if (deviceStatus === 'MDM_DEVICE_NOT_ENROLLED' && !(vm.isAndroid && vm.isAWJade2_0)) {
            vm.detail = Localization.getLocalizedString('appCenter.device.status.notRegistered');
        }

        vm.enroll = function($event, $index) {
            if ($event) {
                $event.preventDefault();
            }
            ClientRuntimeService.register();
            $scope.close($index);
        };
    }]);
})(angular.module("com.vmware.greenbox.appCenter"));

