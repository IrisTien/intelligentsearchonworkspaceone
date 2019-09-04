/*
 * contextdialogDirective - Selectively set a context menu for an element, render the context menu at proper position
 * on right click and dismiss the context menu when click/right click event happens at other places.
 *
 * In a repeater, different context menu could be set for different type of model item.
 *
 * @restrict attribute
 *
 * Example:
 * <div contextdialog="{uris:{templateRef1:boolean expression1, templateRef2:boolean expression2} , scope:{app:app}}"
 * templateRef1="/SAAS/horizon/portal/launcher/desktop/launcherContextmenu.html"></div>
 *
 * uris object: templateRef1 specifies the templateUrl that will be shown as context menu.
 * scope object: contains the variables that we want to pass to context menu scope.
 */
(function(module) {
    'use strict';
    module.directive("actionsheet", ['$compile', '$timeout', '$rootScope', '$templateCache', '$http', '$location', 'UpdateUrlParamsService', function($compile, $timeout, $rootScope, $templateCache, $http, $location, UpdateUrlParamsService) {
        /**
         * Private method to select context menu element.
         * Define here for not polluting the paradigm to define a directive.
         *
         * @param scope
         * @param attrs
         * @param uris Object that contains URIs of context menu elements.
         * @private
         */

        var templateLoaded = {};
        var closeMenu;
        var contextEvents;
        var _prepareContextdialog = function(scope, attrs, uris) {
            if (!uris) {
                return;
            }

            angular.forEach(uris, function(value, key) {
                if (value) {
                    //If the key is also an attribute in this element, its value templateUrl.
                    //We try the lowercase of the key because the key as an attribute might be lowercased by browser.
                    var templateUrl = attrs[key] || attrs[angular.lowercase(key)];
                    if (templateUrl) {
                        //Load the template for future use.
                        if (!$templateCache.get(templateUrl) && !templateLoaded[templateUrl]) { //Load it if it is not in cache.
                            templateLoaded[templateUrl] = true;
                            $http.get(templateUrl, {cache: $templateCache}).then(function(response) {}, function() {
                                    templateLoaded[templateUrl] = false;
                                });
                        }
                        //Set context menu template id so that we can fetch it later from $templateCache.
                        attrs.$set("contextdialogTmplId", templateUrl);
                    }
                }
            });
        };

        return {
            restrict: 'A',
            controller:
                function() {
                    // $templateCache.get returns a string if the template is defined
                    // from JS or HTML <script>, but it returns an array if it had to make
                    // an http request.  Our code assumes it always returns a string, so
                    // we patch it here to make it so.
                    var stockTCget = $templateCache.get;
                    $templateCache.get = function(cacheId) {
                        var got = stockTCget(cacheId);
                        return angular.isArray(got) ? got[1] : got;
                    };

                    //As $http sends async call, we do not know if a request for a template is sent yet.
                    //We use this hash to mark if the context menu template is being loaded.
                    closeMenu = angular.noop;

                    //for v3.0 new trigger event is "click"
                    contextEvents = 'click';
                },
            bindToController: true,
            link: function(scope, element, attrs) {
                var target = attrs.actionsheet;

                if (!target) {
                    return;
                }

                var contextdialogOptions = scope.$eval(target);

                //prepare context menu
                _prepareContextdialog(scope, attrs, contextdialogOptions.uris);

                element.on(contextEvents, function(contextmenuEvent) {
                    contextmenuEvent.preventDefault();
                    contextmenuEvent.stopPropagation();

                    scope.$apply(function() {
                        // Close any other context menu before opening a new one
                        // If no context menu is open,it will be a no-op.
                        closeMenu();

                        // If context menu is registered
                        if (attrs.contextdialogTmplId) {
                            // Show the context menu, show it beneath the dots
                            var contextdialog;
                            // Look for a context menu already on this element
                            if (!attrs.contextdialogId) {
                                var contextdialogScope = scope.$new();
                                angular.extend(contextdialogScope, contextdialogOptions.scope);
                                contextdialog = $compile($templateCache.get(attrs.contextdialogTmplId))(contextdialogScope);
                                contextdialog.attr("id", "hzn" + new Date().getTime());

                                UpdateUrlParamsService.hideNativenav().then(function() {
                                    angular.element('.global-container').append(contextdialog);
                                    //delaying adding the class after the contextdialog is appended to the DOM to ensure the animation happens
                                    $timeout(function() {
                                        angular.element('.global-container').addClass('actionsheet-on');
                                    }, 25, false);
                                });

                                attrs.$set("contextdialogId", "#" + contextdialog.attr("id"));
                            }

                            // Close the context menu when a click event happen at somewhere else.
                            closeMenu = function(event) {
                                if (event) {
                                    var targetClass = event.target.getAttribute('class');
                                    // When this directive is used, click on links with "nativenav-show" class will invoke the util service
                                    // This is to prevent flickering on notification page and also details page
                                    if (targetClass.indexOf('nativenav-show') !== -1) {
                                        UpdateUrlParamsService.showNativenav();
                                    }
                                }

                                // Unbind the handlers when closing contextdialog.
                                $(document).off('click', closeMenu);
                                contextdialog.off('click', 'a, button', closeMenu);

                                angular.element('.global-container').removeClass('actionsheet-on');

                                //delay the removal until the animation finishes
                                $timeout(function() {
                                    contextdialog.remove();
                                }, 355, false);

                                attrs.$set("contextdialogId", "");
                                closeMenu = angular.noop;
                            };

                            // If the element is wrapped in an <a> or <button> tag click on it will remove the contextdialog
                            // Need special handle of the nativenav hide and show situation
                            // Changed to bind to avoid compication, on caused problem of not dismiss the dialogbox
                            contextdialog.bind('click', 'a, button', closeMenu);
                        }
                    });
                });
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
