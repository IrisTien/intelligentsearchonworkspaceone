(function(module) {
    'use strict';

    module.directive('notificationCard', ['UserAgent', function(UserAgent) {
        if (UserAgent.isAWJadeMobile()) {
            var template = 'app-v2/notifications/notificationCardMobile.html';
        } else {
            var template = 'app-v2/notifications/notificationCardDesktop.html';
        }

        return {
            restrict: 'A',
            replace: true,
            scope: { notification: '=data', onArchive: '&'},
            templateUrl: template,
            controller: 'NotificationCardController',
            bindToController: true,
            controllerAs: 'notificationCardCtrl'
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
