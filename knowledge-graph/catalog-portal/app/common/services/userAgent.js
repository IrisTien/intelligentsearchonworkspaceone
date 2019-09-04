'use strict';

/*
 * This service will detect the browser, browser version and OS.
 */
angular.module('com.vmware.greenbox.appCenter').
    factory('UserAgent', ['$http', '$rootScope', '$window', '$cookies', 'hznLocalStorage',
        function ($http, $rootScope, $window, $cookies, hznLocalStorage) {

    var browserDetect = {
        navigator: $window.navigator,
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(browserDetect.navigator.userAgent)
                || this.searchVersion(browserDetect.navigator.appVersion)
                || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
            this.hznCitrixReceiverInstalled = "hzn_citrix_receiver_installed";
            this.hznHorizonWorkspaceInstalled = "hzn_horizon_workspace_installed";
            this.hznViewClientInstalled = "hzn_view_client_installed";
            this.hznCompletedFTU = "hzn_completed_FTU";
            this.passwordVaultExtensionInstalled = "passwordvault_browser_extension_installed"
            this.awjade = "AWJADE";
            this.horizon = "vmwhorizon";
            this.isHorizonClient = navigator.userAgent.search(this.horizon) != -1;
            this.NATIVE_APP_VERSION_PATTERN = /awjade\/(\d+)\.(\d+)((\.(\d+))*)/g;
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++)	{
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.search(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
        isMac: function() {
            return (this.OS === 'Mac');
        },

        isWindows: function() {
            return (this.OS === 'Windows' || this.isWindowsPhone());
        },

        isIE: function() {
            return (this.browser === 'Explorer');
        },

        isIE8OrLower: function() {
            return this.isIE() && this.version < 9;
        },

        isChrome: function(){
            return (this.browser === 'Chrome');
        },

        isFF: function(){
            return (this.browser === 'Firefox');
        },

        isSafari: function(){
            return (this.browser === 'Safari');
        },

        isWebkit: function(){
            return (this.browser === 'Chrome' || this.browser === 'Safari') ;
        },

        isGecko: function(){
            return (this.browser === 'Mozilla');
        },

        isAWJade: function(version){
            //For Windows 10 user agent doesn't contain awjade in it.
            var aWJadeVersion = "awjade";
            if (version) {
                aWJadeVersion = "awjade/" + version;
            }
            if(!!$cookies[this.awjade] && $cookies[this.awjade].search(aWJadeVersion) != -1){
                return true;
            }
            if(this.isMobile()) {
                return (browserDetect.navigator.userAgent.search(aWJadeVersion) != -1);
            }
        },

        isAWJadeV2: function() {
            return this.isNativeAppVersionIsEqualOrAbove("2.0")
        },

        isNativeAppVersionIsEqualOrAbove: function(version){
            return this.checkVersion(version, this.isAppVersionGreater, this.isPatchVersionGreatOrEqual);
        },

        isNativeAppVersionIsEqualOrBelow: function(version){
            return this.checkVersion(version, this.isAppVersionLesser, this.isPatchVersionLessOrEqual);
        },

        checkVersion: function (version, compareFunction, finalCompare) {
            if (!version) {
                return false;
            }
            // Get the Major, Minor, Patch numbers from the given version.
            var givenVersion = this.getAppVersion(version);
            //For Windows 10 user agent doesn't contain awjade in it.
            var ua = '';

            if(!!$cookies[this.awjade]) {
                ua = $cookies[this.awjade];
            } else if(this.isMobile()) {
                ua = browserDetect.navigator.userAgent;
            }
            var patternMatchArr = ua.match(this.NATIVE_APP_VERSION_PATTERN);
            if (patternMatchArr != null) {
                var userAgentAppversion = patternMatchArr[0].split('/')[1]; // Get the version number from the pattern match
                if (userAgentAppversion) {
                    var appVersion = this.getAppVersion(userAgentAppversion);
                    if (compareFunction(appVersion.majorVersion, givenVersion.majorVersion)) { // If current app major version is lesser than given major version return true.
                        return true;
                    } else if (this.isAppVersionEqual(appVersion.majorVersion,givenVersion.majorVersion)) { // If current app major version is equal to given major version then check minor version.
                        if (compareFunction(appVersion.minorVersion, givenVersion.minorVersion)) { // If current app minor version is lesser than given minor version return true.
                            return true;
                        } else if (this.isAppVersionEqual(appVersion.minorVersion, givenVersion.minorVersion)) { // If current app minor version is equal to given minor version check patch version.
                            return finalCompare(appVersion.patchVersion, givenVersion.patchVersion);
                        }
                    }
                }
            }
            return false;
        },

        isPatchVersionLessOrEqual: function (appPatchVersion, givenPatchVersion) {
            return appPatchVersion <= givenPatchVersion;
        },

        isPatchVersionGreatOrEqual: function (appPatchVersion, givenPatchVersion) {
            return appPatchVersion >= givenPatchVersion;
        },

        isAppVersionLesser: function(appVersion, givenVersion) {
            return appVersion < givenVersion;
        },

        isAppVersionGreater: function(appVersion, givenVersion) {
            if (appVersion > givenVersion) {
                return true;
            }
            return false;
        },

        isAppVersionEqual: function(appVersion, givenVersion) {
            if (appVersion == givenVersion) {
                return true;
            }
            return false;
        },

        getAppVersion: function(appVersion) {
            if (!appVersion) {
                return {'majorVersion': 0, 'minorVersion': 0, 'patchVersion': 0};
            }
            var appVersionArr = appVersion.split('.');
            var appMajorVersion = (appVersionArr[0] && !isNaN(appVersionArr[0])) ? parseInt(appVersionArr[0]) : 0;
            var appMinorVersion = (appVersionArr[1] && !isNaN(appVersionArr[1])) ? parseInt(appVersionArr[1]) : 0;
            var appPatchVersion = (appVersionArr[2] && !isNaN(appVersionArr[2])) ? parseInt(appVersionArr[2]) : 0;
            return {'majorVersion': appMajorVersion, 'minorVersion': appMinorVersion, 'patchVersion': appPatchVersion};
        },
        isHorizon: function() {
            return this.isHorizonClient;
        },

        isBrowser: function() {
            return !this.isAWJade() && !this.isHorizon();
        },

       isDesktopBrowser:  function () {
            return this.isBrowser() && !this.isMobile();
        },
            
       isMobileBrowser: function() {
            return !this.isAWJade() && (this.isMobile() || this.isWin10Browser());
        },

        isNPAPISupportedBrowser: function() {
            return !((this.isWindows() || this.isMac()) && (this.isChrome() || this.isDesktopWindowsEdgeBrowser()));            
        },    
            

        // Detect mobile browser and type
        isMobile: function () {
            var ua = navigator.userAgent;
            if  ( ua.match(/Android/i) ||
                  ua.match(/webOS/i) ||
                  ua.match(/iPhone/i) ||
                  ua.match(/iPad/i) ||
                  ua.match(/iPod/i) ||
                  ua.match(/BlackBerry/i)  ||
                  ua.match(/Windows Phone/i)
                ) {
                return true;
            }
            return false;
        },

        // Detect if device is managed and GB is accessed from weblic
        isWebClip: function () {
            return (!this.isAWJade()) && (location.search.indexOf('deviceUdid') > -1);
        },

        // Detect windows desktop or surfacepro edge browser
        isDesktopWindowsEdgeBrowser: function () {
            var ua = navigator.userAgent;
            return ((!this.isAWJade()) && (ua.match(/Windows NT 10/i)) && (ua.match(/Edge/i)));
        },

        isViewHTMLAccessSupportedBrowser: function () {
            var ua = navigator.userAgent;
            //For IE9 or earlier, remove BLAST if it is there.
            // HTML access is not supported on all mobile browsers except safari and IE (Edge browser)
            if (this.isAnyWindowsPhone()) {
                return false;
            } else if (this.isAndroid())  {
                return false;
            } else if (this.isBlackBerry()) {
                return false;
            } else if (this.isIOS() && !this.isSafari()) {
                return false;
            } else if (this.isIE() && this.version < 10 ) {
                return false;
            } else if (this.isWindows10() && this.isSafari()) {
                return false;
            }
            return true;
        },

        getMobileType: function() {
            var ua = navigator.userAgent;
            if(ua.match(/Windows Phone/i) || ua.match(/Windows NT 10/i)) {
                return "Windows Phone";
            }
            if (ua.match(/Android/i)) {
                return "Android";
            }
            if (ua.match(/webOS/i))
            {
                return "webOS";
            }
            if (ua.match(/iPhone/i)) {
                return "iPhone";
            }
            if (ua.match(/iPad/i)) {
                return "iPad";
            }
            if (ua.match(/iPod/i)) {
                return "iPod";
            }
            if (ua.match(/BlackBerry/i)) {
                return "BlackBerry";
            }
            return null;
        },

        isBlackBerry: function(){
            return this.getMobileType() === "BlackBerry";
        },

        isWindows10: function(){
            var ua = navigator.userAgent;
            return ua.match(/Windows NT 10/i);
        },

        isAnyWindowsPhone: function(){
            var ua = navigator.userAgent;
            return ua.match(/Windows Phone/i);
        },

        isIOS: function(){
            var mob = this.getMobileType();
            return (mob ===  "iPhone" || mob === "iPad" || mob === "iPod");
        },
        isAtLeastIOS7: function() {
            var ua = navigator.userAgent;
            return this.isIOS() &&  !(/OS [1-6](.*) like Mac OS X/i.test(ua));
        },

        isIPhone: function(){
            return this.getMobileType() === "iPhone";
        },

        isIPad: function(){
            return this.getMobileType() === "iPad";
        },

        isAndroid: function(){
            return this.getMobileType() === "Android";
        },

        isAndroidPhone: function() {
            if (this.isAndroid()) {
                var ua = navigator.userAgent;
                if (ua.match(/mobile/i)) {
                    return true;
                }
                return false;
            }
            return false;
        },

        isAndroidTablet: function() {
            if (this.isAndroid()) {
                return !this.isAndroidPhone();
            }
            return false;
        },

        isWindowsPhone: function() {
            return this.getMobileType() === "Windows Phone";
        },

        //When new os is added e.g windows this method needs to be updated.
        isPhone: function(){
            return this.isIPhone() || this.isAndroidPhone();
        },

        //When new os is added e.g windows this method needs to be updated.
        isTablet: function(){
            return this.isAndroidTablet() || this.isIPad();
        },

        getPlatformType: function(){
            var platform = "Unknown";
            if (this.isWindows()){
                platform = "Windows";
            }
            else if (this.isMac()){
                platform = "Mac";
            }
            else if (this.isIphone()){
                platform = "iPhone";
            }
            else if (this.iPad()){
                platform = "iPad";
            }
            else if (this.isAndroid()){
                platform = "Android";
            }
            return platform;
        },

        getMobileOSType: function() {
            if (this.isIOS()) {
                return "IOS";
            } else if (this.isAndroid()) {
                return "ANDROID";
            } else return "";
        },
        isReorderEnabled: function(){
          return this.isIPad() || !this.isMobile();
        },

        isThinAppSupportedBrowser: function() {
            return !this.isAWJade() && this.isWindows();
        },

        isPasswordVaultPluginSupportedBrowser: function() {
            var ua = navigator.userAgent;
            if (this.isAWJade()) {
                return false;
            } else if (ua.match(/Windows Phone/i)) {
                return false;
            } else if (this.isIOS()) {
                return false;
            } else if (this.isAndroid()) {
                return false;
            } else if (this.isMobile() && !ua.match(/Windows NT 10/i)) {
                return false;
            } else if (this.isWindows() && !((ua.match(/Windows NT 10/i)) && (ua.match(/Edge/i))) && ((this.isIE() && this.version > 10 ) || this.isChrome() || this.isFF())) {
                return true;
            } else if (this.isMac() && (this.isChrome() || this.isFF() || this.isSafari())) {
                return true;
            }
            return false;
        },
        
        isWin10Browser: function() {
            var ua = navigator.userAgent;
            return (!this.isAWJade() && ua.match(/Windows NT 10/i));
        },

        /**
         * Check if plugin is installed
         *
         * @param fingerprint  {Object}
         *        fingerprint.activeXObjectName {string}    Name of ActiveXObject, for IE
         *        fingerprint.pluginNameIdentifier {string} plugin name or a segment of the name to identify the plugin, or
         *                                                  browser other than IE
         */
        isBrowserPluginInstalled: function(fingerprint) {
            if (!fingerprint) {
                return false;
            }

            // IE
            if (browserDetect.isIE()){
                try {
                    //It will throw an exception if the ActiveXObject is not available.
                    new ActiveXObject(fingerprint.activeXObjectName);
                    return true;
                } catch(e) {
                    return false;
                }
            } else {
                for (var i = 0; i < browserDetect.navigator.plugins.length; i++) {
                    var plugin = browserDetect.navigator.plugins[i],
                        pluginName = plugin && plugin.name,
                        pluginDesc = plugin && plugin.description;

                    if ((pluginName && pluginName.indexOf(fingerprint.pluginNameIdentifier) > -1) ||
                        (pluginDesc && pluginDesc.indexOf(fingerprint.pluginNameIdentifier) > -1)) {
                        return true;

                        // TODO: Returning true if plugin found for now
                        // TODO: Use the version number to require a minimum value later
                        // agentVersion = plugin.version;   // Firefox way
                        /*
                         if (agentVersion == null) {
                         // Chrome way
                         var description = plugin.description || "";

                         // Pattern to extract the version info from the description string like this:
                         // "This plugin checks whether VMware Horizon Agent is installed on the computer. (Version: 1.0.0.2)"
                         var pat=/\(Version:\s(.*)\)/gi;

                         var re = new RegExp(pat);
                         var m = re.exec(description);
                         agentVersion = m && m[1];
                         pluginFound = !!agentVersion;
                         }
                         */
                    }
                }
            }

            return false;
        },
        /**
         * Check if Citrix Receiver is installed
         */
        isCitrixReceiverInstalled: function() {
            var isInstalled = this.isBrowserPluginInstalled({
                activeXObjectName: "Citrix.ICAClient",
                pluginNameIdentifier: "Citrix Receiver"
            }) || (hznLocalStorage[this.hznCitrixReceiverInstalled] != null);

            return isInstalled;
        },

        isICOCompatibleIE: function() {
            if (browserDetect.isIE()){
                try {
                    //It will throw an exception if the ActiveXObject is not available.
                    var activeX = new ActiveXObject('Citrix.ICAClient');
                    activeX.Launch = true;
                    return activeX.Launch;
                } catch(e) {
                    return false;
                }
            }
            return false;
        },

        /**
         * Check if ThinApp is enabled in the current system.
         */
        isHorizonDesktopInstalled: function() {
            return this.isBrowserPluginInstalled({
                activeXObjectName: "HorizonAgentFinder.HorizonFinder",
                pluginNameIdentifier: "VMware Horizon Agent Finder"
            }) || !!hznLocalStorage[(this.hznHorizonWorkspaceInstalled)];
        },
        /**
         * Check if users confirmed Horizon View Client was installed in the current system.
         */
        isHorizonViewClientMarkedAsInstalled: function() {
            return !!hznLocalStorage[this.hznViewClientInstalled];
        },
        /**
         * Check if user completed first time slides in the current system.
         */
        hasCompeletedFTU: function(userId) {
            return hznLocalStorage[this.hznCompletedFTU+"_"+userId] != null;
        },

        /**
         * Check if users confirmed Password Vault Browser Extension was installed in the current system.
         */
        isPVExtensionMarkedAsInstalled: function() {
            return !!hznLocalStorage[this.passwordVaultExtensionInstalled];
        },

        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: /Chrome|CriOS/i,
                identity: "Chrome"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "Version"
            },
            {
                prop: window.opera,
                identity: "Opera",
                versionSearch: "Version"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            },
            {		// for newer Netscapes (6+)
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            },
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            },
            {   //for IE11
                string: navigator.userAgent,
                subString: "Trident",
                identity: "Explorer",
                versionSearch: "rv"
            },
            {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            },
            { 		// for older Netscapes (4-)
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            }
        ],
        dataOS : [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                string: navigator.userAgent,
                subString: "iPhone",
                identity: "iPhone/iPod"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ]

    };
    browserDetect.init();
    return browserDetect;
}]);
