(function(module) {
    'use strict';

    module.directive('searchInput', ['UserAgent', function(UserAgent) {
        return {
            restrict: 'A',
            link: postLink,
            scope: { onSubmit : '&', control : '=' },
            controllerAs: '$searchInput',
            controller: controller,
            bindToController: true
        };

        function postLink (scope, element, attrs, $searchInput) {
            element.bind( 'keydown' , function( event ) {
                if ( event.keyCode === 13 ) {
                    scope.$apply( function() {
                        if(UserAgent.isMobile()){
                            //Removing focus of the element manually for iOS
                            element.blur();
                        }
                        $searchInput.onSubmit();
                    });
                }
            });
        }

        function controller ($timeout, $element) {
            var $searchInput = this;
            $searchInput.innerControl = $searchInput.control || {};

            $searchInput.innerControl.focus = function() {
                $timeout(function(){
                    $element.focus();
                });
            };

            $searchInput.innerControl.clearAndFocus = function() {
                $timeout(function(){
                    $element.val("").trigger('change');
                    $element.focus();
                });
            };
        }

    }]);

})(angular.module('com.vmware.greenbox.appCenter'));

