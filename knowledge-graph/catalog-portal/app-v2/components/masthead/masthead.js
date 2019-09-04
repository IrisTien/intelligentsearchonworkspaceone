appCenter.component('masthead', {
    templateUrl: 'app-v2/components/masthead/mobile.html',
    bindings: {
        title: '<',
        subPage: '<',
        disabled: '<',
        searchPath: '<',
        hideAvatar: '<?',
        hideSearch: '<?'
    },
    controllerAs: 'mastheadCtr',
    controller: ['UserAgent', 'SettingsService', 'NotificationService', 'ClientRuntimeService',
        'UtilService', '$state', '$element', 'TenantCustomizationService', 'ConfigService', '$scope',
        function(UserAgent, SettingsService, NotificationService, ClientRuntimeService,
                 UtilService, $state, $element, TenantCustomizationService, ConfigService, $scope) {
            var vm = this;
            vm.userInfo = SettingsService.getCurrentUser() || {};
            vm.isIOS = UserAgent.isIOS();
            vm.isAWJade = UserAgent.isAWJade();
            this.inAppNotificationEnabled = TenantCustomizationService.isNotificationsEnabled();
            var versionCheck = NotificationService.showNativeBell();

            var getNotificationSettings = function() {
                vm.userInfo = SettingsService.getCurrentUser();
                if (Object.keys(vm.userInfo).length) {
                    vm.userInfo.initials = vm.userInfo.firstName[0] + vm.userInfo.lastName[0];
                }
                vm.showNotificationsBell = !versionCheck && ($state.current.name === 'apps' || $state.current.name === 'apps.notificationsDeeplink');
                vm.inAppNotificationEnabled = TenantCustomizationService.isNotificationsEnabled();
            };

            vm.accounts = function() {
                if (UserAgent.isAWJadeMobile()) {
                    ClientRuntimeService.accounts();
                }
            };

            vm.goBack = function() {
                UtilService.goBack();
            };

            vm.openSearch = function(state) {
                if (this.isIOS) {
                    $element.find('.dummy-input').focus();
                }
                $state.go(state);
            };

            getNotificationSettings();

            $scope.$on('customizations-loaded', function() {
                getNotificationSettings();
            });
        }]
});
