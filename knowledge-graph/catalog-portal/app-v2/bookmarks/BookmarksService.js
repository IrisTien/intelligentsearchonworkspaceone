(function(module) {
    'use strict';
    module.service('BookmarksService', [
        'Resource',
        'ConfigService',
        '$http',
        '$log',
        '$notify',
        'RequestFactory',
        'UtilService',
        'UserAgent',
        'Localization',
        'OfflineService',
        'ModalService',
        'lodash',
        'AppActionService',
        'HttpProxyService',
        'LocalStorageConstants',
        'ProgressIndicatorService',
        function(
            Resource,
            ConfigService,
            $http,
            $log,
            $notify,
            RequestFactory,
            UtilService,
            UserAgent,
            Localization,
            OfflineService,
            ModalService,
            lodash,
            AppActionService,
            HttpProxyService,
            LocalStorageConstants,
            ProgressIndicatorService) {
            var appsUrl;

            var ALL_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.allApps'),
                type: 'all',
                isDefault: true
            };

            var selectedCategory = ALL_APPS_LABEL;

            this.setSelectedCategory = function(selCategory) {
                selectedCategory = selCategory;
            };

            this.getSelectedCategory = function() {
                return selectedCategory;
            };

            this.getFirstPage = function(params, noCache) {
                var launcherAppsUrlPromise = ConfigService.getLauncherUrl();
                return launcherAppsUrlPromise.then(function(data) {
                    appsUrl = data;
                    if (noCache) {
                        appsUrl += "?noCache=" + noCache;
                    }
                    var request = HttpProxyService.get(LocalStorageConstants.BOOKMARKS, appsUrl, { headers: {'Accept': 'application/hal+json', 'method': 'GET'}, sync: false, params: UtilService.isEmpty(params) ? null : params });
                    return request.then(function(data) {
                        var returnData = {};
                        returnData.myapps = [];
                        if (data.entitlementResourceList && data.entitlementResourceList._embedded && data.entitlementResourceList._embedded.myapps) {
                            var myApps = data.entitlementResourceList._embedded.myapps;
                            var uniqueApps = _.uniq(myApps, 'appId');
                            returnData.myapps = uniqueApps;
                        }
                        returnData.allEntitlementsLoaded = _.get(data, 'allEntitlementsLoaded', undefined);
                        returnData.deviceStatus = _.get(data, 'deviceInfo.deviceStatus', undefined);
                        returnData.launchPreferences = {};
                        if (data.launchPreferences) {
                            returnData.launchPreferences = data.launchPreferences;
                        }
                        //flag to check if the bookmark is already saved once
                        returnData.bookmarkOrderSet = data.bookmarkOrderSet;
                        return returnData;
                    });
                });
            };

            this.toggleBookmark = function(currentApp, useJQ, successHandler, failureHandler) {
                var getFavoriteUrl = function(favApp) {
                    var favoriteTemplatedUrl = lodash.get(favApp, '_links.favorites.href');
                    var templateText = 'favorite={boolValue}';
                    var replacetext = 'favorite=' + !favApp.favorite;
                    if (favoriteTemplatedUrl) {
                        return favoriteTemplatedUrl.replace(templateText, replacetext);
                    } else {
                        return "";
                    }
                };

                var deviceOnline = OfflineService.isDeviceOnline();

                if (deviceOnline) {
                    var favoriteUrl = getFavoriteUrl(currentApp);
                    currentApp.bookmarking = true;
                    if (favoriteUrl != undefined || favoriteUrl) {
                        this.doToggleBookmark(favoriteUrl, useJQ).then(function() {
                            currentApp.favorite = !currentApp.favorite;
                            currentApp.bookmarking = false;
                            HttpProxyService.updateBookmark();

                            if (successHandler) {
                                successHandler(currentApp);
                            }
                        }, function(error) {
                            currentApp.bookmarking = false;
                            if (error.handled) { //When system is under maintenance
                                return;
                            }
                            $notify.error('error.failToFavoriteApp');
                            if (failureHandler) {
                                failureHandler(error);
                            }
                        });
                    } else {
                        $log.error('Unformatted favorite url');
                    }
                } else {
                    var warningMessage = (currentApp.favorite) ? 'bookmarkStatus.offlineRemoveBookmarkMessage' : 'favoriteStatus.offlineFavoriteMessage';
                    $notify.warning(warningMessage);
                }
            };

            this.doToggleBookmark = function(favoriteUrl, useJQ) {
                var req = RequestFactory(favoriteUrl, {method: 'POST'});
                return $http(req);
            };

            this.markAppLaunched = function(appLaunchedUrl, useJQ) {
                var req = RequestFactory(appLaunchedUrl, {method: 'POST'});
                return $http(req);
            };

            this.getLauncherCategories = function(params) {
                return ConfigService.getLauncherCategoriesUrl().then(function(url) {
                    var request = Resource(url, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/hal+json'
                        },
                        params: UtilService.isEmpty(params) ? null : params
                    });
                    return request.get().thenGet('_embedded').thenGet('categoryResourceList');
                });
            };

            this.setAppVisible = function(app) {
                if (app && app._links.appVisibility) {
                    var req = RequestFactory(app._links.appVisibility.href, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/hal+json'
                        },
                        params: {"appName": app.name}
                    });
                    return $http(req);
                }
            };
            this.resetDesktop = function(resetUrl) {
                var request = RequestFactory(resetUrl, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/hal+json'
                    }
                });
                return $http(request);
            };
            this.setWSFedAppPassword = function(app, password) {
                if (app && app._links['set-app-password'] && password && password.trim() != '') {
                    var request = RequestFactory(app._links['set-app-password'].href, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/hal+json'
                        },
                        params: {"password": password.trim()}
                    });
                    return $http(request);
                }
            };

            this.performResetDesktop = function(app, $event) {
                var deviceOnline = OfflineService.isDeviceOnline();
                if ($event) {
                    $event.preventDefault();
                }
                if (deviceOnline) {
                    app.resetDesktop = app._links['reset-desktop'] != undefined ? app._links['reset-desktop'].href : "";
                    if (app.resetDesktop) {
                        ProgressIndicatorService.showProgressIndicator();
                        AppActionService.resetDesktop(app.resetDesktop).then(function(data) {
                            ProgressIndicatorService.hideProgressIndicator();
                            if (data) {
                                $notify.info('resetDesktop.sucess');
                            } else {
                                $notify.error('error.failedToResetApp');
                            }
                        }).catch(function() {
                            ProgressIndicatorService.hideProgressIndicator();
                            $notify.error('error.failedToResetApp');
                        });
                    } else {
                        $log.error('Unformatted resetDesktop url');
                    }
                } else {
                    $notify.warning('resetDesktopStatus.offlineMessage');
                }
            };

            this.openSetAppPasswordDialog = function(app, $event) {
                var isHubApp = UtilService.isHub();
                var template = isHubApp ? 'app-v2/components/shared/setAppPassword.html' : 'app-v2/common/modalDialog/templates/setAppPassword.html';
                if ($event) {
                    $event.stopPropagation();
                }
                ModalService.getCurrentModal().open(template, { app: app });
            };

            this.saveCustomView = function(data) {
                return ConfigService.getBookmarkReorderUrl().then(function(url) {
                    var request = RequestFactory(url, {
                        method: 'PATCH',
                        headers: {
                            'Accept': 'application/hal+json',
                            'Content-Type': 'application/vnd.vmware.catalog.bookmarks.reorder+json'
                        },
                        data: data
                    });
                    return $http(request);
                });
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
