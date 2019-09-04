
(function(module) {
    'use strict';

    var appDetailsEndpoint = '/catalog-portal/services/api/apps/';

    module.service('DetailsService', ['Resource', 'ConfigService',
        function (Resource, ConfigService) {
            var service = this;
            var appDetails;

            service.getAppDetailsResource = function( appId ){
                var apiResourceUrl = ConfigService.getBaseUrl() + appDetailsEndpoint + appId;
                return Resource(apiResourceUrl, { headers: { Accept: 'application/hal+json' } });
            };

            service.setAppDetails = function(appDetails) {
                this.appDetails = appDetails;
            };
            service.getAppDetails = function() {
                return this.appDetails;
            };

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
