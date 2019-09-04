(function(module) {
    module.service('ScrollToTopService', function() {
        var scrollToTopService = this;

        scrollToTopService.scroll = function(elementId) {
            var targetElement = $('#' + elementId)[0];
            $(targetElement).animate({ scrollTop: 0 }, "fast");
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));

