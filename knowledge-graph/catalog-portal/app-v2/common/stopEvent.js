(function(module) {
    'use strict';

    //Stops propagation of specified event.
    //Used to fix focus issue in iOS, where user has to touch 2 times to focus an input field on modal
    //Seems like angular touch issue
    //https://github.com/angular-ui/bootstrap/issues/2017

    module.directive('stopEvent', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.on(attr.stopEvent, function(e) {
                    e.stopPropagation();
                });
            }
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
