(function(module) {
    'use strict';

    module.service('HubBrandingService', ['Resource', 'ConfigService', '$q', 'GbDefaultColors', 'UtilService', 'SettingsService', function(Resource, ConfigService, $q, GbDefaultColors, UtilService, SettingsService) {
        var hubBrandingService = this;

        hubBrandingService.getHubBranding = function() {
            return ConfigService.getHubBrandingUrl().then(function(url) {
                return Resource(url, {}).get();
            });
        };

        hubBrandingService.getUpdateValues = function() {
            var deferred = $q.defer();
            hubBrandingService.getHubBranding().then(function(hubBranding) {
                if (hubBranding.customized) {
                    var newBrandingValues = {};
                    newBrandingValues.customized = true;

                    // If customer uploaded their own logo use their logo, otherwise use the default hub logo
                    if (hubBranding.companyLogo) {
                        newBrandingValues.companyLogo = hubBranding.companyLogo;
                    } else {
                        newBrandingValues.companyLogo = 'app-v2/graphics-hub/logo-hub.svg';
                    }

                    var isNavigationBarLightTheme = hubBranding.navigationBar.typeAndIconColor === '#000000',
                        isBodyLightTheme = hubBranding.body.typeAndIconColor === '#000000',
                        bodyBackgroundColor = hubBranding.body.backgroundColor,
                        navigationBarBg = hubBranding.navigationBar.backgroundColor,
                        interactiveColor = hubBranding.body.interactiveColor;

                    // Update the navigationVar values

                    if (isNavigationBarLightTheme) {
                        newBrandingValues.navigationBarTextIconColor = GbDefaultColors.lightTheme.navigationBarTextIconColor;
                        newBrandingValues.navigationBarDropShadowColor = GbDefaultColors.lightTheme.navigationBarDropShadowColor;
                        // Hub Browser Ribbon
                    } else {
                        newBrandingValues.navigationBarTextIconColor = GbDefaultColors.darkTheme.navigationBarTextIconColor;
                        newBrandingValues.navigationBarDropShadowColor = GbDefaultColors.darkTheme.navigationBarDropShadowColor;
                    }
                    newBrandingValues.navigationBarBackgroundColor = hubBranding.navigationBar.backgroundColor;

                    // Update the body values
                    if (isBodyLightTheme) {
                        newBrandingValues.bodyTextIconColor = GbDefaultColors.lightTheme.bodyTextIconColor;
                        newBrandingValues.catgoryBodyColor = '#ffffff';
                        newBrandingValues.listDividerColor = GbDefaultColors.lightTheme.listDividerColor;
                        newBrandingValues.listItemArrow = 'url(app-v2/graphics-hub/icon-right-arrow-light.svg)';
                        newBrandingValues.appLabelBgImage = 'url(app-v2/graphics-hub/icon-dots-black.svg)';
                        newBrandingValues.defaultPrimaryStroke = GbDefaultColors.lightTheme.svgPrimaryStroke;
                        newBrandingValues.defaultSecondaryStroke = GbDefaultColors.lightTheme.svgSecondaryStroke;
                        newBrandingValues.peopleDetailCurrentUserBg = GbDefaultColors.lightTheme.peopleDetailCurrentUserBg;
                        newBrandingValues.searchHighlightColor = GbDefaultColors.lightTheme.searchHiglightColor;
                    } else {
                        newBrandingValues.bodyTextIconColor = GbDefaultColors.darkTheme.bodyTextIconColor;
                        newBrandingValues.catgoryBodyColor = hubBranding.body.backgroundColor;
                        newBrandingValues.listDividerColor = GbDefaultColors.darkTheme.listDividerColor;
                        newBrandingValues.listItemArrow = 'url(app-v2/graphics-hub/icon-right-arrow-dark.svg)';
                        newBrandingValues.appLabelBgImage = 'url(app-v2/graphics-hub/icon-dots-white.svg)';
                        newBrandingValues.defaultPrimaryStroke = GbDefaultColors.darkTheme.svgPrimaryStroke;
                        newBrandingValues.defaultSecondaryStroke = GbDefaultColors.darkTheme.svgSecondaryStroke;
                        newBrandingValues.peopleDetailCurrentUserBg = GbDefaultColors.darkTheme.peopleDetailCurrentUserBg;
                        newBrandingValues.searchHighlightColor = GbDefaultColors.darkTheme.searchHiglightColor;
                    }
                    newBrandingValues.contentBodyColor = bodyBackgroundColor;
                    newBrandingValues.breadcrumbBgColor = bodyBackgroundColor;
                    var breadcrumbBgColor = isBodyLightTheme ? UtilService.shadeColor(bodyBackgroundColor, -10) : UtilService.shadeColor(bodyBackgroundColor, 10);
                    newBrandingValues.breadcrumbBgColor = breadcrumbBgColor;
                    newBrandingValues.interactiveColor = interactiveColor;
                    newBrandingValues.secondaryBg = UtilService.hexToRgbA(interactiveColor, 0.15);
                    newBrandingValues.categoryScrimColorStart = UtilService.hexToRgbA(bodyBackgroundColor, 0);
                    newBrandingValues.categoryScrimColorEnd = UtilService.hexToRgbA(bodyBackgroundColor, 1);
                    newBrandingValues.notificationCardHighlightColor = UtilService.hexToRgbA(interactiveColor, 0.4);
                    var whiteColors = ['#fff', '#ffffff', '#FFF', '#FFFFFF'];
                    if (_.contains(whiteColors, bodyBackgroundColor)) {
                        newBrandingValues.leftnavSelectedColor = 'rgba(220, 220, 220, 1)';
                        newBrandingValues.leftnavHoverColor = 'rgba(0, 0, 0, 0.05)';
                    } else {
                        newBrandingValues.leftnavSelectedColor = 'rgba(255, 255, 255, 1)';
                        newBrandingValues.leftnavHoverColor = 'rgba(255, 255, 255, 0.6)';
                    }

                    // Special treat for empty state stokes if they are the same color as the body background color
                    var defaultPrimaryStroke = isBodyLightTheme ? GbDefaultColors.lightTheme.svgPrimaryStroke : GbDefaultColors.darkTheme.svgPrimaryStroke,
                        defaultSecondaryStroke = isBodyLightTheme ? GbDefaultColors.lightTheme.svgSecondaryStroke : GbDefaultColors.darkTheme.svgSecondaryStroke;

                    if (bodyBackgroundColor == defaultPrimaryStroke || bodyBackgroundColor == defaultSecondaryStroke) {
                        var newPrimaryStroke = isBodyLightTheme ? UtilService.shadeColor(defaultPrimaryStroke, -30) : UtilService.shadeColor(defaultPrimaryStroke, 30),
                            newSecondaryStroke = isBodyLightTheme ? UtilService.shadeColor(defaultSecondaryStroke, -30) : UtilService.shadeColor(defaultSecondaryStroke, 30);
                        newBrandingValues.svgPrimaryStroke = bodyBackgroundColor == defaultPrimaryStroke ? newPrimaryStroke : defaultPrimaryStroke;
                        newBrandingValues.svgSecondaryStroke = bodyBackgroundColor == defaultSecondaryStroke ? newSecondaryStroke : defaultSecondaryStroke;
                    } else {
                        newBrandingValues.svgPrimaryStroke = isBodyLightTheme ? GbDefaultColors.lightTheme.svgPrimaryStroke : GbDefaultColors.darkTheme.svgPrimaryStroke;
                        newBrandingValues.svgSecondaryStroke = isBodyLightTheme ? GbDefaultColors.lightTheme.svgSecondaryStroke : GbDefaultColors.darkTheme.svgSecondaryStroke;
                    }
                    newBrandingValues.svgPrimaryFill = bodyBackgroundColor;
                    newBrandingValues.svgSecondaryFill = bodyBackgroundColor;

                    // People org char tree colors
                    var newTreeLineColor = UtilService.shadeColor(bodyBackgroundColor, -30);
                    newBrandingValues.peopleOrgTreeLineColor = bodyBackgroundColor == GbDefaultColors.lightTheme.peopleOrgTreeLineColor ? newTreeLineColor : GbDefaultColors.lightTheme.peopleOrgTreeLineColor;

                    // Small header button color treatment -- incase the interactive color is the same as the navigation bar
                    if (navigationBarBg == interactiveColor) {
                        var borderColor = hubBranding.navigationBar.typeAndIconColor;
                        // If it light theme, we lighten the color, if it is the dark theme, we darken the color
                        var shadedBorderColor = isNavigationBarLightTheme ? UtilService.shadeColor(borderColor, 50) : UtilService.shadeColor(borderColor, -50);
                        newBrandingValues.detailsActionButtonBorderColor = shadedBorderColor;
                    } else {
                        // If do not define transparent, the css will generate a white border as we added border in the branding stayle tag
                        newBrandingValues.detailsActionButtonBorderColor = 'transparent';
                    }

                    // Notification count color, just in case the navigationVar bg color same as the dark blue count color, use the navigationBar text Icon color
                    if (navigationBarBg == GbDefaultColors.lightTheme.notificationCountBgColor) {
                        newBrandingValues.notificationCountBgColor = hubBranding.navigationBar.typeAndIconColor;
                        newBrandingValues.notificationCountBorderColor = hubBranding.navigationBar.typeAndIconColor;
                        newBrandingValues.notificationCountTextColor = navigationBarBg;
                    }
                    SettingsService.setCurrentBranding(hubBranding);
                    deferred.resolve(newBrandingValues);
                } else {
                    deferred.reject({});
                }
            }, function() {
                deferred.reject({});
            });
            return deferred.promise;
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
