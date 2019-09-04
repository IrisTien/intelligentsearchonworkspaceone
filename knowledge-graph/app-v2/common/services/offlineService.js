(function(module) {
    'use strict';

    module.service('OfflineService', ['$window', '$rootScope', '$document', 'UserAgent', '$timeout', '$document',
        function($window, $rootScope, $document, UserAgent, $timeout) {
        var deviceOnline = $window.navigator.onLine || true;
        var hidden, visibilityChange;
        var connectionTimer;

        function handleVisibilityChange() {
            if (connectionTimer) {
                $timeout.cancel(connectionTimer);
            }

            if (document[hidden]) {
                $rootScope.$broadcast('tabHidden', deviceOnline);
            } else {
                connectionTimer = $timeout(function() {
                    $rootScope.$broadcast('tabShown', deviceOnline);
                }, 2000);
            }
        }

        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        if (visibilityChange) {
            $document.on(visibilityChange, handleVisibilityChange.bind(this));
        }

        $window.addEventListener('online', function() {
            deviceOnline = true;
            $rootScope.$broadcast('deviceOnlineStatusChanged', deviceOnline);
        });

        $window.addEventListener('offline', function() {
            deviceOnline = false;
            $rootScope.$broadcast('deviceOnlineStatusChanged', deviceOnline);
        });

        this.isDeviceOnline = function() {
            return deviceOnline;
        };

        this.isTabVisible = function() {
            return hidden ? document[hidden] : true;
        };
    }]);
})(angular.module('com.vmware.greenbox.services.offlineService', []));

