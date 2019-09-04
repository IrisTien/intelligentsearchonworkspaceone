(function(module) {
    module.directive('tabs', ['$window', function($window) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: ["$scope", function($scope) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                };

                this.addPane = function(pane) {
                    if (panes.length == 0) {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                };
            }],
            templateUrl: 'app-v2/common/directives/tabsTemplate.html',
            replace: true
        };
        }]);

    module.directive('pane', ['$window', function($window) {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: { datalabel: '@', displaycheck: '=?'},
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            templateUrl: 'app-v2/common/directives/tabsPaneTemplate.html',
            replace: true
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
