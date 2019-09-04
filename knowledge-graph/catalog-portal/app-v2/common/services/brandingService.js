(function(module) {
    'use strict';

	module.service('BrandingService', ['Resource', 'ConfigService', function(Resource, ConfigService) {
        var brandingService = this;

        brandingService.getBranding = function() {
            return ConfigService.getBrandingUrl().then(function(url) {
                return Resource(url, {
                    headers: {'Accept': 'application/vnd.vmware.catalog.branding-details.v1+json', 'method': 'GET'}
                }).get();
            });
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
