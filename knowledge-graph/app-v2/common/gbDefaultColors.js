(function(module) {
    'use strict';

    module.constant('GbDefaultColors', {
        'lightTheme': {
            'navigationBarBg': '#ffffff',
            'navigationBarDropShadowColor': 'rgba(0,0,0,0.5)',
            'navigationBarTextIconColor': '#000000',
            'bodyTextIconColor': '#000000',
            'appLabelDotsImage': 'app-v2/graphics-hub/icon-dots-black.svg',
            'listDividerColor': 'rgba(0,0,0, 0.12)',
            'svgPrimaryStroke': '#123e66',
            'svgSecondaryStroke': '#ccd5e1',
            'peopleDetailCurrentUserBg': 'rgba(0, 129, 167, 0.06)',
            'peopleOrgTreeLineColor': '#c1cdd4',
            'searchHiglightColor': '#D8F1FF',
            'notificationCountBgColor': '#073E77'
        },
        'darkTheme': {
            'navigationBarBg': '#393939',
            'navigationBarDropShadowColor': 'rgba(207,207,207,0.5)',
            'navigationBarTextIconColor': '#ffffff',
            'bodyTextIconColor': '#ffffff',
            'appLabelDotsImage': 'app-v2/graphics-hub/icon-dots-white.svg',
            'listDividerColor': 'rgba(255,255,255,0.25)',
            'svgPrimaryStroke': '#f2f2f2',
            'svgSecondaryStroke': '#61717d',
            'peopleDetailCurrentUserBg': 'rgba(255,255,255,0.25)',
            'peopleOrgTreeLineColor': '#c1cdd4',
            'searchHiglightColor': 'rgba(255, 255, 255, 0.25)',
            'notificationCountBgColor': '#073E77'
        }
    });
})(angular.module('com.vmware.greenbox.appCenter'));
