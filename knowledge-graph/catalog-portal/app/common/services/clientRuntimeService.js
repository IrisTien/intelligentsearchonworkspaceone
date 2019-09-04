// (c) 2016 VMware, Inc.  All rights reserved.

/**
 *  Base service that uses the appropriate runtime implementation
 *  e.g. Jadev1, Jadev2, HorizonClient and Browser
 *  This forces all the implementations to define the interfaces
 * 
 */

(function(module){
    // use strict' it depreciates arguments.callee
    module.service('ClientRuntimeService',[ 'ClientRuntimeFactory',
                                            function(ClientRuntimeFactory) {
            var _clientRuntime = ClientRuntimeFactory.get();

            this.logout = function logout() {
                _invokeImplementation('logout', arguments);
            };

            this.about = function about(){
                _invokeImplementation('about', arguments);
            };

            this.launchApp = function launchApp() {
                _invokeImplementation('launchApp',arguments);
            };

            this.enroll = function enroll(){
                _invokeImplementation('enroll',arguments);
            };

            this.unEnroll = function unEnroll() {
                _invokeImplementation('unEnroll',arguments);
            };

            this.register = function register() {
                _invokeImplementation('register',arguments);
            };

            this.openUrl = function openUrl() {
                _invokeImplementation('openUrl',arguments);
            };

            this.installApp = function installApp(){
                _invokeImplementation('installApp',arguments);
            };

            this.windowsInstallProgress = function windowsInstallProgress(){
                _invokeImplementation('windowsInstallProgress',arguments);
            };

            function _invokeImplementation(fnName,args) {
                if(_clientRuntime[fnName]){
                    _clientRuntime[fnName].apply(null,Array.prototype.slice.call(args));
                }
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

