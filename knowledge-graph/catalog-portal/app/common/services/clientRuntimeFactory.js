// (c) 2016 VMware, Inc.  All rights reserved.
(function(module){
    'use strict';
    module.service('ClientRuntimeFactory',[
                        'UserAgent',
                        'BrowserRuntimeService',
                        'JadeV2RuntimeService',
                        'HorizonClientRuntimeService',
                        function(UserAgent,
                                 BrowserRuntimeService,
                                 JadeV2RuntimeService,
                                 HorizonClientRuntimeService) {
            var clientRuntime = BrowserRuntimeService;

            if (UserAgent.isAWJadeV2()) {
                clientRuntime = JadeV2RuntimeService;
            } else if (UserAgent.isHorizon()) {
                clientRuntime =  HorizonClientRuntimeService;
            }
            return {
                get: function(){
                    return clientRuntime;
                }
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));