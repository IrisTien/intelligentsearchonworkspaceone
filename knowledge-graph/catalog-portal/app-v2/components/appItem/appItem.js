appCenter.component('appItem', {
    template: '<div ng-include="\'app-v2/components/appItem/\' + appItemCtrl.templateUrl">',
    bindings: {
        app: '<',
        favoriteEnabled: '<'
    },
    controller: 'BookmarksItemController',
    controllerAs: 'appItemCtrl'
});
