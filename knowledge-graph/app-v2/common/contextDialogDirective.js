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
    module.directive("contextdialog", ['$compile', '$timeout', '$rootScope', "$templateCache", "$http", "UserAgent", "$window", function($compile, $timeout, $rootScope, $templateCache, $http, UserAgent, $window) {
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

                    //for v3.0 new trigger event is "click" not "right-click aka contextmenu"
                    contextEvents = 'click';
                },
            bindToController: true,
            link: function(scope, element, attrs) {
                var target = attrs.contextdialog;

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

                        var transitionpoint = parseInt(attrs.contextdialogtp);

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

                                //TODO maybe move the classes onto the attributes to make this directive more extensible
                                element.closest('.bookmark-app-item').addClass('contextmenu-on');

                                // Don't let click and touchstart event bubble up
                                // otherwise the actiions(launch app, see details or removeBookmark functions will not be executed
                                contextdialog.on('click touchstart', function(e) {
                                    e.stopPropagation();
                                });

                                if (UserAgent.isAWJadeMobile() && !UserAgent.isAWJadeDocked() || $window.innerWidth < transitionpoint) {
                                        // Append to the bottom of the global container, otherwise the slide animation can not be achieved
                                        angular.element('.global-container').append(contextdialog);
                                } else {
                                    element.append(contextdialog);
                                }

                                attrs.$set("contextdialogId", "#" + contextdialog.attr("id"));
                            }

                            angular.element($window).on('resize', function() {
                                var viewportSize = $window.innerWidth;
                                // append contextDialog to the .global-container if the

                                if (UserAgent.isAWJadeMobile() && !UserAgent.isAWJadeDocked() || $window.innerWidth < transitionpoint) {
                                    contextdialog.remove();
                                    angular.element('.global-container').append(contextdialog);
                                } else {
                                    angular.element('.global-container').find(".bookmark-contextdialog-container").remove();
                                    element.append(contextdialog);
                                }

                                calculateDirection(element, contextdialog);

                                if (viewportSize < transitionpoint || UserAgent.isAWJadeMobile() && !UserAgent.isAWJadeDocked()) {
                                    contextdialog.removeClass('north northeast northwest south southeast southwest');
                                }
                            });

                            // determine which corner of the element to place the menu at
                            $timeout(function() { //Need to run after current digest cycle to find the right size of the menu
                                var viewportSize = $window.innerWidth;
                                calculateDirection(element, contextdialog);

                               if (viewportSize < transitionpoint || UserAgent.isAWJadeMobile() && !UserAgent.isAWJadeDocked()) {
                                   contextdialog.removeClass('north northeast northwest south southeast southwest');
                               }
                            }, 0, false);

                            // Close the context menu when a click event happen at somewhere else.
                            closeMenu = function(event) {
                                //This code should always sit at the beginning.
                                if (event && (!event.data || !event.data.propagate)) {
                                    event.stopPropagation();
                                }

                                // Unbind the handlers when closing contextdialog.
                                // for iPad iPad Pro the "click" need to use touchstart otherwise the closeMenu does not work
                                $(document).off('click touchstart', closeMenu);
                                contextdialog.off('click', 'a, button', closeMenu);
                                angular.element($window).off('resize');
                                element.closest('.bookmark-app-item').removeClass('contextmenu-on');
                                //also wait for the animation finish to remove the class
                                angular.element('.global-container').removeClass('bookmark-contextdialog-on');

                                //delay the removal until the animation finishes if it is in smaller viewport size
                                // or through ws-shell

                               if ($window.innerWidth < transitionpoint || UserAgent.isAWJadeMobile() && !UserAgent.isAWJadeDocked()) {
                                    $timeout(function() {
                                        contextdialog.remove();
                                    }, 355, false);
                                } else {
                                    contextdialog.remove();
                                }

                                attrs.$set("contextdialogId", ""); // element.removeAttr("contextdialogId") did not work
                                closeMenu = angular.noop;
                            };
                        }
                    });
                });
            }
        };

        function calculateDirection(element, contextdialog) {
            // need to use .content-container instead of .content as content can be exceed viewport size
            // depending on the apps we have
            var pane = element.closest('.content, body'),
                paneCoords = pane.offset(),
                elementCoords = element.offset(),
                dialogWidth = contextdialog.find('.bookmark-contextdialog-content').outerWidth(),
                dialogHeight = contextdialog.find('.bookmark-contextdialog-content').outerHeight(),
                vert = 'south',
                horiz = '',
                dir;

            paneCoords.right = paneCoords.left + pane.outerWidth();
            paneCoords.bottom = paneCoords.top + pane.outerHeight();
            elementCoords.right = elementCoords.left + element.outerWidth();
            elementCoords.bottom = elementCoords.top + element.outerHeight();

            if (elementCoords.top + dialogHeight > paneCoords.bottom &&
                elementCoords.bottom - dialogHeight >= paneCoords.top) {
                // we can't place the menu below, but we can place it above
                vert = 'north';
            }

            if (elementCoords.left + dialogWidth <= paneCoords.right) {
                // place it to the left if we can
                horiz = 'east';
            } else if (elementCoords.right - dialogWidth >= paneCoords.left) {
                // or to the right if we can
                horiz = 'west';
            }

            dir = vert + horiz;

            contextdialog.removeClass('north northeast northwest south southeast southwest')
                .addClass(dir);

            // Clicking any button/link on the contextdialog should close it
            // Not working on the removeBookmark link -- can not figure out
            contextdialog.on('click', 'a, button', closeMenu);

            // Added touchstart for iPad and iPad Pro otherwise if you click outside of
            // the contextDialog box the box will not be dismissed
            $(document).on('click touchstart', {propagate: true}, closeMenu);
            angular.element('.global-container').addClass('bookmark-contextdialog-on');
        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
