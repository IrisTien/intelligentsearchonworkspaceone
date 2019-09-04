
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
