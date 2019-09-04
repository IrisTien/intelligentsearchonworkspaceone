// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('AppBannerController',
                     ['UserAgent',
                      'JadeV2Scheme',
                      function(UserAgent,JadeV2Scheme){
                            var vm = this;
                            var IOS_APP_STORE_LINK = 'https://itunes.apple.com/us/app/vmware-workspace-one/id1031603080?mt=8';
                            var ANDROID_APP_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.airwatch.vmworkspace&hl=en';
                            var WINDOWS_APP_STORE_LINK = 'https://www.microsoft.com/en-us/store/apps/vmware-workspace-one/9nblggh5pn6h';
                            vm.appStoreInstallLink = '#';
                            vm.showOpen = !(UserAgent.isWindows() || UserAgent.isAndroid());
                    
                            if(UserAgent.isMobile()) {
                                if (UserAgent.isIOS()){
                                    vm.appStoreInstallLink = IOS_APP_STORE_LINK;
                                } else if (UserAgent.isAndroid()) {
                                    vm.appStoreInstallLink = ANDROID_APP_STORE_LINK;
                                } else if (UserAgent.isWindows()) {
                                    vm.appStoreInstallLink = WINDOWS_APP_STORE_LINK;
                                }
                            }
                            
                            vm.openWorkspaceOneApp = function () {
                                if(UserAgent.isMobile()) {
                                    window.location.href = JadeV2Scheme.JADE_SCHEME;
                                }
                            }
    }]);
})(angular.module("com.vmware.greenbox.appCenter"));

