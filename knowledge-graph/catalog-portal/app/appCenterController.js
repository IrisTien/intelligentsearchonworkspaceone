(function(module) {
    'use strict';

    module.controller('AppCenterController', [
                            '$scope',
                            '$rootScope',
                            '$timeout',
                            'Localization',
                            'ConfigService',
                            'SettingsService',
                            'HorizonService',
                            'UserAgent',
                            'UtilService',
                            'BrandingService',
                            'EventsService',
                            '$location',
                            '$notify',
                            'ClientRuntimeService',
                            'PasswordPolicyService',
                            'hznLocalStorage',
                            'PasswordVaultService',
                            function($scope,
                                     $rootScope,
                                     $timeout,
                                     Localization,
                                     ConfigService,
                                     SettingsService,
                                     HorizonService,
                                     UserAgent,
                                     UtilService,
                                     BrandingService,
                                     EventsService,
                                     $location,
                                     $notify,
                                     ClientRuntimeService,
                                     PasswordPolicyService,
                                     hznLocalStorage,
                                     PasswordVaultService){
        var vm = this,
            title = Localization.getLocalizedString('appCenter');

        angular.extend($rootScope, workspaceOne);

        vm.showCategoriesSidebar = false;
        vm.drawerIsActive = false;
        vm.pageTitle = title;
        vm.user = {};
        vm.isSearchDropdownOpen = false;
        vm.mobileSearchInputControl = {};
        vm.desktopSearchInputControl = {};
        vm.isAWJade = UserAgent.isAWJade();
        vm.isAWJadeV2 = UserAgent.isAWJadeV2();
        vm.isWebClip = false;
        vm.tabName = location.hash.indexOf('#/catalog') !== -1 ? 'catalog' : 'launcher';
        vm.hasLaunchableApps = UtilService.getObjValue(window, 'workspaceOne.hasLaunchableApps', true);
        $scope.tenantSettings = {};
        vm.lastActivePage = "last_active_page";
                                                   
        $timeout(function () {
            document.getElementById("PVConduit").ping = PasswordVaultService.pingExtension;
        }, 0);

        BrandingService.getBranding().then( function (branding) {
            branding = branding || {};
            var defaultFavIconUrl = "app/graphics/favicon.ico";
            var nameAndImages = branding.brandNameAndImages || {},
                companyName = nameAndImages.companyName,
                brandName = nameAndImages.brandName || title,
                favIconUrl = nameAndImages.favIconUrl || defaultFavIconUrl;
            vm.branding = branding;
            vm.pageTitle = brandName;
            vm.favIconUrl = favIconUrl;
            if ( companyName ) {
                vm.pageTitle = companyName + ' — ' + vm.pageTitle;
            }
            branding.pageTitle = vm.pageTitle;
            branding.favIconUrl = vm.favIconUrl;
            SettingsService.setCurrentBranding(branding);
        });

        SettingsService.getUserInfo().then(function(user){
            var properties = ['userName', 'firstName', 'lastName', 'emailAddress', 'numOfManagedDevices', 'phoneNumber', 'adminUser', 'internalUserType', 'changePasswordAllowed', 'localUser'];
            _.extend( vm.user, _.pick(user, properties));
            SettingsService.setCurrentUser(vm.user);
            // Send user info if in Horizon
            if (UserAgent.isHorizon()) {
                HorizonService.sendUserInfo();
            }
            vm.passwordChangeEnabled = vm.user.changePasswordAllowed;
        }, function (response) {
            if(!vm.isAWJade && _.get(response, "code") === "admin.terms.not.accepted"){
                ConfigService.getAdminConsoleTermsUrl().then(function(url){
                    window.location = url;
                });
            }
        });

        if(UserAgent.isNativeAppVersionIsEqualOrAbove('2.1')) {
            if(UtilService.getQueryParams().deviceUdid) {
                ConfigService.getDeviceRegistrationDetail().then(function (deviceDetails) {
                    deviceDetails.get().then(function (deviceStatus) {
                        vm.unEnrollEnable = false;
                        if (deviceStatus.deviceMgmtDetails) {
                            var isMdmEnrolled = deviceStatus.deviceMgmtDetails.deviceMdmEnrolled
                                && UserAgent.isNativeAppVersionIsEqualOrAbove('2.1');
                            var isContainerEnrolled = deviceStatus.deviceMgmtDetails.deviceContainerOrMdmEnrolled
                                && UserAgent.isNativeAppVersionIsEqualOrAbove('2.2');
                            vm.unEnrollEnable = isMdmEnrolled || isContainerEnrolled;
                        }
                    });
                }, function (error) {
                    vm.unEnrollEnable = false;
                });
            }else{
                vm.unEnrollEnable = false;
            }
        }

        // If Greenbox is called by Horizon client, init HorizonService
        if (UserAgent.isHorizon()) {
            HorizonService.init($scope.appCenterCtrl);
        }
                                
        if(ConfigService.isContraFeatureFlagEnabled() && UserAgent.isMobileBrowser())  {
            $notify.info('app.store.app.name', [], 'app/common/appStoreBanner.html');
        }

        vm.isWebClip = UserAgent.isWebClip();

        vm.toggleCategoriesSidebar = function() {
            vm.showCategoriesSidebar = !vm.showCategoriesSidebar;
        };

        vm.toggleDrawer = function () {
            vm.drawerIsActive = !vm.drawerIsActive;
        };

        vm.clearDesktopSearchText = function() {
            vm.desktopSearchInputControl.clearAndFocus();
        };

        vm.desktopSearchAgain = function() {
            vm.desktopSearchInputControl.clearAndFocus();
        };

        vm.showSearch = function() {
            vm.searchMode = true;
            vm.mobileSearchInputControl.focus();
        };

        vm.closeSearch = function() {
            vm.searchMode = false;
            vm.searchText = '';
        };

        vm.clearSearch = function () {
            vm.mobileSearchInputControl.clearAndFocus();
        };

        vm.about = function($event, isDesktop) {
            if ($event){
                $event.preventDefault();
            }
            if (isDesktop && !UserAgent.isAWJade()) {
                $scope.$broadcast('open-modal-dialog', { dialogtemplate: 'app/common/aboutDialog.html', dialogparams: {} });
            } else {
                ClientRuntimeService.about();
            }
        };

        vm.unEnrollConfirm = function($event) {
            if ($event){
                $event.preventDefault();
            }
            $scope.$broadcast('open-modal-dialog', { dialogtemplate: 'app/common/unenrollWarning.html', dialogparams: {} });

        };

        vm.unEnrollCallback = function () {
            if (UserAgent.isNativeAppVersionIsEqualOrAbove('3.0')) {
                if (vm.unEnrollEnable) {
                    ClientRuntimeService.unEnroll();
                } else {
                    ClientRuntimeService.unEnroll(true);
                }
            } else {
                ClientRuntimeService.unEnroll();
            }
        };

        vm.openProfile = function ($event) {
            if ($event){
                $event.preventDefault();
            }
            $scope.$broadcast('open-modal-dialog', { dialogtemplate: 'app/common/profileDialog.html', dialogparams: {} });
        };

        vm.changePassword = function($event) {
            if ($event){
                $event.preventDefault();
            }
            var policies = PasswordPolicyService.getPasswordPolicy() || null;

            if(!policies && vm.user.localUser) {
                vm.isLoading = true;
                ConfigService.getPasswordPolicy().then(function (passwordPolicy) {
                    passwordPolicy.get().then(function (policies) {
                        PasswordPolicyService.setPasswordPolicy(policies);
                        vm.isLoading = false;
                        location.hash = '#/changePassword';
                    }, function () {
                        vm.isLoading = false;
                        location.hash = '#/changePassword';
                    });
                });
            } else {
                location.hash = '#/changePassword';
            }
        };

        vm.signout = function($event) {
            if (UserAgent.isNativeAppVersionIsEqualOrAbove('2.1')) {
                $scope.$broadcast('open-modal-dialog', { dialogtemplate: 'app/common/confirmLogout.html', dialogparams: {} });
            } else {
                vm.continueSignout($event);
            }
        };

        vm.continueSignout = function($event){
            if ($event) {
                $event.preventDefault();
            }
            ConfigService.doNotRefreshCache = true;
            if (UserAgent.isHorizon()){
                ClientRuntimeService.logout();
            } else {
                ConfigService.getLogoutUrl().then(function(logoutUrl){
                    ClientRuntimeService.logout(logoutUrl);
                });
            }
        };

        vm.openPrivacyPage = function($event, privacyUrl) {
            if ($event){
                $event.preventDefault();
            }
            ClientRuntimeService.openUrl(privacyUrl);
        };
        /*
        * ios UIWebview, has problem wih href="#..." syntax
        */
        vm.catalog = function(){
            vm.tabName = 'catalog';
            hznLocalStorage[vm.lastActivePage] = vm.tabName;
            location.hash = '#/catalog'
        };

        vm.launcher = function(){
            vm.tabName = 'launcher';
            hznLocalStorage[vm.lastActivePage] = vm.tabName;
            location.hash = '#/launcher'
        };
                                
        vm.showTabs = function(){
            if(location.hash.indexOf('/launcher') == 1 || (location.hash.indexOf('/catalog') == 1 && vm.hasLaunchableApps)){
                return true;
            }
                return false;
        };                            

        vm.preferences = function($event){
            if ($event){
                $event.preventDefault();
            }
            location.hash = '#/preferences'
        };

        vm.adminConsole = function($event){
            if ($event){
                $event.preventDefault();
            }
            ConfigService.getAdminConsoleUrl().then(function(url){
                window.open(url);
            });
        };

        vm.backAction = function() {
            return window.history.back();
        };

        vm.openDevices = function($event, showDialog) {
            if ($event){
                $event.preventDefault();
            }
            $scope.$broadcast('open-modal-dialog', { dialogtemplate: 'app/common/devicesDialog.html', dialogparams: {} });
        };

        $scope.$on('$locationChangeSuccess', function (ev, newUrl, oldUrl) {
            // store previous Url so page controllers can determine their "referrer"
            vm.previousUrl = (newUrl !== oldUrl) && oldUrl;
        });

        $scope.$on('$routeChangeStart', function() {
            //Close search dropdown, side drawer while changing pages
            vm.isSearchDropdownOpen = false;
            vm.drawerIsActive = false;
        });

        $scope.$on('deviceOnlineStatusChanged', function(event,deviceOnline){

            if( !UserAgent.isAWJade() ){
                if(deviceOnline){
                    $notify.close('deviceStatus.networkLost');
                    $notify.success('deviceStatus.networkRestored');
                }else{
                    $notify.error('deviceStatus.networkLost');
                }
            }
        });

        $scope.$watch('appCenterCtrl.searchText', function(searchText){
            //If user searches on details page navigate to catalog page which will load
            // the entitlements with search text
            if(searchText && $location.path().indexOf('details') > -1){
                $location.path('catalog');
            }
        });
     
        vm.showRemoveAccountLink = UserAgent.isNativeAppVersionIsEqualOrAbove('3.0') || vm.unEnrollEnable;
        vm.showSignoutLinkInMobile = UserAgent.isNativeAppVersionIsEqualOrBelow('2.9') && !vm.isWebClip;
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
