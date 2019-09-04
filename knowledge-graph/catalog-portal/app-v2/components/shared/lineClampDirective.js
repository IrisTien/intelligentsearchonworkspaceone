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

(function(module) {
    'use strict';
    // For iOS i use Arial which is more reliable, 'San Francisco' or 'Helvetica Neue' are the default ios fonts, however I do not have lower versions of iphones
    // The difference is trivial
    var defaultFontSize = '12px',
        iOSDefaultFontFamily = 'SF NS Text',
        androidDefaultFontFamily = 'Roboto',
        // canvas
        defaultFontWeight = 'bold';

    module.directive('lineClamp3', ['$timeout', '$window', "UserAgent", function($timeout, $window, UserAgent) {
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
                // if the lines is equal 1 then use css text overlfow ellipsis
                if (window.getComputedStyle(elt).whiteSpace === 'nowrap' || options.lines == 1) {
                    elt.textContent = options.content;
                    return;
                }

                var content = options.content,
                    eltHeight = elt.scrollHeight,
                    maxHeight = getMaxHeight(elt, options.lines),
                    length;

                var wordsArray = [];
                wordsArray = content.split(" ");

                var findLongestWord = function(array) {
                    var longest = array.reduce(function(a, b) {
                        return (a.length > b.length) ? a : b;
                    });
                    return longest;
                };

                var longWordExist = false,
                    longestWord = findLongestWord(wordsArray);

                function getTextWidth(text, font) {
                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext("2d");
                    context.font = font;
                    var metrics = context.measureText(text);
                    return metrics.width;
                }

                var cs = window.getComputedStyle(elt),
                    currentFontSize = '',
                    currentFontFamily = '',
                    currentFont = '',
                    longestWordWidth,
                    containerWidth = angular.element(elt).width();

                // For hub app only two fonts were used, one is SF another is android, no need to use css to get the font
                currentFontFamily = UserAgent.isAndroid() ? androidDefaultFontFamily : iOSDefaultFontFamily;
                currentFontSize = (cs.fontSize !== null || cs.fontSize !== undefined) ? cs.fontSize : defaultFontSize;
                currentFont = defaultFontWeight + ' ' + currentFontSize + ' ' + currentFontFamily;

                longestWordWidth = getTextWidth(longestWord, currentFont);

                // Only apply the word wrap if there is a word longer than the container
                if (longestWordWidth > containerWidth) {
                    longWordExist = true;
                }

                //In hub app we use webkit and there is no word longer than the container let -webkit- handle the multiline ellipsis through css
                if (!longWordExist) {
                    elt.textContent = options.content;
                    return;
                } else {
                    // apply the word-break only if there is a long word
                    angular.element(elt).css("word-break", "break-all");
                }

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

            // If the lineHeight is available as a number use that, otherwise calculate it -- heightly recommend to define a line-height through css
            // We had seen issue with IE9 before
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
})(angular.module("com.vmware.greenbox.appCenter"));
