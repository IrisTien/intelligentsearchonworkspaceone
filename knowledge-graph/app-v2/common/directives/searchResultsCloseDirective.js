(function(module) {
    module.directive('searchResultsClose', ['UserAgent', '$timeout', '$document', '$window', function(UserAgent, $timeout, $document, $window) {
        return {
            restrict: 'A',
            scope: {
                close: '&?',
                showScrim: '=?'
            },
            link: function(scope, element, attr) {
                if (UserAgent.isMobile()) {
                    element.bind("touchstart scroll", function(event) {
                        if (UserAgent.isAWJade()) {
                            $('input').blur();
                        } else {
                            $timeout(function() {
                                scope.close();
                            });
                        }
                    });
                }

                function closeResults(event) {
                    //Search results should not close in mobile devices as it occupies the entire screen
                    //Skipping iPad pro here by it's resolution as it has desktop view and the search results should close when clicked on the scrim area
                    if ((UserAgent.isMobile() && $window.innerWidth <= 1024)) {
                        return false;
                    } else {
                        $timeout(function() {
                            scope.close();
                        });
                    }
                }

                scope.$watch('showScrim', function() {
                    if (scope.showScrim) {
                        $timeout(function() {
                            $document.bind('click', closeResults);
                        });
                    } else {
                        $timeout(function() {
                            $document.unbind('click', closeResults);
                        });
                    }
                });
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
