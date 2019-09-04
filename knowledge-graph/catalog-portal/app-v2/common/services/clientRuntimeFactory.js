// (c) 2016 VMware, Inc.  All rights reserved.
(function(module) {
    'use strict';
    module.service('ClientRuntimeFactory', [
                        'UserAgent',
                        'BrowserRuntimeService',
                        'JadeV2RuntimeService',
                        function(UserAgent,
                                 BrowserRuntimeService,
                                 JadeV2RuntimeService) {
            var clientRuntime = BrowserRuntimeService;

            if (UserAgent.isAWJadeV2()) {
                clientRuntime = JadeV2RuntimeService;
            }
            return {
                get: function() {
                    return clientRuntime;
                }
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
