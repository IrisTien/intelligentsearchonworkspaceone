'use strict';
/**
 * Util service
 */
angular.module('com.vmware.greenbox.appCenter')
        .service('UtilService', ['$window',
                                 'UserAgent',
                                 '$injector',
                                 function ($window,
                                           UserAgent,
                                           $injector) {
    var PROTOCOL_SEPARATOR = "//";
    var PORT_SEPARATOR = ":";

    /**
     * Append a key/value pair to a Url
     *
     * @param origUrl
     * @param obj {String} or {Object} if String, it acts as the key of the param. If Object, will parameterize the object.
     * @param value  Optional, should be specified if Object is a string.
     * @return {String}
     */
    this.appendQueryToUrl = function(origUrl, obj, value) {
        if (angular.isString(obj)) {
            var tmp = obj;
            obj = {};
            obj[tmp] = value;
        }

        var params = $.param(obj);

        if (!angular.isString(origUrl))  {
            origUrl = "";
        }

        var anchorRE = /#.*$/;
        var anchorMatch = anchorRE.exec(origUrl);
        var anchor = anchorMatch && anchorMatch.length ? anchorMatch[0] : "";
        var noAnchorUrl = origUrl.replace(anchorRE, '');

        var idx = noAnchorUrl.indexOf("?");
        if (idx < 0) {
             return [noAnchorUrl, "?", params, anchor].join('');
        } else if (idx == noAnchorUrl.length - 1) {  //? is the last char.
            return [noAnchorUrl, params, anchor].join('');
        } else {
            return [noAnchorUrl, "&", params, anchor].join('');
        }
    };


    /**
     * To check if an object is empty.
     * @param object the object to check.
     * @returns {boolean} true if it is empty, false otherwise.
     */
    this.isEmpty = function(object) {
        for(var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    /**
     * Get the difference between two arrays.
     * @param arr1 array that will be compared to second array.
     * @param arr2 array that will be compared against the first array.
     * @returns difference of arrays.
     */
    this.diffArray = function (arr1, arr2) {
        return arr1.filter(function (x) {
            return arr2.indexOf(x) < 0;
        });
    };

    /**
     * converts object to String
     * @param object
     * @returns String
     */
     this.toString = function(object) {
        return Object.prototype.toString.call(object);
    }


    /**
     * Checks if given object is a FormData instance.
     */
    this.isFormData = function(object) {
        return this.toString(object) === '[object FormData]';
    };

    /**
     * Checks if given object is a File instance.
     */
    this.isFile = function(object) {
        return this.toString(object) === '[object File]';
    };

    this.openLinkInIframe = function(link) {
        var appLauncherFrame = document.createElement("IFRAME");
        appLauncherFrame.setAttribute("src", link);
        appLauncherFrame.setAttribute("width", "0");
        appLauncherFrame.setAttribute("height", "0");
        document.documentElement.appendChild(appLauncherFrame);
    };

    this.openURIScheme = function(link) {
        /**
         * Windows 10 Scheme handler works using script notification
         * http://stackoverflow.com/questions/19353069/webview-capture-navigation-to-a-custom-protocol
         * However, this is only for the Jade Win10 Universal client, not for Horizon.
         */
        if(UserAgent.isAWJade() && UserAgent.isWindows()) {
            var ConfigService = $injector.get('ConfigService');
            ConfigService.getNativeClientRedirectUrl().then(function(redirectUrl) {
                link = redirectUrl + '?nativeClientUri=' + encodeURIComponent(link);
                window.location.href = link;
            }.bind(this));
        } else {
            this.openLinkInIframe(link);
        }
    };

    this.getServerUrl = function(path,includeQueryStr) {
        var loc =  $window.location;
        var serverUrl = loc.protocol + PROTOCOL_SEPARATOR + loc.hostname;

        if(loc.port){
            serverUrl += PORT_SEPARATOR;
            serverUrl += loc.port;
        }

        if(angular.isString(path)){
            if(path[0] && path[0] != '/'){
                serverUrl += '/';
            }
            serverUrl += path;
        }
        if(includeQueryStr){
            serverUrl += loc.search;
        }
        return serverUrl;
    };

    this.addQueryParams = function(path) {
        var loc =  $window.location;
        var serverUrl = path;
        serverUrl += loc.search;
        return serverUrl;
    };

    this.buildScheme = function(schemePrefix, paramsObj) {
        if(!schemePrefix) {
            return;
        }

        if(!angular.isObject(paramsObj)) {
            return schemePrefix;
        }

        var params = [];
        angular.forEach(paramsObj, function(val, key) {
            params.push(key + '=' + encodeURIComponent(val));
        });
        return schemePrefix + '&' + params.join('&');
    };

    this.getQueryParams = function() {
        //MIT license: https://github.com/youbastard/jquery.getQueryParameters/blob/master/LICENSE
        return $window.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    };

    this.getObjValue = function(contextObject, refStr, defaultValue) {
        return _.get(contextObject, refStr, defaultValue)
    }

    this.appendQueryParams = function(url,queryParamObj) {
        var result = url;
        var queryParams = [];
        function keyValToQueryParam(key,value) {
            return  encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }

        angular.isObject(queryParamObj) && 
        angular.forEach(queryParamObj,function (value,key) {
            if (angular.isString(value)) {
                queryParams.push(keyValToQueryParam(key, value));
            } else if (angular.isArray(value)) {
                queryParams.push(keyValToQueryParam(key, value.filter(angular.isString).map(encodeURIComponent).join(',')));
            }
        });
        
        if(queryParams.length > 0) {
            var queryParamStr = queryParams.join("&");
            if (result.indexOf('?') >= 0) {
                result += "&" + queryParamStr;
            } else {
                result += "?" + queryParamStr;                
            }
        }
        return result;
    };
    this.hideLaunchProgressContainer = function() {
        $('#launch-progress-container').hide();
    }

    this.showLaunchProgressContainer = function() {
        $('#launch-progress-container').show();
    }

}]);
