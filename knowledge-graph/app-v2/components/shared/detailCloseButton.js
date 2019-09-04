appCenter.component('detailCloseButton', {
    template: '<div ng-include="\'app-v2/components/shared/\' + spinnerCtrl.templateUrl">',
    bindings: {
        overlay: '<',
    },
    controller: ['UserAgent', function(UserAgent) {
        this.templateUrl = UserAgent.isAndroid() ? 'detailCloseButtonAndroid.html' : 'detailCloseButtonIOS.html';
    }],
    controllerAs: 'spinnerCtrl'
});
