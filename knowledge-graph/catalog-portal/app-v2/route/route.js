var appCenter = angular.module("com.vmware.greenbox.appCenter", [
    'ngCookies',
    'ngSanitize',
    'greenbox.appcenter.templates',
    'greenbox.components.templates',
    'com.vmware.workspace.services.rest',
    'com.vmware.workspace.components.modal',
    'com.vmware.greenbox.services.offlineService',
    'com.vmware.workspace.services.localization',
    'com.vmware.workspace.components.rating',
    'com.vmware.workspace.components.symbol',
    'com.vmware.workspace.components.spinner',
    'com.vmware.workspace.components.dropdown',
    'com.vmware.workspace.components.notify',
    'com.vmware.workspace.components.toast',
    'com.vmware.workspace.components.frameDrawer',
    'com.vmware.workspace.components.lineClamp',
    'com.vmware.workspace.components.message',
    'com.vmware.greenbox.l10n',
    'angular-gestures',
    'angular-carousel',
    'ui.sortable',
    'ui.router']);

appCenter.config(['$stateProvider', '$urlRouterProvider', '$provide', function($stateProvider, $urlRouterProvider, $provide) {
    $provide.decorator('$state', function($delegate, $rootScope) {
        $rootScope.$on('$stateChangeStart', function(event, state, params, fromState) {
            $delegate.next = state;
            $delegate.prev = fromState;
            $delegate.toParams = params;
        });
        return $delegate;
    });

    $stateProvider.state('catalog', {
        url: '/catalog',
        templateUrl: 'app-v2/catalog/catalog.html',
        controller: 'CatalogController',
        controllerAs: 'catalogCtrl',
        activeTab: 'catalog',
        mobilePageTitle: 'myapps.mobilepagetitle.apps',
        resolve: {resolver: resolver}
    }).state('bookmarks', {
        url: '/bookmarks',
        templateUrl: 'app-v2/bookmarks/bookmarks.html',
        controller: 'BookmarksController',
        controllerAs: 'bookmarksCtrl',
        activeTab: 'bookmarks',
        mobilePageTitle: 'myapps.mobilepagetitle.apps',
        resolve: {resolver: resolver}
    }).state('smartSearch', {
        url: '/smartSearch',
        templateUrl: 'app-v2/catalog/catalog.html',//TODO:
        controller: 'CatalogController',
        controllerAs: 'catalogCtrl',
        activeTab: 'smartSearch',
        mobilePageTitle: 'myapps.mobilepagetitle.apps'
    }).state('catalog.details', {
        url: '/details/:appId',
        templateUrl: 'app-v2/details/details.html',
        controller: 'DetailsController',
        controllerAs: 'detailsCtrl',
        activeTab: 'details',
        mobilePageTitle: 'myapps.mobilepagetitle.details'
    }).state('bookmarks.details', {
        url: '/details/:appId',
        templateUrl: 'app-v2/details/details.html',
        controller: 'DetailsController',
        controllerAs: 'detailsCtrl',
        activeTab: 'details',
        mobilePageTitle: 'myapps.mobilepagetitle.details'
    }).state('support', {
        url: '/support',
        templateUrl: 'app-v2/support/support.html',
        controller: 'SupportController',
        controllerAs: 'supportCtrl',
        activeTab: 'support',
        mobilePageTitle: 'myapps.mobilepagetitle.support'
    }).state('support.pageLink', {
        url: '/:pageLink',
        templateUrl: 'app-v2/support/support.html',
        controller: 'SupportController',
        controllerAs: 'supportCtrl',
        activeTab: 'support',
        mobilePageTitle: 'myapps.mobilepagetitle.support'
    }).state('people', {
        url: '/people',
        templateUrl: 'app-v2/people/people.html',
        controller: 'PeopleController',
        controllerAs: 'peopleCtrl',
        activeTab: 'people',
        mobilePageTitle: '',
        resolve: {resolver: resolver}
    }).state('people.details', {
        url: '/details/:userId',
        templateUrl: 'app-v2/people/userDetails.html',
        controller: 'UserDetailsController',
        controllerAs: 'userDetailsCtrl',
        activeTab: 'peopleDetails',
        mobilePageTitle: ''
    }).state('settings', {
        url: '/settings',
        templateUrl: 'app-v2/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl',
        activeTab: 'settings',
        mobilePageTitle: 'myapps.mobilepagetitle.settings'
    }).state('settings.pageLink', {
        url: '/:pageLink',
        templateUrl: 'app-v2/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl',
        activeTab: 'settings',
        mobilePageTitle: 'myapps.mobilepagetitle.settings'
    }).state('recommendedApps', {
        url: '/recommendedApps',
        templateUrl: 'app-v2/catalog/recommendedAppsContainer.html',
        controller: 'CatalogController',
        controllerAs: 'catalogCtrl',
        activeTab: 'recommendedApps',
        mobilePageTitle: 'myapps.mobilepagetitle.recommendedapps'
    }).state('notifications', {
        url: '/notifications',
        templateUrl: 'app-v2/notifications/notificationMobile.html',
        controller: 'NotificationController',
        controllerAs: 'notificationCtrl',
        activeTab: 'notifications',
        mobilePageTitle: 'myapps.mobilepagetitle.notification'
    }).state('notificationsDeeplink', {
        url: '/notifications/:notificationId',
        templateUrl: 'app-v2/notifications/notificationMobile.html',
        controller: 'NotificationController',
        controllerAs: 'notificationCtrl',
        activeTab: 'notifications',
        mobilePageTitle: 'myapps.mobilepagetitle.notification'
    }).state('newApps', {
        url: '/notifications/newApps/:notificationId',
        templateUrl: 'app-v2/notifications/newEntitlementsMobile.html',
        controller: 'NewAppsNotificationController',
        controllerAs: 'ctrl',
        activeTab: 'notifications',
        mobilePageTitle: 'myapps.mobilepagetitle.notification.newapps'
    }).state('archivedNotifications', {
        url: '/archivedNotifications',
        templateUrl: 'app-v2/notifications/notificationMobile.html',
        controller: 'NotificationController',
        controllerAs: 'notificationCtrl',
        activeTab: 'archivedNotifications',
        mobilePageTitle: 'myapps.mobilepagetitle.archived'
    }).state('newEntitlementsDisplay', {
        url: '/newEntitlementsDisplay',
        templateUrl: 'app-v2/catalog/catalog.html',
        controller: 'CatalogController',
        controllerAs: 'catalogCtrl',
        activeTab: 'catalog',
        mobilePageTitle: 'myapps.mobilepagetitle.apps',
        resolve: {resolver: resolver}
    });

    $stateProvider.state('index', {
        url: '/index',
        controller: ['StateResolveService', function(StateResolveService) {
            StateResolveService.navigateToLastVisitedPage();
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
        if (StateResolveService.canNavigate($state)) {
            deferred.resolve();
        } else {
            deferred.reject();
        }
        return deferred.promise;
    }
}]);
