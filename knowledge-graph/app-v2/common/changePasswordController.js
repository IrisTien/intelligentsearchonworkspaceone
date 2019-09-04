// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('ChangePasswordController', ['ConfigService', '$scope', '$filter', '$notify', 'SettingsService', 'PasswordPolicyService', 'ClientRuntimeService', 'ProgressIndicatorService', 'UtilService',
        function(ConfigService, $scope, $filter, $notify, SettingsService, PasswordPolicyService, ClientRuntimeService, ProgressIndicatorService, UtilService) {
            var vm = this, regex;

            vm.showPasswordForm = false;
            vm.userInfo = SettingsService.getCurrentUser();
            vm.policies = PasswordPolicyService.getPasswordPolicy() || null;
            vm.errorMessage = "";
            vm.showCurrentPassword = false;
            vm.showNewPassword1 = false;
            vm.showNewPassword2 = false;
            vm.currentInputType = "password";
            vm.newInputType1 = "password";
            vm.newInputType2 = "password";
            vm.isLoading = false;

            function resetForm() {
                vm.currentPassword = "";
                vm.newPassword = "";
                vm.confirmNewPassword = "";
                vm.showErrors = false;
                vm.errorMessage = "";
            }

            function getPasswordPolicy() {
                showLoading();
                ConfigService.getPasswordPolicy().then(function(passwordPolicy) {
                    passwordPolicy.get().then(function(policies) {
                        hideLoading();
                        PasswordPolicyService.setPasswordPolicy(policies);
                        vm.policies = policies;
                        vm.showPasswordForm = true;
                        displayPasswordPolicy();
                    }, function() {
                        hideLoading();
                    });
                });
            }

            function displayPasswordPolicy() {
                var regexString = "", policyString = "", nextNode;
                vm.minLength = 0;
                if (vm.policies.minLen) {
                    nextNode = vm.policies.minLower || vm.policies.minUpper || vm.policies.minDigit || vm.policies.minSpecial;
                    policyString += $filter('i18n')('app.passwordPolicy.minLength', vm.policies.minLen) + (nextNode ? ",&nbsp;" + $filter('i18n')('app.passwordPolicy.leastIncludes') + "&nbsp;" : "");
                }
                if (vm.policies.minLower) {
                    nextNode = vm.policies.minUpper || vm.policies.minDigit || vm.policies.minSpecial;
                    policyString += $filter('i18n')('app.passwordPolicy.minLower', vm.policies.minLower) + (nextNode ? ",&nbsp;" : ".");
                    regexString += "(?=(.*[a-z]){" + vm.policies.minLower + "})";
                }
                if (vm.policies.minUpper) {
                    nextNode = vm.policies.minDigit || vm.policies.minSpecial;
                    policyString += (nextNode ? "" : $filter('i18n')('and') + "&nbsp;") + $filter('i18n')('app.passwordPolicy.minUpper', vm.policies.minUpper) + (nextNode ? ",&nbsp;" : ".");
                    regexString += "(?=(.*[A-Z]){" + vm.policies.minUpper + "})";
                }
                if (vm.policies.minDigit) {
                    nextNode = vm.policies.minSpecial;
                    policyString += (nextNode ? "" : $filter('i18n')('and') + "&nbsp;") + $filter('i18n')('app.passwordPolicy.minDigit', vm.policies.minDigit) + (nextNode ? "&nbsp;" : ".");
                    regexString += "(?=(.*[0-9]){" + vm.policies.minDigit + "})";
                }
                if (vm.policies.minSpecial) {
                    policyString += $filter('i18n')('and') + "&nbsp;" + $filter('i18n')('app.passwordPolicy.minSpecial', vm.policies.minSpecial) + ".";
                }
                if (vm.policies.minLen) {
                    if (vm.policies.minLower || vm.policies.minUpper || vm.policies.minDigit || vm.policies.minSpecial) {
                        regexString += "{" + vm.policies.minLen + ",}";
                    } else {
                        regexString += ".{" + vm.policies.minLen + ",}";
                    }
                }
                vm.policyString = policyString;
                regex = new RegExp(regexString);
            }

            function validateForm() {
                vm.showErrors = false;
                vm.errorMessage = "";
                if (vm.newPassword !== vm.confirmNewPassword) {
                    vm.errorMessage = $filter('i18n')('app.changePassword.error.passwordsNoMatch');
                    return;
                } else {
                    vm.errorMessage = "";
                }
                if (regex && !regex.test(vm.newPassword)) {
                    vm.errorMessage = $filter('i18n')('app.changePassword.error.requirementsNoMatch');
                    return;
                }
                return true;
            }

            function showLoading() {
                if (UtilService.isHubBrowsers()) {
                    vm.isLoading = true;
                } else {
                    ProgressIndicatorService.showProgressIndicator();
                }
            }

            function hideLoading() {
                if (UtilService.isHubBrowsers()) {
                    vm.isLoading = false;
                } else {
                    ProgressIndicatorService.hideProgressIndicator();
                }
            }

            function toggleInputType(bool) {
                if (bool) {
                    return "text";
                } else {
                    return "password";
                }
            }

            vm.nativeClose = function() {
                ClientRuntimeService.closePassword();
            };

            vm.togglePassword = function(value) {
                switch (value) {
                    case "current":
                        vm.showCurrentPassword = !vm.showCurrentPassword;
                        vm.currentInputType = toggleInputType(vm.showCurrentPassword);
                        break;
                    case "new1":
                        vm.showNewPassword1 = !vm.showNewPassword1;
                        vm.newInputType1 = toggleInputType(vm.showNewPassword1);
                        break;
                    case "new2":
                        vm.showNewPassword2 = !vm.showNewPassword2;
                        vm.newInputType2 = toggleInputType(vm.showNewPassword2);
                }
            };

            vm.closePasswordForm = function($event) {
                if ($event) {
                    $event.stopPropagation();
                }
                if ($scope.$modal.close) {
                    $scope.$modal.close(true);
                }
                resetForm();
            };

            vm.changePasswordConfirm = function($event) {
                showLoading();
                if ($event) {
                    $event.stopPropagation();
                }
                if (!validateForm()) {
                    hideLoading();
                    return;
                }
                var passwordChangeRequest = {}, challengesObj = {};
                passwordChangeRequest.oldPassword = vm.currentPassword;
                passwordChangeRequest.newPassword = vm.newPassword;
                passwordChangeRequest.challenges = [];
                challengesObj.type = "CurrentPassword";
                challengesObj.response = vm.currentPassword;
                passwordChangeRequest.challenges.push(challengesObj);
                ConfigService.changePassword(passwordChangeRequest).then(function() {
                    hideLoading();
                    $notify.success('app.changePassword.success');
                    vm.closePasswordForm();
                }, function(response) {
                    hideLoading();
                    if (response.status === 400) {
                        vm.showErrors = true;
                        vm.errorMessages = response.data.errors;
                    }
                });
            };

            if (vm.userInfo.localUser) {
                if (vm.policies) {
                    displayPasswordPolicy();
                    resetForm();
                } else {
                    getPasswordPolicy();
                }
            }
        }
    ]);
})(angular.module("com.vmware.greenbox.appCenter"));

