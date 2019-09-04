// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module){

    module.directive('dropdown', function () {

        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: { config: '=?dropdown', isActive: '=?dropdownControl' },
            controllerAs: '$dropdown',
            bindToController: true,
            controller: ['$scope', '$document', '$timeout', controller],
            link: postLink,
            templateUrl: 'components/dropdown/templates/dropdown.html'
        };

        function controller ($scope, $document, $timeout) {
            var $dropdown = this;
            //Hide the dropdown by default
            $dropdown.isActive = $dropdown.isActive || false;
            //Click away enabled by default
            if($dropdown.config === undefined){
                $dropdown.config = { closeOnClick: true };
            }

            $scope.$watch('$dropdown.isActive', function(value){
                if($dropdown.isActive){
                    $timeout(function(){
                        $document.bind('click', closeDropdown);
                    });
                }else{
                    $timeout(function(){
                        $document.unbind('click', closeDropdown);
                    });
                }
            });

            $dropdown.toggle = function () {
                $dropdown.isActive = !$dropdown.isActive;
            };

            $dropdown.setElement = function (element) {
                $dropdown.element = element;
            };

            //Close dropdown
            var closeDropdown = function( event ) {
                var element = $dropdown.element;
                if( event && element && element[0].contains(event.target) ) {
                    return;
                }
                $scope.$apply(function () {
                    $dropdown.isActive = false;
                });
            };
        }

        function postLink (scope, element, attrs, $dropdown) {
            $dropdown.setElement(element);
            element.bind('click', function(){
                scope.$apply(function(){
                    $dropdown.toggle();
                });
            });
        }

    });

    module.directive('dropdownPanel', function() {
        return {
            restrict: 'A',
            link: postLink,
            require: ['^dropdown']
        };

        function postLink (scope, element, attrs, controllers) {
            element.addClass('dropdown-panel');
            var $dropdown = controllers[0];
            if(!$dropdown.config.closeOnClick){
                element.bind('click', function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        }
    });

})(angular.module('com.vmware.workspace.components.dropdown', []));
