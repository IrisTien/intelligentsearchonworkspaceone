(function(module) {
    module.directive('preventParentScroll', ['UserAgent', function(UserAgent) {
        return {
            restrict: "A",
            link: function(scope, elm, attr) {
                if (UserAgent.isIE() || UserAgent.isFF() || UserAgent.isWindowsJade()) {
                    elm.on('mouseenter', function() {
                        angular.element('#catalog-container').css('overflow-y', 'hidden');
                    });
                    elm.on('mouseleave', function() {
                        angular.element('#catalog-container').css('overflow-y', 'auto');
                    });
                }
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
