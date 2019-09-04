(function(module) {
    'use strict';
    module.service('ModalService', [
        function() {
            var modalService = this;
            var modal;

            modalService.setCurrentModal = function(modal) {
                this.modal = modal;
            };
            modalService.getCurrentModal = function() {
                return this.modal;
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
