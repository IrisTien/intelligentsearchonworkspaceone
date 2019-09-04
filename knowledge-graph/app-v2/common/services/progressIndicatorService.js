(function(module) {
    'use strict';

    module.service('ProgressIndicatorService', ['$rootScope',
        function($rootScope) {
            this.showProgressIndicator = function() {
                angular.element(document.querySelector('#global-spinner-container')).css('display', 'block');
                angular.element(document.querySelector('body')).addClass('spinner-overlay');
            };

            this.hideProgressIndicator = function() {
                angular.element(document.querySelector('#global-spinner-container')).css('display', 'none');
                angular.element(document.querySelector('body')).removeClass('spinner-overlay');
            };

            this.showBookmarkingProgressIndicator = function(appId) {
                $rootScope.$broadcast('activate-app-bookmark', {appId: appId});
            };

            this.hideBookmarkingProgressIndicator = function(appId) {
                $rootScope.$broadcast('activate-app-bookmark-end', {appId: appId});
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

