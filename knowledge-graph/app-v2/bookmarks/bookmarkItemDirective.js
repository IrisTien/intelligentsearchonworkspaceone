(function(module) {
    'use strict';

    module.directive('bookmarkItem', [function() {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'app-v2/bookmarks/bookmarkItem.html',
            link: function(scope, element, attr) {
            },
            controller: 'BookmarksItemController',
            controllerAs: 'bookmarkItemCtrl',
            bindToController: true
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

