(function(module) {
    'use strict';

    module.controller('AppCenterController', [
        '$scope',
        '$rootScope',
        '$timeout',
        'Localization',
        'ConfigService',
        'SettingsService',
        'HorizonService',
        'UserAgent',
        'UtilService',
        'BrandingService',
        'EventsService',
        '$location',
        '$notify',
        'PasswordPolicyService',
        'hznLocalStorage',
        'PasswordVaultService',
        'AppLaunchService',
        'ClientRuntimeService',
        'ModalService',
        '$filter',
        'BootstrapService',
        'HttpProxyService',
        'LocalStorageService',
        'Events',
        '$q',
        '$state',
        'ScrollToTopService',
        'SearchService',
        'POLLING_INTERVALS',
        'AppDownloadService',
        'LocationReloadService',
        'NotificationService',
        'SignOutService',
        'TenantCustomizationService',
        'CatalogService',
        'NativeBridgeService',
        function($scope,
                  $rootScope,
                  $timeout,
                  Localization,
                  ConfigService,
                  SettingsService,
                  HorizonService,
                  UserAgent,
                  UtilService,
                  BrandingService,
                  EventsService,
                  $location,
                  $notify,
                  PasswordPolicyService,
                  hznLocalStorage,
                  PasswordVaultService,
                  AppLaunchService,
                  ClientRuntimeService,
                  ModalService,
                  $filter,
                  BootstrapService,
                  HttpProxyService,
                  LocalStorageService,
                  Events,
                  $q,
                  $state,
                  ScrollToTopService,
                  SearchService,
                  POLLING_INTERVALS,
                  AppDownloadService,
                  LocationReloadService,
                  NotificationService,
                  SignOutService,
                  TenantCustomizationService,
                  CatalogService,
                  NativeBridgeService) {
            NativeBridgeService.registerBridge();

            //Creating a promise for index route to wait on
            var initAppCallsDefer = $q.defer();
            var initAppCallsPromise = initAppCallsDefer.promise;
            var deviceRegistrationDetailsTimer;
            BootstrapService.setInitAppCallsPromise(initAppCallsPromise);
            var vm = this,
                title = Localization.getLocalizedString('appCenter');
            vm.pageTitle = title;
            vm.appsLoaded = false;
            vm.user = {};
            vm.searchFieldToggle = {};
            vm.isBrowser = UserAgent.isBrowser();
            vm.isAWJade = UserAgent.isAWJade();
            vm.isAWJadeV2 = UserAgent.isAWJadeV2();
            vm.isAWJadeMobile = UserAgent.isAWJadeMobile();
            vm.isMobileBrowser = UserAgent.isMobileBrowser();
            vm.isAWJadeDesktop = UserAgent.isAWJadeDesktop();
            vm.isAWJadeDocked = UserAgent.isAWJadeDocked();
            vm.isAwJade30orAbove = UserAgent.isAWJadeV3();
            vm.isWindowsJade = UserAgent.isWindowsJade();
            vm.isWindowsTabletJade = UserAgent.isWindowsTabletJade();
            vm.isMacJade = UserAgent.isMacJade();
            vm.isMobileNonWindowBrowser = UserAgent.isMobileNonWindowBrowser();
            vm.isWindowsBrowser = UserAgent.isWindowsBrowser();
            vm.showMacAppDownloadBanner = false;
            vm.isMAC_PROMO_BANNERenabled = UtilService.getObjValue(window, 'workspaceOne.featureFlags.MAC_PROMO_BANNER', false);
            vm.isRenderNotificationBellForMobile = vm.isAWJadeMobile || (UserAgent.isPhone() && UserAgent.isBrowser());
            vm.isMacBrowser = UserAgent.isMacBrowser();
            vm.directEnrollmentEnabled = false;
            vm.isDesktopAppRefreshing = false;
            vm.pollForEnrollmentStatus = false;
            //used to show overlay on the header when app re-order is in progress
            vm.sortingDisabled = true;
            vm.brandingAvailable = false;
            vm.showPeopleTab = false;
            vm.userAnnouncementMsg = '';
            vm.notificationsLoaded = false;
            vm.isNotificationDropdownActive = false;
            vm.previousUrl = '';
            angular.extend($rootScope, workspaceOne);
            ModalService.setCurrentModal($scope.$modal);
            //If the page load is because of clicking on refresh button
            if (window.performance && window.performance.navigation.type === 1) {
                HttpProxyService.clearAll();
                HttpProxyService.clearPeopleSearch();
                ConfigService.refreshCache(true);
            }

            //mac app is only supported in and above 10.11.0
            if (UserAgent.isMacAppDownloadSupported('10.11.0') && vm.isMAC_PROMO_BANNERenabled && !hznLocalStorage.hidePromoBanner) {
                AppDownloadService.checkIfMacAppExists().then(function(data) {
                    if (data && data.downloadUrl) {
                        vm.showMacAppDownloadBanner = true;
                    }
                });
            }

            SettingsService.getUserInfo().then(function(user) {
                var properties = ['userName', 'firstName', 'lastName', 'emailAddress', 'numOfManagedDevices', 'phoneNumber', 'adminUser', 'internalUserType', 'changePasswordAllowed', 'localUser', 'imageURL'];
                _.extend(vm.user, _.pick(user, properties));
                SettingsService.setCurrentUser(vm.user);
                vm.userAvailable = true;
                if (vm.user.adminUser) {
                    SettingsService.getUserAnnouncement().then(function(userAnnouncement) {
                        vm.userAnnouncementMsg = userAnnouncement.message;
                    }, function() {
                        vm.userAnnouncementMsg = '';
                    });
                }
            }, function(response) {
                vm.userAvailable = false;
                if (!vm.isAWJade && _.get(response, "data.code", undefined) === "admin.terms.not.accepted") {
                    ConfigService.getAdminConsoleTermsUrl().then(function(url) {
                        window.location = url;
                    });
                }
            });

            BrandingService.getBranding().then(function(branding) {
                branding = branding || {};
                var defaultFavIconUrl = "";
                var catalogItemBackground = {};
                var catalogItemTransparency = 1;
                var nameAndImages = branding.brandNameAndImages || {},
                    companyName = nameAndImages.companyName,
                    brandName = nameAndImages.brandName || title,
                    favIconUrl = nameAndImages.favIconUrl || defaultFavIconUrl;

                vm.branding = branding;
                vm.pageTitle = brandName;
                vm.favIconUrl = favIconUrl;

                if (companyName) {
                    vm.pageTitle = companyName + ' — ' + vm.pageTitle;
                }

                branding.pageTitle = vm.pageTitle;
                branding.favIconUrl = vm.favIconUrl;

                if (_.get(branding, 'portalBranding.appIconBackgroundColor')) {
                    var appIconBgColor = branding.portalBranding.appIconBackgroundColor,
                        hexRegex6 = /^#[0-9a-fA-F]{6}$/,
                        hexRegex3 = /^#[0-9a-fA-F]{3}$/;

                    if (hexRegex3.test(appIconBgColor) && !hexRegex6.test(appIconBgColor)) {
                        appIconBgColor = UtilService.threeHexToSixHex(appIconBgColor);
                    }

                    catalogItemBackground = UtilService.hexToRgb(appIconBgColor);

                    if (_.get(branding, 'portalBranding.appIconBackgroundTransparency')) {
                        catalogItemTransparency = branding.portalBranding.appIconBackgroundTransparency / 100;
                    }

                    branding.catalogItemBackground = 'rgba(' + catalogItemBackground.r + ',' + catalogItemBackground.g + ',' + catalogItemBackground.b + ',' + catalogItemTransparency + ')';
                }

                SettingsService.setCurrentBranding(branding);

                // We removed branding directive and the branding.html, directly inject the styles to the head to be faster
                // Needs this otherwise will not render the header when there is branding is set to default

                if (branding.brandNameAndImages) {
                    vm.brandingLogo = branding.brandNameAndImages.logoUrl;
                } else {
                    //use the default from the asset folder
                    vm.brandingLogo = "app-v2/graphics/logo-ws1.png";
                }

                if (branding.portalBranding) {
                    vm.brandingStyles = branding.portalBranding;
                    vm.brandingStyles.image = '';
                    if (branding.portalBranding.backgroundHighlightUrl) {
                        vm.brandingStyles.image = 'url(' + vm.brandingStyles.backgroundHighlightUrl + ')';
                    }
                    if (branding.portalBranding.backgroundPatternUrl) {
                        if (vm.brandingStyles.image) {
                            vm.brandingStyles.image += ', ';
                        }
                        vm.brandingStyles.image += 'url(' + vm.brandingStyles.backgroundPatternUrl + ')';
                    }
                    if (branding.portalBranding.backgroundImageUrl) {
                        if (vm.brandingStyles.image) {
                            vm.brandingStyles.image += ', ';
                        }
                        vm.brandingStyles.image += 'url(' + vm.brandingStyles.backgroundImageUrl + ')';
                    }

                    vm.catalogItemBackground = branding.catalogItemBackground;
                    if (branding.portalBranding.letteringEffect === 'letterpress') {
                        vm.textEffect = "1px 1px rgba(255, 255, 255, 0.5)";
                    }
                    if (branding.portalBranding.letteringEffect === 'emboss') {
                        vm.textEffect = "1px 1px rgba(0, 0, 0, 0.5)";
                    }
                }
                vm.brandingAvailable = true;
            }, function() {
                // Handle getBranding failed, show the default styling
                vm.brandingAvailable = true;
            });

            vm.getDeviceRegistrationDetail = function() {
                var deferred = $q.defer();
                if (UserAgent.isNativeAppVersionIsEqualOrAbove('2.1') && UtilService.getQueryParams().deviceUdid) {
                    ConfigService.getDeviceRegistrationDetail().then(function(deviceDetails) {
                        //Mdm URL is null if MDM is not configured
                        if (deviceDetails) {
                            deviceDetails.get().then(function(deviceStatus) {
                                var prevDeviceMgmtStatus = HttpProxyService.getDeviceMgmtStatus();
                                vm.unEnrollEnable = false;
                                vm.deviceContainerOrMdmEnrolled = false;
                                if (deviceStatus.deviceMgmtDetails) {
                                    var isMdmEnrolled = deviceStatus.deviceMgmtDetails.deviceMdmEnrolled
                                        && UserAgent.isNativeAppVersionIsEqualOrAbove('2.1');
                                    var isContainerEnrolled = deviceStatus.deviceMgmtDetails.deviceContainerOrMdmEnrolled
                                        && UserAgent.isNativeAppVersionIsEqualOrAbove('2.2');
                                    NativeBridgeService.setContainerMode(isMdmEnrolled);
                                    vm.deviceContainerOrMdmEnrolled = deviceStatus.deviceMgmtDetails.deviceContainerOrMdmEnrolled;
                                    vm.unEnrollEnable = isMdmEnrolled || isContainerEnrolled;
                                    var deviceEnrollStatusType = deviceStatus.deviceMgmtDetails.deviceEnrollStatusType;
                                    if (prevDeviceMgmtStatus !== deviceStatus.deviceMgmtDetails.deviceMgmtType) {
                                        HttpProxyService.setDeviceMgmtStatus(deviceStatus.deviceMgmtDetails.deviceMgmtType);
                                        HttpProxyService.clearAll();
                                    }
                                    deferred.resolve(deviceEnrollStatusType);
                                }
                            }, function() {
                                vm.unEnrollEnable = false;
                                deferred.reject(vm.unEnrollEnable);
                            });
                        } else {
                            vm.unEnrollEnable = false;
                            deferred.reject(vm.unEnrollEnable);
                        }
                    });
                } else {
                    vm.unEnrollEnable = false;
                    deferred.reject(vm.unEnrollEnable);
                }
                return deferred.promise;
            };

            vm.checkMdmStatus = function(status) {
                if (UserAgent.isAWJadeV2()) {
                    //Device is not enrolled
                    var isMdmError = status === 'UNENROLLED' || status === 'BLACKLISTED' || status === 'ENTWIPEPEND' || status === 'MDM_DEVICE_BLACKLISTED' || status === 'UNKNOWN';

                    if (isMdmError) {
                        ModalService.getCurrentModal().open('app-v2/common/modalDialog/templates/mdmError.html').then(function() {
                            vm.continueSignout();
                        });
                    }
                }
            };

            //poll until the status is enrolled or wait for 3 min and show sign out and retry option
            vm.getDeviceRegistrationDetailPoll = function() {
                function pollDeviceRegistration() {
                    hznLocalStorage.deviceDetailDelay = hznLocalStorage.deviceDetailDelay ? hznLocalStorage.deviceDetailDelay : new Date().getTime() + POLLING_INTERVALS.DEVICE_REGISTRATION_CHECK_INTERVAL; //3 min
                    var delay = hznLocalStorage.deviceDetailDelay - new Date().getTime();
                    if (delay > 0) {
                        if (!deviceRegistrationDetailsTimer) {
                            $timeout.cancel(deviceRegistrationDetailsTimer);
                        }
                        deviceRegistrationDetailsTimer = $timeout(function() {
                            getData();
                        }, 5000);
                    } else {
                        deferred.reject();
                    }
                }
                var deferred = $q.defer();
                var getData = function() {
                    vm.getDeviceRegistrationDetail().then(function(status) {
                        var prevEnrollmentStatus = HttpProxyService.getDeviceEnrollmentStatus();
                        if (vm.deviceContainerOrMdmEnrolled) {
                            // If current status is enrolled and
                            // If prev status is null or if prev status is not equal to current status
                            // Then resolve the promise and call the bootstarp api with refresh cache.
                            HttpProxyService.setDeviceEnrollmentStatus(status);
                            if (status === 'ENROLLED') {
                                if (prevEnrollmentStatus === status) {
                                    deferred.resolve(false);
                                } else {
                                    // status has changed, clear cache
                                    deferred.resolve(true);
                                }
                                //if status is ENROLLINPROGRESS _and_ previous_status was not that
                                //then we should poll for a while to see if it switches to ENROLLED. So go into else if
                                // if status is ENROLLINPROGRESS _and previous_status was also ENROLLINPROGRESS
                                //then we should assume that the user is stuck there and just take them to the catalog
                                // Hence resolve the promise with clearcache false.
                            } else if (status === 'ENROLLINPROGRESS' && prevEnrollmentStatus === status) {
                                //https://jira-euc.eng.vmware.com/jira/browse/HW-76958
                                deferred.resolve(false);
                            } else {
                                pollDeviceRegistration();
                            }
                        } else {
                            pollDeviceRegistration();
                        }
                    }, function() {
                        deferred.resolve();
                    });
                };

                getData();
                return deferred.promise;
            };

            vm.continueSignout = function($event) {
                SignOutService.continueSignOut($event);
            };

            vm.retryLoad = function() {
                delete hznLocalStorage.deviceDetailDelay;
                ModalService.getCurrentModal().open('app-v2/common/deviceNotEnrolledWarning.html').then(function() {
                    LocationReloadService.reload();
                }, function() {
                    vm.continueSignout();
                });
            };

            vm.bootstrap = function(clearEntitlementsCache) {
                $q.all([BootstrapService.getBootstrapInfo(null, clearEntitlementsCache), EventsService.getEvents(), ConfigService.getTenantCustomizations(false)])
                    .then(function(promisesData) {
                        var appData = promisesData[0];
                        var events = promisesData[1];
                        var customizationSettings = promisesData[2] || {};
                        var installEvents = EventsService.filterEventsByType(events, Events.INSTALL);
                        var hasInstallEvents = installEvents.length > 0;
                        var launchableApps = _.get(appData, 'appInfo', {});
                        var bookmarkedAppsCount = appData.appInfo.bookmarkedApps.entitledCount;
                        BootstrapService.setAppTypeInfo(launchableApps);
                        BootstrapService.setBookmarkedAppsCount(bookmarkedAppsCount);
                        vm.mdmEnrolledEvents = EventsService.filterEventsByType(events, Events.MDM_ENROLLED);
                        vm.isWebClip = false;
                        vm.lastActivePage = "last_active_page_v2";
                        vm.nativenavPeople = "nativenav_people";
                        TenantCustomizationService.setCustomizationSettings(customizationSettings);
                        vm.hideCatalogTab = customizationSettings.hideCatalogTab;
                        vm.hideBookmarksTab = customizationSettings.hideBookmarksTab;
                        vm.showPeopleTab = !customizationSettings.hidePeopleTab;
                        vm.inAppNotificationEnabled = customizationSettings.notificationsEnabled;
                        vm.mdmOnlyWS1 = appData.mdmOnlyWS1;
                        vm.isTermsOfUseEnabled = customizationSettings.termsOfUseApplicable && !vm.mdmOnlyWS1;
                        vm.passwordChangeEnabled = vm.user.changePasswordAllowed && !vm.mdmOnlyWS1;
                        vm.isAWJadeWithNativenav = customizationSettings.nativenavEnabled && UserAgent.isAWJadeWithNativenav();
                        vm.isAWJadeWindowsWithNativenav = customizationSettings.nativenavEnabled && UserAgent.isAWJadeWindowsNativenav();
                        checkTermsOfUse(vm.user.userName);

                        vm.showNotification = function() {
                            $state.go('notifications');
                        };

                        //If events api returns MDM_ENROLLED events
                        if (UserAgent.isAWJade() && vm.mdmEnrolledEvents.length) {
                            vm.directEnrollmentEnabled = true;
                            HttpProxyService.setStepupStatusForOktaAppLaunch(true);
                            BootstrapService.setDirectEnrollmentStatus(vm.directEnrollmentEnabled);
                        }

                        BootstrapService.setInstallEventsStatus(hasInstallEvents);
                        //Resolving the promise as all the required calls required to initialize the application are resolved and processed.
                        initAppCallsDefer.resolve();
                        workspaceOne.hasLaunchableApps = false;
                        //same logic ported from UIController.java
                        for (var obj in launchableApps) {
                            if (launchableApps[obj].entitledCount) {
                                workspaceOne.hasLaunchableApps = true;
                                break;
                            }
                        }
                        vm.hasLaunchableApps = UtilService.getObjValue(window, 'workspaceOne.hasLaunchableApps', false);
                        vm.showBookmarksTab = (customizationSettings.hideCatalogTab && vm.showPeopleTab) || (!customizationSettings.hideBookmarksTab && vm.hasLaunchableApps);
                        vm.showCatalogTab = !vm.hideCatalogTab;
                        vm.showTabsSection = vm.showPeopleTab || (!vm.showPeopleTab && vm.hasLaunchableApps && vm.showBookmarksTab && vm.showCatalogTab);
                        $timeout(function() {
                            document.getElementById("PVConduit").ping = PasswordVaultService.pingExtension;
                        }, 0);

                        //show when everything is ready
                        vm.appsLoaded = true;

                        vm.isWebClip = UserAgent.isWebClip();

                        vm.dismissUserAnnouncement = function($event) {
                            SettingsService.dismissUserAnnouncement().then(function() {
                                vm.userAnnouncementMsg = '';
                            });
                        };

                        vm.unEnrollConfirm = function($event) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            ModalService.getCurrentModal().open('app-v2/common/unenrollWarning.html', {
                                modal: ModalService.getCurrentModal()
                            });
                        };

                        vm.desktopRefresh = function(activeTab) {
                            if (!vm.isDesktopAppRefreshing) {
                                vm.isDesktopAppRefreshing = true;
                                ConfigService.refreshCache().then(function() {
                                    vm.isDesktopAppRefreshing = false;
                                }, function() {
                                    vm.isDesktopAppRefreshing = false;
                                });

                                if (activeTab === 'bookmarks') {
                                    $rootScope.$broadcast('Desktop-Bookmarks-Refresh');
                                }
                                if (activeTab === 'catalog') {
                                    $rootScope.$broadcast('Desktop-Catalog-Refresh');
                                }
                                if (activeTab === 'people') {
                                    $rootScope.$broadcast('Desktop-People-Refresh');
                                }
                                if (activeTab === 'peopleDetails') {
                                    $rootScope.$broadcast('Desktop-People-Details-Refresh');
                                }
                            }
                        };

                        vm.unEnrollCallback = function() {
                            HttpProxyService.clearAllAlongWithEnrollmentStatus();
                            delete hznLocalStorage.deviceDetailDelay;
                            if (vm.unEnrollEnable) {
                                ClientRuntimeService.unEnroll();
                            } else {
                                ClientRuntimeService.unEnroll(true);
                            }
                        };

                        vm.openProfile = function($event) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            $scope.$broadcast('open-modal-dialog', {
                                dialogtemplate: 'app-v2/common/profileDialog.html',
                                dialogparams: {}
                            });
                        };

                        vm.changePassword = function($event) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            var policies = PasswordPolicyService.getPasswordPolicy() || null;

                            if (!policies && vm.user.localUser) {
                                vm.isLoading = true;
                                ConfigService.getPasswordPolicy().then(function(passwordPolicy) {
                                    passwordPolicy.get().then(function(policies) {
                                        PasswordPolicyService.setPasswordPolicy(policies);
                                        vm.isLoading = false;
                                        location.hash = '#/changePassword';
                                    }, function() {
                                        vm.isLoading = false;
                                        location.hash = '#/changePassword';
                                    });
                                });
                            } else {
                                location.hash = '#/changePassword';
                            }
                        };

                        vm.signout = function($event) {
                            if (UserAgent.isNativeAppVersionIsEqualOrAbove('2.1')) {
                                ModalService.getCurrentModal().open('app-v2/common/modalDialog/templates/confirm.html', {
                                    title: $filter('i18n')('app.logout.title'),
                                    message: $filter('i18n')('app.logout.confirm.msg'),
                                    ok: $filter('i18n')('userInfo.signout'),
                                    cancel: $filter('i18n')('button.cancel')
                                }).then(function() {
                                    vm.continueSignout($event);
                                });
                            } else {
                                vm.continueSignout($event);
                            }
                        };

                        vm.signoutNativenav = function($event) {
                            ModalService.getCurrentModal().open('app-v2/settings/signoutnativenav-confirm.html', {
                            }).then(function() {
                                vm.continueSignout($event);
                            });
                        };

                        /*
                         * ios UIWebview, has problem wih href="#..." syntax
                         */
                        vm.catalog = function() {
                            location.hash = '#/catalog';
                        };

                        vm.bookmark = function() {
                            location.hash = '#/bookmarks';
                        };

                        vm.peopleSearch = function() {
                            location.hash = '#/people';
                        };
                        vm.smartSearch = function () {
                            location.hash = '#/smartSearch';
                        };

                        vm.preferences = function($event) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            location.hash = '#/preferences';
                        };

                        vm.adminConsole = function($event) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            ConfigService.getAdminConsoleUrl().then(function(url) {
                                window.open(url);
                            });
                        };

                        /*
                        If nativenav is enabled and the user leaves the app on the notifications page on either the
                        people or apps tab, then when the user comes back to the app, the back button on the notfications
                        page should take them back to where they came from. On the apps tab the previous state is maintained
                        in the last_active local storage variable but on people tab that variable is not set if nativenav is enabled
                        hence we use another localstorage variable peopleNativeNav for this purpose.
                        */

                        vm.backAction = function(activeTab) {
                            var lastActive = hznLocalStorage[vm.lastActivePage];
                            var peopleNativeNav = hznLocalStorage[vm.nativenavPeople];
                            if (vm.isAWJadeMobile && activeTab == 'notifications') {
                                if (peopleNativeNav === 'true') {
                                    $state.go('people');
                                    return;
                                } else {
                                    $state.go(lastActive);
                                    return;
                                }
                            }
                            return window.history.back();
                        };

                        vm.openDevices = function($event, showDialog) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            $scope.$broadcast('open-modal-dialog', {
                                dialogtemplate: 'app-v2/common/devicesDialog.html',
                                dialogparams: {}
                            });
                        };

                        vm.virtualClientAppInstalled = function(app) {
                            AppLaunchService.appInstalled(app);
                        };

                        $scope.$on('$locationChangeStart', function(ev, newUrl, oldUrl) {
                            //close the filter if its open
                            //prevent navigation to previous screen
                            if (vm.categoryFilterOn) {
                                ev.preventDefault();
                                vm.categoryFilterOn = false;
                            }
                        });

                        $scope.$on('$locationChangeSuccess', function(ev, newUrl, oldUrl) {
                            // store previous Url so page controllers can determine their "referrer"
                            vm.previousUrl = (newUrl !== oldUrl) && oldUrl;
                        });

                        $scope.$on('deviceOnlineStatusChanged', function(event, deviceOnline) {
                            if (!UserAgent.isAWJade()) {
                                if (deviceOnline) {
                                    $notify.close('deviceStatus.networkLost');
                                } else {
                                    $notify.error('deviceStatus.networkLost');
                                }
                            }
                        });

                        vm.$state = $state;
                        vm.searchFieldOn = false;
                        vm.showRecentSearch = false;

                        vm.toggleSearchField = function() {
                            vm.searchFieldOn = !vm.searchFieldOn;
                            if (!vm.searchFieldOn) {
                                vm.searchFieldToggle.clearSearch();
                                SearchService.clearSearchQueryAndResults();
                            }

                            if ($state.current.activeTab === 'peopleDetails') {
                                vm.showRecentSearch = !vm.showRecentSearch;
                            }
                        };

                        //searchFieldOn is true by default on people tab
                        //showRecentSearch is true when people input is focused
                        vm.cancelPeopleSearchField = function() {
                            vm.showRecentSearch = false;
                            vm.searchFieldToggle.clearSearch();
                            SearchService.clearSearchQueryAndResults();
                        };

                        vm.categoryFilterOn = false;

                        vm.closeMobileFilter = function() {
                            vm.categoryFilterOn = false;
                        };

                        vm.updateTopnavActions = function() {
                            var currentPath = $state.current.activeTab;

                            if (currentPath.search('catalog') !== -1) {
                                vm.categoryFilterOn = !vm.categoryFilterOn;
                            }
                        };

                        vm.openPrivacyPage = function($event, privacyUrl) {
                            if ($event) {
                                $event.preventDefault();
                            }
                            ClientRuntimeService.openUrl(privacyUrl);
                        };

                        vm.showAppInstall = function() {
                            ClientRuntimeService.showAppInstall();
                        };

                        vm.gotoAppsFromFooter = function() {
                            var lastActive = hznLocalStorage[vm.lastActivePage];
                            vm.searchFieldOn = false;
                            var customizationSettings = TenantCustomizationService.getCustomizationSettings();
                            if (customizationSettings.hideCatalogTab) {
                                $location.path('/bookmarks');
                            } else if (workspaceOne && workspaceOne.hasLaunchableApps === false || lastActive === 'catalog' || customizationSettings.hideBookmarksTab) {
                                $location.path('/catalog');
                            } else {
                                $location.path('/bookmarks');
                            }
                        };

                        vm.gotoPeopleFromFooter = function() {
                            $location.path('/people');
                        };

                        vm.scrollToTop = function() {
                            if ($state.current.activeTab === "bookmarks") {
                                ScrollToTopService.scroll("bookmarks-container");
                            } else if ($state.current.activeTab === "catalog") {
                                ScrollToTopService.scroll("catalog-container");
                            }
                        };

                        vm.showNotificationsOverflowContainer = function() {
                            if ($state.current.name == 'newApps') {
                                $rootScope.$broadcast('notification-newapps-overlflow-actions', true);
                            }
                            $rootScope.$broadcast('notification-overlflow-actions', true);
                        };

                        $rootScope.$on('people-search-field-on', function(event, data) {
                            vm.showRecentSearch = data;

                            // Search field is should always be on for people tab even when scrim cancels the search
                            if ($state.current.activeTab === 'people') {
                                vm.searchFieldOn = true;
                            } else if ($state.current.activeTab === 'peopleDetails') {
                                vm.searchFieldOn = data;
                            }
                        });

                        //navigating to other page, check for device status, async call
                        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
                            //searchFieldOn should be false when going from people search
                            if (_.get(fromState, 'name') === 'people') {
                                vm.searchFieldOn = false;
                            }

                            //searchFieldOn should be true when going to people search
                            if (_.get(toState, 'name') === 'people') {
                                vm.searchFieldOn = true;
                                vm.showRecentSearch = false;
                            }

                            if (!vm.pollForEnrollmentStatus && _.get(fromState, 'name') !== 'index') {
                                vm.getDeviceRegistrationDetail().then(function(status) {
                                    vm.checkMdmStatus(status);
                                });
                            }
                        });
                    });
            };

            function checkDeviceEnrollment() {
                //poll for device enrollment status
                if (UserAgent.isAWJadeV2()) {
                    var cancelPollForEnrollmentTimeOut = $timeout(function() {
                        vm.pollForEnrollmentStatus = true;
                    }, 2000);

                    var callback = function(clearEntitlementCache) {
                        $timeout.cancel(cancelPollForEnrollmentTimeOut);
                        vm.pollForEnrollmentStatus = false;
                        vm.bootstrap(clearEntitlementCache);
                    if (clearEntitlementCache) {
                        LocalStorageService.clearAll();
                    }
                    };

                    vm.getDeviceRegistrationDetailPoll().then(function(clearEntitlementCache) {
                        callback(clearEntitlementCache);
                    }, function() {
                        callback();
                        vm.retryLoad();
                    });
                } else {
                    vm.getDeviceRegistrationDetail();
                    vm.bootstrap();
                }
            }

            function checkTermsOfUse(userName) {
                // Terms of use will not be checked in Android less than 3.3 versions because native client should add document.referer header to display vIDM TOU page
                if (!vm.mdmOnlyWS1 && UtilService.checkTermsOfUseStatus()) {
                    ConfigService.getTermsOfUseStatus().then(function(response) {
                        if (!response.termsOfUseAcceptanceStatus.accepted) {
                            ConfigService.getUserConsoleTermsUrl().then(function(url) {
                                ConfigService.getLogoutUrl().then(function(logoutUrl) {
                                    window.location = UtilService.constructTouRedirectUrl(url, logoutUrl, userName);
                                });
                            });
                        }
                    });
                }
            }

            checkDeviceEnrollment();
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
