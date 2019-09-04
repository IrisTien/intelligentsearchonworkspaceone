var $stateProviderRef = null;
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

appCenter.config(['$stateProvider', '$urlRouterProvider', '$provide', '$transitionsProvider',
    function($stateProvider, $urlRouterProvider, $provide, $transitionsProvider) {
        $provide.decorator('$state', function($delegate, UpdateUrlParamsService, $rootScope, $window) {
            $transitionsProvider.onStart({}, function(trans) {
                $delegate.next = trans.to();
                $delegate.prev = trans.from();
                $delegate.toParams = trans.params();

                // Only show the nativenav on the following states
                var showNativenavPages = function() {
                    return ['apps', 'apps.list', 'apps.search', 'people', 'people.details', 'people.search'].indexOf($delegate.next.name) > -1;
                };

                if ($delegate.next.name !== $delegate.prev.name && showNativenavPages()) {
                    UpdateUrlParamsService.showNativenav();
                }

                if ($delegate.prev.name == 'apps.notifications' && $delegate.next.name == 'apps') {
                    var deviceOnline = $window.navigator.onLine || true;
                    $rootScope.$broadcast('tabShown', deviceOnline);
                }
            });
            return $delegate;
        });

        $stateProvider.state('apps', {
            url: '/apps',
            component: 'apps',
            resolve: {resolver: resolver}
        }).state('apps.search', {
            url: '/search-app',
            component: 'appSearch'
        }).state('apps.list', {
            url: '/:type/:category',
            component: 'appList',
            params: {
                category: {squash: true, value: null}
            }
        }).state('apps.details', {
            url: '/details/:appId',
            component: 'appDetails'
        }).state('apps.list.details', {
            url: '/details/:appId',
            component: 'appDetails'
        }).state('people', {
            url: '/people',
            component: 'people',
            resolve: {resolver: resolver}
        }).state('people.details', {
            url: '/details/:userId',
            component: 'peopleDetail',
            resolve: {resolver: resolver}
        }).state('people.search', {
            url: '/search-people',
            component: 'peopleSearch'
        }).state('changePassword', {
            url: '/support/change-password',
            component: 'changePassword',
            activeTab: 'changePassword',
            resolve: {resolver: resolver}
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
        $stateProviderRef = $stateProvider;
    }]);

appCenter.run(['UserAgent', function(UserAgent) {
    var V2HubNotifications = _.get(window, 'workspaceOne.featureFlags.V2_HUB_NOTIFICATIONS', false);
    if (UserAgent.isNativeAppVersionIsEqualOrAbove("9.2")) {
        $stateProviderRef.state('notifications', {
            url: '/notifications/:filter',
            component: 'notificationsV2',
            resolve: {resolver: resolver},
            params: {
                filter: {squash: true, value: 'all'}
            }
        }).state('notificationsDeeplink', {
            url: '/notifications/:notificationId/:filter',
            component: 'notificationsV2',
            resolve: {resolver: resolver},
            params: {
                filter: {squash: true, value: 'all'}
            }
        }).state('notifications.details', {
            url: '/details/:notificationId',
            component: 'notificationDetails',
            resolve: {resolver: resolver}
        }).state('notifications.filter-details', {
            url: '/details/:filter/:notificationId',
            component: 'notificationDetails',
            resolve: {resolver: resolver}
        }).state('newApps', {
            url: '/notifications/newApps/:notificationId',
            component: 'newAppsNotificationsList',
            activeTab: 'newApps',
            resolve: {resolver: resolver}
        });
    } else if (V2HubNotifications && UserAgent.isNativeAppVersionBelow("9.2")) {
        $stateProviderRef.state('apps.notifications', {
            url: '/notifications/:filter',
            component: 'notificationsV2',
            resolve: {resolver: resolver},
            params: {
                filter: {squash: true, value: 'all'}
            }
        }).state('apps.notificationsDeeplink', {
            url: '/notifications/:notificationId/:filter',
            component: 'notificationsV2',
            resolve: {resolver: resolver},
            params: {
                filter: {squash: true, value: 'all'}
            }
        }).state('notificationsDeeplink', {
            url: '/notifications/:notificationId',
            redirectTo: 'apps.notificationsDeeplink'
        }).state('apps.notifications.details', {
            url: '/details/:notificationId',
            component: 'notificationDetails',
            resolve: {resolver: resolver}
        }).state('apps.notifications.filter-details', {
            url: '/details/:filter/:notificationId',
            component: 'notificationDetails',
            resolve: {resolver: resolver}
        }).state('apps.newApps', {
            url: '/notifications/newApps/:notificationId',
            component: 'newAppsNotificationsList',
            activeTab: 'newApps',
            resolve: {resolver: resolver}
        });
    } else {
        $stateProviderRef.state('apps.notifications', {
            url: '/notifications',
            component: 'notifications',
            resolve: {resolver: resolver}
        }).state('apps.notificationsDeeplink', {
            url: '/notifications/:notificationId',
            component: 'notifications',
            resolve: {resolver: resolver}
        }).state('notificationsDeeplink', {
            url: '/notifications/:notificationId',
            redirectTo: 'apps.notificationsDeeplink'
        }).state('apps.archivedNotifications', {
            url: '/archivedNotifications',
            component: 'notifications',
            activeTab: 'archivedNotifications',
            resolve: {resolver: resolver}
        }).state('apps.newApps', {
            url: '/notifications/newApps/:notificationId',
            component: 'newAppsNotificationsList',
            activeTab: 'newApps',
            resolve: {resolver: resolver}
        });
    }
}]);
