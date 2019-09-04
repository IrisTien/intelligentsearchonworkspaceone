// (c) 2014 VMware, Inc.  All rights reserved.

/*
 * Service that loads the root resource and caches the response within same user session
 */
(function(module) {
    'use strict';

     module.factory('RootResource', ['Resource', '$q', function(Resource, $q) {
         var rootResource = Resource('/jersey/manager/api', {
             cache: true,
             headers: {
                 Accept: 'application/vnd.vmware.horizon.manager.root+json'
             }
         });

         var promise = rootResource.get();

         return {
             get: function() {
                 return promise;
             }
         };
     }]);
})(angular.module('com.vmware.workspace.services.rootResource', []));
