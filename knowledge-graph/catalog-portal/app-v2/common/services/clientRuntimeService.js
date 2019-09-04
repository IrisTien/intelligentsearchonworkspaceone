// (c) 2016 VMware, Inc.  All rights reserved.

/**
 *  Base service that uses the appropriate runtime implementation
 *  e.g. Jadev1, Jadev2, HorizonClient and Browser
 *  This forces all the implementations to define the interfaces
 */

(function(module) {
    // use strict' it depreciates arguments.callee
    module.service('ClientRuntimeService', ['ClientRuntimeFactory',
                                            function(ClientRuntimeFactory) {
            var _clientRuntime = ClientRuntimeFactory.get();

            this.logout = function logout() {
                _invokeImplementation('logout', arguments);
            };

            this.about = function about() {
                _invokeImplementation('about', arguments);
            };

            this.notification = function about() {
                _invokeImplementation('notification', arguments);
            };

            this.launchApp = function launchApp() {
                _invokeImplementation('launchApp', arguments);
            };

            this.enroll = function enroll() {
                _invokeImplementation('enroll', arguments);
            };

            this.unEnroll = function unEnroll() {
                _invokeImplementation('unEnroll', arguments);
            };

            this.register = function register() {
                _invokeImplementation('register', arguments);
            };

            this.openUrl = function openUrl() {
                _invokeImplementation('openUrl', arguments);
            };

            this.installApp = function installApp() {
                _invokeImplementation('installApp', arguments);
            };

            this.installProgress = function installProgress() {
                _invokeImplementation('installProgress', arguments);
            };

            this.showAppInstall = function showAppInstall() {
                _invokeImplementation('showAppInstall', arguments);
            };

            this.openEmail = function openEmail() {
                _invokeImplementation('openEmail', arguments);
            };

            this.openTel = function openTel() {
                _invokeImplementation('openTel', arguments);
            };

            this.openSms = function openSms() {
                _invokeImplementation('openSms', arguments);
            };

            this.openMaps = function openMaps() {
                _invokeImplementation('openMaps', arguments);
            };

            this.accounts = function() {
                _invokeImplementation('accounts', arguments);
            };

            this.closePassword = function() {
                _invokeImplementation('closePassword', arguments);
            };

            this.refreshUCC = function() {
                _invokeImplementation('refreshUCC', arguments);
            };

            this.openNativeAppDetails = function() {
                _invokeImplementation('openNativeAppDetails', arguments);
            };

            function _invokeImplementation(fnName, args) {
                if (_clientRuntime[fnName]) {
                    _clientRuntime[fnName].apply(null, Array.prototype.slice.call(args));
                }
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

