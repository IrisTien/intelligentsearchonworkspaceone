(function (module) {

    var templateUrl = 'components/modal/examples/messageModalTemplate.html';

    module.controller('MessageModalDemo', function ($scope) {
        var demo = this;

        demo.messages = [{
            text: "Hello, world.",
            type: 'success'
        }, {
            text: "I am unwell.",
            type: 'error'
        }];

        demo.externalTemplate = templateUrl;
    });

})( angular.module('com.vmware.workspace.components.examples') );
