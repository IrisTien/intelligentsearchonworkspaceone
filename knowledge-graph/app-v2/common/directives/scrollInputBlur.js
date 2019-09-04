(function(module) {
    module.directive('scrollInputBlur', function(UserAgent) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (UserAgent.isMobile()) {
                    element.bind("touchstart scroll", function() {
                        $('input').blur();
                    });
                }
            }
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
