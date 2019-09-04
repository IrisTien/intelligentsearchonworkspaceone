// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {
    'use strict';
    module.directive('tabs', [ function () {
        return {
            restrict: 'AE',
            scope: true,
            templateUrl: 'components/tabs/templates/tabs.html',
            replace: true,
            link: function(scope,el){
                scope.$watchCollection("routes",function(newRoutes){
                    if(!newRoutes ||  newRoutes.length === 0){
                        el.addClass("ng-hide");
                    }else {
                        el.removeClass("ng-hide");
                    }
                }) ;
            }
        };
    }]);
})( angular.module("com.vmware.workspace.components.tabs", []) );
