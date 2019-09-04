(function(module) {

    'use strict';
    //Adds a class 'touch' when it is touch enabled device
    module.directive('noTouch', function (UserAgent) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if(!UserAgent.isMobile()){
                    element.addClass('notouch-');
                }
            }
        };
    });

})(angular.module('com.vmware.greenbox.appCenter'));