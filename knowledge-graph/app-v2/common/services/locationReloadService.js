(function(module) {
    'use strict';
    module.service('LocationReloadService', ['UserAgent', function(UserAgent) {
        this.reload = function() {
            if (UserAgent.isAWJade()) {
                window.location.search += '&t=' + new Date().getTime();
            } else {
                window.location.reload(true);
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
