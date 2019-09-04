
(function(module) {
    'use strict';

    module.controller('SettingsController', [
        '$scope',
        '$location',
        '$rootScope',
        'SettingsService',
        'ConfigService',
        '$timeout',
        '$notify',
        'EventsService',
        'PAGING',
        'UserAgent',
        'BootstrapService',
        'ClientRuntimeService',
        'ModalService',
        '$sce',
        '$state',
        'AppDownloadService',
        'hznLocalStorage',
        function($scope,
                 $location,
                 $rootScope,
                 SettingsService,
                 ConfigService,
                 $timeout,
                 $notify,
                 EventsService,
                 PAGING,
                 UserAgent,
                 BootstrapService,
                 ClientRuntimeService,
                 ModalService,
                 $sce,
                 $state,
                 AppDownloadService,
                 hznLocalStorage) {
            var vm = this;
            vm.userInfo = SettingsService.getCurrentUser();
            vm.removeAccountOrSignOutEnabled = true;
            vm.showNotificationTab = UserAgent.isNativeAppVersionIsEqualOrAbove('3.3.1');
            var appCenterCtrl = $scope.appCenterCtrl;
            // need this to bring handle the stacking on the headers so the detail page will be on top of the header and footer
            appCenterCtrl.settingsDetailIn = false;
            //Setting up the default right tab in case user go directly to this url
            vm.settingActiveTab = "account";
            //This almost is a hack, need to wait for route change happen then add the "is-selected" class

            var initialRoute = "";

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                //remember the initial route the user start before they land on the settings page
                if (toState.url !== "/settings") {
                    //Need timeout to able the animation otherwise the detail panel just come on suddenly
                    $timeout(function() {
                        vm.settingActiveTab = $state.params.pageLink;
                        appCenterCtrl.settingsDetailIn = true;

                        if (vm.settingActiveTab === "termsofuse") {
                            getTermsofUse();
                        }
                    }, 10);
                }
                if (vm.settingActiveTab !== "account") {
                    vm.settingActiveTab = "account";
                    appCenterCtrl.settingsDetailIn = false;
                }
            });

            //This is for the mobile view the back arrow
            vm.dismissSettingsDetail = function() {
                vm.settingActiveTab = "account";

                // wait for the animation to finish to change the route, 350 is the animation sliding out
                $timeout(function() {
                    $location.path('/settings');
                    appCenterCtrl.settingsDetailIn = false;
                }, 350);
            };

            vm.nativeAbout = function() {
                ClientRuntimeService.about();
            };

            vm.nativeNotification = function() {
                ClientRuntimeService.notification();
            };

            vm.openPasswordDialog = function($event) {
                if ($event) {
                    $event.preventDefault();
                }
               ModalService.getCurrentModal().open('app-v2/settings/changePasswordDialog.html');
            };

            vm.downloadApp = function() {
                AppDownloadService.downloadApp();
            };

            vm.openDeviceListForDesktopappNativenav = function() {
                ModalService.getCurrentModal().open('app-v2/settings/devicelist-desktopapp-nativenav.html');
            };

            vm.termsOfUseForDesktopApp = function() {
                ModalService.getCurrentModal().open('app-v2/settings/termsofuse-desktopapp.html');
                getTermsofUse();
            };

            vm.termsOfUseForDesktopAppNativenav = function() {
                ModalService.getCurrentModal().open('app-v2/settings/termsofuse-desktopapp-nativenav.html');
                getTermsofUse();
            };

            vm.subPageNavigate = function(link) {
                $state.go('settings.pageLink', {
                    pageLink: link
                }, {
                    location: ''
                });
            };

            function getRemoveAccountSettings() {
                // pick up the value of key from local storage
                if ((UserAgent.isAndroid() || UserAgent.isIOS()) && UserAgent.isAWJadeMobile()) {
                    vm.removeAccountOrSignOutEnabled = !parseInt(hznLocalStorage.getItem('RemoveAccountSignOut'));
                }
            }

            function getTermsofUse() {
                ConfigService.getTermsOfUse().then(function(response) {
                    vm.touContent = $sce.trustAsHtml(response.content);
                    appCenterCtrl.touContent = vm.touContent;
                });
            }

            function onLoadContent() {
                if ($location.path().indexOf("termsofuse") > -1) {
                    getTermsofUse();
                }
                // in browser view while user on the sublink such as /settings/about and do a refresh
                // This will ensure the sub url will be loaded and the correct tab will be selected
                if ($location.path().indexOf("/settings/") > -1 && $location.path().length >= 10) {
                    var pagelink = $location.path();
                    // the output is /settings/about for example so extract from the 10th string
                    var subroute = pagelink.substring(10);

                    $timeout(function() {
                        vm.settingActiveTab = subroute;
                        appCenterCtrl.settingsDetailIn = true;
                    }, 10);
                }

                if (UserAgent.isMacAppDownloadSupported('10.11.0')) {
                    AppDownloadService.checkIfMacAppExists().then(function(data) {
                        if (data && data.downloadUrl) {
                            vm.showMacAppDownloadBanner = true;
                        }
                    });
                }
                getRemoveAccountSettings();
            }

            onLoadContent();
        }]);
})(angular.module("com.vmware.greenbox.appCenter"));
