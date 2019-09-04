(function(module) {
    'use strict';

    //moving it to constants, its easy to mock for test case
    module.constant('POLLING_INTERVALS', {
        TIMEOUT_SECONDS: 4 * 60 * 1000,
        START_POLLING_TIME_INTERVAL: 0,
        DEVICE_REGISTRATION_CHECK_INTERVAL: 3 * 60 * 1000,
        NOTIFICATION_SVC_REALTIME_CONNECTION_CHECK_INTERVAL: 3 * 60 * 1000
    });
})(angular.module('com.vmware.greenbox.appCenter'));

