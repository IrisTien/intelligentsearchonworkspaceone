(function(module) {
    'use strict';
    module.controller('SnackBarNotificationsController', ['$scope', '$state', 'NotificationService', 'UserAgent',
        function($scope, $state, NotificationService, UserAgent) {
            var vm = this;
            vm.title = _.get($scope, 'message.argument.notification_card.header.title', '');
            vm.subTitle = _.get($scope, 'message.argument.notification_card.header.subtitle[0]', '');
            vm.description = _.get($scope, 'message.argument.notification_card.body.description', '');
            vm.notificationId = _.get($scope, 'message.argument.id', '');
            vm.notificationLength = _.get($scope, 'message.argument', '');
            vm.isAWJadeMobile = UserAgent.isAWJadeMobile();
            var showGBCount = NotificationService.showNativeBell() || !vm.isAWJadeMobile;

            vm.goToNotification = function(notificationId) {
                var path = showGBCount ? 'notifications' : 'apps.notifications';
                if (notificationId) {
                    $state.go(path, {filter: notificationId});
                } else {
                    $state.go(path);
                }

                NotificationService.clearSnackNotifications();
            };
        }]);
})(angular.module("com.vmware.greenbox.appCenter"));

