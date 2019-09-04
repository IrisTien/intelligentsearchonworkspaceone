(function(module) {
    'use strict';

    module.controller('SearchController',
        ['CatalogService',
            '$timeout',
            '$scope',
            '$element',
            '$location',
            'DetailsService',
            'SearchService',
            'INSTALL_STATUS',
            'UserAgent',
            'UtilService',
            '$rootScope',
            'TenantCustomizationService',
            'ClientRuntimeService',
    function(CatalogService,
             $timeout,
             $scope,
             $element,
             $location,
             DetailsService,
             SearchService,
             INSTALL_STATUS,
             UserAgent,
             UtilService,
             $rootScope,
             TenantCustomizationService,
             ClientRuntimeService) {
        var vm = this;
        vm.excludeThinApps = !UserAgent.isThinAppSortSupportedBrowser();
        vm.innerControl = vm.control || {};
        vm.loading = false;
        vm.appCount = 0;
        vm.totalAppCount = 0;
        vm.isAWJadeMobile = UserAgent.isAWJadeMobile();
        var isHubApp = UtilService.isHub();

        function init() {
            vm.apps = [];

            vm.query = {
                name: ''
            };

            var searchObj = SearchService.getSearchQueryAndResults();

            vm.query.name = _.get(searchObj, "query", "");
            vm.apps = _.get(searchObj, "result", []);
            vm.appCount = _.get(searchObj, "appCount", 0);
            vm.totalAppCount = _.get(searchObj, "totalAppCount", 0);
        }

        var searchApplications = function(query) {
            return CatalogService.getFirstPage({searchText: query, selectedCategory: {}}, false, vm.excludeThinApps, false, true);
        };

        var getCatalogApps = function(entitlements) {
            var catalogApps = [];
            entitlements.forEach(function(entitlement) {
                var catalogApp = entitlement;

                var appStatus = catalogApp.installStatus;

                if (appStatus === "" || appStatus === undefined) {
                    appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
                } else if (!catalogApp.visible) {
                    appStatus = 'HIDDEN';
                } else if ((catalogApp.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(appStatus) >= 0) || (catalogApp.subType === 'THINAPP' && catalogApp.perDeviceActivationRequired)) {
                    appStatus = 'REQUEST';
                }

                catalogApp.isMdmApp = CatalogService.isMdmApp(catalogApp.type, catalogApp.subType);
                catalogApp.statusCode = CatalogService.getAppStatusCode(appStatus);
                catalogApp.isWebApp = CatalogService.isWebApp(catalogApp.type);
                catalogApp.isLaunchableApp = CatalogService.isLaunchableApp(catalogApp);
                catalogApp.isThinApp = CatalogService.isThinApp(catalogApp);
                catalogApp.isThinAppPackage = CatalogService.isThinAppPackage(catalogApp);
                catalogApp.isLaunchableThinapp = CatalogService.isLaunchableThinapp(catalogApp);
                catalogApp.isBookmarkableApp = CatalogService.isBookmarkableApp(catalogApp);
                catalogApp.isViewableThinappPackage = CatalogService.isViewableThinappPackage(catalogApp);
                catalogApp.launch = catalogApp._links.launch != undefined ? catalogApp._links.launch.href : "";
                CatalogService.populateTypeNameAndPlatformName(catalogApp);
                CatalogService.populateDisplayValForAppType(catalogApp);
                catalogApp.isTunnelRequired = CatalogService.isTunnelRequired(catalogApp);
                catalogApps.push(catalogApp);
            });
            return catalogApps;
        };

        vm.onsearch = function() {
            var query = vm.query.name;
            if (!query.length) {
                vm.clearSearchResults();
                return;
            }
            vm.noResults = false;
            vm.loading = true;
            searchApplications(query).then(function(response) {
                var hideCatalogTab = UtilService.getObjValue(TenantCustomizationService.getCustomizationSettings(), 'hideCatalogTab', false);
                vm.isLoadFromDbFailed = _.get(response, 'loadFromDbFailed', false);
                if (hideCatalogTab) {
                    response.entitlements = [];
                    response.categories = [];
                    vm.apps = [];
                    if (response.bookmarks) {
                        vm.apps = getCatalogApps(response.bookmarks);
                    }
                } else {
                    vm.apps = getCatalogApps(response.entitlements);
                }

                // then categories pushed in the same array to be able to
                // use keyboard shortcuts: up/down arrows
                var categoryApps = [];
                if (isHubApp && !TenantCustomizationService.isHubCategoryEnabled()) {
                    categoryApps = [];
                    vm.appCount = vm.apps.length;
                } else {
                    vm.categories = response.categories.forEach(function(category) {
                        categoryApps.push({
                            isCategory: true,
                            categoryName: category.categoryName,
                            length: category.entitlements.length,
                        });
                        categoryApps = categoryApps.concat(getCatalogApps(category.entitlements));
                    });
                    vm.apps = (categoryApps.length > 0) ? vm.apps.concat(categoryApps) : vm.apps;
                    vm.appCount = vm.apps.length - response.categories.length;
                }
                vm.totalAppCount = response.entitlements.length;
                vm.noResults = vm.apps.length === 0;
                vm.loading = false;
            });

            // for hub browsers, needs to disable scroll on the content-container while search is on
            if (UtilService.isHubBrowsers()) {
                $rootScope.$broadcast('hub-browser-search-on');
            }
        };

        vm.details = function(app) {
            var searchObj = {
                query: vm.query.name,
                result: vm.apps,
                appCount: vm.appCount,
                totalAppCount: vm.totalAppCount
            };
            SearchService.setSearchQueryAndResults(searchObj);
            location.hash = '#' + $location.path() + '/details/' + encodeURIComponent(app.appId);
        };

        $scope.$watch('ctrl.isActive', function(isActive) {
            if (isActive) {
                $element.find('input').focus();
            }
        });

        vm.clearSearchResults = function() {
            vm.apps = [];
            vm.query.name = '';
            vm.appCount = 0;
            vm.totalAppCount = 0;
            // for hub browsers, needs to disable scroll on the content-container
            if (UtilService.isHubBrowsers()) {
                $rootScope.$broadcast('hub-browser-search-off');
            }
        };

        vm.innerControl.clearSearch = function() {
            vm.clearSearchResults();
            $element.find('input').blur();
        };

        vm.scrimClearSearch = function() {
            // In WS1 ios and android mobile app and Samsung DeX non-docked mode, clicking on the scrim DOES NOT dismiss the search results
            // In browser and desktopapp and Samsung DeX including docked mode click on scrim will clear search
            if (UserAgent.isAWJadeMobile() && !UserAgent.isAWJadeDocked()) {
                return;
            }
            vm.clearSearchResults();
        };

        // This clean search is for the x button inside the input field
        vm.xButtonClearSearch = function() {
            vm.clearSearchResults();
        };

        vm.goBack = function() {
            vm.clearSearchResults();
            SearchService.clearSearchQueryAndResults();
            UtilService.goBack();
        };

        init();
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
