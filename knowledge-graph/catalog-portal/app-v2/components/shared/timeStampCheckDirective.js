(function(module) {
    module.directive('timeStampCheck', [function() {
        return {
            restrict: 'AE',
            link: function(scope, element, attr) {
                if (moment(attr.timeStampCheck, moment.ISO_8601).isValid()) {
                    var date = moment.utc(attr.timeStampCheck).format("LLL");
                    element.text(date);
                } else {
                    element.html(attr.timeStampCheck);
                }
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
