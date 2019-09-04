/*
 * lineClampDirective:
 * This directive is intended to be a cross-browser solution to emulate
 * text-overflow: ellipsis support for multiline elements. As of writing this,
 * the only way to do this through CSS is using non-standard webkit or opera
 * vendor properties.
 *
 * Dependencies: 
 * lodash
 *
 * Usage:
 * Add the line-clamp attribute to your element and specify the content as well
 * as how many lines to allow before truncating.
 *
 * Example:
 * <p line-clamp content="text string" lines="2"></p>
 *
 * Notes:
 * The directive logic will execute each time the window resize event is triggered, but
 * will not execute if the element has CSS white-space: nowrap.
 * */

(function(module){
    'use strict';

    module.directive('lineClamp', ['$timeout', '$window', function($timeout, $window) {
        return {
            link: link,
            replace: true,
            restrict: 'A',
            scope: {
                content: '=',
                lines: '='
            },
            template: '<p>{{::content}}</p>'
        };

        function link($scope, element) {
            var w = angular.element($window),
                options = {
                    content: $scope.content.trim(),
                    lines: $scope.lines
                },
                debouncedClamp = _.debounce(function() {
                    clamp(element[0], options);
                }, 100),
                ELLIPSIS = '\u2026';

            w.bind('resize', debouncedClamp);

            $scope.$on('$destroy', function() {
                w.unbind('resize', debouncedClamp);
            });

            // Using $timeout to give it time to bind the value to the template.
            $timeout(debouncedClamp, 0, false);

            function clamp(elt, options) {
                // If nowrap, text is forced to overflow horizontally and we have
                // no way to know where to truncate, so let the webview handle it.
                if (window.getComputedStyle(elt).whiteSpace === 'nowrap') {
                    elt.textContent = options.content;
                    return;
                }

                var content = options.content,
                    eltHeight = elt.scrollHeight,
                    maxHeight = getMaxHeight(elt, options.lines),
                    length;

                // No truncation needed
                if (eltHeight <= maxHeight) {
                    return;
                }

                // Truncate by character until the height does not exceed maxHeight.
                for (length = content.length; length && elt.scrollHeight > maxHeight; --length) {
                    content = content.substring(0, length);
                    elt.textContent = content.trim() + ELLIPSIS;
                }
            }

            // Get the minimum among explicit values and the calculated
            // value based on lines to clamp.
            function getMaxHeight(elt, lines) {
                var lineHeight = getLineHeight(elt),
                    maxHeight = lines * lineHeight,
                    computedStyle = window.getComputedStyle(elt),
                    cssHeight = parseFloat(computedStyle.height),
                    cssMaxHeight = parseFloat(computedStyle.maxHeight),
                    possibleValues = [maxHeight],
                    errorMargin;

                if (!isNaN(cssHeight)) {
                    possibleValues.push(cssHeight);
                }
                if (!isNaN(cssMaxHeight)) {
                    possibleValues.push(cssMaxHeight);
                }

                // Take the most restrictive (smallest) value as the maxHeight.
                maxHeight = Math.min.apply(Math, possibleValues);

                // Account for font rendering where the actual height of the
                // first line can be greater than the lineHeight value.
                errorMargin = Math.max(lineHeight / 4.0, 1); // 25% is arbitrary but seems to be a be a good baseline.

                return maxHeight + errorMargin;
            }

            // If the lineHeight is available as a number use that,
            // else calculate it manually.
            function getLineHeight(elt) {
                var lineHeightCss = window.getComputedStyle(elt).lineHeight,
                    lineHeightValue = parseFloat(lineHeightCss);

                return isNaN(lineHeightValue) ? calculateLineHeight(elt) : lineHeightValue;
            }

            // Calculate the local line height by cloning the element to create
            // a duplicate context, appending a new line and comparing the height
            // difference.
            function calculateLineHeight(elt) {
                var clone = elt.cloneNode(),
                    height1, height2;

                elt.appendChild(clone);

                clone.innerHTML = '<br />';
                height1 = clone.scrollHeight;
                clone.innerHTML = '<br /><br />';
                height2 = clone.scrollHeight;

                elt.removeChild(clone);

                return height2 - height1;
            }
        }
    }]);
})( angular.module("com.vmware.workspace.components.lineClamp", []) );