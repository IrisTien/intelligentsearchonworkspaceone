// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module){

	module.directive('frameDrawer', ['$timeout', function($timeout) {

        return {
            restrict: 'A',
            link: postLink,
            controller: ['$scope', '$element', controller],
            controllerAs: '$frameDrawer',
            scope: { isActive: '=drawerControl' },
            bindToController: true
        };

        function controller ($scope, $element) {
            var $frameDrawer = this;
            $frameDrawer.isActive = $frameDrawer.isActive || false;

            $scope.$watch('$frameDrawer.isActive', function(newValue) {
                if(newValue) {
                    $element.addClass('is-active');
                }else{
                    $element.removeClass('is-active');
                }
                //See https://jira-hzn.eng.vmware.com/browse/HW-52278
                //Force, repaint on drawer menu's sibling elements.
                $element.siblings().toggleClass('no-op');
            });
        }

        function postLink (scope, element, attrs, controllers) {
            var $frameDrawer = controllers;
            element.addClass('frame-drawer');

            //Close drawer on selecting
            element.bind('click', function(event) {
                if($(event.target).is('a')){
                    scope.$apply(function() {
                        $frameDrawer.isActive = false;
                    });
                }
            });
        }

    }]);

})(angular.module('com.vmware.workspace.components.frameDrawer', []));