appCenter.component('appSearch', {
    template: '<div ng-include="\'app-v2/components/appSearch/\' + appSearchCtrl.templateUrl">',
    controllerAs: 'appSearchCtrl',
    controller: ['UserAgent',
        function(UserAgent) {
            this.templateUrl = UserAgent.isAWJadeMobile() ? 'appSearch.html' : 'appSearchBrowser.html';
        }]
});
