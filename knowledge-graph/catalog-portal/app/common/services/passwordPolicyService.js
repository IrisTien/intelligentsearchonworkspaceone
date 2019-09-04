(function(module) {
    'use strict';

    module.service('PasswordPolicyService', [function(){
        var passwordPolicy;

        var setPasswordPolicy = function (policy) {
            passwordPolicy = policy;
        };

        var getPasswordPolicy = function () {
            return passwordPolicy;
        };

        return {
            setPasswordPolicy : setPasswordPolicy,
            getPasswordPolicy : getPasswordPolicy
        }
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
