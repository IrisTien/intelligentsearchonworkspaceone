appCenter.component('peopleSearch', {
    template: '<div ng-include="\'app-v2/components/peopleSearch/\' + peopleSearchCtrl.templateUrl">',
    controllerAs: 'peopleSearchCtrl',
    controller: ['UserAgent',
        function(UserAgent) {
            this.templateUrl = UserAgent.isAWJadeMobile() ? 'peopleSearch.html' : 'peopleSearchBrowser.html';
        }]
});
