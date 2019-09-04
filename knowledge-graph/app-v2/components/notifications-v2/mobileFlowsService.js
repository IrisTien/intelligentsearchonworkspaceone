(function(module) {
    'use strict';

    module.service('MobileFlowsService', ['ConfigService', 'Resource', 'HttpProxyService', function(ConfigService, Resource, HttpProxyService) {
        var service = this;

        service.register = function() {
            var registered = HttpProxyService.getMFRegistrationFlag();

            if (!registered) {
                ConfigService.getMobileFlowsRegisterUrl().then(function(url) {
                    var request = Resource(url, {headers: {'method': 'POST'}});
                    return request.postResource().then(function() {
                        HttpProxyService.setMFRegistrationFlag();
                    });
                });
            }
        };

        service.getConnectors = function() {
            return ConfigService.getMobileFlowsConnectorsUrl().then(function(url) {
                var request = Resource(url, {headers: {'method': 'GET'}});
                return request.get().thenGet('connectors');
            });
        };

        service.enableConnector = function(id) {
            return ConfigService.getMobileFlowsConnectorRegistrationUrl().then(function(url) {
                url = url.replace('{connectorId}', id);
                var request = Resource(url, {headers: {'method': 'POST'}});
                return request.postResource();
            });
        };

        service.disableConnector = function(id) {
            return ConfigService.getMobileFlowsConnectorRegistrationUrl().then(function(url) {
                url = url.replace('{connectorId}', id);
                var request = Resource(url, {headers: {'method': 'DELETE'}});
                return request.deleteResource();
            });
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
