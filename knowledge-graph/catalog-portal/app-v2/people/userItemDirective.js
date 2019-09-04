// Directive will be needed when Copy Email functionality is integrated in future.
(function(module) {
    module.directive('userItem', ['$state', '$timeout', 'CopyToClipboardService', 'ClientRuntimeService', 'UserAgent', 'UtilService', function($state, $timeout, CopyToClipboardService, ClientRuntimeService, UserAgent, UtilService) {
        return {
            restrict: 'A',
            scope: {
                user: '='
            },
            replace: true,
            templateUrl: 'app-v2/people/userItem.html',
            link: function(scope, element, attr) {
                scope.nativeEmailClientSupported = UserAgent.isNativeAppVersionIsEqualOrAbove('3.3');
                scope.copyEmailSupported = UtilService.copyEmailSupported();

                scope.userDetails = function(user) {
                    $state.go('people.details', {
                        userId: encodeURIComponent(user.id)
                    });
                };

                scope.copyEmail = function(value) {
                    var copyStatus = CopyToClipboardService.copy(value.email);
                    if (copyStatus) {
                        value.isCopied = true;
                        $timeout(function() {
                            value.isCopied = false;
                        }, 3000);
                    }
                };

                scope.openEmail = function(emailAddress) {
                    ClientRuntimeService.openEmail(emailAddress);
                };
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
