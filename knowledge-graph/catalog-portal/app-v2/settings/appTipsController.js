(function(module) {
    'use strict';

    module.controller('AppTipsController', [
        '$scope',
        '$sce',
        '$filter',
        '$parse',
        '$compile',
        '$templateRequest',
        'UserAgent', '$q',
        function($scope,
                  $sce,
                  $filter,
                  $parse,
                  $compile,
                  $templateRequest,
                  UserAgent, $q) {
            var vm = this;

            var tipsTemplates = {
                tipsOpen: 'app-v2/svgincludes/tips-open.html',
                tipsBookmark: 'app-v2/svgincludes/tips-bookmark.html',
                tipsInstall: 'app-v2/svgincludes/tips-install.html',
                tipsMdm: 'app-v2/svgincludes/tips-mdm.html',
                tipsPeople: 'app-v2/svgincludes/tips-people.html',
                tipsNotification: 'app-v2/svgincludes/tips-bell.html'
            };

            // Store the svg values to an object
            var newSvgArray = {};
            var appCenterCtrl = $scope.appCenterCtrl;

            $scope.getSvgValues = function() {
                var deferred = $q.defer();
                angular.forEach(tipsTemplates, function(name, key) {
                    var label = key;
                    $templateRequest(name).then(function(template) {
                        newSvgArray[label] = template;
                        deferred.resolve(newSvgArray);
                    }, function() {
                        // An error has occurred
                    });
                });

                return deferred.promise;
            };

            $scope.getSvgValues().then(function(svgValue) {
                vm.tipsDesktopCatalogText1 = $sce.trustAsHtml($filter('i18n')('userInfo.tips.catalog.desktop1', svgValue.tipsBookmark));

                vm.tipsDesktopCatalogMobileText1 = $sce.trustAsHtml($filter('i18n')('userInfo.tips.catalog.mobile1', svgValue.tipsOpen, svgValue.tipsBookmark));
                vm.tipsDesktopCatalogMobileText2 = $sce.trustAsHtml($filter('i18n')('userInfo.tips.catalog.mobile2', svgValue.tipsInstall, svgValue.tipsMdm));
                vm.tipsDesktopCatalogMobileText3 = $sce.trustAsHtml($filter('i18n')('userInfo.tips.catalog.mobile3'));
                vm.tipsDesktopPeopleMobileText1 = $sce.trustAsHtml($filter('i18n')('userInfo.tips.people.mobile', svgValue.tipsPeople));
                vm.tipsDesktopNotificationMobileText1 = $sce.trustAsHtml($filter('i18n')('userInfo.tips.notification.mobile', svgValue.tipsNotification));

                var mobileBookmarkMessage = $sce.trustAsHtml($filter('i18n')('userInfo.tips.bookmarks.mobile'));
                var mobileCatalogActionsMessage = $sce.trustAsHtml($filter('i18n')('userInfo.tips.catalog.bookmark.launch.phone', svgValue.tipsOpen, svgValue.tipsBookmark));
                var mobileCatalogInstallMessage = $sce.trustAsHtml($filter('i18n')('userInfo.tips.catalog.download.phone', svgValue.tipsInstall, svgValue.tipsMdm));
                var mobilePeopleMessage = $sce.trustAsHtml($filter('i18n')('userInfo.tips.people.mobile', svgValue.tipsPeople));
                var mobileNotificationMessage = $sce.trustAsHtml($filter('i18n')('userInfo.tips.notification.mobile', svgValue.tipsNotification));

                $scope.carouselPhoneImages = [
                    {"svglink": "app-v2/svgincludes/tips-bookmarks-phone.html", "header": "userInfo.tips.bookmarks", "message": mobileBookmarkMessage},
                    {"svglink": "app-v2/svgincludes/tips-catalog-actions-phone.html", "header": "userInfo.tips.catalog", "message": mobileCatalogActionsMessage},
                    {"svglink": "app-v2/svgincludes/tips-catalog-install-phone.html", "header": "userInfo.tips.catalog", "message": mobileCatalogInstallMessage},
                    {"svglink": "app-v2/svgincludes/tips-people-phone.html", "header": "userInfo.tips.people", "message": mobilePeopleMessage},
                    {"svglink": "app-v2/svgincludes/tips-notification-phone.html", "header": "userInfo.tips.notification", "message": mobileNotificationMessage}];

                $scope.carouselTabletImages = [
                    {"svglink": "app-v2/svgincludes/tips-bookmarks-tablet.html", "header": "userInfo.tips.bookmarks", "message": mobileBookmarkMessage},
                    {"svglink": "app-v2/svgincludes/tips-catalog-actions-tablet.html", "header": "userInfo.tips.catalog", "message": mobileCatalogActionsMessage},
                    {"svglink": "app-v2/svgincludes/tips-catalog-install-tablet.html", "header": "userInfo.tips.catalog", "message": mobileCatalogInstallMessage},
                    {"svglink": "app-v2/svgincludes/tips-people-tablet.html", "header": "userInfo.tips.people", "message": mobilePeopleMessage},
                    {"svglink": "app-v2/svgincludes/tips-notification-tablet.html", "header": "userInfo.tips.notification", "message": mobileNotificationMessage}];

                vm.device = '';

                if (UserAgent.isDesktopBrowser()) {
                    vm.device = 'desktop';
                }

                if (UserAgent.isTablet() && UserAgent.isBrowser() || UserAgent.isWindowsTabletBrowser()) {
                    vm.device = 'tablet-browser';
                }

                //Since reordering will appear for the windows tablet browser so we need a new condition
                if (UserAgent.isTablet() && UserAgent.isBrowser()) {
                    vm.device = 'non-windows-tablet-browser';
                }

                if (UserAgent.isPhone() || UserAgent.isAnyWindowsPhone()) {
                    vm.device = 'phone';
                    if (appCenterCtrl.mdmOnlyWS1) {
                        //remove bookmarks tips in MDM only mode
                        _.remove($scope.carouselPhoneImages, function(appTip) {
                            return appTip.message === mobileBookmarkMessage;
                        });
                    }

                    if (!appCenterCtrl.showPeopleTab) {
                        //remove people tips in if the feature flag or the tab does not exist
                        _.remove($scope.carouselPhoneImages, function(appTip) {
                            return appTip.message === mobilePeopleMessage;
                        });
                    }

                    if (!appCenterCtrl.inAppNotificationEnabled) {
                        //remove notification tips in if the feature flag or the tab does not exist
                        _.remove($scope.carouselPhoneImages, function(appTip) {
                            return appTip.message === mobileNotificationMessage;
                        });
                    }
                }

                if ((UserAgent.isTablet() && !UserAgent.isBrowser()) || UserAgent.isWindowsTabletJade()) {
                    vm.device = 'tablet';
                    if (appCenterCtrl.mdmOnlyWS1) {
                        //remove bookmarks tips in MDM only mode
                        _.remove($scope.carouselTabletImages, function(appTip) {
                            return appTip.message === mobileBookmarkMessage;
                        });
                    }

                    if (!appCenterCtrl.showPeopleTab) {
                        //remove people tips in if the feature flag or the tab does not exist
                        _.remove($scope.carouselTabletImages, function(appTip) {
                            return appTip.message === mobilePeopleMessage;
                        });
                    }

                    if (!appCenterCtrl.inAppNotificationEnabled) {
                        //remove notification tips in if the feature flag or the tab does not exist
                        _.remove($scope.carouselTabletImages, function(appTip) {
                            return appTip.message === mobileNotificationMessage;
                        });
                    }
                }
            });
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
