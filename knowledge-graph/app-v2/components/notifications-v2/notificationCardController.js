// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('NotificationCardControllerV2', ['$scope', '$state', '$rootScope', 'UserAgent', '$sce', '$filter', '$notify', 'UtilService', 'Resource', '$http', 'RequestFactory', 'ConfigService', 'ModalService', 'NotificationService', 'ClientRuntimeService', 'hznLocalStorage', function($scope, $state, $rootScope, UserAgent, $sce, $filter, $notify, UtilService, Resource, $http, RequestFactory, ConfigService, ModalService, NotificationService, ClientRuntimeService, hznLocalStorage) {
        var notificationCardCtrl = this;
        var notification = notificationCardCtrl.notification;
        this.templateUrl = notificationCardCtrl.isLongCard ? 'notificationLongCard.html' : 'notificationCard.html';
        notificationCardCtrl.id = notification.id;
        var title = _.get(notification, 'notification_card.header.title', '');
        var subtitle = _.get(notification, 'notification_card.header.subtitle', '');
        if (subtitle) {
            subtitle = subtitle.join(' ');
        }
        var notificationType = _.get(notification, 'notification_card.body.fields[0].type', '');
        var supportedActions = ['WS1_NEW_ENTITLEMENTS', 'OPEN_IN', 'INSTALL_APP', 'DIRECT', 'USER_INPUT'];
        var lastActionId = _.get(notification, 'last_action_id', '');
        this.read_at = _.get(notification, 'read_at', '');
        var priority = _.get(notification, 'notification_card.importance', -1);
        var actions = _.get(notification, 'notification_card.actions', []);
        var readAction = "read" + notificationCardCtrl.id;
        notificationCardCtrl.isAWJadeDesktop = UserAgent.isAWJadeDesktop();
        notificationCardCtrl.isPriority = (priority === 1);
        notificationCardCtrl.isUnactedPriority = (priority === 1 && !lastActionId);
        notificationCardCtrl.notificationWithNoActions = (actions.length === 0);

        notificationCardCtrl.checkIfActionRepeatable = function(actionId) {
            actions.forEach(function(currentValue) {
                var currentActionId = _.get(currentValue, 'id', '');
                if (currentActionId === actionId) {
                    return _.get(currentValue, 'allow_repeated', false);
                }
            });
        };
        notificationCardCtrl.hideVirtualApp = UtilService.hideVirtualApps();

        notificationCardCtrl.getValidActions = function() {
            if (notificationCardCtrl.notificationWithNoActions) {
                var action = {id: readAction};
                actions.push(action);
                return actions;
            }

            if (!lastActionId || notificationCardCtrl.checkIfActionRepeatable(lastActionId)) {
                return actions;
            }
            actions.forEach(function(currentValue, index) {
                var currentActionId = _.get(currentValue, 'id', '');
                if (currentActionId != lastActionId) {
                    actions.splice(index, 1);
                }
            });

            return actions;
        };

        notificationCardCtrl.titleAndSubtitle = title && subtitle;
        notificationCardCtrl.title = title || subtitle;
        notificationCardCtrl.subtitle = subtitle;
        notificationCardCtrl.isNewAppNotification = false;
        notificationCardCtrl.excessIconsMessage = '';
        notificationCardCtrl.actions = notificationCardCtrl.getValidActions(notification);
        notificationCardCtrl.newApps = _.get(notification, 'notification_card.body.fields[0].content', []);
        notificationCardCtrl.image = _.get(notification, 'notification_card.image.href', '');
        notificationCardCtrl.message = $filter('linky')((_.get(notification, 'notification_card.body.description', '')), '_blank');
        notificationCardCtrl.isMobileApp = UserAgent.isAWJadeMobile();

        var isNewNotification = !this.read_at;
        var isDismissed = (this.read_at && !lastActionId);

        notificationCardCtrl.cardEnabled = (isDismissed || isNewNotification);

        notificationCardCtrl.additionalBodySection = false;
        notificationCardCtrl.bodyFieldsSection = false;

        notificationCardCtrl.bodyFields = _.get(notification, 'notification_card.body.fields', []);
        notificationCardCtrl.commentBox = _.find(notificationCardCtrl.bodyFields, {'type': 'COMMENT'});
        if (notificationType !== "WS1_NEW_ENTITLEMENTS" && notificationCardCtrl.bodyFields.length === 1) {
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
            if ((primary === true) || !action.hasOwnProperty('primary')) {
                buttonClass += 'notifications-action-button-primary';
            } else {
                buttonClass += 'notifications-action-button-secondary';
            }

            if (!allow_repeated && lastActionId && (action.id === lastActionId)) {
                buttonClass += ' notification-button-disabled ';
            }

            if (!this.isNotificationActionSupported(action)) {
                buttonClass += ' disabled';
            }

            if (notificationCardCtrl.actions.length === 1 && notificationCardCtrl.actions[0].id === readAction && !lastActionId) {
                buttonClass += 'notifications-action-button-primary';
            }

            if (notificationCardCtrl.actions.length === 1 && notificationCardCtrl.actions[0].id === readAction && lastActionId) {
                buttonClass += ' notification-button-disabled ';
            }

            return buttonClass;
        };

        this.getHubLabelClass = function(action) {
            var allow_repeated = _.get(action, 'allow_repeated', '');
            var hubLabel = '';
            if (!this.isNotificationActionSupported(action) && !(notificationCardCtrl.actions.length === 1 && notificationCardCtrl.actions[0].id === readAction)) {
                hubLabel += ' disabled';
            }
            return hubLabel;
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
            if (notificationCardCtrl.actions.length === 1 && notificationCardCtrl.actions[0].id === readAction) {
                notificationCardCtrl.markAsRead(this.read_at, readAction);
                var completedLabel = $filter('i18n')("hub.notifications.informational.card.read.label");
                notificationCardCtrl.actionCompleted(false, readAction, completedLabel);
                $rootScope.$broadcast('hub-notification-acted-on', {"notificationId": notificationCardCtrl.id});
                return;
            }

            if (this.isNotificationActionSupported(action)) {
                var actionKey = _.get(action, 'action_key', '');
                var requestData = _.get(action, 'request', {});
                var allowRepeated = _.get(action, 'allow_repeated', false);
                var label = _.get(action, 'label', '');
                var completed_label = _.get(action, 'completed_label', label);
                var url = _.get(action, 'url.href', {});
                var type = _.get(action, 'type', '');
                var id = _.get(action, 'id', '');

                var handleMultipleNewApps = function() {
                    if (UserAgent.isAWJadeMobile()) {
                        if (UserAgent.isNativeAppVersionBelow("9.2")) {
                            location.hash = '#/apps/notifications/newApps/' + notification.id + '?nativenav=Hide';
                        } else if (UserAgent.isNativeAppVersionIsEqualOrAbove("9.2")) {
                            $state.go('newApps', {
                                notificationId: notification.id
                            });
                        }
                    } else if (UserAgent.isAWJadeDesktop() || UserAgent.isDesktopBrowser()) {
                        $state.go('notifications.newApps', {
                            notificationId: notification.id
                        });
                    } else if (UserAgent.isMobileBrowser()) {
                        $state.go('newAppsList', {
                            notificationId: notification.id
                        });
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

                // If the action is non repeatable, then gray out the action, display the completed label, hide all the other action.
                notificationCardCtrl.markAsRead(this.read_at, id);
                if (!allowRepeated) {
                    notificationCardCtrl.actionCompleted(allowRepeated, id, completed_label);
                }

                $rootScope.$broadcast('hub-notification-acted-on', {"notificationId": notificationCardCtrl.id});
            }
        };

        notificationCardCtrl.actionCompleted = function(allowRepeated, actionId, completedLabel) {
            if (!allowRepeated) {
                notificationCardCtrl.hideOtherActions(actionId);
                notificationCardCtrl.addDisabledClassAndCompletedLabel(actionId, completedLabel);
            }
        };

        notificationCardCtrl.addDisabledClassAndCompletedLabel = function(actionId, completedLabel) {
            var currNotificationAction = angular.element('#' + notificationCardCtrl.id + ' #' + actionId);
            currNotificationAction.addClass("notification-button-disabled");
            currNotificationAction.html(completedLabel);
        };

        /*
         Hides all other actions once a non repeatable action is taken
         */
        notificationCardCtrl.hideOtherActions = function(actionId) {
            notificationCardCtrl.actions.forEach(function(currentValue, index) {
                var currentActionId = _.get(currentValue, 'id', '');
                if (currentActionId != actionId) {
                    notificationCardCtrl.actions.splice(index, 1);
                }
            });
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
            if (notificationCardCtrl.actions.length === 1 && notificationCardCtrl.actions[0].id === readAction && !lastActionId) {
                var unReadLabel = $filter('i18n')("hub.notifications.informational.card.unread.label");
                return $filter('uppercase')(unReadLabel);
            }

            if (notificationCardCtrl.actions.length === 1 && notificationCardCtrl.actions[0].id === readAction && lastActionId) {
                var readLabel = $filter('i18n')("hub.notifications.informational.card.read.label");
                return $filter('uppercase')(readLabel);
            }

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

        this.markAsRead = function(read_at, actionId) {
            var url = notification._links.markRead.href;
            NotificationService.archiveNotification(url, actionId);
        };

        this.isNotificationActionSupported = function(action) {
            var actionKey = _.get(action, 'action_key', '');
            return supportedActions.indexOf(actionKey) > -1;
        };
    }]);
})(angular.module("com.vmware.greenbox.appCenter"));
