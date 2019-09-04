(function(module) {
    'use strict';

    var platformNames = {
        IOS: 'iOS',
        ANDROID: 'Android',
        WINDOWS: 'Windows',
        MAC: 'OS X',
        none: 'Unknown'
    };

    module.controller('CatalogItemController', [
        '$scope',
        'CatalogService',
        'OfflineService',
        'UserAgent',
        'INSTALL_STATUS',
        '$window',
        '$filter',
        '$sce',
        '$element',
        '$timeout',
        'AppLaunchService',
        'BookmarksService',
        'BootstrapService',
        'SearchService',
    function($scope,
             CatalogService,
             OfflineService,
             UserAgent,
             INSTALL_STATUS,
             $window,
             $filter,
             $sce,
             $element,
             $timeout,
             AppLaunchService,
             BookmarksService,
             BootstrapService,
             SearchService) {
        var catalogItemViewModel = this;
        var catalogApp = catalogItemViewModel.app;

        //Defaulting the status if a status has not being passed. Need to decide on if string is passed or enumeration.
        var appStatus = catalogApp.installStatus;

        if (appStatus === "" || appStatus === undefined) {
            appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
        } else if (!catalogApp.visible) {
            appStatus = 'HIDDEN';
        } else if (CatalogService.isStatusRequest(catalogApp)) {
            appStatus = 'REQUEST';
        }

        appStatus = CatalogService.getNativeAppStatus(catalogApp.appId) || appStatus;

        $scope.$on('native-app-status-change', function(event, args) {
            if (args.nativeAppMap[catalogApp.appId]) {
                appStatus = args.nativeAppMap[catalogApp.appId];
                catalogApp.installStatus = args.nativeAppMap[catalogApp.appId];
                catalogApp.statusCode = CatalogService.getAppStatusCode(appStatus);
                $scope.$apply();
            }
        });

        var getIconUrl = function(app) {
            return app._links.icon != undefined ? app._links.icon.href : '';
        };
        var getInstallUrl = function(app) {
            return app._links.install.href;
        };

        catalogApp.statusCode = CatalogService.getAppStatusCode(appStatus);
        catalogApp.isLaunchableApp = CatalogService.isLaunchableApp(catalogApp);
        catalogApp.isMdmApp = CatalogService.isMdmApp(catalogApp.type, catalogApp.subType);
        catalogApp.isWebApp = CatalogService.isWebApp(catalogApp.type);
        catalogApp.isThinApp = CatalogService.isThinApp(catalogApp);
        catalogApp.isThinAppPackage = CatalogService.isThinAppPackage(catalogApp);
        catalogApp.isLaunchableThinapp = CatalogService.isLaunchableThinapp(catalogApp);
        catalogApp.isBookmarkableApp = CatalogService.isBookmarkableApp(catalogApp);
        catalogApp.isViewableThinappPackage = CatalogService.isViewableThinappPackage(catalogApp);
        catalogApp.isTunnelRequired = CatalogService.isTunnelRequired(catalogApp);

        catalogItemViewModel.directEnrollmentEnabled = BootstrapService.getDirectEnrollmentStatus();
        //Enable by default when page is loaded.
        catalogApp.isSelected = catalogItemViewModel.directEnrollmentEnabled;

        if (parseInt(catalogApp.statusCode) === 2 && catalogApp.isMdmApp) {
            var startPolling = function(userTimer) {
                CatalogService.pollForChangeStatus(catalogApp, userTimer).then(function(appDetails) {
                    if (catalogApp.approvalRequiredForMdmApp) {
                        catalogApp.appStateReason = appDetails.data.appStateReason;
                    }
                    catalogApp.statusCode = CatalogService.getAppStatusCode(appDetails.data.installStatus);
                    if (appDetails.data.approvalRequiredForMdmApp && appDetails.data.installStatus === 'PROCESSING'
                        && !appDetails.data.appStateReason) {
                        startPolling(true);
                    }
                });
            };

            startPolling(false);
        }
        catalogApp.launch = catalogApp._links.launch != undefined ? catalogApp._links.launch.href : "";
        catalogApp.installUrl = getInstallUrl(catalogApp);
        var iconUrl = getIconUrl(catalogApp);
        catalogApp.backgroundImage = iconUrl || 'none';
        CatalogService.populateTypeNameAndPlatformName(catalogApp);
        CatalogService.populateDisplayValForAppType(catalogApp);

        function goTodetails(appId) {
            location.hash = '#/catalog/details/' + encodeURIComponent(appId);
            if (catalogItemViewModel.modal) {
                catalogItemViewModel.modal.close();
            }
            SearchService.clearSearchQueryAndResults();
        }

        function toggleSelectStatus() {
            catalogApp.isSelected = !catalogApp.isSelected;
            catalogItemViewModel.onSelectRecommendedApp();
        }

        catalogItemViewModel.itemClicked = function(appId) {
            if (catalogItemViewModel.directEnrollmentEnabled) {
                toggleSelectStatus();
            } else {
                goTodetails(appId);
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
