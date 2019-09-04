(function(module) {
    module.directive('hamburgerMenu', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/common/directives/hamburgerMenu.html',
            transclude: true
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));