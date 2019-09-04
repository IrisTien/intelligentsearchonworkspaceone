// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

'use strict';

(function (module) {

    module.directive('rating', function () {
        return {
            restrict: 'A',
            scope: { rating: "=" },
            controller: controller,
            controllerAs: '$rating',
            bindAsController: true,
            replace: true,
            templateUrl: 'components/rating/templates/rating.html'
        }
    });

    function controller ($scope) {
        var $rating = this;

        $rating.values = [1, 2, 3, 4, 5];
    }

})( angular.module("com.vmware.workspace.components.rating", []) );
