// (c) 2016 VMware, Inc.  All rights reserved.


(function(module) {
    'use strict';
    module.controller('EntitlementErrorController',['$scope','Localization','UtilService','UserAgent','ClientRuntimeService', function($scope, Localization, UtilService, UserAgent, ClientRuntimeService) {
        var vm = this;
        vm.hideDetail = true;
        vm.isAndroid = UserAgent.isAndroid();
        vm.isAWJade2_0 = UserAgent.isNativeAppVersionIsEqualOrBelow("2.0");
        var deviceStatus = $scope.message.argument;

        if(deviceStatus === 'MDM_DEVICE_BLACKLISTED'){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.blackListed');
        }
        else if(deviceStatus === 'MDM_DEVICE_NOT_ENROLLED' && !(vm.isAndroid && vm.isAWJade2_0)){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.notRegistered');
        }
        else if(deviceStatus === 'MDM_DEVICE_CONF_ERROR') {
            vm.detail = Localization.getLocalizedString('appCenter.device.status.confError');
        }
        else if (deviceStatus === 'MDM_DEVICE_NO_ENTITLE'){
            vm.detail = Localization.getLocalizedString('appCenter.device.mdmApps.notFoundError');
        }
        else if (deviceStatus === 'MDM_DEVICE_COMM_ERROR'){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.commError');
        }
        else if (deviceStatus === 'MDM_DEVICE_INPUT_ERROR'){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.deviceInputError');
        }
        else {
            vm.detail = Localization.getLocalizedString('appCenter.device.status.unknownError');
        }

        vm.enroll = function($event, $index) {
            if ($event){
                $event.preventDefault();
            }
            ClientRuntimeService.register();
            $scope.close($index);
        };

    }]);
})(angular.module("com.vmware.greenbox.appCenter"));