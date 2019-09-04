appCenter.component('ribbon', {
    templateUrl: 'app-v2/components/ribbon/ribbon.html',
    controllerAs: 'ribbonCtrl',
    controller: ['UserAgent',
        'SettingsService',
        'ClientRuntimeService',
        'UtilService',
        'ModalService',
        'SignOutService',
        'ConfigService',
        '$filter',
        '$state',
        '$transitions',
        'TenantCustomizationService',
        '$scope',
        function(UserAgent,
                 SettingsService,
                 ClientRuntimeService,
                 UtilService,
                 ModalService,
                 SignOutService,
                 ConfigService,
                 $filter,
                 $state,
                 $transitions,
                 TenantCustomizationService,
                 $scope) {
            var vm = this;
            vm.userInfo = SettingsService.getCurrentUser() || {};
            vm.isAWJade = UserAgent.isAWJade();
            var browserPageTitles = {
                'apps': $filter('i18n')('hub.nav.label.apps'),
                'apps.details': $filter('i18n')('hub.nav.label.apps'),
                'apps.list': $filter('i18n')('hub.nav.label.apps'),
                'apps.list.details': $filter('i18n')('hub.nav.label.apps'),
                'people': $filter('i18n')('hub.nav.label.people'),
                'people.details': $filter('i18n')('hub.nav.label.people'),
                'notifications': $filter('i18n')('hub.nav.label.notification'),
                'notifications.details': $filter('i18n')('hub.nav.label.notification'),
                'notifications.filter-details': $filter('i18n')('hub.nav.label.notification'),
                'notifications.newApps': $filter('i18n')('hub.nav.label.notification'),
                'newAppsList': $filter('i18n')('myapps.mobilepagetitle.notification.newapps'),
                'settings': $filter('i18n')('hub.nav.label.settings')
            };
            vm.isSettingsLoaded = false;
            vm.showContextDialog = false;
            vm.showNotificationsFilters = false;
            vm.filter = '';

            vm.toggleContextDialog = function() {
                vm.showContextDialog = !vm.showContextDialog;
            };

            var getSettings = function() {
                vm.userInfo = SettingsService.getCurrentUser();
                if (vm.userInfo.firstName || vm.userInfo.lastName) {
                    vm.userInfo.initials = vm.userInfo.firstName[0] + vm.userInfo.lastName[0];
                }
                vm.showPeopleTab = TenantCustomizationService.isHubPeopleEnabled();
                var v2HubNotifications = UtilService.isHubV2NotificationsEnabled();
                var inAppNotificationEnabled = TenantCustomizationService.isNotificationsEnabled();
                vm.showNotifications = inAppNotificationEnabled && v2HubNotifications;
            };

            // Initially set the title using the $state.current attribute browserPageTitle
            vm.browserPageTitle = $filter('i18n')($state.current.browserPageTitle);
            // Changing state does not reload the controller, needs to use $transitions to update the title again

            $transitions.onStart({to: '**', from: '**'}, function(transition) {
                var nextRouteName = transition.to().name;
                vm.browserPageTitle = browserPageTitles[nextRouteName];
                if (nextRouteName === 'notifications' && UserAgent.isMobileBrowser()) {
                    vm.showNotificationsFilters = true;
                    vm.filter = transition.params('to').filter;
                } else {
                    vm.showNotificationsFilters = false;
                }
                vm.isSettingsLoaded = (nextRouteName === 'settings');
            });

            getSettings();

            $scope.$on('customizations-loaded', function() {
                getSettings();
            });

            vm.adminConsole = function($event) {
                if ($event) {
                    $event.preventDefault();
                }
                ConfigService.getAdminConsoleUrl().then(function(url) {
                    window.open(url);
                });
            };

            vm.hubSignOut = function($event) {
                SignOutService.continueSignOut($event);
            };

            // Default page of setting is account
            vm.goToSettings = function($event) {
                $state.go('settings');
            };
        }]
});
