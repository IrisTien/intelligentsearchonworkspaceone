(function(module) {
    'use strict';

    module.service('NotificationService', [
        'ConfigService',
        'ClientRuntimeService',
        'Resource',
        'RequestFactory',
        'UserAgent',
        '$http',
        '$q',
        '$notify',
        '$filter',
        'UtilService',
        '$rootScope',
        '$state',
        function(
            ConfigService,
            ClientRuntimeService,
            Resource,
            RequestFactory,
            UserAgent,
            $http,
            $q,
            $notify,
            $filter,
            UtilService,
            $rootScope,
            $state) {
            var service = this;
            var OneDay = 1440;
            var TwoDays = 2880;
            var OneWeek = 10080;
            var OneMonth = 43200;
            var notificationList = [];
            var snackBarNotifications = [];
            var notificationsStructure = {
                priority: {
                    label: $filter('i18n')('hub.notifications.priority'),
                    notifications: []
                },
                today: {
                    label: $filter('i18n')('hub.notifications.today'),
                    notifications: []
                },
                yesterday: {
                    label: $filter('i18n')('hub.notifications.yesterday'),
                    notifications: []
                },
                lastWeek: {
                    label: $filter('i18n')('hub.notifications.lastWeek'),
                    notifications: []
                },
                lastMonth: {
                    label: $filter('i18n')('hub.notifications.lastMonth'),
                    notifications: []
                },
                older: {
                    label: $filter('i18n')('hub.notifications.older'),
                    notifications: []
                }
            };

            service.filters = [{
                label: $filter('i18n')('hub.nav.label.notifications.all.notifications'),
                link: 'notifications({filter:"all"})',
                class: 'marginbottom',
                filterName: 'all'
            }, {
                label: $filter('i18n')('hub.nav.label.notifications.action.needed'),
                link: 'notifications({filter:"pending"})',
                class: 'topline',
                filterName: 'pending'
            }, {
                label: $filter('i18n')('hub.nav.label.notifications.completed'),
                link: 'notifications({filter:"completed"})',
                filterName: 'completed'
            }];

            service.showNativeBell = function() {
                return UserAgent.isHubApp() && UserAgent.isNativeAppVersionIsEqualOrAbove("9.2");
            };

            service.isAppStoreURL = function(url) {
                var appleAppStoreUrl = "itunes.apple.com";
                var androidAppStoreUrl = "play.google.com";
                var windowsAppStoreUrl = "microsoft.com";
                return (url.indexOf(windowsAppStoreUrl) !== -1) || (url.indexOf(appleAppStoreUrl) !== -1) || (url.indexOf(androidAppStoreUrl) !== -1);
            };

            var getTimeDifference = function(created) {
                var createdTime = moment.utc(created);
                var now = moment();
                return UtilService.timeDifference(createdTime, now);
            };

            service.directAction = function(url, type, requestData) {
                // makes rest API call with the given type, url and authentication parameters
                // The notifications service sanity checks the type to make sure that it's a valid HTTP method
                // General implementation is an unauthenticated REST API call

                var data = UtilService.isEmpty(requestData) ? null : requestData;

                service.makeRestApiCall(url, type, data).then(function() {
                    $notify.success('hub.notifications.action.success');
                }, function() {
                    $notify.error('hub.notifications.action.failure');
                });
            };

            service.openInAction = function(url) {
                //opens external browser
                ClientRuntimeService.openUrl(url, 3);
            };

            service.installAppAction = function(url) {
                if (service.isAppStoreURL(url)) {
                    ClientRuntimeService.openUrl(url, 3);
                }
            };

            service.setNotifications = function(notifications) {
                notificationList = notifications;
            };

            service.getNotificationsById = function(notificationId) {
                return _.find(notificationList, {'id': notificationId});
            };

            service.getNotifications = function(readState) {
                var deferred = $q.defer();
                ConfigService.getNotificationUrl().then(function(url) {
                    if (readState != 'emptyReadState') {
                        if (readState) {
                            url += "?readState=READ";
                        } else {
                            url += "?readState=UNREAD";
                        }
                    }
                    var request = Resource(url);
                    return request.get().then(function(data) {
                        deferred.resolve(_.get(data, 'userNotifications', []));
                    }, function(error) {
                        deferred.reject(error);
                    });
                });
                return deferred.promise;
            };

            service.makeRestApiCall = function(url, type, data) {
                var request = RequestFactory(url, {
                    method: type,
                    data: data
                });
                return $http(request);
            };

            service.archiveNotification = function(url, actionId) {
                var req = RequestFactory(url, {method: 'PATCH'});
                if (actionId) {
                    req.params = {'actionId': actionId};
                }
                return $http(req);
            };

            service.archiveAllNotifications = function() {
                return ConfigService.getNotificationBeaconUrl().then(function(url) {
                    var req = RequestFactory(url, {method: 'DELETE'});
                    return $http(req);
                });
            };

            service.getNotificationNewApps = function(entitlementsUrl, notificationId) {
                var params = {};
                params.notificationId = notificationId;
                var headers = {headers: {'Accept': 'application/hal+json', 'method': 'GET'}, params: params};
                var request = Resource(entitlementsUrl, headers);
                return request.get();
            };

            service.parseNotification = function(notifications, completedState) {
                var notificationsTypes = _.cloneDeep(notificationsStructure);
                notifications.forEach(function(notification) {
                    var priority = false;
                    var importance = _.get(notification, 'notification_card.importance', -1);
                    var read_at = _.get(notification, 'read_at', '');
                    var lastActionId = _.get(notification, 'last_action_id', '');

                    if (importance == 1 && !completedState) {
                        notificationsTypes.priority.notifications.push(notification);
                        priority = true;
                    }

                    var created_time = _.get(notification, 'created_at', '');
                    var timeDifference = getTimeDifference(created_time);

                    if (!priority) {
                        if (timeDifference < OneDay) {
                            notificationsTypes.today.notifications.push(notification);
                        } else if (timeDifference >= OneDay && timeDifference < TwoDays) {
                            notificationsTypes.yesterday.notifications.push(notification);
                        } else if (timeDifference >= TwoDays && timeDifference < OneWeek) {
                            notificationsTypes.lastWeek.notifications.push(notification);
                        } else if (timeDifference >= OneWeek && timeDifference < OneMonth) {
                            notificationsTypes.lastMonth.notifications.push(notification);
                        } else if (timeDifference >= OneMonth) {
                            notificationsTypes.older.notifications.push(notification);
                        }
                    }
                });

                return notificationsTypes;
            };

            var showSnackBarNotifications = function(notifications) {
                $notify.closeAll();
                if (notifications.length === 1) {
                    $notify.info('', '', 'app-v2/components/notifications-v2/snackBarNotifications/snackBarNotifications.html', notifications[0]);
                } else {
                    $notify.info('', '', 'app-v2/components/notifications-v2/snackBarNotifications/genericSnackBarNotifications.html', notifications.length);
                }
            };

            var registerForPriorityNotifications = function() {
                $rootScope.$on('new-priority-notifications', function(event, notification) {
                    var priority = _.get(notification, 'notification_card.importance', -1);
                    if (priority === 1 && !_.includes(['notifications', 'notificationsDeeplink', 'notifications.details'], $state.current.name)) {
                        snackBarNotifications.push(notification);
                        showSnackBarNotifications(snackBarNotifications);
                    }
                });
            };

            service.checkForPriorityNotifications = function() {
                registerForPriorityNotifications();
            };

            service.getNotificationsByIdFromServer = function(notificationId) {
                return ConfigService.getNotificationUrl().then(function(url) {
                    url = url + '/' + notificationId;
                    var request = Resource(url);
                    return request.get();
                });
            };

            service.clearSnackNotifications = function() {
                snackBarNotifications = [];
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
