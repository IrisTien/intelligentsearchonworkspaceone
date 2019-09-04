(function(module) {
    'use strict';
    module.service('LocalStorageService', ['UtilService', 'LocalStorageConstants',
        function(UtilService,
                 LocalStorageConstants) {
            var localStorageService = this;
            localStorageService.localStorageAvailable = false;
            localStorageService.lsKey = '';
            localStorageService.userName = '';
            localStorageService.deviceId = '';
            localStorageService.deviceEnrollmentStatusKey = '';
            localStorageService.deviceMgmtStatusKey = '';
            localStorageService.deviceEnrollmentStatusKeyNoDeviceID = '';
            localStorageService.deviceMgmtStatusKeyNoDeviceID = '';
            localStorageService.deviceSteupStatusKeyNoDeviceID = '';

            localStorageService.init = function() {
                var test = 'test';
                try {
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    localStorageService.localStorageAvailable = true;
                } catch (e) {
                    localStorageService.localStorageAvailable = false;
                }

                if (localStorageService.localStorageAvailable) {
                    var deviceID = UtilService.getDeviceID();
                    var userID = UtilService.getUserID();
                    if (deviceID) {
                        localStorageService.lsKey = userID + '~' + deviceID;
                    } else {
                        localStorageService.lsKey = userID;
                    }
                    localStorageService.deviceEnrollmentStatusKey = localStorageService.lsKey + LocalStorageConstants.DEVICE_ENROLLMENT_STATUS;
                    localStorageService.deviceMgmtStatusKey = localStorageService.lsKey + LocalStorageConstants.DEVICE_MGMT_STATUS;
                    localStorageService.deviceEnrollmentStatusKeyNoDeviceID = userID + LocalStorageConstants.DEVICE_ENROLLMENT_STATUS;
                    localStorageService.deviceMgmtStatusKeyNoDeviceID = userID + LocalStorageConstants.DEVICE_MGMT_STATUS;
                    localStorageService.deviceSteupStatusKeyNoDeviceID = userID + LocalStorageConstants.DEVICE_STEPUP_STATUS;
                    if (!localStorage.getItem(localStorageService.lsKey)) {
                        localStorage.setItem(localStorageService.lsKey, JSON.stringify({}));
                    }
                }
            };

            localStorageService.getTimeStampOfLastStorage = function() {
                if (localStorageService.localStorageAvailable) {
                    var lsObj = localStorage.getItem(localStorageService.lsKey);
                    lsObj = JSON.parse(lsObj);
                    if (lsObj.hasOwnProperty(LocalStorageConstants.TIMESTAMP)) {
                        return lsObj[LocalStorageConstants.TIMESTAMP];
                    } else {
                        return 0;
                    }
                }
            };

            localStorageService.setResponse = function(apiName, response) {
                var localStorageObj = JSON.parse(localStorage.getItem(localStorageService.lsKey));
                localStorageObj[apiName] = response;
                localStorageObj[LocalStorageConstants.TIMESTAMP] = Date.now();
                try {
                    localStorage.setItem(localStorageService.lsKey, JSON.stringify(localStorageObj));
                } catch (e) {
                    localStorage.setItem(localStorageService.lsKey, JSON.stringify({}));
                    localStorageService.localStorageAvailable = false;
                }
            };

            localStorageService.getResponse = function(apiName) {
                var lsObj = localStorage.getItem(localStorageService.lsKey);
                lsObj = JSON.parse(lsObj);
                var response = lsObj[apiName];
                return response;
            };

            localStorageService.isStored = function(apiName) {
                if (localStorageService.localStorageAvailable) {
                    var lsObj = localStorage.getItem(localStorageService.lsKey);
                    lsObj = JSON.parse(lsObj);
                    var isLsObjEmpty = jQuery.isEmptyObject(lsObj);
                    if (!isLsObjEmpty) {
                        var isStored = jQuery.isEmptyObject(lsObj[apiName]);
                        return (!isStored);
                    }
                    return false;
                }
                return false;
            };

            localStorageService.getEntitlements = function() {
                var entitlementsObj = localStorageService.getResponse(LocalStorageConstants.ENTITLEMENTS);
                var entitlements = entitlementsObj._embedded.entitlements;
                return entitlements;
            };

            localStorageService.setEntitlements = function(entitlements) {
                var entitlementsObj = localStorageService.getResponse(LocalStorageConstants.ENTITLEMENTS);
                entitlementsObj._embedded.entitlements = entitlements;
                var lsObj = localStorage.getItem(localStorageService.lsKey);
                lsObj = JSON.parse(lsObj);
                lsObj[LocalStorageConstants.ENTITLEMENTS] = entitlementsObj;
                localStorage.setItem(localStorageService.lsKey, JSON.stringify(lsObj));
            };

            localStorageService.updateActivationStatus = function(appId, activationStatus, appStateReason) {
                var entitlements = localStorageService.getEntitlements();
                if (entitlements.length != 0) {
                    var index = entitlements.map(function(e) {
                        return e.appId;
                    }).indexOf(appId);
                    entitlements[index].installStatus = activationStatus;
                    if (appStateReason) {
                        entitlements[index].appStateReason = appStateReason;
                    }
                    localStorageService.setEntitlements(entitlements);
                }
            };

            localStorageService.clear = function(apiName) {
                if (localStorageService.isStored(apiName)) {
                    var lsObj = localStorage.getItem(localStorageService.lsKey);
                    lsObj = JSON.parse(lsObj);
                    delete lsObj[apiName];
                    localStorage.setItem(localStorageService.lsKey, JSON.stringify(lsObj));
                }
            };

            localStorageService.setDeviceEnrollmentStatusNoDeviceId = function(status) {
                localStorage.setItem(localStorageService.deviceEnrollmentStatusKeyNoDeviceID, status);
            };

            localStorageService.setDeviceEnrollmentStatus = function(status) {
                localStorage.setItem(localStorageService.deviceEnrollmentStatusKey, status);
            };

            localStorageService.setDeviceMgmtStatusNoDeviceId = function(status) {
                localStorage.setItem(localStorageService.deviceMgmtStatusKeyNoDeviceID, status);
            };

            localStorageService.setDeviceMgmtStatus = function(status) {
                localStorage.setItem(localStorageService.deviceMgmtStatusKey, status);
            };

            localStorageService.getDeviceEnrollmentStatusNoDeviceId = function() {
                return localStorage.getItem(localStorageService.deviceEnrollmentStatusKeyNoDeviceID);
            };

            localStorageService.getDeviceEnrollmentStatus = function() {
                return localStorage.getItem(localStorageService.deviceEnrollmentStatusKey);
            };

            localStorageService.getDeviceMgmtStatusNoDeviceId = function() {
                return localStorage.getItem(localStorageService.deviceMgmtStatusKeyNoDeviceID);
            };

            localStorageService.getDeviceMgmtStatus = function() {
                return localStorage.getItem(localStorageService.deviceMgmtStatusKey);
            };

            localStorageService.setStepupStatusForOktaAppLaunch = function(status) {
                localStorage.setItem(localStorageService.deviceSteupStatusKeyNoDeviceID, status);
            };

            localStorageService.getStepupStatusForOktaAppLaunch = function() {
                return localStorage.getItem(localStorageService.deviceSteupStatusKeyNoDeviceID);
            };

            localStorageService.clearDeviceEnrollmentStatus = function() {
                localStorage.removeItem(localStorageService.deviceEnrollmentStatusKey);
                localStorage.removeItem(localStorageService.deviceMgmtStatusKey);
                localStorage.removeItem(localStorageService.deviceEnrollmentStatusKeyNoDeviceID);
                localStorage.removeItem(localStorageService.deviceMgmtStatusKeyNoDeviceID);
                localStorage.removeItem(localStorageService.deviceSteupStatusKeyNoDeviceID);
            };

            localStorageService.clearAll = function() {
                localStorageService.clear(LocalStorageConstants.TIMESTAMP);
                localStorageService.clear(LocalStorageConstants.ENTITLEMENTS);
                localStorageService.clear(LocalStorageConstants.ENTITLEMENTS_CATEGORIES);
                localStorageService.clear(LocalStorageConstants.BOOTSTRAP);
                localStorageService.clear(LocalStorageConstants.BOOKMARKS);
                localStorageService.clear(LocalStorageConstants.NEW_APP);
                localStorageService.clear(LocalStorageConstants.RECOMMENDED_APPS);
            };

            localStorageService.clearAllAlongWithEnrollmentStatus = function() {
                localStorageService.clearAll();
                localStorageService.clearDeviceEnrollmentStatus();
            };

            localStorageService.clearPeopleSearch = function() {
                localStorageService.clear(LocalStorageConstants.PEOPLE_DIRECTS_DETAILS);
                localStorageService.clear(LocalStorageConstants.PEOPLE_PEER_DETAILS);
            };

            localStorageService.init();
        }
    ]);
})(angular.module('com.vmware.greenbox.appCenter'));
