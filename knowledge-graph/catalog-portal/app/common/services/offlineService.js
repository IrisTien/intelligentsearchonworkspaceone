(function(module){
    'use strict';

    module.service('OfflineService',['$window', '$rootScope', function($window, $rootScope){
        var deviceOnline = $window.navigator.onLine || true;

        $window.addEventListener('online', function(){
            deviceOnline = true;
            $rootScope.$broadcast('deviceOnlineStatusChanged',deviceOnline);
        });

        $window.addEventListener('offline', function(){
            deviceOnline = false;
            $rootScope.$broadcast('deviceOnlineStatusChanged',deviceOnline);
        });

        this.isDeviceOnline = function(){
            return deviceOnline;
        };

    }]);

})(angular.module('com.vmware.greenbox.services.offlineService', []));