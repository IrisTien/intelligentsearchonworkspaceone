(function(module) {
    'use strict';
    module.directive('includeReplace', function() {
        return {
            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function(scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));

