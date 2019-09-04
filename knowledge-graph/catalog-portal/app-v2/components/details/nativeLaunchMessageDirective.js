(function(module) {
    module.directive('launchMessage', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app-v2/components/details/nativeLaunchMessageTemplate.html'
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
