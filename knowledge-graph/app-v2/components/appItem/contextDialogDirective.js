(function(module) {
    'use strict';
    module.directive("contextdialog", ['$compile', '$timeout', '$rootScope', "$templateCache", "$http", "UserAgent", "$window", function($compile, $timeout, $rootScope, $templateCache, $http, UserAgent, $window) {
        var templateLoaded = {};
        var closeMenu;
        var contextEvents;
        var _prepareContextdialog = function(scope, attrs, uris) {
            if (!uris) {
                return;
            }

            angular.forEach(uris, function(value, key) {
                if (value) {
                    var templateUrl = attrs[key] || attrs[angular.lowercase(key)];
                    if (templateUrl) {
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
                    var stockTCget = $templateCache.get;
                    $templateCache.get = function(cacheId) {
                        var got = stockTCget(cacheId);
                        return angular.isArray(got) ? got[1] : got;
                    };

                    closeMenu = angular.noop;

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

                                element.closest('.app-label-container').addClass('contextmenu-on');

                                contextdialog.on('click touchstart', function(e) {
                                    e.stopPropagation();
                                });

                                element.append(contextdialog);

                                attrs.$set("contextdialogId", "#" + contextdialog.attr("id"));
                            }

                            angular.element($window).on('resize', function() {
                                var viewportSize = $window.innerWidth;

                                angular.element('.global-container-browser').find(".appitem-contextdialog-container").remove();
                                element.append(contextdialog);

                                calculateDirection(element, contextdialog);
                            });

                            // determine which corner of the element to place the menu at
                            $timeout(function() { //Need to run after current digest cycle to find the right size of the menu
                                calculateDirection(element, contextdialog);
                            }, 0, false);

                            // Close the context menu when a click event happen at somewhere else.
                            closeMenu = function(event) {
                                //This code should always sit at the beginning.
                                if (event && (!event.data || !event.data.propagate)) {
                                    event.stopPropagation();
                                }

                                // Unbind the handlers when closing contextdialog.
                                $(document).off('click touchstart', closeMenu);
                                contextdialog.off('click', 'a, button', closeMenu);
                                angular.element($window).off('resize');
                                element.closest('.app-label-container').removeClass('contextmenu-on');

                                contextdialog.remove();

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
            var pane = element.closest('.content-container-scrollable, body'),
                paneCoords = pane.offset(),
                elementCoords = element.offset(),
                dialogWidth = contextdialog.find('.appitem-contextdialog-actions-list').outerWidth(),
                dialogHeight = contextdialog.find('.appitem-contextdialog-actions-list').outerHeight(),
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

            // context dialog from modal not closing clicking outside
            // need to add this to make that work
            $('.modal-container').on('click touchstart', closeMenu);
        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
