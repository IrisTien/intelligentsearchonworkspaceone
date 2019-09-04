appCenter.component('appPromotions', {
    templateUrl: 'app-v2/components/appPromotions/appPromotionsBrowser.html',
    bindings: {
        promotions: '<',
        applications: '<',
        categories: '<'
    },
    controller: ['$window', '$scope', '$timeout', 'UserAgent', function($window, $scope, $timeout, UserAgent) {
        var vm = this;

        vm.carouselConfig = {
            loop: true,
            autoWidth: true,
            dots: true,
            nav: true,
            center: true,
            margin: 0,
            // For browser the max number of slides on the screen is 3 for any viewport size
            items: 3
        };

        if (this.promotions.length == 1) {
            vm.carouselConfig.mouseDrag = false;
            vm.carouselConfig.nav = false;
            vm.carouselConfig.dots = false;
            vm.carouselConfig.touchDrag = false;
        }

        if (this.promotions.length >= 2) {
            $timeout(function() {
                $('.owl-carousel').find('.owl-nav').removeClass('disabled');
                // This is for clicking on the nav, without the following code the nav dissapears
                $('.owl-carousel').on('changed.owl.carousel', function(event) {
                    $(this).find('.owl-nav').removeClass('disabled');
                });
                // This is for resizing the viewport, without the following code the nav dissapears
                $('.owl-carousel').on('resized.owl.carousel', function(event) {
                    $(this).find('.owl-nav').removeClass('disabled');
                });
            }, 200);
        }

        // Do not show the owl-nav on mobile ios and android per UX mock, windows will show regardless as they have 2in1 (touch and mouse mode)
        vm.isIOSAndroid = UserAgent.isIOS() || UserAgent.isAndroid();

        vm.getAppIcon = function(appId) {
            return this.applications[appId] && this.applications[appId].iconUrl;
        };

        vm.getAppName = function(appId) {
            return this.applications[appId] && this.applications[appId].name;
        };
    }],
    controllerAs: 'appPromotionsBrowserCtrl'
});

