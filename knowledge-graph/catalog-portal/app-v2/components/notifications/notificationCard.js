appCenter.component('hubNotificationCard', {
    templateUrl: 'app-v2/components/notifications/hubNotificationCardMobile.html',
    bindings: {
        onArchive: '&',
        notification: '=data'
    },
    controller: 'NotificationCardController',
    controllerAs: 'notificationCardCtrl'
});
