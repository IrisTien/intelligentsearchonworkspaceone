(function(module) {
    module.directive('tooltip', ['$compile', '$templateRequest', '$log', '$filter', function($compile, $templateRequest, $log, $filter) {
        return {
            restrict: 'A',
            controller: function($scope, $element) {
                $scope.showTooltip = false;
                this.showHover = function(show) {
                    $scope.showTooltip = show;
                };
            },
            transclude: true,
            link: function(scope, element, attr, ctrl) {
                var triggerClass = attr.triggerelement,
                    triggerElm = element.closest("." + triggerClass),
                    triggerDelay;

                if (attr.triggerdelay) {
                    triggerDelay = parseInt(attr.triggerdelay);
                } else {
                    triggerDelay = 250;
                }

                triggerElm.bind('mouseover', function() {
                    triggerElm.hover = true;
                    // make sure the hover is intended not accidental slide over
                    _.debounce((function() {
                        scope.$apply(function() {
                            if (triggerElm.hover) {
                                triggerElm.addClass("show-tooltip");
                                scope.tooltiptext = $filter('i18n')(attr.tooltiptext);
                                ctrl.showHover(true);
                            }
                        });
                    }).bind(this), triggerDelay, false)();
                });

                triggerElm.bind('mouseout', function() {
                    triggerElm.hover = false;
                    scope.$apply(function() {
                        triggerElm.removeClass("show-tooltip");
                        ctrl.showHover(false);
                    });
                });

                scope.tooltiptext = $filter('i18n')(attr.tooltiptext);

                if (attr.arrow) {
                    scope.arrowdirection = attr.arrow;
                } else {
                    scope.arrowdirection = "top";
                }
            },
            template: '<div ng-show="showTooltip" class="tooltip {{arrowdirection}}"><p>{{tooltiptext}}</p></div>'
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
