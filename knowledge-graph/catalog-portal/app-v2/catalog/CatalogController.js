(function(module) {
    'use strict';

    module.controller('CatalogController', [
                        '$scope',
                        '$rootScope',
                        'CatalogService',
                        'ConfigService',
                        '$timeout',
                        '$notify',
                        'EventsService',
                        'PAGING',
                        'UserAgent',
                        'BootstrapService',
                        'ModalService',
                        'hznLocalStorage',
                        'HttpProxyService',
                        '$filter',
                        'ProgressIndicatorService',
                        '$location',
                        'UtilService',
                        function($scope,
                                 $rootScope,
                                 CatalogService,
                                 ConfigService,
                                 $timeout,
                                 $notify,
                                 EventsService,
                                 PAGING,
                                 UserAgent,
                                 BootstrapService,
                                 ModalService,
                                 hznLocalStorage,
                                 HttpProxyService,
                                 $filter,
                                 ProgressIndicatorService,
                                 $location,
                                 UtilService) {
        hznLocalStorage.last_active_page_v2 = "catalog";
        var vm = this;

        var enrollmentUrl;
        var appCenterCtrl = $scope.appCenterCtrl;
        var allCatalogApps = [];
        var index = 0;
        var loadingUnCachedEntitlements = false;
        vm.excludeThinApps = !UserAgent.isThinAppSortSupportedBrowser();
        vm.featureFlags = workspaceOne.featureFlags;

        function continueToCatalog() {
            HttpProxyService.clearAll();
            //After setting the value of direct enrollment events need to be deleted as they are only valid once.
            for (var i = 0; i < appCenterCtrl.mdmEnrolledEvents.length; i++) {
                EventsService.deleteEvent(appCenterCtrl.mdmEnrolledEvents[i].eventId);
            }
            appCenterCtrl.directEnrollmentEnabled = false;
            BootstrapService.setDirectEnrollmentStatus(false);
            $location.path('/catalog');
        }

        var init = function() {
            vm.loading = true;
            vm.visibleCatalogApps = [];
            vm.emptyFillers = [1, 2, 3, 4, 5, 6, 7, 8];
            vm.appCategories = [];
            vm.appCenterContext = {
                selectedCategory: CatalogService.getSelectedCategory()
            };
            vm.defaultLabels = CatalogService.getDefaultLabels();
            vm.showNoResultsMsg = false;
            vm.showCatalogTooltip = false;
            vm.enrollmentSupported = ConfigService.enrollmentSupported();
            if (vm.enrollmentSupported) {
                ConfigService.getEnrollmentUrl().then(function(url) {
                    enrollmentUrl = url;
                });
            }
            vm.filterConfig = { items: vm.appCategories, defaultItem: vm.appCenterContext.selectedCategory};
            vm.selectAllRecommendedApps = true;
        };

        var loadFirstPageEntitlements = function(context, loadCategories, noCache) {
            // dont show loader for pull to refresh call
            if (!noCache) {
                var cancelPromise = $timeout(function() {
                    startLoading();
                }, 200);
            }
            return CatalogService.getFirstPage(context, noCache, vm.excludeThinApps, BootstrapService.getDirectEnrollmentStatus(), false).then(function(entitlementsResponse) {
                index = 0;
                $timeout.cancel(cancelPromise);
                doneLoading();
                loadingUnCachedEntitlements = false;
                $scope.deviceStatus = _.get(entitlementsResponse, "deviceStatus");
                CatalogService.setDeviceStatus(_.get(entitlementsResponse, "deviceStatus"));

                updateApps(entitlementsResponse.entitlements, context);
                // When there are no recommended app, directly go to the Catalog or Bookmarks page.
                if (BootstrapService.getDirectEnrollmentStatus() && vm.visibleCatalogApps <= 0) {
                    continueToCatalog();
                }

                if (loadCategories) {
                    ConfigService.getAppCategories().then(function(categories) {
                        if (categories) {
                            var recommendedCategoryFound = false;
                            for (var i = categories.length - 1; i >= 0; i--) {
                                if (categories[i].name === 'Recommended') {
                                    categories.splice(i, 1);
                                    recommendedCategoryFound = true;
                                }
                            }
                            if (recommendedCategoryFound) {
                                var label = CatalogService.getRecommendedLabel();
                                if (_.where(vm.defaultLabels, label).length == 0) {
                                    vm.defaultLabels.push(label);
                                }
                            }
                            vm.appCategories = categories;
                            vm.filterConfig.items = vm.defaultLabels.concat(categories);
                        } else {
                            vm.filterConfig.items = vm.defaultLabels;
                        }
                    });
                }
            });
        };

        vm.closeTooltip = function() {
            vm.showCatalogTooltip = false;
            hznLocalStorage.catalogToolTip = true;
        };

        vm.getNextPage = function() {
            //stop pagination when pull to refresh in progress
            if (!loadingUnCachedEntitlements) {
                var endIndex = index + PAGING.PAGE_SIZE;
                while (index < endIndex && index < allCatalogApps.length) {
                    vm.visibleCatalogApps.push(allCatalogApps[index]);
                    index++;
                }
            }
            //count of apps used in masthead
            appCenterCtrl.visibleCatalogApps = vm.visibleCatalogApps;
        };

        var loadFirstPageOnLoad = function() {
            BootstrapService.init().then(loadFirstPageEntitlements(vm.appCenterContext, true, false));
        };

        var updateApps = function(data, context) {
            allCatalogApps = data;
            vm.visibleCatalogApps = [];
            vm.recommendedAppsCount = allCatalogApps.length;
            if (context.selectedCategory.type && context.selectedCategory.type === 'all') {
                appCenterCtrl.hasLaunchableApps = hasLaunchableApps(allCatalogApps);
                appCenterCtrl.showTabsSection = appCenterCtrl.showPeopleTab || (!appCenterCtrl.showPeopleTab && appCenterCtrl.hasLaunchableApps && appCenterCtrl.showBookmarksTab && appCenterCtrl.showCatalogTab);
            }
            vm.showNoResultsMsg = allCatalogApps.length === 0;
            vm.showCatalogTooltip = (!hznLocalStorage.catalogToolTip || false) && UserAgent.isAWJadeMobile() && !appCenterCtrl.isAWJadeDocked && !vm.showNoResultsMsg;
            vm.getNextPage();
            vm.loading = false;
            EventsService.getEvents().then(function(events) {
                var handledApps = [];
                for (var i = 0; i < events.length; i++) {
                    if (events[i] && events[i].action === 'INSTALL') {
                        if (_.contains(handledApps, events[i].eventData.appId)) {
                            EventsService.deleteEvent(events[i].eventId);
                        } else {
                            handledApps.push(events[i].eventData.appId);
                            var toBeInstalledApp = _.find(allCatalogApps, {'appId': events[i].eventData.appId});
                            toBeInstalledApp.eventId = events[i].eventId;
                            CatalogService.activateApp(toBeInstalledApp, $scope.deviceStatus);
                        }
                    }
                }
            });
        };

        vm.filterByLabel = function(category) {
            vm.currentLabel = category;
            vm.visibleCatalogApps = [];
            vm.loading = true;
            CatalogService.setSelectedCategory(category);
            vm.appCenterContext.selectedCategory = CatalogService.getSelectedCategory();
            loadFirstPageEntitlements(vm.appCenterContext, false, false);
            appCenterCtrl.filterCatalogName = category.name;
            appCenterCtrl.categoryFilterOn = false;
        };

        vm.showAllCategories = function() {
            var labels = CatalogService.getDefaultLabels();
            vm.filterByLabel(labels[0]);
        };

        vm.enrollDevice = function() {
            window.location.href = enrollmentUrl;
        };

        function startLoading() {
            vm.isLoading = true;
        }

        function doneLoading() {
            vm.isLoading = false;
        }

        function hasLaunchableApps(apps) {
            var hasLaunchableApps = false;
            var launchableAppTypes = ["VIRTUAL", "WEB"];
            var launchableNativeAppSubTypes = ["THINAPP", "APPV"];
            for (var i = 0; i < apps.length; i++) {
                if (launchableAppTypes.indexOf(apps[i].type) > -1
                    || (apps[i].type === 'NATIVE' && launchableNativeAppSubTypes.indexOf(apps[i].subType) > -1)
                    || apps[i].subType === 'PASSWORDVAULT' || apps[i].subType === 'ANYAPP') {
                    hasLaunchableApps = true;
                    break;
                }
            }
            return hasLaunchableApps;
        }

        var updateBookmarkStatus = function(app) {
            for (var i in vm.visibleCatalogApps) {
                if (vm.visibleCatalogApps[i].appId === app.appId) {
                    vm.visibleCatalogApps[i].favorite = app.favorite;
                    vm.visibleCatalogApps[i].bookmarking = app.bookmarking;
                    break;
                }
            }
            appCenterCtrl.visibleCatalogApps = vm.visibleCatalogApps;
        };

        var updateAppStatus = function(app, status, appStateReason) {
            for (var i in vm.visibleCatalogApps) {
                if (vm.visibleCatalogApps[i].appId === app.appId) {
                    vm.visibleCatalogApps[i].installStatus = status;
                    vm.visibleCatalogApps[i].statusCode = CatalogService.getAppStatusCode(status);
                    if (appStateReason) {
                        vm.visibleCatalogApps[i].appStateReason = appStateReason;
                    }
                    break;
                }
            }
            appCenterCtrl.visibleCatalogApps = vm.visibleCatalogApps;
        };

        $scope.$on('open-modal-dialog', function(event, args) {
            var template = args.dialogtemplate;
            $scope.$modal.open(template, $scope, {params: args.dialogparams});
        });

        $scope.$on('app-bookmarked-from-search', function(event, app) {
            updateBookmarkStatus(app);
        });

        $scope.$on('app-status-change', function(event, args) {
            if (args.app.type === 'NATIVE' && UtilService.isWindowsNativeBridge()) {
                return;
            }
            updateAppStatus(args.app, args.status);
        });

        $scope.$on('app-request-status-change', function(event, args) {
            updateAppStatus(args.app, args.status, args.appStateReason);
        });

        $scope.$on('app-bookmarked', function(event, app) {
            updateBookmarkStatus(app);
        });

        $scope.$on('app-unbookmarked-from-search', function(event, app) {
            updateBookmarkStatus(app);
        });

        vm.clearCache = function() {
            loadingUnCachedEntitlements = true;
            HttpProxyService.clearAll();
            return loadFirstPageEntitlements(vm.appCenterContext, true, true).then(function() {
                return BootstrapService.init();
            });
        };

        $scope.$on('Desktop-Catalog-Refresh', function() {
            vm.clearCache();
        });

        vm.toggleSelectAllRecommendedApps = function() {
            vm.selectAllRecommendedApps = !vm.selectAllRecommendedApps;
            _.each(allCatalogApps, function(currentApp) {
                currentApp.isSelected = vm.selectAllRecommendedApps;
            });
            vm.recommendedAppsCount = _.where(allCatalogApps, { isSelected: true}).length;
        };

        vm.recommendedAppsStatusChanged = function() {
            vm.selectAllRecommendedApps = false;
            vm.recommendedAppsCount = _.where(allCatalogApps, { isSelected: true}).length;
            if (vm.recommendedAppsCount == allCatalogApps.length) {
                vm.selectAllRecommendedApps = true;
            }
        };

        function continueBulkInstall() {
            var acceptedApps = _.where(allCatalogApps, { isSelected: true});
            var rejectedApps = _.where(allCatalogApps, { isSelected: false});
            var acceptedIds = _.pluck(acceptedApps, 'appId');
            var rejectedIds = _.pluck(rejectedApps, 'appId');
            ProgressIndicatorService.showProgressIndicator();
            CatalogService.bulkInstall(acceptedIds, rejectedIds).then(function(resp) {
                ProgressIndicatorService.hideProgressIndicator();
                continueToCatalog();
            }, function(error) {
                ProgressIndicatorService.hideProgressIndicator();
                $notify.error('installStatus.installFailedMessage');
            });
        }

        vm.bulkInstall = function() {
            if (vm.recommendedAppsCount > 0) {
                if (UserAgent.isIOS()) {
                    ModalService.getCurrentModal().open('app-v2/catalog/recommendedAppInstallModal.html', {
                        title: $filter('i18n')('recommendedApps.install.title'),
                        message: $filter('i18n')('recommendedApps.install.confirm.msg'),
                        ok: $filter('i18n')('recommendedApps.install.proceed')
                    }).then(function() {
                        continueBulkInstall();
                    });
                } else if (UserAgent.isAndroid()) { // For Android
                    var dependentAppNames = [];
                    var vpnAppId;
                    var acceptedApps = _.where(allCatalogApps, { isSelected: true});
                    // Find out if there are any apps that need Tunnel.
                    // And save the tunnel appid and the dependent app names.
                    for (var i = 0; i < acceptedApps.length; i++) {
                        var currentApp = acceptedApps[i];
                        if (currentApp.hasOwnProperty('vpnAppId')) {
                            vpnAppId = currentApp.vpnAppId;
                            dependentAppNames.push(currentApp.name);
                        }
                    }
                    // If the the tunnel is needed, then check if the tunnel app is
                    // part of the selected recommended apps list.
                    var selectedTunnelApp;
                    if (vpnAppId) {
                        selectedTunnelApp = _.find(allCatalogApps, function(app) {
                            return app.appId === vpnAppId;
                        });
                    }
                    // If tunnel is needed and if it is not part of the selected list
                    // Show a value prop screen to the user.
                    // Once user click continue on value prop screen
                    // backend will issue a install command for tunnel app.
                    if (!selectedTunnelApp) {
                        ModalService.getCurrentModal().open("app-v2/common/recommendedAppsTunnelModal.html",
                            { modal: ModalService.getCurrentModal(), appNames: dependentAppNames }
                        ).then(function() {
                            continueBulkInstall();
                        });
                    } else {
                        continueBulkInstall();
                    }
                } else {
                    continueBulkInstall();
                }
            }
        };

        vm.skipInstallRecommendedApps = function() {
            var acceptedIds = [];
            var rejectedIds = _.pluck(allCatalogApps, 'appId');
            ProgressIndicatorService.showProgressIndicator();
            CatalogService.bulkInstall(acceptedIds, rejectedIds).then(function(resp) {
                ProgressIndicatorService.hideProgressIndicator();
                continueToCatalog();
            }, function(error) {
                ProgressIndicatorService.hideProgressIndicator();
                continueToCatalog();
            });
        };

        init();
        loadFirstPageOnLoad();
	}]);
})(angular.module("com.vmware.greenbox.appCenter"));
