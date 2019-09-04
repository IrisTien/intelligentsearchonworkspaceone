(function(module) {
    'use strict';
    module.service('StateResolveService', ['hznLocalStorage', '$location', 'BootstrapService', 'TenantCustomizationService', 'UtilService',
        function(hznLocalStorage, $location, BootstrapService, TenantCustomizationService, UtilService) {
            var service = this;

            service.canNavigate = function($state) {
                if ($state.current.name !== 'index') {
                    var customizationSettings = TenantCustomizationService.getCustomizationSettings();
                    if (customizationSettings.hideBookmarksTab && $state.next.name === 'bookmarks') {
                        return false;
                    } else if (customizationSettings.hideCatalogTab && $state.next.name === 'catalog') {
                        return false;
                    } else if (customizationSettings.hidePeopleTab && $state.next.name === 'people') {
                        return false;
                    } else if (!customizationSettings.hideBookmarksTab && !customizationSettings.hideCatalogTab && $state.next.name === 'bookmarks' && workspaceOne.hasLaunchableApps === false) {
                        return false;
                    }
                }
                return true;
            };

            service.canHubNavigate = function($state) {
                if ($state.current.name !== 'index') {
                    var customizationSettings = TenantCustomizationService.getCustomizationSettings();
                    if (customizationSettings.hidePeopleTab && $state.next.name === 'people') {
                        return false;
                    }
                }
                return true;
            };

            service.navigateToLastVisitedPage = function() {
                var lastActive = hznLocalStorage.last_active_page_v2;
                var directEnrollmentEnabled = BootstrapService.getDirectEnrollmentStatus();
                var customizationSettings = TenantCustomizationService.getCustomizationSettings();

                function navigateToCatalog() {
                    var deviceWentThroughAdaptiveManagement = BootstrapService.hasInstallEvents();
                    var noBookmarkedApps = BootstrapService.getBookmarkedAppsCount() === 0;

                    return (workspaceOne && workspaceOne.hasLaunchableApps === false) || lastActive === 'catalog' || customizationSettings.hideBookmarksTab || deviceWentThroughAdaptiveManagement || noBookmarkedApps;
                }

                function navigateToBookmark() {
                    return customizationSettings.hideCatalogTab && customizationSettings.hidePeopleTab;
                }

                function navigateToPeople() {
                    return !customizationSettings.hidePeopleTab && lastActive === 'people';
                }

                if (directEnrollmentEnabled) {
                    $location.path('/recommendedApps');
                } else if (navigateToBookmark()) {
                    $location.path('/bookmarks');
                //if nativenavNotEnabled WS1 will call /people directly instead of /index
                //this loop will only get called when checkNativeNavNotEnabled is true
                } else if (navigateToPeople() && UtilService.isNativeNavNotEnabled(customizationSettings)) {
                    $location.path('/people');
                } else if (navigateToCatalog()) {
                    $location.path('/catalog');
                } else {
                    $location.path('/bookmarks');
                }
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
