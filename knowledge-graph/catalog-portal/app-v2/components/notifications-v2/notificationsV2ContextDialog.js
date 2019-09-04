appCenter.component('notificationDialog', {
    template: '<div ng-include="\'app-v2/components/notifications-v2/notificationsV2ContextDialog.html\'">',
    controllerAs: 'notificationDialogCtrl',
    controller: 'NotificationV2ContextDialogController'
});

