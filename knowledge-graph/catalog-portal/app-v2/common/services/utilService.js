/**
 * Util service
 */
angular.module('com.vmware.greenbox.appCenter').service('UtilService', [
    '$window',
    'UserAgent',
    '$injector',
    'JadeV2Scheme',
    function($window,
             UserAgent,
             $injector,
             JadeV2Scheme) {
        'use strict';

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

            if (!angular.isString(origUrl)) {
                origUrl = "";
            }

            var anchorRE = /#.*$/;
            var anchorMatch = anchorRE.exec(origUrl);
            var anchor = anchorMatch && anchorMatch.length ? anchorMatch[0] : "";
            var noAnchorUrl = origUrl.replace(anchorRE, '');

            var idx = noAnchorUrl.indexOf("?");
            if (idx < 0) {
                return [noAnchorUrl, "?", params, anchor].join('');
            } else if (idx == noAnchorUrl.length - 1) { //? is the last char.
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
            for (var key in object) {
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
        this.diffArray = function(arr1, arr2) {
            return arr1.filter(function(x) {
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
        };

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
            if (UserAgent.isAWJade() && UserAgent.isWindows()) {
                var ConfigService = $injector.get('ConfigService');
                ConfigService.getNativeClientRedirectUrl().then(function(redirectUrl) {
                    link = redirectUrl + '?nativeClientUri=' + encodeURIComponent(link);
                    window.location.href = link;
                }.bind(this));
            } else {
                this.openLinkInIframe(link);
            }
        };

        this.getServerUrl = function(path, includeQueryStr) {
            var loc = $window.location;
            var serverUrl = loc.protocol + PROTOCOL_SEPARATOR + loc.hostname;

            if (loc.port) {
                serverUrl += PORT_SEPARATOR;
                serverUrl += loc.port;
            }

            if (angular.isString(path)) {
                if (path[0] && path[0] != '/') {
                    serverUrl += '/';
                }
                serverUrl += path;
            }
            if (includeQueryStr) {
                serverUrl += loc.search;
            }
            return serverUrl;
        };

        this.addQueryParams = function(path) {
            var loc = $window.location;
            var serverUrl = path;
            serverUrl += loc.search;
            return serverUrl;
        };

        this.buildScheme = function(schemePrefix, paramsObj) {
            if (!schemePrefix) {
                return;
            }

            if (!angular.isObject(paramsObj)) {
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
            return $window.location.search.replace(/(^\?)/, '').split("&").map(function(n) {
                return n = n.split("="), this[n[0]] = n[1], this;
            }.bind({}))[0];
        };

        this.getObjValue = function(contextObject, refStr, defaultValue) {
            return _.get(contextObject, refStr, defaultValue);
        };

        this.appendQueryParams = function(url, queryParamObj) {
            var result = url;
            var queryParams = [];

            function keyValToQueryParam(key, value) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }

            if (angular.isObject(queryParamObj)) {
                angular.forEach(queryParamObj, function(value, key) {
                    if (angular.isString(value)) {
                        queryParams.push(keyValToQueryParam(key, value));
                    } else if (angular.isArray(value)) {
                        queryParams.push(keyValToQueryParam(key, value.filter(angular.isString).map(encodeURIComponent).join(',')));
                    }
                });
            }

            if (queryParams.length > 0) {
                var queryParamStr = queryParams.join("&");
                if (result.indexOf('?') >= 0) {
                    result += "&" + queryParamStr;
                } else {
                    result += "?" + queryParamStr;
                }
            }
            return result;
        };

        this.getUserID = function() {
            return workspaceOne.userId;
        };

        this.getDeviceID = function() {
            return workspaceOne.deviceId;
        };

        this.hexToRgb = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        this.threeHexToSixHex = function(hex) {
            var threeHexArray = hex.split(""),
                sixHexArray = [],
                sixHexValue = "";

            for (var i = 1; i < threeHexArray.length; i++) {
                //The first one will be "#"
                sixHexArray.push(threeHexArray[i], threeHexArray[i]);
            }
            sixHexValue = "#" + sixHexArray.join("");

            return sixHexValue;
        };

        // Input the hex value and desired the alpha value, to output the new rgba color
        this.hexToRgbA = function(hex, alpha) {
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split('');
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = '0x' + c.join('');
                return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
            }
            throw new Error('Bad Hex');
        };

        // Use this function to shade the interactive color (lighten is pass a position amount e.g. +30; darkend is pass a negative color e.g. -40
        // All the colors are hex colors from the hub-branding starting with a #, could be three or 6 digit
        this.shadeColor = function(hex, amt) {
            if (hex[0] == "#") {
                hex = hex.slice(1);
            }

            var R = parseInt(hex.substring(0, 2), 16),
                G = parseInt(hex.substring(2, 4), 16),
                B = parseInt(hex.substring(4, 6), 16);

            R = R + amt;
            G = G + amt;
            B = B + amt;

            if (R > 255) {
                R = 255;
            } else if (R < 0) {
                R = 0;
            }

            if (G > 255) {
                G = 255;
            } else if (G < 0) {
                G = 0;
            }

            if (B > 255) {
                B = 255;
            } else if (B < 0) {
                B = 0;
            }

            var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
            var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
            var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

            return "#" + RR + GG + BB;
        };

        this.copyEmailSupported = function() {
            // for hub macapp we use the copy email as well
            return (UserAgent.isNativeAppVersionBelow('3.3') && UserAgent.isAWJadeDesktop()) || UserAgent.isDesktopBrowser() || (UserAgent.isHubApp() && UserAgent.isMac());
        };

        this.timeDifference = function(created, now) {
            return now.diff(created, 'minutes');
        };

        this.isNativeNavNotEnabled = function(customizationSettings) {
            var nativenavEnabled = this.getObjValue(customizationSettings, 'nativenavEnabled', false);
            return ((nativenavEnabled && !(UserAgent.isAWJadeWithNativenav()
                || UserAgent.isAWJadeWindowsNativenav())) || !nativenavEnabled);
        };

        this.constructTouRedirectUrl = function(url, logoutUrl, userName) {
            url = url.replace("{acceptDest}", encodeURIComponent(window.location.href));
            logoutUrl += "?unEnroll=true&idp=workspace";
            url = url.replace("{declineDest}", encodeURIComponent(logoutUrl));
            url = url.replace("{deviceUdid}", userName + "-" + this.getQueryParams().deviceUdid);
            return url;
        };

        this.goBack = function() {
            window.history.back();
        };

        this.isHub = function() {
            return this.isHubNative() || this.isHubBrowsers();
        };

        this.isHubDesktop = function() {
            return this.isHubDesktopApp() || (this.isHubBrowsers() && UserAgent.isDesktopBrowser());
        };

        this.isHubMobile = function() {
            return this.isHubMobileApp() || this.isHubMobileBrowsers();
        };

        this.isHubMobileBrowsers = function() {
            return this.getObjValue(window, 'workspaceOne.featureFlags.V2_HUB', false) && UserAgent.isMobileBrowser();
        };

        this.isHubV2NotificationsEnabled = function() {
            return this.getObjValue(window, 'workspaceOne.featureFlags.V2_HUB_NOTIFICATIONS', false);
        };

        this.isHubBrowsers = function() {
            return this.getObjValue(window, 'workspaceOne.featureFlags.V2_HUB', false) && UserAgent.isBrowser()
                && !this.getObjValue(window, 'workspaceOne.isWorkspaceONE');
        };

        this.isHubDesktopApp = function() {
            return UserAgent.isAWJadeDesktop() && UserAgent.isHubApp();
        };

        this.isHubMobileApp = function() {
            return UserAgent.isAWJadeMobile() && UserAgent.isHubApp();
        };

        this.isHubNative = function() {
            return this.isHubDesktopApp() || this.isHubMobileApp();
        };

        this.informAvatarLoaded = function() {
            this.openURIScheme(JadeV2Scheme.AVATAR_RENDERED);
        };

        this.informHubContentLoaded = function() {
            this.openURIScheme(JadeV2Scheme.CONTENT_LOADED);
        };

        this.checkTermsOfUseStatus = function() {
            return UserAgent.isAWJade()
                && !(UserAgent.isAndroid() && !UserAgent.isNativeAppVersionIsEqualOrAbove('3.3'))
                && this.getQueryParams().deviceUdid;
        };

        this.loadTemplateForPlatform = function(mobileTemplate, desktopTemplate, browserTemplate) {
            if (UserAgent.isAWJadeMobile()) {
                return mobileTemplate;
            } else if (UserAgent.isAWJadeDesktop()) {
                return desktopTemplate;
            } else {
                return browserTemplate;
            }
        };

        this.hideVirtualApps = function() {
            var hideVirtualApp = this.getObjValue(workspaceOne.featureFlags, 'HIDE_VIRTUAL_APPS_ON_MOBILE', false);
            var inch = 0.0104166667; // 1 pixel = 0.0104166667 inchs(https://www.unitconverters.net/typography/pixel-x-to-inch.htm)
            var width = Math.round(window.innerWidth) * inch;
            var height = Math.round(window.innerHeight) * inch;
            return (UserAgent.isMobile() && hideVirtualApp && Math.max(width, height) < 9 && this.isHubNative());
        };

        this.isMdmOnlyMode = function() {
            var idpQueryParam = this.getQueryParams().idp || "";
            return idpQueryParam.toLowerCase() === "mdm";
        };

        this.isWindowsNativeBridge = function() {
            var nativeBridgeService = $injector.get('NativeBridgeService');
            return (UserAgent.isWindowsJade() && window && window.hasOwnProperty('NativeBridge')
                && UserAgent.isNativeAppVersionIsEqualOrAbove("3.4") && nativeBridgeService.getContainerMode());
        };

        this.isIOSNativeBridge = function() {
            return (UserAgent.isHubApp() && UserAgent.isIOS() && UserAgent.isNativeAppVersionIsEqualOrAbove("9.1"));
        };

        this.isAndroidNativeBridge = function() {
            return (UserAgent.isHubApp() && UserAgent.isAndroid() && UserAgent.isNativeAppVersionIsEqualOrAbove("9.1"));
        };

        this.isMacNativeBridge = function() {
            return (UserAgent.isMacJade() && window && window.hasOwnProperty('webkit') &&
                UserAgent.isNativeAppVersionIsEqualOrAbove("9.1"));
        };

        this.isNativeBridge = function() {
            return this.isWindowsNativeBridge() || this.isIOSNativeBridge() || this.isAndroidNativeBridge() || this.isMacNativeBridge();
        };

        this.isFavoriteEnabled = function(app) {
            return (app.isMdmApp && this.isFavoriteNativeAppEnabled())
                || !app.isMdmApp;
        };

        this.isFavoriteNativeAppEnabled = function() {
            return this.getObjValue(window, 'workspaceOne.featureFlags.FAVORITE_NATIVE_APPS', false);
        };
    }]);
