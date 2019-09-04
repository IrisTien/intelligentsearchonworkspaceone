appCenter.component('breadcrumb', {
    templateUrl: 'app-v2/components/breadcrumb/breadcrumb.html',
    bindings: {
        hideInstall: '<',
        hideRefresh: '<'
    },
    controllerAs: 'breadcrumbCtrl',
    controller: ['UserAgent', 'SettingsService', 'ConfigService', '$state', '$rootScope', '$filter', 'TenantCustomizationService', '$scope', 'NotificationService', 'UtilService', 'ClientRuntimeService',
        function(UserAgent, SettingsService, ConfigService, $state, $rootScope, $filter, TenantCustomizationService, $scope, NotificationService, UtilService, ClientRuntimeService) {
            var vm = this;
            vm.isDesktopAppRefreshing = false;
            this.userInfo = SettingsService.getCurrentUser() || {};
            var versionCheck = NotificationService.showNativeBell();
            // Initially set the title using the $state.current attribute desktopPageTitle
            vm.desktopPageTitle = $filter('i18n')($state.current.desktopPageTitle);
            vm.$state = $state;

            if (Object.keys(this.userInfo).length) {
                this.userInfo.initials = this.userInfo.firstName[0] + this.userInfo.lastName[0];
            }

            vm.desktopRefresh = function(activeTab) {
                if (!vm.isDesktopAppRefreshing) {
                    vm.isDesktopAppRefreshing = true;
                    ConfigService.refreshCache().then(function() {
                        vm.isDesktopAppRefreshing = false;
                    }, function() {
                        vm.isDesktopAppRefreshing = false;
                    });

                    if (activeTab === 'apps') {
                        $rootScope.$broadcast('Desktop-Apps-Refresh');
                    }
                    if (activeTab === 'people') {
                        $rootScope.$broadcast('Desktop-People-Refresh');
                    }
                }
            };

            vm.showAppInstall = function() {
                ClientRuntimeService.showAppInstall();
            };

            vm.checkNotificationsEnabled = function() {
                vm.inAppNotificationEnabled = TenantCustomizationService.isNotificationsEnabled() && UtilService.isHubV2NotificationsEnabled()
                    && !versionCheck && ($state.current.name === 'apps' || $state.current.name === 'apps.details');
            };

            vm.checkNotificationsEnabled();

            $scope.$on('customizations-loaded', function() {
                vm.checkNotificationsEnabled();
            });
        }]
});
