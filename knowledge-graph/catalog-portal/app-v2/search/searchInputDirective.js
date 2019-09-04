(function(module) {
    module.directive('searchInput', ['$document', '$timeout', function($document, $timeout) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                isActive: '=',
                control: '='
            },
            controller: '@',
            name: 'searchController',
            controllerAs: 'ctrl',
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl;
            },
            bindToController: true
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
