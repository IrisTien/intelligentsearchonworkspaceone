(function(module) {
    module.directive('collapsePanel', [function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {headerlabel: "@", collapsed: "=?", collapsible: "=?"},
            replace: true,
            controller: ["$scope", function($scope) {
                // By default the panel is expanded
                $scope.collapsed = !!$scope.collapsed;
                $scope.collapsible = $scope.collapsible || $scope.collapsible === undefined;
                $scope.toggleCollapsePanel = function() {
                    $scope.collapsed = !$scope.collapsed;
                };
            }],
            templateUrl: function(element, attrs) {
                var template = 'app-v2/common/directives/collapsePanelTemplate.html';
                // If is the collapse panel inside the HUB_CP
                if (attrs.currentview && attrs.currentview == 'HUB_CP') {
                    template = 'app-v2/components/shared/collapsePanelTemplate.html';
                }

                return template;
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
