(function(module) {
    module.directive('imageLoad', function() {
        return {
            link: function(scope, element, attrs) {
                var img = element.children('img');
                img.bind('load', function() {
                    //check if digest cycle
                    if (!scope.$$phase) {
                        scope.$apply(function() {
                            element.css('background-image', 'none');
                        });
                    }
                });

                img.bind('error', function() {
                    //hide broken image tag on error
                    img.css('display', 'none');
                });
            }
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
