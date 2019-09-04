angular.module("com.vmware.greenbox.appCenter").directive("infiniteScroll", function() {
    'use strict';
    return {
        scope: {
            onend: '&'
        },
        link: function(scope, element, attrs) {
            var scrollElm = element[0];
            scrollElm.onscroll = function onScrollEnd() {
                //Onscroll is outside the angular ctx hence need to wrap it within $apply
                var isEndOfScroll = ((scrollElm.scrollHeight - scrollElm.scrollTop) <= scrollElm.clientHeight);
                if (isEndOfScroll) {
                    scope.$apply(function() {
                        //If user scrolls to the end, call the configured ctr method
                        if (isEndOfScroll) {
                            if (scope.onend) {
                                scope.onend();
                            }
                        }
                    });
                }

                // Call the function tied to the onscrolling attribute on directive definition
                // with the scroll position percentage as parameter
                if (attrs.onscrolling) {
                    scope[attrs.onscrolling](scrollElm.scrollTop / scrollElm.scrollHeight);
                }
            };
        }
    };
});
