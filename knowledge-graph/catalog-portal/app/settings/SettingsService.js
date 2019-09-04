(function(module) {

    'use strict';

    module.service('SettingsService', ['Resource', 'ConfigService', function(Resource, ConfigService){

        var currentUser = {};
        var currentBranding = {};
        var settingsService = this;

        settingsService.setCurrentUser = function(user) {
            currentUser = user;
        };
        settingsService.getCurrentUser = function() {
            return currentUser;
        };

        settingsService.getUserInfo = function(){
            return ConfigService.getUserInfoUrl().then(function(userUrl){
                return Resource(userUrl, {cache:true, headers: {'Accept': 'application/hal+json', 'method': 'GET'}}).get();
            });
        };
        settingsService.setCurrentBranding = function(branding) {
            currentBranding = branding;
        };
        settingsService.getCurrentBranding = function() {
            return currentBranding;
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));