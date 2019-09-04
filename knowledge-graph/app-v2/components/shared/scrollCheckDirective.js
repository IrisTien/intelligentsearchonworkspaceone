(function(module) {
    module.directive('scrollCheck', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var scrollDistance, // This is where the container scroll pass the apptile icon or people avatar
                    currentView = attr.currentview,
                    elemClass = attr.elemclass;

                // Check viewport size, if it is < 375 return small app-tile
                scope.width = $window.innerWidth;
                // No need to do resize as this the a readonly once when the app is loaded, Hub app lock orientation to portrait for phones
                if (currentView == "details-apps") {
                    if (scope.width < 375) {
                        // 86 is defined in css for viewport smaller than 375 app tile size
                        scrollDistance = 86;
                    } else {
                        scrollDistance = 110;
                    }
                }

                if (currentView == "details-people") {
                    scrollDistance = 150;
                }

                element.bind("scroll", function() {
                    if (element.scrollTop() > scrollDistance) {
                        angular.element(elemClass).addClass('scrolled');
                    } else {
                        angular.element(elemClass).removeClass('scrolled');
                    }
                });
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
