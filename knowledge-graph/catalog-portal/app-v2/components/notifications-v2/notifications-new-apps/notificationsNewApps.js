appCenter.component('notificationsNewAppsV2', {
    template: '<div ng-include="\'app-v2/components/notifications-v2/notifications-new-apps/\' + notificationNewAppsCtrl.templateUrl">',
    controllerAs: 'notificationNewAppsCtrl',
    controller: ['ConfigService', 'EventsService', '$state', 'Resource', 'CatalogService', 'HttpProxyService', '$notify', '$timeout', 'NotificationService',
        function(ConfigService, EventsService, $state, Resource, CatalogService, HttpProxyService, $notify, $timeout, NotificationService) {
            this.templateUrl = 'notificationsNewAppsDesktopModal.html';
            var vm = this;
            var notificationId = $state.params.notificationId;
            var autoDismissTime = 2000;
            vm.emptyFillers = [1, 2, 3, 4, 5, 6, 7, 8];
            vm.isLoading = false;
            vm.newApps = [];

            ConfigService.getEntitlementsUrl().then(function(url) {
                vm.isLoading = true;
                NotificationService.getNotificationNewApps(url, notificationId).then(function(newAppEntitlementsResponse) {
                    vm.newApps = newAppEntitlementsResponse._embedded.entitlements;
                    vm.isLoading = false;
                }, function() {
                    vm.isLoading = false;
                });
            });

            vm.goToAppDetails = function(appId) {
                $state.go('apps.details', {
                    appId: appId
                });
            };

            vm.bookmarkAll = function() {
                var appIds = _.pluck(vm.newApps, 'appId');

                CatalogService.bookmarkAllNewEntitledApps(appIds).then(function() {
                    HttpProxyService.updateBookmark();
                    $notify.success('app.notification.bookmark.all.success');
                    ConfigService.refreshCache();
                    $timeout(function() {
                        vm.goToNotifications();
                    }, autoDismissTime);
                }, function(error) {
                    $notify.error('app.notification.bookmark.all.error');
                });
            };

            vm.goToNotifications = function() {
                $state.go('notifications');
            };
        }]
});
