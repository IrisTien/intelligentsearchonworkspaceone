(function(module) {
    'use strict';
    module.service('CatalogService', [
        '$http',
        '$q',
        'RequestFactory',
        'Resource',
        '$sce',
        'ConfigService',
        'INSTALL_STATUS',
        'Localization',
        'OfflineService',
        '$filter',
        'ClientRuntimeService',
        '$notify',
        '$timeout',
        'EventsService',
        'UserAgent',
        'UtilService',
        'BookmarksService',
        'ModalService',
        'PollingService',
        'AppLaunchService',
        'HttpProxyService',
        'hznLocalStorage',
        'LocalStorageConstants',
        '$rootScope',
        'ProgressIndicatorService',
        'DetailsService',
        'BootstrapService',
        'NativeBridgeService',
        function(
            $http,
            $q,
            RequestFactory,
            Resource,
            $sce,
            ConfigService,
            INSTALL_STATUS,
            Localization,
            OfflineService,
            $filter,
            ClientRuntimeService,
            $notify,
            $timeout,
            EventsService,
            UserAgent,
            UtilService,
            BookmarksService,
            ModalService,
            PollingService,
            AppLaunchService,
            HttpProxyService,
            hznLocalStorage,
            LocalStorageConstants,
            $rootScope,
            ProgressIndicatorService,
            DetailsService,
            BootstrapService,
            NativeBridgeService) {
            var ALL_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.allApps'),
                type: 'all',
                isDefault: true,
                isAppTypeFilter: false,
                isDataDrivenLabelFilter: false
            };
            var WEB_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.webApps'),
                type: 'Web',
                isDefault: false,
                isAppTypeFilter: true,
                isDataDrivenLabelFilter: false
            };
            var VIRTUAL_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.virtualApps'),
                type: 'Virtual',
                isDefault: false,
                isAppTypeFilter: true,
                isDataDrivenLabelFilter: false
            };
            var NATIVE_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.mobileApps'),
                type: 'Native',
                isDefault: false,
                isAppTypeFilter: true,
                isDataDrivenLabelFilter: false
            };
            var RECOMMENDED_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.recommendedApps'),
                type: 'Recommended',
                isDefault: false,
                isAppTypeFilter: false,
                isDataDrivenLabelFilter: false
            };

            var NEWLY_ENTITLED_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.newlyEntitledApps'),
                type: 'new',
                isDefault: false,
                isAppTypeFilter: false,
                isDataDrivenLabelFilter: true
            };

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

            var EULA_TEMPLATE_URL = '/catalog-portal/services/api/activate/{appId}/acceptEula/{eulaContentId}';
            var selectedCategory = ALL_APPS_LABEL;
            var allCategories = [];
            var deviceStatus;
            var nativeAppStatusMap = {};
            var tunnelAppAlreadyInstalledOrNotManaged = false;
            var tunnelApp = {};
            var playStoreDomain = "play.google.com";
            var isNewAppsLabelEnabled = UtilService.getObjValue(window, 'workspaceOne.featureFlags.NEW_APPS_LABEL', false);
            var isHubApp = UtilService.isHub();
            var catalogService = this;

            if (UserAgent.isMacJade()) {
                NATIVE_APPS_LABEL.name = Localization.getLocalizedString('myapp.nav.macApps');
            } else if (UserAgent.isWindowsJade() && UserAgent.isAWJadeDesktop()) {
                NATIVE_APPS_LABEL.name = Localization.getLocalizedString('myapp.nav.windowsApps');
            }

            function getCategoryName(category) {
                if (category && category.type && category.type === 'all' || !category) {
                    return '';
                } else if (category.type === 'Recommended' || category.type === 'Web' || category.type === 'Native' || category.type === 'Virtual' || category.type === 'NewlyEntitledApps') {
                    return category.type;
                } else {
                    return category.name;
                }
            }

            this.isStatusRequest = function(app) {
                var status = false;
                if (app.approvalRequired && ['NOT_ACTIVATED', 'ACTIVATION_FAILED'].indexOf(app.installStatus) >= 0) {
                    status = true;
                } else if (app.subType === 'THINAPP' && app.perDeviceActivationRequired) {
                    status = true;
                } else if (app.approvalRequiredForMdmApp && !app.appStateReason && app.installStatus === 'NOT_ACTIVATED') {
                    status = true;
                } else if (app.approvalRequiredForMdmApp && app.appStateReason && (app.appStateReason === 'RequestRejected' ||
                    app.appStateReason === 'RequestFailed' || app.appStateReason === 'RequestExpired')) {
                    status = true;
                }
                return status;
            };

            this.setAllCategory = function(categories) {
                allCategories = categories;
            };

            this.getAllCategory = function() {
                return allCategories;
            };

            this.setSelectedCategory = function(selCategory) {
                selectedCategory = selCategory;
            };

            this.getSelectedCategory = function() {
                return selectedCategory;
            };

            this.setDeviceStatus = function(status) {
                deviceStatus = status;
            };

            this.getDeviceStatus = function() {
                return deviceStatus;
            };

            this.setNativeAppStatus = function(apps) {
                var jsonStringify = apps;
                if (_.isString(apps)) {
                    jsonStringify = JSON.parse(apps);
                }

                if (jsonStringify && jsonStringify.length) {
                    jsonStringify.map(function(app) {
                        nativeAppStatusMap[app.appId] = app.status;
                    });
                    $rootScope.$broadcast('native-app-status-change', {nativeAppMap: nativeAppStatusMap});
                }
            };

            this.getNativeAppStatus = function(appId) {
                return nativeAppStatusMap[appId];
            };

            this.getFirstPage = function(appCenterContext, noCache, excludeThinApps, directEnrollmentEnabled, fallBackToServer) {
                return ConfigService.getEntitlementsUrl().then(function(url) {
                    var params = {};
                    var response = {};
                    if (excludeThinApps) {
                        params.excludeThinApps = excludeThinApps;
                    }
                    if (directEnrollmentEnabled) {
                        params.mdmManagedAutoDeploy = true;
                        fallBackToServer = true;
                    }
                    params.q = appCenterContext.searchText;
                    if (appCenterContext.selectedCategory.isAppTypeFilter) {
                        params.appType = getCategoryName(appCenterContext.selectedCategory);
                        params.category = "";
                        params.label = "";
                    } else if (appCenterContext.selectedCategory.isDataDrivenLabelFilter) {
                        params.label = getCategoryName(appCenterContext.selectedCategory);
                        params.category = "";
                        params.appType = "";
                    } else if (appCenterContext.searchText) {
                        params.appType = "";
                        params.category = "";
                        params.label = "";
                    } else {
                        params.category = getCategoryName(appCenterContext.selectedCategory);
                        params.appType = "";
                        params.label = "";
                    }

                    if (UtilService.hideVirtualApps()) {
                        params.displayMode = "phone";
                    }

                    if (params.category || params.appType || params.label) {
                        fallBackToServer = true;
                    }
                    if (noCache) {
                        url += "?noCache=" + noCache;
                    }

                    //sync call
                    var request = HttpProxyService.get(LocalStorageConstants.ENTITLEMENTS, url, {
                        headers: {
                            'Accept': 'application/hal+json',
                            'method': 'GET'
                        }, sync: noCache, params: params
                    }, fallBackToServer);
                    return request.then(function(entitlementsResponse) {
                        response.allEntitlementsLoaded = entitlementsResponse.allEntitlementsLoaded;
                        response.loadFromDbFailed = entitlementsResponse.loadFromDbFailed;
                        var entitlements = UtilService.getObjValue(entitlementsResponse, '_embedded[entitlements]', []);
                        var categories = UtilService.getObjValue(entitlementsResponse, '_embedded[categories]', []);
                        response.entitlements = _.uniq(entitlements, 'appId');
                        response.categories = categories;
                        // Invoke the native bridge function to pass the list of native apps to fetch the live app status
                        if (UtilService.isNativeBridge()) {
                            var nativeApps = entitlements.filter(function(app) {
                                return app.type === 'NATIVE' && app.installStatus !== 'REQUEST';
                            }).map(function(app) {
                                return app.appId;
                            });
                            NativeBridgeService.getAppStatus(nativeApps);
                        }

                        var bookmarks = UtilService.getObjValue(entitlementsResponse, '_embedded[bookmarks]', []);
                        response.bookmarks = _.uniq(bookmarks, 'appId');
                        response.deviceStatus = UtilService.getObjValue(entitlementsResponse, 'deviceInfo.[deviceStatus]', undefined);
                        response.authErrorType = entitlementsResponse.authErrorType;
                        if (isHubApp) {
                            response.bookmarkOrderSet = UtilService.getObjValue(entitlementsResponse, 'bookmarkOrderSet', false);
                        }
                        return response;
                    });
                });
            };

            this.getNewApps = function(noCache, excludeThinApps, fallBackToServer) {
                var response = {};
                return ConfigService.getEntitlementsUrl().then(function(url) {
                    if (UtilService.hideVirtualApps()) {
                        url = url + "?displayMode=phone";
                    }
                    var request = HttpProxyService.get(LocalStorageConstants.NEW_APP,
                        url, {
                            headers: {'Accept': 'application/hal+json', 'method': 'GET'},
                            sync: noCache,
                            params: {label: 'New', excludeThinApps: excludeThinApps}
                        }, fallBackToServer);

                    return request.then(function(entitlementsResponse) {
                        var entitlements = UtilService.getObjValue(entitlementsResponse, '_embedded[entitlements]', []);
                        response.entitlements = _.uniq(entitlements, 'appId');
                        return response;
                    });
                });
            };

            this.getRecommendedApps = function(noCache, excludeThinApps, fallBackToServer) {
                var response = {};
                return ConfigService.getEntitlementsUrl().then(function(url) {
                    if (UtilService.hideVirtualApps()) {
                        url = url + "?displayMode=phone";
                    }
                    var request = HttpProxyService.get(LocalStorageConstants.RECOMMENDED_APPS,
                        url, {
                            headers: {'Accept': 'application/hal+json', 'method': 'GET'},
                            sync: noCache,
                            params: {category: 'Recommended', excludeThinApps: excludeThinApps}
                        }, fallBackToServer);

                    return request.then(function(entitlementsResponse) {
                        var entitlements = UtilService.getObjValue(entitlementsResponse, '_embedded[entitlements]', []);
                        response.entitlements = _.uniq(entitlements, 'appId');
                        return response;
                    });
                });
            };

            catalogService.activate = function(activationUrl, useJQ, thinappDeviceId) {
                var params = {};
                if (thinappDeviceId) {
                    params.thinappDeviceId = thinappDeviceId;
                }
                var req = RequestFactory(activationUrl, {method: 'POST', data: params});
                var defer = $q.defer();
                $http(req).then(function(appActivationResponse) {
                    if (appActivationResponse.data.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name) {
                        defer.reject(appActivationResponse);
                    } else {
                        defer.resolve(appActivationResponse.data);
                    }
                }, function(error) {
                    defer.reject(error);
                });
                return defer.promise;
            };

            catalogService.getAppsInThinappPackage = function(app) {
                var url = _.get(app, '_links.appsInPackage.href');
                if (url) {
                    var req = RequestFactory(url, {method: 'GET'});
                    return $http(req);
                }
            };

            catalogService.bookmarkAllNewEntitledApps = function(appIds) {
                var baseUrl = ConfigService.getBaseUrl() + '/catalog-portal/services/api/favorites?favorite=true';
                var params = {};
                params.appIds = appIds;

                var req = RequestFactory(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/hal+json',
                        'Content-Type': 'application/vnd.vmware.catalog.bookmarks.favorite+json'
                    },
                    data: appIds
                });
                return $http(req);
            };

            catalogService.bookmarkAllAppsInThinappPackage = function(app) {
                var getFavoriteUrl = function(favApp) {
                    var favoriteTemplatedUrl = _.get(favApp, '_links.favorites.href');
                    var templateText = 'favorite={boolValue}';
                    var replacetext = 'favorite=true';
                    if (favoriteTemplatedUrl) {
                        return favoriteTemplatedUrl.replace(templateText, replacetext);
                    } else {
                        return "";
                    }
                };
                var defer = $q.defer();
                var favoriteUrl = getFavoriteUrl(app);
                if (!favoriteUrl || favoriteUrl.trim() === '') {
                    return defer.promise;
                }
                var req = RequestFactory(favoriteUrl, {method: 'POST'});
                HttpProxyService.clearAll();
                return $http(req);
            };

            this.getDefaultLabels = function() {
                var appInfo = BootstrapService.getAppTypeInfo();
                var defaultAppLabels = [ALL_APPS_LABEL];
                if (appInfo.citrixResources.entitledCount || appInfo.daasResources.entitledCount || (appInfo.thinapps.entitledCount && !UserAgent.isMobile()) || appInfo.viewResources.entitledCount) {
                    defaultAppLabels.push(VIRTUAL_APPS_LABEL);
                }
                if (appInfo.webapps.entitledCount) {
                    defaultAppLabels.push(WEB_APPS_LABEL);
                }
                if (appInfo.nativeApps.entitledCount) {
                    defaultAppLabels.push(NATIVE_APPS_LABEL);
                }
                return defaultAppLabels;
            };

            this.getRecommendedLabel = function() {
                return RECOMMENDED_APPS_LABEL;
            };

            this.getNewlyEntitledAppsLabel = function() {
                return NEWLY_ENTITLED_APPS_LABEL;
            };

            this.getAllAppsLabel = function() {
                return ALL_APPS_LABEL;
            };

            this.getVirtualAppsLabel = function() {
              return VIRTUAL_APPS_LABEL;
            };

            this.getWebAppsLabel = function() {
              return WEB_APPS_LABEL;
            };

            this.getNativeAppsLabel = function() {
              return NATIVE_APPS_LABEL;
            };

            this.acceptEula = function(appId, eulaId) {
                var eulaAcceptUrl = ConfigService.getBaseUrl() + EULA_TEMPLATE_URL;
                eulaAcceptUrl = eulaAcceptUrl.replace('{appId}', appId);
                eulaAcceptUrl = eulaAcceptUrl.replace('{eulaContentId}', eulaId);

                var eulaRequest = RequestFactory(eulaAcceptUrl, {method: 'POST', params: {}});
                return $http(eulaRequest);
            };

            this.getInstallStatusText = function(installStatus, app) {
                if (app.type === 'NATIVE' && app.subType !== 'THINAPP') {
                    return INSTALL_STATUS[installStatus].nativeAction || INSTALL_STATUS[installStatus].value;
                } else if (this.isMdmWebApp(app.type, app.subType)) {
                    if (app.visible) {
                        return INSTALL_STATUS.ACTIVATED.action;
                    } else {
                        return INSTALL_STATUS.NOT_ACTIVATED.action;
                    }
                } else {
                    return INSTALL_STATUS[installStatus].action || INSTALL_STATUS[installStatus].value;
                }
            };

            this.getAppStatusCode = function(installStatus) {
                return _.get(INSTALL_STATUS[installStatus], "statusCode");
            };

            this.isMdmApp = function(appType, subType) {
                return appType === 'NATIVE' && subType !== 'THINAPP';
            };

            catalogService.isTunnelRequired = function(app) {
                return app.hasOwnProperty('vpnAppId') && UserAgent.isAndroid();
            };

            catalogService.isTunnelRequiredAndNotInstalled = function(app) {
                var deferred = $q.defer();
                if (catalogService.isTunnelRequired(app)) {
                    if (tunnelAppAlreadyInstalledOrNotManaged) {
                        deferred.resolve(false);
                    } else {
                        DetailsService.getAppDetailsResource(app.vpnAppId).get().then(
                            function(data) {
                                tunnelApp = data;
                                //We skip tunnel installation if it is already installed or if is configured as unmanaged app. Only tunnel
                                //app that is MDM managed can be used for achieving SSO in Android.
                                if (data.installStatus === 'ACTIVATED' || (!data.mgmtRequired && app.mgmtRequired)) {
                                    //Tunnel already installed
                                    tunnelAppAlreadyInstalledOrNotManaged = true;
                                    deferred.resolve(false);
                                } else {
                                    deferred.resolve(true);
                                }
                            }, function() {
                                /*If tunnel is required and details call failed we will still
                                 show the tunnel message and to install the app just to on safe side.
                                 If its already installed, MDM would anyways take care of not installing it again*/
                                deferred.resolve(true);
                            }
                        );
                    }
                } else { //Tunnel not required
                    deferred.resolve(false);
                }
                return deferred.promise;
            };

            catalogService.getTunnelApp = function() {
                return tunnelApp;
            };

            this.isOktaApp = function(appType) {
                return appType === 'OKTA';
            };

            this.isMdmWebApp = function(appType, subType) {
                return appType === 'WEB' && subType === 'MDMWEB';
            };

            this.isWebApp = function(appType) {
                return appType === 'WEB';
            };

            this.isVirtualApp = function(appType) {
                return appType === 'VIRTUAL';
            };

            this.isPasswordVaultApp = function(appType, subType) {
                return appType === 'ANYAPP' && subType === 'PASSWORDVAULT';
            };

            this.isAnyApp = function(appType) {
                return appType === "ANYAPP";
            };

            this.isThinApp = function(app) {
                return app.thinapp;
            };

            this.isThinAppPackage = function(app) {
                return app.thinappPackage;
            };

            this.isViewableThinappPackage = function(app) {
                return app.thinappPackage && (app.installStatus === 'ACTIVATED' || (!app.approvalRequired && app.installStatus === 'NOT_ACTIVATED'));
            };

            this.isLaunchableThinapp = function(app) {
                return this.isThinApp(app) && (app.installStatus === 'ACTIVATED' || (!app.approvalRequired && app.installStatus === 'NOT_ACTIVATED'));
            };

            this.isLaunchableNonThinApp = function(app) {
                return ((this.isOktaApp(app.type) || this.isWebApp(app.type) || this.isVirtualApp(app.type) || this.isPasswordVaultApp(app.type, app.subType)) || this.isAnyApp(app.type)) && (app.installStatus === 'ACTIVATED' || (!app.approvalRequired && app.installStatus === 'NOT_ACTIVATED'));
            };

            this.isLaunchableApp = function(app) {
                return this.isLaunchableNonThinApp(app) || (this.isLaunchableThinapp(app) && UserAgent.isThinAppSupportedBrowser());
            };

            this.isBookmarkableApp = function(app) {
                return this.isLaunchableNonThinApp(app) || this.isLaunchableThinapp(app)
                    || (UtilService.isHubNative() && UtilService.isFavoriteEnabled(app) && !this.isThinAppPackage(app));
            };

            this.isCitrixResource = function(appType, subType) {
                return appType === 'VIRTUAL' && (subType === 'XENAPP' || subType === 'XENAPPDELIVERYGROUP');
            };

            this.isHorizonResource = function(appType, subType) {
                return appType === 'VIRTUAL' && (subType === 'VIEWPOOL' || subType === 'VIEWAPP');
            };

            this.isHorizonAirResource = function(appType, subType) {
                return appType === 'VIRTUAL' && (subType === 'DESKTONEDESKTOP' || subType === 'DESKTONEAPPLICATION');
            };

            var handleEula = function(appActivationResponse, app, deferred) {
                var title = $filter('i18n')('termsOfUse');
                var message = $sce.trustAsHtml(appActivationResponse.message);
                var template = isHubApp ? 'app-v2/common/hubEulaModal.html' : 'app-v2/common/eulaModal.html';
                ModalService.getCurrentModal().open(template, {
                        title: title,
                        message: message, modal: ModalService.getCurrentModal()
                    }
                ).then(function() {
                        //User accepted EULA.
                        catalogService.acceptEula(app.appId, appActivationResponse.eulaContentId).then(function(acceptEulaResponse) {
                            app.installAction = INSTALL_STATUS.PROCESSING.value;
                            app.appNeedToActivated = false;
                            app.statusCode = catalogService.getAppStatusCode(INSTALL_STATUS.PROCESSING);
                            /* Once EULA is accepted proceed to normal install app flow. For instance if
                             status is returned as REDIRECT then redirect to app store etc. */
                            handleStatus(acceptEulaResponse.data, app);
                            if (deferred) {
                                deferred.resolve(true);
                            }
                        });
                    },
                    function() {
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                    }
                );
            };

            var handleVppAcceptInvite = function(appActivationResponse, vppApp) {
                var title = $filter('i18n')('appCenter.vppInviteTitle');
                var template = isHubApp ? 'app-v2/catalog/hubVppInviteAccept.html' : 'app-v2/catalog/vppInviteAccept.html';
                ModalService.getCurrentModal().open(template,
                    {message: appActivationResponse.message, title: title, modal: ModalService.getCurrentModal()}
                ).then(
                    function() {
                        // User accepted invite
                        vppApp.installAction = INSTALL_STATUS.REDIRECT.value;
                        vppApp.appNeedToActivated = false;
                        vppApp.statusCode = catalogService.getAppStatusCode(INSTALL_STATUS.REDIRECT);
                        ClientRuntimeService.installApp(appActivationResponse.redirectUrl);
                    },
                    function() {
                        vppApp.statusCode = catalogService.getAppStatusCode(INSTALL_STATUS.NOT_ACTIVATED);
                        updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, vppApp);
                    }
                );
            };

            function installTunnelAppAndContinue(currentApp) {
                var installUrl = _.get(tunnelApp, '_links.install.href');
                updateStatus(INSTALL_STATUS.PROCESSING.name, tunnelApp);
                catalogService.activate(installUrl)
                    .then(function(appActivationResponse) {
                        var deferred = $q.defer();
                        if (appActivationResponse.status === INSTALL_STATUS.REDIRECT.name) {
                            var redirectUrl = appActivationResponse.redirectUrl;
                            /* In case of non Android for work device we show a modal that lays step by step install of
                            VMware Tunnel app first and then the dependant app*/
                            if (redirectUrl.indexOf(playStoreDomain) >= 0) {
                                handleTunnelForNonAndroidForWorkDevice(redirectUrl, currentApp);
                            } else if (UserAgent.isAndroid() && currentApp && currentApp.subType === 'INTERNAL') {
                                redirectUrl = appActivationResponse.redirectUrl + '&appName=' + currentApp.name;
                                ClientRuntimeService.installApp(redirectUrl);
                                deferred.resolve(true);
                            }
                        } else if (appActivationResponse.status === INSTALL_STATUS.ACCEPT_EULA.name) {
                            handleEula(appActivationResponse, tunnelApp, deferred);
                        } else {
                            deferred.resolve(true);
                            notifyNativeAppAndPollForStatus(tunnelApp);
                        }
                        return deferred.promise;
                    })
                    .then(function() {
                        continueWithActivateApp(currentApp);
                    });
            }

            function handleTunnelForNonAndroidForWorkDevice(tunnelUrl, dependentApp) {
                var template = isHubApp ? "app-v2/components/shared/tunnelError.html" : "app-v2/common/tunnelInstallNonAndroidForWorkDeviceModal.html";
                ModalService.getCurrentModal().open(template,
                    {
                        modal: ModalService.getCurrentModal(),
                        catalogService: catalogService,
                        tunnelUrl: tunnelUrl,
                        dependentApp: dependentApp,
                        tunnelAppName: tunnelApp.name
                    }
                );
            }

            catalogService.handleTunnelRedirect = function(tunnelUrl) {
                ClientRuntimeService.installApp(tunnelUrl);
            };

            catalogService.installDependentApp = function(dependentApp) {
                continueWithActivateApp(dependentApp);
            };

            var showMdmAppApprovalMessage = function(app) {
                var title = $filter('i18n')('appCenter.mdmAppRequestConfirmPromptTitle');
                var message = $filter('i18n')('appCenter.mdmAppRequestConfirmPromptMessage');
                var ok = $filter('i18n')('appCenter.action.request');
                var template = isHubApp ? "app-v2/components/shared/appInstallConfirmPrompt.html" : "app-v2/common/appInstallConfirmPrompt.html";
                if (app.appStateReason === 'RequestRejected') {
                    title = $filter('i18n')('appCenter.mdmAppRequestConfirmPromptTitleDenied');
                    message = $filter('i18n')('appCenter.mdmAppRequestConfirmPromptMessageDenied');
                }
                ModalService.getCurrentModal().open(template,
                    {
                        modal: ModalService.getCurrentModal(),
                        title: title,
                        name: app.name,
                        installMessage: message,
                        ok: ok,
                        cancel: $filter('i18n')('button.cancel')
                    }
                ).then(
                    function() {
                        continueWithActivateApp(app);
                    }
                );
            };

            var showConfirmationMessage = function(app, deviceStatus) {
                var title = isHubApp ? $filter('i18n')('hub.app.install.prompt.title') : $filter('i18n')('appCenter.appInstallConfirmPromptTitle');
                var sizeLabel = $filter('i18n')('app.details.label.size');
                var sizeMessage = sizeLabel + ': ';
                if (app.size < 1000000000) {
                    sizeMessage += (app.size / 1000000).toPrecision(3) + $filter('i18n')('app.details.abbrev.megabytes');
                } else {
                    sizeMessage += (app.size / 1000000000).toPrecision(3) + $filter('i18n')('app.details.abbrev.gigabytes');
                }
                var template = isHubApp ? "app-v2/components/shared/appInstallConfirmPrompt.html" : "app-v2/common/appInstallConfirmPrompt.html";
                if (UserAgent.isIOS() && deviceStatus === "MDM_DEVICE_CONTAINER_ENROLLED" && !app.mgmtRequired && app.subType == 'INTERNAL') {
                    template = "app-v2/common/privateAppInstructionsModal.html";
                }

                var confirmationHandler = {
                    cancel: function(event) {
                        event.stopPropagation();
                        ModalService.getCurrentModal().cancel();
                    },
                    close: function(event) {
                        event.stopPropagation();
                        ModalService.getCurrentModal().close(true);
                    }
                };

                ModalService.getCurrentModal().open(template,
                    {
                        modal: ModalService.getCurrentModal(),
                        title: title,
                        name: app.name,
                        size: app.size,
                        sizeMessage: sizeMessage,
                        price: app.price,
                        installMessage: app.installMessage
                    }
                ).then(
                    function() {
                        catalogService.isTunnelRequiredAndNotInstalled(app)
                            .then(function(tunnelRequiredAndNotInstalled) {
                                if (tunnelRequiredAndNotInstalled) {
                                    installTunnelAppAndContinue(app);
                                } else {
                                    continueWithActivateApp(app);
                                }
                            });
                    }
                );
            };

            function handleStatus(appActivationResponse, app) {
                if (appActivationResponse.status === INSTALL_STATUS.REDIRECT_FOR_ENROLL.name) {
                    app.appNeedToActivated = false;
                    app.statusCode = catalogService.getAppStatusCode(appActivationResponse.status);
                    var title = $filter('i18n')('beforeInstallation');
                    var privacyUrl = $sce.trustAsHtml(appActivationResponse.privacyUrl);
                    if (!isHubApp) {
                        ModalService.getCurrentModal().open('app-v2/common/enrollModal.html', {
                                name: app.name,
                                title: title,
                                privacyUrl: privacyUrl,
                                modal: ModalService.getCurrentModal()
                            }
                        ).then(function() {
                                HttpProxyService.clearAll();
                                HttpProxyService.setStepupStatusForOktaAppLaunch(true);
                                EventsService.addEvent('INSTALL', app.appId);
                                ClientRuntimeService.enroll(appActivationResponse.redirectUrl);
                            },
                            function() {
                                updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                            }
                        );
                    } else {
                        HttpProxyService.clearAll();
                        EventsService.addHubEventWithUrl('INSTALL', app.appId);
                        notifyNativeAppAndPollForStatus(app);
                        ClientRuntimeService.enroll(appActivationResponse.redirectUrl);
                    }
                } else if (appActivationResponse.status === INSTALL_STATUS.REDIRECT.name) {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    var redirectUrl = appActivationResponse.redirectUrl;
                    if (UserAgent.isWindows() && app && app.externalStoreAppId) {
                        appActivationResponse.redirectUrl = '&appId=' + app.externalStoreAppId;
                        redirectUrl = appActivationResponse.redirectUrl;
                    } else if (UserAgent.isAndroid() && app && app.subType === 'INTERNAL') {
                        redirectUrl = appActivationResponse.redirectUrl + '&appName=' + app.name;
                    }
                    ClientRuntimeService.installApp(redirectUrl);
                } else if (appActivationResponse.status === INSTALL_STATUS.ACCEPT_EULA.name) {
                    handleEula(appActivationResponse, app);
                } else if (appActivationResponse.status === INSTALL_STATUS.VPP_ACCEPT.name) {
                    if (appActivationResponse.message) {
                        handleVppAcceptInvite(appActivationResponse, app);
                    }
                } else {
                    app.appNeedToActivated = false;
                    app.installStatus = appActivationResponse.status;
                    app.launch = appActivationResponse.launchUrl;
                    app._links.launch = {
                        href: appActivationResponse.launchUrl
                    };
                    updateStatus(app.installStatus, app);
                    if (catalogService.isMdmApp(app.type, app.subType)) {
                        //if not app approval flow notify progress
                        if (!app.approvalRequiredForMdmApp) {
                            $notify.progress('installMessage.installingOnDevice');
                        }
                        notifyNativeAppAndPollForStatus(app);
                    }
                }
            }

            function appInstallCallback(appId) {
                ClientRuntimeService.installProgress(appId);
            }

            function notifyNativeAppAndPollForStatus(app) {
                function startPolling(userTimer) {
                    catalogService.pollForChangeStatus(app, userTimer).then(function(appDetails) {
                        if (app.approvalRequiredForMdmApp) {
                            app.appStateReason = appDetails.data.appStateReason;
                        }
                        updateStatus(appDetails.data.installStatus, app);
                        if (appDetails.data.approvalRequiredForMdmApp && appDetails.data.installStatus === 'PROCESSING'
                            && !appDetails.data.appStateReason) {
                            startPolling(true);
                        }
                    });
                }

                if (!UtilService.isWindowsNativeBridge() || !UtilService.isMacNativeBridge()) {
                    startPolling(false);
                }
                if (UserAgent.isAWJadeV3() && app) {
                    var appId = '';
                    if (UserAgent.isWindows() && app.externalStoreAppId) {
                        appId = app.externalStoreAppId;
                    } else if (UserAgent.isMacJade() && app.appId) {
                        appId = app.appId;
                    }
                    appInstallCallback(appId);
                }
            }

            function continueWithActivateApp(app) {
                if (app.approvalRequiredForMdmApp) {
                    app.appStateReason = 'PendingApproval';
                }

                if (app.type === 'NATIVE' && UtilService.isNativeBridge() && app.installStatus !== 'REQUEST') {
                    NativeBridgeService.getAppStatus([app.appId]);
                }

                updateStatus(INSTALL_STATUS.PROCESSING.name, app);

                catalogService.activate(_.get(app, '_links.install.href'), true).then(function(appActivationResponse) {
                    handleStatus(appActivationResponse, app);
                }, function(error) {
                    //TODO: We need to better the error handling
                    if (error.handled) { //When system is under maintenance
                        return;
                    }
                    var title = 'appCenter.installFailedTitle';
                    var message;
                    if (error.data && error.data.code === "device.unenrolled") {
                        ModalService.getCurrentModal().open('app-v2/common/modalDialog/templates/mdmError.html').then(function() {
                            HttpProxyService.clearAllAlongWithEnrollmentStatus();
                            ConfigService.doNotRefreshCache = true;
                            ConfigService.getLogoutUrl().then(function(logoutUrl) {
                                delete hznLocalStorage.deviceDetailDelay;
                                ClientRuntimeService.logout(logoutUrl);
                            });
                        });
                    } else {
                        if (error.status === INSTALL_STATUS.FAILED_COMPLIANCE_CHECK.name) {
                            //If compliance check has failed, show the message returned form server.
                            message = error.message;
                        } else {
                            message = $filter('i18n')('installStatus.installFailedMessage', app.name);
                            title = 'appCenter.installFailedTitle';
                        }
                        ModalService.getCurrentModal().alert({
                            title: title,
                            message: message,
                            ok: 'ok'
                        }).then(function() {
                            updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                        });
                    }
                });
            }

            function updateStatus(status, currentApp) {
                currentApp.installAction = catalogService.getInstallStatusText(status, currentApp);
                currentApp.appNeedToActivated = status === 'NOT_ACTIVATED' || status === 'UPDATE';
                currentApp.installStatus = status;
                currentApp.statusCode = catalogService.getAppStatusCode(status);
                HttpProxyService.updateActivationStatus(currentApp.appId, status, currentApp.appStateReason);
                if (currentApp.type === "NATIVE" && currentApp.appStateReason) {
                    $rootScope.$broadcast('app-request-status-change', {
                        app: currentApp, status: status,
                        appStateReason: currentApp.appStateReason
                    });
                } else {
                    $rootScope.$broadcast('app-status-change', {app: currentApp, status: status});
                }
            }

            catalogService.activateAndLaunchApp = function(app) {
                if (!catalogService.isLaunchableApp(app)) {
                    return;
                }
                if (!OfflineService.isDeviceOnline()) {
                    $notify.warning('installStatus.offlineInstallMessage');
                    return;
                }
                if (app.installStatus !== 'ACTIVATED') {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    ProgressIndicatorService.showProgressIndicator();
                    catalogService.activate(_.get(app, '_links.install.href'), true).then(function(appActivationResponse) {
                        if (appActivationResponse) {
                            handleStatus(appActivationResponse, app);
                            AppLaunchService.launchApp(app);
                            HttpProxyService.updateActivationStatus(app.appId, appActivationResponse.status);
                        } else {
                            $notify.error('error.failedToLaunchApp');
                        }
                        ProgressIndicatorService.hideProgressIndicator();
                    }).catch(function(appActivationResponse) {
                        if (appActivationResponse.status === 429) {
                            $notify.warning('api.server.load.error');
                        } else {
                            $notify.error('error.failedToLaunchApp');
                        }
                        ProgressIndicatorService.hideProgressIndicator();
                    });
                } else if (!app.visible) {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    ProgressIndicatorService.showProgressIndicator();
                    BookmarksService.setAppVisible(app).then(function(data) {
                        if (data) {
                            //success
                            app.visible = true;
                            updateStatus(INSTALL_STATUS.ACTIVATED.name, app);
                            AppLaunchService.launchApp(app);
                        } else {
                            updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                            $notify.error('error.failToShowApp');
                        }
                        ProgressIndicatorService.hideProgressIndicator();
                    });
                } else {
                    AppLaunchService.launchApp(app);
                }
            };

            catalogService.activateAndViewThinappPackage = function(app) {
                if (!app.thinappPackage) {
                    return;
                }
                if (!OfflineService.isDeviceOnline()) {
                    $notify.warning('installStatus.offlineInstallMessage');
                    return;
                }
                if (app.installStatus !== 'ACTIVATED') {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    ProgressIndicatorService.showProgressIndicator();
                    catalogService.activate(_.get(app, '_links.install.href'), true).then(function(appActivationResponse) {
                        if (appActivationResponse) {
                            handleStatus(appActivationResponse, app);
                            catalogService.openThinappsInPackageDialog(app);
                            HttpProxyService.updateActivationStatus(app.appId, appActivationResponse.status);
                        } else {
                            $notify.error('error.failedToLaunchApp');
                        }
                        ProgressIndicatorService.hideProgressIndicator();
                    }).catch(function(appActivationResponse) {
                        if (appActivationResponse.status === 429) {
                            $notify.warning('api.server.load.error');
                        } else {
                            $notify.error('error.failedToLaunchApp');
                        }
                        ProgressIndicatorService.hideProgressIndicator();
                    });
                } else {
                    catalogService.openThinappsInPackageDialog(app);
                }
            };

            catalogService.openThinappsInPackageDialog = function(app) {
                var template = isHubApp ? 'app-v2/catalog/hubThinApps.html' : 'app-v2/catalog/thinapps.html';
                ModalService.getCurrentModal().open(template, {app: app});
            };

            catalogService.openThinappDevicesDialog = function(app) {
                ModalService.getCurrentModal().open('app-v2/catalog/thinappMultiDeviceActivation.html', {app: app});
            };

            catalogService.activateAndBookmarkApp = function(app, useJQ, bookmarkSuccessHandler, bookmarkFailureHandler) {
                if (!UtilService.isHub() && !catalogService.isBookmarkableApp(app)) {
                    return;
                }
                if (!OfflineService.isDeviceOnline()) {
                    $notify.warning('installStatus.offlineInstallMessage');
                    return;
                }
                if (catalogService.isMdmApp(app.type, app.subType)) {
                    BookmarksService.toggleBookmark(app, useJQ, bookmarkSuccessHandler, bookmarkFailureHandler);
                    return;
                }
                if (app.installStatus !== 'ACTIVATED') {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    ProgressIndicatorService.showBookmarkingProgressIndicator(app.appId);
                    catalogService.activate(_.get(app, '_links.install.href'), true).then(function(appActivationResponse) {
                        if (appActivationResponse) {
                            handleStatus(appActivationResponse, app);
                            BookmarksService.toggleBookmark(app, useJQ, bookmarkSuccessHandler, bookmarkFailureHandler);
                            HttpProxyService.updateActivationStatus(app.appId, appActivationResponse.status);
                        } else {
                            $notify.error('error.failedToBookmarkApp');
                        }
                        ProgressIndicatorService.hideBookmarkingProgressIndicator(app.appId);
                    }).catch(function() {
                        $notify.error('error.failedToBookmarkApp');
                        ProgressIndicatorService.hideBookmarkingProgressIndicator(app.appId);
                    });
                } else if (!app.visible) {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    ProgressIndicatorService.showBookmarkingProgressIndicator(app.appId);
                    BookmarksService.setAppVisible(app).then(function(data) {
                        if (data) {
                            //success
                            app.visible = true;
                            updateStatus(INSTALL_STATUS.ACTIVATED.name, app);
                            BookmarksService.toggleBookmark(app, useJQ, bookmarkSuccessHandler, bookmarkFailureHandler);
                        } else {
                            updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                            $notify.error('error.failToShowApp');
                        }
                        ProgressIndicatorService.hideBookmarkingProgressIndicator(app.appId);
                    });
                } else {
                    BookmarksService.toggleBookmark(app, useJQ, bookmarkSuccessHandler, bookmarkFailureHandler);
                }
            };

            function continueToShowConfirmMessage(app, deviceStatus) {
                var isMdmApp = catalogService.isMdmApp(app.type, app.subType);
                if (app.installStatus === 'NOT_ACTIVATED' || app.installStatus === 'ACTIVATION_FAILED' || isMdmApp) {
                    if (app.approvalRequiredForMdmApp) {
                        showMdmAppApprovalMessage(app);
                    } else if (app.installMessage && (!app.mgmtRequired || deviceStatus === "MDM_DEVICE_FULLY_ENROLLED")) {
                        showConfirmationMessage(app, deviceStatus);
                    } else {
                        catalogService.isTunnelRequiredAndNotInstalled(app)
                            .then(function(tunnelRequiredAndNotInstalled) {
                                if (tunnelRequiredAndNotInstalled) {
                                    installTunnelAppAndContinue(app);
                                } else {
                                    continueWithActivateApp(app);
                                }
                            });
                    }
                } else if (!app.visible) {
                    updateStatus(INSTALL_STATUS.PROCESSING.name, app);
                    BookmarksService.setAppVisible(app).then(function(data) {
                        if (data) {
                            //success
                            app.visible = true;
                            updateStatus(INSTALL_STATUS.ACTIVATED.name, app);
                        } else {
                            updateStatus(INSTALL_STATUS.NOT_ACTIVATED.name, app);
                            $notify.error('error.failToShowApp');
                        }
                    });
                }
            }

            catalogService.activateApp = function(app, deviceStatus) {
                if (app.subType === 'THINAPP' && app.perDeviceActivationRequired) {
                    catalogService.openThinappDevicesDialog(app);
                    return;
                }

                if (OfflineService.isDeviceOnline()) {
                    if (app.eventId) {
                        //In case of success and has a event id delete the event
                        EventsService.deleteEvent(app.eventId);
                    }

                    if (deviceStatus === "MDM_DEVICE_FULLY_ENROLLED" || !app.mgmtRequired) {
                        catalogService.isTunnelRequiredAndNotInstalled(app)
                            .then(function(tunnelRequiredAndNotInstalled) {
                                if (tunnelRequiredAndNotInstalled) {
                                    var template = isHubApp ? "app-v2/components/shared/tunnelModal.html" : "app-v2/common/tunnelModal.html";
                                    ModalService.getCurrentModal().open(template,
                                        {modal: ModalService.getCurrentModal(), name: app.name}
                                    ).then(function() {
                                        continueToShowConfirmMessage(app, deviceStatus);
                                    });
                                } else {
                                    continueToShowConfirmMessage(app, deviceStatus);
                                }
                            });
                    } else {
                        continueToShowConfirmMessage(app, deviceStatus);
                    }
                } else {
                    $notify.warning('installStatus.offlineInstallMessage');
                }
            };

            catalogService.populateTypeNameAndPlatformName = function(catalogApp) {
                var platform = 'none';
                catalogApp.typeName = typeNames[catalogApp.type];
                if (catalogApp.subType === 'THINAPP') {
                    catalogApp.typeName = typeNames.THINAPP;
                } else if (catalogApp.type === 'ANYAPP') {
                    catalogApp.typeName = typeNames.WEB;
                } else if (catalogApp.subType === 'PROFILE') {
                    catalogApp.typeName = typeNames.PROFILE;
                } else if (catalogApp.type === 'NATIVE' && catalogApp.subType !== 'THINAPP') {
                    var lowerCaseDeviceType = workspaceOne.deviceType.toLowerCase();
                    if (lowerCaseDeviceType == 'apple') {
                        platform = 'IOS';
                    } else if (lowerCaseDeviceType == 'android') {
                        platform = 'ANDROID';
                    } else if (lowerCaseDeviceType == 'winrt' || lowerCaseDeviceType == 'windowsphone8' ||
                        lowerCaseDeviceType == 'windowsmobile' || lowerCaseDeviceType == 'windowspc' || lowerCaseDeviceType == 'windowsphone') {
                        platform = 'WINDOWS';
                    } else if (lowerCaseDeviceType == 'appleosx') {
                        platform = 'MAC';
                    }
                    if (platform) {
                        catalogApp.typeName = typeNames.NATIVE_PLATFORM;
                        catalogApp.platformName = platformNames[platform];
                    }
                }
            };

            catalogService.populateDisplayValForAppType = function(app) {
                var mdmApp = catalogService.isMdmApp(app.type, app.subType);
                var webApp = catalogService.isWebApp(app.type);
                var anyApp = catalogService.isAnyApp(app.type);
                var citrixResource = catalogService.isCitrixResource(app.type, app.subType);
                var horizonResource = catalogService.isHorizonResource(app.type, app.subType);
                var VpnTunnelRequired = catalogService.isTunnelRequired(app);
                var horizonAirResource = catalogService.isHorizonAirResource(app.type, app.subType);
                var thinApp = app.thinapp;
                var thinAppPackage = app.thinappPackage;
                app.isCitrixResource = citrixResource;
                app.isHorizonResource = horizonResource;
                app.isTunnelRequired = VpnTunnelRequired;
                app.isHorizonAirResource = horizonAirResource;
                app.appTypeDisplayVal = '';
                if (webApp || anyApp) {
                    app.appTypeDisplayVal = $filter('i18n')(app.typeName);
                } else if (citrixResource) {
                    app.appTypeDisplayVal = $filter('i18n')('appCenter.type.citrixResource');
                } else if (horizonResource) {
                    app.appTypeDisplayVal = $filter('i18n')('appCenter.type.HorizonResource');
                } else if (horizonAirResource) {
                    app.appTypeDisplayVal = $filter('i18n')('appCenter.type.HorizonAirResource');
                } else if (thinApp) {
                    app.appTypeDisplayVal = $filter('i18n')('appCenter.type.thinapp');
                } else if (thinAppPackage) {
                    app.appTypeDisplayVal = $filter('i18n')('appCenter.type.appPackage');
                } else if (mdmApp && app.size) {
                    if (app.size < 1000000000) {
                        app.appTypeDisplayVal = $filter('i18n')('app.mobileApp.versionAndMBSize', (app.size / 1000000).toPrecision(3), app.version);
                    } else {
                        app.appTypeDisplayVal = $filter('i18n')('app.mobileApp.versionAndGBSize', (app.size / 1000000000).toPrecision(3), app.version);
                    }
                }
            };

            catalogService.getAppSize = function(size) {
                if (size < 1000000000) {
                    return $filter('i18n')('app.details.appSize', (size / 1000000).toPrecision(3));
                } else {
                    return $filter('i18n')('app.details.appSize', (size / 1000000000).toPrecision(3));
                }
            };

            this.pollForChangeStatus = function(catalogApp, userTimer) {
                return PollingService.start(catalogApp.appId, userTimer);
            };

            catalogService.bulkInstall = function(acceptedIds, rejectedIds) {
                var urlPromise = ConfigService.getAutomatedAppInstallUrl();
                return urlPromise.then(function(bulkInstallUrl) {
                    bulkInstallUrl = bulkInstallUrl.replace('{postDirectEnrollmentActionBoolean}', 'true');
                    var params = {};
                    if (acceptedIds) {
                        params.appIds = acceptedIds;
                    }

                    var req = RequestFactory(bulkInstallUrl, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/vnd.vmware.catalog.apps-install-confirmation-v1+json',
                            'Content-Type': 'application/vnd.vmware.catalog.apps-install-v1+json'
                        },
                        data: params
                    });
                    var defer = $q.defer();
                    $http(req).then(function(bulkInstallResponse) {
                        defer.resolve(bulkInstallResponse.data);
                    }, function(error) {
                        defer.reject(error);
                    });
                    return defer.promise;
                });
            };

            catalogService.getDefaultLabelsFromEntitlements = function(entitlements) {
                var defaultLabels = [];
                var isVirtualAdded = false,
                    isWebAdded = false,
                    isNativeAdded = false;
                defaultLabels.push(catalogService.getAllAppsLabel());
                _.each(entitlements, function(entitlement) {
                    if (!isVirtualAdded && entitlement.type === "VIRTUAL") {
                        defaultLabels.push(catalogService.getVirtualAppsLabel());
                        isVirtualAdded = true;
                    }
                    if (!isWebAdded && entitlement.type === "WEB") {
                        defaultLabels.push(catalogService.getWebAppsLabel());
                        isWebAdded = true;
                    }
                    if (!isNativeAdded && entitlement.type === "NATIVE" && entitlement.subType !== "THINAPP") {
                        defaultLabels.push(catalogService.getNativeAppsLabel());
                        isNativeAdded = true;
                    }
                });

                return defaultLabels;
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
