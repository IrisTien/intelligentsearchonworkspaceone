(function(module) {
    'use strict';
    module.service('ThinappMultiDeviceActivationService', [
        '$http',
        'RequestFactory',
        'Resource',
        function($http,
                 RequestFactory,
                 Resource) {
            this.getDeviceReqs = function(app) {
                var request = Resource(app._links['device-activation-requests'].href, { headers: { 'Accept': 'application/hal+json', 'method': 'GET' } });
                return request.get().thenGet('thinappDeviceRequests');
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
