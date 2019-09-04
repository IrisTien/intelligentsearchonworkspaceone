// (c) 2016 VMware, Inc.  All rights reserved.

(function(module) {
    'use strict';
    module.controller('NotificationV2ContextDialogController', ['$scope', '$state', '$rootScope', 'UserAgent', '$sce', '$filter', '$notify', 'UtilService', 'Resource', '$http', 'RequestFactory', 'ConfigService', 'ModalService', 'NotificationService', 'ClientRuntimeService', 'hznLocalStorage', function($scope, $state, $rootScope, UserAgent, $sce, $filter, $notify, UtilService, Resource, $http, RequestFactory, ConfigService, ModalService, NotificationService, ClientRuntimeService, hznLocalStorage) {
        var vm = this;
        vm.isIOS = UserAgent.isIOS();
        vm.isAndroid = UserAgent.isAndroid();
        vm.filter = $state.params.filter;

        // If Hub Mobile App version above 9.2 or Hub Browser, the notifications routes are not nested under apps
        var state = ((UserAgent.isAWJadeMobile() && UserAgent.isNativeAppVersionIsEqualOrAbove("9.2")) || UserAgent.isBrowser()) ? 'notifications' : 'apps.notifications';
        vm.filtersList = NotificationService.filters;

        vm.goToFilter = function(filterName) {
            $state.go(state, {
                filter: filterName
            });
        };
    }]);
})(angular.module("com.vmware.greenbox.appCenter"));
