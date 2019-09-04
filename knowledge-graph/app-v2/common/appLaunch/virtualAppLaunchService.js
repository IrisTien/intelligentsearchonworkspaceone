angular.module('com.vmware.greenbox.appCenter')
       .service('VirtualAppLaunchService', ['UserAgent',
                                         'hznLocalStorage',
                                         '$http',
                                         'RequestFactory',
                                         'UtilService',
                                         'ModalService',
                                         'LaunchUtilityService',
                                         'HorizonResourcesLaunchUtilService',
                                         'ProgressIndicatorService',
                                         function(
                                             UserAgent,
                                             hznLocalStorage,
                                             $http,
                                             RequestFactory,
                                             UtilService,
                                             ModalService,
                                             LaunchUtilityService,
                                             HorizonResourcesLaunchUtilService,
                                             ProgressIndicatorService) {
    'use strict';

    this.CLIENT_BROWSER = "BROWSER";
    this.VIEW_APP_TYPES = ["VIEWPOOL", "VIEWAPP"];
    this.XEN_APP_TYPES = ["XENAPP", "XENAPPDELIVERYGROUP"];
    this.DESKTONE_APP_TYPES = ["DESKTONEDESKTOP", "DESKTONEAPPLICATION"];
    this.URL_TEMPLATE_REGEXP = /{\?(.*)}/;

    this.launchByLaunchUrl = function(app, launchHandler, preferredClient) {
        ProgressIndicatorService.showProgressIndicator();
        app.useNonNPAPIForCitrixLaunch = LaunchUtilityService.isUseNonNPAPIForCitrixLaunch();

        // HW-61576 : browser tab is not brought to front while launching 2nd desktop/apps from workspace
        // open/reopen new tab before going into the promise async code
        // otherwise, already open tab will not get focus.
        // this will only work for chrome, because firefox does not allow focusing of tab.
        var appLaunchWindow;
        // HW-72964 - suppress this logic for all other browsers other than chrome
        if (preferredClient === this.CLIENT_BROWSER && UserAgent.isChrome()) {
            appLaunchWindow = window.open('about:blank', 'AppLaunchWindow');
        }
        this.getLaunchUrls(app, undefined, preferredClient).then(function(launchUrls) {
            if (launchUrls) {
                launchHandler.bind(this)(app, launchUrls);
            } else if (appLaunchWindow) {
                appLaunchWindow.close();
            }
        }.bind(this), function(error) {
            ProgressIndicatorService.hideProgressIndicator();
            if (_.get(error, "data.code") === 'appLaunch.passwordNotFound.error') {
                if (appLaunchWindow) {
                    appLaunchWindow.close();
                }
                this.showPasswordDialog(app, preferredClient).then(function(launchUrls) {
                    if (launchUrls) {
                        launchHandler.bind(this)(app, launchUrls);
                    }
                }.bind(this));
            } else {
                if (appLaunchWindow) {
                    appLaunchWindow.close();
                }
                ModalService.getCurrentModal().alert({
                    title: 'requestFailed',
                    message: error.data.message,
                    ok: 'ok'
                });
            }
        }.bind(this));
    };

    this.isAppLaunchV2Supported = function(app) {
        var appLaunchUrlV2 = _.get(app, '_links.appLaunchUrlsV2.href', undefined);
        return angular.isString(appLaunchUrlV2);
    };

    this.getLaunchLink = function(app) {
        return this.isAppLaunchV2Supported(app) ? _.get(app, '_links.appLaunchUrlsV2.href', undefined) : _.get(app, '_links.appLaunchUrls.href');
    };

    this.getLaunchUrls = function(app, pwd, preferredClient) {
        if (app) {
            var isV2 = this.isAppLaunchV2Supported(app);
            var appLaunchUrls = this.getLaunchLink(app);
            var params = {};
            if (pwd) {
                params = {"userPassword": pwd};
            }
            var req = RequestFactory(appLaunchUrls, {
                method: 'PUT',
                headers: {
                    Accept: 'application/hal+json',
                    'Content-Type': 'application/hal+json'
                },
                data: params
            });
            return $http(req).then(isV2 ?
                function(launchUrlResponse) {
                    return transformLaunchUrlResponseV2.bind(this)(app, launchUrlResponse, preferredClient);
                }.bind(this) :
                function(launchUrlResponse) {
                    return transformLauncUrlResponse.bind(this)(app, launchUrlResponse, preferredClient);
                }.bind(this));
        }
    };

     this.launchResourceInBrowser = function(finalLaunchUrl) {
         ProgressIndicatorService.hideProgressIndicator();
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
     this.doLaunchByBrowserViaLink = function(finalLaunchUrl, windowName) {
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
             window.open(launchUrlOrApp, "AppLaunchWindow");
         } else {
             window.open(UtilService.appendQueryToUrl(launchUrlOrApp.launch, "p", this.CLIENT_BROWSER), "AppLaunchWindow");
         }
     };

    this.isViewApp = function(appOrAppTypeStr) {
        return this.checkAppType(this.VIEW_APP_TYPES, appOrAppTypeStr);
    };

    this.isDesktoneApp = function(appOrAppTypeStr) {
        return this.checkAppType(this.DESKTONE_APP_TYPES, appOrAppTypeStr);
    };

    this.isXenApp = function(appOrAppTypeStr) {
        return this.checkAppType(this.XEN_APP_TYPES, appOrAppTypeStr);
    };

    this.checkAppType = function(appTypeArr, appOrAppTypeStr) {
        var givenAppType = appOrAppTypeStr.subType || appOrAppTypeStr;
        return appTypeArr.map(function(appType) {
            return appType.toLowerCase();
        }).filter(function(appType) {
            return appType === givenAppType.toLowerCase();
        }).length > 0;
     };

    function transformLauncUrlResponse(app, launchUrlResponse) {
        if (launchUrlResponse) {
            return {
                applyAuthPolicy: !!launchUrlResponse.data.launchUrls.ACCESS_POLICY,
                browserLaunchUrl: launchUrlResponse.data.launchUrls.BROWSER,
                nativeLaunchUrl: launchUrlResponse.data.launchUrls.NATIVE,
                accessPolicyUrl: launchUrlResponse.data.launchUrls.ACCESS_POLICY
            };
        }
    }

    function transformLaunchUrlResponseV2(app, launchUrlResponse, preferredClient) {
        if (launchUrlResponse) {
            var resourceType = _.get(launchUrlResponse, 'data.response.resourceType');
            var launchUrls = _.get(launchUrlResponse, 'data.response.launchURLs');
            if (this.isXenApp(resourceType) && angular.isArray(launchUrls)) {
                return transformedResponseForXenApp.bind(this)(app, launchUrls, preferredClient);
            } else if (this.isViewApp(resourceType) && angular.isArray(launchUrls)) {
                return transformedResponseForViewApp.bind(this)(app, launchUrls, preferredClient);
           } else if (this.isDesktoneApp(resourceType) && angular.isArray(launchUrls)) {
                return transformedResponseForViewApp.bind(this)(app, launchUrls, preferredClient);
            }
        }
    }

     function buildAuthPolicyUrl(launchURLs, queryParamConfig) {
         return launchURLs.filter(function(launchURL) {
                 return launchURL.urlHandler === "BROWSER_ANY" &&
                     launchURL.launchContext === "URL_TEMPLATE";
             })
             .map(function(launchURL) {
                 return angular.extend({
                     urlTemplate: launchURL.url,
                     queryParams: launchURL.queryParams
                 }, queryParamConfig);
             }).map(processUrlTemplate.bind(this))[0];
     }

     function processUrlTemplate(urlTemplateCtx) {
         if (!angular.isString(urlTemplateCtx.urlTemplate)) {
             return;
         }
         var processedUrl = urlTemplateCtx.urlTemplate;
         var urlTemplateQueryParams = urlTemplateCtx.urlTemplate.match(this.URL_TEMPLATE_REGEXP);
         if (urlTemplateQueryParams && urlTemplateQueryParams.length > 1) {
             var queryStr = urlTemplateQueryParams[1].split(',')
                 .map(function(queryParam) {
                     var queryParamVal = _.get(urlTemplateCtx, "queryParams." + queryParam);
                     if (queryParamVal) {
                         if (angular.isString(queryParamVal)) {
                             var isUrlTemplate = queryParamVal.match(this.URL_TEMPLATE_REGEXP);
                             if (isUrlTemplate && isUrlTemplate.length > 1) {
                                 queryParamVal = processUrlTemplate.bind(this)({
                                     urlTemplate: queryParamVal,
                                     queryParams: urlTemplateCtx.queryParams,
                                     queryParamConfig: urlTemplateCtx.queryParamConfig
                                 });
                             }
                         }
                         var queryParamMatcher = _.get(urlTemplateCtx, "queryParamConfig." + queryParam + ".queryParamMatcher", undefined);
                         if (queryParamMatcher) {
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
        if (isAccessPolicyUrl(launchUrls)) {
            transformedLaunchUrlResponse = {
                    accessPolicyUrl: buildAuthPolicyUrl.bind(this)(launchUrls, _.set({}, "queryParamConfig.NPAPISupported.queryParamMatcher", function() {
                        if (UserAgent.isNPAPISupportedBrowser() && app.useNonNPAPIForCitrixLaunch) {
                            return "true";
                        } else {
                            return "false";
                        }
                    }))
            };
            if (angular.isString(transformedLaunchUrlResponse.accessPolicyUrl)) {
                transformedLaunchUrlResponse.applyAuthPolicy = true;
            }
            return transformedLaunchUrlResponse;
        } else {
            transformedLaunchUrlResponse = {
                applyAuthPolicy: false,
                browserLaunchUrl: launchUrls.filter(function(launchURL) {
                    return launchURL.urlHandler === "BROWSER_NPAPI_SUPPORTED" &&
                        launchURL.launchContext === "URL_FILE_DOWNLOAD";
                }).map(function(launchURL) {
                    return launchURL.url;
                })[0],
                nativeLaunchUrl: launchUrls.filter(function(launchURL) {
                    return launchURL.urlHandler === "CITRIX_RECEIVER" &&
                        launchURL.launchContext === "URL_FILE_DOWNLOAD";
                }).map(function(launchURL) {
                    return launchURL.url;
                })[0]
            };
            return transformedLaunchUrlResponse;
        }
    }

    function transformedResponseForViewApp(app, launchUrls, preferredClient) {
        var transformedLaunchUrlResponse;
        if (isAccessPolicyUrl(launchUrls)) {
            transformedLaunchUrlResponse = {
                accessPolicyUrl: buildAuthPolicyUrl.bind(this)(launchUrls, _.set({}, "queryParamConfig.clientType.queryParamMatcher", function() {
                    if (HorizonResourcesLaunchUtilService.isClientLaunchable.bind(this)(app, preferredClient)) {
                        return preferredClient;
                    } else {
                        return "NATIVE";
                    }
                }))
            };
            if (angular.isString(transformedLaunchUrlResponse.accessPolicyUrl)) {
                transformedLaunchUrlResponse.applyAuthPolicy = true;
            }
            return transformedLaunchUrlResponse;
        } else {
            transformedLaunchUrlResponse = {
                applyAuthPolicy: false,
                browserLaunchUrl: launchUrls.filter(function(launchURL) {
                    return launchURL.urlHandler === "BROWSER_ANY" &&
                        launchURL.launchContext === "URL_LAUNCHABLE";
                }).map(function(launchURL) {
                    return launchURL.url;
                })[0],
                nativeLaunchUrl: launchUrls.filter(function(launchURL) {
                    return launchURL.urlHandler === "HORIZON_VIEW" &&
                        launchURL.launchContext === "URL_LAUNCHABLE";
                }).map(function(launchURL) {
                    return launchURL.url;
                })[0]
            };
            return transformedLaunchUrlResponse;
        }
    }

    function isAccessPolicyUrl(launchUrls) {
        if (launchUrls && launchUrls.length === 1 && launchUrls[0].launchContext === "URL_TEMPLATE") {
            return true;
        }
    }

    this.showPasswordDialog = function(view, preferredClient) {
        var isHubApp = UtilService.isHub();
        var template = isHubApp ? 'app-v2/components/shared/launchPasswordDialog.html' : 'app-v2/common/appLaunch/launchPasswordDialog.html';
        return ModalService.getCurrentModal().open(template, {app: view, preferredClient: preferredClient});
    };
}]);
