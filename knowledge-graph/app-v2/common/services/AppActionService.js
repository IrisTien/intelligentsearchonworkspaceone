(function(module) {
    'use strict';
    module.service('AppActionService', [
        '$http',
        'RequestFactory',
        function(
            $http,
            RequestFactory) {
            var appActionService = this;

            appActionService.resetDesktop = function(resetUrl) {
                var request = RequestFactory(resetUrl, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/hal+json'
                    }
                });
                return $http(request);
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));

