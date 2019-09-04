(function(module) {
    'use strict';
    module.controller('ThinappsInPackageController', [
        '$scope',
        '$notify',
        '$filter',
        'ModalService',
        'CatalogService',
        'OfflineService',
        'ProgressIndicatorService',
        'UtilService',
        'TenantCustomizationService',
        '$rootScope',
        function($scope,
                  $notify,
                  $filter,
                  ModalService,
                  CatalogService,
                  OfflineService,
                  ProgressIndicatorService,
                  UtilService,
                  TenantCustomizationService,
                  $rootScope) {
            var vm = this;
            vm.app = $scope.app;
            vm.visibleCatalogApps = [];
            vm.searchString = '';
            vm.emptyCatalogModalFillers = [1, 2, 3, 4];
            vm.instruction = $filter('i18n')('app.thinappsInPackage.action.instruction');
            vm.customizationLoadFromDbFailed = TenantCustomizationService.isLoadFromDbFailed();
            vm.favoritesEnabled = !vm.customizationLoadFromDbFailed;
            var isHubApp = UtilService.isHub();

            ProgressIndicatorService.showProgressIndicator();
            CatalogService.getAppsInThinappPackage(vm.app).then(function(entitlementsResponse) {
                vm.visibleCatalogApps = entitlementsResponse.data._embedded.entitlements;
                ProgressIndicatorService.hideProgressIndicator();
            });

            vm.clearSearch = function() {
                vm.searchString = '';
            };

            vm.bookmarkAll = function() {
                var deviceOnline = OfflineService.isDeviceOnline();

                if (deviceOnline) {
                    var markAllAppsInPackageBookmarking = function(val) {
                        angular.forEach(vm.visibleCatalogApps, function(app) {
                            app.bookmarking = val;
                        });
                    };
                    var setFavStatusForAllAppsInPackage = function(val) {
                        angular.forEach(vm.visibleCatalogApps, function(app) {
                            app.favorite = val;
                            if (isHubApp) {
                                $rootScope.$broadcast('app-bookmarked', app);
                                $notify.success('app.details.label.addedFavorites');
                            }
                        });
                    };
                    markAllAppsInPackageBookmarking(true);
                    CatalogService.bookmarkAllAppsInThinappPackage(vm.app).then(function() {
                        setFavStatusForAllAppsInPackage(true);
                        markAllAppsInPackageBookmarking(false);
                    }, function(error) {
                        markAllAppsInPackageBookmarking(false);
                        if (error.handled) { //When system is under maintenance
                            return;
                        }
                        $notify.error('error.failToFavoriteApp');
                    });
                } else {
                    $notify.warning('favoriteStatus.offlineFavoriteMessage');
                }
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));

angular.module('com.vmware.greenbox.appCenter').filter('searchThinappPackageFor', function() {
    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString) {
        if (!searchString || searchString.trim() === '') {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item) {
            if (item.name.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });

        return result;
    };
});
