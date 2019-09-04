/*
branding directive - Create a <style> tag from a template

By default, Angular does not process bindings in <style> tags.  This directive creates
a new style tag, using the directive's own content after binding.  Any element nodes are
flattened, which allows for use of directives such as `ng-if` within the branding template.

*/

(function(module) {
    'use strict';
    module.directive('branding', [ '$timeout', function($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: postLink
        };

        function postLink (scope, element, attrs) {
            var style = $('<style>');

            // Make sure the branding element is not displayed, and append style tag
            element.css({display: 'none'})
                .append(style);

            // Define $branding in scope to refer to the branding object
            scope.$watch( attrs.branding, function (newValue) {
                scope.$branding = newValue;

                // Wait until next digest cycle for the new branding values to be bound to the content
                $timeout( function () {
                    style.text(''); // remove old style so it doesn't get re-inserted
                    // Flatten any element nodes resulting from the bindings or directives
                    // in the original HTML content, as they are not valid CSS.
                    // Then write the CSS into the style element.
                    style.text( element.text() );
                }, false);
            });
        }

    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
