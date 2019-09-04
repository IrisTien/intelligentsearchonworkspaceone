(function(module) {
    module.directive('longCardDirective', ['$timeout', '$state', 'UserAgent',
        function($timeout, $state, UserAgent) {
            return {
                transclude: true,
                link: function(scope, element, attrs) {
                    scope.showMoreDetails = false;
                    scope.loaded = false;
                    element.ready(function() {
                        var height;
                        $timeout(function() {
                            height = element[0].offsetHeight;
                            if (scope.notificationCardCtrl && scope.notificationCardCtrl.commentBox) {
                                scope.showMoreDetails = true;
                            } else if (height > 240) {
                                scope.showMoreDetails = true;
                            }
                            scope.loaded = true;
                        });
                    });

                    scope.goToLongCard = function(id) {
                        var state = $state;
                        var url = state.href($state.current.name, $state.params, {}) + '/details/';
                        var nativeNavHide = UserAgent.isAWJadeMobile() ? '?nativenav=Hide' : '';
                        location.hash = url + id + nativeNavHide;
                    };
                },
                templateUrl: 'app-v2/components/notifications-v2/longCardCollapsed.html'
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
