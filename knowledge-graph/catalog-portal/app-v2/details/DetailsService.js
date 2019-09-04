(function(module) {
    'use strict';

    var appDetailsEndpoint = '/catalog-portal/services/api/apps/';

    module.service('DetailsService', ['Resource', 'ConfigService', 'ModalService',
        function(Resource, ConfigService, ModalService) {
            var service = this;

            service.getAppDetailsResource = function(appId) {
                var apiResourceUrl = ConfigService.getBaseUrl() + appDetailsEndpoint + appId;
                return Resource(apiResourceUrl, { headers: { Accept: 'application/hal+json' } });
            };

            service.openSetPVAppPasswordDialog = function(app, $event) {
                if ($event) {
                    $event.stopPropagation();
                }
                ModalService.getCurrentModal().open('app-v2/details/passwordVaultAppCredentials.html', { app: app });
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
