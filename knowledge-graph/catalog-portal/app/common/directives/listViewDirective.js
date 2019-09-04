(function(module) {

    'use strict';
    module.directive('listView', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: { items: '=', selectItem: '&', defaultItem: '=' },
            controller: controller,
            controllerAs: '$listView',
            bindToController: true,
            templateUrl: 'app/common/directives/listView.html'
        };

        function controller() {
            var $listView = this;
            $listView.config = { selectedItem: $listView.defaultItem };
            $listView.selectLabel = function(label) {
                $listView.config.selectedItem = label;
                $listView.selectItem({item: label});
            }
        }
    });

})(angular.module('com.vmware.greenbox.appCenter'));

