(function (module) {

    module.controller('ConfirmModalDemo', function ($scope) {
        var demo = this,
            $modal = $scope.$modal;

        demo.deleted = false;
        demo.cancelled = false;

        demo.action = function () {
            $modal.confirm({
                title: 'Deleting Paragraph',
                message: 'Ok to delete?'
            }).then(
                function () {
                    // Action was confirmed.
                    demo.deleted = true;
                },
                function () {
                    // Action was cancelled.
                    demo.cancelled = true;
                }
            );
        }
    });

})( angular.module('com.vmware.workspace.components.examples') );
