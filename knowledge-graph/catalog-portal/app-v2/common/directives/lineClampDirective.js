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

    var defaultFontSize = '14px',
        defaultFontFamily = 'Open Sans Regular';

    module.directive('lineClamp2', ['$timeout', '$window', "UserAgent", function($timeout, $window, UserAgent) {
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

                var longWordExist = false;
                var longestWord = findLongestWord(wordsArray);
                //use canvas measureText method to get the longest word width
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');

                var cs = window.getComputedStyle(elt);

                var fontFamilies = [],
                    currentFontFamily = '';

                // This will be complicated if the font-size is defined using inherite ornot defined
                // The easiest way to whenever a line-clamp is used, a specific font-size and font-family should be defined
                // otherwise just use the default font and size for this app
                // relative units "em" or "inherit" will be tricky to track and here use the most simplified way
                // This will be a good estimate for this app, font-size will be 14px for most of the text labels

                if (cs.fontFamily !== null || cs.fontFamily !== undefined) {
                    fontFamilies = cs.fontFamily.split(",");
                    currentFontFamily = fontFamilies[0].trim().replace(/"/g, '');
                } else {
                    currentFontFamily = defaultFontFamily;
                }

                var currentFontSize = '';
                if (cs.fontSize !== null || cs.fontSize !== undefined) {
                    currentFontSize = cs.fontSize;
                } else {
                    currentFontSize = defaultFontSize;
                }

                var currentFont = currentFontSize + ' ' + currentFontFamily;

                context.font = currentFont;

                var longestWordWidth = context.measureText(longestWord).width;
                var containerWidth = angular.element(elt).width();
                // Only apply the word wrap if there is a word longer than the container
                if (longestWordWidth > containerWidth) {
                    longWordExist = true;
                }

                //If user agent is Chrome or Safari and there is no word longer than the container let -webkit- handle the multiline ellipsis through css
                if ((UserAgent.isChrome() && longWordExist == false) || (UserAgent.isSafari() && longWordExist == false)) {
                    elt.textContent = options.content;
                    // we have applied -webkit-line-clamp through css first
                    return;
                } else if (longWordExist == true) {
                    // use angular.element(elt).css() is the only way cross-browsers to apply styles
                    // elt.style does not seem to work on Safari
                    // "overflow-wrap: break-word; word-wrap: break-word;" only works well in chrome, safari does not work
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

            // FOR DISCUSSION ONLY I had problem with IE9 without declare a line-height in px, directive does not seem to work
            // I see most of the line-clamp js directives ask for a defined the line-height so this following function might not
            // work accurate anyway, thus I suggest we ask the app developers to specify a line-height

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
})(angular.module("com.vmware.greenbox.appCenter"));
