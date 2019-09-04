
(function(module) {
    'use strict';

    module.service('ConfigService', ['$http', '$q', 'RequestFactory', 'Resource', 'UtilService',
        function($http,$q, RequestFactory, Resource, UtilService){
        var baseUrl;

        var configService = this;

        var getLink = function(api) {
            return configService.getRootApiResource().get().thenGet('_links').thenGet(api).thenGet('href');
        };

        configService.doNotRefreshCache = false;
        configService.isReloading = false;

        configService.getAppCategories = function(){
            var urlPromise = configService.getAppCategoriesUrl();
            return urlPromise.then(function(url){
                var request = Resource(url ,{ headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('_embedded').thenGet('categoryResourceList');
            });
        };

        configService.getBaseUrl = function(){
            if(baseUrl) return baseUrl;
            if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                }
                return window.location.origin;
        };
        configService.getRootApiResource = function(){
            var apiResourceUrl = configService.getBaseUrl() + '/catalog-portal/services/api';
            return Resource(apiResourceUrl, { cache:true, headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
        };
        configService.getEntitlementsUrl = function(){
            return getLink('entitlements');
        };
        configService.getLauncherUrl = function(){
            return getLink('launcher');
        };
        configService.getAppCategoriesUrl = function(){
            return getLink('categories');
        };
        configService.getLauncherCategoriesUrl = function(){
            return getLink('launcherCategories');
        };
        configService.enrollmentSupported = function(){
            //Enrollment is supported if the current device is unmanaged.
            // Manged device has deviceUid in the URL
            return window.location.href.indexOf('deviceUdid') < 0;
        };
        configService.getEnrollmentUrl = function(){
            return getLink('enrollDevice');
        };
        configService.getBootstrapUrl = function(){
            return getLink('bootstrap');
        };
        configService.getUserInfoUrl = function(){
            return getLink('user');
        };
        configService.getBrandingUrl = function(){
            return getLink('branding').then(function(brandingUrl){
                //TODO: remove when we devMode support
                return brandingUrl+window.location.search;
            });
        };
        configService.getRefreshCacheUrl = function(){
            return getLink('refreshCache');
        };
        configService.getOtaUrl = function(){
            return getLink('ota');
        };
        configService.getNativeClientRedirectUrl = function(){
            return getLink('redirect');
        };

        configService.getUserDevicesUrl = function(){
            return getLink('user-devices');
        };
        configService.getEventsUrl = function(){
            return getLink('events');
        };

        configService.getLogoutUrl = function(){
            return getLink('logout');
        };

        configService.getPasswordVaultRootUrl = function(){
            return getLink('passwordVaultRoot');
        };

        configService.getUserDevices = function() {
            return getDevices (configService.getUserDevicesUrl());
        };

        function getDevices(urlPromise) {
            return urlPromise.then(function(url){
                var request = Resource(url ,{ headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('_embedded').thenGet('userDeviceResourceList');
            });
        }
        
        configService.unlinkDevice = function(device) {
            if(device && device._links['unlink']) {
                var req = RequestFactory(device._links['unlink'].href, {
                    method:'PUT',
                    headers:{
                        Accept: 'application/hal+json'
                    }
                });
                return $http(req);
            }
            return;
        };

        configService.refreshCache = function() {
            if (configService.doNotRefreshCache) {
                configService.doNotRefreshCache = false;
                return;
            }
            var urlPromise = configService.getRefreshCacheUrl();
            return urlPromise.then(function(url){
                var request = Resource(url ,{headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get();
            });
        };
        configService.getFeatureFlagsUrl = function() {
            return getLink('toggles');
        };
        configService.featureFlags = function() {
            var urlPromise = configService.getFeatureFlagsUrl();
            return urlPromise.then(function(url){
                var request = Resource(url ,{ cache:true, headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('toggles');
            });
        };

        configService.isFeatureEnabled = function(feature) {
            var featureEnabled = false;
            return configService.featureFlags().then(function(features){
                var i;
                for(i=0; i < features.length; i++){
                    if(features[i].featureName === feature){
                        featureEnabled = features[i].enabled;
                    }
                }
                return featureEnabled;
            });
        };
        configService.getAdminConsoleUrl = function(){
            return getLink('adminConsole');
        };

        configService.getAdminConsoleTermsUrl = function(){
            return getLink('adminConsoleTerms');
        };
        
        configService.getDeviceRegistrationDetail = function(){
            return getLink('deviceRegistrationDetails').then(function (url) {
                return Resource(url.replace('{deviceId}', UtilService.getQueryParams().deviceUdid), {
                    headers: {
                        'Accept': 'application/vnd.vmware.catalog.devices-registration-details-v1-hal+json',
                        'method': 'GET'
                    }
                });
            });
        };

        configService.getDeviceUnRegistrationUrl = function(){
            return getLink('deviceUnregistration');
        };
        configService.getAuthUri = function(){
            return getLink('authUri').then(function(authUri) {
                var req = Resource(authUri, {headers: { method:'GET',Accept: 'application/hal+json' }});
                return req.get().then(function(res) {
                    return res.authUri;
                });
            });
        };

        configService.changePassword = function(requestBody){
            return getLink('changePassword').then(function (url) {
                var req = RequestFactory(url, {
                    method:'PUT',
                    headers:[{"Accept": "application/hal+json"},
                            {"Content-Type": "application/json"}],
                    data: requestBody
                });
                return $http(req);
            });
        };

        configService.getPasswordPolicy = function () {
            return getLink('passwordPolicy').then(function (url) {
                return Resource(url, {headers: {'Content-Type': 'application/vnd.vmware.horizon.manager.tenants.tenant.passwordpolicy+json', 'method': 'GET'}});
            });
        };

        configService.isContraFeatureFlagEnabled = function() {
            return UtilService.getObjValue(window, 'workspaceOne.featureFlags.CONTRA', false);
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
