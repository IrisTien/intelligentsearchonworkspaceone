// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('NotificationCardController', ['$scope', '$state', '$rootScope', 'UserAgent', '$sce', '$filter', '$notify', 'UtilService', 'Resource', '$http', 'RequestFactory', 'ConfigService', 'ModalService', 'NotificationService', 'ClientRuntimeService', 'hznLocalStorage', function($scope, $state, $rootScope, UserAgent, $sce, $filter, $notify, UtilService, Resource, $http, RequestFactory, ConfigService, ModalService, NotificationService, ClientRuntimeService, hznLocalStorage) {
        var notificationCardCtrl = this;
        var notification = notificationCardCtrl.notification;
        notificationCardCtrl.id = notification.id;
        var title = _.get(notification, 'notification_card.header.title', '');
        var subtitle = _.get(notification, 'notification_card.header.subtitle[0]', '');
        var notificationType = _.get(notification, 'notification_card.body.fields[0].type', '');
        var supportedActions = ['WS1_NEW_ENTITLEMENTS', 'OPEN_IN', 'INSTALL_APP', 'DIRECT', 'USER_INPUT'];
        var lastActionId = _.get(notification, 'last_action_id', '');
        this.read_at = _.get(notification, 'read_at', '');
        var priority = _.get(notification, 'notification_card.importance', -1);

        notificationCardCtrl.titleAndSubtitle = title && subtitle;
        notificationCardCtrl.title = title || subtitle;
        notificationCardCtrl.subtitle = subtitle;
        notificationCardCtrl.isNewAppNotification = false;
        notificationCardCtrl.excessIconsMessage = '';
        notificationCardCtrl.actions = _.get(notification, 'notification_card.actions', []);
        notificationCardCtrl.newApps = _.get(notification, 'notification_card.body.fields[0].content', []);
        notificationCardCtrl.image = _.get(notification, 'notification_card.image.href', '');
        notificationCardCtrl.message = $filter('linky')((_.get(notification, 'notification_card.body.description', '')), '_blank');
        notificationCardCtrl.isPriority = (priority == 1);
        notificationCardCtrl.hideVirtualApp = UtilService.hideVirtualApps();

        var isNewNotification = !this.read_at;
        var isDismissed = (this.read_at && !lastActionId);

        notificationCardCtrl.cardEnabled = (isDismissed || isNewNotification);

        notificationCardCtrl.additionalBodySection = false;
        notificationCardCtrl.bodyFieldsSection = false;

        notificationCardCtrl.bodyFields = _.get(notification, 'notification_card.body.fields', []);
        if (notificationType != "WS1_NEW_ENTITLEMENTS" && notificationCardCtrl.bodyFields.length > 0) {
            notificationCardCtrl.bodyFieldsSection = true;
            notificationCardCtrl.cardBodyFieldTitle = _.get(notification, 'notification_card.body.fields[0].title', '');
            notificationCardCtrl.cardBodyFieldDescription = _.get(notification, 'notification_card.body.fields[0].description', '');
            notificationCardCtrl.cardBodyFieldContent = _.get(notification, 'notification_card.body.fields[0].content[0]', {});
        }

        if (notificationType === "WS1_NEW_ENTITLEMENTS") {
            if (notificationCardCtrl.newApps) {
                notificationCardCtrl.isNewAppNotification = true;
                notificationCardCtrl.additionalBodySection = true;
                if (notificationCardCtrl.newApps.length > 4) {
                    var excessIconsNum = notificationCardCtrl.newApps.length - 4;
                    notificationCardCtrl.newApps = notificationCardCtrl.newApps.slice(0, 4);
                    notificationCardCtrl.excessIconsMessage = $filter('i18n')('app.notification.newApps.excessIconsMessage', excessIconsNum);
                }
            }
        }

        var formattedCreatedDate = moment.utc(notification.created_at).format("YYYY-MM-DDTHH:mm:ss");
        var created = moment(formattedCreatedDate, "YYYY-MM-DDTHH:mm:ss");
        var formattedCurrentDate = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        var now = moment(formattedCurrentDate, "YYYY-MM-DDTHH:mm:ss");
        notificationCardCtrl.date = created.from(now);

        this.getLabelClass = function(action) {
            var primary = _.get(action, 'primary', '');
            var allow_repeated = _.get(action, 'allow_repeated', '');
            var buttonClass = '';
            if ((primary == true) || !action.hasOwnProperty('primary')) {
                buttonClass += 'notifications-action-button-primary';
            } else {
                buttonClass += 'notifications-action-button-secondary';
            }

            if (!this.isNotificationActionSupported(action) || (!allow_repeated && this.read_at && lastActionId)) {
                buttonClass += ' disabled';
            }
            return buttonClass;
        };

        this.getHubLabelClass = function(action) {
            var allow_repeated = _.get(action, 'allow_repeated', '');
            var hubLabel = '';
            if (!this.isNotificationActionSupported(action) || (!allow_repeated && this.read_at && lastActionId)) {
                hubLabel += ' disabled';
            }
            return hubLabel;
        };

        this.showArchivedMessage = function() {
            var repeatableActions = false;
            var noActions = (notificationCardCtrl.actions.length == 0);
            notificationCardCtrl.actions.forEach(function(element) {
                var allowRepeated = _.get(element, 'allow_repeated', '');
                if (allowRepeated) {
                    repeatableActions = true;
                }
            });
            if (this.read_at && !repeatableActions) {
                if (!lastActionId && noActions) {
                    // Archived card without actions
                    return true;
                } else if (lastActionId && !noActions) {
                    // Acted on archived card with non-repeatable actions
                    return true;
                } else if (!lastActionId && !noActions) {
                    // Not acted on archived card with non-repeatable actions
                    return false;
                }
            }
        };

        this.archivedTimeLabel = function() {
            return moment.utc(this.read_at).format('MMMM Do, YYYY');
        };

        this.isAppStoreURL = function(url) {
            var appleAppStoreUrl = "itunes.apple.com";
            var androidAppStoreUrl = "play.google.com";
            var windowsAppStoreUrl = "microsoft.com";
            return (url.indexOf(windowsAppStoreUrl) !== -1) || (url.indexOf(appleAppStoreUrl) !== -1) || (url.indexOf(androidAppStoreUrl) !== -1);
        };

        var acceptUserInput = function(format, inputLabel, inputKey, selectOptions, minLength, maxLength) {
             /*
                Returns a promise to deal with user input, placeholder input data sent back for now
             */
             return Promise.resolve("Test user input");
        };

        var userActionCancel = function() {
            /*
                Handler if user clicks on approve/deny -> text box opens up -> user decides to not type anything and click out. In case nothing needs to happen, we can remove this.
            */
        };

        this.performAction = function(action, isHub) {
            if (this.isNotificationActionSupported(action)) {
                var actionKey = _.get(action, 'action_key', '');
                var requestData = _.get(action, 'request', {});
                var url = _.get(action, 'url.href', {});
                var type = _.get(action, 'type', '');
                var id = _.get(action, 'id', '');

                var handleMultipleNewApps = function() {
                    if (UserAgent.isAWJadeMobile() || UserAgent.isPhone()) {
                        location.hash = isHub ? '#/apps/notifications/newApps/' + notification.id + '?nativenav=Hide' : '#/notifications/newApps/' + notification.id;
                    } else {
                        ModalService.getCurrentModal().open('app-v2/notifications/newEntitlementsDesktopModal.html', {notificationId: notification.id});
                    }
                };

                if (notificationType === "WS1_NEW_ENTITLEMENTS") {
                    if (notificationCardCtrl.newApps.length > 1) {
                        handleMultipleNewApps();
                    } else {
                        var appId = _.get(notification, 'notification_card.body.fields[0].content[0].appId', '');
                        if (isHub) {
                            location.hash = '#/apps/details/' + appId + '?nativenav=Hide';
                        } else {
                            $state.go('catalog.details', {
                                appId: encodeURIComponent(appId)
                            });
                        }
                    }
                } else {
                    switch (actionKey) {
                        case "OPEN_IN" :
                            NotificationService.openInAction(url);
                            break;
                        case "DIRECT" :
                            NotificationService.directAction(url, type, requestData);
                            break;
                        case "USER_INPUT" :
                            var format = _.get(action, 'user_input[0].format', '');
                            var inputLabel = _.get(action, 'user_input[0].label', '');
                            var inputKey = _.get(action, 'user_input[0].id', '');
                            var selectOptions = _.get(action, 'user_input[0].options', {});
                            var minLength = _.get(action, 'user_input[0].min_length', -1);
                            var maxLength = _.get(action, 'user_input[0].max_length', -1);

                            acceptUserInput(format, inputLabel, inputKey, selectOptions, minLength, maxLength).then(function(inputData) {
                                var dataObj = {};
                                if (UtilService.isEmpty(requestData)) {
                                    dataObj[inputKey] = inputData;
                                } else {
                                    dataObj = requestData;
                                    dataObj[inputKey] = inputData;
                                }
                                NotificationService.directAction(url, type, dataObj);
                            }, function() {
                                userActionCancel();
                            });
                            break;
                        case "INSTALL_APP" :
                            NotificationService.installAppAction(url);
                            break;
                        default :
                            break;
                    }
                }

                if (isNewNotification || isDismissed) {
                    notificationCardCtrl.archiveNotification(this.read_at, id);
                }
            }
        };

        notificationCardCtrl.getLabel = function(action) {
            var allowRepeated = _.get(action, 'allow_repeated', '');
            var label = _.get(action, 'label', '');
            var completed_label = _.get(action, 'completed_label', '');
            if (!allowRepeated && lastActionId && (action.id === lastActionId)) {
                var completedLabel = completed_label || label;
                return completedLabel;
            }
            return label;
        };

        notificationCardCtrl.getHubLabel = function(action) {
            var allowRepeated = _.get(action, 'allow_repeated', '');
            var label = _.get(action, 'label', '');
            var completed_label = _.get(action, 'completed_label', '');
            if (!allowRepeated && lastActionId && (action.id === lastActionId)) {
                var completedLabel = completed_label || label;
                return $filter('uppercase')(completedLabel);
            }
            return $filter('uppercase')(label);
        };

        // Dynamically assigning a max-width on the desktop notification card action buttons depending on number of actions to prevent truncation of button text.
        var numActions = this.actions.length;
        if (numActions !== 0) {
            var desktopMaxButtonWidth = (100 / numActions) + '%';
            notificationCardCtrl.desktopMaxButtonWidthStyle = {'max-width': desktopMaxButtonWidth};
        } else {
            notificationCardCtrl.desktopMaxButtonWidthStyle = {};
        }

        this.archiveNotification = function(read_at, actionId) {
            var url = notification._links.markRead.href;
            NotificationService.archiveNotification(url, actionId)
                .then(function() {
                    if (!read_at) {
                        notificationCardCtrl.onArchive();
                    }
                    if (actionId) {
                        notificationCardCtrl.cardEnabled = false;
                    }
                });
        };

        this.isNotificationActionSupported = function(action) {
            var actionKey = _.get(action, 'action_key', '');
            return supportedActions.indexOf(actionKey) > -1;
        };

        notificationCardCtrl.dismissNotification = function() {
            notificationCardCtrl.archiveNotification(this.read_at);
        };
    }]);
})(angular.module("com.vmware.greenbox.appCenter"));
