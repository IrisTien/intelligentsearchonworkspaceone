// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    module.directive('spinner', [ function () {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            templateUrl: 'components/spinner/templates/spinner.svg',
            templateNamespace: 'svg'
        };
    }]);

})( angular.module('com.vmware.workspace.components.spinner', []));
