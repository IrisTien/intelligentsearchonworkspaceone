appCenter.component('notificationsLeftNav', {
    templateUrl: 'app-v2/components/notificationsLeftNav/notificationsLeftNav.html',
    bindings: {
        links: "<",
        headerLabel: "<"
    },
    controllerAs: 'notificationsLeftNav',
    controller: ['$stateParams', '$filter',
        function($stateParams, $filter) {
            var vm = this;
        }]
});
