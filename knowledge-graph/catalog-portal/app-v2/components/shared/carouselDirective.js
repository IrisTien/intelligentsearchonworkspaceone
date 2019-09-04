(function(module) {
    module.directive("owlCarousel", function() {
        return {
            restrict: 'E',
            transclude: false,
            link: function(scope) {
                scope.initCarousel = function(element) {
                    var defaultOptions = {};
                    var startY = 0;
                    var endY = 0;
                    var customOptions = scope.$eval($(element).attr('data-options'));
                    for (var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    var curOwl = $(element).data('owlCarousel');
                    if (!angular.isDefined(curOwl)) {
                        var owl = $(element);
                        owl.owlCarousel(defaultOptions);
                        //prevent page scroll on carousel
                        owl.on('touchstart', function(e) {
                            var touchObj = e.originalEvent.touches[0];
                            startY = parseInt(touchObj.clientY);
                        });

                        owl.on('touchmove', function(e) {
                            var touchObj = e.originalEvent.touches[0];
                            endY = parseInt(touchObj.clientY);
                            if (e.cancelable && (startY - endY) < 10) {
                                e.preventDefault();
                            }
                        });

                        owl.on('touchend', function(e) {
                            startY = endY = 0;
                        });
                    }
                };
            }
        };
    }).directive('owlCarouselItem', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                transclude: false,
                link: function(scope, element) {
                    if (scope.$last) {
                        $timeout(function() {
                            scope.initCarousel(element.parent());
                        });
                    }
                }
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
