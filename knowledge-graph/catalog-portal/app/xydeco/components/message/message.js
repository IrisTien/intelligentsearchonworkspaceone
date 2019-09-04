// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {
    module.directive('messageContext', ['$http', '$compile', '$templateCache', '$log', '$templateRequest', 'Localization',
        function ($http, $compile, $templateCache, $log, $templateRequest, Localization) {
            return {
                restrict: 'AE',
                scope: true,
                controllerAs: '$message',
                bindToController: true,
                controller: function ($scope, $element) {
                    var $message = this;
                    var TEMPLATE_URL = "components/message/templates/messageContextTemplate.html";
                    $scope._messagesArray_ = [];
                    $templateRequest(TEMPLATE_URL)
                        .then( function(templateData){
                            $compile(angular.element(templateData))($scope, function (clonedElement) {
                                angular.element($element).append(clonedElement);
                            });
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + TEMPLATE_URL + ' [' + e.message + ']');
                        });

                    function show (messagesArray) {
                        if(!angular.isArray(messagesArray) && angular.isObject(messagesArray)){
                            messagesArray = [messagesArray];
                        }
                        $scope._messagesArray_ = messagesArray;
                        $scope.close = close;
                    };

                    function info(messageKey, params, templateUrl) {
                        showMessage("info", messageKey, params, templateUrl);
                    }

                    function error(messageKey, params, templateUrl) {
                        showMessage("error", messageKey, params, templateUrl);
                    }

                    function warning(messageKey, params, templateUrl) {
                        showMessage("warning", messageKey, params, templateUrl);
                    }

                    function success(messageKey, params, templateUrl){
                        showMessage("success", messageKey, params, templateUrl);
                    }

                    function showMessage(messageType, message, params, templateUrl) {
                        var msg = {};
                        msg.type = messageType;
                        msg.text = Localization.getLocalizedString(message, params ? params : []);
                        if (templateUrl) {
                            msg.templateUrl = templateUrl;
                        }

                        show(msg);
                    }

                    // Close a message dialog.
                    function close (index) {
                        if (index >= 0 && angular.isArray($scope._messagesArray_)){
                            $scope._messagesArray_.splice(index, 1);
                        }
                    };

                    $message.info = info;
                    $message.error = error;
                    $message.warning = warning;
                    $message.success = success;
                    $message.show = show;
                    $message.close = close;
                },
                link : function($scope, element) {
                    element.addClass('message-context');
                }
            };
        }]);
    module.directive('message',   ['$templateCache', '$http', '$compile', '$log', '$templateRequest',
        function ($templateCache, $http, $compile, $log, $templateRequest) {
            return {
                restrict: 'AE',
                require: '^messageContext',
                scope: false,
                transclude: true,
                replace: true,
                link: function ($scope, element, attrs, message) {
                    var DEFAULT_TEMPLATE_URL = "components/message/templates/defaultMessageTemplate.html",
                        url = $scope.message.templateUrl || DEFAULT_TEMPLATE_URL;
                    var template = $templateCache.get(url);
                    $templateRequest(url)
                        .then( function(templateData){
                            populateDialog(angular.element(templateData));
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + url + ' [' + e.message + ']');
                        });
                    function populateDialog(template){
                        $compile(template)($scope, function (clonedElement) {
                            element.append(clonedElement);
                        });
                    };

                }
            };
        }]);
})(angular.module('com.vmware.workspace.components.message', []));
