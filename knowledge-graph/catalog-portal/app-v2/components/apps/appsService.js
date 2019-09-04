(function(module) {
    'use strict';

    module.service('AppsService', ['$q', 'CatalogService', 'Resource', 'INSTALL_STATUS', 'UtilService', 'EventsService', 'AppLaunchService',
        function($q, CatalogService, Resource, INSTALL_STATUS, UtilService, EventsService, AppLaunchService) {
        var service = this;
        var entitlements = {};
        var favorites = [];
        var catalogCustomization = {};

        service.loadFromDbFailed = false;

        service.setEntitlements = function(data) {
            entitlements = data;
        };

        service.setFavorites = function(data) {
            favorites = data;
        };

        service.getEntitlements = function() {
            return entitlements;
        };

        service.getCatalogCustomization = function() {
            return catalogCustomization;
        };

        service.setCatalogCustomization = function(data) {
            return catalogCustomization = data;
        };

        service.getFavorites = function() {
            //favorites are set when they are ordered
            if (favorites.length) {
                return favorites;
            }
            return _.filter(entitlements, function(entitlement) {
                return entitlement.favorite && (entitlement.installStatus.toUpperCase() === INSTALL_STATUS.ACTIVATED.name);
            });
        };

        service.getWebApps = function() {
            return _.filter(entitlements, {'type': "WEB"});
        };

        service.getVirtualApps = function() {
            return _.filter(entitlements, {'type': "VIRTUAL"});
        };

        service.getNativeApps = function() {
            return _.filter(entitlements, {'type': "NATIVE"});
        };

        service.getCategoryApps = function() {
            var category = CatalogService.getSelectedCategory();
            if (UtilService.hideVirtualApps()) {
                category._links.self.href = JSON.parse(JSON.stringify(category._links.self.href + "&displayMode=phone"));
            }
            var request = Resource(category._links.self.href, {
                headers: {
                    'Accept': 'application/hal+json',
                    'method': 'GET'
                }
            });
            return request.get().then(function(response) {
                return response._embedded.entitlements;
            });
        };

        service.getNewApps = function() {
            var newAppsAppContext = {
                selectedCategory: CatalogService.getNewlyEntitledAppsLabel()
            };
            return CatalogService.getFirstPage(newAppsAppContext, false, true, false, true).then(function(data) {
                return _.get(data, 'entitlements', []);
            });
        };

        service.getAppList = function(type) {
            switch (type) {
                case 'favorite':
                    return this.getFavorites();
                case 'Web':
                    return this.getWebApps();
                case 'Virtual':
                    return this.getVirtualApps();
                case 'Native':
                    return this.getNativeApps();
                case 'category':
                    return this.getCategoryApps();
                case 'all':
                    return entitlements;
                default:
                    return {};
            }
        };

        service.getFavoritesFromBookmarkService = function() {
            var params = {};
            params.favoriteOnly = true;
            params.excludeThinApps = true;
            // This I am not sure whether to keep it or ignor or deal it in a later patch
            var loadingUnCachedEntitlements = false;

            return BookmarksService.getFirstPage(params, false).then(function(data) {
                return data.myapps;
            });
        };

        service.checkForEvents = function(entitlements, events) {
            var handledApps = [];
            for (var i = 0; i < events.length; i++) {
                if (events[i].action === 'INSTALL' || events[i].action === 'LAUNCH_APP') {
                    if (_.contains(handledApps, events[i].eventData.appId)) {
                        EventsService.deleteEvent(events[i].eventId);
                    } else {
                        handledApps.push(events[i].eventData.appId);
                        var app = _.find(entitlements, {'appId': events[i].eventData.appId});

                        if (events[i].action === 'INSTALL') {
                            app.eventId = events[i].eventId;
                            CatalogService.activateApp(app, CatalogService.getDeviceStatus());
                        }

                        if (events[i].action === 'LAUNCH_APP') {
                            app.launch = app._links.launch !== undefined ? app._links.launch.href : "";
                            EventsService.deleteEvent(events[i].eventId);
                            AppLaunchService.launchApp(app);
                        }

                        //navigate to the page which triggered install
                        if (events[i].eventData.url) {
                            location.hash = events[i].eventData.url;
                        }
                    }
                }
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
