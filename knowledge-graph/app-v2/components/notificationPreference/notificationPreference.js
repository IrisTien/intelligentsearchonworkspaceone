appCenter.component('notificationPreference', {
    templateUrl: 'app-v2/components/notificationPreference/notificationPreference.html',
    controllerAs: 'notificationPreferenceCtrl',
    controller: ['MobileFlowsService', function(MobileFlowsService) {
        var vm = this;
        vm.connectors = [];
        vm.loading = true;

        MobileFlowsService.getConnectors().then(function(connectors) {
            vm.connectors = connectors;
            vm.loading = false;
        }, function() {
            vm.loading = false;
        });

        vm.updatePreference = function(connectorId) {
            var connector = _.find(vm.connectors, {id: connectorId});
            if (connector.status === 'REGISTERED') {
                connector.status = 'IN_PROGRESS';
                MobileFlowsService.enableConnector(connectorId);
            } else if (connector.status === 'UNREGISTERED') {
                MobileFlowsService.disableConnector(connectorId);
            }
        };
    }]
});
