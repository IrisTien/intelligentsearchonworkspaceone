appCenter.component('appList', {
    template: '<div ng-include="\'app-v2/components/appList/\' + appListCtrl.templateUrl">',
    controllerAs: 'appListCtrl',
    controller: ['$stateParams', '$state', '$scope', 'AppsService', '$filter', 'CatalogService', 'UserAgent', 'PAGING', '$transitions',
        function($stateParams, $state, $scope, AppsService, $filter, CatalogService, UserAgent, PAGING, $transitions) {
            var vm = this;
            var index = 0;
            vm.visibleApps = [];
            vm.appList = [];
            vm.isLoading = false;
            vm.scrollDisabled = false;

            vm.favoriteEnabled = !AppsService.loadFromDbFailed;
            this.templateUrl = UserAgent.isAWJadeMobile() ? 'appList.html' : 'appListBrowser.html';

            vm.isAWJadeDesktop = UserAgent.isAWJadeDesktop();

            var appListLabels = {
                favorite: $filter('i18n')('hub.apps.favorites'),
                all: $filter('i18n')('myapp.nav.allApps'),
                Web: $filter('i18n')('myapp.nav.webApps'),
                Virtual: $filter('i18n')('myapp.nav.virtualApps'),
                Native: $filter('i18n')('myapp.nav.mobileApps'),
                category: decodeURIComponent($stateParams.category)
            };

            if (UserAgent.isMacJade()) {
                appListLabels.Native = $filter('i18n')('myapp.nav.macApps');
            } else if (UserAgent.isWindowsJade() && UserAgent.isAWJadeDesktop()) {
                appListLabels.Native = $filter('i18n')('myapp.nav.windowsApps');
            }

            vm.appListLabel = appListLabels[$stateParams.type];
            vm.getNextPage = function() {
                if (vm.appList.length) {
                    var endIndex = index + PAGING.PAGE_SIZE;
                    while (index < endIndex && index < vm.appList.length) {
                        vm.visibleApps.push(vm.appList[index]);
                        index++;
                    }
                }
            };
            if ($stateParams.type === 'newApps') {
                vm.appList = AppsService.getNewApps()
                    .then(function(data) {
                        vm.appList = data;
                        vm.getNextPage();
                    });
                vm.appListLabel = $filter('i18n')('hub.apps.newApps');
            } else if ($stateParams.type !== 'category') {
                vm.appList = AppsService.getAppList($stateParams.type);
                vm.getNextPage();
            } else {
                var category = CatalogService.getAllCategory();
                CatalogService.setSelectedCategory(_.find(category, 'name', $stateParams.category));
                vm.isLoading = true;
                AppsService.getAppList($stateParams.type)
                    .then(function(data) {
                        vm.appList = data;
                        vm.isLoading = false;
                        vm.getNextPage();
                    });
            }

            var updateAppStatus = function(app, status) {
                for (var i in vm.appList) {
                    if (vm.appList[i].appId === app.appId) {
                        vm.appList[i].installStatus = status;
                        vm.appList[i].statusCode = CatalogService.getAppStatusCode(status);
                        break;
                    }
                }
            };

            var bookmarkApp = function(app) {
                if ($stateParams.type === 'favorite') {
                    if (app.favorite) {
                        vm.visibleApps.unshift(app);
                    } else {
                        vm.visibleApps = _.reject(vm.visibleApps, function(el) {
                            return el.appId === app.appId;
                        });
                    }
                }
            };

            vm.hubListGoToDetails = function(appId) {
                $state.go('apps.list.details', {
                    appId: appId,
                    params: {
                        param1: 'nativenav=Hide'
                    }
                });
            };

            vm.goToApps = function() {
                $state.go('apps');
            };

            $scope.$on('app-bookmarked', function(event, app) {
                bookmarkApp(app);
            });

            $scope.$on('native-bridge-app-bookmarked', function(event, app) {
                var entitlements = AppsService.getEntitlements();
                var entitlement = _.find(entitlements, {'appId': app.appId});
                entitlement.favorite = app.favorite;
                bookmarkApp(entitlement);
                $scope.$apply();
            });

            $scope.$on('app-status-change', function(event, args) {
                var entitlements = AppsService.getEntitlements();
                _.find(entitlements, {'appId': args.app.appId}).installStatus = args.status;
                AppsService.setEntitlements(entitlements);
                vm.appList = AppsService.getAppList($stateParams.type);
                updateAppStatus(args.app, args.status);
            });

            //IOS - prevent this page to scroll in when foreground page scroll
            $transitions.onStart({to: 'apps.list.**', from: 'apps.list.**'}, function(transition) {
                if (transition.to().name !== 'apps.list') {
                    vm.scrollDisabled = true;
                } else {
                    vm.scrollDisabled = false;
                }
            });
        }]
});
