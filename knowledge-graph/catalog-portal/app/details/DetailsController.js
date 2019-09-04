
(function(module) {

    'use strict';

    var properties = ['name', 'appType', 'subType', 'installStatus', 'installMessage', 'rating', 'version', 'size', 'type', 'price' ];

    var appInstallEndpoint = '/catalog-portal/services/api/activate/';

	module.controller('DetailsController', [
                            '$scope',
                            'DetailsService',
                            '$routeParams',
                            '$timeout',
                            'CatalogService',
                            'INSTALL_STATUS',
                            '$filter',
                            '$sce',
                            'UserAgent',
                            'JadeV1Scheme',
                            'JadeV2Scheme',
        function ($scope,
                  DetailsService,
                  $routeParams,
                  $timeout,
                  CatalogService,
                  INSTALL_STATUS,
                  $filter,
                  $sce,
                  UserAgent,
                  JadeV1Scheme,
                  JadeV2Scheme) {
            var vm = this,
                appId = $routeParams.appId,
                originPage = $routeParams.originPage,
                resource = DetailsService.getAppDetailsResource(appId),
                webAppDetails = DetailsService.getAppDetails() || null,
                isMdmWebApp = false;

            if(webAppDetails) {
                isMdmWebApp = CatalogService.isMdmWebApp(webAppDetails.type, webAppDetails.subType);
            }

            if(webAppDetails && isMdmWebApp) {
                appDetails(webAppDetails);
            } else {
                startLoading();
                resource.get().then( function (data) {
                    appDetails(data);
                });
            }

            var viewDownloadLink = $filter('i18n')('viewDownloadUrl');
            if (UserAgent.isIOS()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlIOS');
            } else if (UserAgent.isAndroid()) {
                viewDownloadLink = $filter('i18n')('viewDownloadUrlAndroid');
            }
            var xenreceiverDownloadLink = $filter('i18n')('citrixReceiverDownloadUrl');
            if (UserAgent.isAWJadeV2()) {
                if(UserAgent.isWindows()) {
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
            vm.backAction = function () {
                location.hash = '#/'+ originPage;
            };

            vm.goToSlide = function(index) {
                $scope.$modal.open("app/details/zoomedImageCarousel.html",
                    {screenshots: vm.screenshots, modal: $scope.$modal, carouselIndex: index });
            };

            function appDetails(data) {
                if(isMdmWebApp && !data.installStatus) {
                    data.installStatus = INSTALL_STATUS["ACTIVATED"].name;
                    data.visible = true;
                }
                _.extend( vm, _.pick(data, properties));
                vm.descriptionHTML = data.description;
                vm.iconStyle = data._links.icon ? data._links.icon.href : 'none' ;
                vm.reviews = data.reviews || [];
                vm.categories = data.categories || [];
                vm.screenshots = data._links.screenshots || [];
                vm.mgmtRequired = data.mgmtRequired;
                vm.perDeviceActivationRequired = data.perDeviceActivationRequired;
                var appStatus = data.installStatus;
                if(appStatus === "" || appStatus === undefined ){
                    appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
                } else if (!data.visible) {
                    appStatus = 'HIDDEN';
                } else if ((data.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(data.installStatus) >= 0) || (data.subType === 'THINAPP' && data.perDeviceActivationRequired)) {
                    appStatus = 'REQUEST';
                }
                vm.installAction = CatalogService.getInstallStatusText(appStatus, data);
                vm.appNeedToActivated = data.installStatus === 'NOT_ACTIVATED' || data.installStatus === 'ACTIVATION_FAILED' || data.installStatus === 'UPDATE'
                    || (data.installStatus !== 'NOT_ACTIVATED' && !data.visible) || (data.subType === 'THINAPP' && data.perDeviceActivationRequired);
                vm.installUrl = appInstallEndpoint + appId;
                vm.backgroundImage =  '';

                if (data['_links']['icon'] != undefined) {
                    vm.backgroundImage =  'url(' + data['_links']['icon']['href'] + ')';
                }
                vm._links = data['_links'];
                vm.hasAppRequirements = data.subType === 'THINAPP' || data.subType === 'XENAPP' || data.subType === 'XENAPPDELIVERYGROUP' || data.subType === 'VIEWPOOL' || data.subType === 'VIEWAPP' || data.subType === 'DESKTONEDESKTOP' || data.subType === 'DESKTONEAPPLICATION' ;
                vm.showRequirement = vm.hasAppRequirements && !UserAgent.isHorizon();
                vm.appSubType = $filter('i18n')('app.details.label.type.'+data.subType);
                doneLoading();
            }


            function startLoading () {
                vm.isLoading = true;
            }

            function doneLoading () {
                vm.isLoading = false;
            }
            $scope.$on('open-modal-dialog', function(event, args) {
                var template = args.dialogtemplate;
                $scope.$modal.open(template, $scope, {params: args.dialogparams});
            });
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
