(function(module) {
    'use strict';
    module.controller('BookmarkItemContextDialogController', [
                        '$scope',
                        '$timeout',
                        '$filter',
                        'BookmarksService',
                        'OfflineService',
                        'UserAgent',
                        '$window',
                        '$sce',
                        '$location',
                        '$state',
                        '$notify',
                        'JadeV1Scheme',
                        'JadeV2Scheme',
                        'CatalogService',
                        'SearchService',
                        'UpdateUrlParamsService',
                        '$rootScope',
                        'UtilService',
                        'ModalService',
                        function($scope,
                                 $timeout,
                                 $filter,
                                 BookmarksService,
                                 OfflineService,
                                 UserAgent,
                                 $window,
                                 $sce,
                                 $location,
                                 $state,
                                 $notify,
                                 JadeV1Scheme,
                                 JadeV2Scheme,
                                 CatalogService,
                                 SearchService,
                                 UpdateUrlParamsService,
                                 $rootScope,
                                 UtilService,
                                 ModalService) {
            var vm = this;
            vm.isIOS = UserAgent.isIOS();
            var appDetails = $scope.appDetails;
            if (appDetails) {
                vm.hasAppRequirements = appDetails.subType === 'THINAPP' || appDetails.subType === 'XENAPP' || appDetails.subType === 'XENAPPDELIVERYGROUP' || appDetails.subType === 'VIEWPOOL' || appDetails.subType === 'VIEWAPP' || appDetails.subType === 'DESKTONEDESKTOP' || appDetails.subType === 'DESKTONEAPPLICATION';

                var descriptionText = htmlToPlaintext(appDetails.description);
                if (appDetails.description && descriptionText && descriptionText !== "") {
                    vm.appDescription = descriptionText;
                } else {
                    vm.appDescription = $filter('i18n')('app.details.label.noDescription');
                }
                angular.extend(appDetails._links, $scope.app._links);
                angular.extend($scope.app, appDetails);
            }

            function htmlToPlaintext(text) {
                return text ? String(text).replace(/<[^>]+>/gm, '') : '';
            }

            vm.hideApp = function(app, apps, index, $event) {
                var successHandler = function(returnData) {
                    $scope.unbBookmarkApp(app);
                };
                BookmarksService.toggleBookmark(app, false, successHandler);
            };

            //Hub specific functions
            vm.isBookmarkableApp = function(app) {
                return CatalogService.isBookmarkableApp(app);
            };

            // Do the same as the CatalogItemActionsDirective does here
            vm.hubToggleFavoriteApp = function(app, apps, index, $event) {
                if ($event) {
                    $event.preventDefault();
                }

                if (app.bookmarking) {
                    return;
                }
                //broadcast to update apps.js controller
                var handler = function(result) {
                    app = result;
                    if (app.favorite) {
                        $notify.success('app.details.label.addedFavorites');
                    }
                    $rootScope.$broadcast('app-bookmarked', app);
                };

                CatalogService.activateAndBookmarkApp(app, false, handler);
            };

            vm.appDetails = function(app) {
                location.hash = '#/bookmarks/details/' + encodeURIComponent(app.appId);
                SearchService.clearSearchQueryAndResults();
            };

            // Hub specific functions
            vm.hubAppDetails = function(app) {
                // close the modal if one exists
                var modal = ModalService.getCurrentModal();
                if (modal) {
                    modal.close(true);
                }
                location.hash = '#/apps/details/' + encodeURIComponent(app.appId) + '?nativenav=Hide';
                SearchService.clearSearchQueryAndResults();
            };

            var viewDownloadLink = $filter('i18n')('viewDownloadUrl');
            if (UserAgent.isIOS()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlIOS');
            } else if (UserAgent.isAndroid()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlAndroid');
            }
            var xenreceiverDownloadLink = $filter('i18n')('citrixReceiverDownloadUrl');
            if (UserAgent.isAWJadeV2()) {
                if (UserAgent.isWindows()) {
                    viewDownloadLink = JadeV2Scheme.APP_LAUNCH + "&uri=" + viewDownloadLink;
                    xenreceiverDownloadLink = JadeV2Scheme.APP_LAUNCH + "&uri=" + xenreceiverDownloadLink;
                } else {
                    viewDownloadLink = JadeV2Scheme.APP_LAUNCH + "&url=" + viewDownloadLink;
                    xenreceiverDownloadLink = JadeV2Scheme.APP_LAUNCH + "&url=" + xenreceiverDownloadLink;
                }
            }

            // TODO can this part isIE8OrLower to be removed??
            if (UserAgent.isIE8OrLower()) {
                vm.xenAppTooltip = $filter('i18n')('app.details.xenapp.msg.IE8OrLower');
                vm.xenAppDeliveryGroupTooltip = $filter('i18n')('app.details.xenappsDeliveryGroup.requirement');
            } else {
                vm.xenAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.xenapp.requirement', "<a target='_blank' href='" + xenreceiverDownloadLink + "'>", "</a>"));
                vm.xenAppDeliveryGroupTooltip = $sce.trustAsHtml($filter('i18n')('app.details.xenappsDeliveryGroup.requirement', "<a target='_blank' href='" + xenreceiverDownloadLink + "'>", "</a>"));
            }
            vm.viewDesktopTooltip = $sce.trustAsHtml($filter('i18n')('app.details.viewDesktop.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.viewAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.viewapp.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.desktoneTooltip = $sce.trustAsHtml($filter('i18n')('app.details.desktoneDesktop.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
            vm.daasAppTooltip = $sce.trustAsHtml($filter('i18n')('app.details.desktoneApp.requirement', "<a target='_blank' href='" + viewDownloadLink + "'>", "</a>"));
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));

