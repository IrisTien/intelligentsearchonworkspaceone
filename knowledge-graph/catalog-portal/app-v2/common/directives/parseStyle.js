(function(module) {
    module.directive('parseStyle', ['$interpolate', function($interpolate) {
        return function(scope, elem) {
            var exp = $interpolate(elem.html()),
                watchFunc = function() {
                    return exp(scope);
                };

            scope.$watch(watchFunc, function(html) {
                elem.html(html);
            });
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

