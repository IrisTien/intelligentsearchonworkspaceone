appCenter.component('peopleDetail', {
    template: '<div ng-include="\'app-v2/components/people/\' + userDetailsCtrl.templateUrl">',
    controller: 'UserDetailsController',
    controllerAs: 'userDetailsCtrl'
});
