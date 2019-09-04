(function(module) {
    module.directive('scroll', [function() {
        return {
            restrict: 'A',
            scope: {
                scrolled: '='
            },
            link: function(scope, element, attr) {
                var scrollDistance = 10;
                element.bind("scroll", function() {
                    scope.scrolled = element.scrollTop() > scrollDistance && $('.user-details-loaded-container').height() + scrollDistance < $(element)[0].scrollHeight;
                    scope.$apply();
                });
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
