appCenter.component('people', {
    template: '<div ng-include="\'app-v2/components/people/\' + peopleCtrl.templateUrl">',
    controller: 'PeopleController',
    controllerAs: 'peopleCtrl'
});
