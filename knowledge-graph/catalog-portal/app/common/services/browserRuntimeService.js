// (c) 2016 VMware, Inc.  All rights reserved.
(function(module){
    'use strict';
    module.service('BrowserRuntimeService',[ 'UtilService', 'ConfigService', 'AppLauncherForDesktop', '$window', '$http', 'RequestFactory',
        function(UtilService,ConfigService,AppLauncherForDesktop,$window) {

            this.logout = function logout(apiLogoutUrl) {
                window.location.href = apiLogoutUrl;
            };

            this.about = function about(){
                location.hash = '#/about';
            };

            this.launchApp = function launchApp(app,$scope) {
                AppLauncherForDesktop.launch(app,$scope);
            };

            this.enroll = function enroll(mdmUrl){
                $window.location = mdmUrl;
            };
            
            this.openUrl = function(extUrl){
                window.open(extUrl);
            }
            
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));