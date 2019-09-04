appCenter.component('apps', {
    template: '<div ng-include="\'app-v2/components/apps/\' + appsCtrl.templateUrl">',
    controllerAs: 'appsCtrl',
    controller: ['$q',
        'UserAgent',
        'ConfigService',
        'CatalogService',
        'HttpProxyService',
        'BootstrapService',
        'AppsService',
        '$scope',
        '$rootScope',
        'UtilService',
        'ViewportMinAppService',
        '$http',
        '$window',
        '$state',
        'TenantCustomizationService',
        'EventsService',
        '$transitions',
        '$filter',
        function($q,
                 UserAgent,
                 ConfigService,
                 CatalogService,
                 HttpProxyService,
                 BootstrapService,
                 AppsService,
                 $scope,
                 $rootScope,
                 UtilService,
                 ViewportMinAppService,
                 $http,
                 $window,
                 $state,
                 TenantCustomizationService,
                 EventsService,
                 $transitions,
                 $filter) {
            var vm = this;
            var newAppsLabelEnabled = UtilService.getObjValue(window, 'workspaceOne.featureFlags.NEW_APPS_LABEL', false);
            var favoriteNativeApps = UtilService.isFavoriteNativeAppEnabled();
            var recommendedCategory = {};
            var bookmarkOrderSet = false;

            this.templateUrl = UtilService.loadTemplateForPlatform('mobile.html', 'desktop.html', 'browser.html');

            vm.favorites = [];
            vm.categories = [];
            vm.appContext = {
                selectedCategory: {}
            };
            vm.appLoading = true;
            vm.excludeThinApps = !UserAgent.isThinAppSortSupportedBrowser();
            vm.emptyFillers = [1, 2, 3, 4, 5, 6, 7, 8];
            vm.favoritesOnlyView = false;
            vm.loadFromDbFailed = false;
            vm.scrollDisabled = false;
            vm.inAppNotificationEnabled = TenantCustomizationService.isNotificationsEnabled();

            // Onload to get the minApp
            vm.minFavoriteCount = ViewportMinAppService.getMinAppNo($window.innerWidth);
            // Max section app should be the same number as the minFavoriteApps, as the minFavoriteApps are two rows, we can add one
            vm.maxSectionAppsCount = vm.minFavoriteCount;
            vm.minSectionAppsCount = vm.minFavoriteCount / 2;

            vm.customizationsOrder = [];
            vm.promotions = [];
            vm.promotionApplication = [];
            vm.promotionCategory = [];
            vm.recommendedApps = [];
            vm.newApps = [];

            // Used for One-Row class for the newApps and recommendedApps module, to toggle the "See All" and "See Less"
            vm.appsModuleOneRow = {'newApps': true, 'recommended': true};
            // Desktopapp and browser grid structure are different at the different breakpoints
            vm.oneRowSectionAppsCount = ViewportMinAppService.oneRowSectionAppsCount($window.innerWidth);

            var isIOSAndroid = UserAgent.isIOS() || UserAgent.isAndroid();

            // Get the tenant customization from TenantCustomizationService for preview-loading
            var previewCustomization = TenantCustomizationService.getCustomizationsOrder();
            vm.previewShowFavorites = previewCustomization.indexOf('Favorites') > -1;
            vm.previewShowPromotions = previewCustomization.indexOf('Promotions') > -1;
            vm.previewShowNewApps = previewCustomization.indexOf('NewApps') > -1;
            vm.previewShowRecommendedApps = previewCustomization.indexOf('Recommended') > -1;
            vm.previewShowAllApps = !vm.previewShowPromotions && !vm.previewShowNewApps && !vm.previewShowRecommendedApps;

            // This can not move to service as the newApps and recommendedApps length needs to get from here
            vm.updateDisplayedApps = function() {
                vm.displayedNewAppsCount = vm.appsModuleOneRow.newApps ? vm.oneRowSectionAppsCount : vm.newApps.length;
                vm.displayedRecommendedAppsCount = vm.appsModuleOneRow.recommended ? vm.oneRowSectionAppsCount : vm.recommendedApps.length;
            };

            //This function will be cleaner after HW-90737 task
            var loadPageEntitlements = function(appContext, loadCategories, loadNewApps, noCache) {
                var appList = {};
                var catalogCustomization = TenantCustomizationService.getCatalogCustomizationSettings();
                vm.customizationsOrder = TenantCustomizationService.getCustomizationsOrder();

                var callQueue = [CatalogService.getFirstPage(vm.appContext, noCache, vm.excludeThinApps, false, false)];
                if (loadCategories && vm.customizationsOrder.indexOf('Categories') > -1) {
                    callQueue.push(ConfigService.getAppCategories());
                }
                if (loadNewApps && vm.customizationsOrder.indexOf('NewApps') > -1) {
                    callQueue.push(CatalogService.getNewApps(noCache, vm.excludeThinApps, false));
                }

                return $q.all(callQueue).then(function(data) {
                    vm.appLoading = false;

                    if (loadNewApps && vm.customizationsOrder.indexOf('NewApps') > -1) {
                        vm.newApps = _.get(data.pop(), 'entitlements', []);
                        vm.displayedNewAppsCount = vm.appsModuleOneRow.newApps ? vm.oneRowSectionAppsCount : vm.newApps.length;
                    }
                    if (loadCategories && vm.customizationsOrder.indexOf('Categories') > -1) {
                        vm.categories = data.pop() || [];
                        CatalogService.setAllCategory(vm.categories);
                    }
                    vm.promotions = getAppPromotions(catalogCustomization);
                    vm.promotionApplication = getPromotionApps(catalogCustomization);
                    vm.promotionCategory = getPromotionCategory(catalogCustomization);
                    appList = data.pop();
                    vm.entitlements = _.get(appList, 'entitlements', []);
                    vm.entitlementsLoadFromDbFailed = _.get(appList, 'loadFromDbFailed', false);
                    vm.noApps = !vm.entitlements.length;
                    vm.customizationLoadFromDbFailed = TenantCustomizationService.isLoadFromDbFailed();
                    vm.favoritesOnlyView = TenantCustomizationService.isHubFavoritesOnlyView();
                    vm.dbLoadFailed = vm.entitlementsLoadFromDbFailed || vm.customizationLoadFromDbFailed;
                    vm.favoritesEnabled = TenantCustomizationService.isHubFavoritesEnabled() && !vm.favoritesOnlyView && !vm.dbLoadFailed;
                    CatalogService.setDeviceStatus(_.get(appList, "deviceStatus"));
                    AppsService.setEntitlements(vm.entitlements);
                    AppsService.loadFromDbFailed = vm.entitlementsLoadFromDbFailed;
                    AppsService.setFavorites(_.get(appList, 'bookmarks', []));

                    bookmarkOrderSet = _.get(appList, 'bookmarkOrderSet', false);

                    vm.favorites = AppsService.getFavorites();
                    vm.defaultLabels = CatalogService.getDefaultLabelsFromEntitlements(vm.entitlements);

                    vm.isFavoritesEditDisabled = isIOSAndroid || vm.favorites.length === 1;

                    recommendedCategory = _.find(vm.categories, {'name': 'Recommended'});
                    if (recommendedCategory && vm.customizationsOrder.indexOf('Recommended') > -1) {
                        CatalogService.getRecommendedApps(noCache, vm.excludeThinApps, false).then(function(response) {
                            vm.recommendedApps = _.get(response, 'entitlements', []);
                            vm.displayedRecommendedAppsCount = vm.appsModuleOneRow.recommended ? vm.oneRowSectionAppsCount : vm.recommendedApps.length;
                        });
                        vm.categories = _.reject(vm.categories, recommendedCategory);
                    }
                    //client can know when a request is fully complete a new callback action should be added, CONTENT_LOADED.
                    //Client will initially use this to create Apteligent user flows.
                    if (UtilService.isHubNative()) {
                        UtilService.informHubContentLoaded();
                    }
                    // Added for hub browser and hub desktopapp
                    var noCustomizedAppModule = function() {
                        return (vm.customizationsOrder.indexOf('NewApps') === -1 && vm.customizationsOrder.indexOf('Promotions') === -1 && vm.customizationsOrder.indexOf('Recommended') === -1);
                    };
                    // If there is still entitlements and vm.customizationLoadFromDbFailed is false we show all apps
                    vm.showAllApps = (vm.entitlements.length && noCustomizedAppModule() && !vm.entitlementsLoadFromDbFailed) || (vm.entitlements.length && vm.customizationLoadFromDbFailed);

                    vm.fullScreenView = vm.noApps || vm.customizationsOrder.indexOf('Categories') === -1;

                    EventsService.getEvents().then(function(data) {
                        AppsService.checkForEvents(vm.entitlements, data);
                    });
                });
            };

            var getPromotionApps = function(data) {
                return _.get(data, 'compositeCatalogCustomizations.customizationEntityDetails.APPLICATION', {});
            };

            var getPromotionCategory = function(data) {
                return _.get(data, 'compositeCatalogCustomizations.customizationEntityDetails.CATEGORY', {});
            };

            var loadFirstPageOnLoad = function() {
                loadPageEntitlements(vm.appContext, true, newAppsLabelEnabled, false);
            };

            var getAppPromotions = function(data) {
                var appPromotions = _.find(_.get(data, 'compositeCatalogCustomizations.catalogCustomizations.catalogCustomizationList', []), {'name': 'Promotions'});
                return _.get(appPromotions, 'customizationValues', undefined) || [];
            };

            vm.clearCache = function() {
                HttpProxyService.clearAll();
                return loadPageEntitlements(vm.appContext, true, newAppsLabelEnabled, true);
            };

            vm.getRecommendedApps = function() {
                CatalogService.setSelectedCategory(recommendedCategory);
                $state.go('apps.list', {
                    type: 'category',
                    category: recommendedCategory.name
                });
            };

            vm.toggleOneRowAppsModule = function(params) {
                if (params === 'newApps') {
                    vm.appsModuleOneRow.newApps = !vm.appsModuleOneRow.newApps;
                    vm.displayedNewAppsCount = vm.appsModuleOneRow.newApps ? vm.oneRowSectionAppsCount : vm.newApps.length;
                }
                if (params === 'recommended') {
                    vm.appsModuleOneRow.recommended = !vm.appsModuleOneRow.recommended;
                    vm.displayedRecommendedAppsCount = vm.appsModuleOneRow.recommended ? vm.oneRowSectionAppsCount : vm.recommendedApps.length;
                }
            };

            // This is for mobile, do not touch
            vm.canBeDisplayed = function(type) {
                if (!vm.entitlements.length || type === 'Categories') {
                    return false;
                } else if (vm.recommendedApps.length && type === 'Recommended') {
                    return true;
                } else if (vm.newApps.length && type === 'NewApps') {
                    return true;
                } else if (vm.favorites.length && type === 'Favorites') {
                    return true;
                } else if (vm.promotions.length && type === 'Promotions') {
                    return true;
                } else {
                    return false;
                }
            };

            // There is one difference from the above function, in browser, for favorites regardless length we display -- either favorite apps or empty state message
            vm.canBeDisplayedBrowser = function(type) {
                if (!vm.entitlements.length || type === 'Categories') {
                    return false;
                } else if (vm.recommendedApps.length && type === 'Recommended') {
                    return true;
                } else if (vm.newApps.length && type === 'NewApps') {
                    return true;
                } else if (type === 'Favorites') {
                    // If no length we show the empty state favorites
                    return true;
                } else if (vm.promotions.length && type === 'Promotions') {
                    return true;
                } else {
                    return false;
                }
            };

            vm.goToAllAppsList = function() {
                $state.go('apps.list', {
                    type: 'all'
                });
            };

            vm.goToFavoriteEditMode = function() {
                // place holder the favorite components for edit mode aka reordering will be implemented later when ux mocks out
                $state.go('apps.favoritesedit');
            };

            $rootScope.$on('favorites-reordering-canceled', function() {
                // In the case of cancel we need to fetch a custom copy of original ordered list from the server
                CatalogService.getFirstPage(vm.appContext, false, vm.excludeThinApps, false, false).then(function(data) {
                    vm.favorites = data.bookmarks;
                    AppsService.setFavorites(vm.favorites);
                });
            });

            vm.canCategoryBeDisplayed = function() {
                return !vm.favoritesOnlyView && vm.customizationsOrder.indexOf('Categories') > -1 && !vm.noApps;
            };

            function sortFavorites() {
                //if bookmarkOrder is not set then sort favorites by name
                if (!bookmarkOrderSet) {
                    vm.favorites = $filter('orderBy')(vm.favorites, 'name', false);
                }
            }

            $scope.$on('app-bookmarked', function(event, app) {
                appBookmarked(app);
            });

            $scope.$on('native-bridge-app-bookmarked', function(event, app) {
                var entitlement = _.find(vm.entitlements, {'appId': app.appId});
                entitlement.favorite = app.favorite;
                appBookmarked(entitlement);
                $scope.$apply();
            });

            function checkForDuplicate(app) {
                var isDuplicate = false;
                vm.favorites.some(function(value) {
                    if (value.appId === app.appId) {
                        isDuplicate = true;
                    }
                });
                return isDuplicate && app.favorite;
            }

            function appBookmarked(app) {
                if (checkForDuplicate(app)) {
                    return;
                }
                // Update the view of the favorites after details page toggle favorite or contextMenu toggle favorite
                if (app.favorite) {
                    if (favoriteNativeApps && bookmarkOrderSet) {
                        vm.favorites.push(app);
                    } else {
                        vm.favorites.unshift(app);
                    }
                } else {
                    vm.favorites = _.reject(vm.favorites, function(el) {
                        return el.appId === app.appId;
                    });
                }

                sortFavorites();

                _.each(vm.entitlements, function(item) {
                    if (item.appId === app.appId) {
                        item.favorite = app.favorite;
                    }
                });

                //update recommended apps
                _.each(vm.recommendedApps, function(item) {
                    if (item.appId === app.appId) {
                        item.favorite = app.favorite;
                    }
                });

                //update new apps
                _.each(vm.newApps, function(item) {
                    if (item.appId === app.appId) {
                        item.favorite = app.favorite;
                    }
                });

                AppsService.setEntitlements(vm.entitlements);
                AppsService.setFavorites(vm.favorites);
                vm.isFavoritesEditDisabled = isIOSAndroid || vm.favorites.length === 1;
            }

            //IOS - prevent this page to scroll in when foreground page scroll
            $transitions.onStart({to: 'apps.**', from: 'apps.**'}, function(transition) {
                toggleScrollDisable(transition.to().name);
            });

            // On page refresh on apps list page, scroll should be hidden
            toggleScrollDisable($state.current.name);

            // For Hub Browser, the search is part of the apps, not a different url
            $rootScope.$on('hub-browser-search-on', function() {
                vm.scrollDisabled = true;
            });

            $rootScope.$on('hub-browser-search-off', function() {
                vm.scrollDisabled = false;
            });

            function toggleScrollDisable(currentState) {
                vm.scrollDisabled = (currentState !== 'apps');
            }

            // To handle android back button on apps page, navigating from notificaitons
            // then click the contextDialog, click the back button, the actionsheet would still be on with nativenav appear flow

            function dismissActionSheetOnBackButton() {
                // Match apps but not apps/details or apps/list
                var hashregex = /apps\//;
                return location.hash.indexOf('nativenav=Hide') === -1 && !hashregex.test(location.hash);
            }

            // This will trigger everytime #/apps is the hash
            if (UserAgent.isAndroid()) {
                window.addEventListener('hashchange', function() {
                    if (dismissActionSheetOnBackButton()) {
                        angular.element(".appitem-contextdialog-scrim").trigger('click');
                    }
                });
            }

            // For desktopapp refresh
            var appsRefresh = function() {
                HttpProxyService.clearAll();
                return loadPageEntitlements(vm.appCenterContext, true, newAppsLabelEnabled, true);
            };

            $rootScope.$on('Desktop-Apps-Refresh', function() {
                appsRefresh();
            });

            loadFirstPageOnLoad();
        }]
});
