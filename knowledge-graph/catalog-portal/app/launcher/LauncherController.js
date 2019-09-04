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
