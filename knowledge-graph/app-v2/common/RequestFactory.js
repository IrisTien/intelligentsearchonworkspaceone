angular.module('com.vmware.greenbox.appCenter').factory('RequestFactory', [function() {
    'use strict';

    function RequestFactory(url, config) {
        var ng = angular;
        var request = {};

        if (config && ng.isObject(config)) {
            request = ng.extend(request, config);
        }

        request.url = request.url || url;
        request.method = request.method || "GET";

        return request;
    }

    return RequestFactory;
}]);
