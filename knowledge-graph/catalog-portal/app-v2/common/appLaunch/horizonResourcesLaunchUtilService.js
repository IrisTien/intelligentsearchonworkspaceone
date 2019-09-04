angular.module('com.vmware.greenbox.appCenter')
    .service('HorizonResourcesLaunchUtilService', ['UserAgent',
        function(
            UserAgent) {
            'use strict';

            var horizonResourcesLaunchUtilService = this;
            /**
             * Calculate the launchable clients supported on current browser.
             *
             * @param view {Object}
             * @private
             */
            horizonResourcesLaunchUtilService.getLaunchableClients = function(view) {
                if (!view) {
                    return;
                }
                if (view._launchableClients) {
                    return view._launchableClients;
                }
                var launchableClients = [];
                //For IE9 or earlier, remove BLAST if it is there.
                // Remove BLAST for all mobile browsers except safari and IE (Edge browser)
                if (!UserAgent.isViewHTMLAccessSupportedBrowser()) {
                    view._launchableClients = removeBlastFromLaunchableClients(view);
                } else {
                    if (view.optionalAppInfo.clientTypes) {
                        view._launchableClients = view.optionalAppInfo.clientTypes;
                    }
                    if (view.optionalAppInfo.supportedPoolProtocols) {
                        view._launchableClients = getLaunchableClientsFromSupportedPoolProtocols(view);
                    }
                }
                return view._launchableClients;
            };

            function getLaunchableClientsFromSupportedPoolProtocols(view) {
                var launchableClients = [];
                if (view.optionalAppInfo.supportedPoolProtocols) {
                    for (var i = 0; i < view.optionalAppInfo.supportedPoolProtocols.length; i++) {
                        if (view.optionalAppInfo.supportedPoolProtocols[i] === "PCOIP" || view.optionalAppInfo.supportedPoolProtocols[i] === "NATIVE") {
                            launchableClients.push("NATIVE");
                        }
                        if (view.optionalAppInfo.supportedPoolProtocols[i] === "BLAST" || view.optionalAppInfo.supportedPoolProtocols[i] === "BROWSER") {
                            launchableClients.push("BROWSER");
                        }
                    }
                }
                return launchableClients;
            }

            function removeBlastFromLaunchableClients(view) {
                var launchableClients = [];
                var clients = view.optionalAppInfo.clientTypes;
                if (!clients) {
                    clients = getLaunchableClientsFromSupportedPoolProtocols(view);
                }
                angular.forEach(clients, function(client) {
                    if (client !== 'BROWSER') {
                        this.push(client);
                    }
                }, launchableClients);
                return launchableClients;
            }

            horizonResourcesLaunchUtilService.isClientLaunchable = function(view, clientType) {
                var launchableClients = horizonResourcesLaunchUtilService.getLaunchableClients(view);
                var isLaunchable = false;
                angular.forEach(launchableClients, function(launchableClient) {
                    if (launchableClient == clientType) {
                        isLaunchable = true;
                    }
                });

                return isLaunchable;
            };
        }]);
