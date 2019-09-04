// (c) 2016 VMware, Inc.  All rights reserved.
(function(module) {
    'use strict';
    var JADE_SCHEME = "awjade://";
    var HORIZON_SCHEME = 'vmwhorizon://';
    var V2_HANDLER = 'notify?action=';
    var AW_JADE_V2_BASE_URI = JADE_SCHEME+V2_HANDLER;
    var HORIZON_PREFIX = HORIZON_SCHEME+V2_HANDLER;
    
    module.constant('JadeV1Scheme', {
        ABOUT:JADE_SCHEME+"about",
        LOGOUT:JADE_SCHEME+"logout?code=0",
        SERVER_LOGOUT:JADE_SCHEME+"logout?code=2",
        APP_LAUNCH:JADE_SCHEME+"redirect?url="
    });
    
    module.constant('JadeV2Scheme', {
        JADE_SCHEME: JADE_SCHEME,
        ABOUT:AW_JADE_V2_BASE_URI+"ABOUT",
        LOGOUT_POPUP:AW_JADE_V2_BASE_URI+"LOGOUT&code=0",
        LOGOUT_NO_POPUP:AW_JADE_V2_BASE_URI+"LOGOUT&code=0&popup=none",
        SERVER_LOGOUT:AW_JADE_V2_BASE_URI+"LOGOUT&code=2",
        APP_LAUNCH:AW_JADE_V2_BASE_URI+"REDIRECT",
        MDM_ENROLL:AW_JADE_V2_BASE_URI+"MDM_ENROLL",
        CONTAINER_ENROLL:AW_JADE_V2_BASE_URI+"CONTAINER_ENROLL",
        MDM_UNENROLL:AW_JADE_V2_BASE_URI+"MDM_UNENROLL",
        OPEN_URL:AW_JADE_V2_BASE_URI+"OPEN",
        INSTALL_APP:AW_JADE_V2_BASE_URI+"INSTALL_APP"
    });
    
    module.constant('HorizonClientScheme', {
        SAAS_LAUNCH: HORIZON_PREFIX + "REDIRECT",
        VIEW_LAUNCH: HORIZON_PREFIX + "LAUNCH_HORIZON",
        XENAPP_LAUNCH: HORIZON_PREFIX + 'LAUNCH_XENAPP',
        ABOUT: HORIZON_PREFIX + "ABOUT",
        LOGOUT: HORIZON_PREFIX + "LOGOUT",
        LOGIN_DONE: HORIZON_PREFIX + "LOGIN_DONE",
        USERINFO: HORIZON_PREFIX + 'USER_INFO',
        GB_API: HORIZON_PREFIX + 'API'
    });
    
})(angular.module('com.vmware.greenbox.appCenter'));


