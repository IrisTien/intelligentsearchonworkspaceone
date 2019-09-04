(function(module) {
    'use strict';

    module.controller('DevicesController', ['$scope', '$filter', 'ConfigService',
        function($scope, $filter, ConfigService) {
            var vm = this;

            var Device = {
                OS_WINDOWS: 'windows',
                OS_MAC: 'mac',
                OS_ANDROID: 'android',
                OS_IOS: 'ios',
                OS_IPHONE: 'iphone',
                OS_IPAD: 'ipad',
            };

            vm.devices = [];

            vm.unlinkDevice = function(device, $event) {
                var status = $filter('i18n')("app.devices.unlinkedDevice");
                ConfigService.unlinkDevice(device).then(function() {
                    $event.target.outerHTML = status;
                }, function() {
                    //TODO: error handling
                });
            };

            startLoading();
            ConfigService.getUserDevices().then(function(devices) {
                vm.devices = [];
                if (devices) {
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].status === "ACTIVE") {
                            var iconfilename = "";
                            var osName = devices[i].osName.toLowerCase();
                            if (osName.indexOf(Device.OS_ANDROID) >= 0) {
                                iconfilename = "app-v2/svgincludes/illo-android.html";
                            } else if ((osName.indexOf(Device.OS_IOS) >= 0) || (osName.indexOf(Device.OS_IPHONE) >= 0) || (osName.indexOf(Device.OS_IPAD) >= 0)) {
                                iconfilename = "app-v2/svgincludes/illo-ios.html";
                            } else if (osName.indexOf(Device.OS_WINDOWS) >= 0) {
                                iconfilename = "app-v2/svgincludes/illo-windows.html";
                            } else if (osName.indexOf(Device.OS_MAC) >= 0) {
                                iconfilename = "app-v2/svgincludes/illo-macos.html";
                            }
                            devices[i].iconfilename = iconfilename;
                            vm.devices.push(devices[i]);
                        }
                    }
                }
                doneLoading();
            });

            function startLoading() {
                vm.isLoading = true;
            }

            function doneLoading() {
                vm.isLoading = false;
            }
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
