'use strict';

angular.module('com.vmware.greenbox.appCenter')
       .service('DesktopLaunchService', ['UserAgent',
                                         'Localization',
                                         'hznLocalStorage',
                                         '$http',
                                         '$q',
                                         'RequestFactory',
                                         'Resource',
                                         'UtilService',
                                         '$timeout',
                                         'ConfigService',
                                         function (
                                             UserAgent,
                                             Localization,
                                             hznLocalStorage,
                                             $http,
                                             $q,
                                             RequestFactory,
                                             Resource,
                                             UtilService,
                                             $timeout,
                                             ConfigService) {
    this.PERSISTENT_PREFERRED_CLIENT = "HZN_LAUNCH_DESKTOP_PREFERRED_CLIENT";
    this.CLIENT_BROWSER = "BROWSER";
    this.CLIENT_NATIVE = "NATIVE";
    this.VIEW_APP_TYPES = ["VIEWPOOL","VIEWAPP"];
    this.XEN_APP_TYPES = ["XENAPP","XENAPPDELIVERYGROUP"];
    this.DESKTONE_APP_TYPES = ["DESKTONEDESKTOP","DESKTONEAPPLICATION"];
    this.THINAPP_APP_TYPES = ["THINAPP","APPV"];
    this.URL_TEMPLATE_REGEXP = /{\?(.*)}/;


    this.launchXenApp = function (xenApp, $scope) {
        this.launchByLaunchUrl(xenApp,$scope, function(xenApp,launchUrls){
            if(launchUrls.applyAuthPolicy){
                this.launchResourceInBrowser(launchUrls.accessPolicyUrl);
            }
            else if(!UserAgent.isAWJade() && UserAgent.isMobile()){
                this.launchResourceInBrowser(launchUrls.browserLaunchUrl);
            }
            else if(UserAgent.isNPAPISupportedBrowser() || !xenApp.useNonNPAPIForCitrixLaunch){
                UtilService.openURIScheme(launchUrls.browserLaunchUrl);
            }else {
                UtilService.openURIScheme(launchUrls.nativeLaunchUrl);
            }
            UtilService.hideLaunchProgressContainer();
        });
    };

    /**
     * Launch a view desktop.
     *
     * @param view {Object} app
     * @param $scope
     * TODO: $scope here is only for opening a dialog. It should be better to put it in dialogService.
     */


    this.launchViewApp = function (viewResource, $scope) {
        var launchableClients = this._getLaunchableClients(viewResource);
        var preferredClient = this.getPreferredClient();

        //if preferredClient client not set, send use the defaultLaunchClient from backend
        var defaultLaunchClient  = _.get(viewResource, 'optionalAppInfo.defaultLaunchClient', undefined);
        if(!preferredClient && defaultLaunchClient && defaultLaunchClient != 'NONE'){
            preferredClient = defaultLaunchClient;
        }
        //If user has no launch preference and if launch pref popup is disabled in Admin UI,
        //then set the preferred client to Native client.
        // So that we don't display the launch pref popup.
        // In case if the popup is not disabled, if there is no preferred client,
        // user can select the launch option between Client and Browser
        if ($scope.shouldSuppressLaunchDialog && launchableClients.length > 1 && !preferredClient) {
            preferredClient = this.CLIENT_NATIVE;
        }
        //No other choices, launch by this client type.
        if (launchableClients.length == 1) {
            if (launchableClients[0] == this.CLIENT_NATIVE) {
                this.launchByViewClient($scope, viewResource);
            } else if (launchableClients[0] == this.CLIENT_BROWSER) {
                this.launchByBrowser($scope, viewResource);
            } else {
            }
            return;
        }

        //If with more than 1 choice, check the preference.
        if (preferredClient === this.CLIENT_NATIVE) {
            this.launchByViewClient($scope, viewResource);
            return;
        }

        if (preferredClient == this.CLIENT_BROWSER) {
            this.launchByBrowser($scope, viewResource);
            return;
        }

        this._showLaunchDesktopDialog(viewResource, $scope);
    };


    /**
     * Launch by view client
     *
     * @param viewResource  {Object} app
     */
    this.launchByViewClient = function($scope, viewResource) {
        if (this.isHorizonViewClientInstalled() || $scope.shouldSuppressLaunchDialog) {
            this.doLaunchByViewClient($scope, viewResource);
        } else {
            this._showLaunchViewClientDialog(viewResource, $scope);
        }
    };

    this.launchByLaunchUrl = function(app,$scope,launchHandler, preferredClient) {
        UtilService.showLaunchProgressContainer();
        app.useNonNPAPIForCitrixLaunch = $scope.useNonNPAPIForCitrixLaunch;

        // HW-61576 : browser tab is not brought to front while launching 2nd desktop/apps from workspace
        // open/reopen new tab before going into the promise async code
        // otherwise, already open tab will not get focus.
        // this will only work for chrome, because firefox does not allow focusing of tab.
        var appLaunchWindow;
        // HW-72964 - suppress this logic for all other browsers other than chrome
        if(preferredClient === this.CLIENT_BROWSER && UserAgent.isChrome()) {
            appLaunchWindow = window.open('about:blank', 'AppLaunchWindow');
        }
        this.getLaunchUrls(app,undefined,preferredClient).then(function (launchUrls) {
            if (launchUrls) {
                launchHandler.bind(this)(app,launchUrls);
            }
            else if(appLaunchWindow) {
                appLaunchWindow.close();
            }
        }.bind(this), function (error) {
            UtilService.hideLaunchProgressContainer();
            if (_.get(error, "data.code") === 'appLaunch.passwordNotFound.error') {
                if(appLaunchWindow){
                    appLaunchWindow.close();
                }
                this.showPasswordDialog(app, $scope, preferredClient).then(function (launchUrls) {
                    if (launchUrls) {
                        launchHandler.bind(this)(app,launchUrls);
                    }
                }.bind(this));
            } else {
                if(appLaunchWindow) {
                    appLaunchWindow.close();
                }
                $scope.$modal.alert({
                    title: 'requestFailed',
                    message: error.data.message,
                    ok: 'ok'
                });
            }
        }.bind(this));
    }

    /**
     * Launch by browser
     *
     * @param view {Object} app
     */
    this.launchByBrowser = function ($scope, view) {
        this.launchByLaunchUrl(view, $scope, function (app, launchUrlResponse) {
            this.launchResourceInBrowser(launchUrlResponse.applyAuthPolicy ? launchUrlResponse.accessPolicyUrl : launchUrlResponse.browserLaunchUrl);
        }, "BROWSER");
    };

    this.launchResourceInBrowser = function(finalLaunchUrl) {
        UtilService.hideLaunchProgressContainer();
        if (UserAgent.isSafari()) {
            //Safari sucks..window.open will not do any thing if it is called from iframe.
            // Every method is tried. But we can cheat Safari to realize the same effect.
            this.doLaunchByBrowserViaLink(finalLaunchUrl, "AppLaunchByBrowserWindow");
        } else {
            this.doLaunchByBrowser(finalLaunchUrl, "AppLaunchByBrowserWindow");
        }
    };
    /**
     * Launch View desktop by browser via a temporary link.  It is useful in 2 ways:
     * ++ For some browser, like Safari, window.open does nothing if it is called from iFrame.
     * ++ window.open is restricted by pop-up blocker, but a link is not
     *
     * @param finalLaunchUrl {String}, the final launch Url
     */
    this.doLaunchByBrowserViaLink = function(finalLaunchUrl,windowName) {
        /*NOTE: this will not work in iOS mobile safari
            iOS safari considers window.open inside a JS callback e.g. Ajax or setTimeout call back as pop-up window
            hence, it blocks it silently
            Workaround is to turn off the popup blocker in iOS for safari
            or use iOS chrome, where it works fine.
        */

        // Force to open new window for every launch, otherwise, mobile safari
        // will silently load the previously opened window instead of switching user to
        // newly created window.

        var a = document.createElement('a');
        a.setAttribute("href", finalLaunchUrl);
        a.setAttribute("target", "_blank");
        //a.setAttribute("id", (Math.random() * 10000)+"");

        var dispatch = document.createEvent("HTMLEvents");
        dispatch.initEvent("click", true, true);
        a.dispatchEvent(dispatch);
    };

    this.doLaunchByBrowser = function(launchUrlOrApp) {
        if (angular.isString(launchUrlOrApp)) {
            window.open(launchUrlOrApp,"AppLaunchWindow");
        } else {
            window.open(UtilService.appendQueryToUrl(launchUrlOrApp.launch, "p", this.CLIENT_BROWSER),"AppLaunchWindow");
        }
    };

    this._showLaunchViewClientDialog  = function(view, $scope) {
        $scope.$modal.open('app/launcher/desktop/launchViewClientDialog.html', $scope);
    };

    /**
     * Launch with view client without checking if view client is installed.
     *
     * @param view {Object} app
     */
    this.doLaunchByViewClient = function ($scope, view) {
        this.launchByLaunchUrl(view, $scope, function (app, launchUrls) {
            this.launchResourceInViewClient(launchUrls);
        }, "NATIVE");
    };

    this.launchDesktoneApps = function(view){
        var w = 500;
        var h = 500;
        var $this = this;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        var openAppWindow = window.open('about:blank', "AppLaunchWindow", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left+',modal=yes,alwaysRaised=yes');
        if (view.subType === "DESKTONEAPPLICATION" || view.subType === "VIEWAPP") {
            openAppWindow.document.write(Localization.getLocalizedString('myapps.launch.msg.launching.application', [view.name]));
        } else {
            openAppWindow.document.write(Localization.getLocalizedString('myapps.launch.msg.launching.desktop', [view.name]));
        }
        $timeout(function() {
            openAppWindow.location.href = UtilService.appendQueryToUrl(view.launch, "p", $this.CLIENT_NATIVE);
        }, 2000);
    };

    this.launchResourceInViewClient = function(urlResponse) {
        UtilService.hideLaunchProgressContainer();
        if(urlResponse.applyAuthPolicy) {
            this.launchResourceInBrowser(urlResponse.accessPolicyUrl);
        }else {
            ConfigService.doNotRefreshCache = true;
            //TODO: Why not use iframe based launch, try it if it works in all cases and browsers
            window.location.href = urlResponse.nativeLaunchUrl;
        }
    }

    this.isAppLaunchV2Supported = function(app) {
        var appLaunchUrlV2 = _.get(app, '_links.appLaunchUrlsV2.href',undefined);
        return angular.isString(appLaunchUrlV2) ?  true : false;
    };

    this.getLaunchLink = function(app){
        return this.isAppLaunchV2Supported(app) ? _.get(app, '_links.appLaunchUrlsV2.href',undefined) : _.get(app, '_links.appLaunchUrls.href');
    }

    this.getLaunchUrls = function(app, pwd, preferredClient) {
        if(app ) {
            var isV2 = this.isAppLaunchV2Supported(app);
            var appLaunchUrls = this.getLaunchLink(app);
            var params = {};
            if (pwd) {
                params = {"userPassword": pwd};
            }
            var req = RequestFactory(appLaunchUrls, {
                method:'PUT',
                headers:{
                    Accept: 'application/hal+json',
                    'Content-Type': 'application/hal+json'
                },
                data: params
            });
            return $http(req).then(isV2?
                function(launchUrlResponse){
                    return transformLaunchUrlResponseV2.bind(this)(app,launchUrlResponse,preferredClient);
                }.bind(this):
                function(launchUrlResponse){
                    return transformLauncUrlResponse.bind(this)(app,launchUrlResponse,preferredClient);
                }.bind(this));
        }
        return;
    };

    this.isViewApp = function (appOrAppTypeStr){
        return this.checkAppType(this.VIEW_APP_TYPES,appOrAppTypeStr)
    };

    this.isDesktoneApp = function (appOrAppTypeStr){
        return this.checkAppType(this.DESKTONE_APP_TYPES,appOrAppTypeStr)
    };

    this.isXenApp = function (appOrAppTypeStr){
        return this.checkAppType(this.XEN_APP_TYPES,appOrAppTypeStr)
    };

    this.isAppvOrThinAppType = function (appOrAppTypeStr){
        return this.checkAppType(this.THINAPP_APP_TYPES,appOrAppTypeStr)
    };

    this.isLaunchableInBrowser = function (launchableClients) {
        return launchableClients.indexOf(this.CLIENT_BROWSER)>-1;
    };

    this.checkAppType = function (appTypeArr, appOrAppTypeStr){
        var givenAppType = appOrAppTypeStr.subType || appOrAppTypeStr;
        return appTypeArr.map(function(appType){return appType.toLowerCase()})
                                  .filter(function(appType){return appType === givenAppType.toLowerCase()}).length > 0;
     };

    function transformLauncUrlResponse(app, launchUrlResponse) {
        if(launchUrlResponse){
            return {
                applyAuthPolicy: !!launchUrlResponse.data.launchUrls["ACCESS_POLICY"],
                browserLaunchUrl:launchUrlResponse.data.launchUrls["BROWSER"],
                nativeLaunchUrl: launchUrlResponse.data.launchUrls["NATIVE"],
                accessPolicyUrl: launchUrlResponse.data.launchUrls["ACCESS_POLICY"]
            };
        }
    }

    function transformLaunchUrlResponseV2(app, launchUrlResponse,preferredClient){
        if(launchUrlResponse) {
            var resourceType = _.get(launchUrlResponse,'data.response.resourceType');
            var launchUrls = _.get(launchUrlResponse,'data.response.launchURLs');
            if(this.isXenApp(resourceType) && angular.isArray(launchUrls)) {
                return transformedResponseForXenApp.bind(this)(app,launchUrls,preferredClient);
            } else if(this.isViewApp(resourceType) && angular.isArray(launchUrls)) {
                return transformedResponseForViewApp.bind(this)(app,launchUrls,preferredClient);
           } else if(this.isDesktoneApp(resourceType) && angular.isArray(launchUrls)){
                return transformedResponseForViewApp.bind(this)(app,launchUrls,preferredClient);
            }
        }
    }


     function buildAuthPolicyUrl(launchURLs, queryParamConfig) {
         return launchURLs.filter(function (launchURL) {
                 return launchURL.urlHandler === "BROWSER_ANY" &&
                     launchURL.launchContext === "URL_TEMPLATE"
             })
             .map(function (launchURL) {
                 return angular.extend({
                     urlTemplate: launchURL.url,
                     queryParams: launchURL.queryParams
                 },queryParamConfig);
             }).map(processUrlTemplate.bind(this))[0];
     }

     function processUrlTemplate(urlTemplateCtx) {
         if(!angular.isString(urlTemplateCtx.urlTemplate)){
             return;
         }
         var processedUrl = urlTemplateCtx.urlTemplate;
         var urlTemplateQueryParams = urlTemplateCtx.urlTemplate.match(this.URL_TEMPLATE_REGEXP);
         if (urlTemplateQueryParams && urlTemplateQueryParams.length > 1) {
             var queryStr = urlTemplateQueryParams[1].split(',')
                 .map(function (queryParam) {
                     var queryParamVal = _.get(urlTemplateCtx,"queryParams."+queryParam);
                     if (queryParamVal) {
                         if(angular.isString(queryParamVal)){
                             var isUrlTemplate = queryParamVal.match(this.URL_TEMPLATE_REGEXP)
                             if (isUrlTemplate && isUrlTemplate.length > 1) {
                                 queryParamVal = processUrlTemplate.bind(this)({
                                     urlTemplate: queryParamVal,
                                     queryParams: urlTemplateCtx.queryParams,
                                     queryParamConfig: urlTemplateCtx.queryParamConfig
                                 });
                             }
                         }
                         var queryParamMatcher = _.get(urlTemplateCtx,"queryParamConfig."+queryParam+".queryParamMatcher",undefined);
                         if ( queryParamMatcher) {
                             queryParamVal = queryParamMatcher.bind(this)(queryParam, queryParamVal);
                         }
                         return queryParam + '=' + encodeURIComponent(queryParamVal);
                     }
                 }.bind(this))
                 .join("&");

             if (queryStr) {
                 processedUrl = urlTemplateCtx.urlTemplate.replace(this.URL_TEMPLATE_REGEXP, "?" + queryStr);
             }
         }
         return processedUrl;
     }


    function transformedResponseForXenApp(app, launchUrls) {
        var transformedLaunchUrlResponse;
        if(isAccessPolicyUrl(launchUrls)) {
            transformedLaunchUrlResponse = {
                    accessPolicyUrl: buildAuthPolicyUrl.bind(this)(launchUrls,_.set({},"queryParamConfig.NPAPISupported.queryParamMatcher",function(){
                        if(UserAgent.isNPAPISupportedBrowser() && app.useNonNPAPIForCitrixLaunch){
                            return "true";
                        } else {
                            return "false";
                        }
                    }))
            }
            angular.isString(transformedLaunchUrlResponse.accessPolicyUrl) && (transformedLaunchUrlResponse.applyAuthPolicy = true)
            return transformedLaunchUrlResponse;
        }else {
            transformedLaunchUrlResponse =  {
                applyAuthPolicy: false,
                browserLaunchUrl:launchUrls.filter(function(launchURL){
                    return launchURL.urlHandler === "BROWSER_NPAPI_SUPPORTED"&&
                        launchURL.launchContext === "URL_FILE_DOWNLOAD"
                }).map(function(launchURL){
                    return launchURL.url;
                })[0],
                nativeLaunchUrl:launchUrls.filter(function(launchURL){
                    return launchURL.urlHandler === "CITRIX_RECEIVER"&&
                        launchURL.launchContext === "URL_FILE_DOWNLOAD"
                }).map(function(launchURL){
                    return launchURL.url;
                })[0]
            }
            return transformedLaunchUrlResponse;
        }
    }

    function transformedResponseForViewApp(app, launchUrls,preferredClient) {
        var transformedLaunchUrlResponse;
        if(isAccessPolicyUrl(launchUrls)) {
            transformedLaunchUrlResponse = {
                accessPolicyUrl: buildAuthPolicyUrl.bind(this)(launchUrls,_.set({},"queryParamConfig.clientType.queryParamMatcher",function(){
                    if(this.isClientLaunchable.bind(this)(app, preferredClient)){
                        return preferredClient;
                    }else {
                        return "NATIVE";
                    }
                }))
            }
            angular.isString(transformedLaunchUrlResponse.accessPolicyUrl) && (transformedLaunchUrlResponse.applyAuthPolicy = true)
            return transformedLaunchUrlResponse;
        }else {
            transformedLaunchUrlResponse =  {
                applyAuthPolicy:false,
                browserLaunchUrl:launchUrls.filter(function(launchURL){
                    return launchURL.urlHandler === "BROWSER_ANY" &&
                        launchURL.launchContext === "URL_LAUNCHABLE"
                }).map(function(launchURL){
                    return launchURL.url;
                })[0],
                nativeLaunchUrl:launchUrls.filter(function(launchURL){
                    return launchURL.urlHandler === "HORIZON_VIEW" &&
                        launchURL.launchContext === "URL_LAUNCHABLE"
                }).map(function(launchURL){
                    return launchURL.url;
                })[0]
            }
            return transformedLaunchUrlResponse;
        }
    }

    function isAccessPolicyUrl(launchUrls){
        if(launchUrls && launchUrls.length === 1 && launchUrls[0].launchContext === "URL_TEMPLATE" ) {
            return true;
        }
    }

    this.showPasswordDialog = function(view, $scope, preferredClient){
        return $scope.$modal.open('app/launcher/launchPasswordDialog.html', $scope, {preferredClient:preferredClient});
    };

    this._showLaunchDesktopDialog  = function(view, $scope) {
        $scope.$modal.open('app/launcher/desktop/launchDesktopDialog.html', $scope);
    };

    /**
     * Calculate the launchable clients supported on current browser.
     *
     * @param view {Object}
     * @private
     */
    this._getLaunchableClients = function(view) {
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
            if(view.optionalAppInfo.clientTypes){
                view._launchableClients = view.optionalAppInfo.clientTypes;
            }
            if(view.optionalAppInfo.supportedPoolProtocols){
                view._launchableClients = getLaunchableClientsFromSupportedPoolProtocols(view);
            }
        }
        return view._launchableClients;
    };

    function getLaunchableClientsFromSupportedPoolProtocols(view) {
        var launchableClients = [];
        if(view.optionalAppInfo.supportedPoolProtocols){
            for(var i=0;i<view.optionalAppInfo.supportedPoolProtocols.length;i++){
                if(view.optionalAppInfo.supportedPoolProtocols[i]==="PCOIP" || view.optionalAppInfo.supportedPoolProtocols[i]==="NATIVE"){
                    launchableClients.push("NATIVE");
                }
                if(view.optionalAppInfo.supportedPoolProtocols[i]==="BLAST" || view.optionalAppInfo.supportedPoolProtocols[i]==="BROWSER"){
                    launchableClients.push("BROWSER");
                }
            }
        }
        return launchableClients;
    }

    function removeBlastFromLaunchableClients(view) {
        var launchableClients = [];
        var clients = view.optionalAppInfo.clientTypes;
        if (!clients){
            clients = getLaunchableClientsFromSupportedPoolProtocols(view);
        }
        angular.forEach(clients, function (client) {
            if (client !== 'BROWSER') {
                this.push(client);
            }
        }, launchableClients);
        return launchableClients;
    }

    /**
     * Get user preferred client.
     *
     * @return {*}
     */
    this.getPreferredClient = function() {
        return hznLocalStorage[this.PERSISTENT_PREFERRED_CLIENT];
    };

    this.setPreferredClient = function(clientType) {
        if (clientType === null) {
            delete hznLocalStorage[this.PERSISTENT_PREFERRED_CLIENT];
        } else {
            hznLocalStorage[this.PERSISTENT_PREFERRED_CLIENT] = clientType;
        }
    }

    this.isClientLaunchable = function(view, clientType) {
        var launchableClients = this._getLaunchableClients(view);
        var isLaunchable = false;
        angular.forEach(launchableClients, function(launchableClient) {
            if (launchableClient == clientType) {
                isLaunchable = true;
            }
        });

        return isLaunchable;
    }

    /**
     * Check if Horizon View client is installed by 1 of the following conditions:
     * * A mobile device on managed mode;
     * * Users confirmed View client was installed,
     *
     * @return boolean
     */
    this.isHorizonViewClientInstalled = function() {
        return UserAgent.isHorizonViewClientMarkedAsInstalled();
    }

    this.getDownloadLink = function() {
        if (UserAgent.isIOS()) {
            return 'javascript:window.location="' +  Localization.getLocalizedString('viewDownloadUrlIOS')  + '";';
        } else if (UserAgent.isAndroid()) {
            return Localization.getLocalizedString('viewDownloadUrlAndroid');
        } else {
            return Localization.getLocalizedString('viewDownloadUrl');
        }
    }
}]);