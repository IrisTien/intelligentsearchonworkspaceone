(function(module) {
    'use strict';

    module.constant('LocalStorageConstants', {
        TIMESTAMP: "timeStamp",
        ENTITLEMENTS: "Entitlements",
        NEW_APP: "new-apps",
        RECOMMENDED_APPS: "recommended-apps",
        BOOTSTRAP: "Bootstrap",
        BOOKMARKS: "Bookmarks",
        PEOPLE_PEER_DETAILS: "people-peer-details",
        PEOPLE_DIRECTS_DETAILS: "people-directs-details",
        ENTITLEMENTS_CATEGORIES: "Entitlements-Categories",
        DEVICE_ENROLLMENT_STATUS: "Device-Enrollment-Status",
        DEVICE_MGMT_STATUS: "Device-Mgmt-Status",
        HUB_BRANDING: 'hub-branding',
        MF_REGISTRATION: 'mf-registration',
        DEVICE_STEPUP_STATUS: "Device-Stepup-Status",
        TIMEOUT: 86400000 //24 hours
    });
})(angular.module('com.vmware.greenbox.appCenter'));
