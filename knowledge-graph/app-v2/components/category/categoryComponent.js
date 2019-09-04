appCenter.component('categoryComponent', {
    template: '<div class="category-template-container" ng-include="\'app-v2/components/category/\' + categoryCtrl.templateUrl">',
    bindings: {
        category: '<',
        defaultLabel: '<'
    },
    controller: ['$state', 'UserAgent', function($state, UserAgent) {
        var vm = this;

        this.templateUrl = UserAgent.isAWJadeMobile() ? 'category.html' : 'categoryBrowser.html';

        vm.getAppsByCategory = function(category) {
            $state.go('apps.list', {
                type: 'category',
                category: category.name
            });
        };
    }],
    controllerAs: 'categoryCtrl'
});
