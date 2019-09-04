(function(module) {
    'use strict';
    module.controller('BookmarksController', [
        '$scope',
        'BookmarksService',
        '$timeout',
        '$filter',
        'ConfigService',
        'UserAgent',
        'PAGING',
        'CatalogService',
        'SettingsService',
        'BootstrapService',
        'ModalService',
        '$location',
        'hznLocalStorage',
        '$window',
        '$notify',
        'HttpProxyService',
        'TenantCustomizationService',
        function($scope,
                 BookmarksService,
                 $timeout,
                 $filter,
                 ConfigService,
                 UserAgent,
                 PAGING,
                 CatalogService,
                 SettingsService,
                 BootstrapService,
                 ModalService,
                 $location,
                 hznLocalStorage,
                 $window,
                 $notify,
                 HttpProxyService,
                 TenantCustomizationService) {
            hznLocalStorage.last_active_page_v2 = "bookmarks";
            var vm = this;
            var appCenterCtrl = $scope.appCenterCtrl;
            var customOrderVisibleLauncherApps = [];
            var loadingUnCachedEntitlements = false;
            var allLauncherApps = [];
            var index = 0;
            var customizedSettings = TenantCustomizationService.getCustomizationSettings();
            vm.hideCatalogTab = customizedSettings.hideCatalogTab;
            vm.featureFlags = workspaceOne.featureFlags;
            vm.excludeThinApps = !UserAgent.isThinAppSortSupportedBrowser();
            vm.isTouchEnabled = UserAgent.isTouchEnabled();
            vm.sortType = {
                model: 'custom',
                text: $filter('i18n')('appCenter.nav.sortBy.customView'),
                types: [
                    {
                        id: 'asc',
                        text: $filter('i18n')('appCenter.nav.sortBy.alpha')
                    },
                    {
                        id: 'desc',
                        text: $filter('i18n')('appCenter.nav.sortBy.inverseAlpha')
                    },
                    {
                        id: 'custom',
                        text: $filter('i18n')('appCenter.nav.sortBy.customView')
                    }
                ]
            };
            $scope.shouldSuppressLaunchDialog = false;
            var defaultLabels = CatalogService.getDefaultLabels();
            SettingsService.getUserInfo().then(function(user) {
                vm.welcomeMessage = $filter('i18n')('myapps.welcomeMsg', user.firstName);
            });

            var init = function() {
                vm.visibleLauncherApps = [];
                vm.emptyFillers = [1, 2, 3, 4, 5, 6, 7, 8];
                vm.appCategories = [];
                vm.allAppsLabel = defaultLabels[0];
                vm.selectedCategory = BookmarksService.getSelectedCategory();
                vm.filterConfig = { items: vm.appCategories, defaultItem: vm.selectedCategory};
                appCenterCtrl.sortingDisabled = true;

                vm.resetFilter = function() {
                    BookmarksService.setSelectedCategory(vm.allAppsLabel);
                    getFirstPageOfApps();
                };

                $scope.unbBookmarkApp = function(app) {
                    unbBookmarkApp(app);
                };
            };

            vm.showLauncherMessage = function(apps) {
                if (apps) {
                    vm.showNoAppsMsg = !apps.length;
                } else {
                    vm.showNoAppsMsg = !allLauncherApps.length;
                }
                vm.showBookmarksTooltip = !hznLocalStorage.bookmarksToolTip || false;
            };

            vm.closeTooltip = function() {
                vm.showBookmarksTooltip = false;
                hznLocalStorage.bookmarksToolTip = true;
            };

            vm.emptyAddBookmark = function() {
                $location.path('/catalog');
            };

            vm.clearCache = function() {
                loadingUnCachedEntitlements = true;
                HttpProxyService.clearAll();
                return getFirstPageOfApps(true, true)
                    .then(function() {
                        return BootstrapService.init();
                    });
            };

            $scope.$on('Desktop-Bookmarks-Refresh', function() {
                vm.clearCache();
            });

            var getFirstPageOfApps = function(doNotReloadCategories, noCache) {
                index = 0;
                var params = {};
                if (vm.selectedCategory) {
                    params.category = getCategoryName(vm.selectedCategory);
                }
                params.favoriteOnly = true;
                params.excludeThinApps = vm.excludeThinApps;
                loadingUnCachedEntitlements = false;
                // Delay showing spinner till 2 seconds.
                // Do not show loading spinner on pull to refresh
                if (!noCache) {
                    var cancelPromise = $timeout(function() {
                        startLoading();
                    }, 200);
                }

                return BookmarksService.getFirstPage(params, noCache).then(function(data) {
                    $timeout.cancel(cancelPromise);
                    doneLoading();
                    allLauncherApps = data.myapps;
                    vm.visibleLauncherApps = [];
                    vm.bookmarkOrderSet = data.bookmarkOrderSet;
                    vm.getNextPage();
                    vm.showLauncherMessage();

                    if (!doNotReloadCategories) {
                        loadCategories();
                    }
                });
            };

            var loadFirstPageOnLoad = function() {
                BootstrapService.init().then(getFirstPageOfApps);
            };

            var loadCategories = function() {
                var params = {};
                params.excludeThinApps = vm.excludeThinApps;

                BookmarksService.getLauncherCategories(params).then(function(data) {
                    if (data) {
                        vm.appCategories = data;
                        vm.filterConfig.items = defaultLabels.concat(data);
                    } else {
                        vm.filterConfig.items = defaultLabels;
                    }
                });
            };

            vm.getNextPage = function() {
                //stop pagination when pull to refresh in progress
                if (!loadingUnCachedEntitlements) {
                    var endIndex = index + PAGING.PAGE_SIZE;
                    var sortText = $filter('i18n')('appCenter.nav.sortBy.alpha');
                    while (index < endIndex && index < allLauncherApps.length) {
                        vm.visibleLauncherApps.push(allLauncherApps[index]);
                        index++;
                    }
                    //copy it to save the default order
                    customOrderVisibleLauncherApps = _.clone(vm.visibleLauncherApps);
                    //if custom view not set, set the order to asc
                    if (!vm.bookmarkOrderSet) {
                        vm.sortType.model = 'asc';
                        vm.sortType.text = $filter('i18n')('appCenter.nav.sortBy.alpha');
                    }

                    //get previous sort order, if any from local storage
                    if (hznLocalStorage.bookmarkSortType) {
                        vm.sortType.model = hznLocalStorage.bookmarkSortType;
                        sortText = vm.sortType.types.filter(function(type) {
                            return type.id === vm.sortType.model;
                        });
                        if (sortText) {
                            vm.sortType.text = sortText[0] && sortText[0].text;
                        }
                        //sort the apps
                        if (vm.sortType.model !== 'custom' || vm.bookmarkOrderSet) {
                            sortApps();
                        }
                    }
                }
            };

            function startLoading() {
                vm.isLoading = true;
            }

            function doneLoading() {
                vm.isLoading = false;
            }

            function getCategoryName(category) {
                if (category && category.type && category.type === 'all' || !category) {
                    return '';
                } else {
                    return category.name;
                }
            }

            $scope.$on('open-modal-dialog', function(event, app) {
                var template = args.dialogtemplate;
                $scope.$modal.open(template, $scope, {params: args.dialogparams});
            });

            $scope.$on('app-bookmarked-from-search', function(event, app) {
                bookmarkApp(app);
            });

            $scope.$on('app-unbookmarked-from-search', function(event, app) {
                unbBookmarkApp(app);
            });

            function bookmarkApp(app) {
                allLauncherApps.push(app);
                vm.visibleLauncherApps.push(app);
                customOrderVisibleLauncherApps.push(app);
                vm.showLauncherMessage();
                //sort apps based on sort order selected
                sortApps();
            }

            function unbBookmarkApp(app) {
                allLauncherApps = _.reject(allLauncherApps, function(el) {
                    return el.appId === app.appId;
                });
                vm.visibleLauncherApps = _.reject(vm.visibleLauncherApps, function(el) {
                    return el.appId === app.appId;
                });
                customOrderVisibleLauncherApps = _.reject(customOrderVisibleLauncherApps, function(el) {
                    return el.appId === app.appId;
                });
                vm.showLauncherMessage();
                //sort apps based on sort order selected
                sortApps();
            }

            $scope.$on('app-bookmarked', function(event, app) {
                if (app.favorite) {
                    bookmarkApp(app);
                } else {
                    unbBookmarkApp(app);
                }
            });

            init();
            loadFirstPageOnLoad();

            vm.sortableOptions = {
                cursor: "move",
                placeholder: "sort-placeholder",
                forcePlaceholderSize: true,
                delay: 150,
                distance: 15,
                forceHelperSize: true,
                opacity: 0.7,
                revert: 150,
                tolerance: "intersect",
                disabled: true,
                containment: "parent",
                helper: "clone"
            };

            var resetCustomView = function() {
                //if custom view is one set already, use the selected sort order for ordering
                //if desc is selected, it will use desc for custom view
                if (vm.bookmarkOrderSet) {
                    vm.visibleLauncherApps = _.clone(customOrderVisibleLauncherApps);
                }
            };

            var copyForEdit = function() {
                if (!customOrderVisibleLauncherApps.length) {
                    //display all the apps for re-ordering/sorting
                    while (index < allLauncherApps.length) {
                        vm.visibleLauncherApps.push(allLauncherApps[index]);
                        index++;
                    }
                    index = allLauncherApps.length;
                    customOrderVisibleLauncherApps = _.clone(vm.visibleLauncherApps);
                }
            };

            //sort visibleLauncherApps
            var sortApps = function() {
                if (vm.sortType.model === 'asc') {
                    vm.visibleLauncherApps = $filter('orderBy')(vm.visibleLauncherApps, 'name', false);
                } else if (vm.sortType.model === 'desc') {
                    vm.visibleLauncherApps = $filter('orderBy')(vm.visibleLauncherApps, 'name', true);
                } else {
                    resetCustomView();
                }
            };

            vm.changeSortType = function(id, text) {
                vm.sortType.model = id;
                vm.sortType.text = text;
                hznLocalStorage.bookmarkSortType = id;
                //cache original order on first sort order change
                copyForEdit();
                if (vm.sortType.model !== 'custom' || vm.bookmarkOrderSet) {
                    sortApps();
                }
            };

            vm.enableSorting = function() {
                //cache original order
                copyForEdit();
                vm.sortableOptions.disabled = false;
                //to display overlay in header
                appCenterCtrl.sortingDisabled = vm.sortableOptions.disabled;
            };

            vm.cancelSorting = function() {
                vm.savingBookmark = false;
                vm.sortableOptions.disabled = true;
                //to hide overlay in header
                appCenterCtrl.sortingDisabled = vm.sortableOptions.disabled;
                resetCustomView();
            };

            vm.saveCustomView = function() {
                vm.savingBookmark = true;
                BookmarksService.saveCustomView(_.map(vm.visibleLauncherApps, 'appId')).then(function() {
                    HttpProxyService.clearAll();
                    customOrderVisibleLauncherApps = _.clone(vm.visibleLauncherApps);
                    $notify.success('appCenter.nav.arrange.saved');
                    vm.savingBookmark = false;
                    vm.sortableOptions.disabled = true;
                    vm.bookmarkOrderSet = true;
                    appCenterCtrl.sortingDisabled = vm.sortableOptions.disabled;
                }, function() {
                    $notify.error('appCenter.nav.arrange.error');
                    vm.cancelSorting();
                });
            };

            //when re-order is in progress, show warning for saving the data befor
            //navigating to other page
            $scope.$on('$locationChangeStart', function(event, next) {
                if (!vm.sortableOptions.disabled || vm.savingBookmark) {
                    //check if modal already open
                    var modal = angular.element('.modal-container.is-active');
                    if (!modal.length) {
                        ModalService.getCurrentModal().open('app-v2/common/modalDialog/templates/bookmarkWarning.html', {
                            title: $filter('i18n')('app.bookmarking.change.tab.title'),
                            message: $filter('i18n')('app.bookmarking.change.tab.body'),
                            ok: $filter('i18n')('app.bookmarking.change.tab.stay'),
                            cancel: $filter('i18n')('app.bookmarking.change.tab.exit')
                        }).then(function() {
                            vm.sortableOptions.disabled = true;
                            //to hide overlay in header
                            appCenterCtrl.sortingDisabled = vm.sortableOptions.disabled;
                            $window.location = next;
                        });
                    }
                    event.preventDefault();
                }
            });
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
