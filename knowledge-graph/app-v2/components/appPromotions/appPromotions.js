appCenter.component('appPromotions', {
    templateUrl: 'app-v2/components/appPromotions/appPromotions.html',
    bindings: {
        promotions: '<',
        applications: '<',
        categories: '<'
    },
    controller: ['$window', '$scope', '$timeout', 'UtilService', 'UserAgent', function($window, $scope, $timeout, UtilService, UserAgent) {
        var vm = this;
        vm.refresh = true;
        var promotionWidth = window.innerWidth < 360 ? 280 : 325;
        vm.promotionWidth = promotionWidth + 'px';
        vm.carouselConfig = {
            loop: true,
            autoWidth: true,
            dots: true,
            margin: 10,
            items: 4,
            onInitialized: initialise
        };

        vm.getAppIcon = function(appId) {
            return this.applications[appId] && this.applications[appId].iconUrl;
        };

        vm.getAppName = function(appId) {
            return this.applications[appId] && this.applications[appId].name;
        };

        $window.addEventListener("orientationchange", function(e) {
            refreshPromotions();
        });

        $window.addEventListener("resize", function() {
            if (UserAgent.isAWJadeMobile()) {
                refreshPromotions();
            }
        });

        function refreshPromotions() {
            $scope.$apply(function() {
                vm.refresh = false;
                $timeout(function() {
                    vm.refresh = true;
                }, 200);
            });
        }

        function initialise(e) {
            var cardWidth = e.target.clientWidth / e.item.count;
            vm.promotionWidth = promotionWidth + 'px';
            var padding = e.item.count === 1 ? 20 : 15;
            if (promotionWidth <= cardWidth) {
                vm.promotionWidth = (cardWidth - padding) + 'px';
                this.destroy();
                angular.element(e.target).addClass('off');
            } else {
                this.refresh();
            }
        }

        vm.isVirtualAppEnabled = function(appId) {
          return UtilService.hideVirtualApps() && this.applications[appId] &&
              appId.indexOf('Virtual') !== -1;
        };
    }],
    controllerAs: 'appPromotionsCtrl'
});

