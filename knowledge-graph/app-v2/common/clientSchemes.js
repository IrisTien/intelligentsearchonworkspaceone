// (c) 2016 VMware, Inc.  All rights reserved.
(function(module) {
    'use strict';
    var JADE_SCHEME = "awjade://";
    var HORIZON_SCHEME = 'vmwhorizon://';
    var V2_HANDLER = 'notify?action=';
    var AW_JADE_V2_BASE_URI = JADE_SCHEME + V2_HANDLER;
    var HORIZON_PREFIX = HORIZON_SCHEME + V2_HANDLER;

    module.constant('JadeV1Scheme', {
        ABOUT: JADE_SCHEME + "about",
        LOGOUT: JADE_SCHEME + "logout?code=0",
        SERVER_LOGOUT: JADE_SCHEME + "logout?code=2",
        APP_LAUNCH: JADE_SCHEME + "redirect?url="
    });

    module.constant('JadeV2Scheme', {
        JADE_SCHEME: JADE_SCHEME,
        ABOUT: AW_JADE_V2_BASE_URI + "ABOUT",
        NOTIFICATION_SETTINGS: AW_JADE_V2_BASE_URI + "NOTIFICATION_SETTINGS",
        LOGOUT_POPUP: AW_JADE_V2_BASE_URI + "LOGOUT&code=0",
        LOGOUT_NO_POPUP: AW_JADE_V2_BASE_URI + "LOGOUT&code=0&popup=none",
        LOGOUT_HUB: AW_JADE_V2_BASE_URI + "LOGOUT&code=3",
        SERVER_LOGOUT: AW_JADE_V2_BASE_URI + "LOGOUT&code=2",
        REFRESH_COOKIE: AW_JADE_V2_BASE_URI + "LOGOUT&code=1",
        APP_LAUNCH: AW_JADE_V2_BASE_URI + "REDIRECT",
        MDM_ENROLL: AW_JADE_V2_BASE_URI + "MDM_ENROLL",
        CONTAINER_ENROLL: AW_JADE_V2_BASE_URI + "CONTAINER_ENROLL",
        MDM_UNENROLL: AW_JADE_V2_BASE_URI + "MDM_UNENROLL",
        OPEN_URL: AW_JADE_V2_BASE_URI + "OPEN",
        INSTALL_APP: AW_JADE_V2_BASE_URI + "INSTALL_APP",
        LAUNCH_NATIVE_NOTIFICATION_TRAY: AW_JADE_V2_BASE_URI + "LAUNCH_NATIVE_NOTIFICATION_TRAY",
        LAUNCH_NATIVE_APP_DETAILS: AW_JADE_V2_BASE_URI + "LAUNCH_NATIVE_APP_DETAILS&appId=",
        MAILTO_SCHEME: 'mailto:',
        TEL_SCHEME: 'tel:',
        SMS_SCHEME: 'sms:',
        GEO_SCHEME: 'geo:',
        ACCOUNT_PAGE: AW_JADE_V2_BASE_URI + 'ACCOUNT_PAGE',
        PASSWORD_CLOSE: AW_JADE_V2_BASE_URI + 'PASSWORD_CLOSE',
        AVATAR_RENDERED: AW_JADE_V2_BASE_URI + 'AVATAR_RENDERED',
        CONTENT_LOADED: AW_JADE_V2_BASE_URI + 'CONTENT_LOADED',
        UCC_REFRESH: AW_JADE_V2_BASE_URI + 'UCC_REFRESH'
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

