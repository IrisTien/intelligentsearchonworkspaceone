(function(module) {
    'use strict';
    module.controller('BookmarksItemController', ['$scope',
        'BookmarksService',
        '$log',
        '$sce',
        'OfflineService',
        'Localization',
        'UserAgent',
        'AppLaunchService',
        '$element',
        '$attrs',
        '$window',
        '$filter',
        'VirtualAppLaunchService',
        'HorizonResourcesLaunchService',
        'DetailsService',
        '$timeout',
        'CatalogService',
        'UtilService',
        function($scope,
                 BookmarksService,
                 $log,
                 $sce,
                 OfflineService,
                 Localization,
                 UserAgent,
                 AppLaunchService,
                 $element,
                 $attrs,
                 $window,
                 $filter,
                 VirtualAppLaunchService,
                 HorizonResourcesLaunchService,
                 DetailsService,
                 $timeout,
                 CatalogService,
                 UtilService) {
            var vm = this;
            vm.app = vm.app ? vm.app : $scope.app;
            var app = vm.app || $scope.app;
            vm.app.launching = false;
            vm.isAWJade = UserAgent.isAWJade();
            vm.isHorizon = UserAgent.isHorizon();
            var isHubApp = UtilService.isHub();

            var editMode = $attrs.currentview === "FAVORITES_EDIT";

            // For hub browser load different template, and also load the different template for favorites edit mode
            if (UserAgent.isAWJadeMobile()) {
                this.templateUrl = 'appItem.html';
            } else {
                this.templateUrl = editMode ? 'appItemFavoriteEdit.html' : 'appItemBrowser.html';
            }

            if (app.type === 'VIRTUAL') {
                app.badge = 'virtual-app';
            }
            app.icon = app._links.icon.href;
            app.launch = app._links.launch !== undefined ? app._links.launch.href : "";
            app.disabledThinApps = UserAgent.isThinAppSortSupportedBrowser() && !UserAgent.isWindowsBrowser() && app.subType === 'THINAPP';
            app.isMdmApp = CatalogService.isMdmApp(app.type, app.subType);
            app.resetAllowed = _.get(app, 'optionalAppInfo.resetAllowed', false);

            if (app.subType === 'VIEWPOOL' || app.subType === 'VIEWAPP' || app.subType === 'DESKTONEDESKTOP' || app.subType === 'DESKTONEAPPLICATION') {
                app.isViewResource = true;
            }

            vm.openSetAppPasswordDialog = function(app, $event) {
                BookmarksService.openSetAppPasswordDialog(app, $event);
            };
            $scope.openSetAppPasswordDialog = vm.openSetAppPasswordDialog;

            vm.launchApp = function(app, $event) {
                //if its disabled thinApp prevent app opening
                if (app.disabledThinApps) {
                    return;
                }
                //there is cases that app is launched when user says that the launching program are installed in dialog.
                // So we need to check the event here
                if ($event) {
                    $event.preventDefault();
                }

                if (isHubApp) {
                    CatalogService.activateAndLaunchApp(app);
                } else {
                    AppLaunchService.launchApp(app);
                }
            };

            // Hub specific function
            vm.openThinAppPackageModal = function(app, $event) {
                if ($event) {
                    $event.preventDefault();
                }
                CatalogService.activateAndViewThinappPackage(app);
            };

            vm.openWithViewClient = function(app, $event) {
                if ($event) {
                    $event.preventDefault();
                }
                if (!(VirtualAppLaunchService.isViewApp(app) || VirtualAppLaunchService.isDesktoneApp(app))) {
                    return;
                }

                HorizonResourcesLaunchService.launchByViewClient(app);
            };
            vm.openWithBrowser = function(app, $event) {
                if ($event) {
                    $event.preventDefault();
                }
                if (!(VirtualAppLaunchService.isViewApp(app) || VirtualAppLaunchService.isDesktoneApp(app))) {
                    return;
                }
                HorizonResourcesLaunchService.launchByBrowser(app);
            };

            vm.isViewOptionSupported = function(app, clientType) {
                return HorizonResourcesLaunchService.isViewOptionSupported(app, clientType);
            };

            if (vm.isViewOptionSupported(app, "BROWSER")) {
                app.viewBrowserLaunchSupported = true;
            }
            if (vm.isViewOptionSupported(app, "NATIVE")) {
                app.viewClientLaunchSupported = true;
            }

            app.viewClientLaunchEnabled = app.isViewResource && app.viewClientLaunchSupported && !vm.isAWJade && !app.disabledThinApps;
            app.viewBrowserLaunchEnabled = app.isViewResource && app.viewBrowserLaunchSupported && !vm.isAWJade && !app.disabledThinApps;
            app.isViewResourceEnabled = (!app.isViewResource || (app.isViewResource && vm.isAWJade)) && !app.disabledThinApps && !app.isMdmApp;

            // only trigger the long-hold on mobile devices browser view < 540
            // Trigger long-press on standalone apps regardless of screensize

            vm.longPressEnabled = UserAgent.isAWJadeMobile() || (UserAgent.isMobile() && $window.innerWidth < 540);

            function openContextMenu() {
                var bookmarkItem = $element.find('.bookmark-item-actions');
                $timeout(function() {
                    bookmarkItem.trigger('click');
                    angular.element(".bookmark-contextdialog-scrim").off('click');
                }, false);
            }

            // This is onload adding the actionsheet label aka "remove from favorites or add to favorites"
            setActionSheetLabel(vm.app);
            // This is to update
            $scope.$on('app-bookmarked', function(event, app) {
                setActionSheetLabel(app);
            });

            $scope.$on('native-bridge-app-bookmarked', function(event, app) {
                setActionSheetLabel(app);
            });

            function setActionSheetLabel() {
                if (app.favorite && !app.bookmarking) {
                    vm.actionSheetLabel = $filter('i18n')('hub.actionsheet.label.removeFavorites');
                    vm.contextDialogFavoriteLabel = $filter('i18n')('hub.contextDialog.label.removeFavorites');
                } else if (!app.favorite && !app.bookmarking) {
                    vm.actionSheetLabel = $filter('i18n')('hub.actionsheet.label.addFavorites');
                    vm.contextDialogFavoriteLabel = $filter('i18n')('hub.contextDialog.label.addFavorites');
                }
            }

            vm.triggerContextdialog = function() {
                if (!vm.longPressEnabled) {
                    return;
                }
                DetailsService.getAppDetailsResource($scope.app.appId).get().then(function(appDetails) {
                    $scope.appDetails = appDetails;
                    openContextMenu();
                }, function() {
                    openContextMenu();
                });
            };

            vm.resetDesktop = function(app, $event) {
                BookmarksService.performResetDesktop(app, $event);
            };
            $scope.resetDesktop = vm.resetDesktop;
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
