// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module) {
    module.directive('toast', ['$http', '$compile', '$templateCache', '$log', '$templateRequest', '$toast',
        function($http, $compile, $templateCache, $log, $templateRequest, $toast) {
            return {
                restrict: 'AE',
                scope: true,
                bindToController: true,
                controller: function($scope, $element) {
                    var $message = this;
                    var TEMPLATE_URL = "app-v2/toast/templates/messageContextTemplate.html";
                    var messages = $toast.message;

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
                        $toast.show(messageArray);
                    }

                    function toast(messageKey, params, templateUrl) {
                        $toast.showMessage("toast", messageKey, params, templateUrl);
                    }

                    // Close a message dialog.
                    function close(index) {
                        $toast.close(index);
                    }

                    $scope._messagesArray_ = messages;
                    $scope.close = close; // TODO: remove? we have $message.close

                    $message.toast = toast;
                    $message.show = show;
                    $message.close = close;
                },
                link: function($scope, element) {
                    element.addClass('toast-container');
                }
            };
        }]);

    module.directive('toastMessage', ['$templateCache', '$http', '$compile', '$log', '$templateRequest',
        function($templateCache, $http, $compile, $log, $templateRequest) {
            return {
                restrict: 'AE',
                require: '^toast',
                scope: false,
                transclude: true,
                replace: true,
                link: function($scope, element, attrs, message) {
                    var DEFAULT_TEMPLATE_URL = "app-v2/toast/templates/defaultMessageTemplate.html",
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

    module.provider('$toast', function() {
        var defaultTimeouts = {
            // time before messages will be dismissed, in milliseconds:
            toast: 0,
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
                    var timeout = angular.isDefined(msg.timeout) ? msg.timeout : (defaultTimeouts[msg.type] || 0);
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

            function toast(messageKey, params, templateUrl, arg) {
                showMessage("toast", messageKey, params, templateUrl, arg);
            }

            function error(messageKey, params, templateUrl, arg) {
                showMessage("error", messageKey, params, templateUrl, arg);
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
                toast: toast,
                close: close,
                showMessage: showMessage,
                closeAll: closeAll
            };
        }];
    });
})(angular.module('com.vmware.workspace.components.toast', []));
