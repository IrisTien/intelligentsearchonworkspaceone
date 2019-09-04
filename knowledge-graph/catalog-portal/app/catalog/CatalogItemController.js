
(function(module) {

    'use strict';

    var typeNames = {
        WEB: 'appCenter.type.web',
        VIRTUAL: 'appCenter.type.virtual',
        NATIVE: 'appCenter.type.native',
        NATIVE_PLATFORM: 'appCenter.type.native.platform',
        THINAPP: 'app.details.label.type.THINAPP',
        PROFILE: 'app.details.label.type.PROFILE'
    };

    var platformNames = {
        IOS: 'iOS',
        ANDROID: 'Android',
        WINDOWS: 'Windows',
        MAC: 'OS X',
        none: 'Unknown'
    };

    module.controller('CatalogItemController',['$scope', 'CatalogService', 'OfflineService', 'UserAgent', 'INSTALL_STATUS','$window', '$filter', 'LauncherService', '$sce', '$element', '$timeout', '$document', 'DetailsService', 'DeviceBreakpointService',
    function($scope, CatalogService, OfflineService, UserAgent, INSTALL_STATUS, $window, $filter, LauncherService, $sce, $element, $timeout, $document, DetailsService, DeviceBreakpointService){
        var catalogItemViewModel = this;
        var catalogApp = catalogItemViewModel.app;
        //Defaulting the status if a status has not being passed. Need to decide on if string is passed or enumeration.
        var appStatus = catalogApp.installStatus;
        var platform = 'none';

        if(appStatus === "" || appStatus === undefined ){
            appStatus = INSTALL_STATUS.NOT_ACTIVATED.nativeAction;
        } else if (!catalogApp.visible) {
            appStatus = 'HIDDEN';
        } else if ((catalogApp.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(appStatus) >= 0) || (catalogApp.subType === 'THINAPP' && catalogApp.perDeviceActivationRequired)) {
            appStatus = 'REQUEST';
        }

        var getIconUrl = function(app){
            return app['_links']['icon'] != undefined ? app['_links']['icon']['href'] : '';
        };
        var getInstallUrl = function(app){
            return app['_links']['install']['href'];
        };

        catalogApp.typeName = typeNames[catalogApp.type];
        catalogApp.installAction = CatalogService.getInstallStatusText(appStatus, catalogApp);
        catalogApp.installUrl = getInstallUrl(catalogApp);
        var iconUrl = getIconUrl(catalogApp);
        catalogApp.backgroundImage =  iconUrl ? 'url(' + iconUrl + ')' : 'none';
        catalogApp.appNeedToActivated = catalogApp.installStatus === 'NOT_ACTIVATED' || catalogApp.installStatus === 'UPDATE' || catalogApp.installStatus === 'ACTIVATION_FAILED' || (catalogApp.installStatus !== 'NOT_ACTIVATED' && !catalogApp.visible) || (catalogApp.subType === 'THINAPP' && catalogApp.perDeviceActivationRequired);
        if ( catalogApp.subType === 'THINAPP') {
            catalogApp.typeName = typeNames.THINAPP;
        } else if (catalogApp.subType === 'PROFILE'){
            catalogApp.typeName = typeNames.PROFILE;
        } else if ( catalogApp.type === 'NATIVE' && catalogApp.subType !== 'THINAPP') {
            var lowerCaseDeviceType = workspaceOne.deviceType.toLowerCase();
            if (lowerCaseDeviceType  == 'apple' ) {
                platform = 'IOS';
            } else if (lowerCaseDeviceType == 'android') {
                platform = 'ANDROID';
            } else if ( lowerCaseDeviceType == 'winrt' || lowerCaseDeviceType == 'windowsphone8' ||
                lowerCaseDeviceType == 'windowsmobile' || lowerCaseDeviceType == 'windowspc' || lowerCaseDeviceType == 'windowsphone') {
                platform = 'WINDOWS';
            } else if ( lowerCaseDeviceType == 'appleosx') {
                platform = 'MAC';
            }
            if ( platform ) {
                catalogApp.typeName = typeNames.NATIVE_PLATFORM;
                catalogApp.platformName = platformNames[platform];
            }
        }

        catalogItemViewModel.details = function(appId) {
            DetailsService.setAppDetails(catalogApp);
            location.hash = '#/details/' + appId + '/catalog';
        };
        
        catalogApp.imageLoaded = false;        
        function onLoadImage() {
            var width = img.width;
            $element.find('.emblem-image').css('width' , '');
            $element.find('.emblem-image').css('top' , '');
            var iconSize = parseInt($element.find('.emblem-image').css('width'));
            var backgroundSize, size, top;
            if (width < iconSize){
                backgroundSize = 'auto'; 
                size = width;
                top = (iconSize - width)/2;
            } 
            else {
                 backgroundSize = 'contain'; 
                 size = iconSize;
            } 
            $element.find('.emblem-image').css('width', size);
            $element.find('.emblem-image').css('height', size);
            $element.find('.emblem-image').css('top', top);
            
            $timeout(function() {
                catalogApp.backgroundSize = backgroundSize;
                catalogApp.imageLoaded = true;
            });
        }
        
        var img = new Image();
        img.onload = onLoadImage.bind(img);
        img.src = iconUrl;
        
        onLoadImage();
        
        angular.element($window).bind('resize', function () {
            if(!DeviceBreakpointService.isPhone()) {
                onLoadImage();
            } else{
                $element.find('.emblem-image').css('width' , '');
                $element.find('.emblem-image').css('height', '');
                $element.find('.emblem-image').css('top' , '');
                $element.find('.emblem-image').css('background-size', 'contain');
            }
        });
        
    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
