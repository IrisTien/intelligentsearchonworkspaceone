(function (module) {

    var templateUrl = 'components/modal/examples/controllerModalTemplate.html';

    module.controller('ControllerModalDemo', function ($scope) {
        var demo = this;

        demo.counter = 0;
        demo.messages = ["Hello world", "I am alive.", "That's enough"];

        demo.say = function () {
            $scope.$modal.open(templateUrl, $scope);
        };
    });

    module.controller('InnerController', function ($scope) {
        var inner = this,
            demo = $scope.demo;

        inner.counter = 0;

        inner.increment = function () {
            demo.counter = (demo.counter + 1) % demo.messages.length;
            inner.counter = (inner.counter + 1) % demo.messages.length;
        }
    });



})( angular.module('com.vmware.workspace.components.examples') );
