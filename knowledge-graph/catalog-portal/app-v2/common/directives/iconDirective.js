(function(module) {
    module.directive('icon', ['$document', '$timeout', function($document, $timeout) {
        function scale(element, width) {
            element.css('width', '');
            element.css('height', '');
            var backgroundSize = 'auto';
            if (width > element.innerWidth()) {
                backgroundSize = 'contain';
            }
            element.css({
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': backgroundSize,
            });
        }

        function link(scope, element, attrs) {
            var icon = element.find('.icon');
            var url = scope.url;
            var img = new Image();

            img.onload = function() {
                scale(element, img.width);
                element.css({'background-image': 'url(' + url + ')'});
            };

            var resize = function() {
                scale(element, img.width);
            };
            $document.on('resize', resize);
            scope.$on('$destroy', function() {
                $document.off('resize', resize);
            });

            img.src = url;
        }

        return {
            restrict: 'A',
            replace: false,
            scope: {
                url: '=',
            },
            link: link,
            template: '<div class="icon" />',
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
