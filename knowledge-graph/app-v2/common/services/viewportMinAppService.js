(function(module) {
    'use strict';

    module.service('ViewportMinAppService', ['$window', 'UserAgent', function($window, UserAgent) {
        var ViewportMinAppService = this;

        ViewportMinAppService.getMinAppNo = function(screenWidth) {
            var PHONE_SMALL_MINAPPNO = 6,
                PHONE_Large_MINAPPNO = 8,
                TABLET_MEDIUM_MINAPPNO = 10,
                TABLET_LARGE_MINAPPNO = 12,
                TABLET_XLARGE_MINAPPNO = 14;

            //This needs to work closely with the gird-mobile.less
            if (screenWidth <= 580) {
                return PHONE_SMALL_MINAPPNO;
            } else if (screenWidth <= 767) {
                return PHONE_Large_MINAPPNO;
            } else if (screenWidth <= 890) {
                return TABLET_MEDIUM_MINAPPNO;
            } else if (screenWidth <= 1023) {
                return TABLET_LARGE_MINAPPNO;
            } else if (screenWidth <= 1280) {
                return TABLET_XLARGE_MINAPPNO;
            } else {
                return TABLET_XLARGE_MINAPPNO;
            }
        };

        // This is for browser get one row app
        ViewportMinAppService.getOneRowMinAppNoBrowser = function(screenWidth) {
            var PHONE_SMALL_MINAPPNO = 3,
                PHONE_Large_MINAPPNO = 4,
                TABLET_SMALL_MINAPPNO = 3,
                TABLET_MEDIUM_MINAPPNO = 4,
                TABLET_LARGE_MINAPPNO = 5,
                DESKTOP_LARGE_MINAPPNO = 6;

            //This needs to work closely with the gird-mobile.less
            if (screenWidth < 580) {
                return PHONE_SMALL_MINAPPNO;
            } else if (screenWidth < 768) {
                return PHONE_Large_MINAPPNO;
            } else if (screenWidth < 840) {
                return TABLET_SMALL_MINAPPNO;
            } else if (screenWidth < 920) {
                return TABLET_MEDIUM_MINAPPNO;
            } else if (screenWidth < 1030) {
                return TABLET_LARGE_MINAPPNO;
            } else {
                return DESKTOP_LARGE_MINAPPNO;
            }
        };

        // Desktopap grid structure is different, below 640 is content cutoff, and need fetch a different set of number at a given viewport
        ViewportMinAppService.getOneRowMinAppNoDesktop = function(screenWidth) {
            var TABLET_SMALL_MINAPPNO = 3,
                TABLET_MEDIUM_MINAPPNO = 4,
                TABLET_LARGE_MINAPPNO = 5,
                DESKTOP_LARGE_MINAPPNO = 6;

            //This needs to work closely with the gird-mobile.less
            if (screenWidth < 640) {
                return TABLET_SMALL_MINAPPNO;
            } else if (screenWidth < 768) {
                return TABLET_SMALL_MINAPPNO;
            } else if (screenWidth < 920) {
                return TABLET_MEDIUM_MINAPPNO;
            } else if (screenWidth < 1030) {
                return TABLET_LARGE_MINAPPNO;
            } else {
                return DESKTOP_LARGE_MINAPPNO;
            }
        };

        ViewportMinAppService.oneRowSectionAppsCount = function(screenWidth) {
            var appCounts = UserAgent.isAWJadeDesktop() ? ViewportMinAppService.getOneRowMinAppNoDesktop(screenWidth) : ViewportMinAppService.getOneRowMinAppNoBrowser(screenWidth);
            return appCounts;
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));

