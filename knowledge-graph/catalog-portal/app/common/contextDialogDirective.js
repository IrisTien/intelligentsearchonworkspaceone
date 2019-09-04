"use strict";

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
    module.directive("contextdialog", ['$compile', '$timeout', '$rootScope', "$templateCache", "$http", "UserAgent", "$window" , function($compile, $timeout, $rootScope, $templateCache, $http, UserAgent, $window){
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

            angular.forEach (uris, function(value, key) {
                if (value) {
                    //If the key is also an attribute in this element, its value templateUrl.
                    //We try the lowercase of the key because the key as an attribute might be lowercased by browser.
                    var templateUrl = attrs[key] || attrs[angular.lowercase(key)];
                    if (templateUrl) {
                        //Load the template for future use.
                        if (!$templateCache.get(templateUrl) && !templateLoaded[templateUrl]) { //Load it if it is not in cache.
                            templateLoaded[templateUrl] = true;
                            $http.get(templateUrl, {cache:$templateCache}).success(function(response) {
                            }).error(function() {
                                    templateLoaded[templateUrl] = false;
                                });
                        }
                        //Set context menu template id so that we can fetch it later from $templateCache.
                        attrs.$set("contextdialogTmplId", templateUrl);
                    }
                }
            });
        };
        /**
         * Check if the 2 events are triggered by the same action, e.g. Long press triggers long-hold event, and at the
         * same time may trigger click event.
         * The idea is if the event is a by-product of the other, they happen at the same position. 1 exception is iOS7
         * Safari, the positions have 1 or 2 pixels different.
         *
         * @param event1
         * @param event2
         * @return {Boolean}
         * @private
         */
        var _firedBySameAction = function(event1, event2) {
            if (!event1 || !event2) {
                return false;
            }
            return Math.abs(event1.pageX - event2.pageX) < 3 && Math.abs(event1.pageY == event2.pageY) < 3;
        };

        return {
            restrict : 'A',
            controller :
                function() {
                    // $templateCache.get returns a string if the template is defined
                    // from JS or HTML <script>, but it returns an array if it had to make
                    // an http request.  Our code assumes it always returns a string, so
                    // we patch it here to make it so.
                    var stockTCget = $templateCache.get;
                    $templateCache.get = function (cacheId) {
                        var got = stockTCget(cacheId);
                        return angular.isArray(got) ? got[1] : got;
                    };

                    //As $http sends async call, we do not know if a request for a template is sent yet.
                    //We use this hash to mark if the context menu template is being loaded.
                    closeMenu   = angular.noop;
                    var useTouch = Modernizr && Modernizr.touch;
                    contextEvents = 'contextmenu' + (useTouch ? ' hold' : '');

                },
            bindToController : true,
            link: function(scope, element, attrs) {
                var target = attrs.contextdialog;
                if (!target) {
                    return;
                }

                var contextdialogOptions = scope.$eval(target);

                //prepare context menu
                _prepareContextdialog(scope, attrs, contextdialogOptions.uris);

                scope.$watch('$location.path', function() { closeMenu(); });

                element.bind(contextEvents, function(contextmenuEvent) {
                    contextmenuEvent.preventDefault();
                    contextmenuEvent.stopPropagation();

                    scope.$apply(function() {
                        // Close any other context menu before opening a new one
                        // If no context menu is open,it will be a no-op.
                        closeMenu();

                        if (scope.sortableGrid) {
                            // TODO: break this coupling with sortableGrid
                            // Disable DnD while contextmenu is active
                            scope.sortableGrid.disabledByContextdialog = scope.sortableGrid.enabled;
                            scope.sortableGrid.enabled = false;
                        }

                        // If context menu is registered
                        if (attrs.contextdialogTmplId) {
                            // Show the context menu, show it at mouse click position.

                            var contextdialog;
                            // Look for a context menu already on this element
                            if (!attrs.contextdialogId) {
                                var contextdialogScope = scope.$new();
                                angular.extend(contextdialogScope, contextdialogOptions.scope);
                                contextdialog = $compile($templateCache.get(attrs.contextdialogTmplId))(contextdialogScope);
                                contextdialog.attr("id", "hzn" + new Date().getTime());

                                // Don't let clicks bubble up
                                contextdialog.on('click', function (e) {
                                    e.stopPropagation();
                                });

                                element.append(contextdialog);
                                attrs.$set("contextdialogId", "#" + contextdialog.attr("id"));
                            } else {
                                contextdialog = element.children(attrs.contextdialogId);
                            }

                            var delayTime = 0;
                            if(UserAgent.isMobile() && contextmenuEvent.originalEvent){
                                delayTime = 500;
                            }
                            angular.element($window).on('resize.contextmenu', function(){
                                calculateDirection(element, contextdialog);
                            });
                            // determine which corner of the element to place the menu at
                            $timeout(function () { //Need to run after current digesst cycle to find the right size of the menu
                                calculateDirection(element, contextdialog);
                            }, delayTime, false);

                            // Long hold ends when context menu appears.
                            $rootScope.isLongHold = false;

                            // Close the context menu when a click event happen at somewhere else.
                            closeMenu = function (event) {
                                //This code should always sit at the beginning.
                                if (event && (!event.data || !event.data.propagate)) {
                                    event.stopPropagation();
                                }

                                if (scope.sortableGrid) {
                                    // TODO: break this coupling with sortableGrid
                                    // Disable DnD while contextmenu is active
                                    scope.sortableGrid.enabled = scope.sortableGrid.disabledByContextdialog;
                                }


                                // Check if this event is a by-product of long press. The number of the by-product events can
                                // be 0, 1, or 2 on different browsers. The previous method works only if the number is 1.
                                // If it is 0, users have to tap twice to dismiss the context menu. If 2, context menu flashes.
                                if (_firedBySameAction(contextmenuEvent, event)) {
                                    return;
                                }

                                // Ignore the duplicated event. 2 events are fired for right click:
                                // contextmenu event and click event with event.button == 2(right button).
                                // It should be an angularjs bug on Firefox.
                                if (event && event.type == "click" && event.button == 2) {
                                    return;
                                }

                                // Unbind the handlers when closing contextdialog.
                                $(document).unbind('contextmenu', closeMenu);
                                $(document).unbind('click', closeMenu);
                                contextdialog.off('click', 'a, button', closeMenu);
                                angular.element($window).off('resize.contextmenu');

                                // If the contextdialog is in a box, unset the 'has-overflow'
                                // state.  This assumes that there isn't some other element
                                // overflowing the box (like a tooltip).  If we ever do need
                                // to have two elements overflowing simultaneously, we'll have
                                // to coordinate them.
                                contextdialog.closest('.box')
                                    .removeClass('has-overflow');

                                // Remove the context menu for mobile devices. So it will work perfectly cross-browser and
                                // cross-devices.
                                contextdialog.removeClass("ng-show").addClass('ng-hide');

                                closeMenu = angular.noop;
                            };

                        }
                    });
                });
            }
        };

        function calculateDirection (element, contextdialog) {
            var pane = element.closest('.pane, body'),
                paneCoords = pane.offset(),
                elementCoords = element.offset(),
                dialogWidth = contextdialog.outerWidth(),
                dialogHeight = contextdialog.outerHeight(),
                vert = 'south',
                horiz = '',
                dir;

            paneCoords.right = paneCoords.left + pane.outerWidth();
            paneCoords.bottom = paneCoords.top + pane.outerHeight();
            elementCoords.right = elementCoords.left + element.outerWidth();
            elementCoords.bottom = elementCoords.top + element.outerHeight();

            if( elementCoords.top + dialogHeight > paneCoords.bottom &&
                elementCoords.bottom - dialogHeight >= paneCoords.top ) {
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

            dir = vert + horiz + '-';

            contextdialog
                .removeClass('north- northeast- northwest- south- southeast- southwest-')
                .addClass('ng-show ' + dir)
                .removeClass('ng-hide invisible');

            // Clicking any button/link on the contextdialog should close it
            contextdialog.on('click', 'a, button', closeMenu);

            //jqlite doesn't allow to pass the event data so, using jquery for event binding.
            $(document).bind('contextmenu', closeMenu);
            $(document).bind('click', {propagate:true}, closeMenu);

            // By default, boxes hide overflow.  Since the contextdialog
            // is likely to overflow the box, set the 'has-overflow'
            // state on the box.
            contextdialog.closest('.box')
                .addClass('has-overflow');
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
