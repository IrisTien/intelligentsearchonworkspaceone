(function(module) {

    'use strict';

    module.controller('SettingsController', ['SettingsService', function(SettingsService){
        var vm = this;
        var properties = ['firstName', 'lastName', 'emailAddress', 'numOfManagedDevices', 'adminUser'];

        vm.backAction = function() {
            return window.history.back();
        };
        vm.isLoading = true;
        SettingsService.getUserInfo().then(function(user){
            _.extend( vm, _.pick(user, properties));
            vm.isLoading = false;
        });
    }]);


})(angular.module('com.vmware.greenbox.appCenter'));
