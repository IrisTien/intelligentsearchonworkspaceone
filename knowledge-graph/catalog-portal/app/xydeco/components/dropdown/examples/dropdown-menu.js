(function (module) {
    'use strict';
    module.controller('DropdownMenuDemo', function() {
        var demo = this;
        demo.isOpen = false;
        demo.config = {closeOnClick: false};

        demo.toggle = function(){
            demo.isOpen = !demo.isOpen;
        };
    });

})( angular.module('com.vmware.workspace.components.examples') );
