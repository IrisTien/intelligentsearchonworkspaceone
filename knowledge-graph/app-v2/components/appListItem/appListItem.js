appCenter.component('appListItem', {
    templateUrl: 'app-v2/components/appListItem/appListItem.html',
    bindings: {
        app: '=',
        favoriteEnabled: '<',
        hideVirtualApp: '=?'
    },
    controller: 'CatalogItemController',
    controllerAs: 'appListItemCtrl'
});
