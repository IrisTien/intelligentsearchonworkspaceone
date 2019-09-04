appCenter.component('settingList', {
    templateUrl: 'app-v2/components/settingList/settingList.html',
    bindings: {
        page: '<'
    },
    controllerAs: 'settingListCtrl',
    controller: ['$stateParams', '$filter',
        function($stateParams, $filter) {
            var vm = this;

            var settingNavLabels = {
                account: $filter('i18n')('hub.nav.label.settings.account'),
                devices: $filter('i18n')('hub.nav.label.settings.devices'),
                whatsnew: $filter('i18n')('hub.nav.label.settings.whatsnew'),
                about: $filter('i18n')('hub.nav.label.settings.about'),
                preferences: $filter('i18n')('hub.nav.label.settings.preferences'),
            };

            vm.settingsNavName = settingNavLabels[vm.page.pageId];
        }]
});
