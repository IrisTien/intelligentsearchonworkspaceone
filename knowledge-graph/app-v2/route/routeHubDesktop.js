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
            desktopPageTitle: 'hub.nav.label.apps',
            currentTab: 'apps'
        }).state('apps.list', {
            url: '/:type/:category',
            component: 'appList',
            desktopPageTitle: 'hub.nav.label.apps',
            currentTab: 'apps',
            params: {
                category: {squash: true, value: null}
            }
        }).state('apps.details', {
            url: '/details/:appId',
            component: 'appDetails',
            currentTab: 'apps'
        }).state('apps.list.details', {
            url: '/details/:appId',
            component: 'appDetails'
        }).state('apps.favoritesedit', {
            url: '/favoritesedit',
            component: 'favorites',
            currentTab: 'apps'
        }).state('people', {
            url: '/people',
            component: 'people',
            desktopPageTitle: 'hub.nav.label.people',
            currentTab: 'people'
        }).state('people.details', {
            url: '/details/:userId',
            component: 'peopleDetail',
            currentTab: 'people'
        }).state('notifications', {
            url: '/notifications/:filter',
            component: 'notificationsV2',
            activeTab: 'notifications',
            desktopPageTitle: 'hub.nav.label.notification',
            params: {
                filter: {squash: true, value: 'all'}
            }
        }).state('notifications.details', {
            url: '/details/:notificationId',
            component: 'notificationDetails',
            desktopPageTitle: 'hub.nav.label.notification'
        }).state('notifications.filter-details', {
            url: '/details/:filter/:notificationId',
            component: 'notificationDetails'
        }).state('notifications.newApps', {
            url: '/newApps/:notificationId',
            desktopPageTitle: 'hub.nav.label.notification',
            component: 'notificationsNewAppsV2'
        });

        $stateProvider.state('index', {
            url: '/index',
            controller: ['$location', function($location) {
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
    }]);
