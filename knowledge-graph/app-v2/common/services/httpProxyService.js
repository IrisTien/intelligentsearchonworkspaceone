(function(module) {
    'use strict';
    module.service('HttpProxyService', [
        'Resource',
        'LocalStorageService',
        '$q',
        'LocalStorageConstants',
        function(Resource,
                 LocalStorageService,
                 $q,
                 LocalStorageConstants) {
            this.localStorageAvailable = LocalStorageService.localStorageAvailable;

            this.get = function(apiName, url, headers, fallBackToServer) {
                var timeOfLastStorage = LocalStorageService.getTimeStampOfLastStorage();
                var timeDiff = Date.now() - timeOfLastStorage;
                if (timeDiff > LocalStorageConstants.TIMEOUT) {
                    //clearAll will clear only entitlements, this is called
                    //on pull-to-refresh on entitlements and should not clear
                    //people data
                    this.clearAll();
                    this.clearPeopleSearch();
                }
                if (this.localStorageAvailable && !fallBackToServer) {
                    if (LocalStorageService.isStored(apiName)) {
                        var defer = $q.defer();
                        defer.resolve(LocalStorageService.getResponse(apiName));
                        return defer.promise;
                    } else {
                        var response = Resource(url, headers).get();
                        response.then(function(responseData) {
                            LocalStorageService.setResponse(apiName, responseData);
                        });
                        return response;
                    }
                } else {
                    var response = Resource(url, headers).get();
                    return response;
                }
            };

            this.clear = function(apiName) {
                LocalStorageService.clear(apiName);
            };

            this.updateBookmark = function() {
                if (this.localStorageAvailable) {
                    LocalStorageService.clearAll();
                }
            };

            this.updateActivationStatus = function(appId, activationStatus, appStateReason) {
                if (this.localStorageAvailable && LocalStorageService.isStored(LocalStorageConstants.ENTITLEMENTS)) {
                    LocalStorageService.updateActivationStatus(appId, activationStatus, appStateReason);
                }
            };

            this.clearBootstrap = function() {
                LocalStorageService.clear(LocalStorageConstants.BOOTSTRAP);
            };

            this.clearEntitlements = function() {
                LocalStorageService.clear(LocalStorageConstants.ENTITLEMENTS);
            };

            this.clearEntitlementsCategories = function() {
                LocalStorageService.clear(LocalStorageConstants.ENTITLEMENTS_CATEGORIES);
            };

            this.clearAll = function() {
                LocalStorageService.clearAll();
            };

            this.clearAllAlongWithEnrollmentStatus = function() {
                LocalStorageService.clearAllAlongWithEnrollmentStatus();
            };

            this.setDeviceEnrollmentStatus = function(status) {
                LocalStorageService.setDeviceEnrollmentStatus(status);
            };

            this.setDeviceMgmtStatus = function(mgmtStatus) {
                LocalStorageService.setDeviceMgmtStatus(mgmtStatus);
            };

            this.setDeviceEnrollmentStatusForOktaAppLaunch = function(status) {
                LocalStorageService.setDeviceEnrollmentStatusNoDeviceId(status);
            };

            this.setDeviceMgmtStatusForOktaAppLaunch = function(mgmtStatus) {
                LocalStorageService.setDeviceMgmtStatusNoDeviceId(mgmtStatus);
            };

            this.clearPeopleSearch = function() {
                LocalStorageService.clearPeopleSearch();
            };

            this.getDeviceEnrollmentStatus = function() {
                return LocalStorageService.getDeviceEnrollmentStatus();
            };

            this.getDeviceMgmtStatus = function() {
                return LocalStorageService.getDeviceMgmtStatus();
            };

            this.getDeviceEnrollmentStatusForOktaAppLaunch = function() {
                return LocalStorageService.getDeviceEnrollmentStatusNoDeviceId();
            };

            this.getDeviceMgmtStatusForOktaAppLaunch = function() {
                return LocalStorageService.getDeviceMgmtStatusNoDeviceId();
            };
            this.setStepupStatusForOktaAppLaunch = function(status) {
                LocalStorageService.setStepupStatusForOktaAppLaunch(status);
            };
            this.getStepupStatusForOktaAppLaunch = function() {
                return LocalStorageService.getStepupStatusForOktaAppLaunch();
            };

            this.getHubBranding = function() {
                return LocalStorageService.getResponse(LocalStorageConstants.HUB_BRANDING);
            };

            this.setHubBranding = function(data) {
                LocalStorageService.setResponse(LocalStorageConstants.HUB_BRANDING, data);
            };

            this.setMFRegistrationFlag = function() {
                LocalStorageService.setResponse(LocalStorageConstants.MF_REGISTRATION, true);
            };

            this.getMFRegistrationFlag = function() {
                var timeOfLastStorage = LocalStorageService.getTimeStampOfLastStorage();
                var timeDiff = Date.now() - timeOfLastStorage;
                if (timeDiff > LocalStorageConstants.TIMEOUT) {
                    return false;
                }
                return LocalStorageService.getResponse(LocalStorageConstants.MF_REGISTRATION);
            };
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));

