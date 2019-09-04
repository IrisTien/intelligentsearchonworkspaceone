(function(module) {
    module.directive('disableCopyPaste', [function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('copy paste drop', function(e) {
                    e.preventDefault();
                });
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
