appCenter.component('peopleItem', {
    templateUrl: 'app-v2/components/people/peopleItem.html',
    bindings: {
        user: '<',
        category: '<',
    },
    controller: ['$state', '$timeout', 'UserAgent', 'UtilService', function($state, $timeout, UserAgent, UtilService) {
        this.userDetails = function(user) {
            $state.go('people.details', {
                userId: encodeURIComponent(user.id)
            });
        };
    }],
    controllerAs: 'peopleItemCtrl'
});
