(function(module) {
    module.directive('dropdownList', function() {
        return {
            restrict: 'A',
            transclude: true,
            replace: false,
            scope: { config: '=?dropdownList', isActive: '=?dropdownControl' },
            controllerAs: '$dropdown',
            bindToController: true,
            controller: ['$scope', '$document', '$timeout', controller],
            link: postLink,
            templateUrl: 'app-v2/common/dropdownList.html'
        };

        // Only if clicked outside the area should dismiss it or when a modal dialog box is activated
        function controller($scope, $document, $timeout) {
            var $dropdown = this;
            //Hide the dropdown by default
            $dropdown.isActive = $dropdown.isActive || false;
            //Click away enabled by default

            if ($dropdown.config === undefined) {
                $dropdown.config = { closeOnClick: true };
            }

            $scope.$watch('$dropdown.isActive', function(value) {
                if ($dropdown.isActive) {
                    $timeout(function() {
                        $document.bind('click', closeDropdown);
                    });
                } else {
                    $timeout(function() {
                        $document.unbind('click', closeDropdown);
                    });
                }
            });

            $dropdown.toggle = function() {
                $dropdown.isActive = !$dropdown.isActive;
            };

            $dropdown.setElement = function(element) {
                $dropdown.element = element;
            };

            //Close dropdown
            var closeDropdown = function(event) {
                var element = $dropdown.element;
                if (event && element && element[0].contains(event.target)) {
                    return;
                }
                $scope.$apply(function() {
                    $dropdown.isActive = false;
                });
            };
        }

        function postLink(scope, element, attrs, $dropdown) {
            $dropdown.setElement(element);
            element.bind('click', function() {
                scope.$apply(function() {
                    $dropdown.toggle();
                });
            });
        }
    });

    module.directive('dropdownPanelBody', function() {
        return {
            restrict: 'A',
            link: postLink,
            require: ['^dropdownList']
        };

        function postLink(scope, element, attrs, controllers) {
            element.addClass('dropdown-panel-body');
            var $dropdown = controllers[0];
            if (!$dropdown.config.closeOnClick) {
            // If user click inside the panel body does not dismiss the dropdown, only if they click outside of the area
                element.bind('click', function(event) {
                    // event.preventDefault will prevent all the clicking such as tabs and radio button for preference default behavior
                    event.stopPropagation();
                });

                element.on('click', 'button', function() {
                    scope.$apply(function() {
                        $dropdown.isActive = false;
                    });
                });
            }
        }
    });
})(angular.module('com.vmware.greenbox.appCenter'));

