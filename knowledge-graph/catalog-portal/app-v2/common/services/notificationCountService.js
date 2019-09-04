(function(module) {
    'use strict';

    module.service('NotificationCountService', [
        'ConfigService',
        'POLLING_INTERVALS',
        'hznLocalStorage',
        '$timeout',
        '$rootScope',
        function(ConfigService,
                 POLLING_INTERVALS,
                 hznLocalStorage,
                 $timeout,
                 $rootScope) {
            var NOTIFICATION_QUEUE_BEACON_URL = '/user/queue/devicebeacons';
            var NEW_NOTIFICATION_URL = '/user/queue/notifications';
            var NOTIFICATION_REALTIME_URL = '/api/v1/notifications/realtime';
            var sockJsProtocols = ["xhr-streaming", "xhr-polling"];
            var socket;
            var notificationCountService = this;
            var stompClient = null;
            var subscription = [];
            var connectionTimer;

            notificationCountService.connectToNotificationService = function(callback) {
                ConfigService.getNotificationServiceUrl().then(function(url) {
                    connectFun(url, callback);
                });
            };

            notificationCountService.disconnectToNotificationService = function() {
                if (stompClient) {
                    disconnectFunc();
                }
            };

            var unSubscribe = function() {
                if (subscription.length) {
                    for (var i = 0; i < subscription.length; i++) {
                        subscription[i].unsubscribe();
                    }
                }
            };

            var disconnectFunc = function() {
                unSubscribe();
                if (stompClient && stompClient.connected) {
                    stompClient.disconnect();
                }
            };

            var connectFun = function(notificationServiceUrl, callback) {
                if (!notificationServiceUrl) {
                    return;
                }
                if (socket) {
                    socket.close();
                }
                socket = new SockJS(notificationServiceUrl + NOTIFICATION_REALTIME_URL, null, {transports: sockJsProtocols});
                stompClient = webstomp.over(socket);
                if (stompClient && !stompClient.connected) {
                    stompClient.connect({}, function(frame) {
                        if (stompClient.connected) {
                            unSubscribe();
                            subscription[0] = stompClient.subscribe(NOTIFICATION_QUEUE_BEACON_URL, function(beacon) {
                                delete hznLocalStorage.notificationSvcRealtimeConnectionDelay;
                                callback(beacon.body);
                            });

                            subscription[1] = stompClient.subscribe(NEW_NOTIFICATION_URL, function(notification) {
                                notification = JSON.parse(notification.body);
                                var priority = _.get(notification, 'notification_card.importance', -1);
                                if (priority > 0 && priority < 3) {
                                    $rootScope.$broadcast('new-priority-notifications', notification);
                                }
                            });
                        }
                    }, function() {
                        hznLocalStorage.notificationSvcRealtimeConnectionDelay = hznLocalStorage.notificationSvcRealtimeConnectionDelay ? hznLocalStorage.notificationSvcRealtimeConnectionDelay : new Date().getTime() + POLLING_INTERVALS.NOTIFICATION_SVC_REALTIME_CONNECTION_CHECK_INTERVAL; //3 min
                        var delay = hznLocalStorage.notificationSvcRealtimeConnectionDelay - new Date().getTime();
                        if (delay > 0 && socket.readyState !== 0) {
                            if (connectionTimer) {
                                $timeout.cancel(connectionTimer);
                            }
                            connectionTimer = $timeout(function() {
                                connectFun(notificationServiceUrl, callback);
                            }, 5000);
                        } else {
                            delete hznLocalStorage.notificationSvcRealtimeConnectionDelay;
                            if (connectionTimer) {
                                $timeout.cancel(connectionTimer);
                            }
                        }
                    });
                }
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
