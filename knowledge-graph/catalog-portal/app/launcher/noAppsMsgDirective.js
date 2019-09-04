(function(module) {
    'use strict';
    module.directive('noAppsMsg', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,

            link: function($scope, element, attrs) {
                var template = $compile('<span>'+attrs.message+'</span>')($scope);
                element.replaceWith(template);
            }
        }
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
