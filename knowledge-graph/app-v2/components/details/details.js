appCenter.component('appDetails', {
    template: '<div ng-include="\'app-v2/components/details/\' + detailsCtrl.templateUrl">',
    controller: 'DetailsController',
    controllerAs: 'detailsCtrl'
});
