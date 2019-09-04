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


(function(module) {

    'use strict';

	module.controller('CatalogController', [
                        '$scope',
                        'CatalogService',
                        'ConfigService',
                        '$timeout',
                        '$notify',
                        'EventsService',
                        'PAGING',
                        'UserAgent',
                        'BootstrapService',
                        function($scope,
                                 CatalogService,
                                 ConfigService,
                                 $timeout,
                                 $notify,
                                 EventsService,
                                 PAGING,
                                 UserAgent,
                                 BootstrapService){

        var vm = this;
        var enrollmentUrl;
        var appCenterCtrl = $scope.appCenterCtrl;
        var allCatalogApps = [];
        var index = 0;

        var init = function() {
            vm.loading = true;
            vm.visibleCatalogApps = [];
            vm.appCategories = [];
            vm.appCenterContext = {
                searchText : appCenterCtrl.searchText,
                selectedCategory : CatalogService.getSelectedCategory()
            };
            vm.defaultLabels = CatalogService.getDefaultLabels();
            vm.showNoResultsMsg = false;
            vm.showNoSearchResultsMsg = false;
            vm.enrollmentSupported = ConfigService.enrollmentSupported();
            if(vm.enrollmentSupported){
                ConfigService.getEnrollmentUrl().then(function(url){
                    enrollmentUrl = url;
                });
            }
            vm.filterConfig = { items: vm.appCategories, defaultItem: vm.appCenterContext.selectedCategory}
        };

        var loadFirstPageEntitlements = function(context, loadCategories){
            index = 0;
            // Delay showing spinner till 2 seconds.
            var cancelPromise = $timeout(function() {
                startLoading();
            }, 2000);

            CatalogService.getFirstPage(context).then(function(entitlementsResponse){
                $timeout.cancel(cancelPromise);
                doneLoading();
                $scope.deviceStatus = _.get(entitlementsResponse, "deviceStatus");
                if(!entitlementsResponse.allEntitlementsLoaded) {
                    var authErrorType = entitlementsResponse.authErrorType;
                    if(UserAgent.isAWJadeV2() && ($scope.deviceStatus === 'MDM_DEVICE_BLACKLISTED' || ($scope.deviceStatus === 'MDM_DEVICE_NOT_ENROLLED') && !UserAgent.isNativeAppVersionIsEqualOrBelow("2.0"))) {
                        $notify.info('appCenter.someAppsMissingMessage', [], 'app/catalog/entitlementNotLoadedMsgTemplate.html', $scope.deviceStatus);
                    }
                    else if (angular.isString(authErrorType) && authErrorType!== 'MDM_DEVICE_CONFIG_ERR') {
                        $notify.info('appCenter.auth.mdmError');
                    }else if ($scope.deviceStatus === 'MDM_DEVICE_NOT_ENROLLED' && UserAgent.isAndroid() && UserAgent.isNativeAppVersionIsEqualOrBelow("2.0")){
                        $notify.info('appCenter.someAppsMissingMessage');
                    }else if(UserAgent.isAWJadeV2() && ($scope.deviceStatus !== 'MDM_DEVICE_FULLY_ENROLLED' || $scope.deviceStatus !== 'MDM_DEVICE_CONTAINER_ENROLLED')) {
                        $notify.info('appCenter.someAppsMissingMessage', [], 'app/catalog/entitlementNotLoadedMsgTemplate.html', $scope.deviceStatus);
                    }else {
                        $notify.info('appCenter.someAppsMissingMessage');
                    }
                }
                updateApps(entitlementsResponse.entitlements, true);
                if(loadCategories){
                    ConfigService.getAppCategories().then(function(categories){
                        if(categories){
                            vm.appCategories = categories;
                            vm.filterConfig.items = vm.defaultLabels.concat(categories);
                        } else {
                            vm.filterConfig.items = vm.defaultLabels;
                        }
                    });
                }
            });
        };


        vm.getNextPage = function(){
            var endIndex = index + PAGING.PAGE_SIZE;
            while (index < endIndex && index < allCatalogApps.length){
                vm.visibleCatalogApps.push(allCatalogApps[index]);
                index++;

            }
        }

        var handleInstallEvents = function(){
            return EventsService.getEvents();
        }


        var loadFirstPageOnLoad = function() {
            BootstrapService.init().then(loadFirstPageEntitlements(vm.appCenterContext, true));
        };

        var updateApps = function(data, clearOld) {
            if (clearOld) {
                allCatalogApps = data;
                vm.visibleCatalogApps = [];
            } else {
                allCatalogApps = allCatalogApps.concat(data);
            }
            appCenterCtrl.hasLaunchableApps = hasLaunchableApps(allCatalogApps);
            var appCount = allCatalogApps.length;
            if(appCount == 0 && appCenterCtrl.searchText){
                vm.showNoSearchResultsMsg = true;
                vm.showNoResultsMsg = false;
            }else if(appCount == 0){
                vm.showNoResultsMsg = true;
                vm.showNoSearchResultsMsg = false;
            }else{
                vm.showNoResultsMsg = false;
                vm.showNoSearchResultsMsg = false;
            }
            vm.getNextPage();
            vm.loading = false;
            handleInstallEvents().then(function (eventsResponse){
                if (eventsResponse[0]){
                    if (eventsResponse[0].action === 'INSTALL'){
                        var app = _.find(allCatalogApps, {'appId' : eventsResponse[0].eventData.appId});
                        CatalogService.activateAppAfterEnrollment(app, $scope.deviceStatus, $scope.$modal);
                    }
                }
            });
        };

        vm.filterByLabel = function(category){
            vm.currentLabel = category;
            vm.loading = true;
            allCatalogApps = [];
            vm.visibleCatalogApps = [];
            CatalogService.setSelectedCategory(category);
            vm.appCenterContext.selectedCategory = CatalogService.getSelectedCategory();
            loadFirstPageEntitlements(vm.appCenterContext);
        };

        vm.enrollDevice = function(){
            window.location.href = enrollmentUrl;
        };
            
            

        function startLoading () {
            vm.isLoading = true;
        }

        function doneLoading () {
            vm.isLoading = false;
        }

        function hasLaunchableApps ( apps ) {
            var hasLaunchableApps = false;
            var launchableAppTypes = ["VIRTUAL", "WEB"];
            var launchableNativeAppSubTypes = ["THINAPP", "APPV"];
            for(var i=0; i < apps.length; i++) {
                if(launchableAppTypes.indexOf(apps[i].type) > -1
                    || (apps[i].type === 'NATIVE' && launchableNativeAppSubTypes.indexOf(apps[i].subType) > -1)
                    || apps[i].subType === 'PASSWORDVAULT') {
                    hasLaunchableApps = true;
                    break;
                }
            }
            return hasLaunchableApps;
        }


        $scope.$on('open-modal-dialog', function(event, args) {
            var template = args.dialogtemplate;
            $scope.$modal.open(template, $scope, {params: args.dialogparams});
        });

        var initializing = true;
        //When search text changes reload the entitlements.
        $scope.$watch('appCenterCtrl.searchText', function(searchText){
            //Ignoring first time as change is fired on property initialize
            if(initializing){
                initializing = false;
            }else{
                vm.appCenterContext.searchText = searchText;
                allCatalogApps = [];
                vm.visibleCatalogApps = [];
                loadFirstPageEntitlements(vm.appCenterContext);
            }
        });

        init();
        loadFirstPageOnLoad();
	}]);


})(angular.module("com.vmware.greenbox.appCenter"));


(function(module) {

    'use strict';

    var typeNames = {
        WEB: 'appCenter.type.web',
        VIRTUAL: 'appCenter.type.virtual',
        NATIVE: 'appCenter.type.native',
        NATIVE_PLATFORM: 'appCenter.type.native.platform',
        THINAPP: 'app.details.label.type.THINAPP',
        PROFILE: 'app.details.label.type.PROFILE'
    };

    var platformNames = {
        IOS: 'iOS',
        ANDROID: 'Android',
        WINDOWS: 'Windows',
        MAC: 'OS X',
        none: 'Unknown'
    };

    module.controller('CatalogItemController',['$scope', 'CatalogService', 'OfflineService', 'UserAgent', 'INSTALL_STATUS','$window', '$filter', 'LauncherService', '$sce', '$element', '$timeout', '$document', 'DetailsService', 'DeviceBreakpointService',
    function($scope, CatalogService, OfflineService, UserAgent, INSTALL_STATUS, $window, $filter, LauncherService, $sce, $element, $timeout, $document, DetailsService, DeviceBreakpointService){
        var catalogItemViewModel = this;
        var catalogApp = catalogItemViewModel.app;
        //Defaulting the status if a status has not being passed. Need to decide on if string is passed or enumeration.
        var appStatus = catalogApp.installStatus;
        var platform = 'none';

        if(appStatus === "" || appStatus === undefined ){
            appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
        } else if (!catalogApp.visible) {
            appStatus = 'HIDDEN';
        } else if ((catalogApp.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(appStatus) >= 0) || (catalogApp.subType === 'THINAPP' && catalogApp.perDeviceActivationRequired)) {
            appStatus = 'REQUEST';
        }

        var getIconUrl = function(app){
            return app['_links']['icon'] != undefined ? app['_links']['icon']['href'] : '';
        };
        var getInstallUrl = function(app){
            return app['_links']['install']['href'];
        };

        catalogApp.typeName = typeNames[catalogApp.type];
        catalogApp.installAction = CatalogService.getInstallStatusText(appStatus, catalogApp);
        catalogApp.installUrl = getInstallUrl(catalogApp);
        var iconUrl = getIconUrl(catalogApp);
        catalogApp.backgroundImage =  iconUrl ? 'url(' + iconUrl + ')' : 'none';
        catalogApp.appNeedToActivated = catalogApp.installStatus === 'NOT_ACTIVATED' || catalogApp.installStatus === 'UPDATE' || catalogApp.installStatus === 'ACTIVATION_FAILED' || (catalogApp.installStatus !== 'NOT_ACTIVATED' && !catalogApp.visible) || (catalogApp.subType === 'THINAPP' && catalogApp.perDeviceActivationRequired);
        if ( catalogApp.subType === 'THINAPP') {
            catalogApp.typeName = typeNames.THINAPP;
        } else if (catalogApp.subType === 'PROFILE'){
            catalogApp.typeName = typeNames.PROFILE;
        } else if ( catalogApp.type === 'NATIVE' && catalogApp.subType !== 'THINAPP') {
            var lowerCaseDeviceType = workspaceOne.deviceType.toLowerCase();
            if (lowerCaseDeviceType  == 'apple' ) {
                platform = 'IOS';
            } else if (lowerCaseDeviceType == 'android') {
                platform = 'ANDROID';
            } else if ( lowerCaseDeviceType == 'winrt' || lowerCaseDeviceType == 'windowsphone8' ||
                lowerCaseDeviceType == 'windowsmobile' || lowerCaseDeviceType == 'windowspc' || lowerCaseDeviceType == 'windowsphone') {
                platform = 'WINDOWS';
            } else if ( lowerCaseDeviceType == 'appleosx') {
                platform = 'MAC';
            }
            if ( platform ) {
                catalogApp.typeName = typeNames.NATIVE_PLATFORM;
                catalogApp.platformName = platformNames[platform];
            }
        }

        catalogItemViewModel.details = function(appId) {
            DetailsService.setAppDetails(catalogApp);
            location.hash = '#/details/' + appId + '/catalog';
        };
        
        catalogApp.imageLoaded = false;        
        function onLoadImage() {
            var width = img.width;
            $element.find('.emblem-image').css('width' , '');
            $element.find('.emblem-image').css('top' , '');
            var iconSize = parseInt($element.find('.emblem-image').css('width'));
            var backgroundSize, size, top;
            if (width < iconSize){
                backgroundSize = 'auto'; 
                size = width;
                top = (iconSize - width)/2;
            } 
            else {
                 backgroundSize = 'contain'; 
                 size = iconSize;
            } 
            $element.find('.emblem-image').css('width', size);
            $element.find('.emblem-image').css('height', size);
            $element.find('.emblem-image').css('top', top);
            
            $timeout(function() {
                catalogApp.backgroundSize = backgroundSize;
                catalogApp.imageLoaded = true;
            });
        }
        
        var img = new Image();
        img.onload = onLoadImage.bind(img);
        img.src = iconUrl;
        
        onLoadImage();
        
        angular.element($window).bind('resize', function () {
            if(!DeviceBreakpointService.isPhone()) {
                onLoadImage();
            } else{
                $element.find('.emblem-image').css('width' , '');
                $element.find('.emblem-image').css('height', '');
                $element.find('.emblem-image').css('top' , '');
                $element.find('.emblem-image').css('background-size', 'contain');
            }
        });
        
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';

    module.directive('catalogItem', function(){

        return {
            restrict : 'A',
                replace: true,
                scope : { app : '=appdata', modal : '=modalobj', isLoading: '=', deviceStatus: '=' },
            templateUrl : 'app/catalog/catalogItem.html',
                controller : 'CatalogItemController',
                controllerAs : 'catalogItemCtrl',
                bindToController : true
        };

    });

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {
    'use strict';
    module.service('CatalogService', [
                                '$http',
                                '$q',
                                'RequestFactory',
                                'Resource',
                                '$sce',
                                'ConfigService',
                                'INSTALL_STATUS',
                                'Localization',
                                'OfflineService',
                                '$filter',
                                'ClientRuntimeService',
                                '$notify',
                                '$timeout',
                                'EventsService',
                                'UserAgent',
                                'UtilService',
                                function(
                                    $http,
                                    $q,
                                    RequestFactory,
                                    Resource,
                                    $sce,
                                    ConfigService,
                                    INSTALL_STATUS,
                                    Localization,
                                    OfflineService,
                                    $filter,
                                    ClientRuntimeService,
                                    $notify,
                                    $timeout,
                                    EventsService,
                                    UserAgent,
                                    UtilService){

        var ALL_APPS_LABEL = {
            name: Localization.getLocalizedString('myapp.nav.allApps'),
            type:'all',
            isDefault:true
        };
        var EULA_TEMPLATE_URL = '/catalog-portal/services/api/activate/{appId}/acceptEula/{eulaContentId}';
        var selectedCategory = ALL_APPS_LABEL;
        var featureFlags = workspaceOne.featureFlags;

        var catalogService = this;

        function getCategoryName (category){
            if( category && category.type && category.type === 'all' || !category)
                return '';
            else {
                return category.name;
            }
        }

        this.setSelectedCategory = function(selCategory) {
            selectedCategory = selCategory;
        }

        this.getSelectedCategory = function() {
            return selectedCategory;
        }

        this.getFirstPage = function(appCenterContext){
            return ConfigService.getEntitlementsUrl().then(function(url){
                var params = {};
                var response = {};
                params.q = appCenterContext.searchText;
                params.category = getCategoryName(appCenterContext.selectedCategory);

                var request = Resource(url, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params});
                return request.get().then(function(entitlementsResponse){
                    response.allEntitlementsLoaded = entitlementsResponse['allEntitlementsLoaded'];
                    var entitlements = UtilService.getObjValue(entitlementsResponse, '_embedded[entitlements]', [])
                    response.entitlements = _.uniq(entitlements, 'appId');
                    response.deviceStatus = UtilService.getObjValue(entitlementsResponse, 'deviceInfo.[deviceStatus]', undefined)
                    response.authErrorType = entitlementsResponse['authErrorType'];
                    return response;
                });
            });
        };

        this.activateApp = function (activationUrl, useJQ, deviceId) {
            var params = {};
            if (deviceId) {
                params.deviceId = deviceId;
            }
            if (useJQ) {
                var req = RequestFactory(activationUrl, {method:'POST', data: params});
                var defer = $q.defer();
                $.ajax(req).then(function(appActivationResponse){
                    if(appActivationResponse.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name){
                        defer.reject(appActivationResponse);
                    }else{
                        defer.resolve(appActivationResponse);
                    }
                }, function(error){
                    defer.reject(error);
                });
                return defer.promise;
            } else {
                var req = RequestFactory(activationUrl, {method:'POST', params: params});
                return $http(req);
            }
        };

        this.getDefaultLabels = function() {
            return [ALL_APPS_LABEL];
        }


        this.activateAppAfterEnrollment = function(app, deviceStatus, modal) {
            if (OfflineService.isDeviceOnline()) {
                //Mdm apps should be able to activate anytime
                if(app.installStatus === 'NOT_ACTIVATED' || app.installStatus === 'ACTIVATION_FAILED') {
                    catalogService.showConfirmationMessage(app, modal, deviceStatus);
                }
            }else{
                modal.alert({
                    title: 'requestFailed',
                    message: 'installStatus.offlineInstallMessage',
                    ok: 'ok'
                });
            }
        };


        this.acceptEula = function(appId, eulaId){
            var eulaAcceptUrl = ConfigService.getBaseUrl() + EULA_TEMPLATE_URL;
            eulaAcceptUrl = eulaAcceptUrl.replace('{appId}', appId);
            eulaAcceptUrl = eulaAcceptUrl.replace('{eulaContentId}', eulaId);

            var eulaRequest = RequestFactory(eulaAcceptUrl, {method: 'POST', params: {}});
            return $http(eulaRequest);
        };

        this.getInstallStatusText = function(installStatus, app) {
            if(app.type === 'NATIVE' && app.subType !== 'THINAPP'){
                return INSTALL_STATUS[installStatus].nativeAction || INSTALL_STATUS[installStatus].value;
            } else if(this.isMdmWebApp(app.type, app.subType)) {
                if(app.visible) {
                    return INSTALL_STATUS["ACTIVATED"].action;
                } else {
                    return INSTALL_STATUS["NOT_ACTIVATED"].action;
                }
            } else{
                return INSTALL_STATUS[installStatus].action || INSTALL_STATUS[installStatus].value;
            }
        };

        this.isMdmApp = function(appType, subType) {
            return appType === 'NATIVE' && subType !== 'THINAPP';
        };

        this.isMdmWebApp = function(appType, subType) {
            return appType === 'WEB' && subType === 'MDMWEB';
        };

        this.showConfirmationMessage = function(app, modal, deviceStatus) {
            var title = $filter('i18n')('appCenter.appInstallConfirmPromptTitle');
            if (!app.installMessage){
                app.installMessage = $filter('i18n')('installMessage.proceedToInstall');
            }
            var message = '<h2>' + app.name +'</h2>';
            if(app.size) {
                message += '<p>' + $filter('i18n')('app.details.label.size') + ': ' + (app.size/1000000).toPrecision(3) + $filter('i18n')('app.details.abbrev.megabytes') + '</p>';
            }
            if(app.price) {
                message += '<p>' + $filter('i18n')('app.details.label.price') + ': ' + app.price+ '</p>';
            }
            message += '<p>' +app.installMessage + '</p>';
            var messageHtml = $sce.trustAsHtml(message);
            var template = "app/common/appInstallConfirmPrompt.html";
            if(app && UserAgent.isIOS() && deviceStatus === "MDM_DEVICE_CONTAINER_ENROLLED" && !app.mgmtRequired && app.subType == 'INTERNAL') {
                template = "app/common/privateAppInstructionsModal.html";
            }
            modal.open( template,
                { message: messageHtml , modal: modal, title: title }
            ).then(
                function () {
                    catalogService.continueWithActivateApp(app, modal);
                }
            );
        };

        function handleStatus (appActivationResponse, app, modal) {
            if (appActivationResponse.status === INSTALL_STATUS.REDIRECT_FOR_ENROLL.name) {
                app.installAction = INSTALL_STATUS.REDIRECT.value;
                app.appNeedToActivated = false;
                var title = $filter('i18n')('beforeInstallation');
                var privacyUrl = $sce.trustAsHtml(appActivationResponse.privacyUrl);
                modal.open('app/common/enrollModal.html', {
                        name: app.name,
                        title: title,
                        privacyUrl: privacyUrl,
                        modal: modal
                    }
                ).then(function () {
                        EventsService.addEvent();
                        ClientRuntimeService.enroll(appActivationResponse.redirectUrl);
                    }
                );

            } else if (appActivationResponse.status === INSTALL_STATUS.REDIRECT.name) {
                ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
            } else if (appActivationResponse.status === INSTALL_STATUS.ACCEPT_EULA.name) {
                catalogService.handleEula(appActivationResponse, app, modal);
            } else if (appActivationResponse.status === INSTALL_STATUS.VPP_ACCEPT.name) {
                if (appActivationResponse.message) {
                    catalogService.handleVppAcceptInvite(appActivationResponse, modal);
                }
            }
            else {
                ConfigService.refreshCache().then(function() {
                    $timeout(function() {
                        if (!ConfigService.isReloading) {
                            ConfigService.isReloading = true;
                            location.reload();
                        }
                    }, 1000, false)});;
            }
        }

        this.handleVppAcceptInvite = function(appActivationResponse, modal) {
            var title = $filter('i18n')('appCenter.vppInviteTitle');
            modal.open( "app/catalog/vppInviteAccept.html",
                { message: appActivationResponse.message , title: title, modal: modal }
            ).then(
                function () {
                    ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                }
            );
        };


        this.handleEula = function(appActivationResponse, app, modal){
            var title = $filter('i18n')('termsOfUse');
            var message = $sce.trustAsHtml(appActivationResponse.message);
            modal.open('app/common/eulaModal.html', { title: title,
                    message: message, modal: modal }
            ).then(function(){
                    //User accepted EULA.
                    catalogService.acceptEula(app.appId, appActivationResponse.eulaContentId).then(function(acceptEulaResponse){
                        app.installAction = INSTALL_STATUS.PROCESSING.value;
                        app.appNeedToActivated = false;
                        /* Once EULA is accepted proceed to normal install app flow. For instance if
                         status is returned as REDIRECT then redirect to app store etc. */
                        handleStatus(acceptEulaResponse.data, app, modal);
                    });
                }
            );
        };


        this.continueWithActivateApp = function(app, modal) {
            catalogService.activateApp(app.installUrl, true).then(function (appActivationResponse) {
                handleStatus(appActivationResponse, app, modal);
            }, function (error) {
                //TODO: We need to better the error handling
                if(!!error.handled) {//When system is under maintenance
                    return;
                }
                var message;
                var title;
                if (error.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name) {
                    //If compliance check has failed, show the message returned form server.
                    message = error.message;
                } else if (error.responseJSON.code === "device.unenrolled"){
                    message = 'installStatus.unenrolledDevice'
                    title = 'changeOccurred'
                } else {
                    message = 'installStatus.installFailedMessage'
                    title = 'requestFailed'
                }
                modal.alert({
                    title: title,
                    message: message,
                    ok: 'ok'
                }).then(  function() {
                    if (error.responseJSON.code === "device.unenrolled"){
                        $notify.warning('api.updateApps');
                        ConfigService.refreshCache().then(function() {
                            $timeout(function() {
                                if (!ConfigService.isReloading) {
                                    ConfigService.isReloading = true;
                                    location.reload();
                                }
                            }, 1000, false);
                        });
                    }
                });
            });
        }


        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
// (c) 2016 VMware, Inc.  All rights reserved.


(function(module) {
    'use strict';
    module.controller('EntitlementErrorController',['$scope','Localization','UtilService','UserAgent','ClientRuntimeService', function($scope, Localization, UtilService, UserAgent, ClientRuntimeService) {
        var vm = this;
        vm.hideDetail = true;
        vm.isAndroid = UserAgent.isAndroid();
        vm.isAWJade2_0 = UserAgent.isNativeAppVersionIsEqualOrBelow("2.0");
        var deviceStatus = $scope.message.argument;

        if(deviceStatus === 'MDM_DEVICE_BLACKLISTED'){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.blackListed');
        }
        else if(deviceStatus === 'MDM_DEVICE_NOT_ENROLLED' && !(vm.isAndroid && vm.isAWJade2_0)){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.notRegistered');
        }
        else if(deviceStatus === 'MDM_DEVICE_CONF_ERROR') {
            vm.detail = Localization.getLocalizedString('appCenter.device.status.confError');
        }
        else if (deviceStatus === 'MDM_DEVICE_NO_ENTITLE'){
            vm.detail = Localization.getLocalizedString('appCenter.device.mdmApps.notFoundError');
        }
        else if (deviceStatus === 'MDM_DEVICE_COMM_ERROR'){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.commError');
        }
        else if (deviceStatus === 'MDM_DEVICE_INPUT_ERROR'){
            vm.detail = Localization.getLocalizedString('appCenter.device.status.deviceInputError');
        }
        else {
            vm.detail = Localization.getLocalizedString('appCenter.device.status.unknownError');
        }

        vm.enroll = function($event, $index) {
            if ($event){
                $event.preventDefault();
            }
            ClientRuntimeService.register();
            $scope.close($index);
        };

    }]);
})(angular.module("com.vmware.greenbox.appCenter"));
(function(module) {
    'use strict';

    module.directive('installButton', [
                        'OfflineService',
                        'CatalogService',
                        'INSTALL_STATUS',
                        '$window',
                        '$filter',
                        'LauncherService',
                        '$sce',
                        '$notify',
                        '$timeout',
                        'UtilService',
                        'UserAgent',
                        'ConfigService',
                        'EventsService',
                        'ThinappMultiDeviceActivationService',
                        'ClientRuntimeService',
                        function (OfflineService,
                                  CatalogService,
                                  INSTALL_STATUS,
                                  $window,
                                  $filter,
                                  LauncherService,
                                  $sce,
                                  $notify,
                                  $timeout,
                                  UtilService,
                                  UserAgent,
                                  ConfigService,
                                  EventsService,
                                  ThinappMultiDeviceActivationService,
                                  ClientRuntimeService) {

        function postLink(scope, element, attrs) {
            if(attrs.normalWidth){
                element.removeClass('full-width-');
            }

        }

        function controller () {
            var installAppCtrl = this;
            var installApp = installAppCtrl.app;
            installAppCtrl.deviceReqs = [];
            installApp.isMdmApp = CatalogService.isMdmApp(installApp.type, installApp.subType);
            installApp.isMdmWebApp = CatalogService.isMdmWebApp(installApp.type, installApp.subType);

            function updateStatus (status, currentApp) {
                currentApp.installAction = CatalogService.getInstallStatusText(status, currentApp);
                currentApp.appNeedToActivated = status === 'NOT_ACTIVATED' || status === 'UPDATE';
                currentApp.installStatus = status;
            }

            function handleStatus (appActivationResponse, app) {
                if (appActivationResponse.status === INSTALL_STATUS.REDIRECT_FOR_ENROLL.name) {
                    installApp.installAction = INSTALL_STATUS.REDIRECT.value;
                    installApp.appNeedToActivated = false;
                    var title = $filter('i18n')('beforeInstallation');
                    var privacyUrl = $sce.trustAsHtml(appActivationResponse.privacyUrl);
                    installAppCtrl.modal.open('app/common/enrollModal.html', {
                            name: app.name,
                            title: title,
                            privacyUrl: privacyUrl,
                            modal: installAppCtrl.modal
                        }
                    ).then(function () {
                            EventsService.addEvent('INSTALL', app.appId);
                            ClientRuntimeService.enroll(appActivationResponse.redirectUrl);
                        },
                        function () {
                            updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                        }
                    );

                } else if (appActivationResponse.status === INSTALL_STATUS.REDIRECT.name) {
                    if(UserAgent.isWindows() && app && app.externalStoreAppId){
                        appActivationResponse.redirectUrl = '&appId=' + app.externalStoreAppId;
                    }
                    ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                } else if (appActivationResponse.status === INSTALL_STATUS.ACCEPT_EULA.name) {
                    handleEula(appActivationResponse, app);
                } else if (appActivationResponse.status === INSTALL_STATUS.VPP_ACCEPT.name) {
                    if (appActivationResponse.message) {
                        handleVppAcceptInvite(appActivationResponse);
                    }
                }
                else {
                    installApp.installAction = CatalogService.getInstallStatusText(appActivationResponse.status, app);
                    installApp.appNeedToActivated = false;
                    installApp.installStatus = appActivationResponse.status;
                    if(UserAgent.isWindows() && app && app.externalStoreAppId){
                        windowsAppInstallCallback(app.externalStoreAppId);
                    }
                }
            }

            var windowsAppInstallCallback = function (appId) {
                ClientRuntimeService.windowsInstallProgress(appId);
            };

            var handleEula = function(appActivationResponse, app){
                var title = $filter('i18n')('termsOfUse');
                var message = $sce.trustAsHtml(appActivationResponse.message);
                installAppCtrl.modal.open('app/common/eulaModal.html', { title: title,
                        message: message, modal: installAppCtrl.modal }
                ).then(function(){
                        //User accepted EULA.
                        CatalogService.acceptEula(app.appId, appActivationResponse.eulaContentId).then(function(acceptEulaResponse){
                            app.installAction = INSTALL_STATUS.PROCESSING.value;
                            app.appNeedToActivated = false;
                            /* Once EULA is accepted proceed to normal install app flow. For instance if
                             status is returned as REDIRECT then redirect to app store etc. */
                            handleStatus(acceptEulaResponse.data, app);
                        });
                    },
                    function() {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , app);
                    }

                );
            };

            var handleVppAcceptInvite = function(appActivationResponse) {
                var title = $filter('i18n')('appCenter.vppInviteTitle');
                installAppCtrl.modal.open( "app/catalog/vppInviteAccept.html",
                    { message: appActivationResponse.message , title: title, modal: installAppCtrl.modal }
                ).then(
                    function () {
                        // User accepted invite
                        installApp.installAction = INSTALL_STATUS.REDIRECT.value;
                        installApp.appNeedToActivated = false;
                        ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                    },
                    function () {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , installApp);
                    }
                );
            };

            var showConfirmationMessage = function(app) {
                var title = $filter('i18n')('appCenter.appInstallConfirmPromptTitle');
                var message = '<h2>' + app.name +'</h2>';
                if(app.size) {
                    message += '<p>' + $filter('i18n')('app.details.label.size') + ': ' + (app.size/1000000).toPrecision(3) + $filter('i18n')('app.details.abbrev.megabytes') + '</p>';
                }
                if(app.price) {
                    message += '<p>' + $filter('i18n')('app.details.label.price') + ': ' + app.price+ '</p>';
                }
                message += '<p>' +app.installMessage + '</p>';

                var messageHtml = $sce.trustAsHtml(message);
                var template = "app/common/appInstallConfirmPrompt.html";
                if(UserAgent.isIOS() && installAppCtrl.deviceStatus === "MDM_DEVICE_CONTAINER_ENROLLED" && !app.mgmtRequired && app.subType == 'INTERNAL') {
                    template = "app/common/privateAppInstructionsModal.html";
                }
                installAppCtrl.modal.open( template,
                    { message: messageHtml , modal: installAppCtrl.modal, title: title }
                ).then(
                    function () {
                        continueWithActivateApp(app);
                    },
                    function () {
                        installAppCtrl.isLoading = false;
                    }
                );
            };

            function continueWithActivateApp(app) {
                updateStatus(INSTALL_STATUS.PROCESSING.name , app);
                CatalogService.activateApp(app.installUrl, true).then(function (appActivationResponse) {
                    installAppCtrl.isLoading = false;
                    handleStatus(appActivationResponse, app);
                }, function (error) {
                    //TODO: We need to better the error handling
                    if(!!error.handled) {//When system is under maintenance
                        return;
                    }
                    installAppCtrl.isLoading = false;
                    var title = 'requestFailed';
                    var message;
                    if (error.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name) {
                        //If compliance check has failed, show the message returned form server.
                        message = error.message;
                    } else if (error.responseJSON && error.responseJSON.code === "device.unenrolled"){
                        message = 'installStatus.unenrolledDevice'
                        title = 'changeOccurred'
                    } else {
                        message = 'installStatus.installFailedMessage'
                        title = 'requestFailed'
                    }
                    installAppCtrl.modal.alert({
                        title: title,
                        message: message,
                        ok: 'ok'
                    }).then(  function() {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , app);
                        if (error.responseJSON.code === "device.unenrolled"){
                            $notify.warning('api.updateApps');
                            ConfigService.refreshCache().then(function() {
                                $timeout(function() {
                                    if (!ConfigService.isReloading) {
                                        ConfigService.isReloading = true;
                                        location.reload();
                                    }
                                }, 1000, false);
                            });
                        }
                    });
                });
            }



            installAppCtrl.requestThinAppOnADevice = function(deviceId) {
                CatalogService.activateApp(installApp.installUrl, true, deviceId).then(function (appActivationResponse) {
                    installAppCtrl.modal.close();
                }, function (error) {
                    installAppCtrl.isLoading = false;
                    var message = 'installStatus.installFailedMessage'
                    installAppCtrl.modal.alert({
                        title: 'requestFailed',
                        message: message,
                        ok: 'ok'
                    });
                });
            };

            installAppCtrl.openDevicesDialog = function(app) {

                ThinappMultiDeviceActivationService.getDeviceReqs(app).then(function(devReqs){
                    installAppCtrl.deviceReqs = devReqs;
                    installAppCtrl.modal.open('app/catalog/thinappMultiDeviceActivation.html', { title: 'Request App',
                            ctrl: installAppCtrl}
                    );
                });
            }

            installAppCtrl.getThinappRequestStatusMsg = function(device) {
                if (device.activationState && device.activationState != '') {
                    var statusKey = 'app.thinappMultiDeviceAct.activationState.'+ device.activationState;
                    var statusMsg = $filter('i18n')(statusKey);
                    if (device.message && device.message != '') {
                        statusMsg = statusMsg + ': ' + device.message;
                    }
                    return statusMsg;
                }
                return '';
            };

            installAppCtrl.isRequestable = function(device) {
                return (device.activationState == '' || device.activationState == 'deniedActivation' || device.activationState == 'notActivated');
            };

            installAppCtrl.activateApp = function(app) {
                if (app.subType === 'THINAPP' && app.perDeviceActivationRequired) {
                    installAppCtrl.openDevicesDialog(app);
                    return;
                }

                installAppCtrl.isLoading = true;
                if (OfflineService.isDeviceOnline()) {
                    //Mdm apps should be able to activate anytime
                    if(!installApp.isMdmWebApp && (app.installStatus === 'NOT_ACTIVATED' || app.installStatus === 'ACTIVATION_FAILED' || installApp.isMdmApp)) {
                        if(app.installMessage &&  (!app.mgmtRequired || installAppCtrl.deviceStatus === "MDM_DEVICE_FULLY_ENROLLED")){
                            showConfirmationMessage(app);
                        }else{
                            continueWithActivateApp(app);
                        }

                    } else if (!app.visible) {
                        updateStatus(INSTALL_STATUS.PROCESSING.name , app);
                        LauncherService.setAppVisible(app).then(function(data){
                            if(data) {
                                //success
                                app.visible = true;
                                updateStatus(INSTALL_STATUS.ACTIVATED.name , app);
                                installAppCtrl.isLoading = false;
                            }  else {
                                updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name , app);
                                installAppCtrl.isLoading = false;
                                installAppCtrl.modal.alert({
                                    title: 'requestFailed',
                                    message: 'error.failToShowApp',
                                    ok: 'ok'
                                });
                            }
                        });
                    }
                }else{
                    installAppCtrl.isLoading = false;
                    installAppCtrl.modal.alert({
                        title: 'requestFailed',
                        message: 'installStatus.offlineInstallMessage',
                        ok: 'ok'
                    });
                }
                installAppCtrl.isLoading = false;
            };
        }

        return {
            restrict: 'A',
            replace: true,
            scope: { app : '=', isLoading: '=', modal: '=modalObj', deviceStatus: '=' },
            templateUrl: 'app/catalog/installAppButtonTemplate.html',
            controller: controller,
            link: postLink,
            controllerAs: 'installAppCtrl',
            bindToController: true
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';

    module.constant('INSTALL_STATUS', {
        //Install status enum
        //name: backend enumeration, value: i10n key
        ACTIVATED : { name: 'ACTIVATED', value: 'installStatus.activated',
            action: 'appCenter.action.added', nativeAction: 'appCenter.action.installed' },
        NOT_ACTIVATED : { name: 'NOT_ACTIVATED', value: 'installStatus.notActivated',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.install' },
        REQUEST : { name: 'REQUEST', value: 'installStatus.request',
            action: 'appCenter.action.request', nativeAction: 'appCenter.action.request' },
        ACTIVATION_IN_PROGRESS : { name: 'ACTIVATION_IN_PROGRESS', value: 'installStatus.processing' },
        ACTIVATION_REQUESTED : { name: 'ACTIVATION_REQUESTED', value: 'installStatus.processing'},
        ACTIVATION_FAILED : { name: 'ACTIVATION_FAILED', value: 'installStatus.notActivated',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.install' },
        DEACTIVATION_REQUESTED : { name: 'DEACTIVATION_REQUESTED', value: 'installStatus.processing'},
        DEACTIVATION_IN_PROGRESS : { name: 'DEACTIVATION_IN_PROGRESS', value: 'installStatus.processing'},
        DEACTIVATION_FAILED : { name: 'DEACTIVATION_FAILED', value: 'installStatus.processing'},
        DEACTIVATED : { name: 'DEACTIVATED', value: 'installStatus.processing'},
        REINSTALL : { name: 'REINSTALL', value: 'installStatus.reinstall'},

        HIDDEN : { name: 'HIDDEN', value: 'installStatus.hidden',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.add' },
        UPDATE : { name: 'UPDATE', value: 'installStatus.update',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.update' },
        PROCESSING : { name: 'PROCESSING', value: 'installStatus.processing' },
        REDIRECT : { name: 'REDIRECT_FOR_ACTIVATE', value: 'installStatus.processing'},
        FAILED_COMPLIANCE_CHECK : { name: 'FAILED_COMPLIANCE_CHECK', value: 'installStatus.failedComplianceCheck'},
        ADAPTER_INSTALL_FAILED : { name: 'ADAPTER_INSTALL_FAILED', value: 'installStatus.installFailedMessage'},
        ACCEPT_EULA : { name: 'ACCEPT_EULA', value: 'termsOfUse'},
        EULA_ACCEPTED : { name: 'EULA_ACCEPTED'},
        REDIRECT_FOR_ENROLL : { name: 'REDIRECT_FOR_ENROLL', value: 'installStatus.notActivated'},
        VPP_ACCEPT : { name: 'VPP_ACCEPT', value: 'appCenter.vppInviteTitle'}
    });

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {
    'use strict';
    module.service('ThinappMultiDeviceActivationService', ['$http', 'RequestFactory', 'Resource', 'ConfigService',
        function($http, RequestFactory, Resource, ConfigService){

            this.getDeviceReqs = function (app) {
                var request = Resource(app['_links']['device-activation-requests']['href'] ,{ headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('thinappDeviceRequests');
            }
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
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


/*
branding directive - Create a <style> tag from a template

By default, Angular does not process bindings in <style> tags.  This directive creates
a new style tag, using the directive's own content after binding.  Any element nodes are
flattened, which allows for use of directives such as `ng-if` within the branding template.

*/

(function(module) {
    'use strict';
    module.directive('branding', [ '$timeout', function($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: postLink
        };

        function postLink (scope, element, attrs) {
            var style = $('<style>');

            // Make sure the branding element is not displayed, and append style tag
            element.css({display: 'none'})
                .append(style);

            // Define $branding in scope to refer to the branding object
            scope.$watch( attrs.branding, function (newValue) {
                scope.$branding = newValue;

                // Wait until next digest cycle for the new branding values to be bound to the content
                $timeout( function () {
                    style.text(''); // remove old style so it doesn't get re-inserted
                    // Flatten any element nodes resulting from the bindings or directives
                    // in the original HTML content, as they are not valid CSS.
                    // Then write the CSS into the style element.
                    style.text( element.text() );
                }, false);
            });
        }

    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('ChangePasswordController', ['ConfigService', '$scope', '$filter', '$notify', 'SettingsService', 'PasswordPolicyService', 'UtilService', 'UserAgent',
        function(ConfigService, $scope, $filter, $notify, SettingsService, PasswordPolicyService, UtilService, UserAgent) {
            var vm = this, regex;

            vm.showPasswordForm = false;
            vm.userInfo = SettingsService.getCurrentUser();
            vm.policies = PasswordPolicyService.getPasswordPolicy() || null;
            vm.errorMessage = "";

            function resetForm() {
                vm.currentPassword = "";
                vm.newPassword = "";
                vm.confirmNewPassword = "";
                vm.showErrors = false;
                vm.errorMessage = "";
            }

            function getPasswordPolicy() {
                showLoading();
                ConfigService.getPasswordPolicy().then(function (passwordPolicy) {
                    passwordPolicy.get().then(function (policies) {
                        hideLoading();
                        PasswordPolicyService.setPasswordPolicy(policies);
                        vm.policies = policies;
                        vm.showPasswordForm = true;
                        displayPasswordPolicy();
                    }, function () {
                        hideLoading();
                    });
                });
            }

            function displayPasswordPolicy() {
                var regexString = "", policyString = "", nextNode;
                vm.minLength = 0;
                if (vm.policies.minLen) {
                    nextNode = vm.policies.minLower || vm.policies.minUpper || vm.policies.minDigit || vm.policies.minSpecial;
                    policyString += $filter('i18n')('app.passwordPolicy.minLength', vm.policies.minLen) + (nextNode ? ",&nbsp;" + $filter('i18n')('app.passwordPolicy.leastIncludes') + "&nbsp;" : "");
                }
                if (vm.policies.minLower) {
                    nextNode = vm.policies.minUpper || vm.policies.minDigit || vm.policies.minSpecial;
                    policyString += $filter('i18n')('app.passwordPolicy.minLower', vm.policies.minLower) + (nextNode ? ",&nbsp;" : ".");
                    regexString += "(?=(.*[a-z]){" + vm.policies.minLower + "})";
                }
                if (vm.policies.minUpper) {
                    nextNode = vm.policies.minDigit || vm.policies.minSpecial;
                    policyString += (nextNode ? "" : $filter('i18n')('and') + "&nbsp;") + $filter('i18n')('app.passwordPolicy.minUpper', vm.policies.minUpper) + (nextNode ? ",&nbsp;" : ".");
                    regexString += "(?=(.*[A-Z]){" + vm.policies.minUpper + "})";
                }
                if (vm.policies.minDigit) {
                    nextNode = vm.policies.minSpecial;
                    policyString += (nextNode ? "" : $filter('i18n')('and') + "&nbsp;") + $filter('i18n')('app.passwordPolicy.minDigit', vm.policies.minDigit) + (nextNode ? "&nbsp;" : ".");
                    regexString += "(?=(.*[0-9]){" + vm.policies.minDigit + "})";
                }
                if (vm.policies.minSpecial) {
                    policyString += $filter('i18n')('and') + "&nbsp;" + $filter('i18n')('app.passwordPolicy.minSpecial', vm.policies.minSpecial) + ".";
                }
                if (vm.policies.minLen) {
                    if(vm.policies.minLower || vm.policies.minUpper || vm.policies.minDigit || vm.policies.minSpecial) {
                        regexString += "{" + vm.policies.minLen + ",}";
                    } else {
                        regexString += ".{"+ vm.policies.minLen +",}";
                    }
                }
                vm.policyString = policyString;
                regex = new RegExp(regexString);
            }

            function validateForm() {
                vm.showErrors = false;
                vm.errorMessage = "";
                if(vm.newPassword !== vm.confirmNewPassword) {
                    vm.errorMessage = $filter('i18n')('app.changePassword.error.passwordsNoMatch');
                    return;
                } else {
                    vm.errorMessage = "";
                }
                if(regex && !regex.test(vm.newPassword)) {
                    vm.errorMessage = $filter('i18n')('app.changePassword.error.requirementsNoMatch');
                    return;
                }
                return true;
            }

            function showLoading () {
                vm.isLoading = true;
            }

            function hideLoading () {
                vm.isLoading = false;
            }

            vm.closePasswordForm = function () {
                $scope.$modal.close && $scope.$modal.close(true);
                resetForm();
            };

            vm.changePasswordConfirm = function ($event) {
                showLoading();
                if($event){
                    $event.stopPropagation();
                }
                if(!validateForm()) {
                    hideLoading();
                    return;
                }
                var passwordChangeRequest = {}, challengesObj = {};
                passwordChangeRequest.newPassword = vm.newPassword;
                passwordChangeRequest.challenges = [];
                challengesObj.type = "CurrentPassword";
                challengesObj.response = vm.currentPassword;
                passwordChangeRequest.challenges.push(challengesObj);
                ConfigService.changePassword(passwordChangeRequest).then(function() {
                    hideLoading();
                    $notify.success('app.changePassword.success');
                    vm.closePasswordForm();
                }, function (response) {
                    hideLoading();
                    if(response.status === 400) {
                        vm.showErrors = true;
                        vm.errorMessages = response.data.errors;
                    }
                });
            };

            vm.togglePasswordForm = function () {
                if(vm.userInfo.localUser) {
                    if(vm.policies) {
                        vm.showPasswordForm = !vm.showPasswordForm;
                        displayPasswordPolicy();
                        resetForm();
                    } else {
                        getPasswordPolicy();
                    }
                } else {
                    vm.showPasswordForm = !vm.showPasswordForm;
                }
            };

            if(UserAgent.isMobile() && vm.policies && vm.userInfo.localUser) {
                displayPasswordPolicy();
            }
        }
    ]);
})(angular.module("com.vmware.greenbox.appCenter"));


// (c) 2016 VMware, Inc.  All rights reserved.
(function(module) {
    'use strict';
    var JADE_SCHEME = "awjade://";
    var HORIZON_SCHEME = 'vmwhorizon://';
    var V2_HANDLER = 'notify?action=';
    var AW_JADE_V2_BASE_URI = JADE_SCHEME+V2_HANDLER;
    var HORIZON_PREFIX = HORIZON_SCHEME+V2_HANDLER;
    
    module.constant('JadeV1Scheme', {
        ABOUT:JADE_SCHEME+"about",
        LOGOUT:JADE_SCHEME+"logout?code=0",
        SERVER_LOGOUT:JADE_SCHEME+"logout?code=2",
        APP_LAUNCH:JADE_SCHEME+"redirect?url="
    });
    
    module.constant('JadeV2Scheme', {
        JADE_SCHEME: JADE_SCHEME,
        ABOUT:AW_JADE_V2_BASE_URI+"ABOUT",
        LOGOUT_POPUP:AW_JADE_V2_BASE_URI+"LOGOUT&code=0",
        LOGOUT_NO_POPUP:AW_JADE_V2_BASE_URI+"LOGOUT&code=0&popup=none",
        SERVER_LOGOUT:AW_JADE_V2_BASE_URI+"LOGOUT&code=2",
        APP_LAUNCH:AW_JADE_V2_BASE_URI+"REDIRECT",
        MDM_ENROLL:AW_JADE_V2_BASE_URI+"MDM_ENROLL",
        CONTAINER_ENROLL:AW_JADE_V2_BASE_URI+"CONTAINER_ENROLL",
        MDM_UNENROLL:AW_JADE_V2_BASE_URI+"MDM_UNENROLL",
        OPEN_URL:AW_JADE_V2_BASE_URI+"OPEN",
        INSTALL_APP:AW_JADE_V2_BASE_URI+"INSTALL_APP"
    });
    
    module.constant('HorizonClientScheme', {
        SAAS_LAUNCH: HORIZON_PREFIX + "REDIRECT",
        VIEW_LAUNCH: HORIZON_PREFIX + "LAUNCH_HORIZON",
        XENAPP_LAUNCH: HORIZON_PREFIX + 'LAUNCH_XENAPP',
        ABOUT: HORIZON_PREFIX + "ABOUT",
        LOGOUT: HORIZON_PREFIX + "LOGOUT",
        LOGIN_DONE: HORIZON_PREFIX + "LOGIN_DONE",
        USERINFO: HORIZON_PREFIX + 'USER_INFO',
        GB_API: HORIZON_PREFIX + 'API'
    });
    
})(angular.module('com.vmware.greenbox.appCenter'));



"use strict";

/*
 * contextdialogDirective - Selectively set a context menu for an element, render the context menu at proper position
 * on right click and dismiss the context menu when click/right click event happens at other places.
 *
 * In a repeater, different context menu could be set for different type of model item.
 *
 * @restrict attribute
 *
 * Example:
 * <div contextdialog="{uris:{templateRef1:boolean expression1, templateRef2:boolean expression2} , scope:{app:app}}"
 * templateRef1="/SAAS/horizon/portal/launcher/desktop/launcherContextmenu.html"></div>
 *
 * uris object: templateRef1 specifies the templateUrl that will be shown as context menu.
 * scope object: contains the variables that we want to pass to context menu scope.
 */

(function(module) {
    'use strict';
    module.directive("contextdialog", ['$compile', '$timeout', '$rootScope', "$templateCache", "$http", "UserAgent", "$window" , function($compile, $timeout, $rootScope, $templateCache, $http, UserAgent, $window){
        /**
         * Private method to select context menu element.
         * Define here for not polluting the paradigm to define a directive.
         *
         * @param scope
         * @param attrs
         * @param uris Object that contains URIs of context menu elements.
         * @private
         */
        var templateLoaded = {};
        var closeMenu;
        var contextEvents;
        var _prepareContextdialog = function(scope, attrs, uris) {
            if (!uris) {
                return;
            }

            angular.forEach (uris, function(value, key) {
                if (value) {
                    //If the key is also an attribute in this element, its value templateUrl.
                    //We try the lowercase of the key because the key as an attribute might be lowercased by browser.
                    var templateUrl = attrs[key] || attrs[angular.lowercase(key)];
                    if (templateUrl) {
                        //Load the template for future use.
                        if (!$templateCache.get(templateUrl) && !templateLoaded[templateUrl]) { //Load it if it is not in cache.
                            templateLoaded[templateUrl] = true;
                            $http.get(templateUrl, {cache:$templateCache}).success(function(response) {
                            }).error(function() {
                                    templateLoaded[templateUrl] = false;
                                });
                        }
                        //Set context menu template id so that we can fetch it later from $templateCache.
                        attrs.$set("contextdialogTmplId", templateUrl);
                    }
                }
            });
        };
        /**
         * Check if the 2 events are triggered by the same action, e.g. Long press triggers long-hold event, and at the
         * same time may trigger click event.
         * The idea is if the event is a by-product of the other, they happen at the same position. 1 exception is iOS7
         * Safari, the positions have 1 or 2 pixels different.
         *
         * @param event1
         * @param event2
         * @return {Boolean}
         * @private
         */
        var _firedBySameAction = function(event1, event2) {
            if (!event1 || !event2) {
                return false;
            }
            return Math.abs(event1.pageX - event2.pageX) < 3 && Math.abs(event1.pageY == event2.pageY) < 3;
        };

        return {
            restrict : 'A',
            controller :
                function() {
                    // $templateCache.get returns a string if the template is defined
                    // from JS or HTML <script>, but it returns an array if it had to make
                    // an http request.  Our code assumes it always returns a string, so
                    // we patch it here to make it so.
                    var stockTCget = $templateCache.get;
                    $templateCache.get = function (cacheId) {
                        var got = stockTCget(cacheId);
                        return angular.isArray(got) ? got[1] : got;
                    };

                    //As $http sends async call, we do not know if a request for a template is sent yet.
                    //We use this hash to mark if the context menu template is being loaded.
                    closeMenu   = angular.noop;
                    var useTouch = Modernizr && Modernizr.touch;
                    contextEvents = 'contextmenu' + (useTouch ? ' hold' : '');

                },
            bindToController : true,
            link: function(scope, element, attrs) {
                var target = attrs.contextdialog;
                if (!target) {
                    return;
                }

                var contextdialogOptions = scope.$eval(target);

                //prepare context menu
                _prepareContextdialog(scope, attrs, contextdialogOptions.uris);

                scope.$watch('$location.path', function() { closeMenu(); });

                element.bind(contextEvents, function(contextmenuEvent) {
                    contextmenuEvent.preventDefault();
                    contextmenuEvent.stopPropagation();

                    scope.$apply(function() {
                        // Close any other context menu before opening a new one
                        // If no context menu is open,it will be a no-op.
                        closeMenu();

                        if (scope.sortableGrid) {
                            // TODO: break this coupling with sortableGrid
                            // Disable DnD while contextmenu is active
                            scope.sortableGrid.disabledByContextdialog = scope.sortableGrid.enabled;
                            scope.sortableGrid.enabled = false;
                        }

                        // If context menu is registered
                        if (attrs.contextdialogTmplId) {
                            // Show the context menu, show it at mouse click position.

                            var contextdialog;
                            // Look for a context menu already on this element
                            if (!attrs.contextdialogId) {
                                var contextdialogScope = scope.$new();
                                angular.extend(contextdialogScope, contextdialogOptions.scope);
                                contextdialog = $compile($templateCache.get(attrs.contextdialogTmplId))(contextdialogScope);
                                contextdialog.attr("id", "hzn" + new Date().getTime());

                                // Don't let clicks bubble up
                                contextdialog.on('click', function (e) {
                                    e.stopPropagation();
                                });

                                element.append(contextdialog);
                                attrs.$set("contextdialogId", "#" + contextdialog.attr("id"));
                            } else {
                                contextdialog = element.children(attrs.contextdialogId);
                            }

                            var delayTime = 0;
                            if(UserAgent.isMobile() && contextmenuEvent.originalEvent){
                                delayTime = 500;
                            }
                            angular.element($window).on('resize.contextmenu', function(){
                                calculateDirection(element, contextdialog);
                            });
                            // determine which corner of the element to place the menu at
                            $timeout(function () { //Need to run after current digesst cycle to find the right size of the menu
                                calculateDirection(element, contextdialog);
                            }, delayTime, false);

                            // Long hold ends when context menu appears.
                            $rootScope.isLongHold = false;

                            // Close the context menu when a click event happen at somewhere else.
                            closeMenu = function (event) {
                                //This code should always sit at the beginning.
                                if (event && (!event.data || !event.data.propagate)) {
                                    event.stopPropagation();
                                }

                                if (scope.sortableGrid) {
                                    // TODO: break this coupling with sortableGrid
                                    // Disable DnD while contextmenu is active
                                    scope.sortableGrid.enabled = scope.sortableGrid.disabledByContextdialog;
                                }


                                // Check if this event is a by-product of long press. The number of the by-product events can
                                // be 0, 1, or 2 on different browsers. The previous method works only if the number is 1.
                                // If it is 0, users have to tap twice to dismiss the context menu. If 2, context menu flashes.
                                if (_firedBySameAction(contextmenuEvent, event)) {
                                    return;
                                }

                                // Ignore the duplicated event. 2 events are fired for right click:
                                // contextmenu event and click event with event.button == 2(right button).
                                // It should be an angularjs bug on Firefox.
                                if (event && event.type == "click" && event.button == 2) {
                                    return;
                                }

                                // Unbind the handlers when closing contextdialog.
                                $(document).unbind('contextmenu', closeMenu);
                                $(document).unbind('click', closeMenu);
                                contextdialog.off('click', 'a, button', closeMenu);
                                angular.element($window).off('resize.contextmenu');

                                // If the contextdialog is in a box, unset the 'has-overflow'
                                // state.  This assumes that there isn't some other element
                                // overflowing the box (like a tooltip).  If we ever do need
                                // to have two elements overflowing simultaneously, we'll have
                                // to coordinate them.
                                contextdialog.closest('.box')
                                    .removeClass('has-overflow');

                                // Remove the context menu for mobile devices. So it will work perfectly cross-browser and
                                // cross-devices.
                                contextdialog.removeClass("ng-show").addClass('ng-hide');

                                closeMenu = angular.noop;
                            };

                        }
                    });
                });
            }
        };

        function calculateDirection (element, contextdialog) {
            var pane = element.closest('.pane, body'),
                paneCoords = pane.offset(),
                elementCoords = element.offset(),
                dialogWidth = contextdialog.outerWidth(),
                dialogHeight = contextdialog.outerHeight(),
                vert = 'south',
                horiz = '',
                dir;

            paneCoords.right = paneCoords.left + pane.outerWidth();
            paneCoords.bottom = paneCoords.top + pane.outerHeight();
            elementCoords.right = elementCoords.left + element.outerWidth();
            elementCoords.bottom = elementCoords.top + element.outerHeight();

            if( elementCoords.top + dialogHeight > paneCoords.bottom &&
                elementCoords.bottom - dialogHeight >= paneCoords.top ) {
                // we can't place the menu below, but we can place it above
                vert = 'north';
            }

            if (elementCoords.left + dialogWidth <= paneCoords.right) {
                // place it to the left if we can
                horiz = 'east';
            } else if (elementCoords.right - dialogWidth >= paneCoords.left) {
                // or to the right if we can
                horiz = 'west';
            }

            dir = vert + horiz + '-';

            contextdialog
                .removeClass('north- northeast- northwest- south- southeast- southwest-')
                .addClass('ng-show ' + dir)
                .removeClass('ng-hide invisible');

            // Clicking any button/link on the contextdialog should close it
            contextdialog.on('click', 'a, button', closeMenu);

            //jqlite doesn't allow to pass the event data so, using jquery for event binding.
            $(document).bind('contextmenu', closeMenu);
            $(document).bind('click', {propagate:true}, closeMenu);

            // By default, boxes hide overflow.  Since the contextdialog
            // is likely to overflow the box, set the 'has-overflow'
            // state on the box.
            contextdialog.closest('.box')
                .addClass('has-overflow');
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {

    'use strict';
    //Java script helper to get hold of device breakpoints used in CSS(page.less).
    module.constant('DEVICE_BREAKPOINT', {
        TABLET_POTRAIT: "720",
        TABLET_LANDSCAPE: "960",
        PHONE_PORTRAIT: 540,
        PHONE_LANDSCAPE: 720
    });

    module.service('DeviceBreakpointService', ['$window', 'DEVICE_BREAKPOINT', function($window, DEVICE_BREAKPOINT) {
        function currentDeviceWidth() {
            return ($window.innerWidth > 0) ? $window.innerWidth : screen.width;
        }
        this.maxPotraitTablet = function() {
            return currentDeviceWidth() < DEVICE_BREAKPOINT.TABLET_POTRAIT;
        };

        this.isPhone = function () {
            var isPhone = false;
            if(window.innerHeight > window.innerWidth){
                isPhone = window.innerWidth <  DEVICE_BREAKPOINT.PHONE_PORTRAIT
            } else{
                isPhone = window.innerWidth <  DEVICE_BREAKPOINT.PHONE_LANDSCAPE
            }
            return isPhone;
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {

    'use strict';

    module.controller('DevicesController', ['$scope', '$filter', 'ConfigService',
        function ($scope, $filter, ConfigService) {
            var vm = this;

            var Device = {};
            Device.OS_WINDOWS = "windows";
            Device.OS_MAC     = "mac";
            Device.OS_ANDROID = "android";
            Device.OS_IOS     = "ios";
            Device.OS_IPHONE  = "iphone";
            Device.OS_IPAD    = "ipad";

            vm.devices = [];

            vm.unlinkDevice = function(device, $event){
                var status = $filter('i18n')("app.devices.unlinkedDevice");
                ConfigService.unlinkDevice(device).then(function(){
                    $event.target.outerHTML = status;
                }, function(){
                    //TODO: error handling
                });
            };

            startLoading();
            ConfigService.getUserDevices().then(function(devices){
                vm.devices = [];
                if(devices) {
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].status === "ACTIVE") {
                            var iconName = "";
                            var osName = devices[i].osName.toLowerCase();
                            if (osName.indexOf(Device.OS_ANDROID) >= 0) {
                                iconName = "androidOS-icon.svg";
                            } else if ((osName.indexOf(Device.OS_IOS) >= 0) || (osName.indexOf(Device.OS_IPHONE) >= 0) || (osName.indexOf(Device.OS_IPAD) >= 0)) {
                                iconName = "iOS-icon.svg";
                            } else if (osName.indexOf(Device.OS_WINDOWS) >= 0) {
                                iconName = "winOS-icon.svg";
                            } else if (osName.indexOf(Device.OS_MAC) >= 0) {
                                iconName = "macOS-icon.svg";
                            }
                            devices[i].iconName = iconName;
                            vm.devices.push(devices[i]);
                        }
                    }
                }
                doneLoading();
            });

            function startLoading () {
                vm.isLoading = true;
            }

            function doneLoading () {
                vm.isLoading = false;
            }

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {

    'use strict';

    /*
    Filter Bar is responsible to render the filter bar and show current selected item in filter menu.
    Scope wise it resides below Filter menu. The reasoning for that is Filter menu should be a full screen
    page on mobile and a dropdown on desktop. To achieve full screen filter menu need to be placed at top of
    the hierarchy where it's parent can get hold of 100% height.
    */
    module.directive('filterBar', function ($rootScope) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            require: ['filterBar','^filterMenu'],
            link: postLink,
            controller: controller,
            controllerAs: '$filterBar',
            bindToController: true,
            scope: {selectedItem: '=', config: '=?filterBar', onFavorite: '&'},
            templateUrl: 'app/common/directives/filterBarTemplate.html'
        };

        function controller($scope) {
            var $filterBar = this;
            $filterBar.config = $filterBar.config || {};
        }

        function postLink(scope, element, attrs, controllers){
            var $filterBar = controllers[0];
            var $filter = controllers[1];

            scope.isClosed = $filter.config.closeFilterMenu;

            $rootScope.$broadcast('filterBarRendered', {
                isDesktop: $filterBar.config.isDesktop,
                element: $(element).find('.filterDropdown')
            });

            if ($filterBar.config.isDesktop) {
                $rootScope.$on('toggleFilterMenu', function(value) {
                    scope.isClosed = !scope.isClosed;
                });
            }

            $filterBar.toggle = function() {
                if ($filterBar.config.isDesktop) {
                    $filter.toggle();
                } else {
                    $filter.open();
                }
            };
            $filterBar.toggleFavorite = function() {
                $filterBar.config.isFavorited = !$filterBar.config.isFavorited;
                $filterBar.onFavorite();
            };
        }
    });

    /*
    Filter menu is responsible for appending the filter menu's template to appropriate element.
    Scope wise filter menu resides at top over filter bar. It is also responsible to open, close filter menu
    and invoke the callback when an item is selected.
    */
    module.directive('filterMenu', function ($templateRequest, $compile, $rootScope, DeviceBreakpointService) {
        return {
            restrict: 'A',
            scope: { config: '=filterMenu', onSelect: '&' },
            controller: controller,
            controllerAs: '$filter',
            bindToController: true,
            link: postLink
        };

        function controller($scope, $element, $timeout, $document, UserAgent) {
            var $filter = this;
            $filter.config.closeFilterMenu = true;
            $filter.config.mobileTemplateUrl = 'app/common/directives/filterMenuTemplate.html';
            $filter.config.desktopTemplateUrl = 'app/common/directives/desktopFilterMenuTemplate.html';

            $filter.open = function() {
                $filter.config.closeFilterMenu = false;
                $scope.$emit('toggleFilterMenu');
            };
            $filter.close = function() {
                $filter.config.closeFilterMenu = true;
                $scope.$emit('toggleFilterMenu');
            };
            $filter.toggle = function() {
                $filter.config.closeFilterMenu = !$filter.config.closeFilterMenu;
                $scope.$emit('toggleFilterMenu');
            };
            $filter.selectItem = function(item) {
                $filter.onSelect({item: item});
                $filter.close();
            };
            //Click away for filter dropdown
            $scope.$watch('$filter.config.closeFilterMenu', function(value){
                //Since we do not have dropdown on mobiles simply returning from the current function.
                if(DeviceBreakpointService.maxPotraitTablet()){
                    return;
                }
                if(!$filter.config.closeFilterMenu){
                    $timeout(function(){
                        if(UserAgent.isIOS()){
                            $document.bind('touchstart', closeDropdown);
                        }else{
                            $document.bind('click', closeDropdown);
                        }
                    });
                }else{
                    $timeout(function(){
                        if(UserAgent.isIOS()){
                            $document.unbind('touchstart', closeDropdown);
                        }else{
                            $document.unbind('click', closeDropdown);
                        }
                    });
                }
            });
            //Close dropdown
            var closeDropdown = function( event ) {
                /*If click/touchstart is from dropdown ignore it as we already call toggle which takes
                care of this case*/
                if($(event.target).is($filter.dropdownPanel)){
                    return;
                }
                //If click is dropdown menu itself ignore it
                if( event && $filter.dropdownPanel && $filter.dropdownPanel.find(event.target).length ) {
                    return;
                }
                //Clicked outside dropdown: close the dropdown
                $scope.$apply(function () {
                    $filter.config.closeFilterMenu = true;
                });
                $scope.$emit('toggleFilterMenu');
            };
        }

        function postLink(scope, element, attr, $filter) {
            var cleanUpFunc = $rootScope.$on('filterBarRendered', function(event, data) {
                if(data.isDesktop){
                    $filter.dropdownPanel = data.element;
                    buildFilterMenu($filter.config.desktopTemplateUrl, data.element, scope);
                    $('.desktopFilterMenuContainer').bind('click', function(cEvent) {
                        cEvent.stopPropagation();
                    });
                }else{
                    buildFilterMenu($filter.config.mobileTemplateUrl, element, scope);
                }
            });

            //Unregister events when out of scope
            scope.$on('$destroy', function() {
                cleanUpFunc();
            });

        }

        function buildFilterMenu (url, baseElement, scope) {
            $templateRequest(url)
                .then(function(html){
                    var template = angular.element(html);
                    baseElement.append( template );
                    $compile(template)(scope);
                })
                .catch( function(reason) {
                    console.error('Failed to load template: ' + url + ' [' + reason + ']');
                });
        }


    });

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    module.directive('hamburgerMenu', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/common/directives/hamburgerMenu.html',
            transclude: true
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
"user strict";

angular.module("com.vmware.greenbox.appCenter").directive("infiniteScroll", function () {

    return {
        scope: {
            onend: '&'
        },
        link:function (scope, element, attrs) {

            var scrollElm =element[0];
            scrollElm.onscroll = function onScrollEnd(){
                //Onscroll is outside the angular ctx hence need to wrap it within $apply
                var isEndOfScroll =  ((scrollElm.scrollHeight - scrollElm.scrollTop) <= scrollElm.clientHeight);
                if (isEndOfScroll) {
                    scope.$apply(function () {
                        //If user scrolls to the end, call the configured ctr method
                        if (isEndOfScroll) {
                            scope["onend"] && scope["onend"]();
                        }
                    });
                }

                // Call the function tied to the onscrolling attribute on directive definition
                // with the scroll position percentage as parameter
                if (attrs.onscrolling) {
                    scope[attrs.onscrolling](scrollElm.scrollTop / scrollElm.scrollHeight);
                }
            };



        }
    };
});

(function(module) {

    'use strict';
    module.directive('listView', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: { items: '=', selectItem: '&', defaultItem: '=' },
            controller: controller,
            controllerAs: '$listView',
            bindToController: true,
            templateUrl: 'app/common/directives/listView.html'
        };

        function controller() {
            var $listView = this;
            $listView.config = { selectedItem: $listView.defaultItem };
            $listView.selectLabel = function(label) {
                $listView.config.selectedItem = label;
                $listView.selectItem({item: label});
            }
        }
    });

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {

    'use strict';
    //Adds a class 'touch' when it is touch enabled device
    module.directive('noTouch', function (UserAgent) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if(!UserAgent.isMobile()){
                    element.addClass('notouch-');
                }
            }
        };
    });

})(angular.module('com.vmware.greenbox.appCenter'));
(function(module) {
    'use strict';
    module.directive('passwordVaultExtension', [
                            '$notify',
                            'PasswordVaultService',
                            function ($notify,
                                      PasswordVaultService) {
        return {
            restrict: 'A',
            scope: true,
            link: postLink
        };
        function postLink (scope, element, attrs) {
            scope.$on('evt-passwordvault-pingextension', function(event,appsPresent){
                if (appsPresent) {
                    PasswordVaultService.pingExtension().then(function (extentionDetected) {
                        if (!extentionDetected && PasswordVaultService.getPVExtensionDownloadUrl() != '') {
                            $notify.info('app.passwordVault.banner.msg', [], 'app/common/passwordVaultBanner.html');
                        }
                    });
                }
            });

        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderradius-boxshadow-multiplebgs-opacity-rgba-cssgradients-csstransforms-csstransforms3d-csstransitions-draganddrop-inlinesvg-svg-touch-cssclasses-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.7.1',

        Modernizr = {},

        enableClasses = true,

        docElement = document.documentElement,

        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,

        inputElem  ,


        toString = {}.toString,

        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



        omPrefixes = 'Webkit Moz O ms',

        cssomPrefixes = omPrefixes.split(' '),

        domPrefixes = omPrefixes.toLowerCase().split(' '),

        ns = {'svg': 'http://www.w3.org/2000/svg'},

        tests = {},
        inputs = {},
        attrs = {},

        classes = [],

        slice = classes.slice,

        featureName,


        injectElementWithStyles = function( rule, callback, nodes, testnames ) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if ( parseInt(nodes, 10) ) {
                while ( nodes-- ) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if ( !body ) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },



        isEventSupported = (function() {

            var TAGNAMES = {
                'select': 'input', 'change': 'input',
                'submit': 'form', 'reset': 'form',
                'error': 'img', 'load': 'img', 'abort': 'img'
            };

            function isEventSupported( eventName, element ) {

                element = element || document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;

                var isSupported = eventName in element;

                if ( !isSupported ) {
                    if ( !element.setAttribute ) {
                        element = document.createElement('div');
                    }
                    if ( element.setAttribute && element.removeAttribute ) {
                        element.setAttribute(eventName, '');
                        isSupported = is(element[eventName], 'function');

                        if ( !is(element[eventName], 'undefined') ) {
                            element[eventName] = undefined;
                        }
                        element.removeAttribute(eventName);
                    }
                }

                element = null;
                return isSupported;
            }
            return isEventSupported;
        })(),


        _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
        hasOwnProp = function (object, property) {
            return _hasOwnProperty.call(object, property);
        };
    }
    else {
        hasOwnProp = function (object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function(){};
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')){
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if(is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);

        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };



    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };


    tests['multiplebgs'] = function() {
        setCss('background:url(https://),url(https://),red url(https://)');

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };



    tests['opacity'] = function() {
        setCssAll('opacity:.55');

        return (/^0.55$/).test(mStyle.opacity);
    };

    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
            (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        if ( ret && 'webkitPerspective' in docElement.style ) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
            var style = document.getElementById('smodernizr'),
                sheet = style.sheet || style.styleSheet,
                cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

            bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



    Modernizr.addTest = function ( feature, test ) {
        if ( typeof feature == 'object' ) {
            for ( var key in feature ) {
                if ( hasOwnProp( feature, key ) ) {
                    Modernizr.addTest( key, feature[ key ] );
                }
            }
        } else {

            feature = feature.toLowerCase();

            if ( Modernizr[feature] !== undefined ) {
                return Modernizr;
            }

            test = typeof test == 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    Modernizr.prefixed      = function(prop, obj, elem){
        if(!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    };


    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

        (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};
;

(function(module) {
    'use strict';

    module.constant('PAGING', {
        PAGE_SIZE: "98" //console shows 7 rows so choose a number divisible by 7
    });

})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('PasswordVaultBannerController',
        ['$notify',
            'UserAgent',
            'PasswordVaultService',
            function($notify,
                     UserAgent,
                     PasswordVaultService){
                var vm = this;
                vm.storeInstallLink = PasswordVaultService.getPVExtensionDownloadUrl();

                vm.installPasswordVaultPlugin = function () {
                    $notify.close('app.passwordVault.banner.msg');
                    window.open(vm.storeInstallLink);
                }
            }]);
})(angular.module("com.vmware.greenbox.appCenter"));


'use strict';

angular.module('com.vmware.greenbox.appCenter').factory('RequestFactory', [function () {

    function RequestFactory(url, config) {
        var ng = angular;
        var request = {};

        if (config && ng.isObject(config)) {
            request = ng.extend(request, config);
        }

        request.url = request.url || url;
        request.method = request.method || "GET";

        return request;
    }

    return RequestFactory;
}]);

(function(module) {
    'use strict';

    module.directive('searchInput', ['UserAgent', function(UserAgent) {
        return {
            restrict: 'A',
            link: postLink,
            scope: { onSubmit : '&', control : '=' },
            controllerAs: '$searchInput',
            controller: controller,
            bindToController: true
        };

        function postLink (scope, element, attrs, $searchInput) {
            element.bind( 'keydown' , function( event ) {
                if ( event.keyCode === 13 ) {
                    scope.$apply( function() {
                        if(UserAgent.isMobile()){
                            //Removing focus of the element manually for iOS
                            element.blur();
                        }
                        $searchInput.onSubmit();
                    });
                }
            });
        }

        function controller ($timeout, $element) {
            var $searchInput = this;
            $searchInput.innerControl = $searchInput.control || {};

            $searchInput.innerControl.focus = function() {
                $timeout(function(){
                    $element.focus();
                });
            };

            $searchInput.innerControl.clearAndFocus = function() {
                $timeout(function(){
                    $element.val("").trigger('change');
                    $element.focus();
                });
            };
        }

    }]);

})(angular.module('com.vmware.greenbox.appCenter'));


'use strict';

/**
 * This is a utility service used to store and retrieve the client side data
 * persistently in the browser localStorage.
 *
 * In the case of localStorage is not supported, we will fall back to angular
 * cookie service.
 *
 */

angular.module('com.vmware.greenbox.appCenter').factory('hznLocalStorage', [ '$cookies', '$window',
    function ($cookies, $window) {
        var hznLocalStorage = {};
        var storage;
        var supported;
        try {
            storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
            supported = !(typeof storage === 'undefined');
            // Might be supported but still have "QUOTA_EXCEEDED_ERR" on Safari so do another test
            if (supported) {
                var test = 'test';
                storage.setItem(test, test);
                storage.removeItem(test);
            }
        } catch (e) {
            supported = false;
        }

        if (supported) {
            hznLocalStorage = storage;
        } else {
            hznLocalStorage = $cookies;
        }

        return hznLocalStorage;
    }]);
(function(module) {

    'use strict';

    module.service('BootstrapService', [
                        '$rootScope',
                        'Resource',
                        'UtilService',
                        'ConfigService',
                        'UserAgent',
                        'PasswordVaultService',
                        function(
                            $rootScope,
                            Resource,
                            UtilService,
                            ConfigService,
                            UserAgent,
                            PasswordVaultService) {

        var bootstrapService = this;
        var excludeThinAppsInLauncher = !UserAgent.isThinAppSupportedBrowser();
        var checkForPVapps = UserAgent.isPasswordVaultPluginSupportedBrowser();

        bootstrapService.getBootstrapInfo = function(excludeThinAppsInLauncher){
            var params = {};
            params.excludeThinAppsInLauncher = excludeThinAppsInLauncher;
            return ConfigService.getBootstrapUrl().then(function(bootstrapUrl){
                if (bootstrapUrl) {
                    return Resource(bootstrapUrl, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params}).get();
                }
                return;
            });
        };

        bootstrapService.init = function() {
            return bootstrapService.getBootstrapInfo(excludeThinAppsInLauncher).then(function(bootstrapData){
                if (bootstrapData && checkForPVapps) {
                    if (bootstrapData.passwordVaultRootResponse) {
                        var downloadUrl = UtilService.getObjValue(bootstrapData, 'passwordVaultRootResponse[body]["_links"]["hw-pwvault-extension"]["href"]', '');
                        PasswordVaultService.setPVExtensionDownloadUrl(downloadUrl);
                    }
                    PasswordVaultService.setHasPvApps((parseInt(bootstrapData.appInfo.pvapps.entitledCount) > 0));
                    $rootScope.$broadcast('evt-passwordvault-pingextension',(parseInt(bootstrapData.appInfo.pvapps.entitledCount) > 0));
                }
                return;
            });
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
(function(module) {
    'use strict';

	module.service('BrandingService', ['Resource', 'ConfigService', function(Resource, ConfigService){
        var brandingService = this;

        brandingService.getBranding = function () {
            return ConfigService.getBrandingUrl().then(function(url){
                return Resource(url, {
                    headers: {'Accept': 'application/vnd.vmware.catalog.branding-details.v1+json', 'method': 'GET'}
                }).get();
            });
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2016 VMware, Inc.  All rights reserved.
(function(module){
    'use strict';
    module.service('BrowserRuntimeService',[ 'UtilService', 'ConfigService', 'AppLauncherForDesktop', '$window', '$http', 'RequestFactory',
        function(UtilService,ConfigService,AppLauncherForDesktop,$window) {

            this.logout = function logout(apiLogoutUrl) {
                window.location.href = apiLogoutUrl;
            };

            this.about = function about(){
                location.hash = '#/about';
            };

            this.launchApp = function launchApp(app,$scope) {
                AppLauncherForDesktop.launch(app,$scope);
            };

            this.enroll = function enroll(mdmUrl){
                $window.location = mdmUrl;
            };
            
            this.openUrl = function(extUrl){
                window.open(extUrl);
            }
            
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
// (c) 2016 VMware, Inc.  All rights reserved.
(function(module){
    'use strict';
    module.service('ClientRuntimeFactory',[
                        'UserAgent',
                        'BrowserRuntimeService',
                        'JadeV2RuntimeService',
                        'HorizonClientRuntimeService',
                        function(UserAgent,
                                 BrowserRuntimeService,
                                 JadeV2RuntimeService,
                                 HorizonClientRuntimeService) {
            var clientRuntime = BrowserRuntimeService;

            if (UserAgent.isAWJadeV2()) {
                clientRuntime = JadeV2RuntimeService;
            } else if (UserAgent.isHorizon()) {
                clientRuntime =  HorizonClientRuntimeService;
            }
            return {
                get: function(){
                    return clientRuntime;
                }
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
// (c) 2016 VMware, Inc.  All rights reserved.

/**
 *  Base service that uses the appropriate runtime implementation
 *  e.g. Jadev1, Jadev2, HorizonClient and Browser
 *  This forces all the implementations to define the interfaces
 * 
 */

(function(module){
    // use strict' it depreciates arguments.callee
    module.service('ClientRuntimeService',[ 'ClientRuntimeFactory',
                                            function(ClientRuntimeFactory) {
            var _clientRuntime = ClientRuntimeFactory.get();

            this.logout = function logout() {
                _invokeImplementation('logout', arguments);
            };

            this.about = function about(){
                _invokeImplementation('about', arguments);
            };

            this.launchApp = function launchApp() {
                _invokeImplementation('launchApp',arguments);
            };

            this.enroll = function enroll(){
                _invokeImplementation('enroll',arguments);
            };

            this.unEnroll = function unEnroll() {
                _invokeImplementation('unEnroll',arguments);
            };

            this.register = function register() {
                _invokeImplementation('register',arguments);
            };

            this.openUrl = function openUrl() {
                _invokeImplementation('openUrl',arguments);
            };

            this.installApp = function installApp(){
                _invokeImplementation('installApp',arguments);
            };

            this.windowsInstallProgress = function windowsInstallProgress(){
                _invokeImplementation('windowsInstallProgress',arguments);
            };

            function _invokeImplementation(fnName,args) {
                if(_clientRuntime[fnName]){
                    _clientRuntime[fnName].apply(null,Array.prototype.slice.call(args));
                }
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));



(function(module) {
    'use strict';

    module.service('ConfigService', ['$http', '$q', 'RequestFactory', 'Resource', 'UtilService',
        function($http,$q, RequestFactory, Resource, UtilService){
        var baseUrl;

        var configService = this;

        var getLink = function(api) {
            return configService.getRootApiResource().get().thenGet('_links').thenGet(api).thenGet('href');
        };

        configService.doNotRefreshCache = false;
        configService.isReloading = false;

        configService.getAppCategories = function(){
            var urlPromise = configService.getAppCategoriesUrl();
            return urlPromise.then(function(url){
                var request = Resource(url ,{ headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('_embedded').thenGet('categoryResourceList');
            });
        };

        configService.getBaseUrl = function(){
            if(baseUrl) return baseUrl;
            if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                }
                return window.location.origin;
        };
        configService.getRootApiResource = function(){
            var apiResourceUrl = configService.getBaseUrl() + '/catalog-portal/services/api';
            return Resource(apiResourceUrl, { cache:true, headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
        };
        configService.getEntitlementsUrl = function(){
            return getLink('entitlements');
        };
        configService.getLauncherUrl = function(){
            return getLink('launcher');
        };
        configService.getAppCategoriesUrl = function(){
            return getLink('categories');
        };
        configService.getLauncherCategoriesUrl = function(){
            return getLink('launcherCategories');
        };
        configService.enrollmentSupported = function(){
            //Enrollment is supported if the current device is unmanaged.
            // Manged device has deviceUid in the URL
            return window.location.href.indexOf('deviceUdid') < 0;
        };
        configService.getEnrollmentUrl = function(){
            return getLink('enrollDevice');
        };
        configService.getBootstrapUrl = function(){
            return getLink('bootstrap');
        };
        configService.getUserInfoUrl = function(){
            return getLink('user');
        };
        configService.getBrandingUrl = function(){
            return getLink('branding').then(function(brandingUrl){
                //TODO: remove when we devMode support
                return brandingUrl+window.location.search;
            });
        };
        configService.getRefreshCacheUrl = function(){
            return getLink('refreshCache');
        };
        configService.getOtaUrl = function(){
            return getLink('ota');
        };
        configService.getNativeClientRedirectUrl = function(){
            return getLink('redirect');
        };

        configService.getUserDevicesUrl = function(){
            return getLink('user-devices');
        };
        configService.getEventsUrl = function(){
            return getLink('events');
        };

        configService.getLogoutUrl = function(){
            return getLink('logout');
        };

        configService.getPasswordVaultRootUrl = function(){
            return getLink('passwordVaultRoot');
        };

        configService.getUserDevices = function() {
            return getDevices (configService.getUserDevicesUrl());
        };

        function getDevices(urlPromise) {
            return urlPromise.then(function(url){
                var request = Resource(url ,{ headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('_embedded').thenGet('userDeviceResourceList');
            });
        }
        
        configService.unlinkDevice = function(device) {
            if(device && device._links['unlink']) {
                var req = RequestFactory(device._links['unlink'].href, {
                    method:'PUT',
                    headers:{
                        Accept: 'application/hal+json'
                    }
                });
                return $http(req);
            }
            return;
        };

        configService.refreshCache = function() {
            if (configService.doNotRefreshCache) {
                configService.doNotRefreshCache = false;
                return;
            }
            var urlPromise = configService.getRefreshCacheUrl();
            return urlPromise.then(function(url){
                var request = Resource(url ,{headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get();
            });
        };
        configService.getFeatureFlagsUrl = function() {
            return getLink('toggles');
        };
        configService.featureFlags = function() {
            var urlPromise = configService.getFeatureFlagsUrl();
            return urlPromise.then(function(url){
                var request = Resource(url ,{ cache:true, headers:{ 'Accept': 'application/hal+json', 'method':'GET' } });
                return request.get().thenGet('toggles');
            });
        };

        configService.isFeatureEnabled = function(feature) {
            var featureEnabled = false;
            return configService.featureFlags().then(function(features){
                var i;
                for(i=0; i < features.length; i++){
                    if(features[i].featureName === feature){
                        featureEnabled = features[i].enabled;
                    }
                }
                return featureEnabled;
            });
        };
        configService.getAdminConsoleUrl = function(){
            return getLink('adminConsole');
        };

        configService.getAdminConsoleTermsUrl = function(){
            return getLink('adminConsoleTerms');
        };
        
        configService.getDeviceRegistrationDetail = function(){
            return getLink('deviceRegistrationDetails').then(function (url) {
                return Resource(url.replace('{deviceId}', UtilService.getQueryParams().deviceUdid), {
                    headers: {
                        'Accept': 'application/vnd.vmware.catalog.devices-registration-details-v1-hal+json',
                        'method': 'GET'
                    }
                });
            });
        };

        configService.getDeviceUnRegistrationUrl = function(){
            return getLink('deviceUnregistration');
        };
        configService.getAuthUri = function(){
            return getLink('authUri').then(function(authUri) {
                var req = Resource(authUri, {headers: { method:'GET',Accept: 'application/hal+json' }});
                return req.get().then(function(res) {
                    return res.authUri;
                });
            });
        };

        configService.changePassword = function(requestBody){
            return getLink('changePassword').then(function (url) {
                var req = RequestFactory(url, {
                    method:'PUT',
                    headers:[{"Accept": "application/hal+json"},
                            {"Content-Type": "application/json"}],
                    data: requestBody
                });
                return $http(req);
            });
        };

        configService.getPasswordPolicy = function () {
            return getLink('passwordPolicy').then(function (url) {
                return Resource(url, {headers: {'Content-Type': 'application/vnd.vmware.horizon.manager.tenants.tenant.passwordpolicy+json', 'method': 'GET'}});
            });
        };

        configService.isContraFeatureFlagEnabled = function() {
            return UtilService.getObjValue(window, 'workspaceOne.featureFlags.CONTRA', false);
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';

    module.service('EventsService', ['Resource', 'ConfigService', function(Resource, ConfigService){
        var eventsService = this;

        eventsService.getEvents = function () {
            return ConfigService.getEventsUrl().then(function(url){
                return Resource(url, {
                    headers: {'Accept': 'application/hal+json', 'method': 'GET'}
                }).get();
            });
        };

        eventsService.addEvent = function (action, appId) {
            return ConfigService.getEventsUrl().then(function(url){
                return Resource(url, {
                    headers: {'Content-Type': 'application/hal+json', 'method': 'POST'}
                }).postResource('{"action": "' + action + '", "eventData": { "appId" : "' + appId + '"}}');
            });
        };


    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2016 VMware, Inc.  All rights reserved.
(function(module){
    'use strict';
    module.service('HorizonClientRuntimeService',[ 'UtilService', 'HorizonClientScheme', 'AppLauncherForHorizon',
        function( UtilService, HorizonClientScheme, AppLauncherForHorizon) {
            
            this.logout = function() {
                UtilService.openURIScheme(HorizonClientScheme.LOGOUT);
            };

            this.about = function() {
                UtilService.openURIScheme(HorizonClientScheme.ABOUT);
            };
            
            this.launchApp = function(app) {
                AppLauncherForHorizon.launch(app)    
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

/**
 * This service will handle most of the Horizon actions.
 */
(function(module) {
    'use strict';

    module.service('HorizonService', ['UtilService', 'HorizonClientScheme', 'ConfigService',
        function(UtilService, HorizonClientScheme, ConfigService) {
            var appCenterCtrl = null;

            this.init = function(ctrl) {
                /**
                 * Do horizon initialization, more action will be added here later.
                 * The action will include:
                 * 1. idle session time out
                 * 2. request for broker saml link
                 * 3. more...
                 */
                if (!ctrl) {
                    return;
                }

                appCenterCtrl = ctrl;
                // Init flags for horizon client
                appCenterCtrl.horizon = {
                    // Hide the user menu button
                    showUserInfo: false
                };

                UtilService.openURIScheme(HorizonClientScheme.LOGIN_DONE);
                // Send api links to client
                ConfigService.getRootApiResource().get().thenGet('_links').then(function(API) {
                    var key,
                        APIObj = {};

                    for (key in API) {
                        if (API.hasOwnProperty(key)) {
                            APIObj[key] = API[key].href;
                        }
                    }
                    UtilService.openURIScheme(UtilService.buildScheme(
                        HorizonClientScheme.GB_API, APIObj));
                });
            };

            this.sendUserInfo = function() {
                // Encode the user name because it is possibly non ASCII chars
                var user = appCenterCtrl.user,
                    userInfo = {
                        emailAddress: user.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName
                    };
                 UtilService.openURIScheme(UtilService.buildScheme(
                     HorizonClientScheme.USERINFO, userInfo));
            };

        }
    ]);

})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2016 VMware, Inc.  All rights reserved.

(function(module){
    'use strict';
    module.service('JadeV2RuntimeService',[ 
                        'LauncherService',
                        'UtilService',
                        'ConfigService',
                        'AppLauncherForJade',
                        'UserAgent', 
                        'JadeV2Scheme',
                        '$http',
                        'RequestFactory',
                        function( LauncherService, 
                                  UtilService,
                                  ConfigService,
                                  AppLauncherForJade, 
                                  UserAgent, 
                                  JadeV2Scheme,
                                  $http,
                                  RequestFactory){

            this.logout = function logout(apiLogoutUrl) {
                var logoutRequest = RequestFactory(apiLogoutUrl, {method: 'GET', params: {}});
                $http(logoutRequest).then(function(){
                    if (UserAgent.isNativeAppVersionIsEqualOrBelow("2.0")){
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_POPUP);
                    } else {
                        UtilService.openURIScheme(JadeV2Scheme.LOGOUT_NO_POPUP);
                    }
                });
            };

            this.about = function about(){
                UtilService.openURIScheme(JadeV2Scheme.ABOUT);
            };

            this.launchApp = function launchApp(app,$scope) {
                app.launching = false;
                AppLauncherForJade.launchUrl(app,$scope).then(function(launchUrl){
                    if (launchUrl && launchUrl !== '') {
                        if (UserAgent.isWindows()) {
                            UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&uri=" + launchUrl);
                        } else {
                            UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&url=" + launchUrl);
                        }
                    }
                });
            };

             this.installApp = function installApp(redirectUrl) {
                 if (redirectUrl && redirectUrl !== '') {
                     if (UserAgent.isWindows()) {
                         UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&uri=" + redirectUrl);
                     } else {
                         UtilService.openURIScheme(JadeV2Scheme.APP_LAUNCH + "&url=" + encodeURIComponent(redirectUrl));
                     }
                 }
             };

            this.windowsInstallProgress = function (appId) {
                if(appId && UserAgent.isWindows()){
                    UtilService.openURIScheme(JadeV2Scheme.INSTALL_APP + "&appId=" + appId);
                }
            };

            this.enroll = function enroll(mdmUrl) {
                if(UserAgent.isWindows()){
                    UtilService.openURIScheme(JadeV2Scheme.MDM_ENROLL+'&uri='+mdmUrl);
                }else{
                    UtilService.openURIScheme(JadeV2Scheme.MDM_ENROLL+'&url='+encodeURIComponent(mdmUrl));
                }
            };

            this.unEnroll = function unEnroll(onlyLogout) {
                if(onlyLogout) {
                    logoutWithoutMdm();
                }else if(UtilService.getQueryParams().deviceUdid) {
                    ConfigService.getDeviceUnRegistrationUrl().then(function (url) {
                        var unEnrollRequest = RequestFactory(url.replace('{deviceId}', UtilService.getQueryParams().deviceUdid), {
                            method: 'DELETE',
                            params: {}
                        });
                        $http(unEnrollRequest).then(function () {
                            logoutWithoutMdm();
                        }, function() {
                            showRemoveAccountFailedMessage();
                        });
                    });
                }
            };

            function logoutWithoutMdm(){
                ConfigService.doNotRefreshCache = true;
                ConfigService.getLogoutUrl().then(function(logoutUrl){
                    var logoutRequest = RequestFactory(logoutUrl, {method: 'GET', params: {}});
                    $http(logoutRequest).then(function () {
                        UtilService.openURIScheme(JadeV2Scheme.MDM_UNENROLL);
                    }, function(){
                        showRemoveAccountFailedMessage();
                    });
                });
            };

            function showRemoveAccountFailedMessage() {
                ModalService.getCurrentModal().alert({
                    title: 'requestFailed',
                    message: 'error.failedToRemoveAccount',
                    ok: 'ok'
                })
            };

            this.register = function register() {
                UtilService.openURIScheme(JadeV2Scheme.CONTAINER_ENROLL);
            };

            this.openUrl = function openUrl(extUrl) {
                if(UserAgent.isWindows()){
                    UtilService.openURIScheme(JadeV2Scheme.OPEN_URL + "&uri=" + extUrl);
                } else {
                    UtilService.openURIScheme(JadeV2Scheme.OPEN_URL + "&url=" + encodeURIComponent(extUrl));
                }
            }

        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));


(function(module){
    'use strict';

    module.service('OfflineService',['$window', '$rootScope', function($window, $rootScope){
        var deviceOnline = $window.navigator.onLine || true;

        $window.addEventListener('online', function(){
            deviceOnline = true;
            $rootScope.$broadcast('deviceOnlineStatusChanged',deviceOnline);
        });

        $window.addEventListener('offline', function(){
            deviceOnline = false;
            $rootScope.$broadcast('deviceOnlineStatusChanged',deviceOnline);
        });

        this.isDeviceOnline = function(){
            return deviceOnline;
        };

    }]);

})(angular.module('com.vmware.greenbox.services.offlineService', []));
(function(module) {
    'use strict';

    module.service('PasswordPolicyService', [function(){
        var passwordPolicy;

        var setPasswordPolicy = function (policy) {
            passwordPolicy = policy;
        };

        var getPasswordPolicy = function () {
            return passwordPolicy;
        };

        return {
            setPasswordPolicy : setPasswordPolicy,
            getPasswordPolicy : getPasswordPolicy
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';

    module.service('PasswordVaultService', [
                        '$q',
                        '$timeout',
                        'Resource',
                        'ConfigService',
                        'SettingsService',
                        function(
                                $q,
                                $timeout,
                                Resource,
                                ConfigService,
                                SettingsService){
        var TIME_TO_WAIT = 2000; //wait time before pinging the extension and later on wait till the call back is executed.
        var pvService = this;

        pvService.extensionDetected = false;
        pvService.pvExtensionDownloadUrl = '';
        pvService.hasPvApps = false;

        pvService.setHasPvApps = function(hasPvApps) {
            pvService.hasPvApps = hasPvApps;
        };

        pvService.getHasPvApps = function() {
            return pvService.hasPvApps;
        };

        pvService.setPVExtensionDownloadUrl = function(downloadUrl) {
            pvService.pvExtensionDownloadUrl = downloadUrl;
        };

        pvService.getPVExtensionDownloadUrl = function() {
            return pvService.pvExtensionDownloadUrl
        };

        pvService.pingExtension = function () {
            var defer = $q.defer();
            if (pvService.getHasPvApps()) {
                ConfigService.getPasswordVaultRootUrl().then(function (pvRootUrl) {
                    if (pvRootUrl) {
                        var branding = SettingsService.getCurrentBranding();

                        // In Some Browsers like IE the CustomEvent is not available.
                        // This is a polyfill for that.
                        (function () {

                            if ( typeof window.CustomEvent === "function" ) return false;

                            function CustomEvent ( event, params ) {
                                params = params || { bubbles: false, cancelable: false, detail: undefined };
                                var evt = document.createEvent( 'CustomEvent' );
                                evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
                                return evt;
                            }

                            CustomEvent.prototype = window.Event.prototype;

                            window.CustomEvent = CustomEvent;
                        })();

                        var event = new CustomEvent('ping', {detail: {url: pvRootUrl, name: branding.pageTitle}});
                        event.callback = pingCallback;

                        var pvConduit = document.getElementById("PVConduit");
                        if (pvConduit && !pvService.extensionDetected) {
                            pvConduit.dispatchEvent(event);
                        }
                        $timeout(function () {
                            defer.resolve(pvService.extensionDetected);
                        }, TIME_TO_WAIT);
                    }
                });
            }
            return defer.promise;
        };

        function pingCallback(pvExtensionVersion, linkedWithCurrentvIDM) {
            // pvExtensionVersion - Password Vault Extension Version.
            // linkedWithCurrentvIDM - Boolean value to indicate if the extension is linked to current vIDM.
            // Currently we are not making use of these 2 callback parameters.
            pvService.extensionDetected = true;
        }
}]);

})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function (module) {
    'use strict';
//TODO: Make it a provider
    module.factory('Resource', ['$http', '$q', '$timeout','UtilService', function ($http, $q, $timeout, UtilService) {
        // short cuts
        var isArray = angular.isArray;
        var extend = angular.extend;
        var forEach = angular.forEach;
        var copy = angular.copy;

        function ResourceFactory(url, config) {

            // Offset from UTC in minutes.  Positive offsets are ahead of GMT.
            var timezoneOffset = -(new Date()).getTimezoneOffset();
            var mockPromise = function(context){
                if (context.mockData) {
                    var _this = context;
                    return $timeout(
                        function () {
                            return _this.mockData;
                        }, 0);
                }
            };

            var Resource = function (url, config) {
                Resource.prototype.self = url;
                Resource.prototype.config = extend({
                    transformRequest: function (data, getHeaders) {
                        if (UtilService.isFormData(data)) {
                            // If Content-Type added explicitly , browser will not add form-data boundary parameter.
                            // Keep Content-Type undefined so that browser will add automatically with form data boundary.
                            getHeaders()['Content-Type'] = undefined;
                            return data;
                        } else {
                            return angular.isObject(data) && !isFile(data) ? angular.toJson(data) : data;
                        }
                    }
                }, (config || {}));
                Resource.prototype.config.headers = extend({
                    'User-UTC-Offset': timezoneOffset
                }, (config && config.headers ? config.headers : {}));
            };

            //Instance method that performs HTTP GET on given URL
            Resource.prototype = {
                'mock': function (mockData) {
                    this.mockData = mockData;
                    return this;
                },

                'get': function () {
                    var deferred = $q.defer();
                    var getPromise = deferred.promise;
                    var thisResource = this; //The resource object itself
                    var getLink = function (resource, link) {
                        if (resource._links[link]) {
                            return resource._links[link].href;
                        } else {
                            return null;
                        }
                    };
                    var getDefaultParamsForLink = function (resource, link) {
                        if (resource._links[link].params) {
                            return copy(resource._links[link].params);
                        } else {
                            return {};
                        }
                    };
                    var extendedPromise = { // This allows to perform method chaining on promise object instead of passing pyramid of callbacks
                        'thenGetLink': function (link) {
                            var deferredInner = $q.defer();
                            var thenGetLinkPromise = extend(deferredInner.promise, extendedPromise);
                            // This points to promise object returned by get()
                            this.then(function (resource) {
                                deferredInner.resolve(getLink(resource, link));
                            });
                            return thenGetLinkPromise;
                        },
                        // This method will follow the link defined on top level resource
                        'thenFollowLink': function (link, mediaType, params, locale, optional) {
                            var deferredInner = $q.defer();
                            var thenFollowLinkPromise = extend(deferredInner.promise, extendedPromise);
                            // This points to promise object returned by get()
                            this.then(function (resource) {
                                var linkToFollow = getLink(resource, link);
                                // Do the get only if there is the link to follow was valid
                                if (linkToFollow) {
                                    // Get default params from link to follow
                                    var defaultParams = getDefaultParamsForLink(resource, link);
                                    // Use default params only when explicit params have not been specified
                                    var paramsToSend = params || defaultParams || {};
                                    var childRes = new Resource(
                                        linkToFollow, {
                                            'headers': {
                                                'Accept': mediaType
                                            },
                                            'params': UtilService.isEmpty(paramsToSend) ? null : paramsToSend
                                        }
                                    );
                                    if (locale) {
                                        childRes = new Resource(
                                            linkToFollow, {
                                                'headers': {
                                                    'Accept': mediaType,
                                                    'Accept-Language': locale
                                                },
                                                'params': UtilService.isEmpty(paramsToSend) ? null : paramsToSend
                                            });
                                    }

                                    optional && optional.contentType && (childRes.config.headers['Content-Type'] = optional.contentType);
                                    optional && optional.data && (childRes.data = optional.data);
                                    if(resource.mockData){
                                        childRes.mock(resource.mockData);
                                    }
                                    childRes.get().then(function (childResource) {
                                        deferredInner.resolve(childResource);
                                    });
                                }
                            });
                            return thenFollowLinkPromise;
                        },
                        //This method will fetch an attribute of top level resource
                        'thenGet': function (attr, defaultObject) {
                            var deferredInner = $q.defer();
                            var thenGetPromise = extend(deferredInner.promise, extendedPromise);
                            //this points to promise object returned by get
                            this.then(function (resource) {
                                if(resource === undefined || resource[attr] === undefined){
                                    deferredInner.resolve(defaultObject);
                                } else {
                                  deferredInner.resolve(resource[attr]);
                                }

                            });
                            return thenGetPromise;
                        },
                        // This method loads all the items of top level summary resource
                        // attr points to array of links
                        'thenGetAllItems': function (attr, mediaType) {
                            var deferredInner = $q.defer();
                            //this points to promise object returned by get
                            var _this = this;
                            this.thenGet('items').then(function (links) {
                                if (!angular.isArray(links)) {
                                    deferredInner.resolve([]);
                                    return;
                                }
                                var promises = [];
                                var childResources = [];
                                for (var i = 0; i < links.length; i++) {
                                    var childRes = new Resource(getLink(links[i], attr), {'headers': {'Accept': mediaType}})
                                    if(_this.mockData && isArray(_this.mockData) && _this.mockData.length === links.length){
                                        childRes.mock(_this.mockData[i]);
                                    }else if (_this.mockData){
                                        childRes.mock(_this.mockData);
                                    }
                                    promises.push(childRes.get());
                                    promises[i].then(function (childResource) {
                                        childResources.push(childResource);
                                    });
                                }
                                //Wait for all the get to finish before calling promise
                                $q.all(promises).then(function () {
                                    deferredInner.resolve(childResources);
                                });
                            });
                            return deferredInner.promise;
                        }
                    };

                    var successHandler = function (response) {
                        if (isArray(response)) {
                            thisResource.array = [];
                            deferred.resolve(extend(thisResource.array, response));

                        } else {
                            deferred.resolve(extend(thisResource, response));
                        }

                    }

                    var errorHandler = function (data, status, headers, config) {
                        debugger;
                        deferred.reject(data);
                    };

                    if (this.mockData) {
                        var _this = this;
                        $timeout(function () {
                            successHandler(_this.mockData)
                        }, 0);
                    }
                    else {
                        if (this.data) {
                            $http.post(ensureContext(this.self), this.data, this.config).success(successHandler);
                        } else {
                            $http.get(this.self, this.config).success(successHandler).error(errorHandler);
                        }
                    }

                    return extend(getPromise, extendedPromise);
                },

                //Instance method that looks for url property and creates a new resource out of it.
                //TODO: This would change once we redesign HATEOAS links in our REST resources
                'getResource': function (resourceId, config) {
                    var resourceUrls = this[resourceId + '_url'];
                    if (isArray(resourceUrls)) {
                        var resources = [];
                        forEach(resourceUrls, function (resourceUrl) {
                            resources.push(new Resource(resourceUrl, (config || {})));
                        });
                        return resources;
                    }
                    return new Resource(resourceUrls);
                },

                'postResource': function (data) {
                    return this.mockData ?  mockPromise(this) :  $http.post(this.self, data, this.config);
                },
                'deleteResource': function () {
                    return this.mockData ?  mockPromise(this) :  $http['delete'](this.self, this.config);
                },

                'putResource': function (data) {
                    return this.mockData ?  mockPromise(this) :  $http.put(this.self, data, this.config);
                },
                'patchResource': function (data) {
                    return this.mockData ?  mockPromise(this) :  $http.patch(this.self, data, this.config);
                }

            };
            return new Resource(url, config);
        }

        return ResourceFactory;
    }])
})(angular.module('com.vmware.workspace.services.rest', []));

// (c) 2014 VMware, Inc.  All rights reserved.

/*
 * Service that loads the root resource and caches the response within same user session
 */
(function(module) {
    'use strict';

     module.factory('RootResource', ['Resource', '$q', function (Resource, $q) {
         var rootResource = Resource('/jersey/manager/api', {
             cache:true,
             headers:{
                 Accept:'application/vnd.vmware.horizon.manager.root+json'
             }
         });

         var promise = rootResource.get();

         return {
             get:function () {
                 return promise;
             }
         }
     }]);
})(angular.module('com.vmware.workspace.services.rootResource', []));
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

(function(module) {
    'use strict';

    //Stops propagation of specified event.
    //Used to fix focus issue in iOS, where user has to touch 2 times to focus an input field on modal
    //Seems like angular touch issue
    //https://github.com/angular-ui/bootstrap/issues/2017

    module.directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    });

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';

    module.directive('windowHeightElement', ['$window', '$document', function($window, $document) {

        function setHeight(element) {
            var mobileMastheadHeight = 50, padding = 5;
            var browserWindowHeight = $window.innerHeight || $document.body.Height;
            var browserWindowWidth = $window.innerWidth || $document.body.Width;
            var smallPageWidth = 740;//Start of tablet/desktop layouts
            // Only apply these properties on mobileLayout where dropdown height need to be 100%
            if(browserWindowWidth < smallPageWidth) {
                element.css('max-height', browserWindowHeight - ( mobileMastheadHeight + padding ) + 'px');
                //Need this for iOS to support scrolling on modals
                element.css('-webkit-overflow-scrolling', 'touch');
                element.css('overflow', 'auto');
            }
        }

        function postLink(scope, element, attrs) {
            setHeight(element);
            angular.element($window).bind('resize', function(){
                setHeight(element);
            });
        }

        return {
            restrict : 'A',
            link: postLink
        };

    }]);

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {

    'use strict';

    var properties = ['name', 'appType', 'subType', 'installStatus', 'installMessage', 'rating', 'version', 'size', 'type', 'price' ];

    var appInstallEndpoint = '/catalog-portal/services/api/activate/';

	module.controller('DetailsController', [
                            '$scope',
                            'DetailsService',
                            '$routeParams',
                            '$timeout',
                            'CatalogService',
                            'INSTALL_STATUS',
                            '$filter',
                            '$sce',
                            'UserAgent',
                            'JadeV1Scheme',
                            'JadeV2Scheme',
        function ($scope,
                  DetailsService,
                  $routeParams,
                  $timeout,
                  CatalogService,
                  INSTALL_STATUS,
                  $filter,
                  $sce,
                  UserAgent,
                  JadeV1Scheme,
                  JadeV2Scheme) {
            var vm = this,
                appId = $routeParams.appId,
                originPage = $routeParams.originPage,
                resource = DetailsService.getAppDetailsResource(appId),
                webAppDetails = DetailsService.getAppDetails() || null,
                isMdmWebApp = false;

            if(webAppDetails) {
                isMdmWebApp = CatalogService.isMdmWebApp(webAppDetails.type, webAppDetails.subType);
            }

            if(webAppDetails && isMdmWebApp) {
                appDetails(webAppDetails);
            } else {
                startLoading();
                resource.get().then( function (data) {
                    appDetails(data);
                });
            }

            var viewDownloadLink = $filter('i18n')('viewDownloadUrl');
            if (UserAgent.isIOS()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlIOS');
            } else if (UserAgent.isAndroid()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlAndroid');
            }
            var xenreceiverDownloadLink = $filter('i18n')('citrixReceiverDownloadUrl');
            if (UserAgent.isAWJadeV2()) {
                if(UserAgent.isWindows()) {
                    viewDownloadLink = JadeV2Scheme.APP_LAUNCH + "&uri=" + viewDownloadLink;
                    xenreceiverDownloadLink = JadeV2Scheme.APP_LAUNCH + "&uri=" + xenreceiverDownloadLink;
                } else {
                    viewDownloadLink = JadeV2Scheme.APP_LAUNCH + "&url=" + viewDownloadLink;
                    xenreceiverDownloadLink = JadeV2Scheme.APP_LAUNCH + "&url=" + xenreceiverDownloadLink;
                }
            }


            if (UserAgent.isIE8OrLower()) {
                vm.xenAppTooltip = $filter('i18n')('app.details.xenapp.msg.IE8OrLower');
                vm.xenAppDeliveryGroupTooltip = $filter('i18n')('app.details.xenappsDeliveryGroup.requirement');
            } else {
                vm.xenAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.xenapp.requirement', "<a target='_blank' href='" + xenreceiverDownloadLink + "'>", "</a>"));
                vm.xenAppDeliveryGroupTooltip = $sce.trustAsHtml($filter('i18n')('app.details.xenappsDeliveryGroup.requirement', "<a target='_blank' href='" + xenreceiverDownloadLink + "'>", "</a>"));
            }
            vm.viewDesktopTooltip = $sce.trustAsHtml($filter('i18n')('app.details.viewDesktop.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.viewAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.viewapp.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.desktoneTooltip = $sce.trustAsHtml($filter('i18n')('app.details.desktoneDesktop.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.daasAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.desktoneApp.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));

            vm.appId = appId;
            vm.backAction = function () {
                location.hash = '#/'+ originPage;
            };

            vm.goToSlide = function(index) {
                $scope.$modal.open("app/details/zoomedImageCarousel.html",
                    {screenshots: vm.screenshots, modal: $scope.$modal, carouselIndex: index });
            };

            function appDetails(data) {
                if(isMdmWebApp && !data.installStatus) {
                    data.installStatus = INSTALL_STATUS["ACTIVATED"].name;
                    data.visible = true;
                }
                _.extend( vm, _.pick(data, properties));
                vm.descriptionHTML = data.description;
                vm.iconStyle = data._links.icon ? data._links.icon.href : 'none' ;
                vm.reviews = data.reviews || [];
                vm.categories = data.categories || [];
                vm.screenshots = data._links.screenshots || [];
                vm.mgmtRequired = data.mgmtRequired;
                vm.perDeviceActivationRequired = data.perDeviceActivationRequired;
                var appStatus = data.installStatus;
                if(appStatus === "" || appStatus === undefined ){
                    appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
                } else if (!data.visible) {
                    appStatus = 'HIDDEN';
                } else if ((data.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(data.installStatus) >= 0) || (data.subType === 'THINAPP' && data.perDeviceActivationRequired)) {
                    appStatus = 'REQUEST';
                }
                vm.installAction = CatalogService.getInstallStatusText(appStatus, data);
                vm.appNeedToActivated = data.installStatus === 'NOT_ACTIVATED' || data.installStatus === 'ACTIVATION_FAILED' || data.installStatus === 'UPDATE'
                    || (data.installStatus !== 'NOT_ACTIVATED' && !data.visible) || (data.subType === 'THINAPP' && data.perDeviceActivationRequired);
                vm.installUrl = appInstallEndpoint + appId;
                vm.backgroundImage =  '';

                if (data['_links']['icon'] != undefined) {
                    vm.backgroundImage =  'url(' + data['_links']['icon']['href'] + ')';
                }
                vm._links = data['_links'];
                vm.hasAppRequirements = data.subType === 'THINAPP' || data.subType === 'XENAPP' || data.subType === 'XENAPPDELIVERYGROUP' || data.subType === 'VIEWPOOL' || data.subType === 'VIEWAPP' || data.subType === 'DESKTONEDESKTOP' || data.subType === 'DESKTONEAPPLICATION' ;
                vm.showRequirement = vm.hasAppRequirements && !UserAgent.isHorizon();
                vm.appSubType = $filter('i18n')('app.details.label.type.'+data.subType);
                doneLoading();
            }


            function startLoading () {
                vm.isLoading = true;
            }

            function doneLoading () {
                vm.isLoading = false;
            }
            $scope.$on('open-modal-dialog', function(event, args) {
                var template = args.dialogtemplate;
                $scope.$modal.open(template, $scope, {params: args.dialogparams});
            });
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {
    'use strict';

    var appDetailsEndpoint = '/catalog-portal/services/api/apps/';

    module.service('DetailsService', ['Resource', 'ConfigService',
        function (Resource, ConfigService) {
            var service = this;
            var appDetails;

            service.getAppDetailsResource = function( appId ){
                var apiResourceUrl = ConfigService.getBaseUrl() + appDetailsEndpoint + appId;
                return Resource(apiResourceUrl, { headers: { Accept: 'application/hal+json' } });
            };

            service.setAppDetails = function(appDetails) {
                this.appDetails = appDetails;
            };
            service.getAppDetails = function() {
                return this.appDetails;
            };

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE في وضع الإصلاح مؤقتًا. يُمكنك تشغيل تطبيقاتك، ومع ذلك قد لا تعمل بعض الميزات.",
        "appCenter.device.unEnrollWarningMessage":"بمجرد إلغاء التسجيل، ستفقد إمكانية الوصول إلى بعض التطبيقات التي كان بإمكانك الدخول إليها في السابق. فهل ترغب في المتابعة؟",
        "appCenter.action.add":"إضافة",
        "userInfo.unenroll":"إلغاء التسجيل",
        "myapps.welcomeMsg": "مرحباً، {0}. فيما يلي التطبيقات الخاصة بك!",
        "api.updateApps": "قائمة التحديثات...",
        "installStatus.enrollDevice": "إستخدام ال {0} يتطلب تفعيل خدمات مساحة العمل لحماية بيانات الشركة",
        "installStatus.unenrolledDevice": "هذا التطبيق لم يعد متوفراً لديك. إضغط حسناً من أجل تحديث القائمة.",
        "changeOccurred": "قم بتغيير الحدث",
        "appCenter.auth.mdmError": "لا يمكن تحميل كافة التطبيقات في الوقت الحالي. قد يكون هناك خطأ في التكوين أو الشبكة أثناء الاتصال مع MDM",
        "appCenter.device.status.commError": "لقد أدى MDM في حدوث خطأ  ما أثناء استرداد التطبيقات للجهاز الخاص بك",
        "appCenter.device.status.deviceInputError": "هذا الجهاز غير صالح! الرجاء الإتصال في مسؤول تكنولوجيا المعلومات الخاص بك",
        "appCenter.device.mdmApps.notFoundError": "لم يجد MDM  أية تطبيقات تم تعيينها  إلى الجهاز الخاص بك",
        "appCenter.nav.browseBy": "تصفح حسب",
        "app.launchPassword.heading": "طلب كلمة المرور",
        "app.launchPassword.view.instruction": "نحن بحاجة إلى كلمة المرور الخاصة بك من أجل تسجيل الدخول إلى موراد windows {0}.",
        "app.launchPassword.label.userName": "المستخدم",
        "app.launchPassword.label.password": "كلمة المرور",
        "app.launchPassword.button.label.signin": "تسجيل الدخول",
        "appCenter" : "مركز التطبيق",
        "ok" : "حسنا",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/ تحميل",
        "horizonDesktopNotDetected": "يجب تثبيت برنامج VMware هوية مدير سطح المكتب على هذا الحاسوب لاجل فتح هذا التطبيق. <a target='_blank' href='{0}'> قم بتثبيت برنامج VMware هوية مدير سطح المكتب </a> إذا لم تقم بذلك فعلا.",
        "viewAppsTooltip":"يتطلب هذا التطبيق عرض استضافة {0} Horizon Client{1} 3.0 أو الأحدث ليتم تثبيته على جهاز الحاسوب الخاص بك.",
        "desktoneDesktopTooltip":"يتطلب سطح المكتب هذا وجود Horizon DaaS  {0} Horizon Client {1}ليتم تثبيته على جهاز الحاسوب الخاص بك.",
        "desktoneApplicationTooltip":"يتطلب تطبيق Horizon DaaS هذا وجود {0} Horizon Client{1} ليتم تثبيته على جهاز الحاسوب الخاص بك.",
        "xenAppsReceiverNotDetected": "يجب تثبيت Citrix للاستقبال على هذا الحاسوب لفتح هذا التطبيق. <a target='_blank' href='{0}'> تركيب Citrix للاستقبال </a> إذا لم تقم بذلك فعلا. ",
        "button.save" : "حفظ",
        "button.openHorizonView": "فتح  Horizon Client ",
        "myapps.launch.openApp": "فتح {0}",
        "button.openApp": "فتح التطبيق",
        "button.clear": "مسح",
        "button.close": "اغلاق",
        "myapps.launch.view.openWith": "الفتح مع",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "المتصفح",
        "myapps.launch.view.preferredClient.isDefault": "(الافتراضي)",
        "myapps.launch.view.selectPreferredLaunchClient": "اختر الطريقة التي ترغب بها تشغيل أجهزة الحاسوب المكتبية Horizon والتطبيقات",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "اختر التشغيل الافتراضي ...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "هذا يحدد سلوك التشغيل الافتراضي عند اختيار فتح View سطح المكتب من  الجهاز الخاص بك. في حالة اختيارView بشكل افتراضي، يجب عليك تثبيت Horizon Client.  <a target='_blank' href='{0}'> تثبيت  Horizon Client إذا لم تقم بذلك فعلا.",
        "myapps.launch.view.unknownClientType": "نوع العميل غير معروف لفتح  Horizon Client ",
        "myapps.launch.view.openWithView" : "فتح مع  Horizon Client",
        "myapps.launch.view.openWithBrowser" : "فتح مع متصفح",
        "myapps.launch.view.preferredClient.byBrowser.description": "عن طريق تحديد المستعرض، سيتم فتح طريقة العرض في نافذة متصفح جديدة.",
        "myapps.launch.view.preferredClient.byViewClient.description": "هذا العنصر يتطلب Horizon Client 3.0 أو الأحدث. <a target='_blank' href='{0}'> تثبيت Horizon Client </a> إذا لم تقم بذلك فعلا.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "يمكنك دائماً تغيير هذا الإعداد في التفضيلات.",
        "myapps.launch.msg.launching.desktop":"بدء تشغيل سطح المكتب <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"بدء تشغيل التطبيق <b>{0}</b> .....",
        "myapps.noAppsMsg": "أنت لم تقم بإضافة أي تطبيقات. يمكنك الإنتقال إلى {0} لإضافة تطبيقات",
        "myapps.noFavAppsMsg": "ليس لديك أي تطبيقات مُفضلة",
        "myapps.dialog.openApp": "فتح",
        "myapps.dialog.openAppWithViewClient": "التشغيل في العميل",
        "myapps.dialog.openAppWithBrowser": "التشغيل في المتصفح",
        "deviceStatus.networkLost" : "لقد فقدت الاتصال بالشبكة",
        "deviceStatus.networkRestored" : "استعادة الإتصال بالشبكة",
        "api.session.expired.retry":"انتهت صلاحية الجلسة، في محاولة لتجديد...",
        "api.error":"حدث خطأ ما، أعد المحاولة",
        "api.timeout":"انقضت مهلة الاتصال، أعد المحاولة",
        "favoriteStatus.favorite" : "الرّوابط المفضّلة",
        "favoriteStatus.unfavorite" : "إزالة من المفضلة",
        "favoriteStatus.offlineFavoriteMessage": "إعادة تعيين سطح مكتب غير متوفر أثناء التواجد دون اتصال، الرجاء إعادة الاتصال والمحاولة مرة أخرى",
        "error.failToFavoriteApp": "فشل لتحديث حالة المفضلة لديك",
        "error.failToHideApp": "فشل في إزالة التطبيق",
        "error.failToShowApp": "فشل في إضافة التطبيق إلى المشغل",
        "installStatus.offlineInstallMessage": "طلبات التثبيت غير متوفرة أثناء التواجد دون اتصال، الرجاء إعادة الاتصال والمحاولة مرة أخرى",
        "installStatus.activated": "مُفعل",
        "installStatus.notActivated": "لم يتم التنشيط",
        "installStatus.request": "طلب",
        "installStatus.update": "تحديث",
        "installStatus.processing": "معالجة",
        "installStatus.installFailedMessage": "الرجاء إعادة المحاولة ثم قم بالاتصال بالمسؤول الخاص بك إذا استمرت هذه المشكلة",
        "requestFailed": "فشل الطلب",
        "requestSuccessful": "نجاح الطلب",
        "accept": "قبول",
        "decline": "رفض",
        "termsOfUse": "شروط الاستخدام",
        "beforeInstallation": "قبل التثبيت",
        "resetDesktopStatus.offlineMessage": "إعادة تعيين سطح المكتب غير متوفر أثناء التواجد دون اتصال، الرجاء إعادة الاتصال والمحاولة مرة أخرى",
        "error.failToResetDesktop": "فشل في إعادة تعيين سطح المكتب",
        "resetDesktop.sucess": "نجاح  إعادة تعيين سطح المكتب ",
        "appCenter.someAppsMissingMessage": "تعذر تحميل كافة التطبيقات في الوقت الحالي",
        "appCenter.device.status.notRegistered": "الجهاز غير مسجل",
        "appCenter.device.status.blackListed": "هذا الجهاز مدرج في القائمة السوداء",
        "appCenter.device.status.unknownError": "حدث خطأ غير معروف",
        "appCenter.device.register": "تسجيل الجهاز",
        "appCenter.device.moreDetails":"مزيد من التفاصيل",
        "appCenter.noAppsMsg": "لا توجد تطبيقات متوفرة حاليا",
        "appCenter.noSearchResults": "لم يتم العثور على نتائج",
        "appCenter.vppInviteTitle": "تسجيل التوزيع المدار",
        "appCenter.appInstallConfirmPromptTitle": "تأكيد التثبيت",
        "appCenter.acceptInvite": "قبول دعوة",
        "appCenter.install": "تثبيت",
        "appCenter.proceed": "المضي قدما",
        "appCenter.cancel": "إلغاء",
        "appCenter.searchApps": "البحث عن تطبيقات",
        "appCenter.welcomeMsg": "تثبيت تطبيقات جديدة في أي مكان، على أي جهاز!",
        "appCenter.done": "تم",
        "appCenter.nav.privacyPage": "صفحة خاصة",
        "appCenter.nav.catalog": "الكتالوج",
        "appCenter.nav.myApps": "تطبيقاتي",
        "appCenter.nav.favorites": "المفضلات",
        "appCenter.nav.categories": "الفئات",
        "appCenter.nav.filterby": "تصفية حسب",
        "appCenter.nav.show": "عرض",
        "appCenter.nav.settings": "الاعدادات",
        "appCenter.nav.sortBy": "فرز حسب",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "عامل التصفية",
        "appCenter.action.install": "تثبيت",
        "appCenter.action.installed": "مُثبّت",
        "appCenter.action.added": "أُضيف",
        "appCenter.action.processing": "معالجة",
        "appCenter.action.update": "تحديث",
        "appCenter.action.request": "طلب",
        "appCenter.type.web": "تطبيق ويب",
        "appCenter.type.native": "التطبيق الأصلي",
        "appCenter.type.native.platform": "{0} تطبيق",
        "appCenter.type.virtual": "تطبيق إفتراضي",
        "myapp.nav.categories": "الفئات",
        "myapp.nav.favorites": "المفضلات",
        "myapp.nav.allApps": "جميع تطبيقات",
        "myapp.label.new": "جديد",
        "myapp.nav.filterby": "تصفية حسب",
        "userInfo.adminConsole":"وحدة تحكم الإدارة",
        "userInfo.preferences":"التفضيلات",
        "userInfo.about":"حول",
        "userInfo.devices":"الاجهزة",
        "userInfo.signout":"تسجيل الخروج",
        "app.details.link.back": "العودة",
        "app.details.nav.details": "تفاصيل",
        "app.details.nav.reviews": "مراجعات",
        "app.details.label.description": "الوصف",
        "app.details.label.seeFullDetails": "إطلع على التفاصيل الكاملة ...",
        "app.details.label.information": "معلومات",
        "app.details.label.category": "الفئات",
        "app.details.label.version": "الاصدار",
        "app.details.label.type": "النوع:",
        "app.details.label.type.SAML11": "تطبيق ويب",
        "app.details.label.type.SAML20": "تطبيق ويب",
        "app.details.label.type.WEBAPPLINK": "تطبيق ويب",
        "app.details.label.type.WSFED12": "تطبيق ويب",
        "app.details.label.type.XENAPP": "تطبيق Xen",
        "app.details.label.type.XENAPPDELIVERYGROUP": "سطح المكتب Citrix",
        "app.details.label.type.THINAPP": "تطبيق رقيق",
        "app.details.label.type.VIEWPOOL": "عرض سطح المكتب",
        "app.details.label.type.VIEWAPP": "عرض التطبيق",
        "app.details.label.type.DESKTONEDESKTOP": "سطح المكتب Desktone ",
        "app.details.label.type.DESKTONEAPPLICATION": "تطبيق Desktone ",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "الحجم",
        "app.details.label.price": "السعر",
        "app.details.label.screenshots": "لقطات الشاشة",
        "app.details.label.requirement": "متطلب:",
        "app.details.label.packageName": "اسم الحزمة:",
        "app.details.thinapp.requirement": "هذا التطبيق يعمل فقط على جهاز كمبيوتر Windows مع هوية مدير سطح المكتب المثبتة.",
        "app.details.viewDesktop.requirement": "يتطلب هذا التطبيق عرض استضافة {0} Client Horizon {1} 3.0 أو الأحدث ليتم تثبيتها على جهاز الحاسوب الخاص بك.",
        "app.details.viewapp.requirement": "يتطلب هذا التطبيق عرض استضافة  {0} Horizon Client{1}  3.0 أو الأحدث  ليتم تثبيته على جهاز الحاسوب الخاص بك.",
        "app.details.xenapp.requirement": "يتطلب سطح المكتب هذا  وجود Citrix {0} Citrix Receiver {1} ليتم تثبيته.",
        "app.details.xenapp.msg.IE8OrLower":"يتطلب هذا التطبيق وجود Citrix Receiver ليتم تثبيته. ملاحظة: لا يمكن فتح هذا التطبيق في Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"يتطلب سطح المكتب هذا  وجود Citrix {0} Citrix Receiver {1} ليتم تثبيته.",
        "app.details.desktoneDesktop.requirement": "يتطلب سطح المكتب هذا وجود Horizon DaaS  {0} Horizon Client {1} ليتم تثبيته على جهاز الحاسوب الخاص بك.",
        "app.details.desktoneApp.requirement": "يتطلب تطبيق Horizon DaaS هذا وجود {0} Horizon Client{1} ليتم تثبيته على جهاز الحاسوب الخاص بك.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "لا تتوفر أية معلومات",
        "app.details.noScreenshots": "لا تتوفر لقطات الشاشة",
        "app.details.noDescription": "لا يوجد وصف متاح",
        "app.details.needsDeviceEnrollment": "يتطلب تسجيل الجهاز",
        "app.settings.label.settings": "الاعدادات",
        "app.settings.link.back": "العودة",
        "app.settings.managedDevices": "الأجهزة المدارة",
        "app.nav.tab.launcher":"المشغل",
        "app.nav.tab.catalog":"كاتالوج",
        "app.about.heading":"حول VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"سياسة الخصوصية",
        "app.about.button.label.patents":"براءة الإختراع",
        "app.about.button.label.licenseAgreement":"اتفاقية الترخيص",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/ar/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/ar/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/ar/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"الاجهزة",
        "app.devices.tableColumn.deviceName":"اسم الجهاز",
        "app.devices.tableColumn.userDeviceId":"معرف الجهاز",
        "app.devices.tableColumn.lastLoginTime":"آخر وقت تسجيل الدخول",
        "app.devices.unlinkDevice":"إلغاء الارتباط",
        "app.devices.unlinkedDevice": "غير مرتبط",
        "app.devices.emptyDeviceListTitle": "ليس لديك أي أجهزة كمبيوتر مرتبطة.",
        "app.devices.emptyDeviceListMessage": "لربط جهاز الحاسوب، يجب تثبيت وتسجيل هوية VMWare مدير سطح المكتب ل Windows.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"تثبيت",
        "app.banner.open":"فتح",
        "button.cancel":"إلغاء",
        "myapps.launch.passwordvault.installExtension.description":"يمكن لهذا التطبيق استغلال امتداد المستعرض  Password Vault. <a target='_blank' href='{0}'>قم بتثبيت الامتداد</a> إن لم تكن قد ثبته بالفعل.",
        "installMessage.continueInstall":"كنت تحاول من قبل تثبيت هذا التطبيق. ",
        "installMessage.proceedToInstall":"انقر فوق استمرار.",
        "appCenter.device.status.confError":"تعذّر على MDM العثور على أي معلومات عن جهازك",
        "appCenter.device.unEnrollWarningTitle":"تحذير",
        "appCenter.device.mdmUnEnrollMessage":"قم بإزالة جميع التطبيقات التي تستخدم Workspace ONE والبيانات من على هذا الجهاز.",
        "appCenter.device.disableWorkspaceMessage":"إزالة حسابك سوف تُلغي الدخول الممنوح لك عبر تطبيق Workspace ONE. ستظل التطبيقات التي أنزلتها على منصتك مُثبتة. هل ترغب في الاستمرار؟",
        "appCenter.internalApp.installationStepTitle":"لفتح هذا التطبيق، اتبع هذه الخطوات بعد التثبيت",
        "appCenter.internalApp.step1":"تشغيل الإعدادات من الشاشة الرئيسية لهاتفك iPhone.",
        "appCenter.internalApp.step2":"اضغط على \"معلومات عامة\"",
        "appCenter.internalApp.step3":"اضغط على \"الملف الشخصي\" وإدارة الجهاز",
        "appCenter.internalApp.step4":"اضغط على اسم مطور التطبيق الموجود تحت Enterprise App",
        "appCenter.internalApp.step5":"تحقق من التطبيق أو اعطه الثقة",
        "appCenter.internalApp.watchTutorial":"شاهد البرنامج التعليمي خطوة بخطوة",
        "userInfo.removeAccount":"احذف الحساب",
        "userInfo.account":"الحساب",
        "userInfo.password":"كلمة المرور",
        "app.changePassword.title":"تغيير كلمة المرور",
        "app.changePassword.enterCurrentPassword":"أدخل كلمة المرور الحالية",
        "app.changePassword.enterNewPassword":"أدخل كلمة المرور الجديدة",
        "app.changePassword.confirmNewPassword":"أكد كلمة المرور الجديدة",
        "app.changePassword.error.passwordsNoMatch":"كلمات المرور الجديدة غير متطابقة.",
        "app.changePassword.success":"تم حفظ كلمة المرور الجديدة!",
        "app.changePassword.label.email":"البريد الإلكتروني",
        "app.changePassword.label.phone":"هاتف",
        "app.logout.confirm.msg":"سوف يُرسل تسجيل الخروج من تطبيق Workspace ONE في نهاية دورتك الحالية. ستظل أية تطبيقات تم تحميلها من الكتالوج على الجهاز، ولكن لن تكون هناك تطبيقات جديدة متاحة حتى تقوم بتسجيل الدخول مرة أخرى.",
        "app.logout.title":"تحذير",
        "app.passwordVault.banner.msg":"لدينا تطبيقات يمكن أن تستغل امتداد المستعرض Password Vault.",
        "app.passwordVault.banner.button.install":"تثبيت",

        "app.thinappMultiDeviceAct.heading":"سيتم إضافة هذا التطبيق إلى الأجهزة المعتمدة. لاستخدام {0} على الأجهزة الإضافية، إبحث عن إسم الجهاز أدناه ثم انقر فوق زر الطلب.",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"اسم الجهاز",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"الحالة",
        "app.thinappMultiDeviceAct.button.request":"طلب",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"رفض",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"قيد الانتظار",
        "app.thinappMultiDeviceAct.activationState.activated":"موافق عليه",
        "app.thinappMultiDeviceAct.activationState.notActivated":"لم يتم التنشيط",
        "app.setAppPassword.heading":"تعيين كلمة المرور للتطبيق {0}",
        "app.setAppPassword.instruction":"استخدم النموذج أدناه لتعيين كلمة مرور لهذا التطبيق. أن تتكون كلمة المرور ثلاثة أحرف على الأقل في الطول.",
        "app.setAppPassword.label.password": "كلمة المرور",
        "app.setAppPassword.label.confirmPassword": "تأكيد كلمة المرور",
        "app.setAppPassword.label.generate": "إنشاء كلمة المرور",
        "app.setAppPassword.error.passwordsNoMatch": "عدم تطابق كلمة المرور.",
        "app.setAppPassword.msg.success": "تم تعيين كلمة مرور التطبيق الخاص بك بنجاح.",
        "app.setAppPassword.msg.fail": "حدث خطأ ما أثناء محاولة إعادة تعيين كلمة المرور الخاصة بك. الرجاء المحاولة مرة أخرى."


    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE se dočasně nachází v režimu údržby. Aplikace lze spustit, ale některé části nemusí být funkční. ",
        "appCenter.device.unEnrollWarningMessage":"Pokud se odregistrujete, ztratíte přístup k několika aplikacím. Přejete si pokračovat?",
        "appCenter.action.add":"Přidat",
        "userInfo.unenroll":"Odregistrovat",
        "myapps.welcomeMsg": "Dobrý den {0}, tady máte své aplikace!",
        "api.updateApps": "Aktualizuji seznam...",
        "installStatus.enrollDevice": "Chcete-li použít {0}, je třeba aktivovat služby Workspace za účelem ochrany podnikových dat. ",
        "installStatus.unenrolledDevice": "Aplikace vám již není k dispozici. Stiskněte OK, čímž se seznam zaktualizuje.",
        "changeOccurred": "Došlo ke změně.",
        "appCenter.auth.mdmError": "Nepodařilo se nahrát aplikace. V rámci komunikace s MDM došlo buď k chybě v konfiguraci, nebo v síti.",
        "appCenter.device.status.commError": "Během načítání aplikací pro vaše zařízení došlo k chybě v MDM.",
        "appCenter.device.status.deviceInputError": "Zařízení je neplatné. Prosím obraťte se na svého administrátora.",
        "appCenter.device.mdmApps.notFoundError": "MDM nenalezlo žádné aplikace přiřazené vašemu zařízení.",
        "appCenter.nav.browseBy": "Procházet dle",
        "app.launchPassword.heading": "Požadavek hesla",
        "app.launchPassword.view.instruction": "Na přihlášení do zdroje Windows {0} je třeba hesla.",
        "app.launchPassword.label.userName": "Uživatel",
        "app.launchPassword.label.password": "Heslo",
        "app.launchPassword.button.label.signin": "Přihlásit",
        "appCenter" : "Centrum aplikací",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/stáhnout",
        "horizonDesktopNotDetected": "Chcete-li otevřít aplikaci, na počítači musí být instalován VMware Identity Manager Desktop. <a target='_blank' href='{0}'>Instalujte VMware Identity Manager Desktop,</a> pokud jste tak již neučinili.",
        "viewAppsTooltip":"Aplikace hostovaná ve službě Horizon View požaduje, aby byla na počítači nainstalována verze {0} Horizon Client{1} 3.0 nebo vyšší.",
        "desktoneDesktopTooltip":"Desktop Horizon DaaS požaduje, abyste měli na počítači nainstalovanou službu {0} Horizon View {1}.",
        "desktoneApplicationTooltip":"Aplikace Horizon DaaS požaduje,  abyste měli na počítači nainstalovanou službu {0} Horizon View {1}.",
        "xenAppsReceiverNotDetected": "Chcete-li otevřít aplikaci, na počítači musí být instalován Citrix Receiver. <a target='_blank' href='{0}'>Instalujte VMware Citrix Receiver,</a> pokud jste tak již neučinili.",
        "button.save" : "Uložit",
        "button.openHorizonView": "Otevřít Horizon Client",
        "myapps.launch.openApp": "Open {0}",
        "button.openApp": "Otevřít aplikaci",
        "button.clear": "Vymazat",
        "button.close": "Zavřít",
        "myapps.launch.view.openWith": "Otevřít pomocí",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Prohlížeč",
        "myapps.launch.view.preferredClient.isDefault": "(výchozí nastavení)",
        "myapps.launch.view.selectPreferredLaunchClient": "Zvolte způsob spuštění desktopů a aplikací Horizon.",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "ZVOLTE VÝCHOZÍ SPUŠTĚNÍ",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Tímto se nastaví výchozí chování při spouštění, pokud zvolíte otevírání přes Zobrazení desktopu na zařízení. Jestliže vyberete Zobrazení jako své výchozí nastavení, je třeba mít nainstalován Horizon Client. <a target='_blank' href='{0}'>Instalujte Horizon Client</a>, pokud jste tak již neučinili.",
        "myapps.launch.view.unknownClientType": "Neznámý druh klienta pro otevírání Horizon Client.",
        "myapps.launch.view.openWithView" : "Otevřít pomocí Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Otevřít pomocí prohlížeče Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Volbou prohlížeče Browser se Zobrazení otevře v novém okně prohlížeče.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Položka vyžaduje verzi Horizon Client 3.0 nebo vyšší. <a target='_blank' href='{0}'>Instalujtee Horizon Client</a>, pokud jste tak již neučinili.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Nastavení lze kdykoli změnit v předvolbách.",
        "myapps.launch.msg.launching.desktop":"Spouštím desktop <b>{0}</b> ...",
        "myapps.launch.msg.launching.application":"Spouštím desktop <b>{0}</b> ...",
        "myapps.noAppsMsg": "Nepřidali jste žádné aplikace. Chcete-li přidat aplikace, přejděte na {0} .",
        "myapps.noFavAppsMsg": "Nepřidali jste žádné aplikace do položky Oblíbené.",
        "myapps.dialog.openApp": "OTEVŘÍT",
        "myapps.dialog.openAppWithViewClient": "Spustit ve službě Client",
        "myapps.dialog.openAppWithBrowser": "Spustit v prohlížeči",
        "deviceStatus.networkLost" : "Ztratili jste síťové připojení.",
        "deviceStatus.networkRestored" : "Síťové připojení bylo obnoveno.",
        "api.session.expired.retry":"Relace vypršela, zkoušíme ji obnovit.",
        "api.error":"Došlo k chybě. Zkuste znovu.",
        "api.timeout":"Připojení vypršelo. Zkuste znovu.",
        "favoriteStatus.favorite" : "Oblíbené",
        "favoriteStatus.unfavorite" : "Odebrat z oblíbených",
        "favoriteStatus.offlineFavoriteMessage": "Označit aplikaci jako oblíbenou není možné v režimu offline. Prosím připojte se a zkuste znovu.",
        "error.failToFavoriteApp": "Nepodařilo se aktualizovat stav položky Oblíbené.",
        "error.failToHideApp": "Nepodařilo se odstranit aplikaci.",
        "error.failToShowApp": "Nepodařilo se přidat aplikaci do spouštěče Launcher.",
        "installStatus.offlineInstallMessage": "Označování aplikace za oblíbenou není možné provádět v režimu offline. Prosím připojte se a zkuste znovu.",
        "installStatus.activated": "Aktivováno",
        "installStatus.notActivated": "Není aktivováno",
        "installStatus.request": "Požadavek",
        "installStatus.update": "Aktualizovat",
        "installStatus.processing": "Zpracovávám",
        "installStatus.installFailedMessage": "Prosím zkuste znovu. Pokud budou potíže přetrvávat, kontaktujte administrátora IT.",
        "requestFailed": "Požadavek se nezdařil.",
        "requestSuccessful": "Požadavek proběhl úspěšně.",
        "accept": "Přijmout",
        "decline": "Odmítnout",
        "termsOfUse": "Podmínky použití",
        "beforeInstallation": "Než nainstalujete",
        "resetDesktopStatus.offlineMessage": "Resetování desktopu není možné provádět v režimu offline. Prosím připojte se a zkuste znovu.",
        "error.failToResetDesktop": "Nepodařilo se resetovat desktop.",
        "resetDesktop.sucess": "Desktop byl úspěšně resetován.",
        "appCenter.someAppsMissingMessage": "Momentálně není možné načíst všechny aplikace.",
        "appCenter.device.status.notRegistered": "Zařízení není registrováno.",
        "appCenter.device.status.blackListed": "Zařízení je na blacklistu.",
        "appCenter.device.status.unknownError": "Došlo k neznámé chybě.",
        "appCenter.device.register": "Registrovat zařízení",
        "appCenter.device.moreDetails":"Více podrobností",
        "appCenter.noAppsMsg": "Momentálně nejsou k dispozici žádné aplikace.",
        "appCenter.noSearchResults": "Nebyly nalezeny žádné výsledky.",
        "appCenter.vppInviteTitle": "Spravovaná distribuce registrace",
        "appCenter.appInstallConfirmPromptTitle": "Potvrdit instalaci",
        "appCenter.acceptInvite": "Přijmout pozvánku",
        "appCenter.install": "Instalovat",
        "appCenter.proceed": "Pokračovat",
        "appCenter.cancel": "Zrušit",
        "appCenter.searchApps": "Hledat aplikace",
        "appCenter.welcomeMsg": "Instalujte nové aplikace kdekoli a na jakémkoli zařízení.",
        "appCenter.done": "Hotovo",
        "appCenter.nav.privacyPage": "Stránka Ochrana osobních údajů",
        "appCenter.nav.catalog": "Katalog",
        "appCenter.nav.myApps": "Moje aplikace",
        "appCenter.nav.favorites": "Oblíbené",
        "appCenter.nav.categories": "Kategorie",
        "appCenter.nav.filterby": "Druh filtrování",
        "appCenter.nav.show": "Ukázat",
        "appCenter.nav.settings": "Nastavení",
        "appCenter.nav.sortBy": "Druh třídění",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtr",
        "appCenter.action.install": "Instalovat",
        "appCenter.action.installed": "Nainstalováno",
        "appCenter.action.added": "Přidáno",
        "appCenter.action.processing": "Zpracovávám",
        "appCenter.action.update": "Aktualizovat",
        "appCenter.action.request": "Požadavek",
        "appCenter.type.web": "Webová aplikace",
        "appCenter.type.native": "Nativní aplikace",
        "appCenter.type.native.platform": "Aplikace {0} ",
        "appCenter.type.virtual": "Virtuální aplikace",
        "myapp.nav.categories": "Kategorie",
        "myapp.nav.favorites": "Oblíbené",
        "myapp.nav.allApps": "Všechny aplikace",
        "myapp.label.new": "Nové",
        "myapp.nav.filterby": "Druh filtrování",
        "userInfo.adminConsole":"Administrační konzola",
        "userInfo.preferences":"Preference",
        "userInfo.about":"O aplikaci",
        "userInfo.devices":"Zařízení",
        "userInfo.signout":"Odhlásit se",
        "app.details.link.back": "Zpět",
        "app.details.nav.details": "Podrobnosti",
        "app.details.nav.reviews": "Hodnocení",
        "app.details.label.description": "Popis",
        "app.details.label.seeFullDetails": "Zobrazit všechny podrobnosti",
        "app.details.label.information": "Informace",
        "app.details.label.category": "Kategorie",
        "app.details.label.version": "Verze",
        "app.details.label.type": "Druh:",
        "app.details.label.type.SAML11": "Webová aplikace",
        "app.details.label.type.SAML20": "Webová aplikace",
        "app.details.label.type.WEBAPPLINK": "Webová aplikace",
        "app.details.label.type.WSFED12": "Webová aplikace",
        "app.details.label.type.XENAPP": "Xen App",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix desktop",
        "app.details.label.type.THINAPP": "Thin App",
        "app.details.label.type.VIEWPOOL": "Zobrazit desktop",
        "app.details.label.type.VIEWAPP": "Zobrazit aplikaci",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Aplikace Desktone",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Velikost",
        "app.details.label.price": "Cena",
        "app.details.label.screenshots": "Snímky obrazovky",
        "app.details.label.requirement": "Požadavek:",
        "app.details.label.packageName": "Název balíčku:",
        "app.details.thinapp.requirement": "Aplikace je funkční pouze na počítači Windows s nainstalovaným správcem Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "Desktop Horizon DaaS požaduje na počítači službu {0} Horizon Client\ verze {1} 3.0 nebo vyšší.",
        "app.details.viewapp.requirement": "Aplikace hostovaná ve službě Horizon View požaduje, aby byla na počítači nainstalována verze {0} Horizon Client{1} 3.0 nebo vyšší.",
        "app.details.xenapp.requirement": "Aplikace vyžaduje nainstalovat přijímač {0} Citrix Receiver {1}.",
        "app.details.xenapp.msg.IE8OrLower":"Aplikace vyžaduje Citrix Receiver. Poznámka: aplikaci nelze otevřít v prohlížeči Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Desktop Citrix vyžaduje nainstalovaný přijímač {0} Citrix Receiver {1}.",
        "app.details.desktoneDesktop.requirement": "Desktop Horizon DaaS požaduje na počítači {0}Horizon Client {1}.",
        "app.details.desktoneApp.requirement": "Aplikace Horizon DaaS požaduje na počítači {0}Horizon Client {1}.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "K dispozici nejsou žádné informace.",
        "app.details.noScreenshots": "K dispozici nejsou žádné snímky obrazovky.",
        "app.details.noDescription": "Popis není k dispozici.",
        "app.details.needsDeviceEnrollment": "Požaduje registraci zařízení",
        "app.settings.label.settings": "Nastavení",
        "app.settings.link.back": "Zpět",
        "app.settings.managedDevices": "Spravovaná zařízení",
        "app.nav.tab.launcher":"Spouštěcí program LAUNCHER",
        "app.nav.tab.catalog":"KATALOG",
        "app.about.heading":"O platfromě VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Zásady ochrany dat",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Licenční dohoda",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/cz/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/cz/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/cz/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Zařízení",
        "app.devices.tableColumn.deviceName":"Název zařízení",
        "app.devices.tableColumn.userDeviceId":"ID zařízení",
        "app.devices.tableColumn.lastLoginTime":"Čas posledního přihlášení",
        "app.devices.unlinkDevice":"Zrušit propojení",
        "app.devices.unlinkedDevice": "Propojení bylo zrušeno.",
        "app.devices.emptyDeviceListTitle": "Nemáte žádné propojené počítače.",
        "app.devices.emptyDeviceListMessage": "Chcete-li propojit počítač, musíte instalovat a registrovat VMware Identity Manager Desktop pro Windows.",

		"app.thinappMultiDeviceAct.heading":"Aplikace bude přidána mezi schválená zařízení. Chcete-li použít \„{0}\“ na dalších zařízeních, níže vyhledejte název zařízení a klikněte na tlačítko Požadovat.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Název zařízení",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Stav",
        "app.thinappMultiDeviceAct.button.request":"Požadavek",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Zamítnuto",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"V procesu vyřizování",
        "app.thinappMultiDeviceAct.activationState.activated":"Schváleno",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Není aktivováno.",
        "app.setAppPassword.heading":"Aplikaci {0} nastavte heslo.",
        "app.setAppPassword.instruction":"V níže uvedeném formuláři nastavte heslo aplikace. Heslo musí obsahovat nejméně tři znaky. ",
        "app.setAppPassword.label.password": "Heslo",
        "app.setAppPassword.label.confirmPassword": "Povrdit heslo",
        "app.setAppPassword.label.generate": "Generovat heslo",
        "app.setAppPassword.error.passwordsNoMatch": "Hesla se neshodují.",
        "app.setAppPassword.msg.success": "Heslo aplikace bylo úspěšně nastaveno.",
        "app.setAppPassword.msg.fail": "Došlo k chybě během nastavování hesla. Prosím zkuste to znovu.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Instalovat",
        "app.banner.open":"Otevřít",
        "button.cancel":"Zrušit",
        "myapps.launch.passwordvault.installExtension.description":"Aplikace může využít nástroj správce hesla, který je rozšířením prohlížeče.  <a target='_blank' href='{0}'>Instalujte rozšíření</a> pokud jste tak již neučinili.",
        "installMessage.continueInstall":"Již jste se pokoušeli aplikaci instalovat. ",
        "installMessage.proceedToInstall":"Klikněte a pokračujte.",
        "appCenter.device.status.confError":"MDM se nepodařilo nalézt žádné informace o vašem zařízení. ",
        "appCenter.device.unEnrollWarningTitle":"Upozornění",
        "appCenter.device.mdmUnEnrollMessage":"Ze zařízení odstraňte všechny aplikace a data Workspace ONE.",
        "appCenter.device.disableWorkspaceMessage":"Odstraníte-li účet, bude zrušen přístup přes aplikaci Workspace ONE. Aplikace stažené do springboardu zůstanou nainstalované, ale přístup k nim může být omezen. Přejete si pokračovat?",
        "appCenter.internalApp.installationStepTitle":"Po instalaci následujte poskytnutý postup a aplikaci otevřete.",
        "appCenter.internalApp.step1":"Nastavení spusťte z domovské obrazovky zařízení iPhone.",
        "appCenter.internalApp.step2":"Poklepněte na Obecné.",
        "appCenter.internalApp.step3":"Poklepněte na Profil a Správu zařízení.",
        "appCenter.internalApp.step4":"Poklepněte na jméno vývojáře v nabídce firemních aplikací.",
        "appCenter.internalApp.step5":"Ověřte nebo důvěřujte aplikaci.",
        "appCenter.internalApp.watchTutorial":"Zhlédněte podrobný postup.",
        "userInfo.removeAccount":"Odstraňte účet.",
        "userInfo.account":"Účet",
        "userInfo.password":"Heslo",
        "app.changePassword.title":"Změnit heslo",
        "app.changePassword.enterCurrentPassword":"Zadejte současné heslo.",
        "app.changePassword.enterNewPassword":"Zadejte nové heslo.",
        "app.changePassword.confirmNewPassword":"Potvrďte nové heslo.",
        "app.changePassword.error.passwordsNoMatch":"Nová hesla se neshodují.",
        "app.changePassword.success":"Nové heslo bylo uloženo.",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Telefon",
        "app.logout.confirm.msg":"Odhlásíte-li se z Workspace ONE, relace bude ukončena. Aplikace stažené z katalogu zůstanou na zařízení, ale dostupné budou, až se znovu přihlásíte.",
        "app.logout.title":"Upozornění",
        "app.passwordVault.banner.msg":"Máte aplikace, které mohou využít správce hesel, jež je rozšířením prohlížeče.",
        "app.passwordVault.banner.button.install":"Instalovat"
});
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE er midlertidigt i vedligeholdelsestilstand. Du kan starte app, men visse features virker eventuelt ikke",
        "appCenter.device.unEnrollWarningMessage":"Ved at afmelde vil du miste adgang til apps som du er berettiget til. Ønsker du at fortsætte?",
        "appCenter.action.add":"Tilføj+",
        "userInfo.unenroll":"Afmeld",
        "myapps.welcomeMsg": "Hej {0}. Her er dine apps!",
        "api.updateApps": "Opdaterer liste...",
        "installStatus.enrollDevice": "Brug af {0} kræver aktivering af Workspace Services for beskyttelse af virksomhedsdata",
        "installStatus.unenrolledDevice": "Denne app er ikke længere tilgængelig for dig. Tryk OK for at opdatere liste.",
        "changeOccurred": "Der opstod en ændring",
        "appCenter.auth.mdmError": "Apps kunne ikke indlæses på nuværende tidspunkt. Der opstod enten en konfigurationsfejl eller en netværksfejl under kommunikation med MDM",
        "appCenter.device.status.commError": "Der opstod en fejl i MDM under hentning af apps til din enhed.",
        "appCenter.device.status.deviceInputError": "Denne enhed er ugyldig! Kontakt venligst din IT-administrator",
        "appCenter.device.mdmApps.notFoundError": "MDM kunne ikke finde apps tildelt til din enhed",
        "appCenter.nav.browseBy": "Browse efter",
        "app.launchPassword.heading": "Adgangskode anmodning",
        "app.launchPassword.view.instruction": "Vi skal bruge din adgangskode til at logge på denne Windows ressource {0}.",
        "app.launchPassword.label.userName": "Bruger",
        "app.launchPassword.label.password": "adgangskode",
        "app.launchPassword.button.label.signin": "Log på",
        "appCenter" : "Appcenter",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop skal være installeret på denne computer for at kunne åbne denne app. <a target='_blank' href='{0}'>Install VMware Identity Manager Desktop</a> hvis du ikke allerede har gjort det.",
        "viewAppsTooltip":"Denne View Hosted-app kræver {0} Horizon Client {1} 3.0 for at blive installeret på din computer.",
        "desktoneDesktopTooltip":"Denne Horizon DaaS-desktop kræver {0} Horizon View {1} for at blive installeret på din computer.",
        "desktoneApplicationTooltip":"Denne Horizon DaaS-app kræver {0} Horizon View {1} for at blive installeret på din computer.",
        "xenAppsReceiverNotDetected": "Citrix Receiver skal være installeret på denne computer for at kunne åbne denne app. <a target='_blank' href='{0}'>Installer Citrix Receiver</a>, hvis du ikke allerede har gjort det.",
        "button.save" : "Gem",
        "button.openHorizonView": "Åbn Horizon Client",
        "myapps.launch.openApp": "Åbn {0}",
        "button.openApp": "Åbn app",
        "button.clear": "Ryd",
        "button.close": "Luk",
        "myapps.launch.view.openWith": "Åbn med",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(standard)",
        "myapps.launch.view.selectPreferredLaunchClient": "Vælg, hvordan du vil starte Horizon-desktops og -apps",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "VÆLG EN STANDARDINDSTILLING FOR START...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Dette bestemmer standardfunktionsmåden for start, når du vælger at åbne en View-desktop fra din enhed. Hvis du vælger View som standardindstilling, skal du have Horizon Client installeret. <a target='_blank' href='{0}'>Installer Horizon Client</a>, hvis du ikke allerede har gjort det.",
        "myapps.launch.view.unknownClientType": "Ukendt klienttype til åbning af Horizon Client.",
        "myapps.launch.view.openWithView" : "Åbn med Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Åbn via browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Hvis du vælger Browser, åbnes din View i et nyt browservindue.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Dette element kræver Horizon Client 3.0 eller nyere. <a target='_blank' href='{0}'>Installer Horizon Client</a>, hvis du ikke allerede har gjort det.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Du kan altid ændre denne indstilling under Præferencer.",
        "myapps.launch.msg.launching.desktop":"Starter desktop <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Starter app <b>{0}</b> .....",
        "myapps.noAppsMsg": "Du har ikke tilføjet nogen apps. Du kan navigere til {0} for at tilføje apps",
        "myapps.noFavAppsMsg": "Du har ikke angivet nogen apps som favoritter",
        "myapps.dialog.openApp": "ÅBN",
        "myapps.dialog.openAppWithViewClient": "Start i Client",
        "myapps.dialog.openAppWithBrowser": "Start i browser",
        "deviceStatus.networkLost" : "Netværksforbindelsen blev afbrudt",
        "deviceStatus.networkRestored" : "Netværksforbindelsen er gendannet",
        "api.session.expired.retry":"Sessionen er udløbet. Prøver at gendanne...",
        "api.error":"Der opstod en fejl. Prøv igen",
        "api.timeout":"Der opstod timeout for forbindelsen. Prøv igen",
        "favoriteStatus.favorite" : "Favorit",
        "favoriteStatus.unfavorite" : "Fjern favorit",
        "favoriteStatus.offlineFavoriteMessage": "Du kan ikke angive en app som favorit i offlinetilstand. Genopret forbindelsen, og prøv igen",
        "error.failToFavoriteApp": "Status som favorit kunne ikke opdateres",
        "error.failToHideApp": "Appen kunne ikke fjernes",
        "error.failToShowApp": "Appen kunne ikke føjes til Launcher",
        "installStatus.offlineInstallMessage": "Der kan ikke udføres installationsanmodninger i offlinetilstand. Genopret forbindelsen, og prøv igen",
        "installStatus.activated": "Aktiveret",
        "installStatus.notActivated": "Ikke aktiveret",
        "installStatus.request": "Anmod",
        "installStatus.update": "Opdater",
        "installStatus.processing": "Behandler",
        "installStatus.installFailedMessage": "Prøv at kontakte din it-administrator igen, hvis problemet fortsætter",
        "requestFailed": "Anmodningen lykkedes ikke",
        "requestSuccessful": "Anmodning godkendt",
        "accept": "Accepter",
        "decline": "Afvis",
        "termsOfUse": "Vilkår for anvendelse",
        "beforeInstallation": "Før installationen",
        "resetDesktopStatus.offlineMessage": "Du kan ikke nulstille en desktop i offlinetilstand. Genopret forbindelsen, og prøv igen",
        "error.failToResetDesktop": "Nulstil desktop slog fejl",
        "resetDesktop.sucess": "Nulstilling af desktop gennemført",
        "appCenter.someAppsMissingMessage": "Alle apps kunne ikke indlæses på dette tidspunkt",
        "appCenter.device.status.notRegistered": "Enheden er ikke registreret",
        "appCenter.device.status.blackListed": "Denne enhed er sortlistet",
        "appCenter.device.status.unknownError": "Der opstod en ukendt fejl",
        "appCenter.device.register": "Registrer enhed",
        "appCenter.device.moreDetails":"Flere detaljer",
        "appCenter.noAppsMsg": "Der er i øjeblikket ingen tilgængelige apps",
        "appCenter.noSearchResults": "Ingen resultater fundet",
        "appCenter.vppInviteTitle": "Registrering af administreret distribution",
        "appCenter.appInstallConfirmPromptTitle": "Bekræft installation",
        "appCenter.acceptInvite": "Accepter invitation",
        "appCenter.install": "Installer",
        "appCenter.proceed": "Fortsæt",
        "appCenter.cancel": "Annuller",
        "appCenter.searchApps": "Søg i apps",
        "appCenter.welcomeMsg": "Installer nye apps overalt, på en hvilken som helst enhed!",
        "appCenter.done": "Udført",
        "appCenter.nav.privacyPage": "Side med personlige oplysninger",
        "appCenter.nav.catalog": "Katalog",
        "appCenter.nav.myApps": "Mine apps",
        "appCenter.nav.favorites": "Favoritter",
        "appCenter.nav.categories": "Kategorier",
        "appCenter.nav.filterby": "Filtrer efter",
        "appCenter.nav.show": "Vis",
        "appCenter.nav.settings": "Indstillinger",
        "appCenter.nav.sortBy": "Sorter efter",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filter",
        "appCenter.action.install": "Installer",
        "appCenter.action.installed": "Installeret",
        "appCenter.action.added": "Tilføjet",
        "appCenter.action.processing": "Behandler",
        "appCenter.action.update": "Opdater",
        "appCenter.action.request": "Anmod",
        "appCenter.type.web": "Web app",
        "appCenter.type.native": "Indbygget app",
        "appCenter.type.native.platform": "{0}-app",
        "appCenter.type.virtual": "Virtuel app",
        "myapp.nav.categories": "Kategorier",
        "myapp.nav.favorites": "Favoritter",
        "myapp.nav.allApps": "Alle apps",
        "myapp.label.new": "Ny",
        "myapp.nav.filterby": "Filtrer efter",
        "userInfo.adminConsole":"Admin konsol",
        "userInfo.preferences":"Præferencer",
        "userInfo.about":"Om",
        "userInfo.devices":"Enheder",
        "userInfo.signout":"Log af",
        "app.details.link.back": "Tilbage",
        "app.details.nav.details": "Detaljer",
        "app.details.nav.reviews": "Bedømmelser",
        "app.details.label.description": "Beskrivelse",
        "app.details.label.seeFullDetails": "Se alle detaljer...",
        "app.details.label.information": "Information",
        "app.details.label.category": "Kategorier",
        "app.details.label.version": "Version",
        "app.details.label.type": "Type:",
        "app.details.label.type.SAML11": "Web app",
        "app.details.label.type.SAML20": "Web app",
        "app.details.label.type.WEBAPPLINK": "Web app",
        "app.details.label.type.WSFED12": "Web app",
        "app.details.label.type.XENAPP": "XenApp",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "Vis desktop",
        "app.details.label.type.VIEWAPP": "Vis app",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone-desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone-app",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Størrelse",
        "app.details.label.price": "Pris",
        "app.details.label.screenshots": "Screenshots",
        "app.details.label.requirement": "Krav:",
        "app.details.label.packageName": "Pakkenavn:",
        "app.details.thinapp.requirement": "Denne app fungerer kun på en Windows computer med Identity Manager Desktop installeret.",
        "app.details.viewDesktop.requirement": "Denne View-desktop kræver {0} Horizon Client {1} 3.0 eller nyere for at blive installeret på din computer.",
        "app.details.viewapp.requirement": "Denne View Hosted-app kræver {0} Horizon Client {1} 3.0 eller nyere for at blive installeret på din computer.",
        "app.details.xenapp.requirement": "Denne app kræver {0} Citrix Receiver {1} for at blive installeret.",
        "app.details.xenapp.msg.IE8OrLower":"Denne app kræver Citrix Receiver for at blive installeret. Bemærk! Denne app kan ikke åbnes i Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Denne Citrix desktop påkræver {0} Citrix Receiver {1} for at blive installeret.",
        "app.details.desktoneDesktop.requirement": "Denne Horizon DaaS Desktop påkræver {0} Horizon Client {1} for at blive installeret på din computer.",
        "app.details.desktoneApp.requirement": "Denne Horizon Daas app påkræver {0} Horizon Client {1} for at blive installeret på din computer.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Ingen tilgængelige oplysninger",
        "app.details.noScreenshots": "Ingen tilgængelige skærmbilleder",
        "app.details.noDescription": "Ingen tilgængelige beskrivelser",
        "app.details.needsDeviceEnrollment": "Påkræver tilmelding af enhed",
        "app.settings.label.settings": "Indstillinger",
        "app.settings.link.back": "Tilbage",
        "app.settings.managedDevices": "Administrerede enheder",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"KATALOG",
        "app.about.heading":"Om VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Privatlivspolitik",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Licensaftale",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Enheder",
        "app.devices.tableColumn.deviceName":"Enhedsnavn",
        "app.devices.tableColumn.userDeviceId":"Enheds-id",
        "app.devices.tableColumn.lastLoginTime":"Seneste login tidspunkt",
        "app.devices.unlinkDevice":"Fjern link",
        "app.devices.unlinkedDevice": "Fjernet link",
        "app.devices.emptyDeviceListTitle": "Du har ingen linkede computere.",
        "app.devices.emptyDeviceListMessage": "For at linke en computer skal du installere og registrere VMware Identity Manager Desktop for Windows.",

		"app.thinappMultiDeviceAct.heading":"Denne app føjes til godkendte enheder. Hvis du vil anvende \"{0}\" på yderligere enheder, kan du søge efter navnet på enheden herunder og klikke på knappen Anmod.",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Enhedsnavn",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Anmod",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Afvist",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Afventer",
        "app.thinappMultiDeviceAct.activationState.activated":"Godkendt",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Ikke aktiveret",
        "app.setAppPassword.heading":"Indstil adgangskode for app {0}",
        "app.setAppPassword.instruction":"Anvend formularen herunder for at oprette en adgangskode for denne app. Adgangskode kan bestå af mindst 3 tegn.",
        "app.setAppPassword.label.password": "Adgangskode",
        "app.setAppPassword.label.confirmPassword": "Bekræft adgangskode",
        "app.setAppPassword.label.generate": "Generer adgangskode",
        "app.setAppPassword.error.passwordsNoMatch": "Adgangskoder matcher ikke.",
        "app.setAppPassword.msg.success": "Din adgangskode er blevet oprettet korrekt.",
        "app.setAppPassword.msg.fail": "Der opstod en fejl under instilling af din adgangskode. Prøv venligst igen.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installer",
        "app.banner.open":"Åbn",
        "button.cancel":"Annuller",
        "myapps.launch.passwordvault.installExtension.description":"Denne app kan anvende Password Vault browserudvidelsen. <a target='_blank' href='{0}'>Installer udvidelsen</a> hvis du ikke allerede har.   ",
        "installMessage.continueInstall":"Du har tidligere forsøgt at installere denne app. ",
        "installMessage.proceedToInstall":"Klik for at fortsætte.",
        "appCenter.device.status.confError":"MDM kunne ikke finde information for din enhed",
        "appCenter.device.unEnrollWarningTitle":"Advarsel",
        "appCenter.device.mdmUnEnrollMessage":"Fjern alle Workspace ONE apps og data fra denne enhed.",
        "appCenter.device.disableWorkspaceMessage":"Ved at fjerne din konto vil adgang via Workspace ONE appen blive tilbagekaldt. Apps downloadet til dit springbræt vil forblive installeret, men adgang kan blive afbrudt. Ønsker du at fortsætte?",
        "appCenter.internalApp.installationStepTitle":"For at kunne åbne denne app skal du følge disse trin efter installationen",
        "appCenter.internalApp.step1":"Start Indstillinger fra startskærmen på din iPhone ",
        "appCenter.internalApp.step2":"Tryk på Generelt",
        "appCenter.internalApp.step3":"Tryk på Profil og Enhedsstyring",
        "appCenter.internalApp.step4":"Tryk på app-udvikler navnet under Enterprise App",
        "appCenter.internalApp.step5":"Bekræft eller Hav Tillid til appen",
        "appCenter.internalApp.watchTutorial":"Se trin-for-trin tutorial",
        "userInfo.removeAccount":"Fjern konto",
        "userInfo.account":"Konto",
        "userInfo.password":"Adgangskode",
        "app.changePassword.title":"Skift adgangskode",
        "app.changePassword.enterCurrentPassword":"Indtast aktuel adgangskode",
        "app.changePassword.enterNewPassword":"Indtast ny adgangskode",
        "app.changePassword.confirmNewPassword":"Bekræft ny adgangskode",
        "app.changePassword.error.passwordsNoMatch":"Nye adgangskoder matcher ikke.",
        "app.changePassword.success":"Ny adgangskode gemt!",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Telefon",
        "app.logout.confirm.msg":"Ved at logge ud af Workspace ONE vil din aktuelle session blive afsluttet. Apps downloadet fra kataloget vil forblive på enheden, men ingen nye apps vil blive gjort tilgængelige før du logger på igen.",
        "app.logout.title":"ADVARSEL",
        "app.passwordVault.banner.msg":"Du har apps der kan anvende Password Vault browserudvidelsen.",
        "app.passwordVault.banner.button.install":"Installer"

    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE befindet sich vorübergehend im Wartungsmodus. Sie können Ihre Anwendungen starten; einige Funktionen funktionieren aber möglicherweise nicht.",
        "appCenter.device.unEnrollWarningMessage":"Durch Aufhebung der Registrierung werden Sie den Zugriff auf einige Anwendungen verlieren, die Ihnen zustehen. Möchten Sie fortfahren?",
        "appCenter.action.add":"Hinzufügen+",
        "userInfo.unenroll":"Registrierung aufheben",

        "myapps.welcomeMsg": "Hallo {0}! Hier sind Ihre Anwendungen.",
        "api.updateApps": "Liste wird aktualisiert ...",
        "installStatus.enrollDevice": "Die Nutzung von {0} erfordert die Aktivierung von Workspace-Diensten, um Firmendaten zu schützen",
        "installStatus.unenrolledDevice": "Diese Anwendung steht nicht mehr zur Verfügung. Bitte OK drücken, um Liste zu aktualisieren.",
        "changeOccurred": "Änderung aufgetreten",
        "appCenter.auth.mdmError": "Nicht alle Anwendungen konnten diesmal geladen werden. Bei der Kommunikation mit MDM trat entweder ein Konfigurations- oder ein Netzwerkfehler auf",
        "appCenter.device.status.commError": "MDM verursachte einen Fehler beim Abruf der Anwendungen von Ihrem Gerät",
        "appCenter.device.status.deviceInputError": "Gerät unzulässig. Wenden Sie sich bitte an Ihren IT-Administrator",
        "appCenter.device.mdmApps.notFoundError": "MDM konnte keine Ihrem Gerät zugewiesenen Anwendungen finden",
        "appCenter.nav.browseBy": "Browsen nach",
        "app.launchPassword.heading": "Kennwortanforderung",
        "app.launchPassword.view.instruction": "Ihr Kennwort wird zur Anmeldung bei dieser Windows-Ressource {0} benötigt.",
        "app.launchPassword.label.userName": "Benutzer",
        "app.launchPassword.label.password": "Kennwort",
        "app.launchPassword.button.label.signin": "Anmelden",
        "appCenter" : "Anwendungszentrum",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop muss zur Öffnung dieser Anwendung auf diesem Computer installiert sein. <a target='_blank' href='{0}'>VMware Identity Manager Desktop installieren</a>, falls dies nicht bereits geschehen ist.",
        "viewAppsTooltip":"Für diese View-gehostete Anwendung muss {0} Horizon Client {1} 3.0 oder höher auf Ihrem Computer installiert sein.",
        "desktoneDesktopTooltip":"Für diesen Horizon DaaS Desktop muss {0} Horizon View {1} auf Ihrem Computer installiert sein.",
        "desktoneApplicationTooltip":"Für diese Horizon DaaS-Anwendung muss {0} Horizon View {1} auf Ihrem Computer installiert sein.",
        "xenAppsReceiverNotDetected": "Citrix Receiver muss zur Öffnung dieser Anwendung auf diesem Computer installiert sein. <a target='_blank' href='{0}'>Citrix Receiver installieren</a>, falls dies nicht bereits geschehen ist.",
        "button.save" : "Speichern",
        "button.openHorizonView": "Öffnen Sie Horizon Client ",
        "myapps.launch.openApp": "Öffnen Sie {0}",
        "button.openApp": "Öffnen Sie die Anwendung",
        "button.clear": "Löschen",
        "button.close": "Schließen",
        "myapps.launch.view.openWith": "Öffnen mit",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(Standard)",
        "myapps.launch.view.selectPreferredLaunchClient": "Wählen Sie, wie Sie Horizon-Desktops und -Anwendungen starten möchten",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "WÄHLEN SIE EINEN STANDARDMÄSSIGEN START ...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Dies legt das standardmäßige Startverhalten bei Öffnen eines View Desktops von Ihrem Gerät fest. Sollten Sie \„View\“ als Ihren Standard wählen, müssen Sie Horizon Client installiert haben. <a target='_blank' href='{0}'>Horizon Client installieren</a>, falls dies nicht bereits geschehen ist.",
        "myapps.launch.view.unknownClientType": "Unbekannter Clienttyp zum Öffnen von Horizon Client.",
        "myapps.launch.view.openWithView" : "Mit Horizon Client öffnen",
        "myapps.launch.view.openWithBrowser" : "Mit Browser öffnen",
        "myapps.launch.view.preferredClient.byBrowser.description": "Bei der Auswahl von Browser öffnet sich View in einem neuen Browserfenster.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Dieses Element erfordert Horizon 3.0 oder höher. <a target='_blank' href='{0}'>Horizon Client installieren</a>, falls dies nicht bereits geschehen ist.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Sie können diese Einstellung jederzeit in Voreinstellungen ändern.",
        "myapps.launch.msg.launching.desktop":"Desktop <b>{0}</b> wird gestartet ....",
        "myapps.launch.msg.launching.application":"Anwendung <b>{0}</b> wird gestartet ....",
        "myapps.noAppsMsg": "Sie haben keine Anwendungen hinzugefügt. Sie können zu {0} navigieren, um Anwendungen hinzuzufügen.",
        "myapps.noFavAppsMsg": "Sie haben keine Anwendungen favorisiert.",
        "myapps.dialog.openApp": "ÖFFNEN",
        "myapps.dialog.openAppWithViewClient": "In Client starten",
        "myapps.dialog.openAppWithBrowser": "In Browser starten",
        "deviceStatus.networkLost" : "Ihre Netzwerkverbindung wurde unterbrochen",
        "deviceStatus.networkRestored" : "Netzwerkverbindung wiederhergestellt",
        "api.session.expired.retry":"Sitzung abgelaufen – versuche zu erneuern ...",
        "api.error":"Fehler aufgetreten. Erneut versuchen.",
        "api.timeout":"Verbindung abgelaufen. Erneut versuchen",
        "favoriteStatus.favorite" : "Als Favorit markieren",
        "favoriteStatus.unfavorite" : "Von Favoriten entfernen",
        "favoriteStatus.offlineFavoriteMessage": "Favorisieren einer Anwendung ist im Offlinebetrieb nicht möglich. Bitte Verbindung wiederherstellen und erneut versuchen.",
        "error.failToFavoriteApp": "Aktualisieren des Favoritenstatus fehlgeschlagen",
        "error.failToHideApp": "Entfernen der Anwendung fehlgeschlagen",
        "error.failToShowApp": "Hinzufügen der Anwendung zu Launcher fehlgeschlagen",
        "installStatus.offlineInstallMessage": "Installationsaufforderungen sind im Offlinebetrieb nicht verfügbar. Bitte Verbindung wiederherstellen und erneut versuchen.",
        "installStatus.activated": "Aktiviert",
        "installStatus.notActivated": "Nicht aktiviert",
        "installStatus.request": "Anfordern",
        "installStatus.update": "Aktualisieren",
        "installStatus.processing": "In Bearbeitung",
        "installStatus.installFailedMessage": "Versuchen Sie es erneut und wenden Sie sich an Ihren IT-Administrator, falls das Problem bestehen bleibt.",
        "requestFailed": "Anforderung fehlgeschlagen",
        "requestSuccessful": "Anforderung erfolgreich",
        "accept": "Akzeptieren",
        "decline": "Ablehnen",
        "termsOfUse": "Nutzungsbedingungen",
        "beforeInstallation": "Vor der Installation",
        "resetDesktopStatus.offlineMessage": "Desktop kann im Offlinebetrieb nicht zurückgesetzt werden. Bitte Verbindung wiederherstellen und erneut versuchen.",
        "error.failToResetDesktop": "Desktop konnte nicht zurückgesetzt werden.",
        "resetDesktop.sucess": "Desktop erfolgreich zurückgesetzt.",
        "appCenter.someAppsMissingMessage": "Alle Anwendungen konnten momentan nicht geladen werden",
        "appCenter.device.status.notRegistered": "Gerät ist nicht angemeldet",
        "appCenter.device.status.blackListed": "Dieses Gerät ist auf der Blacklist",
        "appCenter.device.status.unknownError": "Unbekannter Fehler",
        "appCenter.device.register": "Gerät anmelden",
        "appCenter.device.moreDetails":"Weitere Details",
        "appCenter.noAppsMsg": "Es sind zurzeit keine Anwendungen verfügbar",
        "appCenter.noSearchResults": "Keine Ergebnisse",
        "appCenter.vppInviteTitle": "Anmeldung zur verwalteten Verteilung ",
        "appCenter.appInstallConfirmPromptTitle": "Installation bestätigen",
        "appCenter.acceptInvite": "Einladung annehmen",
        "appCenter.install": "Installieren",
        "appCenter.proceed": "Weiter",
        "appCenter.cancel": "Abbrechen",
        "appCenter.searchApps": "Anwendungen durchsuchen",
        "appCenter.welcomeMsg": "Installieren Sie neue Anwendungen überall, auf allen Geräten!",
        "appCenter.done": "Fertig",
        "appCenter.nav.privacyPage": "Seite \„Datenschutz\"",
        "appCenter.nav.catalog": "Katalog",
        "appCenter.nav.myApps": "Eigene Anwendungen",
        "appCenter.nav.favorites": "Favoriten",
        "appCenter.nav.categories": "Kategorien",
        "appCenter.nav.filterby": "Filtern nach",
        "appCenter.nav.show": "Einblenden",
        "appCenter.nav.settings": "Einstellungen",
        "appCenter.nav.sortBy": "Sortieren nach",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtern",
        "appCenter.action.install": "Installieren",
        "appCenter.action.installed": "Installiert",
        "appCenter.action.added": "Hinzugefügt",
        "appCenter.action.processing": "In Bearbeitung",
        "appCenter.action.update": "Aktualisieren",
        "appCenter.action.request": "Anfordern",
        "appCenter.type.web": "Webanwendung",
        "appCenter.type.native": "Systemeigene Anwendungen",
        "appCenter.type.native.platform": "{0} Anwendung",
        "appCenter.type.virtual": "Virtuelle Anwendungen",
        "myapp.nav.categories": "Kategorien",
        "myapp.nav.favorites": "Favoriten",
        "myapp.nav.allApps": "Alle Anwendungen",
        "myapp.label.new": "Neu",
        "myapp.nav.filterby": "Filtern nach",
        "userInfo.adminConsole":"Admin-Konsole",
        "userInfo.preferences":"Voreinstellungen",
        "userInfo.about":"Über diese Anwendung",
        "userInfo.devices":"Geräte",
        "userInfo.signout":"Abmelden",
        "app.details.link.back": "Zurück",
        "app.details.nav.details": "Details",
        "app.details.nav.reviews": "Bewertungen",
        "app.details.label.description": "Beschreibung",
        "app.details.label.seeFullDetails": "Einzelheiten siehe ... ",
        "app.details.label.information": "Information",
        "app.details.label.category": "Kategorien",
        "app.details.label.version": "Version",
        "app.details.label.type": "Typ:",
        "app.details.label.type.SAML11": "Webanwendung",
        "app.details.label.type.SAML20": "Webanwendung",
        "app.details.label.type.WEBAPPLINK": "Webanwendung",
        "app.details.label.type.WSFED12": "Webanwendung",
        "app.details.label.type.XENAPP": "XEN-Anwendung",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "View Desktop",
        "app.details.label.type.VIEWAPP": "View Anwendung",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone Anwendung",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Größe",
        "app.details.label.price": "Preis",
        "app.details.label.screenshots": "Screenshots",
        "app.details.label.requirement": "Voraussetzung:",
        "app.details.label.packageName": "Paketname:",
        "app.details.thinapp.requirement": "Diese Anwendung funktioniert nur auf Windows Computern, auf denen Identity Manager Desktop installiert ist.",
        "app.details.viewDesktop.requirement": "Für diesen View Desktop muss {0} Horizon Client {1} 3.0 oder höher auf Ihrem Computer installiert sein.",
        "app.details.viewapp.requirement": "Für diese View-gehostete Anwendung muss {0} Horizon Client {1} 3.0 oder höher auf Ihrem Computer installiert sein.",
        "app.details.xenapp.requirement": "Für diese Anwendung muss {0} Citrix Receiver {1} installiert sein.",
        "app.details.xenapp.msg.IE8OrLower":"Für diese Anwendung muss Citrix Receiver installiert sein. Hinweis: Diese Anwendung kann nicht in Internet Explorer 8 geöffnet werden.",
        "app.details.xenappsDeliveryGroup.requirement":"Für diesen Citrix Desktop muss {0} Citrix Receiver {1} installiert sein.",
        "app.details.desktoneDesktop.requirement": "Für diesen Horizon DaaS Desktop muss {0} Horizon Client {1} auf Ihrem Computer installiert sein.",
        "app.details.desktoneApp.requirement": "Für diese Horizon DaaS-Anwendung muss {0} Horizon Client {1} auf Ihrem Computer installiert sein.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Keine Informationen verfügbar",
        "app.details.noScreenshots": "Keine Bildschirmaufnahme verfügbar",
        "app.details.noDescription": "Keine Beschreibung verfügbar",
        "app.details.needsDeviceEnrollment": "Geräteregistrierung erforderlich",
        "app.settings.label.settings": "Einstellungen",
        "app.settings.link.back": "Zurück",
        "app.settings.managedDevices": "Verwaltete Geräte",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"Über VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Datenschutzrichtlinie",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Nutzungsbedingungen",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-de",
        "app.about.licenseAgreementLink":"http://www.vmware.com/de/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/de/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Geräte",
        "app.devices.tableColumn.deviceName":"Gerätename",
        "app.devices.tableColumn.userDeviceId":"Geräte-ID",
        "app.devices.tableColumn.lastLoginTime":"Zeitpunkt der letzten Anmeldung",
        "app.devices.unlinkDevice":"Verknüpfung aufheben",
        "app.devices.unlinkedDevice": "Verknüpfung aufgehoben.",
        "app.devices.emptyDeviceListTitle": "Sie verfügen über keine verknüpften Computer.",
        "app.devices.emptyDeviceListMessage": "Um einen Computer zu verknüpfen, müssen Sie VMware Identity Manager Desktop für Windows installieren und eintragen.",

        "app.thinappMultiDeviceAct.heading":"Diese Anwendung wird den zulässigen Geräten hinzugefügt. Um \„{0}\“ auf weiteren Geräten zu verwenden, suchen Sie unten die Gerätenamen und klicken auf die Schaltfläche \„Anfordern\“.",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Gerätename",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Anfordern",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Widerrufen",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Ausstehend",
        "app.thinappMultiDeviceAct.activationState.activated":"Zugelassen",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Nicht aktiviert",
        "app.setAppPassword.heading":"Kennwort für Anwendung {0} festlegen",
        "app.setAppPassword.instruction":"Legen Sie mit dem unten angefügten Formular ein Kennwort für diese Anwendung fest. Das Kennwort muss aus mindestens drei Zeichen bestehen.",
        "app.setAppPassword.label.password": "Kennwort ",
        "app.setAppPassword.label.confirmPassword": "Kennwort bestätigen",
        "app.setAppPassword.label.generate": "Kennwort generieren",
        "app.setAppPassword.error.passwordsNoMatch": "Kennwörter stimmen nicht überein. ",
        "app.setAppPassword.msg.success": "Ihr Anwendungskennwort wurde erfolgreich festgelegt.",
        "app.setAppPassword.msg.fail": "Ihr Kennwort konnte nicht festgelegt werden. Bitte erneut versuchen.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installieren",
        "app.banner.open":"Öffnen",
        "button.cancel":"Abbrechen",
        "myapps.launch.passwordvault.installExtension.description":"Diese Anwendung kann die Password Vault-Browsererweiterung verwenden. <a target='_blank' href='{0}'>Installieren Sie die Erweiterung</a>, falls dies nicht bereits geschehen ist.",
        "installMessage.continueInstall":"Sie haben vorher versucht, diese Anwendung zu installieren. ",
        "installMessage.proceedToInstall":"Klicken Sie hierauf, um fortzufahren.",
        "appCenter.device.status.confError":"MDM konnte keine Informationen zu Ihrem Gerät finden.",
        "appCenter.device.unEnrollWarningTitle":"Warnung",
        "appCenter.device.mdmUnEnrollMessage":"Entfernen Sie alle Workspace ONE-Anwendungen und -Daten von diesem Gerät.",
        "appCenter.device.disableWorkspaceMessage":"Durch Entfernung Ihres Kontos wird der von der Workspace ONE-Anwendung gewährte Zugriff widerrufen. Auf Ihr Springboard heruntergeladene Anwendungen bleiben installiert aber der Zugriff ist möglicherweise gesperrt. Möchten Sie fortfahren?",
        "appCenter.internalApp.installationStepTitle":"Führen Sie zum Start dieser Anwendung diese Schritte nach der Installation aus",
        "appCenter.internalApp.step1":"Starten Sie „Einstellungen“ von der Startseite Ihres iPhones",
        "appCenter.internalApp.step2":"Tippen Sie auf „Allgemein“",
        "appCenter.internalApp.step3":"Tippen Sie auf „Profil- und Geräteverwaltung",
        "appCenter.internalApp.step4":"Tippen Sie auf den Namen des Anwendungsentwicklers unter „Unternehmensanwendung",
        "appCenter.internalApp.step5":"Anwendung bestätigen oder vertrauen",
        "appCenter.internalApp.watchTutorial":"Schrittweise Anleitung ansehen",
        "userInfo.removeAccount":"Konto entfernen",
        "userInfo.account":"Konto",
        "userInfo.password":"Kennwort ",
        "app.changePassword.title":"Kennwort ändern",
        "app.changePassword.enterCurrentPassword":"Aktuelles Kennwort eingeben",
        "app.changePassword.enterNewPassword":"Neues Kennwort eingeben",
        "app.changePassword.confirmNewPassword":"Neues Kennwort bestätigen",
        "app.changePassword.error.passwordsNoMatch":"Die neuen Kennwörter stimmen nicht überein.",
        "app.changePassword.success":"Neues Kennwort gespeichert!",
        "app.changePassword.label.email":"E-Mail",
        "app.changePassword.label.phone":"Rufnummer",
        "app.logout.confirm.msg":"Durch Abmeldung bei Workspace ONE beenden Sie Ihre aktuelle Sitzung. Alle aus dem Katalog heruntergeladenen Anwendungen verbleiben auf dem Gerät. Neue Anwendungen werden jedoch erst bei erneuter Anmeldung verfügbar sein. ",
        "app.logout.title":"WARNUNG",
        "app.passwordVault.banner.msg":"Sie haben Anwendungen, die die Password Vault-Browsererweiterung verwenden können.",
        "app.passwordVault.banner.button.install":"Installieren"
});
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n_en', {
        "appCenter" : "Workspace ONE",
        "ok" : "OK",
        "and": "and",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Install",
        "app.banner.open":"Open",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop must be installed on this computer to open this application. <a target='_blank' href='{0}'>Install VMware Identity Manager Desktop</a> if you have not already.",
        "viewAppsTooltip":"This Horizon Hosted Application requires {0} Horizon Client{1} 3.0 or later to be installed on your computer.",
        "desktoneDesktopTooltip":"This Horizon Air Desktop requires {0} Horizon Client {1} to be installed on your computer.",
        "desktoneApplicationTooltip":"This Horizon Air Application requires {0} Horizon Client {1} to be installed on your computer.",
        "xenAppsReceiverNotDetected": "Citrix Receiver must be installed on this computer to open this application. <a target='_blank' href='{0}'>Install Citrix Receiver</a> if you have not already.",
        "button.cancel" : "Cancel",
        "button.save" : "Save",
        "button.openHorizonView": "Open Horizon Client",
        "myapps.launch.openApp": "Open {0}",
        "button.openApp": "Open App",
        "button.clear": "Clear",
        "button.close": "Close",
        "button.cancel": "Cancel",
        "myapps.launch.view.openWith": "Open with",
        "myapps.launch.view.preferredClient.horizonView": "Horizon Client",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(default)",
        "myapps.launch.view.selectPreferredLaunchClient": "Select how you would like to launch Horizon Desktops and Applications",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "CHOOSE A LAUNCH DEFAULT...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "This determines the default launch behavior when you choose to open a Horizon desktop from your device. If you choose Horizon Client as your default, you must have the Horizon Client installed. <a target='_blank' href='{0}'>Install the Horizon Client</a> if you have not already.",
        "myapps.launch.view.unknownClientType": "Unknown client type to open Horizon Client.",
        "myapps.launch.view.openWithView" : "Open with Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Open with Browser",

        "myapps.launch.view.preferredClient.byBrowser.description": "By selecting Browser, your Desktop or Application will open in a new browser window.",
        "myapps.launch.view.preferredClient.byViewClient.description": "This item requires Horizon Client 3.0 or later. <a target='_blank' href='{0}'>Install the Horizon Client</a> if you have not already.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "You can always change this setting in preferences.",
        "myapps.launch.msg.launching.desktop":"Launching Desktop <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Launching Application <b>{0}</b> .....",
        "myapps.noAppsMsg": "You haven't added any apps. You can navigate to the {0} to add applications",
        "myapps.noFavAppsMsg": "You haven't favorited any apps",
        "myapps.welcomeMsg": "Hello, {0}. Here are your apps!",

        "myapps.dialog.openApp": "OPEN",
        "myapps.dialog.openAppWithViewClient": "Launch in Client",
        "myapps.dialog.openAppWithBrowser": "Launch in Browser",

        "myapps.launch.passwordvault.installExtension.description": "This application can utilize the Password Vault browser extension. <a target='_blank' href='{0}'>Install the Extension</a> if you have not already.",

        "deviceStatus.networkLost" : "You have lost network connection",
        "deviceStatus.networkRestored" : "Network connection restored",
        "api.session.expired.retry":"Session expired, trying to renew...",
        "api.security.header.invalid.relogin":"Security header validation failed, logging out..",
        "api.updateApps" : "Updating list...",
        "api.error": "Unable to reach the server, please try after sometime",
        "service.under.maintenance.error":"Workspace ONE is temporarily in maintenance mode. You can launch your apps, but some features may not work",
        "api.timeout":"Connection timed out, retry",
        "favoriteStatus.favorite" : "Favorite",
        "favoriteStatus.unfavorite" : "Unfavorite",
        "favoriteStatus.offlineFavoriteMessage": "Favoriting an app is not available while offline, please reconnect and try again",
        "error.failToFavoriteApp": "Failed to update the favorite status",
        "error.failToHideApp": "Failed to remove the app",
        "error.failToShowApp": "Failed to add the app to the Launcher",
        "installStatus.enrollDevice": "The use of {0} requires activation of Workspace Services to protect company data",
        "installStatus.enrollDevice.learnMore": "Learn More",
        "installStatus.offlineInstallMessage": "Install requests are not available while offline, please reconnect and try again",
        "installStatus.activated": "Activated",
        "installStatus.notActivated": "Not Activated",
        "installStatus.request": "Request",
        "installStatus.update": "Update",
        "installStatus.processing": "Processing",
        "installStatus.reinstall": "Reinstall",
        "installStatus.installFailedMessage": "Please retry then contact your IT Administrator if this problem persists",
        "installStatus.unenrolledDevice": "This app is no longer available to you. Press ok to update list.",
        "installMessage.continueInstall": "You were previously attempting to install this app. ",
        "installMessage.proceedToInstall": "Click to continue.",

        "requestFailed": "Request Failed",
        "changeOccurred": "Change Occurred",
        "requestSuccessful": "Request Successful",
        "accept": "Accept",
        "decline": "Decline",
        "termsOfUse": "Terms of Use",
        "beforeInstallation": "Before Installation",
        "resetDesktopStatus.offlineMessage": "Resetting a desktop is not available while offline, please reconnect and try again",
        "error.failToResetDesktop": "Failed to reset desktop",
        "resetDesktop.sucess": "Sucessfully reset desktop",
        "appCenter.someAppsMissingMessage": "All apps could not be loaded at this time",
        "appCenter.auth.mdmError": "All apps could not be loaded at this time. There is either a configuration or network error while communicating with MDM",
        "appCenter.device.status.notRegistered": "Device is not registered",
        "appCenter.device.status.blackListed": "This device is black listed",
        "appCenter.device.status.confError": "MDM could not find any information for your device",
        "appCenter.device.status.unknownError": "Unknown error occurred",
        "appCenter.device.status.commError": "MDM has resulted in an error while retrieving apps for your device",
        "appCenter.device.status.deviceInputError": "This device is invalid! Please contact your IT Administrator",
        "appCenter.device.mdmApps.notFoundError": "MDM did not find any applications assigned to your device",

        "appCenter.device.register": "Register Device",
        "appCenter.device.moreDetails":"More Details",
        "appCenter.device.unEnrollWarningTitle":"Warning",
        "appCenter.device.mdmUnEnrollMessage":"Remove all Workspace ONE apps and data from this device.",
        "appCenter.device.disableWorkspaceMessage":"Removing your account will revoke access granted via the Workspace ONE app. Apps downloaded to your springboard will remain installed, but access may be cut off. Would you like to continue?",
        "appCenter.noAppsMsg": "No apps are currently available",
        "appCenter.noSearchResults": "No results found",
        "appCenter.vppInviteTitle": "Manged Distribution Registration",
        "appCenter.appInstallConfirmPromptTitle": "Confirm Installation",
        "appCenter.acceptInvite": "Accept Invite",
        "appCenter.install": "Install",
        "appCenter.proceed": "Proceed",
        "appCenter.cancel": "Cancel",
        "appCenter.searchApps": "Search Apps",
        "appCenter.welcomeMsg": "Install new Apps anywhere, on any Device!",
        "appCenter.done": "Done",
        "appCenter.nav.privacyPage": "Privacy Page",
        "appCenter.nav.catalog": "Catalog",
        "appCenter.nav.myApps": "My Apps",
        "appCenter.nav.favorites": "Favorites",
        "appCenter.nav.categories": "Categories",
        "appCenter.nav.filterby": "Filter by",
        "appCenter.nav.show": "Show",
        "appCenter.nav.settings": "Settings",
        "appCenter.nav.sortBy": "Sort by",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filter",

        "appCenter.action.install": "Install",
        "appCenter.action.installed": "Installed",
        "appCenter.action.add": "Add",
        "appCenter.action.added": "Added",
        "appCenter.action.processing": "Processing",
        "appCenter.action.update": "Update",
        "appCenter.action.request": "Request",

        "appCenter.internalApp.installationStepTitle": "In order to open this app, follow these steps after installation",
        "appCenter.internalApp.step1": "Launch Settings from your iOS home screen",
        "appCenter.internalApp.step2": "Tap on General",
        "appCenter.internalApp.step3": "Tap on Profiles and Device management",
        "appCenter.internalApp.step4": "Tap on app developer name under Enterprise App",
        "appCenter.internalApp.step5": "Verify or Trust the app",
        "appCenter.internalApp.watchTutorial": "Watch step by step tutorial",

        "appCenter.type.web": "Web App",
        "appCenter.type.native": "Native App",
        "appCenter.type.native.platform": "{0} App",
        "appCenter.type.virtual": "Virtual App",

        "myapp.nav.categories": "Categories",
        "myapp.nav.favorites": "Favorites",
        "myapp.nav.allApps": "All Apps",
        "myapp.label.new": "New",
        "myapp.nav.filterby": "Filter by",
        "appCenter.nav.browseBy": "Browse by",

        "userInfo.adminConsole":"Administration Console",
        "userInfo.preferences":"Preferences",
        "userInfo.about":"About",
        "userInfo.devices":"Devices",
        "userInfo.removeAccount": "Remove Account",
        "userInfo.account": "Account",
        "userInfo.password": "Password",
        "userInfo.signout":"Sign Out",

        // App Details Page
        "app.details.link.back": "Back",
        "app.details.nav.details": "Details",
        "app.details.nav.reviews": "Reviews",
        "app.details.label.description": "Description",
        "app.details.label.seeFullDetails": "See full details...",
        "app.details.label.information": "Information",
        "app.details.label.category": "Categories",
        "app.details.label.version": "Version",
        "app.details.label.type": "Type:",
        "app.details.label.type.SAML11": "Web App",
        "app.details.label.type.SAML20": "Web App",
        "app.details.label.type.WEBAPPLINK": "Web App",
        "app.details.label.type.WSFED12": "Web App",
        "app.details.label.type.MDMWEB": "Web App",
        "app.details.label.type.XENAPP": "Xen App",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "Thin App",
        "app.details.label.type.VIEWPOOL": "Horizon Desktop",
        "app.details.label.type.VIEWAPP": "Horizon App",
        "app.details.label.type.DESKTONEDESKTOP": "Horizon Air Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Horizon Air App",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.type.PASSWORDVAULT": "Web App",
        "app.details.label.type.PUBLIC": "Public App",
        "app.details.label.type.PROFILE": "Profile",
        "app.details.label.type.INTERNAL": "Internal",
        "app.details.label.size": "Size",
        "app.details.label.price": "Price",
        "app.details.label.screenshots": "Screenshots",

        "app.details.label.requirement": "Requirement:",
        "app.details.label.packageName": "Package Name:",
        "app.details.thinapp.requirement": "This application only works on a Windows computer with Identity Manager Desktop installed.",
        "app.details.viewDesktop.requirement": "This Horizon Desktop requires {0} Horizon Client{1} 3.0 or later to be installed on your computer.",
        "app.details.viewapp.requirement": "This Horizon Hosted Application requires {0} Horizon Client{1} 3.0 or later to be installed on your computer.",
        "app.details.xenapp.requirement": "This application requires {0} Citrix Receiver {1} to be installed.",
        "app.details.xenapp.msg.IE8OrLower":"This application requires Citrix Receiver to be installed. Note: this application cannot be opened in Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"This Citrix desktop requires {0} Citrix Receiver {1} to be installed.",
        "app.details.desktoneDesktop.requirement": "This Horizon Air Desktop requires {0} Horizon Client {1} to be installed on your computer.",
        "app.details.desktoneApp.requirement": "This Horizon Air Application requires {0} Horizon Client {1} to be installed on your computer.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "No information available",
        "app.details.noScreenshots": "No screenshots available",
        "app.details.noDescription": "No description available",
        "app.details.needsDeviceEnrollment": "Requires Device Enrollment",

        "app.settings.label.settings": "Settings",
        "app.settings.link.back": "Back",
        "app.settings.managedDevices": "Managed Devices",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"About VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Privacy Policy",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"License Agreement",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/download/eula/identity-manager-terms-of-service.html",

        "app.devices.heading":"Devices",
        "app.devices.tableColumn.deviceName":"Device Name",
        "app.devices.tableColumn.userDeviceId":"Device ID",
        "app.devices.tableColumn.lastLoginTime":"Last Login Time",
        "app.devices.unlinkDevice":"Unlink",
        "app.devices.unlinkedDevice": "Unlinked",
        "app.devices.emptyDeviceListTitle": "You do not have any linked computers.",
        "app.devices.emptyDeviceListMessage": "To link a computer, you must install and register VMware Identity Manager Desktop for Windows.",

        "app.thinappMultiDeviceAct.heading":"This application will be added to the approved devices. To use \"{0}\" on additional devices, find the name of the device below then click Request button.",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Device Name",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Request",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Declined",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Pending",
        "app.thinappMultiDeviceAct.activationState.activated":"Approved",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Not Activated",

        "app.setAppPassword.heading":"Set password for application {0}",
        "app.setAppPassword.instruction":"Use the form below to set a password for this application. Password must be at least three characters in length.",
        "app.setAppPassword.label.password": "Password",
        "app.setAppPassword.label.confirmPassword": "Confirm Password",
        "app.setAppPassword.label.generate": "Generate Password",
        "app.setAppPassword.error.passwordsNoMatch": "Passwords do not match.",
        "app.setAppPassword.msg.success": "Your application password has been successfully set.",
        "app.setAppPassword.msg.fail": "There was an error while attempting to set your password. Please try again.",

        "app.launchPassword.heading": "Password Request",
        "app.launchPassword.view.instruction": "We need your password to sign in to this windows resource {0}.",
        "app.launchPassword.label.userName": "User",
        "app.launchPassword.label.password": "password",
        "app.launchPassword.button.label.signin": "Sign In",

        "app.changePassword.title": "Change Password",
        "app.changePassword.enterCurrentPassword": "Enter current password",
        "app.changePassword.enterNewPassword": "Enter new password",
        "app.changePassword.confirmNewPassword": "Confirm new password",
        "app.changePassword.error.passwordsNoMatch": "New passwords don't match.",
        "app.changePassword.error.requirementsNoMatch": "New password doesn’t meet requirements.",
        "app.changePassword.success": "New password saved!",
        "app.changePassword.label.email": "Email",
        "app.changePassword.label.phone": "Phone",

        "app.passwordPolicy.passwordRequirements": "Password requirements",
        "app.passwordPolicy.minLength": "Minimal {0} digits",
        "app.passwordPolicy.leastIncludes": "at least includes:",
        "app.passwordPolicy.minLower": "{0} Letter",
        "app.passwordPolicy.minUpper": "{0} Cap",
        "app.passwordPolicy.minDigit": "{0} Number",
        "app.passwordPolicy.minSpecial": "{0} Special character",


        "app.logout.confirm.msg": "Logging out of Workspace ONE will end your current session. Any apps downloaded from the catalog will remain on the device, but no new apps will be available until you log back in.",
        "app.logout.title": "WARNING",
        "app.passwordVault.banner.msg":"You have apps that can utilize the Workspace One extension.",
        "app.passwordVault.banner.button.install":"Install",
        "error.failedToRemoveAccount": "Failed to remove account, please try again later"

    });

})(angular.module('com.vmware.greenbox.l10n',[]));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE está en modo de mantenimiento por el momento. Puede iniciar aplicaciones, pero puede que algunas funciones no estén disponibles.",
        "appCenter.device.unEnrollWarningMessage":"Si anula su inscripción, ya no tendrá acceso a las aplicaciones a las que está autorizado. ¿Desea continuar?",
        "appCenter.action.add":"Agregar+",
        "userInfo.unenroll":"Anular inscripción",
        "myapps.welcomeMsg": "Hola, {0}. ¡Aquí están sus aplicaciones!",
        "api.updateApps": "Cargando la lista...",
        "installStatus.enrollDevice": "El uso de {0} requiere la activación de Workspace Services para proteger los datos corporativos.",
        "installStatus.unenrolledDevice": "Esta aplicación ya no está a disponible para usted. Presione OK para actualizar la lista.",
        "changeOccurred": "Ocurrió un cambio",
        "appCenter.auth.mdmError": "No se pudo cargar todas las aplicaciones en este momento. Hay un error de configuración o de red en la comunicación con MDM.",
        "appCenter.device.status.commError": "MDM devolvió un error al obtener las aplicaciones para su dispositivo.",
        "appCenter.device.status.deviceInputError": "¡Este dispositivo no es válido! Póngase en contacto con su administrador de TI.",
        "appCenter.device.mdmApps.notFoundError": "MDM no encontró ninguna aplicación para su dispositivo.",
        "appCenter.nav.browseBy": "Examinar por",
        "app.launchPassword.heading": "Solicitud de contraseña",
        "app.launchPassword.view.instruction": "Necesitamos su contraseña para iniciar sesión en este recurso de Windows: {0}.",
        "app.launchPassword.label.userName": "Usuario",
        "app.launchPassword.label.password": "Contraseña",
        "app.launchPassword.button.label.signin": "Iniciar sesión",
        "appCenter" : "Centro de aplicaciones",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop debe estar instalado en la computadora para poder abrir esta aplicación. <a target='_blank' href='{0}'>Instale VMware Identity Manager Desktop</a> si aún no lo tiene.",
        "viewAppsTooltip":"Esta aplicación hospedada de View requiere que {0} Horizon Client{1} 3.0 o una versión más reciente esté instalado en la computadora.",
        "desktoneDesktopTooltip":"Este escrito Horizon DaaS requiere que {0} Horizon View {1} esté instalado en la computadora.",
        "desktoneApplicationTooltip":"Esta aplicación de Horizon DaaS requiere que {0} Horizon View {1} esté instalado en la computadora.",
        "xenAppsReceiverNotDetected": "Citrix Receiver debe estar instalado en la computadora para poder abrir esta aplicación. <a target='_blank' href='{0}'>Instale Citrix Receiver</a> si aún no lo tiene.",
        "button.save" : "Guardar",
        "button.openHorizonView": "Abrir Horizon Client",
        "myapps.launch.openApp": "Abrir {0}",
        "button.openApp": "Abrir aplicación",
        "button.clear": "Borrar",
        "button.close": "Cerrar",
        "myapps.launch.view.openWith": "Abrir con",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Navegador",
        "myapps.launch.view.preferredClient.isDefault": "(predeterminado)",
        "myapps.launch.view.selectPreferredLaunchClient": "Seleccione cómo desea iniciar los escritorios y aplicaciones de Horizon",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "SELECCIONE EL MÉTODO PREDETERMINADO PARA INICIAR...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Esto determina el comportamiento predeterminado para iniciar cuando selecciona abrir un escritorio de View en el dispositivo. Si selecciona View como la forma predeterminada, debe tener Horizon Client instalado. <a target='_blank' href='{0}'>Instale Horizon Client</a> si aún no lo tiene.",
        "myapps.launch.view.unknownClientType": "Tipo de cliente desconocido para abrir Horizon Client.",
        "myapps.launch.view.openWithView" : "Abrir con Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Abrir en el navegador",
        "myapps.launch.view.preferredClient.byBrowser.description": "Si selecciona Navegador, View se abrirá en una nueva ventana de navegador.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Este elemento requiere Horizon Client 3.0 o una versión más reciente. <a target='_blank' href='{0}'>Instale Horizon Client</a> si aún no lo tiene.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Puede cambiar este ajuste en las preferencias en cualquier momento.",
        "myapps.launch.msg.launching.desktop":"Iniciando el escritorio <b>{0}</b>...",
        "myapps.launch.msg.launching.application":"Iniciando la aplicación <b>{0}</b>...",
        "myapps.noAppsMsg": "No ha agregado ninguna aplicación. Puede navegar a {0} para agregar aplicaciones",
        "myapps.noFavAppsMsg": "No ha marcado ninguna aplicación como favorita",
        "myapps.dialog.openApp": "ABRIR",
        "myapps.dialog.openAppWithViewClient": "Iniciar en Client",
        "myapps.dialog.openAppWithBrowser": "Iniciar en el navegador",
        "deviceStatus.networkLost" : "Se perdió la conexión a la red",
        "deviceStatus.networkRestored" : "Se restableció la conexión a la red",
        "api.session.expired.retry":"La sesión caducó, intentando renovar...",
        "api.error":"Error. Intente de nuevo.",
        "api.timeout":"Se agotó el tiempo de espera. Intente de nuevo.",
        "favoriteStatus.favorite" : "Favoritos",
        "favoriteStatus.unfavorite" : "Quitar de Favoritos",
        "favoriteStatus.offlineFavoriteMessage": "La función de agregar una aplicación a Favoritos no está disponible fuera de línea. Conéctese e intente de nuevo.",
        "error.failToFavoriteApp": "No se pudo obtener el estado de Favoritos",
        "error.failToHideApp": "No se pudo eliminar la aplicación",
        "error.failToShowApp": "No se pudo agregar la aplicación a Launcher",
        "installStatus.offlineInstallMessage": "Las solicitudes de instalación no están disponibles fuera de línea. Conéctese e intente de nuevo.",
        "installStatus.activated": "Activado",
        "installStatus.notActivated": "Sin activar",
        "installStatus.request": "Solicitud",
        "installStatus.update": "Actualizar",
        "installStatus.processing": "Procesando",
        "installStatus.installFailedMessage": "Intente conectarse de nuevo. Póngase en contacto con el administrador de TI si el problema continúa.",
        "requestFailed": "Solicitud falló",
        "requestSuccessful": "Se envió la solicitud",
        "accept": "Aceptar",
        "decline": "Rechazar",
        "termsOfUse": "Términos de uso",
        "beforeInstallation": "Antes de la instalación",
        "resetDesktopStatus.offlineMessage": "La función de reconfigurar un escritorio no está disponible fuera de línea. Conéctese e intente de nuevo.",
        "error.failToResetDesktop": "No se pudo reconfigurar el escritorio",
        "resetDesktop.sucess": "Se reconfiguró el escritorio",
        "appCenter.someAppsMissingMessage": "No se pudo cargar todas las aplicaciones",
        "appCenter.device.status.notRegistered": "El dispositivo no está registrado",
        "appCenter.device.status.blackListed": "Este dispositivo está en la lista negra",
        "appCenter.device.status.unknownError": "Error desconocido",
        "appCenter.device.register": "Registrar dispositivo",
        "appCenter.device.moreDetails":"Más detalles",
        "appCenter.noAppsMsg": "No hay aplicaciones disponibles",
        "appCenter.noSearchResults": "No hay resultados",
        "appCenter.vppInviteTitle": "Registro de la distribución administrada",
        "appCenter.appInstallConfirmPromptTitle": "Confirmar instalación",
        "appCenter.acceptInvite": "Aceptar invitación",
        "appCenter.install": "Instalar",
        "appCenter.proceed": "Continuar",
        "appCenter.cancel": "Cancelar",
        "appCenter.searchApps": "Buscar aplicaciones",
        "appCenter.welcomeMsg": "Instale nuevas aplicaciones en cualquier lugar y en cualquier dispositivo!",
        "appCenter.done": "Listo",
        "appCenter.nav.privacyPage": "Página de privacidad",
        "appCenter.nav.catalog": "Catálogo",
        "appCenter.nav.myApps": "Mis aplicaciones",
        "appCenter.nav.favorites": "Favoritos",
        "appCenter.nav.categories": "Categorías",
        "appCenter.nav.filterby": "Filtrar por",
        "appCenter.nav.show": "Mostrar",
        "appCenter.nav.settings": "Configuración",
        "appCenter.nav.sortBy": "Ordenar por",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtrar",
        "appCenter.action.install": "Instalar",
        "appCenter.action.installed": "Instalado",
        "appCenter.action.added": "Agregado",
        "appCenter.action.processing": "Procesando",
        "appCenter.action.update": "Actualizar",
        "appCenter.action.request": "Solicitud",
        "appCenter.type.web": "Aplicación web",
        "appCenter.type.native": "Aplicación nativa",
        "appCenter.type.native.platform": "Aplicación {0}",
        "appCenter.type.virtual": "Aplicación virtual",
        "myapp.nav.categories": "Categorías",
        "myapp.nav.favorites": "Favoritos",
        "myapp.nav.allApps": "Todas las aplicaciones",
        "myapp.label.new": "Nuevas",
        "myapp.nav.filterby": "Filtrar por",
        "userInfo.adminConsole":"Consola administrativa",
        "userInfo.preferences":"Preferencias",
        "userInfo.about":"Acerca",
        "userInfo.devices":"Dispositivos",
        "userInfo.signout":"Cerrar sesión",
        "app.details.link.back": "Atrás",
        "app.details.nav.details": "Detalles",
        "app.details.nav.reviews": "Reseñas",
        "app.details.label.description": "Descripción",
        "app.details.label.seeFullDetails": "Ver detalles completos...",
        "app.details.label.information": "Información",
        "app.details.label.category": "Categorías",
        "app.details.label.version": "Versión",
        "app.details.label.type": "Tipo:",
        "app.details.label.type.SAML11": "Aplicación web",
        "app.details.label.type.SAML20": "Aplicación web",
        "app.details.label.type.WEBAPPLINK": "Aplicación web",
        "app.details.label.type.WSFED12": "Aplicación web",
        "app.details.label.type.XENAPP": "Xen App",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "Thin App",
        "app.details.label.type.VIEWPOOL": "Ver escritorio",
        "app.details.label.type.VIEWAPP": "Ver aplicación",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone App",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Tamaño",
        "app.details.label.price": "Precio",
        "app.details.label.screenshots": "Capturas de pantalla",
        "app.details.label.requirement": "Requisitos:",
        "app.details.label.packageName": "Nombre del paquete:",
        "app.details.thinapp.requirement": "Esta aplicación solo funciona en las computadoras Windows que tengan Identity Manager Desktop instalado.",
        "app.details.viewDesktop.requirement": "Este escritorio de View requiere que {0} Horizon Client{1} 3.0 o una versión más reciente esté instalado en la computadora.",
        "app.details.viewapp.requirement": "Esta aplicación hospedada de View requiere que {0} Horizon Client{1} 3.0 o una versión más reciente esté instalado en la computadora.",
        "app.details.xenapp.requirement": "Esta aplicación de Citrix requiere que {0} Citrix Receiver {1} esté instalado.",
        "app.details.xenapp.msg.IE8OrLower":"Esta aplicación requiere la instalación de Citrix Receiver. Aviso: Esta aplicación no se puede abrir en Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Este escritorio de Citrix requiere que {0} Citrix Receiver {1} esté instalado.",
        "app.details.desktoneDesktop.requirement": "Este Horizon DaaS Desktop requiere que {0} Horizon Client {1} esté instalado en la computadora.",
        "app.details.desktoneApp.requirement": "Esta Horizon DaaS Application requiere que {0} Horizon Client {1} esté instalado en la computadora.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "No hay información disponible",
        "app.details.noScreenshots": "No hay capturas de pantallas disponibles",
        "app.details.noDescription": "No hay descripción disponible",
        "app.details.needsDeviceEnrollment": "Requiere que el dispositivo esté inscrito",
        "app.settings.label.settings": "Configuración",
        "app.settings.link.back": "Atrás",
        "app.settings.managedDevices": "Dispositivos administrados",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATÁLOGO",
        "app.about.heading":"Acerca de VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Política de privacidada",
        "app.about.button.label.patents":"Patente",
        "app.about.button.label.licenseAgreement":"Términos de uso",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-es",
        "app.about.licenseAgreementLink":"http://www.vmware.com/es/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/es/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Dispositivos",
        "app.devices.tableColumn.deviceName":"Nombre del dispositivo",
        "app.devices.tableColumn.userDeviceId":"ID del dispositivo",
        "app.devices.tableColumn.lastLoginTime":"Hora de la última sesión",
        "app.devices.unlinkDevice":"Desvincular",
        "app.devices.unlinkedDevice": "No vinculado",
        "app.devices.emptyDeviceListTitle": "No tiene ninguna computadora vinculada.",
        "app.devices.emptyDeviceListMessage": "Para vincular una computadora, debe instalar e inscribir VMware Identity Manager Desktop para Windows.",

		"app.thinappMultiDeviceAct.heading":"Esta aplicación se agregará a los dispositivos aprobados. Para utilizar \"{0}\" en otros dispositivos, busque el nombre del dispositivo a continuación y seleccione el botón de Solicitud.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Nombre del dispositivo",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Estado",
        "app.thinappMultiDeviceAct.button.request":"Solicitud",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Denegada",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Pendiente",
        "app.thinappMultiDeviceAct.activationState.activated":"Aprobada",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Sin activar",
        "app.setAppPassword.heading":"Defina la contraseña para la aplicación {0}",
        "app.setAppPassword.instruction":"Utilice el formulario a continuación para definir la contraseña de la aplicación. La contraseña debe tener, por lo menos, tres caracteres.",
        "app.setAppPassword.label.password": "Contraseña",
        "app.setAppPassword.label.confirmPassword": "Confirmar contraseña",
        "app.setAppPassword.label.generate": "Generar contraseña",
        "app.setAppPassword.error.passwordsNoMatch": "Las contraseñas no coinciden.",
        "app.setAppPassword.msg.success": "La contraseña de la aplicación quedó establecida.",
        "app.setAppPassword.msg.fail": "Error al intentar establecer la contraseña. Intente de nuevo.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Instalar",
        "app.banner.open":"Abrir",
        "button.cancel":"Cancelar",
        "myapps.launch.passwordvault.installExtension.description":"Esta aplicación puede utilizar la extensión de administración de contraseñas para el navegador. <a target='_blank' href='{0}'>Instale la extensión</a> si aún no la ha instalado.",
        "installMessage.continueInstall":"Ya intentó descargar esta aplicación. ",
        "installMessage.proceedToInstall":"Haga clic para continuar.",
        "appCenter.device.status.confError":"MDM no pudo encontrar ninguna información para su dispositivo",
        "appCenter.device.unEnrollWarningTitle":"Advertencia",
        "appCenter.device.mdmUnEnrollMessage":"Elimine todas las aplicaciones y datos de Workspace ONE del dispositivo.",
        "appCenter.device.disableWorkspaceMessage":"Eliminar la cuenta revocará el acceso otorgado mediante la aplicación de Workspace ONE. Las aplicaciones que se descargaron en su pantalla de inicio permanecerán instaladas, pero puede que el acceso quede interrumpido. ¿Desea continuar?",
        "appCenter.internalApp.installationStepTitle":"Para poder abrir la aplicación, siga estos pasos después de la instalación",
        "appCenter.internalApp.step1":"Inicie Ajustes desde la pantalla de inicio de su iPhone",
        "appCenter.internalApp.step2":"Pulse en General",
        "appCenter.internalApp.step3":"Pulse en Perfil y Administración del dispositivo",
        "appCenter.internalApp.step4":"Pulse en el nombre del desarrollador de la aplicación en Aplicación empresarial",
        "appCenter.internalApp.step5":"Verifique u marque la aplicación como de confianza",
        "appCenter.internalApp.watchTutorial":"Vea el tutorial que detalla los pasos",
        "userInfo.removeAccount":"Eliminar cuenta",
        "userInfo.account":"Cuenta",
        "userInfo.password":"Contraseña",
        "app.changePassword.title":"Cambiar contraseña",
        "app.changePassword.enterCurrentPassword":"Introduzca la contraseña actual",
        "app.changePassword.enterNewPassword":"Introduzca la contraseña nueva",
        "app.changePassword.confirmNewPassword":"Confirme la contraseña nueva",
        "app.changePassword.error.passwordsNoMatch":"Las contraseñas nuevas no coinciden",
        "app.changePassword.success":"¡Se guardó la contraseña nueva!",
        "app.changePassword.label.email":"Correo electrónico",
        "app.changePassword.label.phone":"Teléfono",
        "app.logout.confirm.msg":"Cerrar la sesión de Workspace ONE cancelará su sesión actual. Todas las aplicaciones que haya descargado del catálogo permanecerán en el dispositivo, pero no habrá más aplicaciones disponibles hasta que vuelva a iniciar sesión.",
        "app.logout.title":"ADVERTENCIA",
        "app.passwordVault.banner.msg":"Tiene aplicaciones que pueden utilizar la extensión de administración de contraseña para el navegador",
        "app.passwordVault.banner.button.install":"Instalar"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE est temporairement en mode maintenance. Vous pouvez lancer vos applications, mais certaines fonctionnalités peuvent ne pas fonctionner.",
        "appCenter.device.unEnrollWarningMessage":"Le désenrôlement révoquera votre accès à certaines applications auxquelles vous avez droit. Souhaitez-vous constinuer ?",
        "appCenter.action.add":"Ajouter+",
        "userInfo.unenroll":"Se désenrôler",
        "myapps.welcomeMsg": "Bonjour {0}. Voici vos applications !",
        "api.updateApps": "Mise à jour de la liste...",
        "installStatus.enrollDevice": "L’utilisation de {0} nécessite l’activation des services Workspace pour protéger les données d’entreprise.",
        "installStatus.unenrolledDevice": "Cette application n’est plus disponible pour vous.",
        "changeOccurred": "Une modification est survenue",
        "appCenter.auth.mdmError": "Toutes les applications n’ont pas pu être chargées. Une erreur de configuration ou de réseau est survenue lors de la communication avec le MDM.",
        "appCenter.device.status.commError": "Le MDM a abouti a rencontré une erreur lors de la récupération des applications pour votre terminal.",
        "appCenter.device.status.deviceInputError": "Terminal non valide ! Veuillez contacter votre administrateur informatique.",
        "appCenter.device.mdmApps.notFoundError": "Le MDM n'a trouvé aucune application attribuée à votre terminal. ",
        "appCenter.nav.browseBy": "Rechercher par ",
        "app.launchPassword.heading": "Demande de mot de passe ",
        "app.launchPassword.view.instruction": "Votre mot de passe est requis pour vous connecter à cette ressource Windows {0}.",
        "app.launchPassword.label.userName": "Utilisateur",
        "app.launchPassword.label.password": "Mot de passe",
        "app.launchPassword.button.label.signin": "Connexion",
        "appCenter" : "Centre d'applications",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/télécharger",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop doit être téléchargé sur cet ordinateur pour ouvrir cette application. <a target='_blank' href='{0}'>Installez VMware Identity Manager Desktop</a> si vous ne l'avez pas encore fait.",
        "viewAppsTooltip":"L'application hébergée Horizon View nécessite l'installation de {0} Horizon Client{1} 3.0, ou versions ultérieures, sur votre ordinateur.",
        "desktoneDesktopTooltip":"Ce Bureau Horizon DaaS nécessite l'installation de {0} Horizon View {1} sur votre ordinateur.",
        "desktoneApplicationTooltip":"Cette application Horizon DaaS nécessite l'installation de {0} Horizon View {1} sur votre ordinateur.",
        "xenAppsReceiverNotDetected": "Citrix Receiver doit être installé sur cet ordinateur pour ouvrir cette application. <a target='_blank' href='{0}'>Installez Citrix Receiver</a> si vous ne l'avez pas encore fait.",
        "button.save" : "Enregistrer",
        "button.openHorizonView": "Ouvrir Horizon Client",
        "myapps.launch.openApp": "Ouvrir {0}",
        "button.openApp": "Ouvrir l'application ",
        "button.clear": "Effacer",
        "button.close": "Fermer",
        "myapps.launch.view.openWith": "Ouvrir avec",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(par défaut)",
        "myapps.launch.view.selectPreferredLaunchClient": "Sélectionnez une option de lancement des applications et Bureaux Horizon.",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "Sélectionnez une option de lancement par défaut...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Cela détermine l'option de lancement par défaut lorsque vous choisissez d'ouvrir un Bureau View depuis votre terminal. Si vous sélectionnez View comme option par défaut, Horizon Client doit être préalablement installé. <a target='_blank' href='{0}'>Installez Horizon Client</a> si vous ne l’avez pas encore fait.",
        "myapps.launch.view.unknownClientType": "Type de client inconnu pour ouvrir Horizon Client",
        "myapps.launch.view.openWithView" : "Ouvrir avec Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Ouvrir avec Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "En sélectionnant Browser, votre application Horizon View s’ouvrira dans une nouvelle fenêtre Browser.  ",
        "myapps.launch.view.preferredClient.byViewClient.description": "Cet élément nécessite Horizon Client 3.0 ou versions ultérieures. <a target='_blank' href='{0}'>Installez Horizon Client</a> si vous ne l'avez pas encore fait.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Vous pouvez à tout moment modifier ce paramètre dans les préférences.",
        "myapps.launch.msg.launching.desktop":"Lancement du Bureau <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Lancement de l’application <b>{0}</b> .....",
        "myapps.noAppsMsg": "Vous n'avez ajouté aucune application. Vous pouvez naviguer vers {0} pour ajouter des applications. ",
        "myapps.noFavAppsMsg": "Vous n'avez ajouté aucune application à vos favoris.",
        "myapps.dialog.openApp": "OUVRIR",
        "myapps.dialog.openAppWithViewClient": "Lancer avec Horizon Client ",
        "myapps.dialog.openAppWithBrowser": "Lancer avec Browser",
        "deviceStatus.networkLost" : "Vous avez perdu la connexion réseau.",
        "deviceStatus.networkRestored" : "Connexion réseau rétablie",
        "api.session.expired.retry":"Session expirée, renouvellement en cours...",
        "api.error":"Une erreur est survenue. Veuillez réessayer. ",
        "api.timeout":"Délai de connexion dépassé. Veuillez réessayer. ",
        "favoriteStatus.favorite" : "Ajouter aux favoris",
        "favoriteStatus.unfavorite" : "Supprimer des favoris",
        "favoriteStatus.offlineFavoriteMessage": "L’ajout d’une application aux favoris n’est pas possible hors ligne. Veuillez vous reconnecter et réessayer.",
        "error.failToFavoriteApp": "Échec de mise à jour du statut des favoris",
        "error.failToHideApp": "Échec de suppression de l'application",
        "error.failToShowApp": "Échec de l'ajout de l'application au Launcher ",
        "installStatus.offlineInstallMessage": "Les demandes d’installation ne sont pas possibles hors ligne. Veuillez vous reconnecter et réessayer.",
        "installStatus.activated": "Activé",
        "installStatus.notActivated": "Non activée",
        "installStatus.request": "Demande",
        "installStatus.update": "Actualiser",
        "installStatus.processing": "Traitement en cours",
        "installStatus.installFailedMessage": "Veuillez réessayer puis contacter votre administrateur informatique si le problème persiste. ",
        "requestFailed": "Échec de la requête",
        "requestSuccessful": "Demande réussie",
        "accept": "Accepter",
        "decline": "Refuser",
        "termsOfUse": "Conditions d'utilisation",
        "beforeInstallation": "Avant l'installation",
        "resetDesktopStatus.offlineMessage": "La réinitialisation d’un Bureau n’est pas possible hors ligne. Veuillez vous reconnecter et réessayer.",
        "error.failToResetDesktop": "Échec de réinitialisation du Bureau",
        "resetDesktop.sucess": "Réinitialisation du Bureau réussie",
        "appCenter.someAppsMissingMessage": "Toutes les applications n’ont pas pu être lancées.",
        "appCenter.device.status.notRegistered": "Le terminal n'est pas inscrit.",
        "appCenter.device.status.blackListed": "Ce terminal est sur liste noire.",
        "appCenter.device.status.unknownError": "Une erreur inconnue est survenue.",
        "appCenter.device.register": "Inscrire le terminal",
        "appCenter.device.moreDetails":"Plus de détails",
        "appCenter.noAppsMsg": "Aucune application disponible actuellement",
        "appCenter.noSearchResults": "Aucun résultat trouvé",
        "appCenter.vppInviteTitle": "Inscription de la distribution gérée",
        "appCenter.appInstallConfirmPromptTitle": "Confirmer l'installation",
        "appCenter.acceptInvite": "Accepter l'invitation ",
        "appCenter.install": "Installer",
        "appCenter.proceed": "Continuer",
        "appCenter.cancel": "Annuler",
        "appCenter.searchApps": "Rechercher des applications ",
        "appCenter.welcomeMsg": "Installer de nouvelles applications n'importe où, sur n'importe quel terminal",
        "appCenter.done": "Terminé",
        "appCenter.nav.privacyPage": "Page de confidentialité ",
        "appCenter.nav.catalog": "Catalogue",
        "appCenter.nav.myApps": "Mes applications",
        "appCenter.nav.favorites": "Favoris",
        "appCenter.nav.categories": "Catégories",
        "appCenter.nav.filterby": "Filtrer par",
        "appCenter.nav.show": "Afficher",
        "appCenter.nav.settings": "Paramètres",
        "appCenter.nav.sortBy": "Trier par ",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtrer",
        "appCenter.action.install": "Installer",
        "appCenter.action.installed": "Installé",
        "appCenter.action.added": "Ajouté",
        "appCenter.action.processing": "Traitement en cours",
        "appCenter.action.update": "Actualiser",
        "appCenter.action.request": "Demande",
        "appCenter.type.web": "Application Web",
        "appCenter.type.native": "Application native",
        "appCenter.type.native.platform": "Application {0} ",
        "appCenter.type.virtual": "Application virtuelle",
        "myapp.nav.categories": "Catégories",
        "myapp.nav.favorites": "Vidéos favorites",
        "myapp.nav.allApps": "Toutes les applications",
        "myapp.label.new": "Nouveau",
        "myapp.nav.filterby": "Filtrer par",
        "userInfo.adminConsole":"Console d'administration",
        "userInfo.preferences":"Préférences",
        "userInfo.about":"À propos",
        "userInfo.devices":"Terminaux",
        "userInfo.signout":"Déconnexion",
        "app.details.link.back": "Retour",
        "app.details.nav.details": "Détails",
        "app.details.nav.reviews": "Avis",
        "app.details.label.description": "Description",
        "app.details.label.seeFullDetails": "Afficher tous les détails...",
        "app.details.label.information": "Informations",
        "app.details.label.category": "Catégories",
        "app.details.label.version": "Version",
        "app.details.label.type": "Type :",
        "app.details.label.type.SAML11": "Application Web",
        "app.details.label.type.SAML20": "Application Web",
        "app.details.label.type.WEBAPPLINK": "Application Web",
        "app.details.label.type.WSFED12": "Application Web",
        "app.details.label.type.XENAPP": "Application Xen",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Bureau Citrix",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "Afficher le bureau",
        "app.details.label.type.VIEWAPP": "Afficher l'application",
        "app.details.label.type.DESKTONEDESKTOP": "Bureau Desktone",
        "app.details.label.type.DESKTONEAPPLICATION": "Application Desktone",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Taille",
        "app.details.label.price": "Tarif",
        "app.details.label.screenshots": "Captures d'écran",
        "app.details.label.requirement": "Conditions :",
        "app.details.label.packageName": "Nom du package :",
        "app.details.thinapp.requirement": "Cette application ne fonctionne que sur un ordinateur Windows disposant d'Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "Ce Bureau Horizon View nécessite l'installation de {0} Horizon Client {1} 3.0, ou versions ultérieures, sur votre ordinateur.",
        "app.details.viewapp.requirement": "Cette application hébergée Horizon View nécessite l'installation de {0} Horizon Client {1} 3.0, ou versions ultérieures, sur votre ordinateur.",
        "app.details.xenapp.requirement": "Cette application nécessite l'installation de {0} Citrix Receiver {1}.",
        "app.details.xenapp.msg.IE8OrLower":"L'application nécessite l’installation de Citrix Receiver. Remarque : cette application ne peut pas être ouverte sur Internet Explorer 8. ",
        "app.details.xenappsDeliveryGroup.requirement":"Ce Bureau Citrix nécessite l'installation de {0} Citrix Receiver {1}.",
        "app.details.desktoneDesktop.requirement": "Ce Bureau Horizon DaaS nécessite l'installation du {0} client Horizon {1} sur votre ordinateur.",
        "app.details.desktoneApp.requirement": "Cette application Horizon DaaS nécessite l'installation du {0} client Horizon {1} sur votre ordinateur.",
        "app.details.abbrev.megabytes": "Mo",
        "app.details.noData": "Aucune information disponible",
        "app.details.noScreenshots": "Aucune capture d'écran disponible",
        "app.details.noDescription": "Aucune description disponible",
        "app.details.needsDeviceEnrollment": "Nécessite l'enrôlement du terminal.",
        "app.settings.label.settings": "Paramètres",
        "app.settings.link.back": "Retour",
        "app.settings.managedDevices": "Terminaux gérés",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOGUE",
        "app.about.heading":"À propos de VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Politique de confidentialité",
        "app.about.button.label.patents":"Brevet",
        "app.about.button.label.licenseAgreement":"Contrat de licence",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-fr",
        "app.about.licenseAgreementLink":"http://www.vmware.com/fr/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/fr/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Terminaux",
        "app.devices.tableColumn.deviceName":"Nom du terminal",
        "app.devices.tableColumn.userDeviceId":"ID du terminal",
        "app.devices.tableColumn.lastLoginTime":"Heure de la dernière connexion",
        "app.devices.unlinkDevice":"Dissocier",
        "app.devices.unlinkedDevice": "Dissocié",
        "app.devices.emptyDeviceListTitle": "Vous ne disposez d'aucun ordinateur associé.",
        "app.devices.emptyDeviceListMessage": "Pour associer un ordinateur, vous devez installer et enregistrer VMware Identity Manager Desktop pour Windows.",

        "app.thinappMultiDeviceAct.heading":"Cette application sera ajoutée aux terminaux approuvés. Pour utiliser \"{0}\" sur d’autres terminaux, recherchez le nom du terminal ci-dessous puis cliquez sur le bouton « Demande ».",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Nom du terminal",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Statut",
        "app.thinappMultiDeviceAct.button.request":"Demande",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Refusée",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"En attente",
        "app.thinappMultiDeviceAct.activationState.activated":"Approuvée",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Non activée",
        "app.setAppPassword.heading":"Créez un mot de passe pour l’application {0}.",
        "app.setAppPassword.instruction":"Utilisez le formulaire ci-dessous pour créer un mot de passe pour cette application. Le mot de passe doit comporter au moins trois caractères. ",
        "app.setAppPassword.label.password": "Mot de passe",
        "app.setAppPassword.label.confirmPassword": "Confirmer le mot de passe",
        "app.setAppPassword.label.generate": "Générer le mot de passe",
        "app.setAppPassword.error.passwordsNoMatch": "Les mots de passe ne correspondent pas.",
        "app.setAppPassword.msg.success": "Création de votre mot de passe d'application réussie. ",
        "app.setAppPassword.msg.fail": "Une erreur est survenue lors de la création de votre mot de passe. Veuillez réessayer.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installer",
        "app.banner.open":"Ouvrir",
        "button.cancel":"Annuler",
        "myapps.launch.passwordvault.installExtension.description":"Cette application peut utiliser l'extension du navigateur de Password Vault. <a target='_blank' href='{0}'>Installez l'extension</a> si vous ne l'avez pas déjà fait.",
        "installMessage.continueInstall":"Vous avez déjà essayé d'installer cette application. ",
        "installMessage.proceedToInstall":"Cliquez pour continuer.",
        "appCenter.device.status.confError":"Le MDM n'a pu trouver aucune information sur votre terminal.",
        "appCenter.device.unEnrollWarningTitle":"Attention",
        "appCenter.device.mdmUnEnrollMessage":"Supprimez toutes les données et applications Workspace ONE de ce terminal.",
        "appCenter.device.disableWorkspaceMessage":"La suppression de votre compte entraînera la révocation de l'accès accordé via l'application Workspace ONE. Les applications téléchargées sur votre springboard resteront installées mais l'accès peut être interrompu. Voulez-vous continuer ? ",
        "appCenter.internalApp.installationStepTitle":"Pour ouvrir cette application, suivez ces étapes après l'installation : ",
        "appCenter.internalApp.step1":"Lancer la section Paramètres depuis l'écran d'accueil de votre iPhone",
        "appCenter.internalApp.step2":"Appuyer sur Général",
        "appCenter.internalApp.step3":"Appuyer sur la section Gestion du terminal et du profil ",
        "appCenter.internalApp.step4":"Appuyer sur le nom du développeur de l'application sous Application d'entreprise",
        "appCenter.internalApp.step5":"Vérifier ou se fier à l'application",
        "appCenter.internalApp.watchTutorial":"Regarder le tutoriel étape par étape",
        "userInfo.removeAccount":"Supprimer le compte",
        "userInfo.account":"Compte",
        "userInfo.password":"Mot de passe",
        "app.changePassword.title":"Modifier le mot de passe",
        "app.changePassword.enterCurrentPassword":"Saisir le mot de passe actuel",
        "app.changePassword.enterNewPassword":"Saisir un nouveau mot de passe",
        "app.changePassword.confirmNewPassword":"Confirmer le nouveau mot de passe",
        "app.changePassword.error.passwordsNoMatch":"Les nouveaux mots de passe ne correspondent pas.",
        "app.changePassword.success":"Nouveau mot de passe enregistré !",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Téléphone",
        "app.logout.confirm.msg":"La déconnexion de Workspace ONE terminera votre session en cours. Toutes les applications téléchargées depuis le catalogue resteront sur le terminal, mais aucune nouvelle application ne sera disponible avant que vous ne vous reconnectiez. ",
        "app.logout.title":"AVERTISSEMENT",
        "app.passwordVault.banner.msg":"Vous disposez d'applications pouvant utiliser l'extension du navigateur de Password Vault",
        "app.passwordVault.banner.button.install":"Installer"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"מערכת Workspace ONE נמצאת באופן זמני במצב תחזוקה. תוכל להפעיל את האפליקציות שלך, אבל ייתכן וחלק מהתכונות לא יפעלו.",
        "appCenter.device.unEnrollWarningMessage":"כאשר תבטל את ההרשמה, תאבד את הגישה למספר אפליקציות שאתה זכאי להן. האם ברצונך להמשיך?",
        "appCenter.action.add":"הוסף+",
        "userInfo.unenroll":"בטל הרשמה",
        "myapps.welcomeMsg": "שלום {0}. הנה כל היישומים שלך!",
        "api.updateApps": "מעדכן את הרשימה...",
        "installStatus.enrollDevice": "השימוש ב-{0} מחייב הפעלה של 'שירותי Workspace' כדי להגן על נתוני החברה",
        "installStatus.unenrolledDevice": "יישום זה כבר אינו זמין עבורך. לחץ על 'אישור' כדי לעדכן את הרשימה.",
        "changeOccurred": "אירע שינוי",
        "appCenter.auth.mdmError": "כרגע לא ניתן לטעון את כל היישומים. ישנה שגיאת תצורה או רשת בעת התקשורת עם MDM",
        "appCenter.device.status.commError": "MDM הוביל לשגיאה בעת שליפת יישומים עבור ההתקן",
        "appCenter.device.status.deviceInputError": "התקן זה לא חוקי! תור קשר עם מנהל ה-IT",
        "appCenter.device.mdmApps.notFoundError": "MDM לא מצא יישומים המוקצים להתקן",
        "appCenter.nav.browseBy": "עיין לפי",
        "app.launchPassword.heading": "בקשת סיסמה",
        "app.launchPassword.view.instruction": "יש צורך בסיסמה כדי להיכנס למשאב חלונות זה {0}.",
        "app.launchPassword.label.userName": "משתמש",
        "app.launchPassword.label.password": "סיסמה",
        "app.launchPassword.button.label.signin": "כניסה",
        "appCenter" : "מרכז האפליקציות",
        "ok" : "אשר",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "יש להתקין את VMware Identity Manager Desktop במכשיר זה כדי לפתוח אפליקציה זו. <a target='_blank' href='{0}'>התקן את VMware Identity Manager Desktop‏</a> אם עוד לא עשית זאת.",
        "viewAppsTooltip":"אפליקציית View המתארחת דורשת התקנה של {0} Horizon Client‏{1} גרסה 3.0 ואילך במחשב שלך.",
        "desktoneDesktopTooltip":"שולחן עבודה זה של Horizon DaaS דורש התקנה של {0} Horizon View‏ {1} במחשב שלך.",
        "desktoneApplicationTooltip":"אפליקציית Horizon DaaS דורשת התקנה של {0} Horizon View‏ {1} במחשב שלך.",
        "xenAppsReceiverNotDetected": "יש להתקין את Citrix Receiver במחשב זה כדי לפתוח אפליקציה זו. <a target='_blank' href='{0}'>התקן את Citrix Receiver‏</a> אם עוד לא עשית זאת.",
        "button.save" : "שמור",
        "button.openHorizonView": "פתח את Horizon Client",
        "myapps.launch.openApp": "פתח את {0}",
        "button.openApp": "פתח אפליקציה",
        "button.clear": "נקה",
        "button.close": "סגור",
        "myapps.launch.view.openWith": "פתח עם",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(ברירת מחדל)",
        "myapps.launch.view.selectPreferredLaunchClient": "בחר כיצד ברצונך להפעיל שולחנות עבודה ואפליקציות של Horizon",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "בחר ברירת מחדל להפעלה...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "אפשרות זו קובעת את התנהגות ברירת המחדל כאשר תבחר להפעיל שולחן עבודה של View במכשיר שלך. אם תבחר את View כברירת המחדל שלך, עליך להתקין את Horizon Client. ‏‎<a target='_blank' href='{0}'>‎התקן את Horizon Client‏‎</a>‎ אם עוד לא עשית זאת.",
        "myapps.launch.view.unknownClientType": "סוג לקוח לא מוכר לפתיחת Horizon Client.",
        "myapps.launch.view.openWithView" : "פתח עם Horizon Client",
        "myapps.launch.view.openWithBrowser" : "פתח עם Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "אם תבחר Browser, ‏View תיפתח בחלון דפדפן חדש.",
        "myapps.launch.view.preferredClient.byViewClient.description": "פריט זה דורש את Horizon Client 3.0 ואילך. ‎<a target='_blank' href='{0}'>‎התקן את Horizon Client‏‎</a>‎ אם עוד לא עשית זאת.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "תוכל לשנות הגדרה זו בכל עת בהעדפות.",
        "myapps.launch.msg.launching.desktop":"מפעיל את שולחן העבודה <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"מפעיל את האפליקציה <b>{0}</b> .....",
        "myapps.noAppsMsg": "לא הוספת אפליקציות. תוכל לנווט אל {0} כדי להוסיף אפליקציות",
        "myapps.noFavAppsMsg": "לא סימנת אפליקציות כמועדפות",
        "myapps.dialog.openApp": "פתח",
        "myapps.dialog.openAppWithViewClient": "הפעל ב-Client",
        "myapps.dialog.openAppWithBrowser": "הפעל ב-Browser",
        "deviceStatus.networkLost" : "החיבור לרשת אבד",
        "deviceStatus.networkRestored" : "חיבור לרשת שוחזר",
        "api.session.expired.retry":"פג תוקף ההפעלה, מנסה לחדש...",
        "api.error":"אירעה שגיאה, נסה שוב",
        "api.timeout":"תם הזמן הקצוב לחיבור, נסה שוב",
        "favoriteStatus.favorite" : "סמן כמועדף",
        "favoriteStatus.unfavorite" : "בטל סימון כמועדף",
        "favoriteStatus.offlineFavoriteMessage": "סימון אפליקציה כמועדפת אינו זמין כאשר אינך מקוון, אנא התחבר מחדש ונסה שוב",
        "error.failToFavoriteApp": "עדכון סטטוס ההעדפה נכשל",
        "error.failToHideApp": "הסרת האפליקציה נכשלה",
        "error.failToShowApp": "הוספת האפליקציה ל-Launcher נכשלה",
        "installStatus.offlineInstallMessage": "בקשות התקנה אינן זמינות כאשר אינך מקוון, אנא התחבר מחדש ונסה שוב",
        "installStatus.activated": "הופעל",
        "installStatus.notActivated": "לא הופעל",
        "installStatus.request": "בקשה",
        "installStatus.update": "עדכן",
        "installStatus.processing": "עיבוד",
        "installStatus.installFailedMessage": "אם הבעיה נמשכת, נסה שוב או פנה למנהל ה-IT",
        "requestFailed": "בקשה נכשלה",
        "requestSuccessful": "בקשה הצליחה",
        "accept": "קבל",
        "decline": "דחה",
        "termsOfUse": "תנאי שימוש",
        "beforeInstallation": "לפני ההתקנה",
        "resetDesktopStatus.offlineMessage": "איפוס שולחן עבודה אינו זמין כאשר אינך מקוון, אנא התחבר מחדש ונסה שוב",
        "error.failToResetDesktop": "נכשל איפוס שולחן העבודה",
        "resetDesktop.sucess": "איפוס שולחן העבודה הצליח",
        "appCenter.someAppsMissingMessage": "לא ניתן לטעון את האפליקציות בשלב זה",
        "appCenter.device.status.notRegistered": "המכשיר אינו רשום",
        "appCenter.device.status.blackListed": "המכשיר מופיע ברשימה שחורה",
        "appCenter.device.status.unknownError": "אירעה שגיאה לא ידועה",
        "appCenter.device.register": "רשום מכשיר",
        "appCenter.device.moreDetails":"פרטים נוספים",
        "appCenter.noAppsMsg": "אין אפליקציות זמינות כעת",
        "appCenter.noSearchResults": "לא נמצאו תוצאות",
        "appCenter.vppInviteTitle": "רישום הפצה מנוהלת",
        "appCenter.appInstallConfirmPromptTitle": "אשר התקנה",
        "appCenter.acceptInvite": "קבל הזמנה",
        "appCenter.install": "התקן",
        "appCenter.proceed": "המשך",
        "appCenter.cancel": "בטל",
        "appCenter.searchApps": "חפש אפליקציות",
        "appCenter.welcomeMsg": "התקן אפליקציות חדשות בכל מקום, בכל מכשיר!",
        "appCenter.done": "בוצע",
        "appCenter.nav.privacyPage": "דף פרטיות",
        "appCenter.nav.catalog": "Catalog",
        "appCenter.nav.myApps": "האפליקציות שלי",
        "appCenter.nav.favorites": "מועדפים",
        "appCenter.nav.categories": "קטגוריות",
        "appCenter.nav.filterby": "סנן לפי",
        "appCenter.nav.show": "הצג",
        "appCenter.nav.settings": "הגדרות",
        "appCenter.nav.sortBy": "מיין לפי",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "מסנן",
        "appCenter.action.install": "התקן",
        "appCenter.action.installed": "מותקן",
        "appCenter.action.added": "נוסף",
        "appCenter.action.processing": "עיבוד",
        "appCenter.action.update": "עדכן",
        "appCenter.action.request": "בקשה",
        "appCenter.type.web": "אפליקציית אינטרנט",
        "appCenter.type.native": "אפליקציה מקורית",
        "appCenter.type.native.platform": "אפליקציה {0}",
        "appCenter.type.virtual": "אפליקציה וירטואלית",
        "myapp.nav.categories": "קטגוריות",
        "myapp.nav.favorites": "מועדפים",
        "myapp.nav.allApps": "כל האפליקציות",
        "myapp.label.new": "חדש",
        "myapp.nav.filterby": "סנן לפי",
        "userInfo.adminConsole":"מסוף בקרת מנהל",
        "userInfo.preferences":"העדפות",
        "userInfo.about":"אודות",
        "userInfo.devices":"מכשירים",
        "userInfo.signout":"התנתק",
        "app.details.link.back": "חזרה",
        "app.details.nav.details": "פרטים",
        "app.details.nav.reviews": "חוות דעת",
        "app.details.label.description": "תיאור",
        "app.details.label.seeFullDetails": "ראה פרטים מלאים...",
        "app.details.label.information": "מידע",
        "app.details.label.category": "קטגוריות",
        "app.details.label.version": "גרסה",
        "app.details.label.type": "סוג:",
        "app.details.label.type.SAML11": "אפליקציית אינטרנט",
        "app.details.label.type.SAML20": "אפליקציית אינטרנט",
        "app.details.label.type.WEBAPPLINK": "אפליקציית אינטרנט",
        "app.details.label.type.WSFED12": "אפליקציית אינטרנט",
        "app.details.label.type.XENAPP": "אפליקציית Xen",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "אפליקציית Thin",
        "app.details.label.type.VIEWPOOL": "View Desktop",
        "app.details.label.type.VIEWAPP": "אפליקציית View",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "אפליקציית Desktone",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "גודל",
        "app.details.label.price": "מחיר",
        "app.details.label.screenshots": "צילומי מסך",
        "app.details.label.requirement": "דרישה:",
        "app.details.label.packageName": "שם חבילה:",
        "app.details.thinapp.requirement": "אפליקציה זו עובדת רק במחשבי Windows שמותקן עליהם Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "שולחן עבודה זה של View דורש התקנה של {0} Horizon Client‏ {1} גרסה 3.0 ואילך במחשב שלך.",
        "app.details.viewapp.requirement": "אפליקציית View המתארחת דורשת התקנה של {0} Horizon Client‏{1} גרסה 3.0 ואילך במחשב שלך.",
        "app.details.xenapp.requirement": "אפליקציה זו דורשת התקנה של {0} Citrix Receiver‏ {1}.",
        "app.details.xenapp.msg.IE8OrLower":"אפליקציה זו דורשת התקנה של Citrix Receiver. הערה: לא ניתן לפתוח אפליקציה זו ב-Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"שולחן עבודה זה של Citrix דורש התקנה של {0} Citrix Receiver‏ {1}.",
        "app.details.desktoneDesktop.requirement": "שולחן עבודה זה של Horizon DaaS דורש התקנה של {0} Horizon Client‏ {1} במחשב שלך.",
        "app.details.desktoneApp.requirement": "אפליקציית Horizon DaaS דורשת התקנה של {0} Horizon Client‏ {1} במחשב שלך.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "אין מידע זמין",
        "app.details.noScreenshots": "אין צילומי מסך זמינים",
        "app.details.noDescription": "אין תיאור זמין",
        "app.details.needsDeviceEnrollment": "נדרשת הרשמת מכשיר",
        "app.settings.label.settings": "הגדרות",
        "app.settings.link.back": "חזרה",
        "app.settings.managedDevices": "מכשירים מנוהלים",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"אודות VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"מדיניות פרטיות",
        "app.about.button.label.patents":"פטנט",
        "app.about.button.label.licenseAgreement":"הסכם רישיון",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/il/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/il/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/il/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"מכשירים",
        "app.devices.tableColumn.deviceName":"שם מכשיר",
        "app.devices.tableColumn.userDeviceId":"זיהוי מכשיר",
        "app.devices.tableColumn.lastLoginTime":"שעת כניסה אחרונה",
        "app.devices.unlinkDevice":"בטל קישור",
        "app.devices.unlinkedDevice": "בוטל קישור",
        "app.devices.emptyDeviceListTitle": "אין לך מחשבים מקושרים.",
        "app.devices.emptyDeviceListMessage": "כדי לקשר מחשב, עליך להתקין את VMware Identity Manager Desktop עבור Windows  ולהירשם אליו.",

		"app.thinappMultiDeviceAct.heading":"אפליקציה זו תתווסף למכשירים המאושרים. כדי להשתמש ב-'{0}' במכשירים נוספים, מצא את שם המכשיר למטה ולחץ על הלחצן 'בקשה'.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"שם מכשיר",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"סטטוס",
        "app.thinappMultiDeviceAct.button.request":"בקשה",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"נדחה",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"ממתין",
        "app.thinappMultiDeviceAct.activationState.activated":"מאושר",
        "app.thinappMultiDeviceAct.activationState.notActivated":"לא הופעל",
        "app.setAppPassword.heading":"הגדר סיסמאות עבור האפליקציה {0}",
        "app.setAppPassword.instruction":"השתמש בטופס למטה כדי להגדיר סיסמה עבור אפליקציה זו. הסיסמה חייבת להיות באורך שלושה תווים לפחות.",
        "app.setAppPassword.label.password": "סיסמה",
        "app.setAppPassword.label.confirmPassword": "אמת סיסמה",
        "app.setAppPassword.label.generate": "צור סיסמה",
        "app.setAppPassword.error.passwordsNoMatch": "סיסמאות לא תואמות.",
        "app.setAppPassword.msg.success": "סיסמת האפליקציה הוגדרה בהצלחה.",
        "app.setAppPassword.msg.fail": "אירעה שגיאה בעת הניסיון להגדיר את הסיסמה שלך. אנא נסה שוב.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"התקן",
        "app.banner.open":"פתח",
        "button.cancel":"בטל",
        "myapps.launch.passwordvault.installExtension.description":"אפליקציה זו יכולה לעשות שימוש בהרחבת הדפדפן Password Vault.‏ <a target='_blank' href='{0}'>התקן את ההרחבה</a> אם עדיין לא עשית זאת.",
        "installMessage.continueInstall":"ניסית בעבר להתקין אפליקציה זו. ",
        "installMessage.proceedToInstall":"הקש כדי להמשיך.",
        "appCenter.device.status.confError":"מערכת ה-MDM לא מצאה שום מידע על המכשיר שלך.",
        "appCenter.device.unEnrollWarningTitle":"אזהרה",
        "appCenter.device.mdmUnEnrollMessage":"הסר את כל הנתונים והאפליקציות של Workspace ONE ממכשיר זה.",
        "appCenter.device.disableWorkspaceMessage":"הסרת החשבון תשלול את הגישה שניתנה דרך אפליקציית Workspace ONE. אפליקציות שהורדו למסך הבית יישארו מותקנות, אבל ייתכן ותנותק הגישה. האם ברצונך להמשיך?",
        "appCenter.internalApp.installationStepTitle":"כדי לפתוח אפליקציה זו, עקוב אחר השלבים הבאים לאחר ההתקנה",
        "appCenter.internalApp.step1":"פתח את ההגדרות ממסך הבית של ה-iPhone ",
        "appCenter.internalApp.step2":"הקש על כללי",
        "appCenter.internalApp.step3":"הקש על ניהול התקנים",
        "appCenter.internalApp.step4":"הקש על שם המפתח מתחת לאפליקציית החברה",
        "appCenter.internalApp.step5":"אמת את האפליקציה או בטח בה",
        "appCenter.internalApp.watchTutorial":"הצג את ההדרכה שלב אחר שלב",
        "userInfo.removeAccount":"הסר חשבון",
        "userInfo.account":"חשבון",
        "userInfo.password":"סיסמה",
        "app.changePassword.title":"שנה סיסמה",
        "app.changePassword.enterCurrentPassword":"הזן סיסמה נוכחית",
        "app.changePassword.enterNewPassword":"הזן סיסמה חדשה",
        "app.changePassword.confirmNewPassword":"אמת סיסמה חדשה",
        "app.changePassword.error.passwordsNoMatch":"הסיסמאות החדשות אינן תואמות",
        "app.changePassword.success":"הסיסמה החדשה נשמרה!",
        "app.changePassword.label.email":"אימייל",
        "app.changePassword.label.phone":"טלפון",
        "app.logout.confirm.msg":"ההתנתקות מ-Workspace ONE תסיים את ההפעלה הנוכחית שלך. כל האפליקציות שהורדו מהקטלוג יישארו על המכשיר, אבל אפליקציות חדשות לא יהיו זמינות עד שתתחבר בחזרה.",
        "app.logout.title":"אזהרה",
        "app.passwordVault.banner.msg":"יש לך אפליקציות שיכולות להשתמש בהרחבת הדפדפן Password Vault.",
        "app.passwordVault.banner.button.install":"התקן"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE è al momento in modalità manutenzione. Puoi avviare le tue app, nonostante alcune funzionalità potrebbero essere difettose",
        "appCenter.device.unEnrollWarningMessage":"Una volta cancellata la registrazione, perderai accesso ad alcune app alle quali hai diritto. Vuoi continuare?",
        "appCenter.action.add":"Aggiungi+",
        "userInfo.unenroll":"Cancella registrazione",
        "myapps.welcomeMsg": "Salve {0}, ecco le tue app.",
        "api.updateApps": "Aggiornamento elenco in corso...",
        "installStatus.enrollDevice": "L’utilizzo di {0} richiede l'attivazione dei servizi Workspace per proteggere i dati aziendali",
        "installStatus.unenrolledDevice": "Quest'app non ti è più disponibile. Premi OK per aggiornare l'elenco.",
        "changeOccurred": "Si è verificata una modifica",
        "appCenter.auth.mdmError": "Non è stato possibile caricare tutte le app simultaneamente. Si è verificato un errore di configurazione o di rete durante la comunicazione con MDM",
        "appCenter.device.status.commError": "MDM ha dato luogo ad un errore durante il recupero di app per il tuo dispositivo",
        "appCenter.device.status.deviceInputError": "Questo dispositivo non è valido! Contatta il tuo amministratore IT",
        "appCenter.device.mdmApps.notFoundError": "MDM non ha trovato alcuna applicazione assegnata al tuo dispositivo",
        "appCenter.nav.browseBy": "Sfoglia per",
        "app.launchPassword.heading": "Richiesta di password",
        "app.launchPassword.view.instruction": "La tua password è necessaria per accedere a questa risorsa di windows {0}.",
        "app.launchPassword.label.userName": "Utente",
        "app.launchPassword.label.password": "password",
        "app.launchPassword.button.label.signin": "Accedi",
        "appCenter" : "Centro app",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "Per aprire questa applicazione è necessario installare VMware Identity Manager Desktop. <a target='_blank' href='{0}'>Installa VMware Identity Manager Desktop</a> se non l’hai ancora fatto.",
        "viewAppsTooltip":"Questa applicazione ospitata in View richiede che venga installato {0} Horizon Client{1} 3.0 o versione successiva sul tuo computer.",
        "desktoneDesktopTooltip":"Questo desktop Horizon DaaS richiede che venga installato {0} Horizon View {1} sul tuo computer.",
        "desktoneApplicationTooltip":"Questa applicazione Horizon DaaS richiede che venga installato {0} Horizon View {1} sul tuo computer.",
        "xenAppsReceiverNotDetected": "Per aprire questa applicazione è necessario installare Citrix Receiver su questo computer. <a target='_blank' href='{0}'>Installa Citrix Receiver</a> se non l’hai ancora fatto.",
        "button.save" : "Salva",
        "button.openHorizonView": "Apri Horizon Client",
        "myapps.launch.openApp": "Apri {0}",
        "button.openApp": "Apri app",
        "button.clear": "Elimina",
        "button.close": "Chiudi",
        "myapps.launch.view.openWith": "Apri con",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(predefinito)",
        "myapps.launch.view.selectPreferredLaunchClient": "Seleziona la modalità di avvio delle applicazioni e dei desktop Horizon",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "SCEGLI UNA MODALITÀ DI AVVIO PREDEFINITA...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Questa selezione determina il comportamento di avvio predefinito per l'apertura del desktop View dal tuo dispositivo. Per scegliere View come opzione predefinita, è necessario avere installato Horizon Client. <a target='_blank' href='{0}'>Installa Horizon Client</a> se non l'hai ancora fatto.",
        "myapps.launch.view.unknownClientType": "Tipo di client sconosciuto per l'apertura di Horizon Client.",
        "myapps.launch.view.openWithView" : "Apri con Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Apri con il browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Se selezioni Browser, View verrà aperto in una nuova finestra del browser.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Questo elemento richiede Horizon Client 3.0 o versione successiva. <a target='_blank' href='{0}'>Installa Horizon Client</a> se non l'hai ancora fatto.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Puoi cambiare questa impostazione in qualsiasi momento nelle preferenze.",
        "myapps.launch.msg.launching.desktop":"Avvio del desktop <b>{0}</b> in corso...",
        "myapps.launch.msg.launching.application":"Avvio dell'applicazione <b>{0}</b> in corso...",
        "myapps.noAppsMsg": "Non hai aggiunto alcuna app. Puoi visitare {0} per aggiungere applicazioni",
        "myapps.noFavAppsMsg": "Non hai aggiunto ai Preferiti alcuna app",
        "myapps.dialog.openApp": "APRI",
        "myapps.dialog.openAppWithViewClient": "Avvia in Client",
        "myapps.dialog.openAppWithBrowser": "Avvia nel browser",
        "deviceStatus.networkLost" : "Connessione di rete persa",
        "deviceStatus.networkRestored" : "Connessione di rete ripristinata",
        "api.session.expired.retry":"Sessione scaduta. Tentativo di rinnovo in corso...",
        "api.error":"Si è verificato un errore. Riprova.",
        "api.timeout":"Timeout della connessione. Riprova.",
        "favoriteStatus.favorite" : "Aggiungi ai Preferiti",
        "favoriteStatus.unfavorite" : "Rimuovi dai Preferiti",
        "favoriteStatus.offlineFavoriteMessage": "L'aggiunta di un'app ai Preferiti non è disponibile offline. Riconnettiti e riprova.",
        "error.failToFavoriteApp": "Impossibile aggiornare lo stato dei preferiti",
        "error.failToHideApp": "Impossibile rimuovere l'app",
        "error.failToShowApp": "Impossibile aggiungere l'app all'Utilità di avvio",
        "installStatus.offlineInstallMessage": "Le richieste di installazione non sono disponibili offline. Riconnettiti e riprova.",
        "installStatus.activated": "Attivato",
        "installStatus.notActivated": "Non attivato",
        "installStatus.request": "Richiesta",
        "installStatus.update": "Aggiorna",
        "installStatus.processing": "Elaborazione in corso...",
        "installStatus.installFailedMessage": "Riprova. Se il problema persiste, contatta il tuo amministratore IT",
        "requestFailed": "Richiesta non andata a buon fine",
        "requestSuccessful": "Richiesta andata a buon fine",
        "accept": "Accetta",
        "decline": "Rifiuta",
        "termsOfUse": "Condizioni per l'utilizzo",
        "beforeInstallation": "Prima dell'installazione",
        "resetDesktopStatus.offlineMessage": "La reimpostazione di un desktop non è disponibile offline. Riconnettiti e riprova.",
        "error.failToResetDesktop": "Reimpostazione del desktop non riuscita",
        "resetDesktop.sucess": "Reimpostazione del desktop riuscita",
        "appCenter.someAppsMissingMessage": "Impossibile caricare tutte le app contemporaneamente",
        "appCenter.device.status.notRegistered": "Dispositivo non registrato",
        "appCenter.device.status.blackListed": "Questo dispositivo è inserito nella lista nera",
        "appCenter.device.status.unknownError": "Si è verificato un errore sconosciuto",
        "appCenter.device.register": "Registra dispositivo",
        "appCenter.device.moreDetails":"Ulteriori dettagli",
        "appCenter.noAppsMsg": "Nessuna app attualmente disponibile",
        "appCenter.noSearchResults": "Nessun risultato trovato",
        "appCenter.vppInviteTitle": "Registrazione della distribuzione gestita",
        "appCenter.appInstallConfirmPromptTitle": "Conferma installazione",
        "appCenter.acceptInvite": "Accetta invito",
        "appCenter.install": "Installa",
        "appCenter.proceed": "Continua",
        "appCenter.cancel": "Annulla",
        "appCenter.searchApps": "Cerca tra le app",
        "appCenter.welcomeMsg": "Installa nuove app da qualsiasi luogo, su qualsiasi dispositivo",
        "appCenter.done": "Fatto",
        "appCenter.nav.privacyPage": "Pagina della privacy",
        "appCenter.nav.catalog": "Catalogo",
        "appCenter.nav.myApps": "Le mie app",
        "appCenter.nav.favorites": "Preferiti",
        "appCenter.nav.categories": "Categorie",
        "appCenter.nav.filterby": "Filtra per",
        "appCenter.nav.show": "Mostra",
        "appCenter.nav.settings": "Impostazioni",
        "appCenter.nav.sortBy": "Ordina per",
        "appCenter.nav.sortBy.alpha": "Ordine alfabetico",
        "appCenter.nav.filter": "Filtro",
        "appCenter.action.install": "Installa",
        "appCenter.action.installed": "Installati",
        "appCenter.action.added": "Aggiunti",
        "appCenter.action.processing": "Elaborazione in corso...",
        "appCenter.action.update": "Aggiorna",
        "appCenter.action.request": "Richiesta",
        "appCenter.type.web": "App del web",
        "appCenter.type.native": "App nativa",
        "appCenter.type.native.platform": "App {0}",
        "appCenter.type.virtual": "App virtuale",
        "myapp.nav.categories": "Categorie",
        "myapp.nav.favorites": "Preferiti",
        "myapp.nav.allApps": "Tutte le app",
        "myapp.label.new": "Nuovo",
        "myapp.nav.filterby": "Filtra per",
        "userInfo.adminConsole":"Console dell'amministratore",
        "userInfo.preferences":"Preferenze",
        "userInfo.about":"Informazioni",
        "userInfo.devices":"Dispositivi",
        "userInfo.signout":"Esci",
        "app.details.link.back": "Indietro",
        "app.details.nav.details": "Dettagli",
        "app.details.nav.reviews": "Recensioni",
        "app.details.label.description": "Descrizione",
        "app.details.label.seeFullDetails": "Visualizza tutti i dettagli...",
        "app.details.label.information": "Informazioni",
        "app.details.label.category": "Categorie",
        "app.details.label.version": "Versione",
        "app.details.label.type": "Tipo:",
        "app.details.label.type.SAML11": "App del web",
        "app.details.label.type.SAML20": "App del web",
        "app.details.label.type.WEBAPPLINK": "App del web",
        "app.details.label.type.WSFED12": "App del web",
        "app.details.label.type.XENAPP": "XenApp",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Desktop Citrix",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "Desktop View",
        "app.details.label.type.VIEWAPP": "App View",
        "app.details.label.type.DESKTONEDESKTOP": "Desktop Desktone",
        "app.details.label.type.DESKTONEAPPLICATION": "App Desktone",
        "app.details.label.type.APPV": "App-V",
        "app.details.label.size": "Dimensioni",
        "app.details.label.price": "Prezzo",
        "app.details.label.screenshots": "Screenshot",
        "app.details.label.requirement": "Requisito:",
        "app.details.label.packageName": "Nome del pacchetto:",
        "app.details.thinapp.requirement": "Questa applicazione funziona solo su un computer Windows con installato Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "Questo desktop View richiede che venga installato {0} Horizon Client{1} 3.0 o versione successiva sul tuo computer.",
        "app.details.viewapp.requirement": "Questa applicazione in hosting di View richiede che venga installato {0} Horizon Client{1} 3.0 o versione successiva sul tuo computer.",
        "app.details.xenapp.requirement": "Questa applicazione richiede che venga installato {0} Citrix Receiver {1}.",
        "app.details.xenapp.msg.IE8OrLower":"Questa applicazione richiede che venga installato Citrix Receiver. Nota: questa applicazione non può essere aperta in Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Questo desktop Citrix richiede che venga installato {0} Citrix Receiver {1}.",
        "app.details.desktoneDesktop.requirement": "Questo desktop Horizon DaaS richiede che venga installato {0} Horizon Client {1} sul tuo computer.",
        "app.details.desktoneApp.requirement": "Questa applicazione Horizon DaaS richiede che venga installato {0} Horizon Client {1} sul tuo computer.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Nessuna informazione disponibile",
        "app.details.noScreenshots": "Nessuno screenshot disponibile",
        "app.details.noDescription": "Nessuna descrizione disponibile",
        "app.details.needsDeviceEnrollment": "Richiede la registrazione del dispositivo",
        "app.settings.label.settings": "Impostazioni",
        "app.settings.link.back": "Indietro",
        "app.settings.managedDevices": "Dispositivi gestiti",
        "app.nav.tab.launcher":"UTILITÀ DI AVVIO",
        "app.nav.tab.catalog":"CATALOGO",
        "app.about.heading":"Informazioni su VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Criteri della privacy",
        "app.about.button.label.patents":"Brevetto",
        "app.about.button.label.licenseAgreement":"Accordo di licenza",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-it",
        "app.about.licenseAgreementLink":"http://www.vmware.com/it/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/it/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Dispositivi",
        "app.devices.tableColumn.deviceName":"Nome del dispositivo",
        "app.devices.tableColumn.userDeviceId":"ID del dispositivo",
        "app.devices.tableColumn.lastLoginTime":"Ora dell’ultimo accesso",
        "app.devices.unlinkDevice":"Rimuovi il collegamento",
        "app.devices.unlinkedDevice": "Collegamento rimosso",
        "app.devices.emptyDeviceListTitle": "Non hai alcun computer collegato.",
        "app.devices.emptyDeviceListMessage": "Per collegare un computer, è necessario installare e registrare VMware Identity Manager Desktop per Windows.",

		"app.thinappMultiDeviceAct.heading":"Questa applicazione verrà aggiunta ai dispositivi approvati. Per poter utilizzare \"{0}\" su altri dispositivi, trova il nome del dispositivo qui sotto e fai clic sul pulsante \"Richiesta\".",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Nome del dispositivo",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Stato",
        "app.thinappMultiDeviceAct.button.request":"Richiesta",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Negata",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"In sospeso",
        "app.thinappMultiDeviceAct.activationState.activated":"Approvata",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Non attivato",
        "app.setAppPassword.heading":"Imposta la password per l'applicazione {0}",
        "app.setAppPassword.instruction":"Utilizza il seguente modulo per impostare la password per questa applicazione. La password deve contenere almeno tre caratteri.",
        "app.setAppPassword.label.password": "Password",
        "app.setAppPassword.label.confirmPassword": "Conferma la password",
        "app.setAppPassword.label.generate": "Genera la password",
        "app.setAppPassword.error.passwordsNoMatch": "Le password non coincidono.",
        "app.setAppPassword.msg.success": "L’impostazione della password della tua applicazione è andata a buon fine.",
        "app.setAppPassword.msg.fail": "Si è verificato un errore durante l'impostazione della tua password. Riprova.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installa",
        "app.banner.open":"Apri",
        "button.cancel":"Annulla",
        "myapps.launch.passwordvault.installExtension.description":"Questa applicazione può utilizzare l'estensione browser della Password Vault. <a target='_blank' href='{0}'>Installare l'estensione</a> se non è ancora stato fatto.",
        "installMessage.continueInstall":"Hai tentato di installare quest'app precedentemente. ",
        "installMessage.proceedToInstall":"Clicca per continuare.",
        "appCenter.device.status.confError":"MDM non ha trovato alcuna informazione a proposito del dispositivo",
        "appCenter.device.unEnrollWarningTitle":"Attenzione",
        "appCenter.device.mdmUnEnrollMessage":"Rimuovere tutte le app e i dati di Workspace ONE da questo dispositivo.",
        "appCenter.device.disableWorkspaceMessage":"La rimozione del tuo account rievocherà l'accesso concesso tramite l'app Workspace ONE. Le app scaricate al tuo springboard rimarranno installate, ma l'accesso potrebbe essere interrotto. Continuare?",
        "appCenter.internalApp.installationStepTitle":"Per poter aprire quest'app, seguire questi passaggi dopo l'installazione",
        "appCenter.internalApp.step1":"Avvia Impostazioni dallo schermo principale del tuo iPhone",
        "appCenter.internalApp.step2":"Tocca Generale",
        "appCenter.internalApp.step3":"Tocca Gestione profilo e dispositivo",
        "appCenter.internalApp.step4":"Tocca il nome dello sviluppatore app in App aziendale ",
        "appCenter.internalApp.step5":"Verificare o fidarsi dell'app",
        "appCenter.internalApp.watchTutorial":"Guarda il tutorial passo-passo",
        "userInfo.removeAccount":"Rimuovere l'account",
        "userInfo.account":"Account",
        "userInfo.password":"Password",
        "app.changePassword.title":"Cambia password",
        "app.changePassword.enterCurrentPassword":"Inserire password attuale",
        "app.changePassword.enterNewPassword":"Inserire password nuova",
        "app.changePassword.confirmNewPassword":"Confermare la password nuova",
        "app.changePassword.error.passwordsNoMatch":"La password nuova non corrisponde ",
        "app.changePassword.success":"Password nuova salvata!",
        "app.changePassword.label.email":"Email",
        "app.changePassword.label.phone":"Telefono",
        "app.logout.confirm.msg":"Uscire da Workspace ONE concluderà la sessione attuale.Qualsiasi app scaricata dal catalogo rimarrà sul dispositivo, ma nessuna app nuova sarà disponibile fino a quando non accederai di nuovo.",
        "app.logout.title":"ATTENZIONE",
        "app.passwordVault.banner.msg":"Possiedi app che possono utilizzare l'estensione browser della Password Vault.",
        "app.passwordVault.banner.button.install":"Installa"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"מערכת Workspace ONE נמצאת באופן זמני במצב תחזוקה. תוכל להפעיל את האפליקציות שלך, אבל ייתכן וחלק מהתכונות לא יפעלו.",
        "appCenter.device.unEnrollWarningMessage":"כאשר תבטל את ההרשמה, תאבד את הגישה למספר אפליקציות שאתה זכאי להן. האם ברצונך להמשיך?",
        "appCenter.action.add":"הוסף+",
        "userInfo.unenroll":"בטל הרשמה",
        "myapps.welcomeMsg": "שלום {0}. הנה כל היישומים שלך!",
        "api.updateApps": "מעדכן את הרשימה...",
        "installStatus.enrollDevice": "השימוש ב-{0} מחייב הפעלה של 'שירותי Workspace' כדי להגן על נתוני החברה",
        "installStatus.unenrolledDevice": "יישום זה כבר אינו זמין עבורך. לחץ על 'אישור' כדי לעדכן את הרשימה.",
        "changeOccurred": "אירע שינוי",
        "appCenter.auth.mdmError": "כרגע לא ניתן לטעון את כל היישומים. ישנה שגיאת תצורה או רשת בעת התקשורת עם MDM",
        "appCenter.device.status.commError": "MDM הוביל לשגיאה בעת שליפת יישומים עבור ההתקן",
        "appCenter.device.status.deviceInputError": "התקן זה לא חוקי! תור קשר עם מנהל ה-IT",
        "appCenter.device.mdmApps.notFoundError": "MDM לא מצא יישומים המוקצים להתקן",
        "appCenter.nav.browseBy": "עיין לפי",
        "app.launchPassword.heading": "בקשת סיסמה",
        "app.launchPassword.view.instruction": "יש צורך בסיסמה כדי להיכנס למשאב חלונות זה {0}.",
        "app.launchPassword.label.userName": "משתמש",
        "app.launchPassword.label.password": "סיסמה",
        "app.launchPassword.button.label.signin": "כניסה",
        "appCenter" : "מרכז האפליקציות",
        "ok" : "אשר",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "יש להתקין את VMware Identity Manager Desktop במכשיר זה כדי לפתוח אפליקציה זו. <a target='_blank' href='{0}'>התקן את VMware Identity Manager Desktop‏</a> אם עוד לא עשית זאת.",
        "viewAppsTooltip":"אפליקציית View המתארחת דורשת התקנה של {0} Horizon Client‏{1} גרסה 3.0 ואילך במחשב שלך.",
        "desktoneDesktopTooltip":"שולחן עבודה זה של Horizon DaaS דורש התקנה של {0} Horizon View‏ {1} במחשב שלך.",
        "desktoneApplicationTooltip":"אפליקציית Horizon DaaS דורשת התקנה של {0} Horizon View‏ {1} במחשב שלך.",
        "xenAppsReceiverNotDetected": "יש להתקין את Citrix Receiver במחשב זה כדי לפתוח אפליקציה זו. <a target='_blank' href='{0}'>התקן את Citrix Receiver‏</a> אם עוד לא עשית זאת.",
        "button.save" : "שמור",
        "button.openHorizonView": "פתח את Horizon Client",
        "myapps.launch.openApp": "פתח את {0}",
        "button.openApp": "פתח אפליקציה",
        "button.clear": "נקה",
        "button.close": "סגור",
        "myapps.launch.view.openWith": "פתח עם",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(ברירת מחדל)",
        "myapps.launch.view.selectPreferredLaunchClient": "בחר כיצד ברצונך להפעיל שולחנות עבודה ואפליקציות של Horizon",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "בחר ברירת מחדל להפעלה...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "אפשרות זו קובעת את התנהגות ברירת המחדל כאשר תבחר להפעיל שולחן עבודה של View במכשיר שלך. אם תבחר את View כברירת המחדל שלך, עליך להתקין את Horizon Client. ‏‎<a target='_blank' href='{0}'>‎התקן את Horizon Client‏‎</a>‎ אם עוד לא עשית זאת.",
        "myapps.launch.view.unknownClientType": "סוג לקוח לא מוכר לפתיחת Horizon Client.",
        "myapps.launch.view.openWithView" : "פתח עם Horizon Client",
        "myapps.launch.view.openWithBrowser" : "פתח עם Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "אם תבחר Browser, ‏View תיפתח בחלון דפדפן חדש.",
        "myapps.launch.view.preferredClient.byViewClient.description": "פריט זה דורש את Horizon Client 3.0 ואילך. ‎<a target='_blank' href='{0}'>‎התקן את Horizon Client‏‎</a>‎ אם עוד לא עשית זאת.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "תוכל לשנות הגדרה זו בכל עת בהעדפות.",
        "myapps.launch.msg.launching.desktop":"מפעיל את שולחן העבודה <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"מפעיל את האפליקציה <b>{0}</b> .....",
        "myapps.noAppsMsg": "לא הוספת אפליקציות. תוכל לנווט אל {0} כדי להוסיף אפליקציות",
        "myapps.noFavAppsMsg": "לא סימנת אפליקציות כמועדפות",
        "myapps.dialog.openApp": "פתח",
        "myapps.dialog.openAppWithViewClient": "הפעל ב-Client",
        "myapps.dialog.openAppWithBrowser": "הפעל ב-Browser",
        "deviceStatus.networkLost" : "החיבור לרשת אבד",
        "deviceStatus.networkRestored" : "חיבור לרשת שוחזר",
        "api.session.expired.retry":"פג תוקף ההפעלה, מנסה לחדש...",
        "api.error":"אירעה שגיאה, נסה שוב",
        "api.timeout":"תם הזמן הקצוב לחיבור, נסה שוב",
        "favoriteStatus.favorite" : "סמן כמועדף",
        "favoriteStatus.unfavorite" : "בטל סימון כמועדף",
        "favoriteStatus.offlineFavoriteMessage": "סימון אפליקציה כמועדפת אינו זמין כאשר אינך מקוון, אנא התחבר מחדש ונסה שוב",
        "error.failToFavoriteApp": "עדכון סטטוס ההעדפה נכשל",
        "error.failToHideApp": "הסרת האפליקציה נכשלה",
        "error.failToShowApp": "הוספת האפליקציה ל-Launcher נכשלה",
        "installStatus.offlineInstallMessage": "בקשות התקנה אינן זמינות כאשר אינך מקוון, אנא התחבר מחדש ונסה שוב",
        "installStatus.activated": "הופעל",
        "installStatus.notActivated": "לא הופעל",
        "installStatus.request": "בקשה",
        "installStatus.update": "עדכן",
        "installStatus.processing": "עיבוד",
        "installStatus.installFailedMessage": "אם הבעיה נמשכת, נסה שוב או פנה למנהל ה-IT",
        "requestFailed": "בקשה נכשלה",
        "requestSuccessful": "בקשה הצליחה",
        "accept": "קבל",
        "decline": "דחה",
        "termsOfUse": "תנאי שימוש",
        "beforeInstallation": "לפני ההתקנה",
        "resetDesktopStatus.offlineMessage": "איפוס שולחן עבודה אינו זמין כאשר אינך מקוון, אנא התחבר מחדש ונסה שוב",
        "error.failToResetDesktop": "נכשל איפוס שולחן העבודה",
        "resetDesktop.sucess": "איפוס שולחן העבודה הצליח",
        "appCenter.someAppsMissingMessage": "לא ניתן לטעון את האפליקציות בשלב זה",
        "appCenter.device.status.notRegistered": "המכשיר אינו רשום",
        "appCenter.device.status.blackListed": "המכשיר מופיע ברשימה שחורה",
        "appCenter.device.status.unknownError": "אירעה שגיאה לא ידועה",
        "appCenter.device.register": "רשום מכשיר",
        "appCenter.device.moreDetails":"פרטים נוספים",
        "appCenter.noAppsMsg": "אין אפליקציות זמינות כעת",
        "appCenter.noSearchResults": "לא נמצאו תוצאות",
        "appCenter.vppInviteTitle": "רישום הפצה מנוהלת",
        "appCenter.appInstallConfirmPromptTitle": "אשר התקנה",
        "appCenter.acceptInvite": "קבל הזמנה",
        "appCenter.install": "התקן",
        "appCenter.proceed": "המשך",
        "appCenter.cancel": "בטל",
        "appCenter.searchApps": "חפש אפליקציות",
        "appCenter.welcomeMsg": "התקן אפליקציות חדשות בכל מקום, בכל מכשיר!",
        "appCenter.done": "בוצע",
        "appCenter.nav.privacyPage": "דף פרטיות",
        "appCenter.nav.catalog": "Catalog",
        "appCenter.nav.myApps": "האפליקציות שלי",
        "appCenter.nav.favorites": "מועדפים",
        "appCenter.nav.categories": "קטגוריות",
        "appCenter.nav.filterby": "סנן לפי",
        "appCenter.nav.show": "הצג",
        "appCenter.nav.settings": "הגדרות",
        "appCenter.nav.sortBy": "מיין לפי",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "מסנן",
        "appCenter.action.install": "התקן",
        "appCenter.action.installed": "מותקן",
        "appCenter.action.added": "נוסף",
        "appCenter.action.processing": "עיבוד",
        "appCenter.action.update": "עדכן",
        "appCenter.action.request": "בקשה",
        "appCenter.type.web": "אפליקציית אינטרנט",
        "appCenter.type.native": "אפליקציה מקורית",
        "appCenter.type.native.platform": "אפליקציה {0}",
        "appCenter.type.virtual": "אפליקציה וירטואלית",
        "myapp.nav.categories": "קטגוריות",
        "myapp.nav.favorites": "מועדפים",
        "myapp.nav.allApps": "כל האפליקציות",
        "myapp.label.new": "חדש",
        "myapp.nav.filterby": "סנן לפי",
        "userInfo.adminConsole":"מסוף בקרת מנהל",
        "userInfo.preferences":"העדפות",
        "userInfo.about":"אודות",
        "userInfo.devices":"מכשירים",
        "userInfo.signout":"התנתק",
        "app.details.link.back": "חזרה",
        "app.details.nav.details": "פרטים",
        "app.details.nav.reviews": "חוות דעת",
        "app.details.label.description": "תיאור",
        "app.details.label.seeFullDetails": "ראה פרטים מלאים...",
        "app.details.label.information": "מידע",
        "app.details.label.category": "קטגוריות",
        "app.details.label.version": "גרסה",
        "app.details.label.type": "סוג:",
        "app.details.label.type.SAML11": "אפליקציית אינטרנט",
        "app.details.label.type.SAML20": "אפליקציית אינטרנט",
        "app.details.label.type.WEBAPPLINK": "אפליקציית אינטרנט",
        "app.details.label.type.WSFED12": "אפליקציית אינטרנט",
        "app.details.label.type.XENAPP": "אפליקציית Xen",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "אפליקציית Thin",
        "app.details.label.type.VIEWPOOL": "View Desktop",
        "app.details.label.type.VIEWAPP": "אפליקציית View",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "אפליקציית Desktone",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "גודל",
        "app.details.label.price": "מחיר",
        "app.details.label.screenshots": "צילומי מסך",
        "app.details.label.requirement": "דרישה:",
        "app.details.label.packageName": "שם חבילה:",
        "app.details.thinapp.requirement": "אפליקציה זו עובדת רק במחשבי Windows שמותקן עליהם Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "שולחן עבודה זה של View דורש התקנה של {0} Horizon Client‏ {1} גרסה 3.0 ואילך במחשב שלך.",
        "app.details.viewapp.requirement": "אפליקציית View המתארחת דורשת התקנה של {0} Horizon Client‏{1} גרסה 3.0 ואילך במחשב שלך.",
        "app.details.xenapp.requirement": "אפליקציה זו דורשת התקנה של {0} Citrix Receiver‏ {1}.",
        "app.details.xenapp.msg.IE8OrLower":"אפליקציה זו דורשת התקנה של Citrix Receiver. הערה: לא ניתן לפתוח אפליקציה זו ב-Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"שולחן עבודה זה של Citrix דורש התקנה של {0} Citrix Receiver‏ {1}.",
        "app.details.desktoneDesktop.requirement": "שולחן עבודה זה של Horizon DaaS דורש התקנה של {0} Horizon Client‏ {1} במחשב שלך.",
        "app.details.desktoneApp.requirement": "אפליקציית Horizon DaaS דורשת התקנה של {0} Horizon Client‏ {1} במחשב שלך.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "אין מידע זמין",
        "app.details.noScreenshots": "אין צילומי מסך זמינים",
        "app.details.noDescription": "אין תיאור זמין",
        "app.details.needsDeviceEnrollment": "נדרשת הרשמת מכשיר",
        "app.settings.label.settings": "הגדרות",
        "app.settings.link.back": "חזרה",
        "app.settings.managedDevices": "מכשירים מנוהלים",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"אודות VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"מדיניות פרטיות",
        "app.about.button.label.patents":"פטנט",
        "app.about.button.label.licenseAgreement":"הסכם רישיון",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/il/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/il/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/il/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"מכשירים",
        "app.devices.tableColumn.deviceName":"שם מכשיר",
        "app.devices.tableColumn.userDeviceId":"זיהוי מכשיר",
        "app.devices.tableColumn.lastLoginTime":"שעת כניסה אחרונה",
        "app.devices.unlinkDevice":"בטל קישור",
        "app.devices.unlinkedDevice": "בוטל קישור",
        "app.devices.emptyDeviceListTitle": "אין לך מחשבים מקושרים.",
        "app.devices.emptyDeviceListMessage": "כדי לקשר מחשב, עליך להתקין את VMware Identity Manager Desktop עבור Windows  ולהירשם אליו.",

        "app.thinappMultiDeviceAct.heading":"אפליקציה זו תתווסף למכשירים המאושרים. כדי להשתמש ב-'{0}' במכשירים נוספים, מצא את שם המכשיר למטה ולחץ על הלחצן 'בקשה'.",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"שם מכשיר",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"סטטוס",
        "app.thinappMultiDeviceAct.button.request":"בקשה",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"נדחה",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"ממתין",
        "app.thinappMultiDeviceAct.activationState.activated":"מאושר",
        "app.thinappMultiDeviceAct.activationState.notActivated":"לא הופעל",
        "app.setAppPassword.heading":"הגדר סיסמאות עבור האפליקציה {0}",
        "app.setAppPassword.instruction":"השתמש בטופס למטה כדי להגדיר סיסמה עבור אפליקציה זו. הסיסמה חייבת להיות באורך שלושה תווים לפחות.",
        "app.setAppPassword.label.password": "סיסמה",
        "app.setAppPassword.label.confirmPassword": "אמת סיסמה",
        "app.setAppPassword.label.generate": "צור סיסמה",
        "app.setAppPassword.error.passwordsNoMatch": "סיסמאות לא תואמות.",
        "app.setAppPassword.msg.success": "סיסמת האפליקציה הוגדרה בהצלחה.",
        "app.setAppPassword.msg.fail": "אירעה שגיאה בעת הניסיון להגדיר את הסיסמה שלך. אנא נסה שוב.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"התקן",
        "app.banner.open":"פתח",
        "button.cancel":"בטל",
        "myapps.launch.passwordvault.installExtension.description":"אפליקציה זו יכולה לעשות שימוש בהרחבת הדפדפן Password Vault.‏ <a target='_blank' href='{0}'>התקן את ההרחבה</a> אם עדיין לא עשית זאת.",
        "installMessage.continueInstall":"ניסית בעבר להתקין אפליקציה זו. ",
        "installMessage.proceedToInstall":"הקש כדי להמשיך.",
        "appCenter.device.status.confError":"מערכת ה-MDM לא מצאה שום מידע על המכשיר שלך.",
        "appCenter.device.unEnrollWarningTitle":"אזהרה",
        "appCenter.device.mdmUnEnrollMessage":"הסר את כל הנתונים והאפליקציות של Workspace ONE ממכשיר זה.",
        "appCenter.device.disableWorkspaceMessage":"הסרת החשבון תשלול את הגישה שניתנה דרך אפליקציית Workspace ONE. אפליקציות שהורדו למסך הבית יישארו מותקנות, אבל ייתכן ותנותק הגישה. האם ברצונך להמשיך?",
        "appCenter.internalApp.installationStepTitle":"כדי לפתוח אפליקציה זו, עקוב אחר השלבים הבאים לאחר ההתקנה",
        "appCenter.internalApp.step1":"פתח את ההגדרות ממסך הבית של ה-iPhone ",
        "appCenter.internalApp.step2":"הקש על כללי",
        "appCenter.internalApp.step3":"הקש על ניהול התקנים",
        "appCenter.internalApp.step4":"הקש על שם המפתח מתחת לאפליקציית החברה",
        "appCenter.internalApp.step5":"אמת את האפליקציה או בטח בה",
        "appCenter.internalApp.watchTutorial":"הצג את ההדרכה שלב אחר שלב",
        "userInfo.removeAccount":"הסר חשבון",
        "userInfo.account":"חשבון",
        "userInfo.password":"סיסמה",
        "app.changePassword.title":"שנה סיסמה",
        "app.changePassword.enterCurrentPassword":"הזן סיסמה נוכחית",
        "app.changePassword.enterNewPassword":"הזן סיסמה חדשה",
        "app.changePassword.confirmNewPassword":"אמת סיסמה חדשה",
        "app.changePassword.error.passwordsNoMatch":"הסיסמאות החדשות אינן תואמות",
        "app.changePassword.success":"הסיסמה החדשה נשמרה!",
        "app.changePassword.label.email":"אימייל",
        "app.changePassword.label.phone":"טלפון",
        "app.logout.confirm.msg":"ההתנתקות מ-Workspace ONE תסיים את ההפעלה הנוכחית שלך. כל האפליקציות שהורדו מהקטלוג יישארו על המכשיר, אבל אפליקציות חדשות לא יהיו זמינות עד שתתחבר בחזרה.",
        "app.logout.title":"אזהרה",
        "app.passwordVault.banner.msg":"יש לך אפליקציות שיכולות להשתמש בהרחבת הדפדפן Password Vault.",
        "app.passwordVault.banner.button.install":"התקן"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE は一時的にメンテナンスモードになっています。アプリを起動することはできますが、一部の機能が使えない可能性があります。",
        "appCenter.device.unEnrollWarningMessage":"加入を解除すると、現在利用できるアプリのうち、一部のアプリにアクセスできなくなります。",
        "appCenter.action.add":"追加+",
        "userInfo.unenroll":"加入解除",
        "myapps.welcomeMsg": "こんにちは、{0} さん。あなたのアプリです。",
        "api.updateApps": "リストを更新しています...",
        "installStatus.enrollDevice": "{0} を使用するには Workspace サービスをアクティブ化して企業データを保護する必要があります",
        "installStatus.unenrolledDevice": "このアプリは利用できなくなりました。OK をクリックし、リストを更新してください。",
        "changeOccurred": "変更が加えられました。",
        "appCenter.auth.mdmError": "すべてのアプリを読み込むことができませんでした。MDM との通信中に構成エラーまたはネットワークエラーが発生しました。",
        "appCenter.device.status.commError": "このデバイスのアプリを取得している間に MDM エラーが発生しました。",
        "appCenter.device.status.deviceInputError": "このデバイスは無効です。貴社 IT 管理者までお問い合わせください。",
        "appCenter.device.mdmApps.notFoundError": "MDM はこのデバイスに割り当てられたアプリを見つけることができませんでした。",
        "appCenter.nav.browseBy": "ウェブ閲覧に使用するアプリ:",
        "app.launchPassword.heading": "パスワードを入力",
        "app.launchPassword.view.instruction": "この Windows リソース {0} にサインインするにはパスワードを入力する必要があります。",
        "app.launchPassword.label.userName": "ユーザー",
        "app.launchPassword.label.password": "パスワード",
        "app.launchPassword.button.label.signin": "サインイン",
        "appCenter" : "アプリセンター",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "このアプリケーションを開くには、コンピュータに VMware Identity Manager デスクトップがインストールされている必要があります。<a target='_blank' href='{0}'>VMware Identity Manager デスクトップをインストール</a> してください。",
        "viewAppsTooltip":"View ホスト型アプリケーションを使用するには {0} Horizon Client {1} 3.0 以降をコンピュータにインストールする必要があります。",
        "desktoneDesktopTooltip":"Horizon DaaS デスクトップを使用するには {0} Horizon View {1} をコンピュータにインストールする必要があります。",
        "desktoneApplicationTooltip":"Horizon DaaS アプリケーションを使用するには {0} Horizon View {1} をコンピュータにインストールする必要があります。",
        "xenAppsReceiverNotDetected": "このアプリケーションを開くには、コンピュータに Citrix Receiver がインストールされている必要があります。<a target='_blank' href='{0}'>Citrix Receiver をインストール</a> してください。",
        "button.save" : "保存",
        "button.openHorizonView": "Horizon Client を開く",
        "myapps.launch.openApp": "{0} を開く",
        "button.openApp": "アプリを開く",
        "button.clear": "消去",
        "button.close": "閉じる",
        "myapps.launch.view.openWith": "開封に使用するアプリ:",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(デフォルト)",
        "myapps.launch.view.selectPreferredLaunchClient": "Horizon Desktop とアプリケーションを起動する方法を選択してください",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "起動デフォルト設定を選択",
        "myapps.launch.view.mobileDefaultViewClientDesc": "デバイスから View デスクトップを開いた際のデフォルトの起動動作を決定します。デフォルトで View を起動させるためには、Horizon Client がインストールされている必要があります。",
        "myapps.launch.view.unknownClientType": "Horizon Client を開くクライアントタイプが不明です。",
        "myapps.launch.view.openWithView" : "Horizon Client で開く",
        "myapps.launch.view.openWithBrowser" : "Browser で開く",
        "myapps.launch.view.preferredClient.byBrowser.description": "Browser を選択すると、新しいブラウザウィンドウで View が開きます。",
        "myapps.launch.view.preferredClient.byViewClient.description": "この項目には Horizon Client 3.0 以降が必要です。<a target='_blank' href='{0}'>Horizon Client をインストール</a> してください。",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "この設定は基本設定でいつでも変更することができます。",
        "myapps.launch.msg.launching.desktop":"デスクトップ <b>{0}</b> を起動しています.....",
        "myapps.launch.msg.launching.application":"アプリケーション <b>{0}</b> を起動しています.....",
        "myapps.noAppsMsg": "アプリがまだ追加されていません。{0} を開き、アプリを追加してください",
        "myapps.noFavAppsMsg": "お気に入りに追加したアプリはありません",
        "myapps.dialog.openApp": "開く",
        "myapps.dialog.openAppWithViewClient": "Client で起動する",
        "myapps.dialog.openAppWithBrowser": "Browser で起動する",
        "deviceStatus.networkLost" : "ネットワーク接続が切断されました。",
        "deviceStatus.networkRestored" : "ネットワーク接続が復元しました",
        "api.session.expired.retry":"セッションの期限が切れたので、更新しようとしています...",
        "api.error":"エラーが発生しました。もう一度お試しください。",
        "api.timeout":"接続がタイムアウトしました。もう一度お試しください。",
        "favoriteStatus.favorite" : "お気に入りに追加",
        "favoriteStatus.unfavorite" : "お気に入りから外す",
        "favoriteStatus.offlineFavoriteMessage": "オフライン中にアプリをお気に入りに追加することはできません。オンライン接続してからもう一度お試しください。",
        "error.failToFavoriteApp": "お気に入りのステータス更新に失敗しました。",
        "error.failToHideApp": "アプリの削除に失敗しました。",
        "error.failToShowApp": "Launcher へのアプリ追加に失敗しました",
        "installStatus.offlineInstallMessage": "オフライン中にインストール要求を使用することはできません。オンライン接続してからもう一度お試しください。",
        "installStatus.activated": "アクティ",
        "installStatus.notActivated": "アクティブ化されていません",
        "installStatus.request": "要求",
        "installStatus.update": "更新",
        "installStatus.processing": "処理中",
        "installStatus.installFailedMessage": "もう一度試し、それでも問題が解決しなければ貴社 IT 管理者までお問い合わせください。",
        "requestFailed": "要求に失敗しました",
        "requestSuccessful": "要求は正常に送信されました",
        "accept": "承諾",
        "decline": "拒否",
        "termsOfUse": "利用規約",
        "beforeInstallation": "インストールの前に",
        "resetDesktopStatus.offlineMessage": "オフライン中にデスクトップをリセットすることはできません。オンラインに接続してから再試行してください。",
        "error.failToResetDesktop": "デスクトップのリセットに失敗しました。",
        "resetDesktop.sucess": "デスクトップは正常にリセットされました",
        "appCenter.someAppsMissingMessage": "アプリをすべて読み込むことができませんでした。",
        "appCenter.device.status.notRegistered": "デバイスが登録されていません",
        "appCenter.device.status.blackListed": "このデバイスはブラックリスト設定されています",
        "appCenter.device.status.unknownError": "不明なエラーが発生しました",
        "appCenter.device.register": "デバイスを登録する",
        "appCenter.device.moreDetails":"さらに詳しく",
        "appCenter.noAppsMsg": "現在利用できるアプリはありません",
        "appCenter.noSearchResults": "検索結果はありません",
        "appCenter.vppInviteTitle": "管理配布登録",
        "appCenter.appInstallConfirmPromptTitle": "インストールを確認する",
        "appCenter.acceptInvite": "招待を受理する",
        "appCenter.install": "インストール",
        "appCenter.proceed": "続行",
        "appCenter.cancel": "キャンセル",
        "appCenter.searchApps": "アプリを検索する",
        "appCenter.welcomeMsg": "どんなデバイスからでも、場所を問わずに新しいアプリをインストールできます。",
        "appCenter.done": "完了",
        "appCenter.nav.privacyPage": "プライバシー画面",
        "appCenter.nav.catalog": "カタログ",
        "appCenter.nav.myApps": "マイアプリ",
        "appCenter.nav.favorites": "お気に入り",
        "appCenter.nav.categories": "カテゴリ",
        "appCenter.nav.filterby": "フィルタを適用:",
        "appCenter.nav.show": "表示",
        "appCenter.nav.settings": "設定",
        "appCenter.nav.sortBy": "並べ替え:",
        "appCenter.nav.sortBy.alpha": "アルファベット順",
        "appCenter.nav.filter": "フィルタ",
        "appCenter.action.install": "インストール",
        "appCenter.action.installed": "インストール済み",
        "appCenter.action.added": "追加済み",
        "appCenter.action.processing": "処理中",
        "appCenter.action.update": "更新",
        "appCenter.action.request": "リクエスト",
        "appCenter.type.web": "ウェブアプリ",
        "appCenter.type.native": "ネイティブアプリ",
        "appCenter.type.native.platform": "{0} アプリ",
        "appCenter.type.virtual": "仮想アプリ",
        "myapp.nav.categories": "カテゴリ",
        "myapp.nav.favorites": "お気に入り",
        "myapp.nav.allApps": "すべてのアプリ",
        "myapp.label.new": "新規",
        "myapp.nav.filterby": "フィルタを適用:",
        "userInfo.adminConsole":"管理コンソール",
        "userInfo.preferences":"基本設定",
        "userInfo.about":"関連情報",
        "userInfo.devices":"デバイス",
        "userInfo.signout":"サインアウト",
        "app.details.link.back": "戻る",
        "app.details.nav.details": "詳細",
        "app.details.nav.reviews": "レビュー",
        "app.details.label.description": "説明",
        "app.details.label.seeFullDetails": "詳細をすべて表示する",
        "app.details.label.information": "情報",
        "app.details.label.category": "カテゴリ",
        "app.details.label.version": "バージョン",
        "app.details.label.type": "タイプ:",
        "app.details.label.type.SAML11": "ウェブアプリ",
        "app.details.label.type.SAML20": "ウェブアプリ",
        "app.details.label.type.WEBAPPLINK": "ウェブアプリ",
        "app.details.label.type.WSFED12": "ウェブアプリ",
        "app.details.label.type.XENAPP": "Xen アプリ",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix デスクトップ",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "デスクトップを表示",
        "app.details.label.type.VIEWAPP": "アプリを表示",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone デスクトップ",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone アプリ",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "サイズ",
        "app.details.label.price": "価格",
        "app.details.label.screenshots": "スクリーンショット",
        "app.details.label.requirement": "要件",
        "app.details.label.packageName": "パッケージ名:",
        "app.details.thinapp.requirement": "このアプリケーションは Identity Manager デスクトップがインストールされている Windows コンピュータ上でのみ作動します。",
        "app.details.viewDesktop.requirement": "View デスクトップを使用するには {0} Horizon Client {1} 3.0 以降をコンピュータにインストールする必要があります。",
        "app.details.viewapp.requirement": "View ホスト型アプリケーションを使用するには {0} Horizon Client {1} 3.0 以降をコンピュータにインストールする必要があります。",
        "app.details.xenapp.requirement": "このアプリケーションを使用するには {0} Citrix Receiver {1} をインストールする必要があります。",
        "app.details.xenapp.msg.IE8OrLower":"このアプリケーションを使用するには Citrix Receiver をインストールする必要があります。注: このアプリケーションを Internet Explorer 8 で開くことはできません。",
        "app.details.xenappsDeliveryGroup.requirement":"Citrix デスクトップを使用するには {0} Citrix Receiver {1} をインストールする必要があります。",
        "app.details.desktoneDesktop.requirement": "Horizon DaaS デスクトップを使用するには {0} Horizon Client {1} をコンピュータにインストールする必要があります。",
        "app.details.desktoneApp.requirement": "Horizon DaaS アプリケーションを使用するには {0} Horizon Client {1} をコンピュータにインストールする必要があります。",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "利用できる情報はありません",
        "app.details.noScreenshots": "利用できるスクリーンショットはありません",
        "app.details.noDescription": "利用できる説明はありません",
        "app.details.needsDeviceEnrollment": "デバイスを加入する必要があります",
        "app.settings.label.settings": "設定",
        "app.settings.link.back": "戻る",
        "app.settings.managedDevices": "管理デバイス",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"VMware Workspace について",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"プライバシーポリシー",
        "app.about.button.label.patents":"特許情報",
        "app.about.button.label.licenseAgreement":"ライセンス同意書",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-jp",
        "app.about.licenseAgreementLink":"http://www.vmware.com/jp/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/jp/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"デバイス",
        "app.devices.tableColumn.deviceName":"デバイス名",
        "app.devices.tableColumn.userDeviceId":"デバイス ID",
        "app.devices.tableColumn.lastLoginTime":"最終ログイン時刻",
        "app.devices.unlinkDevice":"リンク解除",
        "app.devices.unlinkedDevice": "リンク解除済み",
        "app.devices.emptyDeviceListTitle": "リンクされたコンピュータはありません",
        "app.devices.emptyDeviceListMessage": "コンピュータをリンクするには、Windows 向けの VMware Identity Manager デスクトップをインストールし登録する必要があります。",

        "app.thinappMultiDeviceAct.heading":"このアプリケーションは承認されたデバイスに追加されます。それ以外のデバイスで \"{0}\" を使用するには、以下でデバイス名を探し、｢要求｣ ボタンをクリックしてください。",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"デバイス名",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"状態",
        "app.thinappMultiDeviceAct.button.request":"リクエスト",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"拒否済み",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"保留中",
        "app.thinappMultiDeviceAct.activationState.activated":"承認済み",
        "app.thinappMultiDeviceAct.activationState.notActivated":"アクティブ化されていません",
        "app.setAppPassword.heading":"アプリケーション {0} のパスワードを設定する",
        "app.setAppPassword.instruction":"以下の欄を使用してこのアプリケーションのパスワードを設定してください。パスワードは 3 文字以上である必要があります。",
        "app.setAppPassword.label.password": "パスワード",
        "app.setAppPassword.label.confirmPassword": "パスワード再入力",
        "app.setAppPassword.label.generate": "パスワードを生成する",
        "app.setAppPassword.error.passwordsNoMatch": "パスワードが一致しません",
        "app.setAppPassword.msg.success": "このアプリケーションのパスワードは正常に設定されました。",
        "app.setAppPassword.msg.fail": "パスワード設定中にエラーが発生しました。再試行してください。",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"インストール",
        "app.banner.open":"開く",
        "button.cancel":"キャンセル",
        "myapps.launch.passwordvault.installExtension.description":"このアプリケーションでは、ブラウザのパスワード管理拡張機能を利用できます。インストールしていない場合は、<a target='_blank' href='{0}'>この拡張機能をインストールしてください</a>。",
        "installMessage.continueInstall":"以前このアプリをインストールしようとしました。",
        "installMessage.proceedToInstall":"続行するには、クリックしてください。",
        "appCenter.device.status.confError":"MDM はこのデバイスの情報を見つけることができませんでした。",
        "appCenter.device.unEnrollWarningTitle":"警告",
        "appCenter.device.mdmUnEnrollMessage":"すべての Workspace ONE アプリおよびデータをこのデバイスから削除してください。",
        "appCenter.device.disableWorkspaceMessage":"アカウントを削除すると、Workspace ONE アプリを通じて与えられたアクセス権限が取り消されます。スプリングボードにダウンロードしたアプリはインストールされたまま残りますが、アクセスできなくなる場合があります。続行しますか?",
        "appCenter.internalApp.installationStepTitle":"このアプリを開くには、インストール後以下の手順に従ってください",
        "appCenter.internalApp.step1":"iPhone ホーム画面から ｢設定｣ を起動します",
        "appCenter.internalApp.step2":"｢一般｣ をタップします",
        "appCenter.internalApp.step3":"｢プロファイルとデバイス管理｣ をタップします",
        "appCenter.internalApp.step4":"｢エンタープライズ App｣ 見出しの下に表示されるアプリ開発者名をタップします",
        "appCenter.internalApp.step5":"アプリを ｢検証｣ または ｢信頼｣ します",
        "appCenter.internalApp.watchTutorial":"手順ごとに進めるチュートリアルを見ます",
        "userInfo.removeAccount":"アカウントを削除",
        "userInfo.account":"アカウント",
        "userInfo.password":"パスワード",
        "app.changePassword.title":"パスワード変更",
        "app.changePassword.enterCurrentPassword":"現在のパスワードを入力してください",
        "app.changePassword.enterNewPassword":"新しいパスワードを入力してください",
        "app.changePassword.confirmNewPassword":"新しいパスワードを再度入力してください",
        "app.changePassword.error.passwordsNoMatch":"新しいパスワードが一致していません。",
        "app.changePassword.success":"新しいパスワードが保存されました。",
        "app.changePassword.label.email":"Eメール",
        "app.changePassword.label.phone":"電話番号",
        "app.logout.confirm.msg":"Workspace ONE からログアウトすると、現在のセッションは終了します。カタログからダウンロードしたアプリはデバイスに残りますが、再度ログインするまでは新しいアプリを使用できません。",
        "app.logout.title":"警告",
        "app.passwordVault.banner.msg":"ブラウザのパスワード管理拡張機能を利用できるアプリがあります。",
        "app.passwordVault.banner.button.install":"インストール"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE이 일시적인 유지 관리 모드에 있습니다. 애플리케이션을 시작할 수 있으나 일부 기능은 작동하지 않을 수 있습니다",
        "appCenter.device.unEnrollWarningMessage":"등록을 취소하면 사용 권한이 있는 일부 애플리케이션에 액세스하지 못할 수 있습니다. 계속하시겠습니까?",
        "appCenter.action.add":"추가+",
        "userInfo.unenroll":"등록 취소",
        "myapps.welcomeMsg": "{0}님 안녕하세요, 여기 앱이 있습니다!",
        "api.updateApps": "목록 업데이트 중...",
        "installStatus.enrollDevice": "회사 데이터 보호를 위해 {0}을(를) 사용하려면 Workspace 서비스를 활성화해야 합니다",
        "installStatus.unenrolledDevice": "더는 이 앱을 사용할 수 없습니다. 확인을 눌러 목록을 업데이트하십시오.",
        "changeOccurred": "변경되었습니다",
        "appCenter.auth.mdmError": "지금은 모든 앱이 로드되지 않았습니다. MDM과 통신 중에 구성 또는 네트워크 오류가 생겼습니다.",
        "appCenter.device.status.commError": "장치에서 앱을 가져오는 중 MDM에 오류가 생겼습니다.",
        "appCenter.device.status.deviceInputError": "이 장치는 유효하지 않습니다! IT 관리자에게 문의하십시오",
        "appCenter.device.mdmApps.notFoundError": "MDM은 장치에 할당된 애플리케이션을 찾지 못했습니다",
        "appCenter.nav.browseBy": "브라우즈:",
        "app.launchPassword.heading": "비밀번호 요청",
        "app.launchPassword.view.instruction": "Windows 리소스 {0}에 로그인하려면 비밀번호가 필요합니다.",
        "app.launchPassword.label.userName": "사용자",
        "app.launchPassword.label.password": "비밀번호",
        "app.launchPassword.button.label.signin": "로그인",
        "appCenter" : "앱 센터",
        "ok" : "확인",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/다운로드",
        "horizonDesktopNotDetected": "이 컴퓨터에 VMware Identity Manager Desktop이 설치되어야 이 애플리케이션을 열 수 있습니다. <a target='_blank' href='{0}'>VMware Identity Manager Desktop 설치</a> 이미 설치하지 않은 경우입니다.",
        "viewAppsTooltip":"이 호스팅된 애플리케이션 보기는 {0} Horizon Client {1} 3.0 이상을 컴퓨터에 필수로 설치해야 합니다.",
        "desktoneDesktopTooltip":"이 Horizon DaaS 데스크톱은 {0} Horizon View {1}를 컴퓨터에 필수로 설치해야 합니다.",
        "desktoneApplicationTooltip":"이 Horizon DaaS 애플리케이션는 {0} Horizon View {1}를 컴퓨터에 필수로 설치해야 합니다",
        "xenAppsReceiverNotDetected": "이 컴퓨터에 Citrix Receiver가 설치되어야 이 애플리케이션을 열 수 있습니다. <a target='_blank' href='{0}'>Install Citrix Receiver</a> 이미 설치하지 않은 경우입니다.",
        "button.save" : "저장",
        "button.openHorizonView": "Horizon Client 열기",
        "myapps.launch.openApp": "{0} 열기",
        "button.openApp": "앱 열기",
        "button.clear": "지우기",
        "button.close": "닫기",
        "myapps.launch.view.openWith": "다음 도구로 열기",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(기본)",
        "myapps.launch.view.selectPreferredLaunchClient": "Horizon 데스크톱과 애플리케이션을 어떻게 시작할지 선택",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "기본 시작 관리자 선택...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "데스크톱 보기를 열면 이것이 기본 시작 관리자 동작을 정합니다. 보기를 기본으로 하려면 Horizon Client가 설치되어야만 합니다. 이미 설치하지 않은 경우<a target='_blank' href='{0}'>Horizon Client 설치</a>.",
        "myapps.launch.view.unknownClientType": "Horizon Client를 여는 알 수 없는 클라이언트 유형",
        "myapps.launch.view.openWithView" : "Horizon Client로 열기",
        "myapps.launch.view.openWithBrowser" : "Browser로 열기",
        "myapps.launch.view.preferredClient.byBrowser.description": "Browser를 선택하면, 새 브라우저 창에 보기가 열립니다. ",
        "myapps.launch.view.preferredClient.byViewClient.description": "이 항목은 Horizon Client 3.0 이상이 필요합니다. 이미 설치하지 않은 경우 <a target='_blank' href='{0}'>Horizon Client 설치</a>.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "기본 설정에서 이 설정을 언제든 변경할 수 있습니다.",
        "myapps.launch.msg.launching.desktop":"데스크톱 시작하는 중 <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"애플리케이션 시작하는 중 <b>{0}</b> .....",
        "myapps.noAppsMsg": "앱을 추가하지 않았습니다. {0}로 가서 앱을 추가할 수 있습니다.",
        "myapps.noFavAppsMsg": "즐겨 사용하는 앱으로 지정 안 함",
        "myapps.dialog.openApp": "열기",
        "myapps.dialog.openAppWithViewClient": "Client에서 시작",
        "myapps.dialog.openAppWithBrowser": "Browser에서 시작",
        "deviceStatus.networkLost" : "네트워크 연결이 끊어졌습니다",
        "deviceStatus.networkRestored" : "네트워크 연결이 복구되었습니다",
        "api.session.expired.retry":"세션 만료됨, 갱신하려는 중...",
        "api.error":"오류 발생, 재시도",
        "api.timeout":"연결 시간 초과, 재시도",
        "favoriteStatus.favorite" : "즐겨찾기",
        "favoriteStatus.unfavorite" : "즐겨찾기 해제",
        "favoriteStatus.offlineFavoriteMessage": "오프라인일 때는 앱을 즐겨찾기 할 수 없습니다. 연결 후 다시 시도하십시오.",
        "error.failToFavoriteApp": "즐겨찾기 상태 업데이트 실패",
        "error.failToHideApp": "앱 제거 실패",
        "error.failToShowApp": "시작 관리자에 앱 추가 실패",
        "installStatus.offlineInstallMessage": "오프라인일 때는 설치 요청을 할 수 없습니다. 연결 후 다시 시도하십시오.",
        "installStatus.activated": "활성화됨",
        "installStatus.notActivated": "활성화되지 않음",
        "installStatus.request": "요청",
        "installStatus.update": "업데이트",
        "installStatus.processing": "처리 중",
        "installStatus.installFailedMessage": "다시 시도해 보고 문제가 지속되면 IT 관리자에게 문의하십시오.",
        "requestFailed": "요청 실패",
        "requestSuccessful": "요청 성공",
        "accept": "동의",
        "decline": "거부",
        "termsOfUse": "이용 약관",
        "beforeInstallation": "설치하기 전",
        "resetDesktopStatus.offlineMessage": "오프라인일 때는 데스크톱 재설정을 사용할 수 없습니다. 연결 후 다시 시도하십시오.",
        "error.failToResetDesktop": "데스크톱 재설정 실패",
        "resetDesktop.sucess": "데스크톱 재설정 성공",
        "appCenter.someAppsMissingMessage": "현재 모든 앱이 로드할 수 없음",
        "appCenter.device.status.notRegistered": "장치 등록 안 됨",
        "appCenter.device.status.blackListed": "이 장치는 블랙리스트에 있음",
        "appCenter.device.status.unknownError": "알 수 없는 오류 발생",
        "appCenter.device.register": "장치 레지스터",
        "appCenter.device.moreDetails":"더 자세한 정보",
        "appCenter.noAppsMsg": "현재 사용 가능한 앱이 없음",
        "appCenter.noSearchResults": "결과 없음",
        "appCenter.vppInviteTitle": "관리되는 배포 등록",
        "appCenter.appInstallConfirmPromptTitle": "설치 확인",
        "appCenter.acceptInvite": "초대 수락",
        "appCenter.install": "설치",
        "appCenter.proceed": "계속",
        "appCenter.cancel": "취소",
        "appCenter.searchApps": "앱 검색",
        "appCenter.welcomeMsg": "새 앱을 모든 장치 아무 데나 설치!",
        "appCenter.done": "완료",
        "appCenter.nav.privacyPage": "개인 정보 페이지",
        "appCenter.nav.catalog": "카탈로그",
        "appCenter.nav.myApps": "내 앱",
        "appCenter.nav.favorites": "즐겨찾기",
        "appCenter.nav.categories": "카테고리",
        "appCenter.nav.filterby": "필터 기준",
        "appCenter.nav.show": "표시",
        "appCenter.nav.settings": "설정",
        "appCenter.nav.sortBy": "정렬 기준",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "필터",
        "appCenter.action.install": "설치",
        "appCenter.action.installed": "설치됨",
        "appCenter.action.added": "추가됨",
        "appCenter.action.processing": "처리 중",
        "appCenter.action.update": "업데이트",
        "appCenter.action.request": "요청",
        "appCenter.type.web": "웹 앱",
        "appCenter.type.native": "네이티브 앱",
        "appCenter.type.native.platform": "{0} 앱",
        "appCenter.type.virtual": "가상 앱",
        "myapp.nav.categories": "카테고리",
        "myapp.nav.favorites": "즐겨찾기",
        "myapp.nav.allApps": "모든 앱",
        "myapp.label.new": "신규",
        "myapp.nav.filterby": "필터 기준",
        "userInfo.adminConsole":"관리자 콘솔",
        "userInfo.preferences":"기본 설정",
        "userInfo.about":"관련정보",
        "userInfo.devices":"장치",
        "userInfo.signout":"로그아웃",
        "app.details.link.back": "뒤로",
        "app.details.nav.details": "세부 정보",
        "app.details.nav.reviews": "검토",
        "app.details.label.description": "설명",
        "app.details.label.seeFullDetails": "전체 세부 정보 보기...",
        "app.details.label.information": "정보",
        "app.details.label.category": "카테고리",
        "app.details.label.version": "버전",
        "app.details.label.type": "유형:",
        "app.details.label.type.SAML11": "웹 앱",
        "app.details.label.type.SAML20": "웹 앱",
        "app.details.label.type.WEBAPPLINK": "웹 앱",
        "app.details.label.type.WSFED12": "웹 앱",
        "app.details.label.type.XENAPP": "젠앱",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix 데스크톱",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "데스크톱 보기",
        "app.details.label.type.VIEWAPP": "앱 보기",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone 데스크톱",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone 앱",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "크기",
        "app.details.label.price": "가격",
        "app.details.label.screenshots": "스크린샷",
        "app.details.label.requirement": "필수 요건:",
        "app.details.label.packageName": "패키지 이름:",
        "app.details.thinapp.requirement": "이 애플리케이션은 Identity Manager Desktop이 설치된 Windows 컴퓨터에서만 작동됩니다.",
        "app.details.viewDesktop.requirement": "이 데스크톱 보기는 {0} Horizon Client {1} 3.0 이상을 컴퓨터에 필수로 설치해야 합니다.",
        "app.details.viewapp.requirement": "이 호스팅된 애플리케이션 보기는 {0} Horizon Client {1} 3.0 이상을 컴퓨터에 필수로 설치해야 합니다.",
        "app.details.xenapp.requirement": "이 애플리케이션은 {0} Citrix Receiver {1} 설치가 필수입니다.",
        "app.details.xenapp.msg.IE8OrLower":"이 애플리케이션은 Citrix Receiver 설치가 필요합니다. 참고: 이 애플리케이션은 Internet Explorer 8에서는 열 수 없습니다.",
        "app.details.xenappsDeliveryGroup.requirement":"이 Citrix 데스크톱은 {0} Citrix Receiver {1} 설치가 필수입니다.",
        "app.details.desktoneDesktop.requirement": "이 Horizon DaaS 데스크톱은 {0} Horizon Client {1}을(를) 컴퓨터에 설치해야 합니다",
        "app.details.desktoneApp.requirement": "이 Horizon DaaS 애플리케이션는 {0} Horizon Client {1}을(를) 컴퓨터에 설치해야 합니다",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "사용할 수 있는 정보 없음",
        "app.details.noScreenshots": "사용할 수 있는 스크린샷 없음",
        "app.details.noDescription": "사용할 수 있는 설명 없음",
        "app.details.needsDeviceEnrollment": "장치 등록 필수",
        "app.settings.label.settings": "설정",
        "app.settings.link.back": "뒤로",
        "app.settings.managedDevices": "관리되는 장치",
        "app.nav.tab.launcher":"시작 관리자",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"VMware Workspace 소개",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"개인정보취급방침",
        "app.about.button.label.patents":"특허",
        "app.about.button.label.licenseAgreement":"라이선스 계약",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-kr",
        "app.about.licenseAgreementLink":"http://www.vmware.com/kr/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/kr/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"장치",
        "app.devices.tableColumn.deviceName":"장치 이름",
        "app.devices.tableColumn.userDeviceId":"장치 ID",
        "app.devices.tableColumn.lastLoginTime":"마지막 로그인 시간",
        "app.devices.unlinkDevice":"연결 해제",
        "app.devices.unlinkedDevice": "연결 해제됨",
        "app.devices.emptyDeviceListTitle": "연결된 컴퓨터가 없습니다.",
        "app.devices.emptyDeviceListMessage": "컴퓨터를 연결하려면 Windows용 VMware Identity Manager Desktop을 먼저 설치하고 레지스터 해야 합니다.",

		"app.thinappMultiDeviceAct.heading":"이 애플리케이션은 승인된 장치에 추가될 것입니다. 추가 장치에 \"{0}\" 을(를) 사용하려면 아래서 장치 이름을 찾고 요청 버튼을 클릭하십시오.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"장치 이름",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"상태",
        "app.thinappMultiDeviceAct.button.request":"요청",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"거부됨",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"대기 중",
        "app.thinappMultiDeviceAct.activationState.activated":"승인됨",
        "app.thinappMultiDeviceAct.activationState.notActivated":"활성화되지 않음",
        "app.setAppPassword.heading":"애플리케이션 {0}을(를) 위한 비밀번호 설정",
        "app.setAppPassword.instruction":"이 애플리케이션의 비밀번호는 아래 양식을 사용하여 설정하십시오. 비밀번호 길이는 최소 3글자이어야 합니다.",
        "app.setAppPassword.label.password": "비밀번호",
        "app.setAppPassword.label.confirmPassword": "비밀번호 확인",
        "app.setAppPassword.label.generate": "비밀번호 생성",
        "app.setAppPassword.error.passwordsNoMatch": "비밀번호가 일치하지 않습니다.",
        "app.setAppPassword.msg.success": "애플리케이션 비밀번호가 성공적으로 설정되었습니다.",
        "app.setAppPassword.msg.fail": "비밀번호 설정 시도 중에 오류가 발생했습니다. 다시 시도하십시오.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"설치",
        "app.banner.open":"열기",
        "button.cancel":"취소",
        "myapps.launch.passwordvault.installExtension.description":"이 애플리케이션은 Password Vault 브라우저 확장 기능을 활용할 수 있습니다. 아직 설치하지 않았다면 <a target='_blank' href='{0}'>확장 기능을 설치</a>하십시오.",
        "installMessage.continueInstall":"이전에 이 애플리케이션을 설치하려고 한 적이 있습니다. ",
        "installMessage.proceedToInstall":"클릭하여 계속하십시오.",
        "appCenter.device.status.confError":"MDM에서 해당 장치에 대한 정보를 찾을 수 없습니다",
        "appCenter.device.unEnrollWarningTitle":"경고",
        "appCenter.device.mdmUnEnrollMessage":"이 장치에서 모든 Workspace ONE 애플리케이션 및 데이터를 삭제합니다.",
        "appCenter.device.disableWorkspaceMessage":"계정을 삭제하면 Workspace ONE 애플리케이션을 통해 부여된 액세스가 취소됩니다. 스프링보드로 다운로드한 애플리케이션은 설치 상태를 유지하지만 액세스가 차단될 수 있습니다. 계속하시겠습니까?",
        "appCenter.internalApp.installationStepTitle":"이 애플리케이션을 열려면 설치 후 다음 단계를 따르십시오.",
        "appCenter.internalApp.step1":"iPhone 홈 화면에서 설정 실행",
        "appCenter.internalApp.step2":"일반 누르기",
        "appCenter.internalApp.step3":"프로필 및 장치 관리 누르기",
        "appCenter.internalApp.step4":"Enterprise App 아래의 애플리케이션 개발자 이름 누르기",
        "appCenter.internalApp.step5":"애플리케이션 확인 또는 신뢰하기",
        "appCenter.internalApp.watchTutorial":"단계별 튜토리얼 보기",
        "userInfo.removeAccount":"계정 삭제",
        "userInfo.account":"계정",
        "userInfo.password":"비밀번호",
        "app.changePassword.title":"비밀번호 변경",
        "app.changePassword.enterCurrentPassword":"현재 비밀번호 입력",
        "app.changePassword.enterNewPassword":"새 비밀번호 입력",
        "app.changePassword.confirmNewPassword":"새 비밀번호 확인",
        "app.changePassword.error.passwordsNoMatch":"새 비밀번호가 일치하지 않습니다.",
        "app.changePassword.success":"새 비밀번호가 저장되었습니다.",
        "app.changePassword.label.email":"이메일",
        "app.changePassword.label.phone":"전화",
        "app.logout.confirm.msg":"Workspace ONE에서 로그아웃하면 현재 세션이 종료됩니다. 카탈로그에서 다운로드한 모든 애플리케이션은 장치에 유지되지만 다시 로그인하지 않으면 새로운 애플리케이션을 사용할 수 없습니다.",
        "app.logout.title":"경고",
        "app.passwordVault.banner.msg":"Password Vault 브라우저 확장 기능을 이용할 수 있는 애플리케이션이 있습니다.",
        "app.passwordVault.banner.button.install":"설치"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE is tijdelijk in onderhoudsmodus. U kunt uw applicaties wel opstarten, maar sommige functies werken wellicht niet.",
        "appCenter.device.unEnrollWarningMessage":"Als u zich uitschrijft, zult u tot enkele applicaties niet langer toegang hebben. Wilt u verder gaan?",
        "appCenter.action.add":"Toevoegen+",
        "userInfo.unenroll":"Uitschrijven",
        "myapps.welcomeMsg": "Hallo, {0}. Hier zijn uw applicaties!",
        "api.updateApps": "De lijst wordt geüpdatet...",
        "installStatus.enrollDevice": "Om {0} te kunnen gebruiken moet Workspace Services geactiveerd worden, zodat bedrijfsgegevens beveiligd worden.",
        "installStatus.unenrolledDevice": "Deze applicatie is niet meer beschikbaar voor uw. Klik op OK om de lijst te updaten.",
        "changeOccurred": "Er is een wijzing opgetreden.",
        "appCenter.auth.mdmError": "Niet alle applicaties konden op dit moment worden geladen. Er is een configuratie- of netwerkfout tijdens de communicatie met het MDM-systeem.",
        "appCenter.device.status.commError": "Het MDM-systeem meldt een fout tijdens het ophalen van applicaties voor uw toestel.",
        "appCenter.device.status.deviceInputError": "Dit toestel is ongeldig. Neem contact op met uw systeembeheerder a.u.b.",
        "appCenter.device.mdmApps.notFoundError": "Het MDM-systeem kon geen applicaties vinden die aan uw toestel zijn toegewezen.",
        "appCenter.nav.browseBy": "Bladeren op",
        "app.launchPassword.heading": "Wachtwoordaanvraag",
        "app.launchPassword.view.instruction": "We hebben uw wachtwoord nodig om in deze Windows-resource {0} in te loggen.",
        "app.launchPassword.label.userName": "Gebruiker",
        "app.launchPassword.label.password": "wachtwoord",
        "app.launchPassword.button.label.signin": "Inloggen",
        "appCenter" : "Applicatiecentrum",
        "ok" : "Ok",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop moet op deze computer geïnstalleerd zijn om deze applicatie te openen. <a target='_blank' href='{0}'>Installeer VMware Identity Manager Desktop</a> als u dat nog niet gedaan heeft.",
        "viewAppsTooltip":"Deze View applicatie heeft {0} Horizon Client {1} 3.0 of recenter nodig om op uw computer geïnstalleerd te kunnen worden.",
        "desktoneDesktopTooltip":"Deze Horizon DaaS-desktop heeft {0} Horizon View {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "desktoneApplicationTooltip":"Deze Horizon DaaS-applicatie heeft {0} Horizon View {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "xenAppsReceiverNotDetected": "Citrix Receiver moet op deze computer geïnstalleerd zijn om deze applicatie te openen. <a target='_blank' href='{0}'>Installeer Citrix Receiver</a> als u dat nog niet gedaan heeft.",
        "button.save" : "Opslaan",
        "button.openHorizonView": "Horizon Client openen",
        "myapps.launch.openApp": "{0} openen",
        "button.openApp": "App openen",
        "button.clear": "Wissen",
        "button.close": "Sluiten",
        "myapps.launch.view.openWith": "Openen met",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(standaard)",
        "myapps.launch.view.selectPreferredLaunchClient": "Selecteer hoe u Horizon desktops en applicaties wilt openen",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "KIES EEN STANDAARDMETHODE...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Hiermee wordt bepaalt hoe een View desktop op uw toestel standaard geopend wordt. Als u View als uw standaard selecteert, moet u Horizon Client geïnstalleerd hebben. <a target='_blank' href='{0}'>Installeer Horizon Client</a> als u dat nog niet gedaan heeft.",
        "myapps.launch.view.unknownClientType": "Onbekend client-type om Horizon Client mee te openen.",
        "myapps.launch.view.openWithView" : "Openen met Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Openen met Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Als u Browser selecteert, zal uw View in een nieuw browservenster worden geopend.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Voor dit item heeft u Horizon Client 3.0 of recenter nodig. <a target='_blank' href='{0}'>Installeer Horizon Client</a> als u dat nog niet gedaan heeft.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "U kunt deze instelling altijd wijzigen in het menu met voorkeursinstellingen.",
        "myapps.launch.msg.launching.desktop":"Desktop wordt geopend <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Applicatie wordt geopend <b>{0}</b> .....",
        "myapps.noAppsMsg": "U heeft geen applicaties toegevoegd. U kunt naar de {0} gaan om applicaties toe te voegen.",
        "myapps.noFavAppsMsg": "U heeft nog geen applicaties in favorieten geplaatst.",
        "myapps.dialog.openApp": "OPENEN",
        "myapps.dialog.openAppWithViewClient": "In Client openen",
        "myapps.dialog.openAppWithBrowser": "In browser openen",
        "deviceStatus.networkLost" : "U heeft geen netwerkverbinding meer.",
        "deviceStatus.networkRestored" : "Netwerkverbinding hersteld",
        "api.session.expired.retry":"Sessie is verlopen. We proberen nu de sessie te vernieuwen...",
        "api.error":"Er is een fout opgetreden. Probeer het opnieuw.",
        "api.timeout":"Time-out in de verbinding. Probeer het opnieuw.",
        "favoriteStatus.favorite" : "In favorieten plaatsen",
        "favoriteStatus.unfavorite" : "Uit favorieten verwijderen",
        "favoriteStatus.offlineFavoriteMessage": "U kunt geen applicaties in favorieten plaatsen als u offline bent. Maak verbinding en probeer het opnieuw.",
        "error.failToFavoriteApp": "De status als favoriet of niet-favoriet kon niet worden geüpdatet.",
        "error.failToHideApp": "De applicatie kon niet worden verwijderd.",
        "error.failToShowApp": "De applicatie kon niet aan de Launcher worden toegevoegd.",
        "installStatus.offlineInstallMessage": "U kunt geen applicaties installeren als u offline bent. Maak verbinding en probeer het opnieuw.",
        "installStatus.activated": "Geactiveerd",
        "installStatus.notActivated": "Niet-geactiveerd",
        "installStatus.request": "Aanvragen",
        "installStatus.update": "Update",
        "installStatus.processing": "Bezig met verwerken",
        "installStatus.installFailedMessage": "Probeer het opnieuw. Als dit probleem blijft optreden, neem dan contact op met uw systeembeheerder.",
        "requestFailed": "Aanvraag mislukt",
        "requestSuccessful": "Aanvraag geslaagd",
        "accept": "Accepteren",
        "decline": "Weigeren",
        "termsOfUse": "Gebruikersovereenkomst",
        "beforeInstallation": "Voor installatie",
        "resetDesktopStatus.offlineMessage": "U kunt geen bureaublad opnieuw instellen als u offline bent. Maak verbinding en probeer het opnieuw.",
        "error.failToResetDesktop": "Desktop kon niet opnieuw worden ingesteld.",
        "resetDesktop.sucess": "Desktop opnieuw instellen geslaagd.",
        "appCenter.someAppsMissingMessage": "Niet alle applicaties konden nu worden geladen.",
        "appCenter.device.status.notRegistered": "Toestel is niet geregistreerd.",
        "appCenter.device.status.blackListed": "Dit toestel staat op de zwarte lijst.",
        "appCenter.device.status.unknownError": "Er is een onbekende fout opgetreden.",
        "appCenter.device.register": "Toestel registreren",
        "appCenter.device.moreDetails":"Meer details",
        "appCenter.noAppsMsg": "Er zijn momenteel geen applicaties beschikbaar.",
        "appCenter.noSearchResults": "Geen resultaten gevonden",
        "appCenter.vppInviteTitle": "Registratie - beheerde distributie",
        "appCenter.appInstallConfirmPromptTitle": "Bevestig installatie",
        "appCenter.acceptInvite": "Accepteer uitnodiging",
        "appCenter.install": "Installeren",
        "appCenter.proceed": "Verder",
        "appCenter.cancel": "Annuleren",
        "appCenter.searchApps": "Zoek applicaties",
        "appCenter.welcomeMsg": "Installeer nieuwe applicaties: waar dan ook en op elk toestel!",
        "appCenter.done": "Gereed",
        "appCenter.nav.privacyPage": "Pagina met privacybeleid",
        "appCenter.nav.catalog": "Catalogus",
        "appCenter.nav.myApps": "Mijn applicaties",
        "appCenter.nav.favorites": "Favorieten",
        "appCenter.nav.categories": "Categorieën",
        "appCenter.nav.filterby": "Filteren op",
        "appCenter.nav.show": "Weergeven",
        "appCenter.nav.settings": "Instellingen",
        "appCenter.nav.sortBy": "Sorteren op",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filter",
        "appCenter.action.install": "Installeren",
        "appCenter.action.installed": "Geïnstalleerd",
        "appCenter.action.added": "Toegevoegd",
        "appCenter.action.processing": "Bezig met verwerken",
        "appCenter.action.update": "Update",
        "appCenter.action.request": "Aanvragen",
        "appCenter.type.web": "Webapplicatie",
        "appCenter.type.native": "Systeemeigen applicatie",
        "appCenter.type.native.platform": "{0}-applicatie",
        "appCenter.type.virtual": "Virtuele applicatie",
        "myapp.nav.categories": "Categorieën",
        "myapp.nav.favorites": "Favorieten",
        "myapp.nav.allApps": "Alle applicaties",
        "myapp.label.new": "Nieuw",
        "myapp.nav.filterby": "Filteren op",
        "userInfo.adminConsole":"Beheerdersconsole",
        "userInfo.preferences":"Voorkeuren",
        "userInfo.about":"Over",
        "userInfo.devices":"Toestellen",
        "userInfo.signout":"Uitloggen",
        "app.details.link.back": "Terug",
        "app.details.nav.details": "Gegevens",
        "app.details.nav.reviews": "Beoordelingen",
        "app.details.label.description": "Omschrijving",
        "app.details.label.seeFullDetails": "Volledige details weergeven...",
        "app.details.label.information": "Informatie",
        "app.details.label.category": "Categorieën",
        "app.details.label.version": "Versie:",
        "app.details.label.type": "Type:",
        "app.details.label.type.SAML11": "Webapplicatie",
        "app.details.label.type.SAML20": "Webapplicatie",
        "app.details.label.type.WEBAPPLINK": "Webapplicatie",
        "app.details.label.type.WSFED12": "Webapplicatie",
        "app.details.label.type.XENAPP": "Xen App",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "View desktop",
        "app.details.label.type.VIEWAPP": "View applicatie",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone applicatie",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Omvang",
        "app.details.label.price": "Prijs",
        "app.details.label.screenshots": "Schermafdrukken",
        "app.details.label.requirement": "Vereisten:",
        "app.details.label.packageName": "Pakketnaam:",
        "app.details.thinapp.requirement": "Deze applicatie werkt alleen op een Windows-computer met Identity Manager Desktop geïnstalleerd.",
        "app.details.viewDesktop.requirement": "Deze View desktop heeft {0} Horizon Client {1} 3.0 of recenter nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.viewapp.requirement": "Deze View applicatie heeft {0} Horizon Client {1} 3.0 of recenter nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.xenapp.requirement": "Deze applicatie heeft {0\} Citrix Receiver {1} nodig om geïnstalleerd te kunnen worden.",
        "app.details.xenapp.msg.IE8OrLower":"Voor deze applicatie moet Citrix Receiver geïnstalleerd zijn. N.B: Deze applicatie kan niet in Internet Explorer 8 worden geopend.",
        "app.details.xenappsDeliveryGroup.requirement":"Deze Citrix Desktop heeft {0\} Citrix Receiver {1} nodig om geïnstalleerd te kunnen worden.",
        "app.details.desktoneDesktop.requirement": "Deze Horizon DaaS Desktop heeft {0} Horizon Client {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.desktoneApp.requirement": "Deze Horizon DaaS-applicatie heeft {0} Horizon Client {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Geen informatie beschikbaar",
        "app.details.noScreenshots": "Geen schermafdrukken beschikbaar",
        "app.details.noDescription": "Geen omschrijving beschikbaar",
        "app.details.needsDeviceEnrollment": "Toestel moet ingeschreven zijn",
        "app.settings.label.settings": "Instellingen",
        "app.settings.link.back": "Terug",
        "app.settings.managedDevices": "Beheerde toestellen",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOGUS",
        "app.about.heading":"About VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Privacybeleid",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Licentieovereenkomst",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-nl",
        "app.about.licenseAgreementLink":"http://www.vmware.com/nl/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/nl/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Toestellen",
        "app.devices.tableColumn.deviceName":"Toestelnaam",
        "app.devices.tableColumn.userDeviceId":"Toestel-ID",
        "app.devices.tableColumn.lastLoginTime":"Laatste keer ingelogd",
        "app.devices.unlinkDevice":"Koppeling verwijderen",
        "app.devices.unlinkedDevice": "Koppeling verwijderd",
        "app.devices.emptyDeviceListTitle": "U heeft geen gekoppelde computers.",
        "app.devices.emptyDeviceListMessage": "Om een computer te koppelen moet u VMware Identity Manager Desktop voor Windows installeren en registreren.",

		"app.thinappMultiDeviceAct.heading":"Deze applicatie wordt aan goedgekeurde toestellen toegevoegd. Om \"{0}\" op andere toestellen te gebruiken dient u de naam van het toestel in de lijst hieronder te vinden en dan op de knop \"Aanvragen\" te klikken.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Toestelnaam",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Aanvragen",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Afgewezen",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"In behandeling",
        "app.thinappMultiDeviceAct.activationState.activated":"Goedgekeurd",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Niet-geactiveerd",
        "app.setAppPassword.heading":"Stel een wachtwoord voor de applicatie {0} in.",
        "app.setAppPassword.instruction":"Gebruik het formulier hieronder om een wachtwoord voor deze applicatie in. Het wachtwoord moet tenminste uit drie tekens bestaan.",
        "app.setAppPassword.label.password": "Wachtwoord",
        "app.setAppPassword.label.confirmPassword": "Wachtwoord bevestigen",
        "app.setAppPassword.label.generate": "Wachtwoord genereren",
        "app.setAppPassword.error.passwordsNoMatch": "Wachtwoorden komen niet overeen.",
        "app.setAppPassword.msg.success": "Uw applicatiewachtwoord is met succes ingesteld.",
        "app.setAppPassword.msg.fail": "Er is een fout opgetreden tijdens de poging om uw wachtwoord in te stellen. Probeer het opnieuw.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installeren",
        "app.banner.open":"Openen",
        "button.cancel":"Annuleren",
        "myapps.launch.passwordvault.installExtension.description":"Deze app kan gebruik maken van de browser plug-in Password Vault. <a target='_blank' href='{0}'>Klik op deze link</a> om de plug-in te installeren, indien u dit nog niet gedaan heeft.",
        "installMessage.continueInstall":"U heeft al eerder geprobeerd deze app te installeren. ",
        "installMessage.proceedToInstall":"Klik om verder te gaan.",
        "appCenter.device.status.confError":"Het MDM-systeem was niet in staat om informatie voor uw toestel te vinden.",
        "appCenter.device.unEnrollWarningTitle":"Waarschuwing",
        "appCenter.device.mdmUnEnrollMessage":"Verwijder alle Workspace ONE-applicaties en -gegevens van dit toestel.",
        "appCenter.device.disableWorkspaceMessage":"Als u uw account verwijdert, worden alle toegangsrechten die via de Workspace ONE-app zijn verleend ingetrokken. Applicaties die naar uw startscherm zijn gedownload blijven geïnstalleerd, maar u kunt ze wellicht niet meer openen. Wilt u verdergaan?",
        "appCenter.internalApp.installationStepTitle":"Volg deze stappen na installatie om de applicatie te openen.",
        "appCenter.internalApp.step1":"Open Instellingen vanaf het startscherm op uw iPhone.",
        "appCenter.internalApp.step2":"Klik op Algemeen.",
        "appCenter.internalApp.step3":"Klik op Profielen of Beheer profielen en apparaten.",
        "appCenter.internalApp.step4":"Klik op de naam van een ontwikkelaar onder de kop Bedrijfsapp. ",
        "appCenter.internalApp.step5":"Controleer de app of verklaar de app vertrouwd.",
        "appCenter.internalApp.watchTutorial":"Bekijk de stapsgewijze instructies.",
        "userInfo.removeAccount":"Account verwijderen",
        "userInfo.account":"Account",
        "userInfo.password":"Wachtwoord",
        "app.changePassword.title":"Wachtwoord wijzigen",
        "app.changePassword.enterCurrentPassword":"Voer huidig wachtwoord in",
        "app.changePassword.enterNewPassword":"Voer nieuw wachtwoord in",
        "app.changePassword.confirmNewPassword":"Bevestig nieuw wachtwoord in",
        "app.changePassword.error.passwordsNoMatch":"Nieuw wachtwoord onjuist ingevoerd.",
        "app.changePassword.success":"Nieuw wachtwoord opgeslagen.",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Telefoon",
        "app.logout.confirm.msg":"Als u uit Workspace ONE uitlogt, wordt uw huidige sessie beëindigd. Alle applicaties die uit de catalogus zijn gedownload blijven op het toestel aanwezig, maar nieuwe applicaties worden niet beschikbaar gesteld totdat u weer inlogt.",
        "app.logout.title":"WAARSCHUWING",
        "app.passwordVault.banner.msg":"U heeft applicaties die gebruik kunnen maken van de browser plug-in Password Vault.",
        "app.passwordVault.banner.button.install":"Installeren"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE znajduje się tymczasowo w trybie konserwacji. Możesz uruchomić swoje aplikacje, lecz niektóre funkcje mogą nie działać.",
        "appCenter.device.unEnrollWarningMessage":"Poprzez wyrejestrowanie utracisz dostęp do kilku aplikacji, do których jesteś uprawniony. Czy chcesz kontynuować?",
        "appCenter.action.add":"Dodaj+",
        "userInfo.unenroll":"Wyrejestruj",
        "myapps.welcomeMsg": "Witaj, {0}! Oto Twoje aplikacje!",
        "api.updateApps": "Aktualizowanie listy...",
        "installStatus.enrollDevice": "Użycie {0} wymaga aktywacji Workspace Services w celu ochrony danych firmowych.",
        "installStatus.unenrolledDevice": "Aplikacja ta nie jest już dla Ciebie dostępna. Naciśnij OK, aby zaktualizować listę.",
        "changeOccurred": "Zaszła zmiana",
        "appCenter.auth.mdmError": "Wszystkich aplikacji nie można załadować w tym momencie. Podczas komunikacji z MDM wystąpił błąd konfiguracji lub sieci.",
        "appCenter.device.status.commError": "Podczas pobierania aplikacji na Twoje urządzenie w MDM wystąpił błąd.",
        "appCenter.device.status.deviceInputError": "Niniejsze urządzenie jest nieprawidłowe! Skontakuj się z administratorem",
        "appCenter.device.mdmApps.notFoundError": "MDM nie znalazł żadnych aplikacji przypisanych do Twojego urządzenia.",
        "appCenter.nav.browseBy": "Przeglądaj wg",
        "app.launchPassword.heading": "Żądanie hasła",
        "app.launchPassword.view.instruction": "Potrzebujemy Twojego hasła, abyś mógł się zalogować do tych zasobów Windows {0}.",
        "app.launchPassword.label.userName": "Użytkownik",
        "app.launchPassword.label.password": "Hasło",
        "app.launchPassword.button.label.signin": "Zaloguj się",
        "appCenter" : "Centrum aplikacji",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/pobierz",
        "horizonDesktopNotDetected": "Aby można było otworzyć tę aplikację, na komputerze należy zainstalować program VMware Identity Manager Desktop. <a target=’_blank’ href=’{0}’ >Zainstaluj program VMware Identity Manager Desktop</a>, jeśli nie został on jeszcze zainstalowany.",
        "viewAppsTooltip":"Ta aplikacja View Hosted wymaga zainstalowania na komputerze programu {0} Horizon Client{1} 3.0 lub nowszego.",
        "desktoneDesktopTooltip":"Ten pulpit Horizon DaaS wymaga zainstalowania na komputerze programu {0} Horizon View {1}.",
        "desktoneApplicationTooltip":"Ta aplikacja Horizon DaaS wymaga zainstalowania na komputerze programu {0} Horizon View {1}.",
        "xenAppsReceiverNotDetected": "Aby otworzyć niniejszą aplikację, na komputerze należy zainstalować Citrix Receiver. <a target=’_blank’ href=’{0}’>Zainstaluj Citrix Receiver</a>, jeśli nie został on jeszcze zainstalowany.",
        "button.save" : "Zapisz",
        "button.openHorizonView": "Otwórz Horizon Client",
        "myapps.launch.openApp": "Otwórz {0}",
        "button.openApp": "Otwórz aplikację",
        "button.clear": "Wyczyść",
        "button.close": "Zamknij",
        "myapps.launch.view.openWith": "Otwórz za pomocą",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Przeglądarka",
        "myapps.launch.view.preferredClient.isDefault": "(domyślne)",
        "myapps.launch.view.selectPreferredLaunchClient": "Wybierz, jak chcesz uruchomić pulpity i aplikacje Horizon",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "WYBIERZ URUCHOMIENIE DOMYŚLNE...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Określa to uruchomienie domyślne, gdy wybierasz otwieranie Widoku pulpitu ze swojego urządzenia. Jeśli wybierasz Widok jako swoją opcję domyślną, musisz mieć zainstalowany program Horizon Client. <a target=’_blank’ href=’{0}’>Zainstaluj Horizon Client</a>, jeśli nie został on jeszcze zainstalowany.",
        "myapps.launch.view.unknownClientType": "Nieznany typ klienta do otwarcia programu Horizon Client.",
        "myapps.launch.view.openWithView" : "Otwórz Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Otwórz za pomocą przeglądarki",
        "myapps.launch.view.preferredClient.byBrowser.description": "Po wybraniu przeglądarki Twój widok otworzy się w nowym oknie przeglądarki.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Niniejszy element wymaga programu Horizon Client 3.0 lub nowszego. <a target=’_blank’ href=’{0}’>Zainstaluj Horizon Client</a>, jeśli nie został on jeszcze zainstalowany.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Zawsze możesz zmienić to ustawienie w preferencjach.",
        "myapps.launch.msg.launching.desktop":"Uruchamianie pulpitu <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Uruchamianie aplikacji <b>{0}</b> .....",
        "myapps.noAppsMsg": "Nie dodałeś żadnych aplikacji. Możesz przejść do {0}, aby dodać aplikacje.",
        "myapps.noFavAppsMsg": "Nie oznaczyłeś żadnych aplikacji jako ulubione.",
        "myapps.dialog.openApp": "OTWÓRZ",
        "myapps.dialog.openAppWithViewClient": "Uruchom w Client",
        "myapps.dialog.openAppWithBrowser": "Uruchom w przeglądarce",
        "deviceStatus.networkLost" : "Utracono połączenie z siecią",
        "deviceStatus.networkRestored" : "Przywrócono połączenie z siecią",
        "api.session.expired.retry":"Sesja wygasła. Próba odnowienia...",
        "api.error":"Wystąpił błąd - spróbuj ponownie.",
        "api.timeout":"Przekroczono czas oczekiwania na połączenie - spróbuj ponownie",
        "favoriteStatus.favorite" : "Dodaj do ulubionych",
        "favoriteStatus.unfavorite" : "Usuń z Ulubionych",
        "favoriteStatus.offlineFavoriteMessage": "Oznaczenie aplikacji jako ulubionej jest niedostępne w trybie Offline. Połącz się ponownie i spróbuj jeszcze raz.",
        "error.failToFavoriteApp": "Zaktualizowanie statusu ulubionych nie powiodło się",
        "error.failToHideApp": "Usunięcie aplikacji nie powiodło się",
        "error.failToShowApp": "Dodanie aplikacji do Launcher nie powiodło się",
        "installStatus.offlineInstallMessage": "Instalowanie żądań jest niedostępne w trybie Offline. Połącz się ponownie i spróbuj jeszcze raz.",
        "installStatus.activated": "Aktywowane",
        "installStatus.notActivated": "Nieaktywowane",
        "installStatus.request": "Zażądaj",
        "installStatus.update": "Aktualizuj",
        "installStatus.processing": "Przetwarzanie",
        "installStatus.installFailedMessage": "Spróbuj ponownie, a jeśli problem będzie się utrzymywał, skontaktuj się z administratorem.",
        "requestFailed": "Żądanie nie powiodło się",
        "requestSuccessful": "Żądanie powiodło się",
        "accept": "Akceptuj",
        "decline": "Odrzuć",
        "termsOfUse": "Warunki użytkowania",
        "beforeInstallation": "Przed instalacją",
        "resetDesktopStatus.offlineMessage": "Resetowanie pulpitu jest niedostępne w trybie Offline. Połącz się i spróbuj ponownie.",
        "error.failToResetDesktop": "Resetowanie pulpitu nie powiodło się",
        "resetDesktop.sucess": "Pulpit zresetowano pomyślnie",
        "appCenter.someAppsMissingMessage": "Wszystkich aplikacji nie można było teraz załadować",
        "appCenter.device.status.notRegistered": "Urządzenie nie jest zarejestrowane",
        "appCenter.device.status.blackListed": "Niniejsze urządzenie znajduje się na czarnej liście",
        "appCenter.device.status.unknownError": "Wystąpił nieznany błąd",
        "appCenter.device.register": "Zarejestruj urządzenie",
        "appCenter.device.moreDetails":"Więcej szczegółów",
        "appCenter.noAppsMsg": "Obecnie żadne aplikacje nie są dostępne",
        "appCenter.noSearchResults": "Brak wyników",
        "appCenter.vppInviteTitle": "Rejestracja zarządzanej dystrybucji",
        "appCenter.appInstallConfirmPromptTitle": "Potwierdź instalację",
        "appCenter.acceptInvite": "Zaakceptuj zaproszenie",
        "appCenter.install": "Zainstaluj",
        "appCenter.proceed": "Kontynuuj",
        "appCenter.cancel": "Anuluj",
        "appCenter.searchApps": "Wyszukaj aplikacje",
        "appCenter.welcomeMsg": "Instaluj nowe aplikacje gdziekolwiek, na każdym urządzeniu!",
        "appCenter.done": "Gotowe",
        "appCenter.nav.privacyPage": "Strona prywatności",
        "appCenter.nav.catalog": "Katalog",
        "appCenter.nav.myApps": "Moje aplikacje",
        "appCenter.nav.favorites": "Ulubione",
        "appCenter.nav.categories": "Kategorie",
        "appCenter.nav.filterby": "Filtruj według",
        "appCenter.nav.show": "Pokaż",
        "appCenter.nav.settings": "Ustawienia",
        "appCenter.nav.sortBy": "Sortuj według",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtruj",
        "appCenter.action.install": "Zainstaluj",
        "appCenter.action.installed": "Zainstalowany",
        "appCenter.action.added": "Dodałeś",
        "appCenter.action.processing": "Przetwarzanie",
        "appCenter.action.update": "Aktualizuj",
        "appCenter.action.request": "Zażądaj",
        "appCenter.type.web": "Aplikacja sieci Web",
        "appCenter.type.native": "Aplikacja natywna",
        "appCenter.type.native.platform": "Aplikacja {0}",
        "appCenter.type.virtual": "Aplikacja wirtualna",
        "myapp.nav.categories": "Kategorie",
        "myapp.nav.favorites": "Ulubione",
        "myapp.nav.allApps": "Wszystkie aplikacje",
        "myapp.label.new": "Nowe",
        "myapp.nav.filterby": "Filtruj według",
        "userInfo.adminConsole":"Konsola administracji",
        "userInfo.preferences":"Preferencje",
        "userInfo.about":"O programie",
        "userInfo.devices":"Urządzenia",
        "userInfo.signout":"Wyloguj",
        "app.details.link.back": "Wstecz",
        "app.details.nav.details": "Szczegóły",
        "app.details.nav.reviews": "Opinie",
        "app.details.label.description": "Opis",
        "app.details.label.seeFullDetails": "Zobacz wszystkie szczegóły",
        "app.details.label.information": "Informacje",
        "app.details.label.category": "Kategorie",
        "app.details.label.version": "Wersja",
        "app.details.label.type": "Typ:",
        "app.details.label.type.SAML11": "Aplikacja sieci Web",
        "app.details.label.type.SAML20": "Aplikacja sieci Web",
        "app.details.label.type.WEBAPPLINK": "Aplikacja sieci Web",
        "app.details.label.type.WSFED12": "Aplikacja sieci Web",
        "app.details.label.type.XENAPP": "Aplikacja Xen",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Pulpit Citrix",
        "app.details.label.type.THINAPP": "Aplikacja Thin",
        "app.details.label.type.VIEWPOOL": "Wyświetl pulpit",
        "app.details.label.type.VIEWAPP": "Wyświetl aplikację",
        "app.details.label.type.DESKTONEDESKTOP": "Pulpit Desktone",
        "app.details.label.type.DESKTONEAPPLICATION": "Aplikacja Desktone",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Rozmiar",
        "app.details.label.price": "Cena",
        "app.details.label.screenshots": "Zrzuty ekranu",
        "app.details.label.requirement": "Wymogi:",
        "app.details.label.packageName": "Nazwa pakietu:",
        "app.details.thinapp.requirement": "Ta aplikacja działa tylko na komputerze z systemem Windows i zainstalowanym programem Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "Ten Widok pulpitu wymaga zainstalowania na komputerze programu {0} Horizon Client{1} 3.0 lub nowszego.",
        "app.details.viewapp.requirement": "Ta aplikacja View Hosted wymaga zainstalowania na komputerze programu {0} Horizon Client{1} 3.0 lub nowszego.",
        "app.details.xenapp.requirement": "Ta aplikacja Citrix wymaga zainstalowania programu {0} Citrix Receiver {1}.",
        "app.details.xenapp.msg.IE8OrLower":"Ta aplikacja wymaga zainstalowania programu Citrix Receiver. Uwaga: Tej aplikacji nie można otworzyć w programie Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Ten pulpit Citrix wymaga zainstalowania programu {0} Citrix Receiver {1}.",
        "app.details.desktoneDesktop.requirement": "Ten pulpit Horizon DaaS wymaga zainstalowania na komputerze programu {0} Horizon Client {1}.",
        "app.details.desktoneApp.requirement": "Ta aplikacja Horizon DaaS wymaga zainstalowania na komputerze programu {0} Horizon Client {1}.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Brak dostępnych informacji",
        "app.details.noScreenshots": "Brak dostępnych zrzutów ekranu",
        "app.details.noDescription": "Brak dostępnego opisu",
        "app.details.needsDeviceEnrollment": "Wymaga rejestracji urządzenia",
        "app.settings.label.settings": "Ustawienia",
        "app.settings.link.back": "Wstecz",
        "app.settings.managedDevices": "Zarządzane urządzenia",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"KATALOG",
        "app.about.heading":"O VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Zasady ochrony prywatności",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Umowa licencyjna",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/pl/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/pl/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/pl/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Urządzenia",
        "app.devices.tableColumn.deviceName":"Nazwa urządzenia",
        "app.devices.tableColumn.userDeviceId":"Identyfikator urządzenia",
        "app.devices.tableColumn.lastLoginTime":"Godzina ostatniego logowania",
        "app.devices.unlinkDevice":"Odłącz",
        "app.devices.unlinkedDevice": "Odłączone",
        "app.devices.emptyDeviceListTitle": "Nie masz żadnych połączonych komputerów.",
        "app.devices.emptyDeviceListMessage": "Aby połączyć komputer, należy zainstalować i zarejestrować oprogramowanie VMware Identity Manager Desktop dla systemu Windows.",

		"app.thinappMultiDeviceAct.heading":"Niniejsza aplikacja zostanie dodana do zatwierdzonych urządzeń. Aby używać programu \"{0}\" na dodatkowych urządzeniach, znajdź nazwę urządzenia poniżej, a następnie kliknij przycisk \„Zażądaj\”.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Nazwa urządzenia",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Stan",
        "app.thinappMultiDeviceAct.button.request":"Zażądaj",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Odrzucone",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Oczekujące",
        "app.thinappMultiDeviceAct.activationState.activated":"Zatwierdzone",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Nieaktywowane",
        "app.setAppPassword.heading":"Ustaw hasło aplikacji {0}",
        "app.setAppPassword.instruction":"Skorzystaj z poniższego formularza, aby ustawić hasło tej aplikacji. Hasło musi składać się z co najmniej trzech znaków.",
        "app.setAppPassword.label.password": "Hasło",
        "app.setAppPassword.label.confirmPassword": "Potwierdź hasło",
        "app.setAppPassword.label.generate": "Wygeneruj hasło",
        "app.setAppPassword.error.passwordsNoMatch": "Hasła nie są zgodne.",
        "app.setAppPassword.msg.success": "Hasło aplikacji ustawiono pomyślnie.",
        "app.setAppPassword.msg.fail": "Podczas ustawiania hasła wystąpił błąd. Spróbuj ponownie.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Zainstaluj",
        "app.banner.open":"Otwórz",
        "button.cancel":"Anuluj",
        "myapps.launch.passwordvault.installExtension.description":"Ta aplikacja może używać magazynu haseł – rozszerzenia przeglądarki. <a target='_blank' href='{0}'>Zainstaluj rozszerzenie</a>, jeśli jeszcze go nie masz.",
        "installMessage.continueInstall":"Jeśli wcześniej próbowałeś zainstalować tę aplikację. ",
        "installMessage.proceedToInstall":"Kliknij, aby kontynuować.",
        "appCenter.device.status.confError":"MDM nie może znaleźć żadnych informacji dla Twojego urządzenia.",
        "appCenter.device.unEnrollWarningTitle":"Ostrzeżenie",
        "appCenter.device.mdmUnEnrollMessage":"Usuń wszystkie aplikacje Workspace ONE i dane z tego urządzenia.",
        "appCenter.device.disableWorkspaceMessage":"Usunięcie konta cofnie dostęp udzielony przez aplikację Workspace ONE. Aplikacje pobrane na Twój springboard pozostaną zainstalowane, lecz dostęp może zostać odcięty. Czy chcesz kontynuować?",
        "appCenter.internalApp.installationStepTitle":"Aby otworzyć tę aplikację, po instalacji wykonaj następujące czynności",
        "appCenter.internalApp.step1":"Uruchom ‘ustawienia’ z ekranu głównego swojego iPhone’a",
        "appCenter.internalApp.step2":"Dotknij ‘Ogólne’",
        "appCenter.internalApp.step3":"Dotknij ‘Profil’ i ‘Zarządzanie urządzeniem’",
        "appCenter.internalApp.step4":"Dotknij nazwy dewelopera aplikacji pod ‘Aplikacją firmową’",
        "appCenter.internalApp.step5":"Zweryfikuj aplikację lub jej zaufaj",
        "appCenter.internalApp.watchTutorial":"Obejrzyj samouczek",
        "userInfo.removeAccount":"Usuwanie konta",
        "userInfo.account":"Konto",
        "userInfo.password":"Hasło",
        "app.changePassword.title":"Zmień hasło",
        "app.changePassword.enterCurrentPassword":"Wpisz aktualne hasło",
        "app.changePassword.enterNewPassword":"Wpisz nowe hasło",
        "app.changePassword.confirmNewPassword":"Potwierdź nowe hasło",
        "app.changePassword.error.passwordsNoMatch":"Nowe hasła nie pasują",
        "app.changePassword.success":"Nowe hasło zapisano!",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Telefon",
        "app.logout.confirm.msg":"Wylogowanie z Workspace ONE zakończy aktualną sesję. Wszelkie aplikacje pobrane z katalogu pozostaną na urządzeniu, lecz żadne nowe aplikacje nie będą dostępne aż się z powrotem zalogujesz.",
        "app.logout.title":"OSTRZEŻENIE",
        "app.passwordVault.banner.msg":"Masz aplikacje, które mogą korzystać z magazynu haseł – rozszerzenia przeglądarki.",
        "app.passwordVault.banner.button.install":"Zainstaluj"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"O Workspace ONE se encontra temporariamente no modo de manutenção. Você pode iniciar seus aplicativos, mas alguns recursos talvez não funcionem.",
        "appCenter.device.unEnrollWarningMessage":"Ao cancelar a inscrição, você perderá o acesso a alguns aplicativos os quais o pertencem. Deseja continuar?",
        "appCenter.action.add":"Adicionar+",
        "userInfo.unenroll":"Cancelar inscrição",
        "myapps.welcomeMsg": "Olá {0}, aqui estão seus aplicativos!",
        "api.updateApps": "Atualizando a lista...",
        "installStatus.enrollDevice": "O uso de {0} requer a ativação de serviços do Workspace para proteger os dados da empresa",
        "installStatus.unenrolledDevice": "Este aplicativo não está disponível para você. Pressione ok para atualizar a lista.",
        "changeOccurred": "Alteração ocorrida",
        "appCenter.auth.mdmError": "Os aplicativos não puderam ser carregados neste momento. Houve um erro de configuração ou de rede durante a comunicação com o MDM",
        "appCenter.device.status.commError": "O MDM resultou em um erro durante a tentativa em recuperar aplicativos para o seu dispositivo",
        "appCenter.device.status.deviceInputError": "Este dispositivo é inválido! Entre em contato com seu administrador de TI",
        "appCenter.device.mdmApps.notFoundError": "O MDM não encontrou quaisquer aplicativos atribuídos ao dispositivo",
        "appCenter.nav.browseBy": "Pesquisar por",
        "app.launchPassword.heading": "Solicitação de senha",
        "app.launchPassword.view.instruction": "Precisamos de sua senha para fazer o login no(a) {0}, recurso do Windows.",
        "app.launchPassword.label.userName": "Usuário",
        "app.launchPassword.label.password": "senha",
        "app.launchPassword.button.label.signin": "Entrar",
        "appCenter" : "Centro de aplicativos",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/baixar",
        "horizonDesktopNotDetected": "Para abrir esse aplicativo o VMware Identity Manager Desktop deve ser instalado neste computador. <a target='_blank' href='{0}'>Install VMware Identity Manager Desktop</a> caso ainda não o tenha instalado.",
        "viewAppsTooltip":"A opção Visualizar aplicativo hospedado requer que o(a) {0} Horizon Client {1} 3.0 ou superior esteja instalado no seu computador.",
        "desktoneDesktopTooltip":"Este desktop do Horizon DaaS requer que o(a) {0} Horizon View {1} esteja instalado no seu computador.",
        "desktoneApplicationTooltip":"Este aplicativo do Horizon DaaS requer que o(a) {0} Horizon View {1} esteja instalado no seu computador.",
        "xenAppsReceiverNotDetected": "Para abrir esse aplicativo o Citrix Receiver deve ser instalado neste computador. <a target='_blank' href='{0}'>Install Citrix Receiver</a> caso ainda não o tenha instalado.",
        "button.save" : "Salvar",
        "button.openHorizonView": "Abrir Horizon Client",
        "myapps.launch.openApp": "Abrir {0}",
        "button.openApp": "Abrir aplicativo",
        "button.clear": "Limpar",
        "button.close": "Fechar",
        "myapps.launch.view.openWith": "Abrir com",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(padrão)",
        "myapps.launch.view.selectPreferredLaunchClient": "Selecione como você gostaria de iniciar o desktop e os aplicativos Horizon.",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "ESCOLHER UMA INICIALIZAÇÃO PADRÃO...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Isto determina o comportamento padrão do inicializador quando você escolher abrir a opção Visualizar desktop do seu dispositivo. Se escolher Visualizar como padrão, você precisará ter o Horizon Client instalado. <a target='_blank' href='{0}'>Install the Horizon Client</a> caso ainda não o tenha.",
        "myapps.launch.view.unknownClientType": "Tipo de cliente desconhecido para abrir o Horizon Client.",
        "myapps.launch.view.openWithView" : "Abrir com o Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Abrir com o Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Ao selecionar o Browser, sua Visualização abrirá em uma nova janela do navegador.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Isto exige o Horizon Client 3.0 ou superior. <a target='_blank' href='{0}'>Install the Horizon Client</a> caso ainda não o tenha.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Você pode alterar esta configuração em Preferências.",
        "myapps.launch.msg.launching.desktop":"Inicializando Desktop <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Inicializando aplicativo <b>{0}</b> .....",
        "myapps.noAppsMsg": "Você não adicionou nenhum aplicativo. Navegue até o {0} para adicioná-lo(s)",
        "myapps.noFavAppsMsg": "Não há aplicativos marcados como favoritos",
        "myapps.dialog.openApp": "ABRIR",
        "myapps.dialog.openAppWithViewClient": "Iniciar no Client",
        "myapps.dialog.openAppWithBrowser": "Iniciar no Browser",
        "deviceStatus.networkLost" : "A conexão com a rede foi perdida",
        "deviceStatus.networkRestored" : "A conexão com a rede foi restabelecida",
        "api.session.expired.retry":"A sessão expirou. Estamos tentando renová-la...",
        "api.error":"Houve um erro. Tente novamente.",
        "api.timeout":"O tempo limite da conexão foi atingido. Tente novamente.",
        "favoriteStatus.favorite" : "Favorito",
        "favoriteStatus.unfavorite" : "Remover favorito",
        "favoriteStatus.offlineFavoriteMessage": "A marcação de um aplicativo não está disponível enquanto estiver offline. Conecte novamente e tente outra vez.",
        "error.failToFavoriteApp": "Falha ao atualizar o status de favorito",
        "error.failToHideApp": "Falha ao remover o aplicativo",
        "error.failToShowApp": "Falha ao adicionar o aplicativo ao Inicializador",
        "installStatus.offlineInstallMessage": "Pedidos de instalação não estão disponíveis enquanto estiver offline. Conecte novamente e tente outra vez.",
        "installStatus.activated": "Ativado",
        "installStatus.notActivated": "Não ativado",
        "installStatus.request": "Solicitar",
        "installStatus.update": "Atualizar",
        "installStatus.processing": "Processando",
        "installStatus.installFailedMessage": "Tente novamente ou contate seu administrador de TI se o problema persistir.",
        "requestFailed": "Falha no pedido",
        "requestSuccessful": "Solicitação bem-sucedida",
        "accept": "Aceitar",
        "decline": "Recusar",
        "termsOfUse": "Termos de Uso",
        "beforeInstallation": "Antes da instalação",
        "resetDesktopStatus.offlineMessage": "A redefinição do desktop não está disponível enquanto estiver offline. Conecte novamente e tente outra vez.",
        "error.failToResetDesktop": "Falha ao redefinir o desktop",
        "resetDesktop.sucess": "Redefinição do desktop bem-sucedida",
        "appCenter.someAppsMissingMessage": "Todos os aplicativos não puderam ser carregados desta vez",
        "appCenter.device.status.notRegistered": "O dispositivo não está inscrito",
        "appCenter.device.status.blackListed": "Este dispositivo está na lista de não autorizados",
        "appCenter.device.status.unknownError": "Ocorreu um erro desconhecido",
        "appCenter.device.register": "Registrar o dispositivo",
        "appCenter.device.moreDetails":"Mais detalhes",
        "appCenter.noAppsMsg": "Nenhum aplicativo está disponível no momento",
        "appCenter.noSearchResults": "Nenhum resultado encontrado",
        "appCenter.vppInviteTitle": "Registro de distribuição gerenciada",
        "appCenter.appInstallConfirmPromptTitle": "Confirmar instalação",
        "appCenter.acceptInvite": "Aceitar convite",
        "appCenter.install": "Instalar",
        "appCenter.proceed": "Prosseguir",
        "appCenter.cancel": "Cancelar",
        "appCenter.searchApps": "Buscar aplicativos",
        "appCenter.welcomeMsg": "Instale aplicativos novos em qualquer lugar, em qualquer dispositivo!",
        "appCenter.done": "Concluído",
        "appCenter.nav.privacyPage": "Página de privacidade",
        "appCenter.nav.catalog": "Catalog",
        "appCenter.nav.myApps": "Meus aplicativos",
        "appCenter.nav.favorites": "Favoritos",
        "appCenter.nav.categories": "Categorias",
        "appCenter.nav.filterby": "Filtrar por",
        "appCenter.nav.show": "Mostrar",
        "appCenter.nav.settings": "Ajustes",
        "appCenter.nav.sortBy": "Classificar por:",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtro",
        "appCenter.action.install": "Instalar",
        "appCenter.action.installed": "Instalado",
        "appCenter.action.added": "Adicionado",
        "appCenter.action.processing": "Processando",
        "appCenter.action.update": "Atualizar",
        "appCenter.action.request": "Solicitar",
        "appCenter.type.web": "Aplicativo da web",
        "appCenter.type.native": "Aplicativo nativo",
        "appCenter.type.native.platform": "Aplicativo {0}",
        "appCenter.type.virtual": "Aplicativo virtual",
        "myapp.nav.categories": "Categorias",
        "myapp.nav.favorites": "Favoritos",
        "myapp.nav.allApps": "Todos os aplicativos",
        "myapp.label.new": "Novo",
        "myapp.nav.filterby": "Filtrar por",
        "userInfo.adminConsole":"Console",
        "userInfo.preferences":"Preferências",
        "userInfo.about":"Sobre",
        "userInfo.devices":"Dispositivos",
        "userInfo.signout":"Sair",
        "app.details.link.back": "Voltar",
        "app.details.nav.details": "Detalhes",
        "app.details.nav.reviews": "Análises",
        "app.details.label.description": "Descrição",
        "app.details.label.seeFullDetails": "Ver detalhes completos...",
        "app.details.label.information": "Informação",
        "app.details.label.category": "Categorias",
        "app.details.label.version": "Versão",
        "app.details.label.type": "Tipo:",
        "app.details.label.type.SAML11": "Aplicativo da web",
        "app.details.label.type.SAML20": "Aplicativo da web",
        "app.details.label.type.WEBAPPLINK": "Aplicativo da web",
        "app.details.label.type.WSFED12": "Aplicativo da web",
        "app.details.label.type.XENAPP": "Aplicativo Xen",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Desktop do Citrix",
        "app.details.label.type.THINAPP": "Aplicativo Thin",
        "app.details.label.type.VIEWPOOL": "Visualizar Desktop",
        "app.details.label.type.VIEWAPP": "Visualizar aplicativo",
        "app.details.label.type.DESKTONEDESKTOP": "Desktop do Desktone",
        "app.details.label.type.DESKTONEAPPLICATION": "Aplicativo Desktone",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Tamanho",
        "app.details.label.price": "Preço",
        "app.details.label.screenshots": "Capturas de tela",
        "app.details.label.requirement": "Requisito:",
        "app.details.label.packageName": "Nome do pacote:",
        "app.details.thinapp.requirement": "Este aplicativo só funciona em um computador executando o Windows, com o Desktop Identity Manager instalado.",
        "app.details.viewDesktop.requirement": "A opção Visualizar desktop requer que a(o) {0} Horizon Client {1} 3.0 ou superior esteja instalado no seu computador.",
        "app.details.viewapp.requirement": "A opção Visualizar aplicativo hospedado requer que a(o) {0} Horizon Client{1} 3.0 ou superior esteja instalado no seu computador.",
        "app.details.xenapp.requirement": "Este aplicativo requer que a(o) {0} Citrix Receiver {1} esteja instalado.",
        "app.details.xenapp.msg.IE8OrLower":"Este aplicativo requer que o Citrix Receiver esteja instalado. Observação: Este aplicativo não pode ser aberto no Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Este desktop do Citrix requer que a(o) {0} Citrix Receiver {1} esteja instalado.",
        "app.details.desktoneDesktop.requirement": "Este desktop do Horizon DaaS requer que a(o) {0} Horizon Client {1} esteja instalado no seu computador.",
        "app.details.desktoneApp.requirement": "Este aplicativo Horizon DaaS requer que a(o) {0} Horizon Client {1} esteja instalado no seu computador.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Nenhuma informação disponível",
        "app.details.noScreenshots": "Nenhuma captura de tela disponível",
        "app.details.noDescription": "Nenhuma descrição disponível",
        "app.details.needsDeviceEnrollment": "Requer a inscrição do dispositivo",
        "app.settings.label.settings": "Ajustes",
        "app.settings.link.back": "Voltar",
        "app.settings.managedDevices": "Dispositivos gerenciados",
        "app.nav.tab.launcher":"Inicializador",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"Sobre o VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Política de Privacidade",
        "app.about.button.label.patents":"Patente",
        "app.about.button.label.licenseAgreement":"Termos de Uso",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-br",
        "app.about.licenseAgreementLink":"http://www.vmware.com/br/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/br/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Dispositivos",
        "app.devices.tableColumn.deviceName":"Nome do dispositivo",
        "app.devices.tableColumn.userDeviceId":"ID do dispositivo",
        "app.devices.tableColumn.lastLoginTime":"Horário do último login",
        "app.devices.unlinkDevice":"Desvincular",
        "app.devices.unlinkedDevice": "Desvinculado",
        "app.devices.emptyDeviceListTitle": "Você não tem nenhum computador vinculado.",
        "app.devices.emptyDeviceListMessage": "Para se vincular a um computador, você deve instalar e registrar o VMware Identity Manager Desktop para Windows.",

		"app.thinappMultiDeviceAct.heading":"Este aplicativo será adicionado aos dispositivos aprovados. Para usar \"{0}\" em dispositivos adicionais, procure o nome do mesmo abaixo, e clique no botão Solicitar.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Nome do dispositivo",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Solicitar",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Recusado",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Pendente",
        "app.thinappMultiDeviceAct.activationState.activated":"Aprovado",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Não ativado",
        "app.setAppPassword.heading":"Defina a senha para o aplicativo {0}",
        "app.setAppPassword.instruction":"Utilize o formulário abaixo para definir uma senha para esse aplicativo. A senha deve ter pelo menos três caracteres de comprimento.",
        "app.setAppPassword.label.password": "Senha",
        "app.setAppPassword.label.confirmPassword": "Confirmar senha",
        "app.setAppPassword.label.generate": "Gerar uma senha",
        "app.setAppPassword.error.passwordsNoMatch": "As senhas não coincidem.",
        "app.setAppPassword.msg.success": "Sua senha do aplicativo foi criada com êxito.",
        "app.setAppPassword.msg.fail": "Houve um erro ao tentar definir a sua senha. Tente novamente.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Instalar",
        "app.banner.open":"Abrir",
        "button.cancel":"Cancelar",
        "myapps.launch.passwordvault.installExtension.description":"Este aplicativo pode utilizar a extensão do navegador do Vault de senhas. <a target='_blank' href='{0}'> Instale esta extensão</a> se ainda não o fez.",
        "installMessage.continueInstall":"Você tentou instalar este aplicativo antes. ",
        "installMessage.proceedToInstall":"Clique para continuar.",
        "appCenter.device.status.confError":"O MDM não pôde encontrar nenhuma informação para o seu dispositivo",
        "appCenter.device.unEnrollWarningTitle":"Aviso",
        "appCenter.device.mdmUnEnrollMessage":"Remover todos os dados e aplicativos do Workspace ONE deste dispositivo.",
        "appCenter.device.disableWorkspaceMessage":"Remover sua conta irá revogar o acesso concedido através do aplicativo do Workspace ONE. Os aplicativos baixados para sua springboard permanecerão instalados, mas o acesso poderá ser negado. Deseja continuar?",
        "appCenter.internalApp.installationStepTitle":"Para abrir este aplicativo, será preciso seguir estas etapas após sua instalação.",
        "appCenter.internalApp.step1":"Inicialize Ajustes na tela inicial do seu iPhone",
        "appCenter.internalApp.step2":"Toque em Geral",
        "appCenter.internalApp.step3":"Toque em Perfil e Gerenciamento de dispositivo",
        "appCenter.internalApp.step4":"Toque no nome do desenvolvedor em Aplicativo empresarial",
        "appCenter.internalApp.step5":"Verifique ou Confie no aplicativo",
        "appCenter.internalApp.watchTutorial":"Assista o tutorial passo-a-passo",
        "userInfo.removeAccount":"Remover conta",
        "userInfo.account":"Conta",
        "userInfo.password":"Senha",
        "app.changePassword.title":"Alterar senha",
        "app.changePassword.enterCurrentPassword":"Digitar senha atual",
        "app.changePassword.enterNewPassword":"Digitar senha nova",
        "app.changePassword.confirmNewPassword":"Confirmar senha nova",
        "app.changePassword.error.passwordsNoMatch":"As senhas novas não conferem",
        "app.changePassword.success":"A senha nova foi salva!",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Telefone",
        "app.logout.confirm.msg":"Efetuar o logout do Workspace ONE encerrará esta sessão. Qualquer aplicativo baixado do catálogo permanecerá no dispositivo, mas nenhum aplicativo novo estará disponível até que faça o login outra vez.",
        "app.logout.title":"AVISO",
        "app.passwordVault.banner.msg":"Você possui aplicativos que podem utilizar a extensão do navegador do Vault de senhas.",
        "app.passwordVault.banner.button.install":"Instalar"
});
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE находится в режиме обслуживания. Вы можете запустить приложения, но некоторые функции могут быть недоступны.",
        "appCenter.device.unEnrollWarningMessage":"Отменив регистрацию вы потеряете доступ к некоторым приложениям. Продолжить?",
        "appCenter.action.add":"Добавить+",
        "userInfo.unenroll":"Отменить регистрацию",
        "myapps.welcomeMsg": "Добро пожаловать {0}, вот ваши приложения!",
        "api.updateApps": "Обновление списка...",
        "installStatus.enrollDevice": "Для использования {0} необходимо активировать Workspace Services, защищающие корпоративные данные.",
        "installStatus.unenrolledDevice": "Это приложение больше не доступно. Нажмите ОК, чтобы обновить список.",
        "changeOccurred": "Произошло изменение",
        "appCenter.auth.mdmError": "В данный момент невозможно загрузить все приложения. Скорей всего это связано с ошибкой в настройке или сети при обмене данными с MDM.",
        "appCenter.device.status.commError": "При получении приложений для вашего устройства произошла ошибка в MDM.",
        "appCenter.device.status.deviceInputError": "Это неправильное устройство! Пожалуйста, свяжитесь с вашим IT-администратором.",
        "appCenter.device.mdmApps.notFoundError": "MDM не нашел приложения, назначенные на ваше устройство.",
        "appCenter.nav.browseBy": "Поиск по",
        "app.launchPassword.heading": "Запрос пароля",
        "app.launchPassword.view.instruction": "Необходимо ввести пароль для входа в этот ресурс Windows {0}.",
        "app.launchPassword.label.userName": "Пользователь",
        "app.launchPassword.label.password": "пароль",
        "app.launchPassword.button.label.signin": "Войти",
        "appCenter" : "Центр приложений",
        "ok" : "ОК",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/загрузить",
        "horizonDesktopNotDetected": "Чтобы открыть это приложение необходимо установить на компьютер VMware Identity Manager Desktop. <a target='_blank' href='{0}'>Установите VMware Identity Manager Desktop</a> если вы еще это не сделали.",
        "viewAppsTooltip":"Технология View Hosted Application требует установку {0} Horizon Client {1} версии 3.0 и старше на ваш компьютер.",
        "desktoneDesktopTooltip":"Для Horizon DaaS Desktop необходимо установить {0} Horizon View {1} на ваш компьютер.",
        "desktoneApplicationTooltip":"Для Horizon DaaS Application необходимо установить {0} Horizon View {1} на ваш компьютер.",
        "xenAppsReceiverNotDetected": "Чтобы открыть это приложение необходимо установить на компьютер Citrix Receiver. <a target='_blank' href='{0}'>Установите Citrix Receiver</a> если вы еще это не сделали.",
        "button.save" : "Сохранить",
        "button.openHorizonView": "Открыть Horizon Client",
        "myapps.launch.openApp": "Открыть {0}",
        "button.openApp": "Открыть прилож.",
        "button.clear": "Очистить",
        "button.close": "Закрыть",
        "myapps.launch.view.openWith": "Открыть с",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(по умолчанию)",
        "myapps.launch.view.selectPreferredLaunchClient": "Выберите метод запуска рабочих столов и приложений Horizon",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "ВЫБРАТЬ МЕТОД ЗАПУСКА ПО УМОЛЧАНИЮ...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Это определяет поведение программы запуска по умолчанию при выборе версии рабочего стола View на вашем устройстве. Если по умолчанию выбрано View, необходимо установить Horizon Client. <a target='_blank' href='{0}'>Установите Horizon Client</a> если вы еще это не сделали.",
        "myapps.launch.view.unknownClientType": "Для открытия Horizon Client используется неизвестный тип клиента.",
        "myapps.launch.view.openWithView" : "Открыть с помощью Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Открыть с помощью Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Если вы выберите Browser, View откроется в новом окне браузера.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Этот элемент требует установку Horizon Client 3.0 и старше. <a target='_blank' href='{0}'>Установите Horizon Client</a> если вы еще это не сделали.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Вы всегда можете изменить этот параметр в настройках.",
        "myapps.launch.msg.launching.desktop":"Запуск рабочего стола <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Запуск приложения <b>{0}</b> .....",
        "myapps.noAppsMsg": "Вы не добавили ни одного приложения, чтобы добавить пройдите в {0}.",
        "myapps.noFavAppsMsg": "Вы не добавили ни одного приложения в Избранное",
        "myapps.dialog.openApp": "ОТКРЫТЬ",
        "myapps.dialog.openAppWithViewClient": "Запустить в Client",
        "myapps.dialog.openAppWithBrowser": "Запустить в Browser",
        "deviceStatus.networkLost" : "Сетевое подключение прервано",
        "deviceStatus.networkRestored" : "Сетевое подключение восстановлено",
        "api.session.expired.retry":"Срок действия сеанса истек. Попытка продления...",
        "api.error":"Произошла ошибка, повторите",
        "api.timeout":"Превышен интервал ожидания для подключения, повторите",
        "favoriteStatus.favorite" : "Избранное",
        "favoriteStatus.unfavorite" : "Удалить из избранного",
        "favoriteStatus.offlineFavoriteMessage": "Функция добавления приложения в Избранное, недоступна в автономном режиме. Повторно подключитесь и повторите попытку.",
        "error.failToFavoriteApp": "Не удалось обновить статус добавления в Избранное",
        "error.failToHideApp": "Не удалось удалить приложение",
        "error.failToShowApp": "Не удалось добавить приложение в Launcher",
        "installStatus.offlineInstallMessage": "Запросы установки недоступны в автономном режиме. Повторно подключитесь и повторите попытку.",
        "installStatus.activated": "Активировано",
        "installStatus.notActivated": "Не активировано",
        "installStatus.request": "Запрос",
        "installStatus.update": "Обновление",
        "installStatus.processing": "Обработка",
        "installStatus.installFailedMessage": "Повторите попытку или обратитесь к системному администратору, если проблему не удается устранить.",
        "requestFailed": "Ошибка запроса",
        "requestSuccessful": "Запрос успешно выполнен",
        "accept": "Принять",
        "decline": "Отклонить",
        "termsOfUse": "Условия использования",
        "beforeInstallation": "Перед установкой",
        "resetDesktopStatus.offlineMessage": "Сброс рабочего стола недоступен в автономном режиме. Повторно подключитесь и повторите попытку.",
        "error.failToResetDesktop": "Не удалось сбросить рабочий стол.",
        "resetDesktop.sucess": "Сброс рабочего стола выполнен успешно.",
        "appCenter.someAppsMissingMessage": "На данный момент не удалось загрузить приложения",
        "appCenter.device.status.notRegistered": "Устройство не зарегистрировано",
        "appCenter.device.status.blackListed": "Это устройство внесено в черный список",
        "appCenter.device.status.unknownError": "Произошла неизвестная ошибка",
        "appCenter.device.register": "Зарегистрировать устройство",
        "appCenter.device.moreDetails":"Дополнительные сведения",
        "appCenter.noAppsMsg": "На данный момент нет приложений",
        "appCenter.noSearchResults": "Ничего не найдено",
        "appCenter.vppInviteTitle": "Регистрация управляемой рассылки",
        "appCenter.appInstallConfirmPromptTitle": "Подтвердить установку",
        "appCenter.acceptInvite": "Принять приглашение",
        "appCenter.install": "Установить",
        "appCenter.proceed": "Продолжить",
        "appCenter.cancel": "Отмена",
        "appCenter.searchApps": "Поиск приложений",
        "appCenter.welcomeMsg": "Установка новых приложений в любом месте, на любое устройство!",
        "appCenter.done": "Готово",
        "appCenter.nav.privacyPage": "Вкладка «Конфиденциальность»",
        "appCenter.nav.catalog": "Catalog",
        "appCenter.nav.myApps": "Мои приложения",
        "appCenter.nav.favorites": "Избранное",
        "appCenter.nav.categories": "Категории",
        "appCenter.nav.filterby": "Фильтровать по",
        "appCenter.nav.show": "Показать",
        "appCenter.nav.settings": "Настройки",
        "appCenter.nav.sortBy": "Сортировать по",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Фильтр",
        "appCenter.action.install": "Установить",
        "appCenter.action.installed": "Установлено",
        "appCenter.action.added": "Добавлено",
        "appCenter.action.processing": "Обработка",
        "appCenter.action.update": "Обновление",
        "appCenter.action.request": "Запрос",
        "appCenter.type.web": "Веб-приложение",
        "appCenter.type.native": "Внутреннее приложение",
        "appCenter.type.native.platform": "Приложение {0}",
        "appCenter.type.virtual": "Виртуальное приложение",
        "myapp.nav.categories": "Категории",
        "myapp.nav.favorites": "Избранное",
        "myapp.nav.allApps": "Все приложения",
        "myapp.label.new": "Новое",
        "myapp.nav.filterby": "Фильтровать по",
        "userInfo.adminConsole":"Административная консоль",
        "userInfo.preferences":"Параметры",
        "userInfo.about":"Сведения",
        "userInfo.devices":"Устройства",
        "userInfo.signout":"Выход",
        "app.details.link.back": "Назад",
        "app.details.nav.details": "Подробности",
        "app.details.nav.reviews": "Отзывы",
        "app.details.label.description": "Описание",
        "app.details.label.seeFullDetails": "Просмотреть полные сведения...",
        "app.details.label.information": "Сведения",
        "app.details.label.category": "Категории",
        "app.details.label.version": "Версия",
        "app.details.label.type": "Тип:",
        "app.details.label.type.SAML11": "Веб-приложение",
        "app.details.label.type.SAML20": "Веб-приложение",
        "app.details.label.type.WEBAPPLINK": "Веб-приложение",
        "app.details.label.type.WSFED12": "Веб-приложение",
        "app.details.label.type.XENAPP": "XenApp",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "View Desktop",
        "app.details.label.type.VIEWAPP": "View App",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone App",
        "app.details.label.type.APPV": "App-V",
        "app.details.label.size": "Размер",
        "app.details.label.price": "Цена",
        "app.details.label.screenshots": "Снимки экрана",
        "app.details.label.requirement": "Требование:",
        "app.details.label.packageName": "Название пакета:",
        "app.details.thinapp.requirement": "Это приложение работает только на компьютере Windows с установленным Identity Manager Desktop.",
        "app.details.viewDesktop.requirement": "Технология View Desktop требует установку {0} Horizon Client {1} версии 3.0 и старше на ваш компьютер.",
        "app.details.viewapp.requirement": "Технология View Hosted Application требует установку {0} Horizon Client {1} версии 3.0 и старше на ваш компьютер.",
        "app.details.xenapp.requirement": "Для этого приложения необходимо установить {0} Citrix Receiver {1}.",
        "app.details.xenapp.msg.IE8OrLower":"Для этого приложения необходимо установить Citrix Receiver. Примечание. Данное приложение нельзя открыть в Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Для Citrix Desktop необходимо установить {0} Citrix Receiver {1}.",
        "app.details.desktoneDesktop.requirement": "Для Horizon DaaS Desktop необходимо установить {0} Horizon Client {1} на ваш компьютер.",
        "app.details.desktoneApp.requirement": "Для приложения Horizon DaaS необходимо установить {0} Horizon Client {1} на ваш компьютер.",
        "app.details.abbrev.megabytes": "МБ",
        "app.details.noData": "Нет данных",
        "app.details.noScreenshots": "Нет снимков экрана",
        "app.details.noDescription": "Нет описания",
        "app.details.needsDeviceEnrollment": "Необходима регистрация устройства.",
        "app.settings.label.settings": "Настройки",
        "app.settings.link.back": "Назад",
        "app.settings.managedDevices": "Управляемые устройства",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOG",
        "app.about.heading":"Сведения о VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Политика конфиденциальности",
        "app.about.button.label.patents":"Патент",
        "app.about.button.label.licenseAgreement":"Лицензионное соглашение",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-ru",
        "app.about.licenseAgreementLink":"http://www.vmware.com/ru/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/ru/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Устройства",
        "app.devices.tableColumn.deviceName":"Имя устройства",
        "app.devices.tableColumn.userDeviceId":"ID устройства",
        "app.devices.tableColumn.lastLoginTime":"Время последнего входа",
        "app.devices.unlinkDevice":"Разорвать связь",
        "app.devices.unlinkedDevice": "Связь разорвана",
        "app.devices.emptyDeviceListTitle": "У вас нет связанных компьютеров.",
        "app.devices.emptyDeviceListMessage": "Чтобы связать компьютер, необходимо установить и зарегистрировать VMware Identity Manager Desktop для Windows.",

		"app.thinappMultiDeviceAct.heading":"Это приложение будет добавлено на разрешенные устройства. Чтобы использовать \"{0}\" на дополнительных устройствах, найдите название устройства ниже и затем нажмите на кнопку Запрос.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Имя устройства",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Статус",
        "app.thinappMultiDeviceAct.button.request":"Запрос",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Отклонено",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Ожидание",
        "app.thinappMultiDeviceAct.activationState.activated":"Утверждено",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Не активировано",
        "app.setAppPassword.heading":"Установить пароль для приложения {0}",
        "app.setAppPassword.instruction":"Используйте форму приведенную ниже, чтобы установить пароль для этого приложения. Пароль должен включать как минимум 3 знака.",
        "app.setAppPassword.label.password": "Пароль",
        "app.setAppPassword.label.confirmPassword": "Подтвердите пароль",
        "app.setAppPassword.label.generate": "Создать пароль",
        "app.setAppPassword.error.passwordsNoMatch": "Пароли не совпадают.",
        "app.setAppPassword.msg.success": "Пароль для приложения успешно установлен.",
        "app.setAppPassword.msg.fail": "Произошла ошибка при установке пароля. Повторите попытку.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Установить",
        "app.banner.open":"Открыть",
        "button.cancel":"Отменить",
        "myapps.launch.passwordvault.installExtension.description":"Это приложение может использовать расширение браузера для хранилища паролей. Если вы еще не установили <a target='_blank' href='{0}'>Установите расширение</a>.",
        "installMessage.continueInstall":"Вы уже ранее пытались установить это приложение. ",
        "installMessage.proceedToInstall":"Нажмите, чтобы продолжить.",
        "appCenter.device.status.confError":"MDM не удалось найти сведения о вашем устройстве",
        "appCenter.device.unEnrollWarningTitle":"Предупреждение!",
        "appCenter.device.mdmUnEnrollMessage":"Удалить все приложения и данные Workspace ONE с этого устройства.",
        "appCenter.device.disableWorkspaceMessage":"Удаление аккаунта приведет к отмене доступа, предоставленного через приложение Workspace ONE. Ранее загруженные и установленные приложения останутся на домашнем экране, но доступ к ним, возможно будет ограничен. Продолжить?",
        "appCenter.internalApp.installationStepTitle":"Чтобы открыть приложение, выполните следующие действия после установки.",
        "appCenter.internalApp.step1":"С домашнего экрана iPhone откройте «Настройки».",
        "appCenter.internalApp.step2":"В разделе «Основные».",
        "appCenter.internalApp.step3":"Откройте «Профили» и «Управление устройством».",
        "appCenter.internalApp.step4":"Выберите имя разработчика в разделе «Корпоративная программа».",
        "appCenter.internalApp.step5":"Сделайте разработчика доверенным.",
        "appCenter.internalApp.watchTutorial":"См. пошаговую инструкцию",
        "userInfo.removeAccount":"Удалить аккаунт",
        "userInfo.account":"Аккаунт",
        "userInfo.password":"Пароль",
        "app.changePassword.title":"Сменить пароль",
        "app.changePassword.enterCurrentPassword":"Введите текущий пароль",
        "app.changePassword.enterNewPassword":"Введите новый пароль",
        "app.changePassword.confirmNewPassword":"Подтверждение нового пароля",
        "app.changePassword.error.passwordsNoMatch":"Новые пароли не совпадают.",
        "app.changePassword.success":"Новый пароль сохранен!",
        "app.changePassword.label.email":"Эл. почта",
        "app.changePassword.label.phone":"Телефон",
        "app.logout.confirm.msg":"При выходе из Workspace ONE текущий сеанс будет завершен. Приложения загруженные с каталога останутся на устройстве, но новые приложения не будут доступны, пока вы снова не войдете в Workspace ONE.",
        "app.logout.title":"ВНИМАНИЕ!",
        "app.passwordVault.banner.msg":"У вас есть приложения, к которым можно применить расширение браузера для хранилища паролей.",
        "app.passwordVault.banner.button.install":"Установить"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE befinner sig för tillfället i underhållsläge. Du kan starta dina appar, men vissa funktioner kanske inte fungerar",
        "appCenter.device.unEnrollWarningMessage":"Om du avregistrerar förlorar du åtkomsten till några appar du är berättigad till. Vill du fortsätta?",
        "appCenter.action.add":"Lägg till+",
        "userInfo.unenroll":"Avregistrera",
        "myapps.welcomeMsg": "Hej, {0}. Här är dina appar!",
        "api.updateApps": "Uppdaterar listan...",
        "installStatus.enrollDevice": "Aktivering av Workspace-tjänster krävs för användning av {0} för att skydda företagsdata",
        "installStatus.unenrolledDevice": "Appen är inte längre tillgänglig. Tryck på OK för att uppdatera listan.",
        "changeOccurred": "Ändring inträffade",
        "appCenter.auth.mdmError": "Alla appar kunde inte laddas just nu. ",
        "appCenter.device.status.commError": "MDM svarade med ett fel vid hämtning av appar för din enhet",
        "appCenter.device.status.deviceInputError": "Enheten är ogiltig! Kontakta din it-administratör",
        "appCenter.device.mdmApps.notFoundError": "MDM kunde inte hitta några appar som tilldelats till din enhet",
        "appCenter.nav.browseBy": "Bläddra efter",
        "app.launchPassword.heading": "Lösenordsförfrågan",
        "app.launchPassword.view.instruction": "Vi behöver ditt lösenord för att logga in på den här Windows-resursen {0}.",
        "app.launchPassword.label.userName": "Användare",
        "app.launchPassword.label.password": "lösenord",
        "app.launchPassword.button.label.signin": "Logga in",
        "appCenter" : "Appcenter",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "För att öppna applikationen måste VMware Identity Manager Desktop vara installerad på den här datorn . <a target='_blank' href='{0}'>Installera VMware Identity Manager Desktop</a> om du inte redan gjort det.",
        "viewAppsTooltip":"Den här View-hostade applikationen kräver att {0} Horizon Client{1} 3.0 eller senare finns installerad på datorn.",
        "desktoneDesktopTooltip":"Horizon DaaS Desktop kräver att {0} Horizon Client {1} finns installerad på datorn.",
        "desktoneApplicationTooltip":"Horizon DaaS-applikationen kräver att {0} Horizon Client {1} finns installerad på datorn.",
        "xenAppsReceiverNotDetected": "Citrix Receiver måste installeras på den här datorn för att kunna öppna applikationen. <a target=’_blank’ href=’{0}’>Installera Citrix Receiver</a> om du inte redan gjort det.",
        "button.save" : "Spara",
        "button.openHorizonView": "Öppna Horizon Client",
        "myapps.launch.openApp": "Öppna {0}",
        "button.openApp": "Öppna app",
        "button.clear": "Rensa",
        "button.close": "Stäng",
        "myapps.launch.view.openWith": "Öppna med",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "AW Browser",
        "myapps.launch.view.preferredClient.isDefault": "(förval)",
        "myapps.launch.view.selectPreferredLaunchClient": "Välj hur du vill starta Horizon Desktop och applikationer",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "VÄLJ STANDARDSTART",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Det här avgör beteendet vid start när du väljer att öppna en View Desktop från din enhet. Om du väljer View som standard måste du ha Horizon Client installerad. <a target=’_blank’ href=’{0}’>Installera Horizon Client </a> om du inte redan gjort det.",
        "myapps.launch.view.unknownClientType": "Okänd klienttyp för att öppna Horizon Client.",
        "myapps.launch.view.openWithView" : "Öppna med Horizon Client.",
        "myapps.launch.view.openWithBrowser" : "Öppna med webbläsare",
        "myapps.launch.view.preferredClient.byBrowser.description": "Om du väljer webbläsare kommer vyn att öppnas i ett nytt fönster.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Det här objektet kräver Horizon Client 3.0 eller senare. <a target=’_blank’ href=’{0}’>Installera Horizon Client</a> om du inte redan gjort det.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Du kan alltid ändra inställningen i Inställningar.",
        "myapps.launch.msg.launching.desktop":"Startar Desktop <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Startar applikation <b>{0}</b> .....",
        "myapps.noAppsMsg": "Du har inte lagt till några appar. Du kan gå till {0} för att lägga till appar.",
        "myapps.noFavAppsMsg": "Du har inte markerat några appar som favoriter",
        "myapps.dialog.openApp": "ÖPPNA",
        "myapps.dialog.openAppWithViewClient": "Öppna i Client",
        "myapps.dialog.openAppWithBrowser": "Öppna i webbläsaren",
        "deviceStatus.networkLost" : "Du har förlorat anslutningen",
        "deviceStatus.networkRestored" : "Nätverksanslutningen har återställts",
        "api.session.expired.retry":"Sessionen har förfallit. Försöker förnya...",
        "api.error":"Ett fel inträffade, försök igen",
        "api.timeout":"Tidsgränsen för anslutningen har uppnåtts, försök igen",
        "favoriteStatus.favorite" : "Favorit",
        "favoriteStatus.unfavorite" : "Ta bort som favorit",
        "favoriteStatus.offlineFavoriteMessage": "Det går inte att markera en app som favorit offline. Anslut och försök igen.",
        "error.failToFavoriteApp": "Det gick inte att uppdatera favoritstatus",
        "error.failToHideApp": "Det gick inte att ta bort appen",
        "error.failToShowApp": "Det gick inte att lägga till appen i Launcher",
        "installStatus.offlineInstallMessage": "Det går inte att skicka installationsförfrågningar offline. Anslut och försök igen.",
        "installStatus.activated": "Aktiverad",
        "installStatus.notActivated": "Inte aktiverat",
        "installStatus.request": "Förfrågan",
        "installStatus.update": "Uppdatering",
        "installStatus.processing": "Bearbetar",
        "installStatus.installFailedMessage": "Försök igen, och kontakta därefter din it-administratör om felet kvarstår.",
        "requestFailed": "Begäran misslyckades",
        "requestSuccessful": "Förfrågan lyckades",
        "accept": "Godkänn",
        "decline": "Avböj",
        "termsOfUse": "Användarvillkor",
        "beforeInstallation": "Före installationen",
        "resetDesktopStatus.offlineMessage": "Det går inte att återställa skrivbordet offline. Anslut och försök igen.",
        "error.failToResetDesktop": "Det gick inte att återställa skrivbordet",
        "resetDesktop.sucess": "Skrivbordet har återställts",
        "appCenter.someAppsMissingMessage": "Det gick inte att ladda alla appar just nu",
        "appCenter.device.status.notRegistered": "Enheten har inte registrerats",
        "appCenter.device.status.blackListed": "Enheten är svartlistad",
        "appCenter.device.status.unknownError": "Ett okänt fel inträffade",
        "appCenter.device.register": "Mata in enhet",
        "appCenter.device.moreDetails":"Mer info",
        "appCenter.noAppsMsg": "Inga appar är tillgängliga just nu",
        "appCenter.noSearchResults": "Inga träffar",
        "appCenter.vppInviteTitle": "Registrering för hanterad distribution",
        "appCenter.appInstallConfirmPromptTitle": "Bekräfta installering",
        "appCenter.acceptInvite": "Godkänn inbjudan",
        "appCenter.install": "Installera",
        "appCenter.proceed": "Fortsätt",
        "appCenter.cancel": "Avbryt",
        "appCenter.searchApps": "Sök appar",
        "appCenter.welcomeMsg": "Installera nya appar när som helst, på vilken enhet som helst!",
        "appCenter.done": "Klar",
        "appCenter.nav.privacyPage": "Integritetssida",
        "appCenter.nav.catalog": "Katalog",
        "appCenter.nav.myApps": "Mina appar",
        "appCenter.nav.favorites": "Favoriter",
        "appCenter.nav.categories": "Kategorier",
        "appCenter.nav.filterby": "Filtrera efter",
        "appCenter.nav.show": "Visa",
        "appCenter.nav.settings": "Inställningar",
        "appCenter.nav.sortBy": "Sortera efter",
        "appCenter.nav.sortBy.alpha": "Z-Ö",
        "appCenter.nav.filter": "Filtrera",
        "appCenter.action.install": "Installera",
        "appCenter.action.installed": "Installerad",
        "appCenter.action.added": "Tillagd",
        "appCenter.action.processing": "Bearbetar",
        "appCenter.action.update": "Uppdatering",
        "appCenter.action.request": "Förfrågan",
        "appCenter.type.web": "Webbapplikation",
        "appCenter.type.native": "Ursprunglig app",
        "appCenter.type.native.platform": "{0} app",
        "appCenter.type.virtual": "Virtuell app",
        "myapp.nav.categories": "Kategorier",
        "myapp.nav.favorites": "Favoriter",
        "myapp.nav.allApps": "Alla appar",
        "myapp.label.new": "Ny",
        "myapp.nav.filterby": "Filtrera efter",
        "userInfo.adminConsole":"Adminkonsol",
        "userInfo.preferences":"Inställningar",
        "userInfo.about":"Om",
        "userInfo.devices":"Enheter",
        "userInfo.signout":"Logga ut",
        "app.details.link.back": "Tillbaka",
        "app.details.nav.details": "Information",
        "app.details.nav.reviews": "Omdömen",
        "app.details.label.description": "Beskrivning",
        "app.details.label.seeFullDetails": "Se detaljerad information...",
        "app.details.label.information": "Information",
        "app.details.label.category": "Kategorier",
        "app.details.label.version": "Version:",
        "app.details.label.type": "Typ:",
        "app.details.label.type.SAML11": "Webbapplikation",
        "app.details.label.type.SAML20": "Webbapplikation",
        "app.details.label.type.WEBAPPLINK": "Webbapplikation",
        "app.details.label.type.WSFED12": "Webbapplikation",
        "app.details.label.type.XENAPP": "XenApp",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "Visa Desktop",
        "app.details.label.type.VIEWAPP": "Visa applikation",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone-applikation",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Storlek",
        "app.details.label.price": "Pris",
        "app.details.label.screenshots": "Skärmavbilder",
        "app.details.label.requirement": "Krav:",
        "app.details.label.packageName": "Paketnamn:",
        "app.details.thinapp.requirement": "Den här applikationen fungerar endast på en Windows-dator med Identity Manager Desktop installerad.",
        "app.details.viewDesktop.requirement": "Den här Desktop-vyn kräver att {0} Horizon Client{1} 3.0 eller senare finns installerad på datorn.",
        "app.details.viewapp.requirement": "Den här View-hostade applikationen kräver att {0} Horizon Client{1} 3.0 eller senare finns installerad på datorn.",
        "app.details.xenapp.requirement": "Applikationen kräver att {0} Citrix Receiver {1} finns installerad.",
        "app.details.xenapp.msg.IE8OrLower":"Applikationen kräver att Citrix Receiver installeras. Observera: det här applikationen kan inte öppnas i Internet Explorer 8.",
        "app.details.xenappsDeliveryGroup.requirement":"Citrix Desktop kräver att {0} Citrix Receiver {1} finns installerad.",
        "app.details.desktoneDesktop.requirement": "Horizon DaaS-skrivbordet kräver att {0} Horizon Client {1} finns installerad på datorn.",
        "app.details.desktoneApp.requirement": "Horizon DaaS-applikationen kräver att {0} Horizon Client {1} finns installerad på datorn.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Ingen information tillgänglig",
        "app.details.noScreenshots": "Inga skärmavbilder tillgängliga",
        "app.details.noDescription": "Ingen beskrivning tillgänglig",
        "app.details.needsDeviceEnrollment": "Kräver enhetsregistrering",
        "app.settings.label.settings": "Inställningar",
        "app.settings.link.back": "Tillbaka",
        "app.settings.managedDevices": "Hanterade enheter",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"KATALOG",
        "app.about.heading":"Om VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Integritetspolicy",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Licensavtal",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/se/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/se/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/se/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Enheter",
        "app.devices.tableColumn.deviceName":"Enhetens namn",
        "app.devices.tableColumn.userDeviceId":"Enhets-ID",
        "app.devices.tableColumn.lastLoginTime":"Senaste inloggning",
        "app.devices.unlinkDevice":"Ta bort länk",
        "app.devices.unlinkedDevice": "Olänkad",
        "app.devices.emptyDeviceListTitle": "Du har inga länkade datorer",
        "app.devices.emptyDeviceListMessage": "För att länka en dator måste du installera och registrera VMware Identity Manager Desktop för Windows.",

		"app.thinappMultiDeviceAct.heading":"Den här appen kommer att läggas till på godkända enheter. För att använda '{0}' på ytterligare enheter, hitta enhetens namn och klicka på Förfrågan.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Enhetens namn",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Begäran",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Avböjt",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Väntar",
        "app.thinappMultiDeviceAct.activationState.activated":"Godkänt",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Inte aktiverat",
        "app.setAppPassword.heading":"Ställ in lösenord för app {0}",
        "app.setAppPassword.instruction":"Använd formuläret nedan till att ställa in ett lösenord för applikationen. Lösenordet måste bestå av minst tre tecken.",
        "app.setAppPassword.label.password": "Lösenord",
        "app.setAppPassword.label.confirmPassword": "Bekräfta lösenord",
        "app.setAppPassword.label.generate": "Skapa lösenord",
        "app.setAppPassword.error.passwordsNoMatch": "Lösenorden matchar inte.",
        "app.setAppPassword.msg.success": "Ditt lösenord har skapats.",
        "app.setAppPassword.msg.fail": "Det uppstod ett fel när lösenordet skulle skapas. Försök igen.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installera",
        "app.banner.open":"Öppna",
        "button.cancel":"Avbryt",
        "myapps.launch.passwordvault.installExtension.description":"Den här appen kan använda Password Vaults webbläsartillägg. <a target='_blank' href='{0}'>Installera tillägget</a> om du inte redan har gjort det.",
        "installMessage.continueInstall":"Du har tidigare försökt installera appen. ",
        "installMessage.proceedToInstall":"Klicka för att fortsätta.",
        "appCenter.device.status.confError":"MDM hittade ingen information för din enhet",
        "appCenter.device.unEnrollWarningTitle":"Varning",
        "appCenter.device.mdmUnEnrollMessage":"Ta bort alla Workspace ONE-appar och data från den här enheten.",
        "appCenter.device.disableWorkspaceMessage":"Om du tar bort ditt konto förlorar du åtkomst till apparna via Workspace ONE. Apparna som hämtats till startsidan förblir installerade men åtkomsten kan påverkas. Vill du fortsätta?",
        "appCenter.internalApp.installationStepTitle":"Följ anvisningarna efter installationen för att öppna appen.",
        "appCenter.internalApp.step1":"Öppna Inställningar från hemskärmen på din iPhone",
        "appCenter.internalApp.step2":"Tryck på Allmänt",
        "appCenter.internalApp.step3":"Tryck på Profil och Enhetshantering",
        "appCenter.internalApp.step4":"Tryck på en apputvecklare under Företagsapp",
        "appCenter.internalApp.step5":"Bekräfta eller lita på appen",
        "appCenter.internalApp.watchTutorial":"Se instruktionsfilmen",
        "userInfo.removeAccount":"Ta bort kontot",
        "userInfo.account":"Konto",
        "userInfo.password":"Lösenord",
        "app.changePassword.title":"Ändra lösenord",
        "app.changePassword.enterCurrentPassword":"Ange nuvarande lösenord",
        "app.changePassword.enterNewPassword":"Ange nytt lösenord",
        "app.changePassword.confirmNewPassword":"Bekräfta nytt lösenord",
        "app.changePassword.error.passwordsNoMatch":"De nya lösenorden matchar inte.",
        "app.changePassword.success":"Det nya lösenordet har sparats!",
        "app.changePassword.label.email":"E-post",
        "app.changePassword.label.phone":"Telefon",
        "app.logout.confirm.msg":"Sessionen avslutas om du loggar ut ur Workspace ONE. Appar som laddats ner från katalogen finns kvar på enheten men nya inga nya appar finns tillgängliga förrän du loggar in igen.",
        "app.logout.title":"VARNING",
        "app.passwordVault.banner.msg":"Du har apparna som kan använda Password Vaults webbläsartillägg.",
        "app.passwordVault.banner.button.install":"Installera"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE geçici olarak bakım modundadır. Uygulamalarınızı başlatabilirsiniz fakat bazı özellikler çalışmayabilir.",
        "appCenter.device.unEnrollWarningMessage":"Kaydı silerek yetkili olduğunuz birkaç uygulamaya erişimi kaybedeceksiniz. Devam etmek ister misiniz?",
        "appCenter.action.add":"Ekle+",
        "userInfo.unenroll":"Kaydı Sil",
        "myapps.welcomeMsg": "Merhaba {0}, işte uygulamalarınız!",
        "api.updateApps": "Liste güncelleniyor...",
        "installStatus.enrollDevice": "{0} kullanımı, şirket verisini korumak için Workspace Hizmetleri’nin etkinleştirilmesini gerekli kılar.",
        "installStatus.unenrolledDevice": "Bu uygulamayı artık kullanamazsınız. Listeyi güncellemek için lütfen Tamam’a tıklayın.",
        "changeOccurred": "Değişiklik Oluştu.",
        "appCenter.auth.mdmError": "Şu anda tüm uygulamalar yüklenemiyor. MDM ile iletişim kurulurken bir yapılandırma ya da ağ hatası var.",
        "appCenter.device.status.commError": "Aygıtınız için uygulamalar alınırken MDM bir hatayla karşılaştı.",
        "appCenter.device.status.deviceInputError": "Bu aygıt geçersiz! Lütfen IT Yöneticinizle iletişime geçin.",
        "appCenter.device.mdmApps.notFoundError": "MDM, aygıtınıza atanmış hiçbir uygulama bulamadı.",
        "appCenter.nav.browseBy": "Şuna göre gözat:",
        "app.launchPassword.heading": "Parola İsteği",
        "app.launchPassword.view.instruction": "Bu Windows kaynağına {0} oturum açmak için parolanıza ihtiyacımız var.",
        "app.launchPassword.label.userName": "Kullanıcı",
        "app.launchPassword.label.password": "parolası",
        "app.launchPassword.button.label.signin": "Oturum Aç",
        "appCenter" : "Uygulama Merkezi",
        "ok" : "TAMAM",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/İndir",
        "horizonDesktopNotDetected": "Bu uygulamayı açmak için VMware Identity Manager Desktop'ın bu bilgisayara yüklenmesi gereklidir. <a target='_blank' href='{0}'>VMware Identity Manager’ı henüz yüklemediyseniz</a> lütfen yükleyin.",
        "viewAppsTooltip":"Bu View’de Barındırılan Uygulama, bilgisayarınıza yüklenmek üzere şunu gerekli kılar: {0} Horizon Client{1} 3.0 ya da daha yenisi.",
        "desktoneDesktopTooltip":"Bu Horizon DaaS Masaüstü, bilgisayarınıza yüklenmek üzere şunu gerekli kılar: {0} Horizon View {1}.",
        "desktoneApplicationTooltip":"Bu Horizon DaaS Uygulaması, bilgisayarınıza yüklenmek üzere şunu ister: {0} Horizon View{1}.",
        "xenAppsReceiverNotDetected": "Bu uygulamayı açmak için Citrix Receiver'ın bu bilgisayara yüklenmesi gereklidir. <a target='_blank' href='{0}'>Citrix Receiver’ı henüz yüklemediyseniz</a> lütfen yükleyin.",
        "button.save" : "Kaydet",
        "button.openHorizonView": "Horizon Client’ı Aç",
        "myapps.launch.openApp": "Şunu Aç: {0}",
        "button.openApp": "Uygulamayı Aç",
        "button.clear": "Temizle",
        "button.close": "Kapat",
        "myapps.launch.view.openWith": "Şununla Birlikte Aç:",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Tarayıcı",
        "myapps.launch.view.preferredClient.isDefault": "(varsayılan)",
        "myapps.launch.view.selectPreferredLaunchClient": "Horizon Masaüstlerini ve Uygulamalarını nasıl başlatmak istediğiniz seçin.",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "VARSAYILAN BİR BAŞLATICI SEÇİN...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Bu, aygıtınızdan bir View masaüstü açtığınızda, varsayılan başlatma davranışını belirler. View’i varsayılanınız olarak seçerseniz, Horizon Client’ı yüklemiş olmanız gerekir. <a target='_blank' href='{0}'>Horizon Client’ı henüz yüklemediyseniz</a> lütfen yükleyin.",
        "myapps.launch.view.unknownClientType": "Horizon Client’ı açmak için bilinmeyen istemci türü",
        "myapps.launch.view.openWithView" : "Horizon Client ile Aç",
        "myapps.launch.view.openWithBrowser" : "Tarayıcı ile Aç",
        "myapps.launch.view.preferredClient.byBrowser.description": "Tarayıcıyı seçtiğinizde, View'iniz yeni bir tarayıcı penceresinde açılacaktır.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Bu öğe, Horizon Client 3.0 ya da daha yenisini gerekli kılıyor. <a target='_blank' href='{0}'>Horizon Client’ı henüz yüklemediyseniz</a> lütfen yükleyin.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "Bu ayarı tercihlerden her zaman değiştirebilirsiniz.",
        "myapps.launch.msg.launching.desktop":" Masaüstü Başlatılıyor<b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Uygulama Başlatılıyor <b>{0}</b> .....",
        "myapps.noAppsMsg": "Herhangi bir uygulama yüklememişsiniz. Uygulamaları yüklemek için şuraya gidebilirsiniz: {0}",
        "myapps.noFavAppsMsg": "Herhangi bir uygulamayı sık kullanılanlara eklememişsiniz.",
        "myapps.dialog.openApp": "AÇ",
        "myapps.dialog.openAppWithViewClient": "Client’ta Aç",
        "myapps.dialog.openAppWithBrowser": "Tarayıcı'da Aç",
        "deviceStatus.networkLost" : "Ağ bağlantısını kaybetmişsiniz.",
        "deviceStatus.networkRestored" : "Ağ bağlantısı geri yüklendi.",
        "api.session.expired.retry":"Oturumun süresi doldu, yenilemeye çalışıyor...",
        "api.error":"Hata oluştu. Lütfen tekrar deneyin.",
        "api.timeout":"Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.",
        "favoriteStatus.favorite" : "Sık Kullanılanlara Ekle",
        "favoriteStatus.unfavorite" : "Sık Kullanılanlardan Çıkar",
        "favoriteStatus.offlineFavoriteMessage": "Çevrimdışıyken bir uygulamayı sık kullanılanlara ekleme kullanılamaz. Lütfen yeniden bağlanın ve tekrar deneyin.",
        "error.failToFavoriteApp": "Sık kullanılan durumu güncellenemedi.",
        "error.failToHideApp": "Uygulama kaldırılamadı.",
        "error.failToShowApp": "Uygulamayı Launcher’a yükleme işlemi başarısız oldu.",
        "installStatus.offlineInstallMessage": "Çevrimdışıylen, yükleme istekleri kullanılamaz. Lütfen yeniden bağlanın ve tekrar deneyin.",
        "installStatus.activated": "Etkinleştirildi",
        "installStatus.notActivated": "Etkin değil",
        "installStatus.request": "İstek",
        "installStatus.update": "Güncelle",
        "installStatus.processing": "Sürüyor",
        "installStatus.installFailedMessage": "Bu problem devam ederse, lütfen tekrar deneyin ve IT yöneticinizle iletişime geçin.",
        "requestFailed": "İstek Başarısız Oldu.",
        "requestSuccessful": "İstek Başarılı",
        "accept": "Kabul Et",
        "decline": "Reddet",
        "termsOfUse": "Kullanım Şartları",
        "beforeInstallation": "Yüklemeden Önce",
        "resetDesktopStatus.offlineMessage": "Çevrimdışıyken bir masaüstünü sıfırlama işlemi kullanılamaz. Lütfen yeniden bağlanın ve tekrar deneyin.",
        "error.failToResetDesktop": "Masaüstünü sıfırlama işlemi başarısız",
        "resetDesktop.sucess": "Masaüstünü sıfırlama işlemi başarılı",
        "appCenter.someAppsMissingMessage": "Uygulamalar ",
        "appCenter.device.status.notRegistered": "Aygıt kayıtlı değil",
        "appCenter.device.status.blackListed": "Bu aygıt kara listeye alındı.",
        "appCenter.device.status.unknownError": "Bilinmeyen bir hata oluştu.",
        "appCenter.device.register": "Aygıtı Kaydet",
        "appCenter.device.moreDetails":"Daha fazla detay",
        "appCenter.noAppsMsg": "Şu anda kullanılabilir uygulama yok.",
        "appCenter.noSearchResults": "Sonuç Bulunamadı.",
        "appCenter.vppInviteTitle": "Yönetilen Dağıtım Kaydı",
        "appCenter.appInstallConfirmPromptTitle": "Yükleme İşlemini Onayla",
        "appCenter.acceptInvite": "Daveti kabul et",
        "appCenter.install": "Yükle",
        "appCenter.proceed": "Devam Et",
        "appCenter.cancel": "İptal Et",
        "appCenter.searchApps": "Uygulamaları Ara",
        "appCenter.welcomeMsg": "Yeni uygulamaları, herhangi bir aygıtta herhangi bir yere yükleyin!",
        "appCenter.done": "Bitti",
        "appCenter.nav.privacyPage": "Gizlilik Sayfası",
        "appCenter.nav.catalog": "Katalog",
        "appCenter.nav.myApps": "Uygulamalarım",
        "appCenter.nav.favorites": "Sık Kullanılanlar",
        "appCenter.nav.categories": "Kategoriler",
        "appCenter.nav.filterby": "Şuna Göre Filtrele:",
        "appCenter.nav.show": "Göster",
        "appCenter.nav.settings": "Ayarlar",
        "appCenter.nav.sortBy": "Şuna Göre Sırala:",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filtrele",
        "appCenter.action.install": "Yükle",
        "appCenter.action.installed": "Yüklendi",
        "appCenter.action.added": "Eklendi",
        "appCenter.action.processing": "Sürüyor",
        "appCenter.action.update": "Güncelle",
        "appCenter.action.request": "İstek",
        "appCenter.type.web": "Web Uygulama",
        "appCenter.type.native": "Yerel Uygulama",
        "appCenter.type.native.platform": "{0} Uygulama",
        "appCenter.type.virtual": "Sanal Uygulama",
        "myapp.nav.categories": "Kategoriler",
        "myapp.nav.favorites": "Sık Kullanılanlar",
        "myapp.nav.allApps": "Tüm Uygulamalar",
        "myapp.label.new": "Yeni",
        "myapp.nav.filterby": "Şuna Göre Filtrele:",
        "userInfo.adminConsole":"Yönetim Konsolu",
        "userInfo.preferences":"Tercihler",
        "userInfo.about":"Hakkında",
        "userInfo.devices":"Aygıtlar",
        "userInfo.signout":"Oturumu Kapat",
        "app.details.link.back": "Geri",
        "app.details.nav.details": "Detaylar",
        "app.details.nav.reviews": "Yorumlar",
        "app.details.label.description": "Açıklama",
        "app.details.label.seeFullDetails": "Tüm detaylara bakın...",
        "app.details.label.information": "Bilgiler",
        "app.details.label.category": "Kategoriler",
        "app.details.label.version": "Sürüm",
        "app.details.label.type": "Tür:",
        "app.details.label.type.SAML11": "Web Uygulaması",
        "app.details.label.type.SAML20": "Web Uygulaması",
        "app.details.label.type.WEBAPPLINK": "Web Uygulaması",
        "app.details.label.type.WSFED12": "Web Uygulaması",
        "app.details.label.type.XENAPP": "Xen Uygulaması",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "Masaüstünü Görüntüle",
        "app.details.label.type.VIEWAPP": "Uygulamayı Görüntüle",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone Masaüstü",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone Uygulaması",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Boyut",
        "app.details.label.price": "Fiyat",
        "app.details.label.screenshots": "Ekran Görüntüleri",
        "app.details.label.requirement": "Gereksinim",
        "app.details.label.packageName": "Paket Adı:",
        "app.details.thinapp.requirement": "Bu uygulama, sadece Identity Manager Desktop’ı yüklü olduğu bir Windows bilgisayarında çalışır.",
        "app.details.viewDesktop.requirement": "Bu View Masaüstü, bilgisayarınıza yüklenmek üzere {0} Horizon Client{1} 3.0 ya da daha yenisini gerekli kılar.",
        "app.details.viewapp.requirement": "Bu View'de Barındırılan Uygulama, bilgisayarınıza yüklenmek üzere  {0} Horizon Client{1} 3.0 ya da daha yenisini gerekli kılar.",
        "app.details.xenapp.requirement": "Bu uygulama, bilgisayarınıza yüklenmek üzere şunu gerekli kılar: {0} Citrix Receiver {1}",
        "app.details.xenapp.msg.IE8OrLower":"Bu uygulama Citrix Receiver’ın yüklenmesini gerektirir. Not. Bu uygulama, Internet Explorer 8’de açılamaz.",
        "app.details.xenappsDeliveryGroup.requirement":"Bu Citrix Desktop, bilgisayarınıza yüklenmek üzere şunu ister: {0}  {1}",
        "app.details.desktoneDesktop.requirement": "Bu Horizon DaaS Desktop, bilgisayarınıza yüklenmek üzere şunu ister: {0} Horizon Client {1}",
        "app.details.desktoneApp.requirement": "Bu Horizon DaaS Application, bilgisayarınıza yüklenmek üzere şunu ister: {0} Horizon Client {1}",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Bilgi yok",
        "app.details.noScreenshots": "Ekran görüntüsü yok",
        "app.details.noDescription": "Açıklama yok",
        "app.details.needsDeviceEnrollment": "Aygıt Kaydı Gerektirir",
        "app.settings.label.settings": "Ayarlar",
        "app.settings.link.back": "Geri",
        "app.settings.managedDevices": "Yönetilen Aygıtlar",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"KATALOG",
        "app.about.heading":"VMware Workspace Hakkında",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Gizlilik İlkesi",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Lisans Anlaşması",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/tr/go/patents",
        "app.about.licenseAgreementLink":"http://www.vmware.com/tr/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/tr/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Aygıtlar",
        "app.devices.tableColumn.deviceName":"Aygıt Adı",
        "app.devices.tableColumn.userDeviceId":"Aygıt Kimliği",
        "app.devices.tableColumn.lastLoginTime":"Son Oturum Açma Zamanı",
        "app.devices.unlinkDevice":"Bağlantı Kaldır",
        "app.devices.unlinkedDevice": "Bağlantısız",
        "app.devices.emptyDeviceListTitle": "Bağlantı bilgisayarlara sahip değilsiniz.",
        "app.devices.emptyDeviceListMessage": "Bir bilgisayara bağlantı sağlamak için Windows için VMware Identity Manager Desktop’ı yükleyip kaydetmeniz gereklidir.",

		"app.thinappMultiDeviceAct.heading":"Bu uygulama, onaylanan aygıtlara eklenecektir. Ek aygıtlarda \"{0}\" kullanmak için aşağıdan aygıtın adını bulun ve sonrasında İstek düğmesini tıklayın.",
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Aygıt Adı",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Durum",
        "app.thinappMultiDeviceAct.button.request":"İstek",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Reddedildi",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"Beklemede",
        "app.thinappMultiDeviceAct.activationState.activated":"Onaylandı",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Etkin değil",
        "app.setAppPassword.heading":"{0} uygulaması için parola ayarla",
        "app.setAppPassword.instruction":"Bu uygulama için bir parola ayarlamak için aşağıdaki formu kullanın. Parola en az üç karakter uzunluğunda olmalıdır.",
        "app.setAppPassword.label.password": "Parola",
        "app.setAppPassword.label.confirmPassword": "Parolayı Onayla",
        "app.setAppPassword.label.generate": "Parola Oluştur",
        "app.setAppPassword.error.passwordsNoMatch": "Parolalar eşleşmiyor.",
        "app.setAppPassword.msg.success": "Uygulama parolanız başarılı bir şekilde kurulmamış.",
        "app.setAppPassword.msg.fail": "Parolanızı ayarlarken bir hata oluştu. Lütfen tekrar deneyin.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Yükle",
        "app.banner.open":"Aç",
        "button.cancel":"İptal Et",
        "myapps.launch.passwordvault.installExtension.description":"Bu uygulama, Password Vault tarayıcı uzantısını kullanabilir. Önceden yüklemediyseniz, <a target='_blank' href='{0}'>lütfen uzantıyı yükleyin.</a> ",
        "installMessage.continueInstall":"Bu uygulamayı daha önce yüklemeye çalıştınız. ",
        "installMessage.proceedToInstall":"Devam etmek için tıklayın.",
        "appCenter.device.status.confError":"MDM, aygıtınız için herhangi bir bilgi bulamadı.",
        "appCenter.device.unEnrollWarningTitle":"Uyarı",
        "appCenter.device.mdmUnEnrollMessage":"Bu aygıttan tüm Workspace ONE uygulamalarını ve verilerini kaldırın.",
        "appCenter.device.disableWorkspaceMessage":"Hesabınızı kaldırma, Workspace ONE uygulaması ile erişim yetkisi verilen hesabınızı iptal edecektir. Springboard’unuza indirilen uygulamalar yüklenmiş olarak kalacaktır fakat erişim kesilebilir. Devam etmek istiyor musunuz?",
        "appCenter.internalApp.installationStepTitle":"Bu uygulamayı açmak için yükleme işleminden sonra takip eden bu adımları izleyin:",
        "appCenter.internalApp.step1":"iPhone giriş ekranınızdan Ayarlar’ı başlatın",
        "appCenter.internalApp.step2":"Genel'e dokunun",
        "appCenter.internalApp.step3":"Profil ve Aygıt yönetimine dokunun",
        "appCenter.internalApp.step4":"Kurumsal Uygulama altında yer alan uygulama geliştirici adına dokunun",
        "appCenter.internalApp.step5":"Uygulamayı onaylayın ya da uygulamaya güvenin",
        "appCenter.internalApp.watchTutorial":"Adım adım bilgilendirici rehberi takip edin",
        "userInfo.removeAccount":"Hesabı kaldır",
        "userInfo.account":"Hesap",
        "userInfo.password":"Parola",
        "app.changePassword.title":"Parolayı değiştir",
        "app.changePassword.enterCurrentPassword":"Güncel parolayı gir",
        "app.changePassword.enterNewPassword":"Yeni parola gir",
        "app.changePassword.confirmNewPassword":"Yeni parolayı onayla",
        "app.changePassword.error.passwordsNoMatch":"Yeni parolalar eşleşmiyor",
        "app.changePassword.success":"Yeni parola kaydedildi",
        "app.changePassword.label.email":"E-posta",
        "app.changePassword.label.phone":"Telefon",
        "app.logout.confirm.msg":"Workspace ONE'daki oturumunuzu kapatma işlemi güncel oturumunuzu sonlandıracaktır. Katalog'tan indirilmiş herhangi bir uygulama aygıtta kalacaktır fakat siz tekrar giriş yapana kadar yeni uygulamalar kullanılamayacaktır.",
        "app.logout.title":"UYARI",
        "app.passwordVault.banner.msg":"Password Vault tarayıcı uzantısını kullanabilen uygulamalarınız var.",
        "app.passwordVault.banner.button.install":"Yükle"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE 暂时处于维护模式。您可以启动您的应用，但可能无法使用某些功能",
        "appCenter.device.unEnrollWarningMessage":"取消注册意味着您将失去对您有权访问的若干应用的访问权。您要继续吗？",
        "appCenter.action.add":"添加+",
        "userInfo.unenroll":"取消注册",
        "myapps.welcomeMsg": "您好， {0}。 这是您的应用！",
        "api.updateApps": "正在更新列表 ...",
        "installStatus.enrollDevice": "需要激活 Workspace Services 才能使用 {0} 来保护公司的数据安全",
        "installStatus.unenrolledDevice": "这个应用程序已无法使用。请按“确定”更新列表。",
        "changeOccurred": "发生了变化",
        "appCenter.auth.mdmError": "所有应用此时无法加载。在与 MDM 通讯时，配置或网络出错了",
        "appCenter.device.status.commError": "在为设备检索应用时，出现了 MDM 引发的错误",
        "appCenter.device.status.deviceInputError": "此设备无效！请联系您的 IT 管理员",
        "appCenter.device.mdmApps.notFoundError": "MDM 没有发现任何分配给您设备的应用程序",
        "appCenter.nav.browseBy": "浏览方式",
        "app.launchPassword.heading": "密码请求",
        "app.launchPassword.view.instruction": "我们需要您的密码才能登录此 Windows 资源 {0}。",
        "app.launchPassword.label.userName": "用户",
        "app.launchPassword.label.password": "密码 ",
        "app.launchPassword.button.label.signin": "登录",
        "appCenter" : "应用中心",
        "ok" : "确定",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/下载",
        "horizonDesktopNotDetected": "必须在这台计算机上安装 VMware Identity Manager 桌面才能打开此应用程序。如果您还未安装，<a target='_blank' href='{0}'> 请安装 VMware Identity Manager 桌面</a>。",
        "viewAppsTooltip":"这款 View 托管的应用程序需要在您的计算机上安装 {0} Horizon Client{1} 3.0 或更高版本。",
        "desktoneDesktopTooltip":"这个 Horizon DaaS 桌面需要在您的计算机上安装 {0} Horizon View {1}。",
        "desktoneApplicationTooltip":"这款 Horizon DaaS 应用程序需要在您的计算机上安装 {0} Horizon View {1}。",
        "xenAppsReceiverNotDetected": "必须在这台计算机上安装 Citrix Receiver 才能打开这款应用程序。如果您尚未安装，<a target='_blank' href='{0}'>请安装 Citrix Receiver</a>。",
        "button.save" : "保存",
        "button.openHorizonView": "打开 Horizon Client",
        "myapps.launch.openApp": "打开 {0}",
        "button.openApp": "打开应用",
        "button.clear": "清除",
        "button.close": "关闭",
        "myapps.launch.view.openWith": "打开工具：",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "浏览器",
        "myapps.launch.view.preferredClient.isDefault": "（默认）",
        "myapps.launch.view.selectPreferredLaunchClient": "选择您启动 Horizon 桌面和应用程序的方式",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "选择启动默认...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "当您从设备上选择打开 View 桌面时，这将决定您的默认启动行为。如果您将 View 选为您的默认方式，您则必须安装 Horizon Client。如果您尚未安装，<a target='_blank' href='{0}'> 请安装 Horizon Client</a>。",
        "myapps.launch.view.unknownClientType": "打开 Horizon Client 的未知客户端类型。 ",
        "myapps.launch.view.openWithView" : "以 Horizon Client 打开",
        "myapps.launch.view.openWithBrowser" : "使用浏览器打开",
        "myapps.launch.view.preferredClient.byBrowser.description": "通过选择浏览器，您的 View 将在一个新的浏览器视窗打开。",
        "myapps.launch.view.preferredClient.byViewClient.description": "该项目需要使用 Horizon Client 3.0 或更高版本。如果您尚未安装，<a target='_blank' href='{0}'> 请安装 Horizon Client</a>。",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "您可以随时改变使用偏好中的设置。",
        "myapps.launch.msg.launching.desktop":"启动桌面 <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"启动应用程序 <b>{0}</b> .....",
        "myapps.noAppsMsg": "您还没有添加任何应用。您可以导航到 {0} 添加应用程序",
        "myapps.noFavAppsMsg": "您没有收藏任何应用程序",
        "myapps.dialog.openApp": "打开",
        "myapps.dialog.openAppWithViewClient": "在 Client 中启动",
        "myapps.dialog.openAppWithBrowser": "在浏览器中启动",
        "deviceStatus.networkLost" : "您已失去网络连接",
        "deviceStatus.networkRestored" : "网络连接已恢复",
        "api.session.expired.retry":"会话已过期，正在尝试续订...",
        "api.error":"出错，重试",
        "api.timeout":"连接已超时，重试",
        "favoriteStatus.favorite" : "收藏",
        "favoriteStatus.unfavorite" : "取消收藏",
        "favoriteStatus.offlineFavoriteMessage": "离线时无法将应用加入收藏，请重新连接，然后重试",
        "error.failToFavoriteApp": "无法更新收藏状态",
        "error.failToHideApp": "无法移除应用",
        "error.failToShowApp": "无法向 Launcher 添加应用",
        "installStatus.offlineInstallMessage": "离线时无法发出安装请求，请重新连接，然后重试",
        "installStatus.activated": "激活",
        "installStatus.notActivated": "未激活",
        "installStatus.request": "请求",
        "installStatus.update": "更新",
        "installStatus.processing": "正在处理",
        "installStatus.installFailedMessage": "请重试，如果此问题依然存在，则联系您的 IT 管理员",
        "requestFailed": "请求失败",
        "requestSuccessful": "请求成功",
        "accept": "接受",
        "decline": "拒绝",
        "termsOfUse": "使用条款",
        "beforeInstallation": "安装前",
        "resetDesktopStatus.offlineMessage": "无法脱机重置桌面，请重新连接后再试",
        "error.failToResetDesktop": "无法重置桌面",
        "resetDesktop.sucess": "成功重置桌面",
        "appCenter.someAppsMissingMessage": "所有应用此时均无法加载",
        "appCenter.device.status.notRegistered": "设备尚未注册",
        "appCenter.device.status.blackListed": "此设备已被列入黑名单",
        "appCenter.device.status.unknownError": "出现未知错误",
        "appCenter.device.register": "注册设备",
        "appCenter.device.moreDetails":"更多明细",
        "appCenter.noAppsMsg": "目前没有应用可用",
        "appCenter.noSearchResults": "没有找到结果",
        "appCenter.vppInviteTitle": "管理式分发登记",
        "appCenter.appInstallConfirmPromptTitle": "确认安装",
        "appCenter.acceptInvite": "接受邀请",
        "appCenter.install": "安装",
        "appCenter.proceed": "继续",
        "appCenter.cancel": "取消",
        "appCenter.searchApps": "搜索应用",
        "appCenter.welcomeMsg": "能在任何地方任何设备上安装新应用！",
        "appCenter.done": "完成",
        "appCenter.nav.privacyPage": "隐私权页面",
        "appCenter.nav.catalog": "目录",
        "appCenter.nav.myApps": "我的应用",
        "appCenter.nav.favorites": "收藏项",
        "appCenter.nav.categories": "类别",
        "appCenter.nav.filterby": "筛选方式",
        "appCenter.nav.show": "显示",
        "appCenter.nav.settings": "设置",
        "appCenter.nav.sortBy": "排序方式",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "筛选项",
        "appCenter.action.install": "安装",
        "appCenter.action.installed": "已安装",
        "appCenter.action.added": "已添加",
        "appCenter.action.processing": "正在处理",
        "appCenter.action.update": "更新",
        "appCenter.action.request": "请求",
        "appCenter.type.web": "Web 应用",
        "appCenter.type.native": "本机应用",
        "appCenter.type.native.platform": "{0} 应用",
        "appCenter.type.virtual": "虚拟应用",
        "myapp.nav.categories": "类别",
        "myapp.nav.favorites": "收藏项",
        "myapp.nav.allApps": "所有应用",
        "myapp.label.new": "新",
        "myapp.nav.filterby": "筛选方式",
        "userInfo.adminConsole":"管理控制台",
        "userInfo.preferences":"首选项",
        "userInfo.about":"关于",
        "userInfo.devices":"设备",
        "userInfo.signout":"注销",
        "app.details.link.back": "返回",
        "app.details.nav.details": "明细",
        "app.details.nav.reviews": "评论",
        "app.details.label.description": "描述",
        "app.details.label.seeFullDetails": "查看详情...",
        "app.details.label.information": "信息",
        "app.details.label.category": "类别",
        "app.details.label.version": "版本",
        "app.details.label.type": "类型：",
        "app.details.label.type.SAML11": "Web 应用",
        "app.details.label.type.SAML20": "Web 应用",
        "app.details.label.type.WEBAPPLINK": "Web 应用",
        "app.details.label.type.WSFED12": "Web 应用",
        "app.details.label.type.XENAPP": "Xen 应用",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix 桌面",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "View 桌面",
        "app.details.label.type.VIEWAPP": "View 应用",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone 桌面",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone 应用",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "大小",
        "app.details.label.price": "价格",
        "app.details.label.screenshots": "屏幕截图",
        "app.details.label.requirement": "要求：",
        "app.details.label.packageName": "软件包名称：",
        "app.details.thinapp.requirement": "此应用程序仅在安装了 Identity Manager 桌面的 Windows 计算机上运行。",
        "app.details.viewDesktop.requirement": "此 View 桌面需要在您的计算机上安装 {0} Horizon Client{1} 3.0 或更高版本。",
        "app.details.viewapp.requirement": "这款 View 托管的应用程序需要在您的计算机上安装 {0} Horizon Client{1} 3.0 或更高版本。",
        "app.details.xenapp.requirement": "此应用程序需要安装 {0} Citrix Receiver {1}。",
        "app.details.xenapp.msg.IE8OrLower":"此应用程序需要 Citrix 接收器的安装。注：此应用程序不能用 Internet Explorer 8 打开。",
        "app.details.xenappsDeliveryGroup.requirement":"此 Citrix 桌面要求安装  {0}  Citrix Receiver {1}。",
        "app.details.desktoneDesktop.requirement": "此 Horizon DaaS 桌面需要把 {0} Horizon Client {1} 安装在您的计算机上。",
        "app.details.desktoneApp.requirement": "此 Horizon DaaS 应用程序需要把{0} Horizon Client {1} 安装在您的计算机上。",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "没有可用信息",
        "app.details.noScreenshots": "没有可用屏幕截图",
        "app.details.noDescription": "没有可用说明",
        "app.details.needsDeviceEnrollment": "要求设备注册",
        "app.settings.label.settings": "设置",
        "app.settings.link.back": "返回",
        "app.settings.managedDevices": "纳管设备",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"目录",
        "app.about.heading":"关于 VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"隐私政策",
        "app.about.button.label.patents":"专利",
        "app.about.button.label.licenseAgreement":"许可证协议",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-cn",
        "app.about.licenseAgreementLink":"http://www.vmware.com/cn/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/cn/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"设备",
        "app.devices.tableColumn.deviceName":"设备名称",
        "app.devices.tableColumn.userDeviceId":"设备 ID",
        "app.devices.tableColumn.lastLoginTime":"上次登录时间",
        "app.devices.unlinkDevice":"取消链接",
        "app.devices.unlinkedDevice": "未链接",
        "app.devices.emptyDeviceListTitle": "您没有任何链接的计算机。",
        "app.devices.emptyDeviceListMessage": "若要链接计算机，您必须安装并登记 VMware Identity Manager for Windows。",

		"app.thinappMultiDeviceAct.heading":"此款应用程序将被添加到已批准的设备上。若在其他设备上使用 \"{0}\"，请在下方找到设备名称，然后单击请求键。",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"设备名称",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"状态",
        "app.thinappMultiDeviceAct.button.request":"请求",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"已拒绝",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"待定",
        "app.thinappMultiDeviceAct.activationState.activated":"已批准",
        "app.thinappMultiDeviceAct.activationState.notActivated":"未激活",
        "app.setAppPassword.heading":"为应用程序设置密码 {0}",
        "app.setAppPassword.instruction":"使用以下表格为此应用程序设置一个密码。密码的长度至少是三个字符。",
        "app.setAppPassword.label.password": "密码",
        "app.setAppPassword.label.confirmPassword": "确认密码",
        "app.setAppPassword.label.generate": "生成密码",
        "app.setAppPassword.error.passwordsNoMatch": "密码不匹配。",
        "app.setAppPassword.msg.success": "您已成功设置应用程序密码。",
        "app.setAppPassword.msg.fail": "尝试设置密码时出错。请重试。",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"安装",
        "app.banner.open":"打开",
        "button.cancel":"取消",
        "myapps.launch.passwordvault.installExtension.description":"该应用程序可使用 Password Vault 的浏览器扩展程序。如尚未安装，可点击<a target='_blank' href='{0}'>安装扩展程序</a>。",
        "installMessage.continueInstall":"您之前曾尝试安装此应用。",
        "installMessage.proceedToInstall":"单击以继续。",
        "appCenter.device.status.confError":"MDM 找不到有关您设备的任何信息",
        "appCenter.device.unEnrollWarningTitle":"警告",
        "appCenter.device.mdmUnEnrollMessage":"移除此设备上的所有 Workspace ONE 应用和数据。",
        "appCenter.device.disableWorkspaceMessage":"移除您的账户将会吊销通过 Workspace ONE 应用所授予的访问权。下载到您的 Springboard 的应用仍会安装在设备上，但将无法加以访问。您要继续吗？",
        "appCenter.internalApp.installationStepTitle":"要安装此应用，请在安装后按以下步骤进行",
        "appCenter.internalApp.step1":"从您的 iPhone 主屏启动设置",
        "appCenter.internalApp.step2":"轻按常规",
        "appCenter.internalApp.step3":"轻按描述文件和设备管理",
        "appCenter.internalApp.step4":"轻按企业应用下的应用开发者名称",
        "appCenter.internalApp.step5":"验证或信任应用",
        "appCenter.internalApp.watchTutorial":"观看分步教程",
        "userInfo.removeAccount":"移除账户",
        "userInfo.account":"账户",
        "userInfo.password":"密码",
        "app.changePassword.title":"更改密码",
        "app.changePassword.enterCurrentPassword":"输入当前密码",
        "app.changePassword.enterNewPassword":"输入新密码",
        "app.changePassword.confirmNewPassword":"确认新密码",
        "app.changePassword.error.passwordsNoMatch":"新密码不匹配",
        "app.changePassword.success":"已保存新密码！",
        "app.changePassword.label.email":"电子邮件",
        "app.changePassword.label.phone":"电话",
        "app.logout.confirm.msg":"从 Workspace ONE 注销将结束您当前的会话。凡已从目录下载的应用均会保留在设备上，但在您重新登录前不会有新的可用应用。",
        "app.logout.title":"警告",
        "app.passwordVault.banner.msg":"您有使用 Password Vault 浏览器扩展程序的应用。",
        "app.passwordVault.banner.button.install":"安装"
    });
})(angular.module('com.vmware.greenbox.l10n'));

// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE 暫時處於維護模式。您可以啟動 APP，但可能無法使用部分功能",
        "appCenter.device.unEnrollWarningMessage":"取消註冊將會遺失您的部分 APP 存取權。您要繼續嗎？",
        "appCenter.action.add":"新增+",
        "userInfo.unenroll":"取消註冊",
        "myapps.welcomeMsg": "{0} 您好，這些是您的 APP ！",
        "api.updateApps": "正在更新清單...",
        "installStatus.enrollDevice": "使用 {0} 需要啟動 Workspace 服務來保護公司資料",
        "installStatus.unenrolledDevice": "您無法再使用此 APP。請點選 OK 來更新清單。",
        "changeOccurred": "已產生變更",
        "appCenter.auth.mdmError": "此時無法載入所有的 APP。與 MDM 通訊時發生配置或網路的錯誤。",
        "appCenter.device.status.commError": "爲您的裝置擷取 APP 時，MDM 發生錯誤",
        "appCenter.device.status.deviceInputError": "此裝置無效！請聯絡您的 IT 管理員",
        "appCenter.device.mdmApps.notFoundError": "MDM 找不到任何指派給您裝置的應用程式",
        "appCenter.nav.browseBy": "瀏覽方式：",
        "app.launchPassword.heading": "密碼請求",
        "app.launchPassword.view.instruction": "我們需要您的密碼來登入 Windows 資源 {0}。",
        "app.launchPassword.label.userName": "使用者",
        "app.launchPassword.label.password": "密碼",
        "app.launchPassword.button.label.signin": "登入",
        "appCenter" : "APP 中心",
        "ok" : "OK",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/下載",
        "horizonDesktopNotDetected": "必須在此電腦上安裝 VMware Identity Manager 桌面，才能開啟此應用程式。<a target='_blank' href='{0}'>請安裝 VMware Identity Manager 桌面</a> (如果您尚未安裝的話)。",
        "viewAppsTooltip":"此由 View 代管的應用程式需要在您的電腦上安裝 {0} Horizon Client{1} 3.0 或以上版本。",
        "desktoneDesktopTooltip":"此 Horizon DaaS 桌面需要在您的電腦上安裝 {0} Horizon View {1}。",
        "desktoneApplicationTooltip":"此 Horizon DaaS 應用程式需要在您的電腦上安裝 {0} Horizon View{1}。",
        "xenAppsReceiverNotDetected": "必須在此電腦上安裝 Citrix Receiver 才能開啟此應用程式。<a target='_blank' href='{0}'>安裝 Citrix Receiver</a> (如果尚未安裝的話)。",
        "button.save" : "儲存",
        "button.openHorizonView": "開啟 Horizon Client",
        "myapps.launch.openApp": "開啟 {0}",
        "button.openApp": "開啟 APP",
        "button.clear": "清除",
        "button.close": "關閉",
        "myapps.launch.view.openWith": "開啟方式：",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "瀏覽器",
        "myapps.launch.view.preferredClient.isDefault": "(預設)",
        "myapps.launch.view.selectPreferredLaunchClient": "選擇您要啟動 Horizon 桌面和應用程式的方式",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "選擇啟動預設...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "這會決定在您選擇從裝置上開啟 View 桌面時的預設啟動行爲。如果您選擇 View 作爲預設，就必須安裝 Horizon Client <a target='_blank' href='{0}'>安裝 Horizon Client</a> (如果尚未安裝的話)。",
        "myapps.launch.view.unknownClientType": "用未知的用戶端類型來開啟 Horizon Client",
        "myapps.launch.view.openWithView" : "透過 Horizon Client 來開啟",
        "myapps.launch.view.openWithBrowser" : "透過瀏覽器來開啟",
        "myapps.launch.view.preferredClient.byBrowser.description": "選擇瀏覽器，您的 View 就會在新瀏覽器的視窗中開啟。",
        "myapps.launch.view.preferredClient.byViewClient.description": "此項目需要 Horizon Client 3.0 或以上版本。 <a target='_blank' href='{0}'>安裝 Horizon Client</a> (如果尚未安裝的話)。",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "您可隨時在偏好中變更此設定。",
        "myapps.launch.msg.launching.desktop":"正在啟動桌面 <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"正在啟動應用程式 <b>{0}</b> .....",
        "myapps.noAppsMsg": "您尚未新增任何 APP。您可導覽至 {0} 來新增應用程式。",
        "myapps.noFavAppsMsg": "您尚未將任何 APP 加入最愛",
        "myapps.dialog.openApp": "開啟",
        "myapps.dialog.openAppWithViewClient": "在 Client 中開啟",
        "myapps.dialog.openAppWithBrowser": "在瀏覽器中開啟",
        "deviceStatus.networkLost" : "您已失去網路連線",
        "deviceStatus.networkRestored" : "已恢復網路連線",
        "api.session.expired.retry":"工作階段已過期，正在嘗試更新中...",
        "api.error":"發生錯誤，請重試",
        "api.timeout":"連線逾時，請重試",
        "favoriteStatus.favorite" : "我的最愛",
        "favoriteStatus.unfavorite" : "解除我的最愛",
        "favoriteStatus.offlineFavoriteMessage": "離線時無法將 APP 加入最愛，請重新連線後再試一次",
        "error.failToFavoriteApp": "無法更新最愛狀態",
        "error.failToHideApp": "無法移除 APP",
        "error.failToShowApp": "無法將 APP 加入啟動程式",
        "installStatus.offlineInstallMessage": "離線時無法安裝請求，請重新連線後再試一次",
        "installStatus.activated": "已啟動",
        "installStatus.notActivated": "尚未啟動",
        "installStatus.request": "請求",
        "installStatus.update": "更新",
        "installStatus.processing": "正在處理",
        "installStatus.installFailedMessage": "如果此問題繼續存在，請重試後再聯絡您的 IT 管理員。",
        "requestFailed": "請求失敗",
        "requestSuccessful": "請求成功",
        "accept": "接受",
        "decline": "拒絕",
        "termsOfUse": "使用條款",
        "beforeInstallation": "安裝前",
        "resetDesktopStatus.offlineMessage": "離線時無法重設桌面，請重新連線後再試一次",
        "error.failToResetDesktop": "無法重設桌面",
        "resetDesktop.sucess": "成功地重設桌面",
        "appCenter.someAppsMissingMessage": "此時無法載入所有的 APP",
        "appCenter.device.status.notRegistered": "尚未登記裝置",
        "appCenter.device.status.blackListed": "此裝置已被列入黑名單",
        "appCenter.device.status.unknownError": "發生未知的錯誤",
        "appCenter.device.register": "登記裝置",
        "appCenter.device.moreDetails":"更多詳細資料",
        "appCenter.noAppsMsg": "目前沒有可用的 APP",
        "appCenter.noSearchResults": "沒有找到任何結果",
        "appCenter.vppInviteTitle": "授權管理登記",
        "appCenter.appInstallConfirmPromptTitle": "確認安裝",
        "appCenter.acceptInvite": "接受邀請",
        "appCenter.install": "安裝",
        "appCenter.proceed": "繼續",
        "appCenter.cancel": "取消",
        "appCenter.searchApps": "搜尋 APP",
        "appCenter.welcomeMsg": "隨時隨地皆可將新的 APP 安裝在任何裝置上",
        "appCenter.done": "完成",
        "appCenter.nav.privacyPage": "隱私權畫面",
        "appCenter.nav.catalog": "目錄",
        "appCenter.nav.myApps": "我的 APP",
        "appCenter.nav.favorites": "我的最愛",
        "appCenter.nav.categories": "類別",
        "appCenter.nav.filterby": "篩選方式",
        "appCenter.nav.show": "顯示",
        "appCenter.nav.settings": "設定",
        "appCenter.nav.sortBy": "排序方式：",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "篩選條件",
        "appCenter.action.install": "安裝",
        "appCenter.action.installed": "已安裝",
        "appCenter.action.added": "已新增",
        "appCenter.action.processing": "正在處理",
        "appCenter.action.update": "更新",
        "appCenter.action.request": "請求",
        "appCenter.type.web": "Web APP",
        "appCenter.type.native": "本機 APP",
        "appCenter.type.native.platform": "{0} APP",
        "appCenter.type.virtual": "虛擬 APP",
        "myapp.nav.categories": "類別",
        "myapp.nav.favorites": "我的最愛",
        "myapp.nav.allApps": "所有 APP",
        "myapp.label.new": "最新",
        "myapp.nav.filterby": "篩選方式",
        "userInfo.adminConsole":"管理主控台",
        "userInfo.preferences":"偏好",
        "userInfo.about":"關於",
        "userInfo.devices":"裝置",
        "userInfo.signout":"登出",
        "app.details.link.back": "返回",
        "app.details.nav.details": "詳細資料",
        "app.details.nav.reviews": "評論",
        "app.details.label.description": "描述",
        "app.details.label.seeFullDetails": "查看所有詳細資料...",
        "app.details.label.information": "資訊",
        "app.details.label.category": "類別",
        "app.details.label.version": "版本",
        "app.details.label.type": "類型：",
        "app.details.label.type.SAML11": "Web APP",
        "app.details.label.type.SAML20": "Web APP",
        "app.details.label.type.WEBAPPLINK": "Web APP",
        "app.details.label.type.WSFED12": "Web APP",
        "app.details.label.type.XENAPP": "Xen APP",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix 桌面",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "View 桌面",
        "app.details.label.type.VIEWAPP": "View APP",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone 桌面",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone APP",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "大小",
        "app.details.label.price": "價格",
        "app.details.label.screenshots": "螢幕擷取畫面",
        "app.details.label.requirement": "需求：",
        "app.details.label.packageName": "套件名稱：",
        "app.details.thinapp.requirement": "此應用程式只可用在已安裝 Identity Manager 桌面的 Windows 電腦。",
        "app.details.viewDesktop.requirement": "此 View 桌面需要在您的電腦上安裝 {0} Horizon Client {1} 3.0 或以上版本。",
        "app.details.viewapp.requirement": "此由 View 代管的應用程式需要在您的電腦上安裝 {0} Horizon Client{1} 3.0 或以上版本。",
        "app.details.xenapp.requirement": "此應用程式需要安裝 {0} Citrix Receiver {1}。",
        "app.details.xenapp.msg.IE8OrLower":"此應用程式需要安裝 Citrix Receiver。備註：此應用程式無法在 Internet Explorer 8 中開啟。",
        "app.details.xenappsDeliveryGroup.requirement":"Citrix 桌面需要安裝 {0} Citrix Receiver {1}。",
        "app.details.desktoneDesktop.requirement": "此 Horizon DaaS 桌面需要在您的電腦上安裝 {0} Horizon Client {1}。",
        "app.details.desktoneApp.requirement": "此 Horizon DaaS 應用程式需要在您的電腦上安裝 {0} Horizon  Client {1}。",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "無可用的資訊",
        "app.details.noScreenshots": "沒有可用的螢幕擷取畫面",
        "app.details.noDescription": "無可用的描述",
        "app.details.needsDeviceEnrollment": "需要裝置註冊",
        "app.settings.label.settings": "設定",
        "app.settings.link.back": "返回",
        "app.settings.managedDevices": "受管裝置",
        "app.nav.tab.launcher":"啟動程式",
        "app.nav.tab.catalog":"目錄",
        "app.about.heading":"有關 VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"隱私權原則",
        "app.about.button.label.patents":"專利",
        "app.about.button.label.licenseAgreement":"授權合約",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-tw",
        "app.about.licenseAgreementLink":"http://www.vmware.com/tw/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/tw/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"裝置",
        "app.devices.tableColumn.deviceName":"裝置名稱",
        "app.devices.tableColumn.userDeviceId":"裝置 ID",
        "app.devices.tableColumn.lastLoginTime":"上次登入時間",
        "app.devices.unlinkDevice":"取消連結",
        "app.devices.unlinkedDevice": "已取消連結",
        "app.devices.emptyDeviceListTitle": "您沒有任何已連結的電腦。",
        "app.devices.emptyDeviceListMessage": "若要連結電腦，您必須安裝並登記適用於 Windows 的 VMware Identity Manager 桌面 。",

		"app.thinappMultiDeviceAct.heading":"此應用程式會被加入核准的裝置中。若要在其他的裝置上使用「{0}」，請在下方找到裝置名稱，然後點選「請求」按鍵。",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"裝置名稱",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"狀態",
        "app.thinappMultiDeviceAct.button.request":"請求",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"已拒絕",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"擱置中",
        "app.thinappMultiDeviceAct.activationState.activated":"已核准",
        "app.thinappMultiDeviceAct.activationState.notActivated":"尚未啟動",
        "app.setAppPassword.heading":"設置應用程式 {0} 的密碼",
        "app.setAppPassword.instruction":"利用下方表格來設置此應用程式的密碼。密碼至少必須有 3 個字元的長度。",
        "app.setAppPassword.label.password": "密碼",
        "app.setAppPassword.label.confirmPassword": "確認密碼",
        "app.setAppPassword.label.generate": "產生密碼",
        "app.setAppPassword.error.passwordsNoMatch": "密碼不符",
        "app.setAppPassword.msg.success": "已成功地設置了您應用程式的密碼。",
        "app.setAppPassword.msg.fail": "在嘗試設置您的密碼時發生錯誤。請再試一次。",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"安裝",
        "app.banner.open":"開啟",
        "button.cancel":"取消",
        "myapps.launch.passwordvault.installExtension.description":"此應用程式可使用密碼保存庫的瀏覽器擴充功能。如果您尚未安裝，請<a target='_blank' href='{0}'>安裝擴充功能</a>。",
        "installMessage.continueInstall":"您之前嘗試過安裝此 APP。",
        "installMessage.proceedToInstall":"點選以繼續。",
        "appCenter.device.status.confError":"MDM 找不到您裝置的任何資訊",
        "appCenter.device.unEnrollWarningTitle":"警告",
        "appCenter.device.mdmUnEnrollMessage":"移除此裝置的所有 Workspace ONE APP 和資料。",
        "appCenter.device.disableWorkspaceMessage":"移除帳戶會撤銷透過 Workspace ONE 之 APP 授予的存取權限。已下載至 Springboard 的 APP 會保持安裝狀態，但可能無法進行存取。您要繼續嗎？",
        "appCenter.internalApp.installationStepTitle":"安裝後，請依下列步驟開啟此 APP",
        "appCenter.internalApp.step1":"從 iPhone 主畫面啟動設定",
        "appCenter.internalApp.step2":"點選「一般」",
        "appCenter.internalApp.step3":"點選「設定檔和裝置管理」",
        "appCenter.internalApp.step4":"點選「企業 APP」下的 APP 開發人員名稱",
        "appCenter.internalApp.step5":"驗證或信任該 APP",
        "appCenter.internalApp.watchTutorial":"觀看逐步教學",
        "userInfo.removeAccount":"移除帳戶",
        "userInfo.account":"帳戶",
        "userInfo.password":"密碼",
        "app.changePassword.title":"變更密碼",
        "app.changePassword.enterCurrentPassword":"輸入目前的密碼",
        "app.changePassword.enterNewPassword":"輸入新的密碼",
        "app.changePassword.confirmNewPassword":"確認新的密碼",
        "app.changePassword.error.passwordsNoMatch":"新密碼不相符。",
        "app.changePassword.success":"已儲存新密碼！",
        "app.changePassword.label.email":"Email",
        "app.changePassword.label.phone":"電話",
        "app.logout.confirm.msg":"登出 Workspace ONE 會結束目前的工作階段。從目錄中下載的所有 APP 都會保留在裝置中，但您必須再次登入才能取得新的 APP。",
        "app.logout.title":"警告",
        "app.passwordVault.banner.msg":"您擁有可使用密碼保存庫瀏覽器擴充功能的 APP。",
        "app.passwordVault.banner.button.install":"安裝"
    });
})(angular.module('com.vmware.greenbox.l10n'));

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
(function(module) {
    'use strict';
    module.service('AppLauncherForHorizon', ['LauncherService', 'UtilService', 'HorizonClientScheme',
        function(LauncherService, UtilService, HorizonClientScheme) {

            //Service functions
            this.launch = function(app) {
                if (!app || !app.launch) {
                    return;
                }

                var launchParams = {
                    url: app.launch,
                    itemName: app.name
                };

                switch(app.subType) {
                    case "XENAPP":
                    case "XENAPPDELIVERYGROUP":
                        LauncherService.getOta(app.launch).then(function(ota) {
                            launchParams.url += '?ota=' + ota;
                            UtilService.openLinkInIframe(UtilService.buildScheme(
                                HorizonClientScheme.XENAPP_LAUNCH, launchParams));
                        });
                        break;
                    case "VIEWPOOL":
                    case "VIEWAPP":
                    case "DESKTONEDESKTOP":
                    case "DESKTONEAPPLICATION":
                        UtilService.openLinkInIframe(UtilService.buildScheme(
                            HorizonClientScheme.VIEW_LAUNCH, launchParams));
                        break;
                    default:
                        LauncherService.getOta(app.launch).then(function(ota) {
                            _openAppWithOTA(app, ota);
                        });
                }
            };

            /**
             *
             * Using iframe for launching the SAAS application
             * helps to retain the current webview on Jade & Horizon
             *
             * @param app App to be launched
             * @param ota OTA token
             * @private
             */
            function _openAppWithOTA(app, ota) {
                app.launching = false;
                var launchParams = {
                    url: app.launch + '?ota=' + ota
                };
                UtilService.openURIScheme(UtilService.buildScheme(
                    HorizonClientScheme.SAAS_LAUNCH, launchParams));
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
(function(module){
    'use strict';
    module.service('AppLauncherForJade',[
                        'LauncherService',
                        'UtilService',
                        'DesktopLaunchService',
                        'UserAgent',
                        '$q',
                        function(LauncherService,
                                 UtilService,
                                 DesktopLaunchService,
                                 UserAgent,
                                 $q) {

            this.launchUrl = function(app,$scope) {
                //AWJade is going to open the application in external browser hence need to obtain OTA
                    if (UserAgent.isAWJadeV2() && ( DesktopLaunchService.isViewApp(app)
                        || DesktopLaunchService.isXenApp(app)
                        || DesktopLaunchService.isDesktoneApp(app))){
                        UtilService.showLaunchProgressContainer();
                        app.useNonNPAPIForCitrixLaunch = $scope.useNonNPAPIForCitrixLaunch;
                        return DesktopLaunchService.getLaunchUrls(app).then(function(launchUrlsResponse){
                            UtilService.hideLaunchProgressContainer();
                            if(launchUrlsResponse) {
                                return getLaunchUrlForApp(launchUrlsResponse, app);
                            }
                        }, function(error) {
                            UtilService.hideLaunchProgressContainer();
                            if (error && error.data.code === 'appLaunch.passwordNotFound.error') {
                                return DesktopLaunchService.showPasswordDialog(app, $scope).then(function (launchUrlsResponse) {
                                    if (launchUrlsResponse) {
                                        return getLaunchUrlForApp(launchUrlsResponse, app);
                                    }
                                });
                            } else {
                                $scope.$modal.alert({
                                    title: 'requestFailed',
                                    message: error.data.message,
                                    ok: 'ok'
                                });
                            }
                        });
                    } else if(app.subType === "MDMWEB") {
                        return getMdmWebUrl(app);
                    } else {
                        return getOtaForUrl(app.launch).then(function(launchUrl){
                            return getLaunchUrlForResource(app, launchUrl);
                        });
                    }
            };

            function getLaunchUrlForApp(launchUrlResponse, app) {
                var deferred = $q.defer();
                if(launchUrlResponse.applyAuthPolicy){
                    getOtaForUrl(launchUrlResponse.accessPolicyUrl).then(function(otaWrappedLaunchUrl){
                        var accessPolicyLaunchUrl = encodeURIComponent(otaWrappedLaunchUrl);
                        if(DesktopLaunchService.isViewApp(app)
                            || DesktopLaunchService.isDesktoneApp(app)){
                            accessPolicyLaunchUrl += "&appType=1";    
                        }
                        else if(DesktopLaunchService.isXenApp(app)){
                            accessPolicyLaunchUrl += "&appType=2";    
                        }
                        deferred.resolve(accessPolicyLaunchUrl);
                    });
                }else {
                    if(DesktopLaunchService.isViewApp(app)
                        || DesktopLaunchService.isDesktoneApp(app)) {
                        var launchUrl = encodeURIComponent(launchUrlResponse.nativeLaunchUrl) + "&appType=1";
                        if (launchUrlResponse.browserLaunchUrl && DesktopLaunchService.isClientLaunchable(app, 'BROWSER')) {
                            launchUrl = launchUrl + "&fallback=" + encodeURIComponent(launchUrlResponse.browserLaunchUrl);
                        }
                        deferred.resolve(launchUrl);
                    }
                    if(DesktopLaunchService.isXenApp(app)){
                        //In case of ica download URL no OTA flow needed hence directly open in new window
                        launchUrl =  getLaunchUrlForResource(app, launchUrlResponse.browserLaunchUrl);
                        deferred.resolve(launchUrl);
                    }
                }
                return deferred.promise;
            }

            function getOtaForUrl(url){
                return LauncherService.getOta(url).then(function(ota) {
                    if(url.indexOf('?')>=0) {
                        return url + "&ota=" + ota;
                    }
                    else {
                        return url + "?ota=" + ota;
                    }
                });
            }

            function getLaunchUrlForResource(app, launchUrl) {
                switch(app.subType) {
                    case "SAML11":
                    case "SAML20":
                    case "WSFED12":
                    case "WEBAPPLINK":
                    case "MDMWEB":
                        var featureFlags = workspaceOne.featureFlags;
                        if(!UserAgent.isWindows() && app.useAirwatchBrowser){
                            launchUrl += "&openInAWB=true";
                        }
                        break;
                    case "VIEWPOOL":
                    case "VIEWAPP":
                    case "DESKTONEDESKTOP":
                    case "DESKTONEAPPLICATION":
                        var launchableClients = DesktopLaunchService._getLaunchableClients(app);
                        var supportsBlast = false;
                        if (launchableClients.length > 0) {
                            supportsBlast = (launchableClients.indexOf("BROWSER") > 0);
                        }
                        var fallbackUrl = UtilService.appendQueryToUrl(launchUrl, "p", 'BROWSER');
                        // Use appType=1 for Horizon Client (view or Horizon Air)
                        // And use appType=2 for citrix receiver
                        launchUrl = launchUrl + "&appType=1";

                        if (supportsBlast) {
                            launchUrl = launchUrl + "&fallback="+fallbackUrl;
                        }
                        break;
                    case "XENAPP":
                    case "XENAPPDELIVERYGROUP":
                        launchUrl = launchUrl + "&appType=2";
                    default:
                        break;
                }
                return  launchUrl;
            }

            function getMdmWebUrl(app) {
                var deferred = $q.defer();
                deferred.resolve(getLaunchUrlForResource(app, app["_links"].launch.href));
                return deferred.promise;
            }
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
(function(module) {
    'use strict';
    module.controller('DesktopLaunchController', [ '$scope', '$filter', '$sce', 'hznLocalStorage', 'UserAgent', 'DesktopLaunchService',  function ($scope, $filter, $sce, hznLocalStorage, UserAgent, DesktopLaunchService) {
        var vm = this;


            vm.byViewClientDescription = $sce.trustAsHtml($filter('i18n')('myapps.launch.view.preferredClient.byViewClient.description', DesktopLaunchService.getDownloadLink()));
            vm.preferredClient = DesktopLaunchService.getPreferredClient() || DesktopLaunchService.CLIENT_NATIVE;



        vm.launchByViewClient = function (){
                hznLocalStorage[UserAgent.hznViewClientInstalled] = "1" ;
                DesktopLaunchService.doLaunchByViewClient($scope, $scope.app);
                //popdown the dialog
                $scope.$modal.close();
            };

        vm.launchByBrowser = function (){
                DesktopLaunchService.launchByBrowser($scope, $scope.app);
                //popdown the dialog
            $scope.$modal.close();
            };

        vm.launchByPreference = function (){
                if (this.preferredClient == DesktopLaunchService.CLIENT_BROWSER) {
                     this.launchByBrowser();
                } else {
                    vm.launchByViewClient();
                }
                DesktopLaunchService.setPreferredClient(this.preferredClient);
            };

        vm.isClientPreferred = function (clientType) {
                return DesktopLaunchService.getPreferredClient() === clientType;
        };

        vm.showInstallViewClientMsg = function() {
                // Show install view client message when users select by Horizon View and View client is not
                // Installed.
                return this.preferredClient == DesktopLaunchService.CLIENT_NATIVE
                    && !DesktopLaunchService.isHorizonViewClientInstalled();
        }

}]);

})(angular.module('com.vmware.greenbox.appCenter'));


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
(function(module) {
    'use strict';
    module.controller('LauncherController', [
                            '$scope',
                            'LauncherService',
                            '$timeout',
                            '$filter',
                            'ConfigService',
                            'UserAgent',
                            'PAGING',
                            'CatalogService',
                            'SettingsService',
                            'BootstrapService',
                            function($scope,
                                     LauncherService,
                                     $timeout,
                                     $filter,
                                     ConfigService,
                                     UserAgent,
                                     PAGING,
                                     CatalogService,
                                     SettingsService,
                                     BootstrapService) {

        var vm = this;
        var appCenterCtrl = $scope.appCenterCtrl;
        var allLauncherApps = [];
        var index = 0;
        $scope.shouldSuppressLaunchDialog = false;
        var defaultLabels = CatalogService.getDefaultLabels();
        SettingsService.getUserInfo().then(function(user){
            vm.welcomeMessage = $filter('i18n')('myapps.welcomeMsg', user.firstName);
        });

        var init = function () {
            vm.visibleLauncherApps = [];
            vm.appCategories = [];
            vm.isFilteredByFav = LauncherService.isFilteredByFavorite();
            vm.showNoSearchResultsMsg = false;
            vm.searchText = $scope.appCenterCtrl.searchText;
            vm.excludeThinApps = UserAgent.isAWJade() || !UserAgent.isWindows();
            vm.allAppsLabel = defaultLabels[0];
            vm.selectedCategory = LauncherService.getSelectedCategory();
            vm.filterConfig = { items: vm.appCategories, defaultItem: vm.selectedCategory};

            vm.toggleFilterByFav = function(){
                LauncherService.toggleFilteredByFavorite();
                vm.isFilteredByFav = LauncherService.isFilteredByFavorite();
                getFirstPageOfApps();
            };
            vm.resetFilter = function(){
                LauncherService.setFilterByFavorite(false);
                LauncherService.setSelectedCategory(vm.allAppsLabel);
                getFirstPageOfApps();
            };
            vm.filterByLabel = function(category){
                if(category){
                    LauncherService.setSelectedCategory(category);
                } else {
                    LauncherService.setSelectedCategory(null);
                }
                vm.selectedCategory = LauncherService.getSelectedCategory();
                getFirstPageOfApps();
            }

            $scope.showLauncherMessage = function(apps){
                if(appCenterCtrl.searchText){
                    if (apps) {
                        vm.showNoSearchResultsMsg = !apps.length;
                    } else {
                        vm.showNoSearchResultsMsg = !allLauncherApps.length;
                    }
                    vm.showNoFavoritedAppsMsg = false;
                    vm.showNoAppsMsg = false;
                } else if(vm.isFilteredByFav){
                    if (apps) {
                        vm.showNoFavoritedAppsMsg = !apps.length;
                    } else {
                        vm.showNoFavoritedAppsMsg = !allLauncherApps.length;
                    }
                    vm.showNoSearchResultsMsg = false;
                    vm.showNoAppsMsg = false;
                }
                else {
                    if (apps) {
                        vm.showNoAppsMsg = !apps.length;
                    } else {
                        vm.showNoAppsMsg = !allLauncherApps.length;
                    }
                    var catalogLink = '<a class="link" ng-click="appCenterCtrl.catalog()">'+$filter('i18n')('app.nav.tab.catalog')+'</a>';
                    vm.noAppsMsgHtml = $filter('i18n')('myapps.noAppsMsg', catalogLink);
                    vm.showNoSearchResultsMsg = false;
                    vm.showNoFavoritedAppsMsg = false;
                }
            }
        };

        var getFirstPageOfApps = function(doNotReloadCategories){
            index = 0;
            var params = {};
            if(vm.selectedCategory){
                params.category = getCategoryName(vm.selectedCategory);
            }
            if(vm.isFilteredByFav){
                params.favoriteOnly = vm.isFilteredByFav;
            }
            if(vm.searchText != ''){
                params.q = vm.searchText;
            }
            params.excludeThinApps = vm.excludeThinApps;
            // Delay showing spinner till 2 seconds.
            var cancelPromise = $timeout(function() {
                startLoading();
            }, 2000);

            LauncherService.getFirstPage(params).then(function (data) {
                $timeout.cancel(cancelPromise);
                doneLoading();
                $scope.useNonNPAPIForCitrixLaunch = data.launchPreferences.useNonNPAPIForCitrixLaunch;
                if (UserAgent.isHorizon()) {
                    /**
                     * No need to check whether native client installed in GB UI,
                     * it will be handled by native Horizon client.
                     * We may not add the setting to server now, because it should
                     * always be true for Horizon client.
                     */
                    $scope.shouldSuppressLaunchDialog = true; // TODO: Will remove this from scope after Bala's checkin for xenapp launch.
                    LauncherService.setSuppressLaunchDialog(true);
                } else if (UserAgent.isWindows()) {
                    $scope.shouldSuppressLaunchDialog = data.launchPreferences.suppressLaunchDialog.WINDOWS;
                    LauncherService.setSuppressLaunchDialog(data.launchPreferences.suppressLaunchDialog.WINDOWS);
                } else if (UserAgent.isMac()) {
                    $scope.shouldSuppressLaunchDialog = data.launchPreferences.suppressLaunchDialog.MAC;
                    LauncherService.setSuppressLaunchDialog(data.launchPreferences.suppressLaunchDialog.MAC);
                } else if (UserAgent.isMobile()) {
                    $scope.shouldSuppressLaunchDialog = data.launchPreferences.suppressLaunchDialog.MOBILE;
                    LauncherService.setSuppressLaunchDialog(data.launchPreferences.suppressLaunchDialog.MOBILE);
                }

                allLauncherApps = data.myapps;
                vm.visibleLauncherApps = [];
                vm.getNextPage();
                $scope.showLauncherMessage();

                if(!doNotReloadCategories){
                    loadCategories();
                }
            });
        };

        var loadFirstPageOnLoad = function() {
            BootstrapService.init().then(getFirstPageOfApps);
        };

        var loadCategories = function(){
            var params = {};
            params.excludeThinApps = vm.excludeThinApps;

            LauncherService.getLauncherCategories(params).then(function(data){
                if(data){
                    vm.appCategories = data;
                    vm.filterConfig.items = defaultLabels.concat(data);
                } else {
                    vm.filterConfig.items = defaultLabels;
                }
            });
        };

        vm.getNextPage = function(){
            var endIndex = index + PAGING.PAGE_SIZE;
            while (index < endIndex && index < allLauncherApps.length){
                vm.visibleLauncherApps.push(allLauncherApps[index]);
                index++;
            }
        }

        function startLoading () {
            vm.isLoading = true;
        }

        function doneLoading () {
            vm.isLoading = false;
        }

        function getCategoryName (category){
            if( category && category.type && category.type === 'all' || !category)
                return '';
            else {
                return category.name;
            }
        }

        $scope.$on('open-modal-dialog', function(event, args) {
            var template = args.dialogtemplate;
            $scope.$modal.open(template, $scope, {params: args.dialogparams});
        });

        var initializing = true;
        //When search text changes reload the launcher apps.
        $scope.$watch('appCenterCtrl.searchText', function(searchText){
            //Ignoring first time as change is fired on property initialize
            if(initializing){
                initializing = false;
            }else{
                vm.searchText = searchText;
                allLauncherApps = [];
                getFirstPageOfApps(true);
            }
        });

        init();
        loadFirstPageOnLoad();
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';
    module.controller('LauncherItemContextDialogController', [ 
                        '$scope', 
                        'DetailsService', 
                        '$timeout', 
                        '$filter', 
                        'LauncherService', 
                        'OfflineService', 
                        'UserAgent', 
                        '$sce', 
                        'JadeV1Scheme',
                        'JadeV2Scheme',
                        'CatalogService',
                        function($scope,
                                 DetailsService, 
                                 $timeout, 
                                 $filter, 
                                 LauncherService, 
                                 OfflineService, 
                                 UserAgent, 
                                 $sce,
                                 JadeV1Scheme,
                                 JadeV2Scheme,
                                 CatalogService) {
            var vm = this;
            if(!CatalogService.isMdmWebApp($scope.app.type, $scope.app.subType)) {
                DetailsService.getAppDetailsResource($scope.app.appId).get().then(function(appDetails){
                    vm.hasAppRequirements = appDetails.subType === 'THINAPP' || appDetails.subType === 'XENAPP' || appDetails.subType === 'XENAPPDELIVERYGROUP' || appDetails.subType === 'VIEWPOOL' || appDetails.subType === 'VIEWAPP' || appDetails.subType === 'DESKTONEDESKTOP' || appDetails.subType === 'DESKTONEAPPLICATION' ;
                    if (appDetails.description)  {
                        if(vm.hasAppRequirements && appDetails.description.length > 50) {
                            appDetails.description = appDetails.description.substring(0, 49) + "...";
                        } else if(appDetails.description.length > 110){
                            appDetails.description = appDetails.description.substring(0, 109) + "...";
                        }
                    }
                    angular.extend(appDetails._links, $scope.app._links);
                    angular.extend($scope.app, appDetails);
                });
            }
            vm.hideApp = function(app, apps, index, $event){
                if($event){
                    $event.stopPropagation();
                }
                if(OfflineService.isDeviceOnline()) {
                    LauncherService.setAppVisible(app).then(function(data){
                        if(data) {
                            //success
                            apps.splice(index, 1);
                            $scope.showLauncherMessage(apps);
                        }  else {
                            $scope.$modal.alert({
                                title: 'requestFailed',
                                message: 'error.failToHideApp',
                                ok: 'ok'
                            });
                        }
                    });
                }
            };


            vm.appDetails = function(app) {
                DetailsService.setAppDetails(app);
                location.hash = '#/details/' + app.appId + '/launcher';
            };

            var viewDownloadLink = $filter('i18n')('viewDownloadUrl');
            if (UserAgent.isIOS()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlIOS');
            } else if (UserAgent.isAndroid()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlAndroid');
            }
            var xenreceiverDownloadLink = $filter('i18n')('citrixReceiverDownloadUrl');
            if (UserAgent.isAWJadeV2()) {
                if(UserAgent.isWindows()) {
                    viewDownloadLink = JadeV2Scheme.APP_LAUNCH + "&uri=" + viewDownloadLink;
                    xenreceiverDownloadLink = JadeV2Scheme.APP_LAUNCH + "&uri=" + xenreceiverDownloadLink;    
                } else {
                    viewDownloadLink = JadeV2Scheme.APP_LAUNCH + "&url=" + viewDownloadLink;
                    xenreceiverDownloadLink = JadeV2Scheme.APP_LAUNCH + "&url=" + xenreceiverDownloadLink;
                }
            }                            
                            

            if (UserAgent.isIE8OrLower()) {
                vm.xenAppTooltip = $filter('i18n')('app.details.xenapp.msg.IE8OrLower');
                vm.xenAppDeliveryGroupTooltip = $filter('i18n')('app.details.xenappsDeliveryGroup.requirement');
            } else {
                vm.xenAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.xenapp.requirement', "<a target='_blank' href='" + xenreceiverDownloadLink + "'>", "</a>"));
                vm.xenAppDeliveryGroupTooltip = $sce.trustAsHtml($filter('i18n')('app.details.xenappsDeliveryGroup.requirement', "<a target='_blank' href='" + xenreceiverDownloadLink + "'>", "</a>"));
            }
            vm.viewDesktopTooltip = $sce.trustAsHtml($filter('i18n')('app.details.viewDesktop.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.viewAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.viewapp.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.desktoneTooltip = $sce.trustAsHtml($filter('i18n')('app.details.desktoneDesktop.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.daasAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.desktoneApp.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';

    module.directive('launcherItem', ['$timeout', function($timeout){

        return {
            restrict : 'A',
            scope : true,
            templateUrl : 'app/launcher/launcherItem.html',
            controller : ['$scope',
                          'LauncherService',
                          '$log',
                          '$sce',
                          'OfflineService',
                          'Localization',
                          'UserAgent',
                          'hznLocalStorage',
                          'DesktopLaunchService',
                          'lodash',
                          '$element',
                          'ClientRuntimeService',
                          function ($scope,
                                    LauncherService,
                                    $log,
                                    $sce,
                                    OfflineService,
                                    Localization,
                                    UserAgent,
                                    hznLocalStorage,
                                    DesktopLaunchService,
                                    lodash,
                                    $element,
                                    ClientRuntimeService) {
                             var vm = this;
                             vm.app = $scope.app;
                             var app = $scope.app;
                             vm.app.launching = false;
                             vm.isAWJade = UserAgent.isAWJade();
                             vm.isHorizon = UserAgent.isHorizon();

                             if ( app.type === 'VIRTUAL' ) {
                                 app.badge = 'virtual-app';
                             }
                             app.icon = app['_links']['icon']['href'];
                             app.launch = app['_links']['launch'] != undefined ? app['_links']['launch']['href'] : "";
                             app.resetDesktop = app['_links']['reset-desktop'] != undefined ? app['_links']['reset-desktop']['href'] : "";

                             var getFavoriteUrl = function(favApp){
                                 var favoriteTemplatedUrl = lodash.get(favApp, '_links.favorites.href');
                                 var templateText = 'favorite={boolValue}';
                                 var replacetext = 'favorite=' + !favApp.favorite;
                                 if(favoriteTemplatedUrl){
                                     return favoriteTemplatedUrl.replace(templateText, replacetext);
                                 }
                                 else{
                                     return "";
                                 }
                             };

                             vm.toggleFavorite = function(favApp, $event, isFilteredByFav, apps, index){
                                 var deviceOnline = OfflineService.isDeviceOnline();
                                 if($event){
                                     $event.stopPropagation();
                                 }
                                 if(deviceOnline) {
                                     var favoriteUrl = getFavoriteUrl(favApp);
                                     favApp.favorite = !favApp.favorite;
                                     if (favoriteUrl != undefined || favoriteUrl) {
                                         LauncherService.toggleFavorite(favoriteUrl, true).then(function(data){
                                             if(isFilteredByFav){
                                                 apps.splice(index, 1);
                                                 $scope.showLauncherMessage(apps);
                                                 $scope.$apply();
                                             }
                                         }, function(error){
                                             favApp.favorite = !favApp.favorite;
                                             if(!!error.handled) {//When system is under maintenance
                                                 return;
                                             }
                                             $scope.$modal.alert({
                                                 title: 'requestFailed',
                                                 message: 'error.failToFavoriteApp',
                                                 ok: 'ok'
                                             });
                                             $scope.$apply();
                                         });
                                     } else {
                                         $log.error('Unformatted favorite url');
                                     }
                                 }else{
                                     $scope.$modal.alert({
                                         title: 'requestFailed',
                                         message: 'favoriteStatus.offlineFavoriteMessage',
                                         ok: 'ok'
                                     });
                                 }
                             };
                             $scope.toggleFavorite = vm.toggleFavorite;

                              vm.resetDesktop = function(app, $event){
                                  var deviceOnline = OfflineService.isDeviceOnline();
                                  if($event){
                                      $event.stopPropagation();
                                  }
                                  if(deviceOnline) {
                                      if (app.resetDesktop != undefined || app.resetDesktop) {
                                          LauncherService.resetDesktop(app.resetDesktop).then(function(data){
                                              if (data) {
                                                  $scope.$modal.alert({
                                                      title: 'requestSuccessful',
                                                      message: 'resetDesktop.sucess',
                                                      ok: 'ok'
                                                  });
                                              } else {
                                                  $scope.$modal.alert({
                                                      title: 'requestFailed',
                                                      message: 'error.failToResetDesktop',
                                                      ok: 'ok'
                                                  });
                                              }
                                          });
                                      } else {
                                          $log.error('Unformatted resetDesktop url');
                                      }
                                  }else{
                                      $scope.$modal.alert({
                                          title: 'requestFailed',
                                          message: 'resetDesktopStatus.offlineMessage',
                                          ok: 'ok'
                                      });
                                  }
                              };
                              $scope.resetDesktop = vm.resetDesktop;

                              vm.openSetAppPasswordDialog = function($event) {
                                  if($event){
                                      $event.stopPropagation();
                                  }
                                  $scope.$modal.open('app/launcher/setAppPassword.html', { app: app });
                               }
                               $scope.openSetAppPasswordDialog = vm.openSetAppPasswordDialog;

                              vm.isAppNew = function(app) {
                                  return app.displayStatus === 'NEW';
                              };


                vm.launchApp = function (app, $event) {
                    //there is cases that app is launched when user says that the launching program are installed in dialog.
                    // So we need to check the event here
                    if ($event){
                      $event.preventDefault();
                    }

                    if(checkIfNativeClientIsInstalledFor(app)){
                        if (vm.isAppNew(app)) {
                            markAppLaunched(app);
                        }
                        ClientRuntimeService.launchApp(app,$scope);
                    }

                    function markAppLaunched(launchedApp){
                        var deviceOnline = OfflineService.isDeviceOnline();
                        if(deviceOnline) {
                            var appLaunchedUrl = lodash.get(launchedApp, '_links.markAppLaunched.href');
                            if (appLaunchedUrl) {
                                launchedApp.displayStatus = "LAUNCHED";
                                LauncherService.markAppLaunched(appLaunchedUrl, false).then(null, function(data){
                                });
                            } else {
                                $log.error('No appLaunched Url');
                            }
                        }
                    };

                    function checkIfNativeClientIsInstalledFor(app) {

                        if ($scope.shouldSuppressLaunchDialog || UserAgent.isAWJade()) {
                            return true;
                        }
                        switch(app.subType) {
                          case "THINAPP":
                          case "APPV":
                              if(!UserAgent.isHorizonDesktopInstalled()){
                                  vm.openAppDownloadDialog(app);
                                  return false;
                              }
                              break;
                          case "XENAPP":
                          case "XENAPPDELIVERYGROUP":
                              if (!UserAgent.isCitrixReceiverInstalled()){
                                  vm.openAppDownloadDialog(app);
                                  return false;
                              }
                              break;
                      }
                      return true;
                    }
                };

                vm.appInstalled = function (type) {
                    switch (type) {
                        case 'XENAPP':
                        case "XENAPPDELIVERYGROUP":
                            hznLocalStorage[UserAgent.hznCitrixReceiverInstalled] = "1" ; break;
                            break;
                        case 'THINAPP':
                            hznLocalStorage[UserAgent.hznHorizonWorkspaceInstalled] = "1" ; break;
                            break;
                        case 'APPV':
                            hznLocalStorage[UserAgent.hznHorizonWorkspaceInstalled] = "1" ; break;
                            break;
                        default: break;
                    }
                    $scope.$modal.close();
                    //try to launch the app
                    ClientRuntimeService.launchApp(app,$scope);
                };

                vm.openAppDownloadDialog = function (app) {
                    var description;
                    var hideOpenApp = false;
                    switch (app.subType){
                        case 'THINAPP':
                        case 'APPV':
                            var workspaceDownloadUrl = Localization.getLocalizedString('workspaceDownloadUrl');
                            description = Localization.getLocalizedString('horizonDesktopNotDetected', [workspaceDownloadUrl])
                            break;
                        case 'XENAPP':
                        case "XENAPPDELIVERYGROUP":
                            var citrixReceiverDownloadUrl = Localization.getLocalizedString('citrixReceiverDownloadUrl');
                            description = Localization.getLocalizedString('xenAppsReceiverNotDetected', [citrixReceiverDownloadUrl])
                            break;
                    }
                    $scope.$modal.open('app/launcher/appDownloadDialog.html', $scope, {params: {description: description}});
                };

                vm.triggerContextdialog = function() {
                    var emblem = $element.find('.emblem');
                    $timeout( function () { emblem.trigger('contextmenu'); }, false );
                }

              vm.openWithViewClient = function(app, $event) {
                  if ($event){
                      $event.preventDefault();
                  }
                  if ( ! (DesktopLaunchService.isViewApp(app)|| DesktopLaunchService.isDesktoneApp(app))) {
                      return;
                  }

                  DesktopLaunchService.launchByViewClient($scope, app);
              };

              vm.openWithBrowser = function(app, $event) {
                  if ($event){
                      $event.preventDefault();
                  }
                  if ( ! (DesktopLaunchService.isViewApp(app)|| DesktopLaunchService.isDesktoneApp(app))) {
                      return;
                  }
                  DesktopLaunchService.launchByBrowser($scope, app);
              };

              vm.isViewOptionSupported = function (app, clientType) {
                  if (app.subType !== 'VIEWPOOL' && app.subType !== 'VIEWAPP' && app.subType !== 'DESKTONEDESKTOP' && app.subType !== 'DESKTONEAPPLICATION') {
                      return false;
                  }
                  return DesktopLaunchService.isClientLaunchable(app, clientType);
              };

            if (app.subType === 'VIEWPOOL' || app.subType === 'VIEWAPP' || app.subType === 'DESKTONEDESKTOP' || app.subType === 'DESKTONEAPPLICATION') {
                app.isViewResource = true;
            }
            if (vm.isViewOptionSupported(app, "BROWSER")) {
                app.viewBrowserLaunchSupported = true;
            }
          if (vm.isViewOptionSupported(app, "NATIVE")) {
              app.viewClientLaunchSupported = true;
          }

            }],
            controllerAs: 'launcherItemCtrl',
            bindToController: true
        };

    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';
    module.service('LauncherService', [
                        'Resource',
                        'ConfigService',
                        '$http',
                        'RequestFactory',
                        'UtilService',
                        'UserAgent',
                        'DesktopLaunchService',
                        'Localization',
                        function(
                            Resource,
                            ConfigService,
                            $http,
                            RequestFactory,
                            UtilService,
                            UserAgent,
                            DesktopLaunchService,
                            Localization){
            var appsUrl;

            var ALL_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.allApps'),
                type:'all',
                isDefault:true
            };

            var isFilteredByFav = false;
            var selectedCategory = ALL_APPS_LABEL;
            var suppressLaunchDialog = false;

            this.setFilterByFavorite = function(isFilterByFav) {
                isFilteredByFav = isFilterByFav;
            }
            this.isFilteredByFavorite = function() {
                return isFilteredByFav;
            }

            this.setSuppressLaunchDialog = function(suppressLaunchDialog) {
                suppressLaunchDialog = suppressLaunchDialog;
            }
            this.isSuppressLaunchDialog = function() {
                return suppressLaunchDialog;
            }

            this.toggleFilteredByFavorite = function() {
                isFilteredByFav = !isFilteredByFav;
            }

            this.setSelectedCategory = function(selCategory) {
                selectedCategory = selCategory;
            }

            this.getSelectedCategory = function() {
                return selectedCategory;
            }

            this.getFirstPage = function(params){
                var launcherAppsUrlPromise = ConfigService.getLauncherUrl();
                return launcherAppsUrlPromise.then(function(data){
                    appsUrl = data;
                    var request = Resource(appsUrl ,
                        {
                            headers:{
                                'Accept': 'application/hal+json',
                                'method':'GET'
                            },
                            params: UtilService.isEmpty(params) ? null : params

                        });
                    return request.get().then(function(data) {
                        var returnData = {};
                        returnData.myapps = [];
                        if (data.entitlementResourceList && data.entitlementResourceList._embedded && data.entitlementResourceList._embedded.myapps) {
                            var myApps = data.entitlementResourceList._embedded.myapps;
                            var uniqueApps = _.uniq(myApps, 'appId');
                            returnData.myapps = uniqueApps;
                        }
                        returnData.launchPreferences = {};
                        if (data.launchPreferences)  {
                            returnData.launchPreferences = data.launchPreferences;
                        }
                        return returnData;
                    });
                });
            };

            this.toggleFavorite = function(favoriteUrl, useJQ){
                var req = RequestFactory(favoriteUrl, {method:'POST'});
                if (useJQ) {
                    return $.ajax(req);
                } else {
                    return $http(req);
                }
            };

            this.markAppLaunched = function(appLaunchedUrl, useJQ){
                var req = RequestFactory(appLaunchedUrl, {method:'POST'});
                if (useJQ) {
                    return $.ajax(req);
                } else {
                    return $http(req);
                }
            };

            this.getLauncherCategories = function(params){
                return ConfigService.getLauncherCategoriesUrl().then(function(url){
                    var request = Resource(url ,{
                        method:'GET',
                        headers:{
                            Accept: 'application/hal+json'
                        },
                        params: UtilService.isEmpty(params) ? null : params
                    });
                    return request.get().thenGet('_embedded').thenGet('categoryResourceList');
                });
            };

            this.getOta =  function(url) {
                return ConfigService.getOtaUrl().then(function(otaUrl){
                    var req = Resource(otaUrl+'?url='+url, { method:'GET',Accept: 'application/json' });
                    return req.get().then(function(otaResponse) {
                        return otaResponse.ota;
                    });
                });
            }

            this.setAppVisible = function(app){
                if(app && app._links['appVisibility']) {
                        var req = RequestFactory(app._links['appVisibility'].href, {
                            method:'PUT',
                            headers:{
                                Accept: 'application/hal+json'
                            },
                            params: {"appName": app.name}
                        });
                        return $http(req);
                }
                return;
            }
            this.resetDesktop = function(resetUrl){
                var request = RequestFactory(resetUrl ,{
                    method:'PUT',
                    headers:{
                        Accept: 'application/hal+json'
                    }
                });
                return $http(request);
            };
            this.setWSFedAppPassword = function(app, password){
                if(app && app._links['set-app-password'] && password && password.trim() != '') {
                    var request = RequestFactory(app._links['set-app-password'].href ,{
                        method:'PUT',
                        headers:{
                            Accept: 'application/hal+json'
                        },
                        params: {"password": password.trim()}
                    });
                    return $http(request);
                }
                return;
            };

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
(function(module) {
    'use strict';
    module.controller('LaunchPasswordController', [ '$scope', 'UserAgent', 'DesktopLaunchService', 'SettingsService', function ($scope, UserAgent, DesktopLaunchService, SettingsService) {
        var currentUser = SettingsService.getCurrentUser();
        var vm = this;
        vm.pwd = "";
        vm.userName = "";
        vm.errMsg = "";
        vm.processing =  false;
        if (currentUser) {
            vm.userName = currentUser.userName;
        }
        var getUrls = function() {
            vm.processing = true;
            DesktopLaunchService.getLaunchUrls($scope.app, vm.pwd, _.get($scope,"$modalOptions.preferredClient")).then(function(launchUrls) {
                vm.processing = false;
                if (launchUrls) {
                    $scope.$modal.close(launchUrls);
                }
            }, function(error) {
                vm.processing = false;
                vm.errMsg = error.data.message;
            });
        };
        vm.getLaunchUrls = function () {
            getUrls();
        };

        vm.handleEnter = function(keyEvent) {
            vm.processing = false;
            if (keyEvent.which === 13) {
                getUrls();
            }
        };

        vm.handleCancel = function () {
            vm.processing = false;
            $scope.$modal.cancel();
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {
    'use strict';
    module.directive('noAppsMsg', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,

            link: function($scope, element, attrs) {
                var template = $compile('<span>'+attrs.message+'</span>')($scope);
                element.replaceWith(template);
            }
        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';
    module.controller('InstallPasswordVaultExtensionController', [
                            '$scope',
                            '$filter',
                            '$sce',
                            'hznLocalStorage',
                            'UserAgent',
                            'PasswordVaultAppLaunchService',
                            'PasswordVaultService',
                            function (
                                $scope,
                                $filter,
                                $sce,
                                hznLocalStorage,
                                UserAgent,
                                PasswordVaultAppLaunchService,
                                PasswordVaultService) {
        var vm = this;

        vm.extensionDescription = $sce.trustAsHtml($filter('i18n')('myapps.launch.passwordvault.installExtension.description', PasswordVaultService.getPVExtensionDownloadUrl()));

        vm.openApp = function () {
            hznLocalStorage[UserAgent.passwordVaultExtensionInstalled] = "1" ;
            PasswordVaultAppLaunchService.openApp($scope.app);
            //popdown the dialog
            $scope.$modal.close();
        };

     }]);

})(angular.module('com.vmware.greenbox.appCenter'));


(function(module) {
    'use strict';

    module.service('PasswordVaultAppLaunchService', [
                                    'UtilService',
                                    'UserAgent',
                                    'ConfigService',
                                    'LauncherService',
                                    'PasswordVaultService',
                                    function(
                                        UtilService,
                                        UserAgent,
                                        ConfigService,
                                        LauncherService,
                                        PasswordVaultService){
            var pvAppLaunchService = this;
            pvAppLaunchService.checkForPVExtension = UserAgent.isPasswordVaultPluginSupportedBrowser();

            pvAppLaunchService.launchPVApp = function(app, modal) {
                if (pvAppLaunchService.checkForPVExtension && !UserAgent.isPVExtensionMarkedAsInstalled()) {
                    UtilService.showLaunchProgressContainer();
                    PasswordVaultService.pingExtension().then(function (extentionDetected) {
                        UtilService.hideLaunchProgressContainer()
                        if (extentionDetected == true || LauncherService.isSuppressLaunchDialog()) {
                            pvAppLaunchService.openApp(app);
                        } else {
                            if (PasswordVaultService.getPVExtensionDownloadUrl() != '') {
                                showPasswordVaultExtensionDownloadDialog(app, modal);
                            } else {
                                pvAppLaunchService.openApp(app);
                            }
                        }
                    });
                } else {
                    pvAppLaunchService.openApp(app);
                }
            };

            pvAppLaunchService.openApp = function(app) {
                openAppInNewWindow(app);
            }

            function showPasswordVaultExtensionDownloadDialog(app, modal) {
                modal.open('app/launcher/passwordvault/installPasswordVaultExtensionDialog.html', { app: app , modal: modal });
            };

            function openAppInNewWindow(app) {
                window.open(app.launch);
            }
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {
    'use strict';
    module.controller('SetAppPasswordController', [ '$scope', 'LauncherService',
        function($scope, LauncherService) {

            var vm = this;
            vm.app = $scope.$modalOptions.params.app;
            vm.password1 = '';
            vm.password2 = '';

            vm.setAppPassword = function($event) {
                if($event){
                    $event.stopPropagation();
                }
                if(!validatePassword()){
                    return;
                }
                LauncherService.setWSFedAppPassword(vm.app, vm.password1).then(function(response){
                    if(angular.isDefined(response) && response.status===200){
                        vm.password1 = '';
                        vm.password2 = '';
                        $scope.$modal.close();
                        $scope.$modal.alert({
                            title: 'requestSuccessful',
                            message: 'app.setAppPassword.msg.success',
                            ok: 'ok'
                        });
                    }else{
                        $scope.$modal.alert({
                            title: 'requestFailed',
                            message: 'app.setAppPassword.msg.fail',
                            ok: 'ok'
                        });
                    };
                }, function (error){
                    if(!!error.handled) {//When system is under maintenance
                        return;
                    }
                    $scope.$modal.alert({
                        title: 'requestFailed',
                        message: 'app.setAppPassword.msg.fail',
                        ok: 'ok'
                    });
                });
            };
            $scope.$watchCollection('[ctrl.password1,ctrl.password2]', function() {
                $scope.appAuthForm.$setValidity("unique", true);
            });
            function validatePassword() {
                var e1 = $scope.ctrl.password1;
                var e2 = $scope.ctrl.password2;
                if (e1 !== e2) {
                    $scope.appAuthForm.$setValidity("unique", false);
                    return false;
                } else {
                    $scope.appAuthForm.$setValidity("unique", true);
                    return true;
                }
            }

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));

// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    module.directive('notify', ['$http', '$compile', '$templateCache', '$log', '$templateRequest', '$notify',
        function ($http, $compile, $templateCache, $log, $templateRequest, $notify) {
            return {
                restrict: 'AE',
                scope: true,
                bindToController: true,
                controller: function ($scope, $element) {
                    var $message = this;
                    var TEMPLATE_URL = "app/notify/templates/messageContextTemplate.html";
                    var messages = $notify.message;

                    $templateRequest(TEMPLATE_URL)
                        .then( function(templateData){
                            $compile(angular.element(templateData))($scope, function (clonedElement) {
                                angular.element($element).append(clonedElement);
                            });
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + TEMPLATE_URL + ' [' + e.message + ']');
                        });

                    function show (messageArray) {
                        $notify.show(messageArray);
                    };

                    function info(messageKey, params, templateUrl) {
                        $notify.showMessage("info", messageKey, params, templateUrl);
                    }

                    function error(messageKey, params, templateUrl) {
                        $notify.showMessage("error", messageKey, params, templateUrl);
                    }

                    function warning(messageKey, params, templateUrl) {
                        $notify.showMessage("warning", messageKey, params, templateUrl);
                    }

                    function success(messageKey, params, templateUrl){
                        $notify.showMessage("success", messageKey, params, templateUrl);
                    }

                    // Close a message dialog.
                    function close (index) {
                        $notify.close(index);
                    };

                    $scope._messagesArray_ = messages;
                    $scope.close = close;  // TODO: remove? we have $message.close

                    $message.info = info;
                    $message.error = error;
                    $message.warning = warning;
                    $message.success = success;
                    $message.show = show;
                    $message.close = close;
                },
                link : function($scope, element) {
                    element.addClass('notify');
                }
            };
        }]);
    module.directive('notifyMessage',   ['$templateCache', '$http', '$compile', '$log', '$templateRequest',
        function ($templateCache, $http, $compile, $log, $templateRequest) {
            return {
                restrict: 'AE',
                require: '^notify',
                scope: false,
                transclude: true,
                replace: true,
                link: function ($scope, element, attrs, message) {
                    var DEFAULT_TEMPLATE_URL = "app/notify/templates/defaultMessageTemplate.html",
                        url = $scope.message.templateUrl || DEFAULT_TEMPLATE_URL;
                    var template = $templateCache.get(url);
                    $templateRequest(url)
                        .then( function(templateData){
                            populateDialog(angular.element(templateData));
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + url + ' [' + e.message + ']');
                        });
                    function populateDialog(template){
                        $compile(template)($scope, function (clonedElement) {
                            element.append(clonedElement);
                        });
                    };

                }
            };
        }]);

    module.provider('$notify', function() {

        var defaultTimeouts = {
            // time before messages will be dismissed, in milliseconds:
            success: 3000,
            error: 0, // no auto-dismiss
            info: 0,
            warning: 10000
        };
        var incrementalDelay = 100; // delay between multiple messages requested at once.
        var messagesQueue = [];
        var message = [];

        this.$get = ['Localization','$timeout', '$rootScope', function(Localization,$timeout,$rootScope) //noinspection JSValidateTypes
        {
            function show (messageArray) {
                var delay = 0;
                if( !angular.isArray(messageArray) ){
                    messageArray = [messageArray];
                }
                messageArray.forEach( function (msg) {
                    var timeout = angular.isDefined(msg.timeout) ? msg.timeout :
                        (defaultTimeouts[msg.type] || 0);
                    function isMsgPresent (existingMsg){
                        return existingMsg.text === msg.text;
                    }
                    var duplicate = messagesQueue.filter(isMsgPresent).length > 0;
                    // avoid duplicates, both for ux and ng-repeat
                    if (duplicate) return;
                    //close( duplicate );
                    // space out the messages in time, for improved animation
                    messagesQueue.push(msg);
                    //message.splice(0,message.length);
                    message.push(msg);
                    if (timeout) {
                        // schedule the auto-dismiss
                        $timeout( function () {
                            close( messagesQueue.indexOf(msg) );
                        }, timeout);
                    }
                    delay = delay + incrementalDelay;
                });
            };

            function info(messageKey, params, templateUrl, arg) {
                showMessage("info", messageKey, params, templateUrl, arg);
            };

            function error(messageKey, params, templateUrl, arg) {
                showMessage("error", messageKey, params, templateUrl, arg);
            };

            function warning(messageKey, params, templateUrl, arg) {
                showMessage("warning", messageKey, params, templateUrl, arg);
            };

            function success(messageKey, params, templateUrl, arg){
                showMessage("success", messageKey, params, templateUrl, arg);
            };

            function close (msgOrIndex, params) {
                var duplicate = msgOrIndex;
                if(angular.isString(msgOrIndex)) {
                    var msgToClose = Localization.getLocalizedString(msgOrIndex, params ? params : []);
                    duplicate = messagesQueue.indexOf(messagesQueue.filter(function(item){ return item.text === msgToClose})[0]);
                }
                if (duplicate >= 0) {
                    $rootScope.$applyAsync(function () {
                        messagesQueue.splice(duplicate, 1);
                        message.splice(duplicate, 1);
                    });
                }
            };

            function closeAll() {
                if (message && message.length>0) {
                    $rootScope.$applyAsync(function () {
                        for (var i = message.length - 1; i >= 0; i--) {
                            messagesQueue.splice(i, 1);
                            message.splice(i, 1);
                        }
                    });
                }
            };

            function showMessage(messageType, message, params, templateUrl, arg) {
                close(message); // If same message is already open, close it.
                var msg = {};
                msg.type = messageType;
                msg.text = Localization.getLocalizedString(message, params ? params : []);
                msg.argument = arg ? arg : "";

                if (templateUrl) {
                    msg.templateUrl = templateUrl;
                }
                $rootScope.$applyAsync(function () {
                    show(msg)
                });
            }

            return {
                message: message,
                show:show,
                success:success,
                warning:warning,
                error:error,
                info:info,
                close: close,
                showMessage:showMessage,
                closeAll:closeAll
            };
        }];
    });
})(angular.module('com.vmware.workspace.components.notify', []));

(function(module) {
    'use strict';

    module.controller('PreferencesController', ['$scope', 'DesktopLaunchService', function ($scope, DesktopLaunchService) {
        var vm = this;
        vm.preferredClient = DesktopLaunchService.getPreferredClient() || DesktopLaunchService.CLIENT_NATIVE;

        vm.saveLaunchDesktopPreference = function () {
            DesktopLaunchService.setPreferredClient(vm.preferredClient);
            vm.backAction();
        }

        vm.backAction = function () {
            window.history.back();
        };

        $scope.$on('open-modal-dialog', function(event, args) {
            var template = args.dialogtemplate;
            $scope.$modal.open(template, $scope, {params: args.dialogparams});
        });
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));


//TODO: Move services, appCenter, launcher components into different modules
// Define a new module for our app. The array holds the names of dependencies if any.
    angular.module("com.vmware.greenbox.appCenter", [
        'ngRoute',
        'ngCookies',
        'ngSanitize',
        'greenbox.appcenter.templates',
        'greenbox.components.templates',
        'com.vmware.workspace.services.rest',
        'com.vmware.workspace.components.modal',
        'com.vmware.greenbox.services.offlineService',
        'com.vmware.workspace.services.localization',
        'com.vmware.workspace.components.rating',
        'com.vmware.workspace.components.symbol',
        'com.vmware.workspace.components.spinner',
        'com.vmware.workspace.components.dropdown',
        'com.vmware.workspace.components.notify',
        'com.vmware.workspace.components.frameDrawer',
        'com.vmware.workspace.components.lineClamp',
        'com.vmware.workspace.components.message',
        'com.vmware.greenbox.l10n',
        'angular-gestures',
        'angular-carousel'])

        .factory('lodash', ['$window',
            function($window) {
                // place lodash include before angular
                return $window._;
            }
        ])

    
    
// configure app routes
    .config(['$routeProvider', function($routeProvider ) {
        $routeProvider
            // route for the catalog page
            .when('/catalog', {
                templateUrl : 'app/catalog/catalog.html',
                controller  : 'CatalogController',
                controllerAs : 'catalogCtrl'
            })
            .when('/details/:appId/:originPage', {
                templateUrl : 'app/details/details.html',
                controller : 'DetailsController',
                controllerAs : 'detailsCtrl'
            })
            .when('/launcher', {
                templateUrl : 'app/launcher/launcher.html',
                controller : 'LauncherController',
                controllerAs : 'launcherCtrl'
            })
            .when('/settings', {
                templateUrl : 'app/settings/settings.html',
                controller : 'SettingsController',
                controllerAs : 'settingsCtrl'
            })
            .when('/preferences', {
                templateUrl : 'app/preferences/preferences.html',
                controller : 'PreferencesController',
                controllerAs : 'preferencesCtrl'
            })
            .when('/about', {
                templateUrl : 'app/common/about.html'
            })
            .when('/index', {
                //This will decide what route to default to.
                controller: function($location, hznLocalStorage){
                    var lastActive = hznLocalStorage['last_active_page'];
                    if( workspaceOne && workspaceOne.hasLaunchableApps === false || lastActive === 'catalog') {
                        $location.path('/catalog');
                    }else{
                        $location.path('/launcher');
                    }
                },
                template : " "
            })
            .when('/changePassword', {
                templateUrl : 'app/common/changePassword.html'
            })
            .otherwise({
                redirectTo: '/index'
            });
    }])

   .config(['LocalizationProvider', '$injector', 'l10n_en', function(LocalizationProvider, $injector, l10n_en){
       var l10n = $injector.has('l10n') ? $injector.get('l10n') : {};
       angular.extend(l10n_en, l10n);
       LocalizationProvider.setL10nMap(l10n_en);
   }])

   //HammerJs Configuration
   .config(['hammerDefaultOptsProvider', function(hammerDefaultOptsProvider) {
        //Setting up gestures that need to be recognized by HammerJs
        hammerDefaultOptsProvider.set({
            recognizers: [[Hammer.Press, {time: 500}]]//Minimum time to detect press as a hold event.
        });
   }])

   .config(function($httpProvider) {
            var http401Interceptor = ['$q','$notify','$timeout','$injector', function($q, $notify,$timeout,$injector) {
                return {
                    'responseError': function(response) {
                        var status = response.status;
                        var ConfigService = $injector.get('ConfigService');
                        http401InterceptorHelper(status, $notify, $timeout, ConfigService);
                        // otherwise
                        return $q.reject(response);
                    }
                };
            }];

            var http412Interceptor = ['$q','$notify','$timeout','$injector', 'JadeV1Scheme', 'JadeV2Scheme', 'HorizonClientScheme',
                function($q, $notify,$timeout,$injector, JadeV1Scheme, JadeV2Scheme, HorizonClientScheme) {
                    return {
                        'responseError': function(response) {
                            var status = response.status;
                            var ConfigService = $injector.get('ConfigService');
                            var UtilService = $injector.get('UtilService');
                            var UserAgent = $injector.get('UserAgent');
                            http412InterceptorHelper(status, $notify, $timeout, ConfigService, UserAgent, UtilService, JadeV1Scheme, JadeV2Scheme, HorizonClientScheme);
                            // otherwise
                            return $q.reject(response);
                        }
                    };
                }];


            //Prompt user if a 5xx error occurs.
            var http5xxInterceptor = ['$q','$notify', function($q,$notify) {
                return {
                    'responseError': function(response) {
                        http5xxInterceptorHelper(response, $notify);
                        return $q.reject(response);
                    }
                };
            }];

            var timeoutInterceptor = ['$q','$notify','$injector', function ($q, $notify,$injector) {

                return {

                    'request':function (config) {
                        var TIMEOUT_MILLIS = 120000;
                        //For every new request set the retry attempt to 0. This variable serves as count of how many times
                        //a request is retried.
                        if (!config.retryAtempt) {
                            config.retryAtempt = 0;
                        }
                        if (!config.timeout) {
                            config.timeout = TIMEOUT_MILLIS;
                        }
                        return config || $q.when(config);
                    },

                    'responseError':function (response) {
                        var MAX_RETRY = 3;
                        var TIMEOUT_STATUS = 0;
                        if (response.status === TIMEOUT_STATUS) {
                            if (response.config.retryAtempt < MAX_RETRY) {
                                response.config.retryAtempt++;
                                var $http = $injector.get('$http');
                                return $http(response.config);
                            } else {
                                $notify.warning('api.timeout');
                                return $q.reject(response);
                            }
                        }
                        return $q.reject(response);
                    }
                };
            }];

            var httpCsrfInterceptor = ['$cookies', function($cookies) {
                return {
                    'request': function(request) {
                        if($cookies['EUC_XSRF_TOKEN']) {
                            request.headers['X-XSRF-TOKEN'] = $cookies['EUC_XSRF_TOKEN'];
                        } else {
                            request.headers['X-XSRF-TOKEN'] = '';
                        }
                        return request;
                    }
                };
            }];

            $httpProvider.interceptors.push(httpCsrfInterceptor);
            $httpProvider.interceptors.push(timeoutInterceptor);
            $httpProvider.interceptors.push(http401Interceptor);
            $httpProvider.interceptors.push(http412Interceptor);
            $httpProvider.interceptors.push(http5xxInterceptor);
        })
        .run(function($window, $cookies, ConfigService, $notify, $timeout, UserAgent, UtilService,
                      JadeV1Scheme, JadeV2Scheme, HorizonClientScheme){
            $window.onbeforeunload = function(){
                ConfigService.refreshCache();
            };

            var settings = {
                error : function(error) {
                    http401InterceptorHelper(error.status, $notify, $timeout, ConfigService);
                    http412InterceptorHelper(error.status, $notify, $timeout, ConfigService, UserAgent, UtilService,
                        JadeV1Scheme, JadeV2Scheme, HorizonClientScheme);
                    http5xxInterceptorHelper(error, $notify);
                }
            }

            //Add X-XSRF-TOKEN as default header for synchronous calls via $.ajax.
            //Add it here so that each $.ajax call will have this header, no matter RequestFactory is used.
            if ($cookies['EUC_XSRF_TOKEN']) {
                settings['headers'] = { 'X-XSRF-TOKEN': $cookies['EUC_XSRF_TOKEN']};
            } else {
                settings['headers'] = { 'X-XSRF-TOKEN': null};
            }

            //Ajax interceptor for requests sent using jQuery.
            $.ajaxSetup(settings);

        })

        .run(['$http', '$cookies', function($http, $cookies) {
            $http.defaults.xsrfCookieName = 'EUC_XSRF_TOKEN';
        }]);

        function http401InterceptorHelper(status, $notify, $timeout, ConfigService) {
            // 409 is thrown when tenant config state does not with toggles.
            // When API returns this error, then that means, we can try login.
            // At login also it might be a same problem. It will be better UX, since UI shows error page.
            if (status === 401 || status === 403 || status == 409) {
                //Force reload the page in case of authentication error
                $notify.warning('api.session.expired.retry');
                $timeout(function() {
                    ConfigService.doNotRefreshCache = true;
                    if(!ConfigService.isReloading){
                        ConfigService.isReloading = true;
                        location.reload(true);
                    }
                },3000,false);
            }
        }

        function http412InterceptorHelper(status, $notify, $timeout, ConfigService, UserAgent, UtilService, JadeV1Scheme, JadeV2Scheme, HorizonClientScheme) {
            // 412 is thrown when a security header expected is missing.
            // When API returns this error, then that means, we can try login.
            if (status === 412) {
                $notify.error('api.security.header.invalid.relogin');
                $timeout(function() {
                    if (UserAgent.isHorizon()){
                        UtilService.openURIScheme(HorizonClientScheme.LOGOUT);
                    } else if (UserAgent.isAWJadeV2()) {
                        UtilService.openURIScheme(JadeV2Scheme.SERVER_LOGOUT);
                    }
                    else {
                        ConfigService.getLogoutUrl().then(function(logoutUrl){
                            window.location.href = logoutUrl;
                        });
                    }
                },3000,false);
            }
        }

        function http5xxInterceptorHelper(error, $notify) {
            var status  =  error.status;
            var errorMsg  = 'api.error'
            if(status === 503) {
                error.handled = true;
                errorMsg = 'service.under.maintenance.error';
            }
            if (status >= 500) {
                $notify.warning(errorMsg);
            }
        }

(function(module) {

    'use strict';

    module.controller('SettingsController', ['SettingsService', function(SettingsService){
        var vm = this;
        var properties = ['firstName', 'lastName', 'emailAddress', 'numOfManagedDevices', 'adminUser'];

        vm.backAction = function() {
            return window.history.back();
        };
        vm.isLoading = true;
        SettingsService.getUserInfo().then(function(user){
            _.extend( vm, _.pick(user, properties));
            vm.isLoading = false;
        });
    }]);


})(angular.module('com.vmware.greenbox.appCenter'));

(function(module) {

    'use strict';

    module.service('SettingsService', ['Resource', 'ConfigService', function(Resource, ConfigService){

        var currentUser = {};
        var currentBranding = {};
        var settingsService = this;

        settingsService.setCurrentUser = function(user) {
            currentUser = user;
        };
        settingsService.getCurrentUser = function() {
            return currentUser;
        };

        settingsService.getUserInfo = function(){
            return ConfigService.getUserInfoUrl().then(function(userUrl){
                return Resource(userUrl, {cache:true, headers: {'Accept': 'application/hal+json', 'method': 'GET'}}).get();
            });
        };
        settingsService.setCurrentBranding = function(branding) {
            currentBranding = branding;
        };
        settingsService.getCurrentBranding = function() {
            return currentBranding;
        };
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module){

    module.directive('dropdown', function () {

        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: { config: '=?dropdown', isActive: '=?dropdownControl' },
            controllerAs: '$dropdown',
            bindToController: true,
            controller: ['$scope', '$document', '$timeout', controller],
            link: postLink,
            templateUrl: 'components/dropdown/templates/dropdown.html'
        };

        function controller ($scope, $document, $timeout) {
            var $dropdown = this;
            //Hide the dropdown by default
            $dropdown.isActive = $dropdown.isActive || false;
            //Click away enabled by default
            if($dropdown.config === undefined){
                $dropdown.config = { closeOnClick: true };
            }

            $scope.$watch('$dropdown.isActive', function(value){
                if($dropdown.isActive){
                    $timeout(function(){
                        $document.bind('click', closeDropdown);
                    });
                }else{
                    $timeout(function(){
                        $document.unbind('click', closeDropdown);
                    });
                }
            });

            $dropdown.toggle = function () {
                $dropdown.isActive = !$dropdown.isActive;
            };

            $dropdown.setElement = function (element) {
                $dropdown.element = element;
            };

            //Close dropdown
            var closeDropdown = function( event ) {
                var element = $dropdown.element;
                if( event && element && element[0].contains(event.target) ) {
                    return;
                }
                $scope.$apply(function () {
                    $dropdown.isActive = false;
                });
            };
        }

        function postLink (scope, element, attrs, $dropdown) {
            $dropdown.setElement(element);
            element.bind('click', function(){
                scope.$apply(function(){
                    $dropdown.toggle();
                });
            });
        }

    });

    module.directive('dropdownPanel', function() {
        return {
            restrict: 'A',
            link: postLink,
            require: ['^dropdown']
        };

        function postLink (scope, element, attrs, controllers) {
            element.addClass('dropdown-panel');
            var $dropdown = controllers[0];
            if(!$dropdown.config.closeOnClick){
                element.bind('click', function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        }
    });

})(angular.module('com.vmware.workspace.components.dropdown', []));

(function (module) {
    'use strict';
    module.controller('DropdownMenuDemo', function() {
        var demo = this;
        demo.isOpen = false;
        demo.config = {closeOnClick: false};

        demo.toggle = function(){
            demo.isOpen = !demo.isOpen;
        };
    });

})( angular.module('com.vmware.workspace.components.examples') );

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module){

	module.directive('frameDrawer', ['$timeout', function($timeout) {

        return {
            restrict: 'A',
            link: postLink,
            controller: ['$scope', '$element', controller],
            controllerAs: '$frameDrawer',
            scope: { isActive: '=drawerControl' },
            bindToController: true
        };

        function controller ($scope, $element) {
            var $frameDrawer = this;
            $frameDrawer.isActive = $frameDrawer.isActive || false;

            $scope.$watch('$frameDrawer.isActive', function(newValue) {
                if(newValue) {
                    $element.addClass('is-active');
                }else{
                    $element.removeClass('is-active');
                }
                //See https://jira-hzn.eng.vmware.com/browse/HW-52278
                //Force, repaint on drawer menu's sibling elements.
                $element.siblings().toggleClass('no-op');
            });
        }

        function postLink (scope, element, attrs, controllers) {
            var $frameDrawer = controllers;
            element.addClass('frame-drawer');

            //Close drawer on selecting
            element.bind('click', function(event) {
                if($(event.target).is('a')){
                    scope.$apply(function() {
                        $frameDrawer.isActive = false;
                    });
                }
            });
        }

    }]);

})(angular.module('com.vmware.workspace.components.frameDrawer', []));
/*
 * lineClampDirective:
 * This directive is intended to be a cross-browser solution to emulate
 * text-overflow: ellipsis support for multiline elements. As of writing this,
 * the only way to do this through CSS is using non-standard webkit or opera
 * vendor properties.
 *
 * Dependencies: 
 * lodash
 *
 * Usage:
 * Add the line-clamp attribute to your element and specify the content as well
 * as how many lines to allow before truncating.
 *
 * Example:
 * <p line-clamp content="text string" lines="2"></p>
 *
 * Notes:
 * The directive logic will execute each time the window resize event is triggered, but
 * will not execute if the element has CSS white-space: nowrap.
 * */

(function(module){
    'use strict';

    module.directive('lineClamp', ['$timeout', '$window', function($timeout, $window) {
        return {
            link: link,
            replace: true,
            restrict: 'A',
            scope: {
                content: '=',
                lines: '='
            },
            template: '<p>{{::content}}</p>'
        };

        function link($scope, element) {
            var w = angular.element($window),
                options = {
                    content: $scope.content.trim(),
                    lines: $scope.lines
                },
                debouncedClamp = _.debounce(function() {
                    clamp(element[0], options);
                }, 100),
                ELLIPSIS = '\u2026';

            w.bind('resize', debouncedClamp);

            $scope.$on('$destroy', function() {
                w.unbind('resize', debouncedClamp);
            });

            // Using $timeout to give it time to bind the value to the template.
            $timeout(debouncedClamp, 0, false);

            function clamp(elt, options) {
                // If nowrap, text is forced to overflow horizontally and we have
                // no way to know where to truncate, so let the webview handle it.
                if (window.getComputedStyle(elt).whiteSpace === 'nowrap') {
                    elt.textContent = options.content;
                    return;
                }

                var content = options.content,
                    eltHeight = elt.scrollHeight,
                    maxHeight = getMaxHeight(elt, options.lines),
                    length;

                // No truncation needed
                if (eltHeight <= maxHeight) {
                    return;
                }

                // Truncate by character until the height does not exceed maxHeight.
                for (length = content.length; length && elt.scrollHeight > maxHeight; --length) {
                    content = content.substring(0, length);
                    elt.textContent = content.trim() + ELLIPSIS;
                }
            }

            // Get the minimum among explicit values and the calculated
            // value based on lines to clamp.
            function getMaxHeight(elt, lines) {
                var lineHeight = getLineHeight(elt),
                    maxHeight = lines * lineHeight,
                    computedStyle = window.getComputedStyle(elt),
                    cssHeight = parseFloat(computedStyle.height),
                    cssMaxHeight = parseFloat(computedStyle.maxHeight),
                    possibleValues = [maxHeight],
                    errorMargin;

                if (!isNaN(cssHeight)) {
                    possibleValues.push(cssHeight);
                }
                if (!isNaN(cssMaxHeight)) {
                    possibleValues.push(cssMaxHeight);
                }

                // Take the most restrictive (smallest) value as the maxHeight.
                maxHeight = Math.min.apply(Math, possibleValues);

                // Account for font rendering where the actual height of the
                // first line can be greater than the lineHeight value.
                errorMargin = Math.max(lineHeight / 4.0, 1); // 25% is arbitrary but seems to be a be a good baseline.

                return maxHeight + errorMargin;
            }

            // If the lineHeight is available as a number use that,
            // else calculate it manually.
            function getLineHeight(elt) {
                var lineHeightCss = window.getComputedStyle(elt).lineHeight,
                    lineHeightValue = parseFloat(lineHeightCss);

                return isNaN(lineHeightValue) ? calculateLineHeight(elt) : lineHeightValue;
            }

            // Calculate the local line height by cloning the element to create
            // a duplicate context, appending a new line and comparing the height
            // difference.
            function calculateLineHeight(elt) {
                var clone = elt.cloneNode(),
                    height1, height2;

                elt.appendChild(clone);

                clone.innerHTML = '<br />';
                height1 = clone.scrollHeight;
                clone.innerHTML = '<br /><br />';
                height2 = clone.scrollHeight;

                elt.removeChild(clone);

                return height2 - height1;
            }
        }
    }]);
})( angular.module("com.vmware.workspace.components.lineClamp", []) );
(function (module) {

    module.controller('MessageDemo', function ($scope) {

        var demo = this,
            templateUrl = 'components/message/examples/externalMessageTemplate.html';

        demo.error = {type: 'error', text:'Error message.'};
        demo.success = {type: 'success', text:'Success Message'};
        demo.warning = {type: 'warning', text:'Warning Message'};
        demo.info = {
            type: 'info',
            text:'Info Message. ' +
                'There are a lot of things we might say about this, ' +
                'so this message could get quite long.'
            };
        demo.untyped = {text:'This message is not categorized'};

        demo.all = [
            demo.error,
            demo.success,
            demo.warning,
            demo.info,
            demo.untyped
        ];

        demo.custom = {
            text:'Error message.',
            type: 'error',
            info: 'Additional information',
            templateUrl: templateUrl
        };
    });

})( angular.module('com.vmware.workspace.components.examples') );

// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {
    module.directive('messageContext', ['$http', '$compile', '$templateCache', '$log', '$templateRequest', 'Localization',
        function ($http, $compile, $templateCache, $log, $templateRequest, Localization) {
            return {
                restrict: 'AE',
                scope: true,
                controllerAs: '$message',
                bindToController: true,
                controller: function ($scope, $element) {
                    var $message = this;
                    var TEMPLATE_URL = "components/message/templates/messageContextTemplate.html";
                    $scope._messagesArray_ = [];
                    $templateRequest(TEMPLATE_URL)
                        .then( function(templateData){
                            $compile(angular.element(templateData))($scope, function (clonedElement) {
                                angular.element($element).append(clonedElement);
                            });
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + TEMPLATE_URL + ' [' + e.message + ']');
                        });

                    function show (messagesArray) {
                        if(!angular.isArray(messagesArray) && angular.isObject(messagesArray)){
                            messagesArray = [messagesArray];
                        }
                        $scope._messagesArray_ = messagesArray;
                        $scope.close = close;
                    };

                    function info(messageKey, params, templateUrl) {
                        showMessage("info", messageKey, params, templateUrl);
                    }

                    function error(messageKey, params, templateUrl) {
                        showMessage("error", messageKey, params, templateUrl);
                    }

                    function warning(messageKey, params, templateUrl) {
                        showMessage("warning", messageKey, params, templateUrl);
                    }

                    function success(messageKey, params, templateUrl){
                        showMessage("success", messageKey, params, templateUrl);
                    }

                    function showMessage(messageType, message, params, templateUrl) {
                        var msg = {};
                        msg.type = messageType;
                        msg.text = Localization.getLocalizedString(message, params ? params : []);
                        if (templateUrl) {
                            msg.templateUrl = templateUrl;
                        }

                        show(msg);
                    }

                    // Close a message dialog.
                    function close (index) {
                        if (index >= 0 && angular.isArray($scope._messagesArray_)){
                            $scope._messagesArray_.splice(index, 1);
                        }
                    };

                    $message.info = info;
                    $message.error = error;
                    $message.warning = warning;
                    $message.success = success;
                    $message.show = show;
                    $message.close = close;
                },
                link : function($scope, element) {
                    element.addClass('message-context');
                }
            };
        }]);
    module.directive('message',   ['$templateCache', '$http', '$compile', '$log', '$templateRequest',
        function ($templateCache, $http, $compile, $log, $templateRequest) {
            return {
                restrict: 'AE',
                require: '^messageContext',
                scope: false,
                transclude: true,
                replace: true,
                link: function ($scope, element, attrs, message) {
                    var DEFAULT_TEMPLATE_URL = "components/message/templates/defaultMessageTemplate.html",
                        url = $scope.message.templateUrl || DEFAULT_TEMPLATE_URL;
                    var template = $templateCache.get(url);
                    $templateRequest(url)
                        .then( function(templateData){
                            populateDialog(angular.element(templateData));
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + url + ' [' + e.message + ']');
                        });
                    function populateDialog(template){
                        $compile(template)($scope, function (clonedElement) {
                            element.append(clonedElement);
                        });
                    };

                }
            };
        }]);
})(angular.module('com.vmware.workspace.components.message', []));

(function (module) {

    module.controller('ConfirmModalDemo', function ($scope) {
        var demo = this,
            $modal = $scope.$modal;

        demo.deleted = false;
        demo.cancelled = false;

        demo.action = function () {
            $modal.confirm({
                title: 'Deleting Paragraph',
                message: 'Ok to delete?'
            }).then(
                function () {
                    // Action was confirmed.
                    demo.deleted = true;
                },
                function () {
                    // Action was cancelled.
                    demo.cancelled = true;
                }
            );
        }
    });

})( angular.module('com.vmware.workspace.components.examples') );

(function (module) {

    var templateUrl = 'components/modal/examples/controllerModalTemplate.html';

    module.controller('ControllerModalDemo', function ($scope) {
        var demo = this;

        demo.counter = 0;
        demo.messages = ["Hello world", "I am alive.", "That's enough"];

        demo.say = function () {
            $scope.$modal.open(templateUrl, $scope);
        };
    });

    module.controller('InnerController', function ($scope) {
        var inner = this,
            demo = $scope.demo;

        inner.counter = 0;

        inner.increment = function () {
            demo.counter = (demo.counter + 1) % demo.messages.length;
            inner.counter = (inner.counter + 1) % demo.messages.length;
        }
    });



})( angular.module('com.vmware.workspace.components.examples') );

(function (module) {

    var templateUrl = 'components/modal/examples/messageModalTemplate.html';

    module.controller('MessageModalDemo', function ($scope) {
        var demo = this;

        demo.messages = [{
            text: "Hello, world.",
            type: 'success'
        }, {
            text: "I am unwell.",
            type: 'error'
        }];

        demo.externalTemplate = templateUrl;
    });

})( angular.module('com.vmware.workspace.components.examples') );

(function (module) {

    var templateUrl = 'components/modal/examples/modalTemplate.html';

    module.controller('ModalDemo', function ($scope) {
        var demo = this,
            msgs = ["Hello, world.", "I am alive."];

        demo.messages = msgs;
        demo.externalTemplate = templateUrl;
    });

})( angular.module('com.vmware.workspace.components.examples') );

(function (module) {

    module.controller('PromiseModalDemo', function ($scope) {
        var demo = this,
            $modal = $scope.$modal;

        var templateUrl = 'components/modal/examples/promiseModalTemplate.html';

        demo.selectedColor = '';

        function setColor( color ) {
            demo.selectedColor = color;
        }

        demo.choose = function () {
            $modal.open( templateUrl, {color: demo.selectedColor})
                .then( setColor );
        }
    });

})( angular.module('com.vmware.workspace.components.examples') );

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    var activeClass = 'is-active';

    module.directive('modalContext', [
        '$compile', '$templateRequest', '$log', '$timeout', '$animate', '$q', 'Localization',
        function ($compile, $templateRequest, $log, $timeout, $animate, $q, Localization) {
            return {
                restrict: 'AE',
                scope: true,
                controller: controller,
                link: postLink,
                controllerAs: '$modal',
                bindToController: true
            };

            function controller($scope, $element) {
                var $modal = this,
                    modals = {}, // all loaded modal templates: {name -> {element, linkFn}, ... }
                    PUSH = 'PUSH',
                    POP = 'POP',
                    MOVE = 'MOVE';
                $scope.stack = [];  // pending activation requests: [{name: '...', options: {}], ...]

                $scope.$watchCollection('stack',
                    function (newStack, oldStack) {

                        var delta = findChange(newStack,oldStack),
                            newActivation = delta.newActivation,
                            newRequest = delta.newRequest,
                            oldActivation = delta.oldActivation,
                            oldRequest = delta.oldRequest;

                        switch (delta.change) {
                            case PUSH:
                                if(oldActivation)
                                    hide(oldActivation.element);
                                if(newActivation && newRequest)
                                    activate(newActivation.element, newActivation.linkFn, newRequest.options);
                                    break;
                            case POP:
                                if(oldActivation && oldRequest)
                                    deactivate(oldActivation.element, oldRequest.options);
                                if(newActivation)
                                    show(newActivation.element);
                                break;
                            case MOVE:
                            default:
                                if(oldActivation && oldRequest)
                                    deactivate(oldActivation.element, oldRequest.options);
                                if(newActivation && newRequest)
                                    activate(newActivation.element, newActivation.linkFn, newRequest.options);
                        }

                        function findChange(newStack, oldStack){

                            var delta = {},
                                oldStackLength = oldStack && oldStack.length?oldStack.length: 0,
                                newStackLength = newStack && newStack.length?newStack.length: 0,
                                oldName,
                                newName;

                            delta.oldRequest =  oldStackLength ? oldStack[oldStackLength - 1 ] : undefined;
                            delta.newRequest =  newStackLength ? newStack[newStackLength - 1 ] : undefined;
                            oldName = delta.oldRequest && delta.oldRequest.name;
                            newName = delta.newRequest &&  delta.newRequest.name;
                            delta.oldActivation = oldName && modals[oldName];
                            delta.newActivation = newName && modals[newName];

                            if(newStackLength > oldStackLength)
                                delta.change = PUSH;
                            if(newStackLength < oldStackLength)
                                delta.change = POP;
                            if(newStackLength === oldStackLength)
                                delta.change = MOVE;

                            return delta;
                        }
                    });

                // Interface provided to templates and other controllers/directives

                $modal.open = open;
                $modal.close = close;
                $modal.cancel = cancel;
                $modal.register = register;
                $modal.finalize = finalize;

                $modal.confirm = standardModal({
                    templateUrl: 'components/modal/templates/confirm.html',
                    params: {
                        ok: 'modal.confirm.ok',
                        cancel: 'modal.confirm.cancel'
                    }
                });

                $modal.spinner = standardModal({
                    templateUrl: 'components/modal/templates/spinner.html',
                    params: {
                    }
                });

                $modal.alert = standardModal({
                    templateUrl: 'components/modal/templates/alert.html',
                    params: {
                        ok: 'modal.alert.ok'
                    }
                });

                // The modal currently open or requested to open.
                function current () {
                    return $scope.stack.length && $scope.stack[$scope.stack.length - 1] || null;
                }

                // Request a modal be opened.
                function request (name, options, deferred) {
                    $scope.stack.push({name: name, options: options, deferred: deferred});
                }

                // Close the current modal.
                function close ( value ) {
                    var activation = $scope.stack.pop(),
                        deferred = activation.deferred;

                    if ( deferred ) {
                        deferred.resolve( value );
                    }
                }

                // Cancel the current modal.
                function cancel ( reason ) {
                    var activation = $scope.stack.pop(),
                        deferred = activation.deferred;

                    if ( deferred ) {
                        deferred.reject( reason );
                    }
                }

                // Register a modal with the context (allowing reuse).
                function register (name, element, linkFn) {
                    name = name || 0;
                    modals[name] = {element: element, linkFn: linkFn};
                }

                // Open the modal, passing scope parameter bindings.
                //   open( options )
                //   open( url, paramsOrScope [,options] )
                function open (urlOrOptions, paramsOrScope, moreOptions) {
                    var options = angular.isString( urlOrOptions ) ?
                            { templateUrl: urlOrOptions, params: paramsOrScope } : urlOrOptions,
                        passScope = paramsOrScope && typeof paramsOrScope.$new === 'function';

                    options = options || {modal: 0};

                    if (passScope) {
                        options.params = {};
                        options.scope = paramsOrScope;
                    }

                    if (moreOptions) {
                        options = angular.extend( {}, options, moreOptions );
                    }

                    return load(options);
                }

                // Load the modal template, or find it if already loaded, and request it be opened.
                function load (options) {
                    var url = options.templateUrl,
                        template = url || options.template,
                        name = options.modal || url || 0,
                        existing = modals[name],
                        deferred = $q.defer();

                    function buildModal(html) {
                        var template = angular.element(html);

                        $element.append( template );
                        $modal.register( name, template, $compile(template) );
                        request(name, options, deferred);
                    }

                    if ( existing ) {
                        request(name, options, deferred);
                    } else if ( url ) {
                        // otherwise, load and compile it asynchronously
                        $templateRequest(url)
                            .then(buildModal)
                        .catch( function(reason) {
                            $log.error('Failed to load template: ' + url + ' [' + reason + ']');
                        });
                    } else if(template) {
                        buildModal(template);
                    }
                    else {
                        $log.error('No such template: ' + name);
                    }

                    return deferred.promise;
                }

                // Bind parameters to a modal element's scope and display it.
                function activate (element, linkFn, options) {
                    if( !element ) return;
                    var params = options.params,
                        scope = linkFn ? (options.scope || $scope).$new() : element.scope();

                    angular.forEach( params || {}, function (value, key) {
                        scope[key] = value;
                    });

                    if( linkFn ) {
                        scope.$modalOptions = options;
                        linkFn(scope);
                    } else {
                        finalize( element, options );
                    }
                }

                // called by modal's postlink to finish opening the modal
                function finalize (element, options) {
                    invoke( options.onReady );
                    show( element );
                }

                // Hide the modal and clean up the bindings.
                function deactivate (element, options) {
                    if( !element ) return;
                    var scope = element.scope(),
                        params = options.params;

                    $animate.removeClass(element, activeClass)
                    .then( function () {
                        // wait until animation finishes to remove parameters
                        angular.forEach( params || {}, function (value, key) {
                            delete scope[key];
                        });
                    });

                }

                function show(element) {
                    if( !element ) return;
                    $animate.addClass( element, activeClass );
                }

                function hide(element) {
                    if( !element ) return;
                    $animate.removeClass( element, activeClass );
                }

                function invoke( fn ) {
                    if ( fn ) {
                        fn.call( $modal );
                    }
                }

                function standardModal( defaultOptions ) {
                    return function ( messageOrParams, optionalOptions ) {
                        var params = angular.isObject(messageOrParams) ?
                                messageOrParams : { message: messageOrParams },
                            options = angular.extend( {}, defaultOptions, optionalOptions || {} );

                        options.params = angular.extend( {}, defaultOptions.params, params );

                        return $modal.open( options );
                    }
                }
            }

            function postLink(scope, element) {
                element.addClass('modal-context');
            }
        }]);


    module.directive('modal',
        function () {
            return {
                restrict: 'AE',
                require: '^modalContext',
                scope: false, // an inherited scope is constructed by load()
                transclude: true,
                replace: true,
                link: postLink,
                templateUrl: 'components/modal/templates/modal.html'
            };

            function postLink( scope, element, attrs, $modal ) {
                var name = attrs['modal'],
                    options = scope.$modalOptions;

                if( name ) {
                    $modal.register( name, element );
                }

                if( options ) {
                    // the modal is being linked as part of an activation
                    $modal.finalize( element, options );
                }
            }

            // TODO: listeners for closing the modal on click-away, (ESC) keypress

        });

})( angular.module('com.vmware.workspace.components.modal', ['com.vmware.workspace.services.localization']));

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

'use strict';

(function (module) {

    module.directive('rating', function () {
        return {
            restrict: 'A',
            scope: { rating: "=" },
            controller: controller,
            controllerAs: '$rating',
            bindAsController: true,
            replace: true,
            templateUrl: 'components/rating/templates/rating.html'
        }
    });

    function controller ($scope) {
        var $rating = this;

        $rating.values = [1, 2, 3, 4, 5];
    }

})( angular.module("com.vmware.workspace.components.rating", []) );

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    module.directive('spinner', [ function () {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            templateUrl: 'components/spinner/templates/spinner.svg',
            templateNamespace: 'svg'
        };
    }]);

})( angular.module('com.vmware.workspace.components.spinner', []));

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    // String used to prefix all SVG <symbol> #ids
    var symbolPrefix = 'svg-symbol-';

    // SVG <defs> element where dynamically loaded symbols are injected
    var svgDefinitions;

    // SVGs that have been loaded or requested to be loaded
    var svgRequested = {};

    // Template for creating SVG definitions block
    var svgDefsTemplate = '<svg style="display:none"><defs></defs></svg>';

    module.directive('symbol', ['$compile', '$templateRequest', '$log', function ( $compile, $templateRequest, $log ) {
        return {
            restrict: 'A',
            scope: {},
            controller: controller,
            controllerAs: '$symbol',
            bindAsController: true,
            link: postLink,
            replace: true,
            template: '<svg class="symbol"><use xlink:href="{{$symbol.href}}" /></svg>',
            templateNamespace: 'svg'
        };

        function controller ($scope) {
            $symbol = this;

            $symbol.loadTemplate = loadTemplate;

            function loadTemplate( url, element ) {
                var id = generateSymbolId( url ),
                    loaded = svgRequested[id] || document.getElementById( id );

                $symbol.href = '#' + id;

                if ( url && !loaded ) {
                    // load and compile it asynchronously
                    svgRequested[id] = true;
                    $templateRequest( url )
                    .then( function( svg ) {
                        var el = angular.element(svg)[0],
                            ns = el.namespaceURI,
                            children = Array.prototype.slice.call(el.children),
                            viewBox = el.getAttribute('viewBox'),
                            symbol = document.createElementNS(ns, 'symbol');

                        symbol.id = id;
                        symbol.setAttribute('viewBox', viewBox);
                        _.forEach(children, function (child) {
                            symbol.appendChild(child);
                        });

                        injectSymbol(symbol);
                    })
                    .catch( function(reason) {
                        $log.error('Failed to load template: ' + url + ' [' + reason + ']');
                    });
                }
            }
        }

        function postLink ( scope, element, attrs, $symbol ) {
            var url = attrs.symbol;

            $symbol.loadTemplate( url, element );
        }

        function generateSymbolId ( url ) {
            var path = url.split('/'),
                last = path.pop(),
                name = last.replace(/[^a-zA-Z0-9-].*$/, '');

            return symbolPrefix + name;
        }

        function injectSymbol ( symbol ) {
            var defs = svgDefinitions || createDefinitionsElement();

            defs.appendChild(symbol);
        }

        function createDefinitionsElement () {
            var body = document.body,
                svg = angular.element(svgDefsTemplate)[0];

            svgDefinitions = svg.children[0];
            body.appendChild(svg);

            return svgDefinitions;
        }
    }]);

})( angular.module('com.vmware.workspace.components.symbol', []));

(function (module) {

    module.controller('TabsBasicDemo', function () {
        var demo = this;

        demo.tabs = [
            { key: 'monitor', href: '#/dashboard' },
            { key: 'people', href: '#/people', active: true },
            { key: 'security', href: '#/security' },
            { key: 'setup', href: '#/setup' }
        ];

        demo.tabs2 = [
            {
                key: 'users',
                href: '#/people/users',
                active: true
            },
            { key: 'groups', href: '#/people/groups' },
            { key: 'directories', href: '#/directories' }
        ];

        demo.tabs3 = [
            { key: 'Profile', href: '#/people/users/profile', active: true },
            { key: 'Groups', href: '#/people/users/groups'},
            { key: 'Apps', href: '#people/users/apps'}
        ];
    });

})( angular.module('com.vmware.workspace.components.examples') );

// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {
    'use strict';
    module.directive('tabs', [ function () {
        return {
            restrict: 'AE',
            scope: true,
            templateUrl: 'components/tabs/templates/tabs.html',
            replace: true,
            link: function(scope,el){
                scope.$watchCollection("routes",function(newRoutes){
                    if(!newRoutes ||  newRoutes.length === 0){
                        el.addClass("ng-hide");
                    }else {
                        el.removeClass("ng-hide");
                    }
                }) ;
            }
        };
    }]);
})( angular.module("com.vmware.workspace.components.tabs", []) );

// (c) 2014 VMware, Inc.  All rights reserved.
(function (module) {
    'use strict'
    module.provider('Localization', function localization() {
        var l10nMap = {};
        this.setL10nMap = function (localeMap) {
            l10nMap = localeMap;
        }

        this.$get = function Localization() {

            var localize = {
                getLocalizedString: function (i18nKey, params) {
                    var result = l10nMap[i18nKey] || i18nKey;
                    // Inject parameters into i18nString
                    if (result != i18nKey && params && params.length > 0) {
                        for (var index = 0; index < params.length; index++) {
                            var target = '{' + (index) + '}';
                            result = result.replace(target, params[index]);
                        }
                    }
                    return result;
                }
            };
            return localize;
        };
    });


    module.filter('i18n', ['Localization', function (Localization) {
        return function (key) {
            // Optional parameters passed into the filter are present in the arguments
            var params = [].splice.call(arguments, 1, arguments.length - 1);
            // Get the translated string for key and optional parameters
            return Localization.getLocalizedString(key, params);
        };
    }]);

    //Directive to place HTML as localized strings parameter. Work for one parameter only for now.
    //Usage: <span i18n="messageKey"><input type=text/ ng-model="controller.inputValueWithinText"></span>
    module.directive('i18n',['Localization', function(Localization){
        return {
            restrict: 'AE',
            compile: function(element, attributes){
                var splitedText = Localization.getLocalizedString(attributes.i18n, []).split("{0}");
                if (splitedText.length > 0){
                    element.prepend(splitedText[0]);
                    if (splitedText.length > 1){
                        element.append(splitedText[1]);
                    }
                }
            }
        };
    }]);

})(angular.module('com.vmware.workspace.services.localization', []));
