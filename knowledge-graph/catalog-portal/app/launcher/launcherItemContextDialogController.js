(function(module) {
    'use strict';
    module.controller('LauncherItemContextDialogController', [ 
                        '$scope', 
                        'DetailsService', 
                        '$timeout', 
                        '$filter', 
                        'LauncherService', 
                        'OfflineService', 
                        'UserAgent', 
                        '$sce', 
                        'JadeV1Scheme',
                        'JadeV2Scheme',
                        'CatalogService',
                        function($scope,
                                 DetailsService, 
                                 $timeout, 
                                 $filter, 
                                 LauncherService, 
                                 OfflineService, 
                                 UserAgent, 
                                 $sce,
                                 JadeV1Scheme,
                                 JadeV2Scheme,
                                 CatalogService) {
            var vm = this;
            if(!CatalogService.isMdmWebApp($scope.app.type, $scope.app.subType)) {
                DetailsService.getAppDetailsResource($scope.app.appId).get().then(function(appDetails){
                    vm.hasAppRequirements = appDetails.subType === 'THINAPP' || appDetails.subType === 'XENAPP' || appDetails.subType === 'XENAPPDELIVERYGROUP' || appDetails.subType === 'VIEWPOOL' || appDetails.subType === 'VIEWAPP' || appDetails.subType === 'DESKTONEDESKTOP' || appDetails.subType === 'DESKTONEAPPLICATION' ;
                    if (appDetails.description)  {
                        if(vm.hasAppRequirements && appDetails.description.length > 50) {
                            appDetails.description = appDetails.description.substring(0, 49) + "...";
                        } else if(appDetails.description.length > 110){
                            appDetails.description = appDetails.description.substring(0, 109) + "...";
                        }
                    }
                    angular.extend(appDetails._links, $scope.app._links);
                    angular.extend($scope.app, appDetails);
                });
            }
            vm.hideApp = function(app, apps, index, $event){
                if($event){
                    $event.stopPropagation();
                }
                if(OfflineService.isDeviceOnline()) {
                    LauncherService.setAppVisible(app).then(function(data){
                        if(data) {
                            //success
                            apps.splice(index, 1);
                            $scope.showLauncherMessage(apps);
                        }  else {
                            $scope.$modal.alert({
                                title: 'requestFailed',
                                message: 'error.failToHideApp',
                                ok: 'ok'
                            });
                        }
                    });
                }
            };


            vm.appDetails = function(app) {
                DetailsService.setAppDetails(app);
                location.hash = '#/details/' + app.appId + '/launcher';
            };

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
        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
