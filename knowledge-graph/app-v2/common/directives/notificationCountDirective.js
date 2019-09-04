(function(module) {
    'use strict';
    module.directive('notificationCount', [
                        'NotificationCountService',
                        '$rootScope',
                        'NotificationService',
                        'UtilService',
                        'OfflineService',
                        function(NotificationCountService,
                                 $rootScope,
                                 NotificationService,
                                 UtilService,
                                 OfflineService) {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            controller: function($scope, $element) {
                var inAppNotificationEnabled = UtilService.getObjValue(window, 'workspaceOne.featureFlags.IN_APP_NOTIFICATIONS', false);
                $scope.count = 0;
                var getNotificationCount = function() {
                    NotificationService.getNotifications()
                        .then(function(data) {
                            $scope.count = data.length;
                            $rootScope.$broadcast('new-notification-count-update', data);
                        });
                };

                if (inAppNotificationEnabled) {
                    getNotificationCount();
                }

                var callbackFn = function(message) {
                    if (message) {
                        var msgObj = JSON.parse(message);
                        var counts = _.get(msgObj, 'device_unread_counts', {});
                        var count;
                        var currentDeviceId = workspaceOne.deviceId || 'BROWSER';
                        if (currentDeviceId in counts) {
                            count = _.get(counts, currentDeviceId, 0);
                        } else {
                            count = _.get(counts, '*', 0);
                        }
                        if (count !== undefined) {
                            $scope.$apply(function() {
                                $scope.count = count;
                            });
                        }
                     }
                };
                NotificationCountService.connectToNotificationService(callbackFn);

                $scope.$on('deviceOnlineStatusChanged', function(event, deviceOnline) {
                    if (deviceOnline && OfflineService.isTabVisible()) {
                        NotificationCountService.connectToNotificationService(callbackFn);
                    }
                });

                $scope.$on('tabShown', function(event, deviceOnline) {
                    if (deviceOnline) {
                        getNotificationCount();
                        NotificationCountService.connectToNotificationService(callbackFn);
                    }
                });

                $scope.$on('tabHidden', function(event, deviceOnline) {
                    if (deviceOnline) {
                        NotificationCountService.disconnectToNotificationService();
                    }
                });
            },
            template: '<span><span ng-if="count > 0 && count < 100" class="notification-count">{{count}}</span>' +
                '<span ng-if="count > 99" class="notification-count">99&#43</span></span>'
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
