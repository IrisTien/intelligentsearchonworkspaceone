'use strict';

/**
 * This is a utility service used to store and retrieve the client side data
 * persistently in the browser localStorage.
 *
 * In the case of localStorage is not supported, we will fall back to angular
 * cookie service.
 *
 */

angular.module('com.vmware.greenbox.appCenter').factory('hznLocalStorage', [ '$cookies', '$window',
    function ($cookies, $window) {
        var hznLocalStorage = {};
        var storage;
        var supported;
        try {
            storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
            supported = !(typeof storage === 'undefined');
            // Might be supported but still have "QUOTA_EXCEEDED_ERR" on Safari so do another test
            if (supported) {
                var test = 'test';
                storage.setItem(test, test);
                storage.removeItem(test);
            }
        } catch (e) {
            supported = false;
        }

        if (supported) {
            hznLocalStorage = storage;
        } else {
            hznLocalStorage = $cookies;
        }

        return hznLocalStorage;
    }]);