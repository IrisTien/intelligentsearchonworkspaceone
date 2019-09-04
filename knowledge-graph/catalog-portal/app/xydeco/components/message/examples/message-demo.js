(function (module) {

    module.controller('MessageDemo', function ($scope) {

        var demo = this,
            templateUrl = 'components/message/examples/externalMessageTemplate.html';

        demo.error = {type: 'error', text:'Error message.'};
        demo.success = {type: 'success', text:'Success Message'};
        demo.warning = {type: 'warning', text:'Warning Message'};
        demo.info = {
            type: 'info',
            text:'Info Message. ' +
                'There are a lot of things we might say about this, ' +
                'so this message could get quite long.'
            };
        demo.untyped = {text:'This message is not categorized'};

        demo.all = [
            demo.error,
            demo.success,
            demo.warning,
            demo.info,
            demo.untyped
        ];

        demo.custom = {
            text:'Error message.',
            type: 'error',
            info: 'Additional information',
            templateUrl: templateUrl
        };
    });

})( angular.module('com.vmware.workspace.components.examples') );
