(function(module){
    'use strict';
    module.service('AppLauncherForDesktop', [
                        '$timeout',
                        'Localization',
                        'DesktopLaunchService',
                        'UserAgent',
                        'UtilService',
                        'PasswordVaultAppLaunchService',
                        function($timeout,
                                 Localization,
                                 DesktopLaunchService,
                                 UserAgent,
                                 UtilService,
                                 PasswordVaultAppLaunchService) {

                var WINDOW = {
                    w: 500,
                    h: 500,
                    left: (screen.width/2)-(500/2),
                    top: (screen.height/2)-(500/2)
                };

                var virtualAppLaunchWindow = false;

                //Service functions
                this.launch = function(app, $scope) {
                    switch(app.subType) {
                        //TODO: Not yet tested
                        case "THINAPP":
                        case "APPV":
                            _invokeNativeApp(app);
                            break;
                        case "XENAPP":
                        case "XENAPPDELIVERYGROUP":
                            DesktopLaunchService.isAppLaunchV2Supported(app)?DesktopLaunchService.launchXenApp(app, $scope):_invokeNativeApp(app);
                            break;
                        case "VIEWPOOL":
                        case "VIEWAPP":
                        case "DESKTONEDESKTOP":
                        case "DESKTONEAPPLICATION":
                            DesktopLaunchService.launchViewApp(app, $scope);
                            break;
                        case "PASSWORDVAULT":
                            PasswordVaultAppLaunchService.launchPVApp(app, $scope.$modal);
                            break;
                        default:
                            _openAppInNewWindow(app);
                    }
                };

                function _invokeNativeApp(app) {

                    function isXenApp(app){
                        return ["XENAPP","XENAPPDELIVERYGROUP"].indexOf(app.subType) >= 0;
                    }

                    if(virtualAppLaunchWindow && !virtualAppLaunchWindow.closed){  //checks to see if window is open
                        virtualAppLaunchWindow.close();
                    }
                    if (UserAgent.isIE8OrLower() && isXenApp(app)) {
                        return;
                    }
                    virtualAppLaunchWindow = window.open("about:blank",
                        "AppLaunchWindow",
                        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+WINDOW.w+', height='+WINDOW.h+', top='+WINDOW.top+', left='+WINDOW.left+',modal=yes,alwaysRaised=yes');

                    virtualAppLaunchWindow.focus();
                    virtualAppLaunchWindow.document.write(Localization.getLocalizedString('myapps.launch.msg.launching.application', [app.name]));

                    function constructAppLaunchUrl(app) {
                        if(isXenApp(app)) {
                            if(UserAgent.isNPAPISupportedBrowser()) {
                                return UtilService.appendQueryParams(app.launch,{NPAPISupported:"true"});
                            }
                            return UtilService.appendQueryParams(app.launch,{NPAPISupported:"false"});
                        }
                        return app.launch;
                    }

                    $timeout(function() {
                        virtualAppLaunchWindow.location.href = constructAppLaunchUrl(app);
                    }, 2000);
                };

                function _openAppInNewWindow(app) {
                    window.open(app.launch);
                }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));