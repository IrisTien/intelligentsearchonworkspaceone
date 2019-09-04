appCenter.component('notificationDetails', {
    templateUrl: 'app-v2/components/notificationDetails/notificationDetails.html',
    bindings: {},
    controller: ['UtilService', 'UserAgent', 'NotificationService', '$state',
        function(UtilService, UserAgent, NotificationService, $state) {
            var notificationsLongCardCtr = this;
            notificationsLongCardCtr.hubBackBtnAction = function() {
                UtilService.goBack();
            };

            if ($state.params.notificationId) {
                notificationsLongCardCtr.cardDetails = NotificationService.getNotificationsById($state.params.notificationId);
            }
        }],
    controllerAs: 'notificationLongCardCtrl'
});
