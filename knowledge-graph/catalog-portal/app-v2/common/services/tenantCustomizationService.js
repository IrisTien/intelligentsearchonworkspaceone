(function(module) {
    'use strict';

    module.service('TenantCustomizationService', ['UserAgent', 'LaunchUtilityService', function(UserAgent, LaunchUtilityService) {
        var customizationService = this;
        var customizationSettings = {};
        var catalogCustomizationSettings = {};

        customizationService.getCustomizationSettings = function() {
            return customizationSettings;
        };

        customizationService.setCustomizationSettings = function(settings) {
            customizationSettings = settings;
        };

        customizationService.getCatalogCustomizationSettings = function() {
            return catalogCustomizationSettings;
        };

        customizationService.setCatalogCustomizationSettings = function(settings) {
            catalogCustomizationSettings = settings;
        };

        customizationService.isNotificationsEnabled = function() {
            var customizations = customizationService.getCustomizationSettings();
            return _.get(customizations, 'notificationsEnabled', false);
        };

        customizationService.isAppRatingEnabled = function() {
            var customizations = customizationService.getCustomizationSettings();
            return _.get(customizations, 'appRatingEnabled', false);
        };

        customizationService.getCustomizationsOrder = function() {
            var customizations = customizationService.getCatalogCustomizationSettings();
            customizations = _.get(customizations, 'compositeCatalogCustomizations.catalogCustomizations.catalogCustomizationList', []);
            var enabledCustomizations = _.filter(customizations, {'customizationStatus': 'ENABLED'});
            return _.map(enabledCustomizations, 'name');
        };

        customizationService.isHubFavoritesEnabled = function() {
            var enabledCustomizations = customizationService.getCustomizationsOrder();
            return enabledCustomizations.indexOf('Favorites') > -1;
        };

        customizationService.isHubPeopleEnabled = function() {
            var customizations = customizationService.getCustomizationSettings();
            return customizations.hidePeopleTab === false && customizations.hidePeopleTab !== undefined;
        };

        customizationService.isHubFavoritesOnlyView = function() {
            var enabledCustomizations = customizationService.getCustomizationsOrder();
            return enabledCustomizations.length === 1 && enabledCustomizations[0] === 'Favorites';
        };

        customizationService.isHubCategoryEnabled = function() {
            var enabledCustomizations = customizationService.getCustomizationsOrder();
            return enabledCustomizations.indexOf('Categories') > -1;
        };

        customizationService.isLoadFromDbFailed = function() {
            var customizations = customizationService.getCatalogCustomizationSettings();
            return _.get(customizations, 'compositeCatalogCustomizations.catalogCustomizations.loadFromDbFailed', false);
        };

        customizationService.setLaunchOptions = function() {
            var customizationSettings = customizationService.getCustomizationSettings();
            LaunchUtilityService.setUseNonNPAPIForCitrixLaunch(customizationSettings.useNonNPAPIForCitrixLaunch);
            if (UserAgent.isWindows()) {
                LaunchUtilityService.setSuppressLaunchDialog(customizationSettings.suppressLaunchDialog.WINDOWS);
            } else if (UserAgent.isMac()) {
                LaunchUtilityService.setSuppressLaunchDialog(customizationSettings.suppressLaunchDialog.MAC);
            } else if (UserAgent.isMobile()) {
                LaunchUtilityService.setSuppressLaunchDialog(customizationSettings.suppressLaunchDialog.MOBILE);
            }
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

