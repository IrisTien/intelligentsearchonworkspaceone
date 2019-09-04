// (c) 2016 VMware, Inc.  All rights reserved.
(function(module){
    'use strict';
    module.service('HorizonClientRuntimeService',[ 'UtilService', 'HorizonClientScheme', 'AppLauncherForHorizon',
        function( UtilService, HorizonClientScheme, AppLauncherForHorizon) {
            
            this.logout = function() {
                UtilService.openURIScheme(HorizonClientScheme.LOGOUT);
            };

            this.about = function() {
                UtilService.openURIScheme(HorizonClientScheme.ABOUT);
            };
            
            this.launchApp = function(app) {
                AppLauncherForHorizon.launch(app)    
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
