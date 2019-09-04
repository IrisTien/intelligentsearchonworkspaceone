(function(module) {
    module.directive('pullToRefresh', function($compile, $timeout, $q, UserAgent, $filter) {
        return {
            scope: true,
            restrict: 'A',
            transclude: true,
            templateUrl: 'app-v2/common/directives/pullToRefresh.html',
            link: function postLink(scope, ele, attr) {
                if (UserAgent.isMobile()) {
                    var element = ele[0];
                    var scrollEle = document.querySelector(attr.scrollContainer);
                    var disTravelled = 0;
                    var maxDistance = 200;
                    var startPos = 0;
                    var isLoading = false;
                    var isPullRequired = false;
                    var friction = 2;
                    var pullElement = element;
                    var isScrolling;
                    var scrollStopped = true;
                    var loaderContainer = element.querySelector('#pull-to-refresh');
                    var actionIcon = element.querySelector('.action-icon');
                    var spinner = element.querySelector('.pull-spinner');
                    var startX = 0;
                    var distanceX = 0;
                    var xThreshold = 80;
                    pullElement.style.position = 'relative';
                    //set min-height. when there are no apps element height will be 0, HW-67651
                    pullElement.style['min-height'] = '100px';
                    var addClass = function(ele, className) {
                        ele.classList.add(className);
                    };

                    var removeClass = function(ele, className) {
                        ele.classList.remove(className);
                    };

                    addClass(actionIcon, 'pull');

                    var moveContainer = function(distance) {
                        if (!isLoading) {
                            if (distance >= 30 && scrollEle.scrollTop <= 0 && distanceX < xThreshold) {
                                addClass(element, 'set-transition-speed');
                                pullElement.style.transform = pullElement.style.msTransform = pullElement.style.webkitTransform = 'translate3d( 0, ' + parseInt(distance / friction) + 'px, 0 )';
                                if (distance >= 15 && loaderContainer.style.display != 'block') {
                                    loaderContainer.style.display = 'block';
                                    actionIcon.style.display = 'block';
                                }
                            }
                            if (distance === 0) {
                                loaderContainer.style.display = 'none';
                                pullElement.style.transform = pullElement.style.msTransform = pullElement.style.webkitTransform = 'translate3d( 0, 0, 0 )';
                            }
                            if (distance >= maxDistance) {
                                addClass(actionIcon, 'release');
                            }
                        }
                    };

                    var reset = function() {
                        isLoading = false;
                        addClass(element, 'reset-transition-speed');
                        isPullRequired = false;
                        actionIcon.style.display = 'none';
                        spinner.style.display = 'none';
                        disTravelled = 0;
                        distanceX = 0;
                        moveContainer(0);
                        removeClass(actionIcon, 'release');
                    };

                    var makeCall = function() {
                        moveContainer(100);
                        var start = +new Date();
                        isLoading = true;
                        actionIcon.style.display = 'none';
                        spinner.style.display = 'block';
                        $q.when(scope.$eval(attr.pullToRefresh))
                            .then(function() {
                                var elapsed = +new Date() - start;
                                $timeout(function() {
                                    reset();
                                }, elapsed < 400 ? 400 - elapsed : 0);
                            }, function() {
                                reset();
                            });
                    };

                    ele.bind('touchstart', function(e) {
                        var touchObj = e.originalEvent.touches[0];
                        startPos = parseInt(touchObj.clientY);
                        startX = parseInt(touchObj.clientX);
                    });

                    ele.bind('touchmove', function(e) {
                        if (scrollStopped) {
                            var touchObj = e.originalEvent.touches[0];
                            disTravelled = (parseInt(touchObj.clientY) - startPos);
                            distanceX = Math.abs(parseInt(touchObj.clientX) - startX);
                            if (disTravelled > 0 && distanceX < xThreshold) {
                                moveContainer(disTravelled);
                            }
                        }
                    });

                    ele.bind('touchend', function(e) {
                        if (disTravelled >= maxDistance && scrollEle.scrollTop <= 0) {
                            if (!isLoading) {
                                makeCall();
                            }
                        } else {
                            moveContainer(0);
                        }
                    });

                    ele.bind('scroll', function(event) {
                        scrollStopped = false;
                        window.clearTimeout(isScrolling);
                        isScrolling = setTimeout(function() {
                            scrollStopped = true;
                        }, 2000);
                    }, false);
                }
            }
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
