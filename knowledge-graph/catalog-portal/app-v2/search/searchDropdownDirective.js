(function(module) {
    module.directive('searchDropdown', ['$document', '$timeout', function($document, $timeout) {
        var index = -1;

        function onIndexChange(element, activeIndex, searchItem) {
            $timeout(function() {
                if (activeIndex >= 0) {
                    $timeout(function() {
                        var container = element;
                        var item = element.find(searchItem);
                        if (item && item[0]) {
                            var fromTop = item.offset().top;
                            var height = item.outerHeight();
                            container.animate({scrollTop: container.scrollTop() + fromTop - height}, 'fast');
                        }
                    });
                }
            });
        }

        function link(scope, element, attrs) {
            function onKeyDown(evt) {
                var activeIndex = index;
                if (evt.which === 40) { // down arrow
                    activeIndex += 1;
                } else if (evt.which === 38) { // up arrow
                    activeIndex -= 1;
                }

                if (activeIndex !== index) {
                    index = activeIndex;
                    scope.activeIndex = activeIndex;
                    onIndexChange(element, activeIndex, attrs.searchItem);
                }
            }

            $document.on('keydown', onKeyDown);

            scope.$on('$destroy', function() {
                index = -1;
                $document.off('keydown', onKeyDown);
            });
        }

        return {
            restrict: 'A',
            replace: true,
            link: link,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl;
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
