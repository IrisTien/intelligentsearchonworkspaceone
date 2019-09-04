appCenter.component('subpageBackButton', {
    template: '<div ng-include="\'app-v2/components/shared/\' + spinnerCtrl.templateUrl">',
    bindings: {
        overlay: '<',
    },
    controller: ['UserAgent', function(UserAgent) {
        this.templateUrl = UserAgent.isAndroid() ? 'subpageBackButtonAndroid.html' : 'subpageBackButtonIOS.html';
    }],
    controllerAs: 'spinnerCtrl'
});
