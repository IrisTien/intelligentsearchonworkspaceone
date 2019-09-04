(function(module) {
    'use strict';

    module.service('ConfigService', ['$http', '$q', '$location', 'RequestFactory', 'Resource', 'UtilService', '$cookies', 'HttpProxyService', 'LocalStorageConstants', 'UserAgent',
        function($http, $q, $location, RequestFactory, Resource, UtilService, $cookies, HttpProxyService, LocalStorageConstants, UserAgent) {
            var baseUrl;

            var configService = this;

            var getLink = function(api) {
                return configService.getRootApiResource().get().thenGet('_links').thenGet(api).thenGet('href');
            };

            configService.doNotRefreshCache = false;
            configService.isReloading = false;
            configService.refreshingCookie = false;
            configService.mdmOnly = false;

            configService.getAppCategories = function() {
                var urlPromise = configService.getAppCategoriesUrl();
                return urlPromise.then(function(url) {
                    if (UtilService.hideVirtualApps()) {
                        url = url + "?displayMode=phone";
                    }
                    var request = HttpProxyService.get(LocalStorageConstants.ENTITLEMENTS_CATEGORIES, url, {
                        headers: {
                            'Accept': 'application/hal+json',
                            'method': 'GET'
                        }
                    }, false);
                    return request.then(function(value) {
                        if (value.hasOwnProperty('_embedded')) {
                            return value._embedded.categoryResourceList;
                        }
                    });
                });
            };

            configService.getBaseUrl = function() {
                if (baseUrl) {
                    return baseUrl;
                }
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                }
                return window.location.origin;
            };
            configService.getRootApiResource = function() {
                var tenantCode = UtilService.getQueryParams().tenantCode;
                var apiResourceUrl = configService.getBaseUrl() + '/catalog-portal/services/api';
                if (tenantCode) {
                    apiResourceUrl += '?tenantCode=' + tenantCode;
                }
                return Resource(apiResourceUrl, {
                    cache: true,
                    headers: {'Accept': 'application/hal+json', 'method': 'GET'}
                });
            };
            configService.getEntitlementsUrl = function() {
                return getLink('entitlements');
            };
            configService.getLauncherUrl = function() {
                return getLink('launcher');
            };
            configService.getNotificationUrl = function() {
                return getLink('actioncardNotifications');
            };
            configService.getNotificationBeaconUrl = function() {
                return getLink('actioncardBeacon');
            };
            configService.getAppCategoriesUrl = function() {
                return getLink('categories');
            };
            configService.getLauncherCategoriesUrl = function() {
                return getLink('launcherCategories');
            };
            configService.getBookmarkReorderUrl = function() {
                return getLink('reorderBookmarks');
            };
            configService.enrollmentSupported = function() {
                //Enrollment is supported if the current device is unmanaged.
                // Manged device has deviceUid in the URL
                return window.location.href.indexOf('deviceUdid') < 0;
            };
            configService.getEnrollmentUrl = function() {
                return getLink('enrollDevice');
            };
            configService.getBootstrapUrl = function() {
                return getLink('bootstrap');
            };
            configService.getUserInfoUrl = function() {
                return getLink('user');
            };
            configService.getUserAnnouncementUrl = function() {
                return getLink('userAnnouncement');
            };
            configService.getBrandingUrl = function() {
                return getLink('branding').then(function(brandingUrl) {
                    //TODO: remove when we devMode support
                    return brandingUrl + window.location.search;
                });
            };
            configService.getHubBrandingUrl = function() {
                return getLink('hub-branding').then(function(brandingUrl) {
                    return brandingUrl + window.location.search;
                });
            };
            configService.getRefreshCacheUrl = function() {
                return getLink('refreshCache');
            };

            configService.getAutomatedAppInstallUrl = function() {
                return getLink('automatedAppInstall');
            };
            configService.getOtaUrl = function() {
                return getLink('ota');
            };
            configService.getNativeClientRedirectUrl = function() {
                return getLink('redirect');
            };

            configService.getUserDevicesUrl = function() {
                return getLink('user-devices');
            };
            configService.getEventsUrl = function() {
                return getLink('events');
            };

            configService.getLogoutUrl = function() {
                return getLink('logout');
            };

            configService.getPasswordVaultRootUrl = function() {
                return getLink('passwordVaultRoot');
            };

            configService.getNotificationServiceUrl = function() {
                return getLink('notificationService');
            };

            configService.getUserDevices = function() {
                return getDevices(configService.getUserDevicesUrl());
            };

            configService.getMobileFlowsRegisterUrl = function() {
                return getLink('approvalNotificationsAutoRegistration');
            };

            configService.getMobileFlowsConnectorsUrl = function() {
                return getLink('endUserApprovalConnectors');
            };

            configService.getMobileFlowsConnectorRegistrationUrl = function() {
                return getLink('approvalsConnectorRegistration');
            };

            function getDevices(urlPromise) {
                return urlPromise.then(function(url) {
                    var request = Resource(url, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}});
                    return request.get().thenGet('_embedded').thenGet('userDeviceResourceList');
                });
            }

            configService.unlinkDevice = function(device) {
                if (device && device._links.unlink) {
                    var req = RequestFactory(device._links.unlink.href, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/hal+json'
                        }
                    });
                    return $http(req);
                }
            };

            configService.refreshCache = function(sync) {
                if (configService.doNotRefreshCache) {
                    configService.doNotRefreshCache = false;
                    return;
                }
                var urlPromise = configService.getRefreshCacheUrl();
                // Added this synchronous option to Address IE11 issue HW-71955.
                // In IE11 async refresh call is never places and hence user is not seeing latest
                // data after browser refresh.
                // Had to hardcode the refresh call URL it is async call to get the refreshapi url from
                // root api response.
                if (sync) {
                    var refreshCacheUrl = configService.getBaseUrl() + '/catalog-portal/services/api/refresh';
                    jQuery.ajax({
                        url: refreshCacheUrl,
                        success: function(a) {
                        },
                        async: false
                    });
                } else {
                    return urlPromise.then(function(url) {
                        var request = Resource(url, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}});
                        return request.get();
                    });
                }
            };

            configService.refreshUserCatalogContextToken = function() {
                return Resource($location.absUrl(), {headers: {'method': 'GET'}, 'sync': true}).get();
            };

            configService.getFeatureFlagsUrl = function() {
                return getLink('toggles');
            };
            configService.featureFlags = function() {
                var urlPromise = configService.getFeatureFlagsUrl();
                return urlPromise.then(function(url) {
                    var request = Resource(url, {
                        cache: true,
                        headers: {'Accept': 'application/hal+json', 'method': 'GET'}
                    });
                    return request.get().thenGet('toggles');
                });
            };

            configService.isFeatureEnabled = function(feature) {
                var featureEnabled = false;
                return configService.featureFlags().then(function(features) {
                    var i;
                    for (i = 0; i < features.length; i++) {
                        if (features[i].featureName === feature) {
                            featureEnabled = features[i].enabled;
                        }
                    }
                    return featureEnabled;
                });
            };
            configService.getAdminConsoleUrl = function() {
                return getLink('adminConsole');
            };

            configService.getAdminConsoleTermsUrl = function() {
                return getLink('adminConsoleTerms');
            };

            configService.getMacAppDownloadLink = function() {
                return getLink('appDownload');
            };

            configService.getDeviceRegistrationDetail = function() {
                return getLink('deviceRegistrationDetails').then(function(url) {
                    //url exists only if MDM
                    if (url) {
                        return Resource(url.replace('{deviceId}', UtilService.getQueryParams().deviceUdid), {
                            headers: {
                                'Accept': 'application/vnd.vmware.catalog.devices-registration-details-v1-hal+json',
                                'method': 'GET'
                            }
                        });
                    }
                });
            };

            configService.getDeviceUnRegistrationUrl = function() {
                return getLink('deviceUnregistration');
            };
            configService.getAuthUri = function() {
                return getLink('authUri').then(function(authUri) {
                    var req = Resource(authUri, {headers: {method: 'GET', Accept: 'application/hal+json'}});
                    return req.get().then(function(res) {
                        return res.authUri;
                    });
                });
            };

            configService.apiAuthenticationVerify = function() {
                return getLink('apiAuthenticationVerify').then(function(apiAuthenticationVerifyUrl) {
                    /*If there was 401 call prior to this, server deletes UCC cookie so appending dummy id if UCC is undefined.
                    This call is used to validate if HZN is still valid or not.*/
                    var uccCookie = $cookies.get("USER_CATALOG_CONTEXT") || "dummy-ucc";
                    var finalPpiAuthenticationVerifyUrl = apiAuthenticationVerifyUrl.replace("{eucToken}", uccCookie);
                    if (UserAgent.isAWJade() && configService.mdmOnly) {
                        finalPpiAuthenticationVerifyUrl = finalPpiAuthenticationVerifyUrl + window.location.search;
                    }
                    return $http({
                        url: finalPpiAuthenticationVerifyUrl,
                        method: "HEAD",
                        headers: {Accept: "application/hal+json"}
                    });
                });
            };

            configService.changePassword = function(requestBody) {
                return getLink('changePassword').then(function(url) {
                    var req = RequestFactory(url, {
                        method: 'PUT',
                        headers: [{"Accept": "application/hal+json"},
                            {"Content-Type": "application/json"}],
                        data: requestBody
                    });
                    return $http(req);
                });
            };

            configService.getPasswordPolicy = function() {
                return getLink('passwordPolicy').then(function(url) {
                    return Resource(url, {
                        headers: {
                            'Content-Type': 'application/vnd.vmware.horizon.manager.tenants.tenant.passwordpolicy+json',
                            'method': 'GET'
                        }
                    });
                });
            };

            configService.getTermsOfUse = function() {
                return getLink('termsOfUse').then(function(url) {
                    var req = Resource(url, {headers: {'Accept': 'application/hal+json', 'method': 'GET'}});
                    return req.get().then(function(resp) {
                        return resp;
                    }, function(errorResp) {
                        return errorResp;
                    });
                });
            };

            configService.getTenantCustomizations = function(flag) {
                var cacheRefresh = flag || false;
                return getLink('tenantCustomizations').then(function(url) {
                    return Resource(url.replace('{refreshCache}', cacheRefresh), {
                        headers: {
                            'Accept': 'application/hal+json',
                            'method': 'GET'
                        }
                    }).get();
                });
            };

            configService.getFeatureCustomization = function(flag) {
                var cacheRefresh = flag || false;
                return getLink('featureCustomizations').then(function(url) {
                    return Resource(url.replace('{refreshCache}', cacheRefresh), {
                        headers: {
                            'Accept': 'application/vnd.vmware.catalog.customizations.feature.endUserUI+json',
                            'method': 'GET'
                        }
                    }).get();
                });
            };

            configService.getCatalogCustomizations = function(flag) {
                var cacheRefresh = flag || false;
                return getLink('catalogCustomizations').then(function(url) {
                    return Resource(url.replace('{refreshCache}', cacheRefresh), {
                        headers: {
                            'Accept': 'application/vnd.vmware.catalog.customizations.catalog.composite+json',
                            'method': 'GET'
                        }
                    }).get();
                });
            };

            configService.getPeopleUrl = function() {
                return getLink('userSearch');
            };

            configService.getUserDetailsUrl = function() {
                return getLink('userDetails');
            };

            configService.getVisitedUsersUrl = function() {
                return getLink('visitedUsers');
            };

            configService.getUserConsoleTermsUrl = function() {
                return getLink('vIDMTermsOfUsePage');
            };

            configService.getTermsOfUseStatus = function() {
                return getLink('termsOfUseUserAcceptanceStatus').then(function(url) {
                    return Resource(url, {
                        headers: {
                            'Accept': 'application/hal+json',
                            'method': 'GET'
                        }
                    }).get();
                });
            };

            configService.mdmOnlyWS1 = function(data) {
                configService.mdmOnly = data;
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
