// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module) {
    module.directive('notify', ['$http', '$compile', '$templateCache', '$log', '$templateRequest', '$notify',
        function($http, $compile, $templateCache, $log, $templateRequest, $notify) {
            return {
                restrict: 'AE',
                scope: true,
                bindToController: true,
                controller: function($scope, $element) {
                    var $message = this;
                    var TEMPLATE_URL = "app-v2/notify/templates/messageContextTemplate.html";
                    var messages = $notify.message;

                    $templateRequest(TEMPLATE_URL)
                        .then(function(templateData) {
                            $compile(angular.element(templateData))($scope, function(clonedElement) {
                                angular.element($element).append(clonedElement);
                            });
                        })
                        .catch(function(e) {
                            $log.error('Failed to load template: ' + TEMPLATE_URL + ' [' + e.message + ']');
                        });

                    function show(messageArray) {
                        $notify.show(messageArray);
                    }

                    function info(messageKey, params, templateUrl) {
                        $notify.showMessage("info", messageKey, params, templateUrl);
                    }

                    function error(messageKey, params, templateUrl) {
                        $notify.showMessage("error", messageKey, params, templateUrl);
                    }

                    function warning(messageKey, params, templateUrl) {
                        $notify.showMessage("warning", messageKey, params, templateUrl);
                    }

                    function success(messageKey, params, templateUrl) {
                        $notify.showMessage("success", messageKey, params, templateUrl);
                    }

                    function progress(messageKey, params, templateUrl) {
                        $notify.showMessage("progress", messageKey, params, templateUrl);
                    }

                    // Close a message dialog.
                    function close(index) {
                        $notify.close(index);
                    }

                    $scope._messagesArray_ = messages;
                    $scope.close = close; // TODO: remove? we have $message.close

                    $message.info = info;
                    $message.error = error;
                    $message.warning = warning;
                    $message.success = success;
                    $message.show = show;
                    $message.close = close;
                    $message.progress = progress;
                },
                link: function($scope, element) {
                    element.addClass('notify-container');
                }
            };
        }]);

    module.directive('notifyMessage', ['$templateCache', '$http', '$compile', '$log', '$templateRequest', 'UtilService',
        function($templateCache, $http, $compile, $log, $templateRequest, UtilService) {
            return {
                restrict: 'AE',
                require: '^notify',
                scope: false,
                transclude: true,
                replace: true,
                link: function($scope, element, attrs, message) {
                    var isHubApp = UtilService.isHub();
                    var DEFAULT_TEMPLATE_URL = isHubApp ? "app-v2/notify/templates/defaultMessageTemplateHub.html" : "app-v2/notify/templates/defaultMessageTemplate.html",
                        url = $scope.message.templateUrl || DEFAULT_TEMPLATE_URL;
                    var template = $templateCache.get(url);
                    $templateRequest(url)
                        .then(function(templateData) {
                            populateDialog(angular.element(templateData));
                        })
                        .catch(function(e) {
                            $log.error('Failed to load template: ' + url + ' [' + e.message + ']');
                        });
                    function populateDialog(template) {
                        $compile(template)($scope, function(clonedElement) {
                            element.append(clonedElement);
                        });
                    }
                }
            };
        }]);

    module.provider('$notify', function() {
        var defaultTimeouts = {
            // time before messages will be dismissed, in milliseconds:
            success: 3000,
            error: 0, // no auto-dismiss
            info: 0,
            warning: 10000,
            progress: 3000
        };
        var incrementalDelay = 100; // delay between multiple messages requested at once.
        var messagesQueue = [];
        var message = [];

        this.$get = ['Localization', '$timeout', '$rootScope', function(Localization, $timeout, $rootScope) { //noinspection JSValidateTypes
            function show(messageArray) {
                var delay = 0;
                if (!angular.isArray(messageArray)) {
                    messageArray = [messageArray];
                }
                messageArray.forEach(function(msg) {
                    var timeout = angular.isDefined(msg.timeout) ? msg.timeout :
                        (defaultTimeouts[msg.type] || 0);
                    function isMsgPresent(existingMsg) {
                        return existingMsg.text === msg.text;
                    }
                    var duplicate = messagesQueue.filter(isMsgPresent).length > 0;
                    // avoid duplicates, both for ux and ng-repeat
                    if (duplicate) {
                        return;
                    }
                    //close( duplicate );
                    // space out the messages in time, for improved animation
                    messagesQueue.push(msg);
                    //message.splice(0,message.length);
                    message.push(msg);
                    if (timeout) {
                        // schedule the auto-dismiss
                        $timeout(function() {
                            close(messagesQueue.indexOf(msg));
                        }, timeout);
                    }
                    delay = delay + incrementalDelay;
                });
            }

            function info(messageKey, params, templateUrl, arg) {
                showMessage("info", messageKey, params, templateUrl, arg);
            }

            function error(messageKey, params, templateUrl, arg) {
                showMessage("error", messageKey, params, templateUrl, arg);
            }

            function warning(messageKey, params, templateUrl, arg) {
                showMessage("warning", messageKey, params, templateUrl, arg);
            }

            function success(messageKey, params, templateUrl, arg) {
                showMessage("success", messageKey, params, templateUrl, arg);
            }

            function progress(messageKey, params, templateUrl, arg) {
                showMessage("progress", messageKey, params, templateUrl, arg);
            }

            function close(msgOrIndex, params) {
                var duplicate = msgOrIndex;
                if (angular.isString(msgOrIndex)) {
                    var msgToClose = Localization.getLocalizedString(msgOrIndex, params ? params : []);
                    duplicate = messagesQueue.indexOf(messagesQueue.filter(function(item) {
                        return item.text === msgToClose;
                    })[0]);
                }
                if (duplicate >= 0) {
                    $rootScope.$applyAsync(function() {
                        messagesQueue.splice(duplicate, 1);
                        message.splice(duplicate, 1);
                    });
                }
            }

            function closeAll() {
                if (message && message.length > 0) {
                    $rootScope.$applyAsync(function() {
                        for (var i = message.length - 1; i >= 0; i--) {
                            messagesQueue.splice(i, 1);
                            message.splice(i, 1);
                        }
                    });
                }
            }

            function showMessage(messageType, message, params, templateUrl, arg) {
                close(message); // If same message is already open, close it.
                var msg = {};
                msg.type = messageType;
                msg.text = Localization.getLocalizedString(message, params ? params : []);
                msg.argument = arg ? arg : "";

                if (templateUrl) {
                    msg.templateUrl = templateUrl;
                }
                $rootScope.$applyAsync(function() {
                    show(msg);
                });
            }

            return {
                message: message,
                show: show,
                success: success,
                warning: warning,
                error: error,
                info: info,
                close: close,
                progress: progress,
                showMessage: showMessage,
                closeAll: closeAll
            };
        }];
    });
})(angular.module('com.vmware.workspace.components.notify', []));
