(function(module) {
    'use strict';
    module.service('PasswordVaultAppCredentialsService', [
        '$http',
        'RequestFactory',
        function(
            $http,
            RequestFactory) {
            this.getPVAppCredentials = function(url) {
                var request = RequestFactory(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/hal+json'
                    }
                });
                return $http(request);
            };

            this.setPVAppCredentials = function(url, params) {
                    var req = RequestFactory(url, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/hal+json'
                        },
                        params: params
                    });
                    return $http(req);
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
