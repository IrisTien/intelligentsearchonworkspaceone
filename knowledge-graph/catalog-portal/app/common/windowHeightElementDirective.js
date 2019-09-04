(function(module) {
    'use strict';

    module.directive('windowHeightElement', ['$window', '$document', function($window, $document) {

        function setHeight(element) {
            var mobileMastheadHeight = 50, padding = 5;
            var browserWindowHeight = $window.innerHeight || $document.body.Height;
            var browserWindowWidth = $window.innerWidth || $document.body.Width;
            var smallPageWidth = 740;//Start of tablet/desktop layouts
            // Only apply these properties on mobileLayout where dropdown height need to be 100%
            if(browserWindowWidth < smallPageWidth) {
                element.css('max-height', browserWindowHeight - ( mobileMastheadHeight + padding ) + 'px');
                //Need this for iOS to support scrolling on modals
                element.css('-webkit-overflow-scrolling', 'touch');
                element.css('overflow', 'auto');
            }
        }

        function postLink(scope, element, attrs) {
            setHeight(element);
            angular.element($window).bind('resize', function(){
                setHeight(element);
            });
        }

        return {
            restrict : 'A',
            link: postLink
        };

    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
