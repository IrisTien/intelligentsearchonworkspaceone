(function (module) {

    var templateUrl = 'components/modal/examples/modalTemplate.html';

    module.controller('ModalDemo', function ($scope) {
        var demo = this,
            msgs = ["Hello, world.", "I am alive."];

        demo.messages = msgs;
        demo.externalTemplate = templateUrl;
    });

})( angular.module('com.vmware.workspace.components.examples') );
