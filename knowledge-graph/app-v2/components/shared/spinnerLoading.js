appCenter.component('spinnerLoading', {
    template: '<div ng-include="\'app-v2/components/shared/\' + spinnerCtrl.templateUrl">',
    bindings: {
        overlay: '<',
    },
    controller: ['UserAgent', function(UserAgent) {
        this.templateUrl = UserAgent.isAndroid() ? 'spinnerAndroid.html' : 'spinnerIOS.html';
    }],
    controllerAs: 'spinnerCtrl'
});
