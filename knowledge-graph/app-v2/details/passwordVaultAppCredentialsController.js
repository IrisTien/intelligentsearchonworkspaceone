(function(module) {
    'use strict';
    module.controller('PasswordVaultAppCredentialsController', ['$scope', 'PasswordVaultAppCredentialsService', 'ModalService',
        function($scope, PasswordVaultAppCredentialsService, ModalService) {
            var vm = this;
            vm.app = $scope.$modalOptions.params.app;

            vm.username = vm.app.pvAppCredentials.userName;
            vm.usernameCredentialName = vm.app.pvAppCredentials.userNameCredentialName;
            vm.password = vm.app.pvAppCredentials.password;
            vm.passwordCredentialName = vm.app.pvAppCredentials.passwordCredentialName;
            vm.showUserName = vm.app.pvAppCredentials.userNameEditable;
            vm.showPassword = vm.app.pvAppCredentials.passwordEditable;

            function validatePassword() {
                var e1 = $scope.ctrl.username;
                var e2 = $scope.ctrl.password;
                if (vm.showUserName && (!e1 || e1.trim() === '')) {
                    $scope.appAuthForm.$setValidity("username", false);
                    return false;
                } else if (vm.showPassword && (!e2 || e2.trim() === '')) {
                    $scope.appAuthForm.$setValidity("password", false);
                    return false;
                } else {
                    $scope.appAuthForm.$setValidity("username", true);
                    $scope.appAuthForm.$setValidity("password", true);
                    return true;
                }
            }

            vm.toggleShowClearTextPassword = function() {
                var passwordField = document.getElementById('password');
                var value = passwordField.value;

                if (passwordField.type == 'password') {
                    passwordField.type = 'text';
                } else {
                    passwordField.type = 'password';
                }
                passwordField.value = value;
            };

            vm.copyPasswordToClipboard = function() {
                if (document.queryCommandSupported('copy')) {
                    var passwordField = document.getElementById('password');
                    passwordField.type = 'text';
                    passwordField.select();

                    try {
                        var successful = document.execCommand('copy');
                        passwordField.type = 'password';
                    } catch (err) {
                        passwordField.type = 'password';
                    }
                }
            };
            vm.setPVAppCredentials = function($event) {
                if ($event) {
                    $event.stopPropagation();
                }
                if (!validatePassword()) {
                    return;
                }
                var params = {};
                if (vm.showUserName) {
                    params.userNameCredentialName = vm.usernameCredentialName;
                    params.userName = vm.username.trim();
                }
                if (vm.showPassword) {
                    params.passwordCredentialName = vm.passwordCredentialName;
                    params.password = vm.password.trim();
                }

                PasswordVaultAppCredentialsService.setPVAppCredentials(vm.app.pvappCredentials, params).then(function(response) {
                    if (angular.isDefined(response) && response.status === 200) {
                        ModalService.getCurrentModal().close();
                        ModalService.getCurrentModal().alert({
                            title: 'requestSuccessful',
                            message: 'pvapp.setAppPassword.msg.success',
                            ok: 'ok'
                        });
                    } else {
                        ModalService.getCurrentModal().alert({
                            title: 'requestFailed',
                            message: 'pvapp.setAppPassword.msg.fail',
                            ok: 'ok'
                        });
                    }
                }, function(error) {
                    if (error.handled) { //When system is under maintenance
                        return;
                    }
                    ModalService.getCurrentModal().alert({
                        title: 'requestFailed',
                        message: 'pvapp.setAppPassword.msg.fail',
                        ok: 'ok'
                    });
                });
            };
            PasswordVaultAppCredentialsService.getPVAppCredentials(vm.app.pvappCredentials).then(function(resp) {
                vm.usernameCredentialName = resp.data.userNameCredentialName;
                vm.username = resp.data.userName;
                vm.passwordCredentialName = resp.data.passwordCredentialName;
                vm.password = resp.data.password;
                vm.showUserName = resp.data.userNameEditable;
                vm.showPassword = resp.data.passwordEditable;
            });
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
