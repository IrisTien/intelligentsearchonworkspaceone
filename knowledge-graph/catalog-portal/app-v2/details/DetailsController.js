(function(module) {
    'use strict';

    var properties = ['name', 'appType', 'subType', 'installStatus', 'installMessage', 'rating', 'version', 'size', 'type', 'price', 'loadFromDbFailed'];

    var appInstallEndpoint = '/catalog-portal/services/api/activate/';

	module.controller('DetailsController', [
                            '$scope',
                            'DetailsService',
                            'CatalogService',
                            'INSTALL_STATUS',
                            '$filter',
                            '$location',
                            '$sce',
                            'UserAgent',
                            'JadeV1Scheme',
                            'JadeV2Scheme',
                            'ModalService',
                            'BookmarksService',
                            '$state',
                            '$notify',
                            'ClientRuntimeService',
                            'UtilService',
                            'UpdateUrlParamsService',
                            'hznLocalStorage',
                            '$interval',
                            'TenantCustomizationService',
        function($scope,
                  DetailsService,
                  CatalogService,
                  INSTALL_STATUS,
                  $filter,
                  $location,
                  $sce,
                  UserAgent,
                  JadeV1Scheme,
                  JadeV2Scheme,
                  ModalService,
                  BookmarksService,
                  $state,
                  $notify,
                  ClientRuntimeService,
                  UtilService,
                  UpdateUrlParamsService,
                  hznLocalStorage,
                  $interval,
                  TenantCustomizationService) {
            var vm = this,
                appId = $state.params.appId,
                resource = DetailsService.getAppDetailsResource(appId),
                isMdmWebApp = false;

            vm.isHubUiEnabled = UtilService.isHub();
            vm.isAppRatingsEnabled = vm.isHubUiEnabled && TenantCustomizationService.isAppRatingEnabled();
            vm.isHubAppFavoritesEnabled = TenantCustomizationService.isHubFavoritesEnabled() && !TenantCustomizationService.isHubFavoritesOnlyView();
            vm.newAppsTab = $state.current.activeTab === "newApps";
            vm.isHideVirtualAppEnabled = UtilService.hideVirtualApps();

            this.templateUrl = UserAgent.isAWJadeMobile() ? 'details.html' : 'detailsBrowser.html';

            this.isAWJadeDesktop = UserAgent.isAWJadeDesktop();

            startLoading();
            UpdateUrlParamsService.hideNativenav();
            resource.get().then(function(data) {
                appDetails(data);
            });

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

            vm.appId = appId;

            function appDetails(data) {
                var appStatus = data.installStatus;

                if (!appStatus) {
                    appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
                } else if (!data.visible) {
                    appStatus = 'HIDDEN';
                } else if (CatalogService.isStatusRequest(data)) {
                    appStatus = 'REQUEST';
                }

                appStatus = CatalogService.getNativeAppStatus(data.appId) || appStatus;
                $scope.$on('native-app-status-change', function(event, args) {
                    if (args.nativeAppMap[data.appId]) {
                        appStatus = args.nativeAppMap[data.appId];
                        data.installStatus = args.nativeAppMap[data.appId];
                        data.statusCode = CatalogService.getAppStatusCode(appStatus);
                        $scope.$apply();
                    }
                });

                data.statusCode = CatalogService.getAppStatusCode(appStatus);
                data.isWebApp = CatalogService.isWebApp(data.type);
                data.isMdmApp = CatalogService.isMdmApp(data.type, data.subType);
                data.isLaunchableApp = CatalogService.isLaunchableApp(data);
                data.isPasswordVaultApp = CatalogService.isPasswordVaultApp(data.type, data.subType);
                data.isThinApp = CatalogService.isThinApp(data);
                data.isThinAppPackage = CatalogService.isThinAppPackage(data);
                data.isLaunchableThinapp = CatalogService.isLaunchableThinapp(data);
                data.isBookmarkableApp = CatalogService.isBookmarkableApp(data);
                data.isViewableThinappPackage = CatalogService.isViewableThinappPackage(data);
                data.isTunnelRequired = CatalogService.isTunnelRequired(data);
                data.isWorkspaceServiceRequired = data.isMdmApp && data.mgmtRequired && data.statusCode === '1';

                CatalogService.populateTypeNameAndPlatformName(data);
                CatalogService.populateDisplayValForAppType(data);
                data.launch = _.get(data, '_links.launch.href', '');
                data.resetDesktop = _.get(data, '_links.reset-desktop.href', '');
                if (data.pvAppCredentials) {
                    data.showPvAppCredentialsLink = true;
                    if (!data.pvAppCredentials.userNameEditable && !data.pvAppCredentials.passwordEditable) {
                        data.showPvAppCredentialsLink = false;
                    }
                }
                data.pvappCredentials = _.get(data, '_links.pvappCredentials.href', '');
                vm.app = data;

               if (isMdmWebApp && !data.installStatus) {
                    data.installStatus = INSTALL_STATUS.ACTIVATED.name;
                    data.visible = true;
                }
                _.extend(vm, _.pick(data, properties));
                vm.descriptionHTML = data.description;
                vm.shortDescriptionHTML = data.description ? data.description.substring(0, data.description.indexOf('.') + 1) : 'none';
                vm.iconStyle = data._links.icon ? data._links.icon.href : 'none';
                vm.reviews = data.reviews || [];
                vm.categories = data.categories || [];
                vm.screenshots = data._links.screenshots || [];
                vm.mgmtRequired = data.mgmtRequired;
                vm.fromCache = data.fromCache;
                vm.perDeviceActivationRequired = data.perDeviceActivationRequired;
                vm.isAppRatingsEnabled = vm.isAppRatingsEnabled && !data.loadFromDbFailed;
                var appStatus = data.installStatus;
                if (!appStatus) {
                    appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
                } else if (!data.visible) {
                    appStatus = 'HIDDEN';
                } else if ((data.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(data.installStatus) >= 0) || (data.subType === 'THINAPP' && data.perDeviceActivationRequired)) {
                    appStatus = 'REQUEST';
                }
                if (vm.isAppRatingsEnabled) {
                    vm.appRatingData = {
                        url: data._links.appRating ? data._links.appRating.href : "",
                        likes: data.appRatingStats && data.appRatingStats.likes,
                        dislikes: data.appRatingStats && data.appRatingStats.dislikes,
                        rating: data.currentUserAppRating
                    };
                }
                if (vm.isHubUiEnabled) {
                    vm.creatorName = data.creator || "";
                    vm.supportEmail = data.supportEmail || "";
                    vm.supportPhone = data.supportPhone || "";
                }
                //opening mail client is supported in awjade version 3.3 and above. this is similar to opening email in people search page.
                vm.isAppFeedbackSupported = vm.isHubUiEnabled && vm.supportEmail;
                vm.appSize = data.size ? CatalogService.getAppSize(data.size) : "";
                vm.installAction = CatalogService.getInstallStatusText(appStatus, data);
                vm.appNeedToActivated = data.installStatus === 'NOT_ACTIVATED' || data.installStatus === 'ACTIVATION_FAILED' || data.installStatus === 'UPDATE'
                    || (data.installStatus !== 'NOT_ACTIVATED' && !data.visible) || (data.subType === 'THINAPP' && data.perDeviceActivationRequired);
                vm.installUrl = appInstallEndpoint + appId;
                vm.backgroundImage = '';

                if (data._links.icon != undefined) {
                    vm.backgroundImage = 'url(' + data._links.icon.href + ')';
                }
                vm._links = data._links;
                vm.hasAppRequirements = data.subType === 'THINAPP' || data.subType === 'XENAPP' || data.subType === 'XENAPPDELIVERYGROUP' || data.subType === 'VIEWPOOL' || data.subType === 'VIEWAPP' || data.subType === 'DESKTONEDESKTOP' || data.subType === 'DESKTONEAPPLICATION';
                vm.showRequirement = vm.hasAppRequirements && !UserAgent.isHorizon();
                vm.appSubType = $filter('i18n')('app.details.label.type.' + data.subType);

                if (vm.fromCache && vm.app.isMdmApp) {
                    vm.showMissingInfoMsg = true;
                }

                doneLoading();

                vm.showNativeLaunchMessage = !hznLocalStorage.nativeLaunchMessage && UtilService.isHubNative() && data.isMdmApp && data.installStatus === "ACTIVATED";
                if (vm.showNativeLaunchMessage) {
                    var interval = $interval(function() {
                        vm.showNativeLaunchMessage = false;
                        $interval.cancel(interval);
                    }, 2000);
                    hznLocalStorage.nativeLaunchMessage = true;
                }
            }

            vm.backBtnAction = function() {
                window.history.back();
            };

            // Hub specific functions
            vm.hubBackBtnAction = function() {
                var prevStateWithInNotifications = function() {
                    return ['apps.newApps', 'apps.archivedNotifications', 'apps.notifications'].indexOf($state.prev.name) > -1;
                };

                if (prevStateWithInNotifications()) {
                    UtilService.goBack();
                } else {
                    UpdateUrlParamsService.showNativenav().then(function() {
                        UtilService.goBack();
                    });
                }
            };

            vm.openZoomedImageCarousel = function(index) {
                ModalService.getCurrentModal().open('app-v2/details/zoomedImageCarousel.html', {screenshots: vm.screenshots, modal: ModalService.getCurrentModal(), carouselIndex: index });
            };

            vm.hubOpenZoomedImageCarousel = function(index) {
                ModalService.getCurrentModal().open('app-v2/components/details/zoomedImageCarousel.html', {screenshots: vm.screenshots, modal: ModalService.getCurrentModal(), carouselIndex: index });
            };

            vm.resetDesktop = function(app, $event) {
                BookmarksService.performResetDesktop(app, $event);
            };

            vm.openSetAppPasswordDialog = function(app, $event) {
                BookmarksService.openSetAppPasswordDialog(app, $event);
            };

            vm.openEmail = function() {
                var mail = vm.supportEmail + "?subject=" + $filter('i18n')('app.details.label.feedbackSubject', vm.app.name);
                ClientRuntimeService.openEmail(mail);
            };

            function startLoading() {
                vm.isLoading = true;
            }

            function doneLoading() {
                vm.isLoading = false;
            }
            $scope.$on('open-modal-dialog', function(event, args) {
                var template = args.dialogtemplate;
                $scope.$modal.open(template, $scope, {params: args.dialogparams});
            });
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
