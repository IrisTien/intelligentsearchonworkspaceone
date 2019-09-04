appCenter.component('settings', {
    templateUrl: 'app-v2/components/settings/settings.html',
    controllerAs: 'hubSettingsCtrl',
    controller: ['SettingsService', 'UserAgent', '$filter', 'AppDownloadService', 'ModalService', 'UtilService', '$scope',
        function(SettingsService, UserAgent, $filter, AppDownloadService, ModalService, UtilService, $scope) {
            var vm = this;

            var updateUserDetails = function() {
                vm.user = SettingsService.getCurrentUser();
                if (vm.user.firstName || vm.user.lastName) {
                    vm.user.initials = vm.user.firstName[0] + vm.user.lastName[0];
                }
                vm.isPasswordChangeEnabled = vm.user.changePasswordAllowed && !UtilService.isMdmOnlyMode();
            };

            //download app
            var isIOS = UserAgent.isIOS() && UserAgent.isBrowser();
            var isAndroid = UserAgent.isAndroid() && UserAgent.isBrowser();

            if (isIOS) {
                vm.downloadTitle = $filter('i18n')('hub.download.ios');
                vm.downloadSubtitle = $filter('i18n')('hub.download.subtitle.mobile');
            } else if (isAndroid) {
                vm.downloadTitle = $filter('i18n')('hub.download.android');
                vm.downloadSubtitle = $filter('i18n')('hub.download.subtitle.mobile');
            }

            vm.downloadApp = function() {
                AppDownloadService.downloadApp();
            };

            vm.openChangePassword = function() {
                ModalService.getCurrentModal().open('app-v2/settings/hubBrowserChangePassword.html');
            };

            updateUserDetails();

            $scope.$on('user-details-loaded', function() {
                updateUserDetails();
            });
        }]
});
