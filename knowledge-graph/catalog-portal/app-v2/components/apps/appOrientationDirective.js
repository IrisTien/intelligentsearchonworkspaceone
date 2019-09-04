(function(module) {
    module.directive('appOrientationDirective', ['$window', 'ViewportMinAppService',
        function($window, ViewportMinAppService) {
            return {
                scope: {
                    minFavoriteCount: '=',
                    maxSectionAppsCount: '=',
                    oneRowSectionAppsCount: '=',
                    minSectionAppsCount: '=',
                    updateDisplayedApps: '&'
                },
                link: function(scope, element, attrs) {
                    $window.addEventListener("orientationchange", function() {
                        scope.$apply(function() {
                            //  portrait if 180 or 0,
                            if (window.orientation === 0 || window.orientation === 180) {
                                scope.minFavoriteCount = ViewportMinAppService.getMinAppNo(screen.width);
                                scope.oneRowSectionAppsCount = ViewportMinAppService.oneRowSectionAppsCount(screen.width);
                                scope.updateDisplayedApps();
                            } else {
                                //landscape is 90 or -90, so use the screen.height there is bug in safari webview, on orientationchange the screen.width does not get updated
                                //https://stackoverflow.com/questions/44484547/screen-width-screen-height-not-updating-after-screen-rotation/44562761
                                scope.minFavoriteCount = ViewportMinAppService.getMinAppNo(screen.height);
                                scope.oneRowSectionAppsCount = ViewportMinAppService.oneRowSectionAppsCount(screen.height);
                                scope.updateDisplayedApps();
                            }
                            // Also update the one-row section
                            scope.maxSectionAppsCount = scope.minFavoriteCount;
                            scope.minSectionAppsCount = scope.minFavoriteCount / 2;
                        });
                    }.bind(this));

                    $window.addEventListener("resize", function() {
                        scope.$apply(function() {
                            scope.oneRowSectionAppsCount = ViewportMinAppService.oneRowSectionAppsCount($window.innerWidth);
                            scope.updateDisplayedApps();
                        });
                    }.bind(this));
                }
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
