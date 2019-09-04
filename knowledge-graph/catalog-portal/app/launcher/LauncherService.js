(function(module) {
    'use strict';
    module.service('LauncherService', [
                        'Resource',
                        'ConfigService',
                        '$http',
                        'RequestFactory',
                        'UtilService',
                        'UserAgent',
                        'DesktopLaunchService',
                        'Localization',
                        function(
                            Resource,
                            ConfigService,
                            $http,
                            RequestFactory,
                            UtilService,
                            UserAgent,
                            DesktopLaunchService,
                            Localization){
            var appsUrl;

            var ALL_APPS_LABEL = {
                name: Localization.getLocalizedString('myapp.nav.allApps'),
                type:'all',
                isDefault:true
            };

            var isFilteredByFav = false;
            var selectedCategory = ALL_APPS_LABEL;
            var suppressLaunchDialog = false;

            this.setFilterByFavorite = function(isFilterByFav) {
                isFilteredByFav = isFilterByFav;
            }
            this.isFilteredByFavorite = function() {
                return isFilteredByFav;
            }

            this.setSuppressLaunchDialog = function(suppressLaunchDialog) {
                suppressLaunchDialog = suppressLaunchDialog;
            }
            this.isSuppressLaunchDialog = function() {
                return suppressLaunchDialog;
            }

            this.toggleFilteredByFavorite = function() {
                isFilteredByFav = !isFilteredByFav;
            }

            this.setSelectedCategory = function(selCategory) {
                selectedCategory = selCategory;
            }

            this.getSelectedCategory = function() {
                return selectedCategory;
            }

            this.getFirstPage = function(params){
                var launcherAppsUrlPromise = ConfigService.getLauncherUrl();
                return launcherAppsUrlPromise.then(function(data){
                    appsUrl = data;
                    var request = Resource(appsUrl ,
                        {
                            headers:{
                                'Accept': 'application/hal+json',
                                'method':'GET'
                            },
                            params: UtilService.isEmpty(params) ? null : params

                        });
                    return request.get().then(function(data) {
                        var returnData = {};
                        returnData.myapps = [];
                        if (data.entitlementResourceList && data.entitlementResourceList._embedded && data.entitlementResourceList._embedded.myapps) {
                            var myApps = data.entitlementResourceList._embedded.myapps;
                            var uniqueApps = _.uniq(myApps, 'appId');
                            returnData.myapps = uniqueApps;
                        }
                        returnData.launchPreferences = {};
                        if (data.launchPreferences)  {
                            returnData.launchPreferences = data.launchPreferences;
                        }
                        return returnData;
                    });
                });
            };

            this.toggleFavorite = function(favoriteUrl, useJQ){
                var req = RequestFactory(favoriteUrl, {method:'POST'});
                if (useJQ) {
                    return $.ajax(req);
                } else {
                    return $http(req);
                }
            };

            this.markAppLaunched = function(appLaunchedUrl, useJQ){
                var req = RequestFactory(appLaunchedUrl, {method:'POST'});
                if (useJQ) {
                    return $.ajax(req);
                } else {
                    return $http(req);
                }
            };

            this.getLauncherCategories = function(params){
                return ConfigService.getLauncherCategoriesUrl().then(function(url){
                    var request = Resource(url ,{
                        method:'GET',
                        headers:{
                            Accept: 'application/hal+json'
                        },
                        params: UtilService.isEmpty(params) ? null : params
                    });
                    return request.get().thenGet('_embedded').thenGet('categoryResourceList');
                });
            };

            this.getOta =  function(url) {
                return ConfigService.getOtaUrl().then(function(otaUrl){
                    var req = Resource(otaUrl+'?url='+url, { method:'GET',Accept: 'application/json' });
                    return req.get().then(function(otaResponse) {
                        return otaResponse.ota;
                    });
                });
            }

            this.setAppVisible = function(app){
                if(app && app._links['appVisibility']) {
                        var req = RequestFactory(app._links['appVisibility'].href, {
                            method:'PUT',
                            headers:{
                                Accept: 'application/hal+json'
                            },
                            params: {"appName": app.name}
                        });
                        return $http(req);
                }
                return;
            }
            this.resetDesktop = function(resetUrl){
                var request = RequestFactory(resetUrl ,{
                    method:'PUT',
                    headers:{
                        Accept: 'application/hal+json'
                    }
                });
                return $http(request);
            };
            this.setWSFedAppPassword = function(app, password){
                if(app && app._links['set-app-password'] && password && password.trim() != '') {
                    var request = RequestFactory(app._links['set-app-password'].href ,{
                        method:'PUT',
                        headers:{
                            Accept: 'application/hal+json'
                        },
                        params: {"password": password.trim()}
                    });
                    return $http(request);
                }
                return;
            };

        }]);

})(angular.module('com.vmware.greenbox.appCenter'));