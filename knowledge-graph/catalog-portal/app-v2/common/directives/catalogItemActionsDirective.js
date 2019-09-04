(function(module) {
    'use strict';

    module.directive('catalogItemActions', [
                        '$rootScope',
                        'CatalogService',
                        'BookmarksService',
                        'DetailsService',
                        'TenantCustomizationService',
                        'UtilService',
                        '$notify',
                        'ModalService',
                        '$filter',
                        'NativeBridgeService',
                        'UserAgent',
                        function($rootScope,
                                 CatalogService,
                                 BookmarksService,
                                 DetailsService,
                                 TenantCustomizationService,
                                 UtilService,
                                 $notify,
                                 ModalService,
                                 $filter,
                                 NativeBridgeService,
                                 UserAgent) {
        function postLink(scope, element, attrs) {
        }

        function controller() {
            var catalogItemActionsCtrl = this;

            var customizationSettings = TenantCustomizationService.getCustomizationSettings();
            catalogItemActionsCtrl.hideBookmarksTab = customizationSettings.hideBookmarksTab;
            catalogItemActionsCtrl.hideCatalogTab = customizationSettings.hideCatalogTab;
            catalogItemActionsCtrl.isAWJadeMobile = UserAgent.isAWJadeMobile();

            var currentApp = catalogItemActionsCtrl.app;
            var favoriteModuleEnabled = TenantCustomizationService.isHubFavoritesEnabled();

            catalogItemActionsCtrl.favoriteEnabled = favoriteModuleEnabled && CatalogService.isBookmarkableApp(currentApp);

            catalogItemActionsCtrl.activateBookmarking = false;

            $rootScope.$on('native-app-status-change', function(event, args) {
                if (args.nativeAppMap[currentApp.appId]) {
                    currentApp.installStatus = args.nativeAppMap[currentApp.appId];
                    currentApp.statusCode = CatalogService.getAppStatusCode(args.nativeAppMap[currentApp.appId]);
                }
            });

            $rootScope.$on('activate-app-bookmark', function(event, data) {
                if ((currentApp && data) && (currentApp.appId == data.appId)) {
                    catalogItemActionsCtrl.activateBookmarking = true;
                }
            });

            $rootScope.$on('activate-app-bookmark-end', function(event, data) {
                if ((currentApp && data) && (currentApp.appId == data.appId)) {
                    catalogItemActionsCtrl.activateBookmarking = false;
                }
            });

            $rootScope.$on('new-app-notification-bookmark', function(event, data) {
                if ((currentApp && data) && (currentApp.appId == data.appId)) {
                    currentApp.favorite = data.favorite;
                }
            });

            catalogItemActionsCtrl.launchApp = function(app, $event) {
                //there is cases that app is launched when user says that the launching program are installed in dialog.
                // So we need to check the event here
                if ($event) {
                    $event.preventDefault();
                }
                CatalogService.activateAndLaunchApp(app);
            };

            catalogItemActionsCtrl.viewThinAppPackage = function(app, $event) {
                //there is cases that app is launched when user says that the launching program are installed in dialog.
                // So we need to check the event here
                if ($event) {
                    $event.preventDefault();
                }
                CatalogService.activateAndViewThinappPackage(app);
            };

            catalogItemActionsCtrl.toggleBookmark = function(app, $event) {
                //there is cases that app is launched when user says that the launching program are installed in dialog.
                // So we need to check the event here

                if ($event) {
                    $event.preventDefault();
                }

                if (app.bookmarking) {
                    return;
                }
                //broadcast to update parent controller
                var handler = function(result) {
                    app = result;
                    if (UtilService.isHub() && app.favorite) {
                        $notify.success('app.details.label.addedFavorites');
                    }
                    $rootScope.$broadcast('app-bookmarked', app);
                };

                if (catalogItemActionsCtrl.currentView && catalogItemActionsCtrl.currentView === 'SEARCH') {
                    var isAlreadyBookmarked = app.favorite;
                    handler = function(result) {
                        $rootScope.$broadcast('app-bookmarked-from-search', app);
                    };
                    if (isAlreadyBookmarked) {
                        handler = function(result) {
                            $rootScope.$broadcast('app-unbookmarked-from-search', app);
                        };
                    }
                }

                CatalogService.activateAndBookmarkApp(app, false, handler);
            };

            catalogItemActionsCtrl.activateApp = function() {
                if (UtilService.isWindowsNativeBridge() && catalogItemActionsCtrl.app.type === 'NATIVE') {
                    NativeBridgeService.getAppStatus([catalogItemActionsCtrl.app.appId]);
                }
                CatalogService.activateApp(catalogItemActionsCtrl.app, CatalogService.getDeviceStatus());
            };

            catalogItemActionsCtrl.resetDesktop = function(app, $event) {
                BookmarksService.performResetDesktop(app, $event);
            };

            catalogItemActionsCtrl.openSetAppPasswordDialog = function(app, $event) {
                BookmarksService.openSetAppPasswordDialog(app, $event);
            };
            catalogItemActionsCtrl.openSetPVAppPasswordDialog = function(app, $event) {
                DetailsService.openSetPVAppPasswordDialog(app, $event);
            };

            catalogItemActionsCtrl.showInfo = function(app, $event) {
                var isHubDesktop = UtilService.isHubDesktop();
                var message = isHubDesktop ? $filter('i18n')('hub.app.installing.alert.desktop.message', app.name) :
                    $filter('i18n')('hub.app.installing.alert.mobile.message', app.name);
                if ($event) {
                    $event.preventDefault();
                }
                ModalService.getCurrentModal().open('app-v2/components/shared/alertInstallingPrompt.html', {
                    title: $filter('i18n')('appCenter.action.installing'),
                    name: app.name,
                    message: message
                });
            };
        }

        return {
            restrict: 'A',
            replace: true,
            scope: { app: '=', currentView: '=', showFavorite: '=?', appDetailsPage: '=?' },
            templateUrl: function(element, attrs) {
                var template = 'app-v2/common/directives/catalogItemActionsTemplate.html';
                if (attrs.currentView && attrs.currentView === 'APP_DETAILS') {
                    template = 'app-v2/common/directives/catalogItemActionsAppDetailsTemplate.html';
                }
                if (attrs.currentView && attrs.currentView === 'HUB_APP_LIST') {
                    template = 'app-v2/components/appListItem/appListItemAction.html';
                }
                return template;
            },
            controller: controller,
            link: postLink,
            controllerAs: 'catalogItemActionsCtrl',
            bindToController: true
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
