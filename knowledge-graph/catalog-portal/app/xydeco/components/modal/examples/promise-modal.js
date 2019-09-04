(function (module) {

    module.controller('PromiseModalDemo', function ($scope) {
        var demo = this,
            $modal = $scope.$modal;

        var templateUrl = 'components/modal/examples/promiseModalTemplate.html';

        demo.selectedColor = '';

        function setColor( color ) {
            demo.selectedColor = color;
        }

        demo.choose = function () {
            $modal.open( templateUrl, {color: demo.selectedColor})
                .then( setColor );
        }
    });

})( angular.module('com.vmware.workspace.components.examples') );
