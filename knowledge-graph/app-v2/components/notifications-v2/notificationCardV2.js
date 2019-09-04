appCenter.component('notificationCardV2', {
    template: '<div ng-include="\'app-v2/components/notifications-v2/\' + notificationCardCtrl.templateUrl">',
    bindings: {
        onArchive: '&',
        notification: '=data',
        isLongCard: "="
    },
    controller: 'NotificationCardControllerV2',
    controllerAs: 'notificationCardCtrl'
});
