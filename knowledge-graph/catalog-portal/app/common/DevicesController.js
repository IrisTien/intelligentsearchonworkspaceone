
(function(module) {

    'use strict';

    module.controller('DevicesController', ['$scope', '$filter', 'ConfigService',
        function ($scope, $filter, ConfigService) {
            var vm = this;

            var Device = {};
            Device.OS_WINDOWS = "windows";
            Device.OS_MAC     = "mac";
            Device.OS_ANDROID = "android";
            Device.OS_IOS     = "ios";
            Device.OS_IPHONE  = "iphone";
            Device.OS_IPAD    = "ipad";

            vm.devices = [];

            vm.unlinkDevice = function(device, $event){
                var status = $filter('i18n')("app.devices.unlinkedDevice");
                ConfigService.unlinkDevice(device).then(function(){
                    $event.target.outerHTML = status;
                }, function(){
                    //TODO: error handling
                });
            };

            startLoading();
            ConfigService.getUserDevices().then(function(devices){
                vm.devices = [];
                if(devices) {
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].status === "ACTIVE") {
                            var iconName = "";
                            var osName = devices[i].osName.toLowerCase();
                            if (osName.indexOf(Device.OS_ANDROID) >= 0) {
                                iconName = "androidOS-icon.svg";
                            } else if ((osName.indexOf(Device.OS_IOS) >= 0) || (osName.indexOf(Device.OS_IPHONE) >= 0) || (osName.indexOf(Device.OS_IPAD) >= 0)) {
                                iconName = "iOS-icon.svg";
                            } else if (osName.indexOf(Device.OS_WINDOWS) >= 0) {
                                iconName = "winOS-icon.svg";
                            } else if (osName.indexOf(Device.OS_MAC) >= 0) {
                                iconName = "macOS-icon.svg";
                            }
                            devices[i].iconName = iconName;
                            vm.devices.push(devices[i]);
                        }
                    }
                }
                doneLoading();
            });

            function startLoading () {
                vm.isLoading = true;
            }

            function doneLoading () {
                vm.isLoading = false;
            }

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
