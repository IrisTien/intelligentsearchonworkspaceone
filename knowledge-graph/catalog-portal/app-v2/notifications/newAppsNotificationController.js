(function(module) {
    'use strict';
    module.controller('NewAppsNotificationController', [
        '$scope',
        '$rootScope',
        '$state',
        'ConfigService',
        'EventsService',
        'Resource',
        'OfflineService',
        'CatalogService',
        '$notify',
        'HttpProxyService',
        'UpdateUrlParamsService',
        'ModalService',
        'UserAgent',
        'UtilService',
        '$filter',
        function($scope,
                 $rootScope,
                 $state,
                 ConfigService,
                 EventsService,
                 Resource,
                 OfflineService,
                 CatalogService,
                 $notify,
                 HttpProxyService,
                 UpdateUrlParamsService,
                 ModalService,
                 UserAgent,
                 UtilService,
                 $filter) {
            var vm = this;
            var notificationId = $state.params.notificationId || $scope.notificationId;
            vm.newAppsLabel = $filter('i18n')('myapps.mobilepagetitle.notification.newapps');
            vm.isIOS = UserAgent.isIOS();
            vm.emptyCatalogModalFillers = [1, 2, 3, 4];
            vm.showNewAppsNotificationsOverflowActions = false;
            vm.newApps = [];
            vm.isLoading = false;
            vm.favoriteEnabled = false;
            vm.hideVirtualApp = UtilService.hideVirtualApps();

            UpdateUrlParamsService.hideNativenav().then(function() {
                ConfigService.getEntitlementsUrl().then(function(url) {
                    var params = {};
                    params.notificationId = notificationId;
                    var headers = {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params};
                    var request = Resource(url, headers);
                    vm.isLoading = true;
                    request.get().then(function(newAppEntitlementsResponse) {
                        vm.newApps = newAppEntitlementsResponse._embedded.entitlements;
                        vm.favoriteEnabled = _.get(newAppEntitlementsResponse, 'loadFromDbFailed', false);
                        vm.isLoading = false;
                        EventsService.getEvents().then(function(events) {
                            var handledApps = [];
                            for (var i = 0; i < events.length; i++) {
                                if (events[i] && events[i].action === 'INSTALL') {
                                    if (_.contains(handledApps, events[i].eventData.appId)) {
                                        EventsService.deleteEvent(events[i].eventId);
                                    } else {
                                        handledApps.push(events[i].eventData.appId);
                                        var toBeInstalledApp = _.find(vm.newApps, {'appId': events[i].eventData.appId});
                                        toBeInstalledApp.eventId = events[i].eventId;
                                        CatalogService.activateApp(toBeInstalledApp, $scope.deviceStatus);
                                    }
                                }
                            }
                        });
                    }, function() {
                        vm.isLoading = false;
                    });
                });
            });

            $scope.$on('notification-newapps-overlflow-actions', function(event, status) {
                vm.showNewAppsNotificationsOverflowActions = status;
            });

            vm.hideNewAppsNotificationOverflowActions = function() {
                vm.showNewAppsNotificationsOverflowActions = false;
            };

            vm.toggleNewAppsNotificationsOverflowContainer = function() {
                vm.showNewAppsNotificationsOverflowActions = !vm.showNewAppsNotificationsOverflowActions;
            };

            vm.goToAppDetails = function(appId) {
                location.hash = '#/apps/details/' + appId + "?nativenav=Hide";
            };

            vm.bookmarkAll = function() {
                var markAllNewAppsBookmarking = function(val) {
                    angular.forEach(vm.newApps, function(app) {
                        app.bookmarking = val;
                    });
                };

                var setFavStatusForAllNewApps = function(val) {
                    angular.forEach(vm.newApps, function(app) {
                        app.favorite = val;
                        $rootScope.$broadcast('new-app-notification-bookmark', app);
                    });
                };

                var appIds = [];
                for (var i = 0; i < vm.newApps.length; i++) {
                    appIds.push(vm.newApps[i].appId);
                }

                markAllNewAppsBookmarking(true);
                CatalogService.bookmarkAllNewEntitledApps(appIds).then(function() {
                    HttpProxyService.updateBookmark();
                    ConfigService.refreshCache();
                    setFavStatusForAllNewApps(true);
                    markAllNewAppsBookmarking(false);
                    if (UtilService.isHub()) {
                        $notify.success('app.notification.bookmark.all.success');
                    }
                }, function(error) {
                    markAllNewAppsBookmarking(false);
                    if (error.handled) { //When system is under maintenance
                        return;
                    }
                    $notify.error('app.notification.bookmark.all.error');
                });
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
