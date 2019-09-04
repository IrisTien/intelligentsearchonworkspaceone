/**
 * This service will handle most of the Horizon actions.
 */
(function(module) {
    'use strict';

    module.service('HorizonService', ['UtilService', 'HorizonClientScheme', 'ConfigService',
        function(UtilService, HorizonClientScheme, ConfigService) {
            var appCenterCtrl = null;

            this.init = function(ctrl) {
                /**
                 * Do horizon initialization, more action will be added here later.
                 * The action will include:
                 * 1. idle session time out
                 * 2. request for broker saml link
                 * 3. more...
                 */
                if (!ctrl) {
                    return;
                }

                appCenterCtrl = ctrl;
                // Init flags for horizon client
                appCenterCtrl.horizon = {
                    // Hide the user menu button
                    showUserInfo: false
                };

                UtilService.openURIScheme(HorizonClientScheme.LOGIN_DONE);
                // Send api links to client
                ConfigService.getRootApiResource().get().thenGet('_links').then(function(API) {
                    var key,
                        APIObj = {};

                    for (key in API) {
                        if (API.hasOwnProperty(key)) {
                            APIObj[key] = API[key].href;
                        }
                    }
                    UtilService.openURIScheme(UtilService.buildScheme(
                        HorizonClientScheme.GB_API, APIObj));
                });
            };

            this.sendUserInfo = function() {
                // Encode the user name because it is possibly non ASCII chars
                var user = appCenterCtrl.user,
                    userInfo = {
                        emailAddress: user.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName
                    };
                 UtilService.openURIScheme(UtilService.buildScheme(
                     HorizonClientScheme.USERINFO, userInfo));
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
