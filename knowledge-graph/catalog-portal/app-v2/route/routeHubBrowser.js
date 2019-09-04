appCenter.config(['$stateProvider', '$urlRouterProvider', '$provide', '$transitionsProvider',
    function($stateProvider, $urlRouterProvider, $provide, $transitionsProvider) {
        $provide.decorator('$state', function($delegate) {
            $transitionsProvider.onStart({}, function(trans) {
                $delegate.next = trans.to();
                $delegate.prev = trans.from();
                $delegate.toParams = trans.params();
            });
            return $delegate;
        });

        $stateProvider.state('apps', {
            url: '/apps',
            component: 'apps',
            activeTab: 'apps',
            browserPageTitle: 'hub.nav.label.apps',
            resolve: {resolver: resolver}
        }).state('apps.list', {
            url: '/:type/:category',
            component: 'appList',
            params: {
                category: {squash: true, value: null}
            },
            activeTab: 'apps',
            browserPageTitle: 'hub.nav.label.apps'
        }).state('apps.details', {
            url: '/details/:appId',
            component: 'appDetails'
        }).state('apps.list.details', {
            url: '/details/:appId',
            component: 'appDetails',
            activeTab: 'apps',
            browserPageTitle: 'hub.nav.label.apps'
        }).state('apps.favoritesedit', {
            url: '/favoritesedit',
            component: 'favorites'
        }).state('people', {
            url: '/people',
            component: 'people',
            activeTab: 'people',
            browserPageTitle: 'hub.nav.label.people',
            resolve: {resolver: resolver}
        }).state('people.details', {
            url: '/details/:userId',
            component: 'peopleDetail',
            browserPageTitle: 'hub.nav.label.people',
            resolve: {resolver: resolver}
        }).state('people.search', {
            url: '/search-people',
            component: 'peopleSearch',
            browserPageTitle: 'hub.nav.label.people'
        }).state('settings', {
            url: '/settings',
            component: 'settings',
            activeTab: 'settings',
            browserPageTitle: 'hub.nav.label.settings'
        }).state('notifications', {
            url: '/notifications/:filter',
            component: 'notificationsV2',
            activeTab: 'notifications',
            browserPageTitle: 'hub.nav.label.notification',
            resolve: {resolver: resolver},
            params: {
                filter: {squash: true, value: 'all'}
            }
        }).state('notifications.details', {
            url: '/details/:notificationId',
            component: 'notificationDetails',
            browserPageTitle: 'hub.nav.label.notification',
            resolve: {resolver: resolver}
        }).state('notifications.filter-details', {
            url: '/details/:filter/:notificationId',
            component: 'notificationDetails',
            resolve: {resolver: resolver}
        }).state('notifications.newApps', {
            url: '/newApps/:notificationId',
            component: 'notificationsNewAppsV2',
            browserPageTitle: 'hub.nav.label.notification',
            resolve: {resolver: resolver}
        }).state('newAppsList', {
            url: '/newApps/:notificationId',
            component: 'newAppsNotificationsList',
            resolve: {resolver: resolver},
            activeTab: 'newApps'
        });

        $stateProvider.state('index', {
            url: '/index',
            controller: ['StateResolveService', '$location', function(StateResolveService, $location) {
                $location.path('/apps');
                //replace the location index to /apps, else back button will always take to /index
                $location.replace();
            }],
            /* Waiting on following promises to resolved. This would all the promises that would be required for app to initialize
            before loading index controller. */
            resolve: {
                initAppCalls: function(BootstrapService) {
                    return BootstrapService.getInitAppCallsPromise();
                }
            }
        });

        $urlRouterProvider.otherwise('/index');

        //state resolver, to check if user is allowed to navigate to the state
        function resolver(StateResolveService, $q, $state) {
            var deferred = $q.defer();
            if (StateResolveService.canHubNavigate($state)) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }
    }]);
