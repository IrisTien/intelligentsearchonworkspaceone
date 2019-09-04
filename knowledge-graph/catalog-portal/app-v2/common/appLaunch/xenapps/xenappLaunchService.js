angular.module('com.vmware.greenbox.appCenter')
       .service('XenappLaunchService', ['UserAgent',
                                         'UtilService',
                                         'VirtualAppLaunchService',
                                         'ProgressIndicatorService',
                                         function(
                                             UserAgent,
                                             UtilService,
                                             VirtualAppLaunchService,
                                             ProgressIndicatorService) {
    'use strict';

    this.XEN_APP_TYPES = ["XENAPP", "XENAPPDELIVERYGROUP"];
    this.URL_TEMPLATE_REGEXP = /{\?(.*)}/;

    this.launchXenApp = function(xenApp) {
        VirtualAppLaunchService.launchByLaunchUrl(xenApp, function(xenApp, launchUrls) {
            if (launchUrls.applyAuthPolicy) {
                VirtualAppLaunchService.launchResourceInBrowser(launchUrls.accessPolicyUrl);
            } else if (!UserAgent.isAWJade() && UserAgent.isMobile()) {
                VirtualAppLaunchService.launchResourceInBrowser(launchUrls.browserLaunchUrl);
            } else if (UserAgent.isNPAPISupportedBrowser() || !xenApp.useNonNPAPIForCitrixLaunch) {
                UtilService.openURIScheme(launchUrls.browserLaunchUrl);
            } else {
                UtilService.openURIScheme(launchUrls.nativeLaunchUrl);
            }
            ProgressIndicatorService.hideProgressIndicator();
        });
    };
}]);
