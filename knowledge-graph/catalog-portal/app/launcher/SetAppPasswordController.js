(function(module) {
    'use strict';
    module.controller('SetAppPasswordController', [ '$scope', 'LauncherService',
        function($scope, LauncherService) {

            var vm = this;
            vm.app = $scope.$modalOptions.params.app;
            vm.password1 = '';
            vm.password2 = '';

            vm.setAppPassword = function($event) {
                if($event){
                    $event.stopPropagation();
                }
                if(!validatePassword()){
                    return;
                }
                LauncherService.setWSFedAppPassword(vm.app, vm.password1).then(function(response){
                    if(angular.isDefined(response) && response.status===200){
                        vm.password1 = '';
                        vm.password2 = '';
                        $scope.$modal.close();
                        $scope.$modal.alert({
                            title: 'requestSuccessful',
                            message: 'app.setAppPassword.msg.success',
                            ok: 'ok'
                        });
                    }else{
                        $scope.$modal.alert({
                            title: 'requestFailed',
                            message: 'app.setAppPassword.msg.fail',
                            ok: 'ok'
                        });
                    };
                }, function (error){
                    if(!!error.handled) {//When system is under maintenance
                        return;
                    }
                    $scope.$modal.alert({
                        title: 'requestFailed',
                        message: 'app.setAppPassword.msg.fail',
                        ok: 'ok'
                    });
                });
            };
            $scope.$watchCollection('[ctrl.password1,ctrl.password2]', function() {
                $scope.appAuthForm.$setValidity("unique", true);
            });
            function validatePassword() {
                var e1 = $scope.ctrl.password1;
                var e2 = $scope.ctrl.password2;
                if (e1 !== e2) {
                    $scope.appAuthForm.$setValidity("unique", false);
                    return false;
                } else {
                    $scope.appAuthForm.$setValidity("unique", true);
                    return true;
                }
            }

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));
