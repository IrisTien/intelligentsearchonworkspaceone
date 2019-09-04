appCenter.component('settingSubpage', {
    template: '<div ng-include="\'app-v2/components/settingSubpage/partials/\' + settingSubpageCtrl.templateUrl">',
    controllerAs: 'settingSubpageCtrl',
    controller: ['$stateParams',
                 '$state',
                 '$filter',
                 'SettingsService',
                 'ConfigService',
                 'UserAgent',
                 'ClientRuntimeService',
                 'ModalService',
        function($stateParams,
                 $state,
                 $filter,
                 SettingsService,
                 ConfigService,
                 UserAgent,
                 ClientRuntimeService,
                 ModalService) {
            var vm = this;
            vm.user = {};

            this.templateUrl = $stateParams.pageId + '.html';

            var settingNavLabels = {
                account: $filter('i18n')('hub.nav.label.settings.account'),
                devices: $filter('i18n')('hub.nav.label.settings.devices'),
                whatsnew: $filter('i18n')('hub.nav.label.settings.whatsnew'),
                about: $filter('i18n')('hub.nav.label.settings.about'),
                preferences: $filter('i18n')('hub.nav.label.settings.preferences'),
            };

            this.breadcrumbName = settingNavLabels[$stateParams.pageId];

            this.goToSettingsDefaultPage = function() {
                if (window.innerWidth > 768) {
                    $state.go('settings.page', {
                        pageId: 'account'
                    });
                } else {
                    // In mobile go to settings page, which only has settings nav
                    $state.go('settings');
                }
            };

            vm.user = SettingsService.getCurrentUser();
        }]
});
