(function(module) {
    'use strict';

    module.directive('catalogItem', function() {
        return {
                restrict: 'A',
                replace: true,
                scope: { app: '=appdata', modal: '=modalobj', isLoading: '=', deviceStatus: '=', onSelectRecommendedApp: '&' },
                templateUrl: 'app-v2/catalog/catalogItem.html',
                controller: 'CatalogItemController',
                controllerAs: 'catalogItemCtrl',
                bindToController: true
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));
