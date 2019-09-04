(function(module) {

    'use strict';
    //Java script helper to get hold of device breakpoints used in CSS(page.less).
    module.constant('DEVICE_BREAKPOINT', {
        TABLET_POTRAIT: "720",
        TABLET_LANDSCAPE: "960",
        PHONE_PORTRAIT: 540,
        PHONE_LANDSCAPE: 720
    });

    module.service('DeviceBreakpointService', ['$window', 'DEVICE_BREAKPOINT', function($window, DEVICE_BREAKPOINT) {
        function currentDeviceWidth() {
            return ($window.innerWidth > 0) ? $window.innerWidth : screen.width;
        }
        this.maxPotraitTablet = function() {
            return currentDeviceWidth() < DEVICE_BREAKPOINT.TABLET_POTRAIT;
        };

        this.isPhone = function () {
            var isPhone = false;
            if(window.innerHeight > window.innerWidth){
                isPhone = window.innerWidth <  DEVICE_BREAKPOINT.PHONE_PORTRAIT
            } else{
                isPhone = window.innerWidth <  DEVICE_BREAKPOINT.PHONE_LANDSCAPE
            }
            return isPhone;
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
