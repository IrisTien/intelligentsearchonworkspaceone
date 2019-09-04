(function(module) {
    'use strict';

    module.controller('PeopleController', [
        'TenantCustomizationService',
        'UtilService',
        'PeopleService',
        'SettingsService',
        '$rootScope',
        '$state',
        '$scope',
        'UserAgent',
        'hznLocalStorage',
        'PeopleSearchService',
        'HttpProxyService',
        function(TenantCustomizationService,
                 UtilService,
                 PeopleService,
                 SettingsService,
                 $rootScope,
                 $state,
                 $scope,
                 UserAgent,
                 hznLocalStorage,
                 PeopleSearchService,
                 HttpProxyService) {
            var vm = this;
            vm.collapsible = UserAgent.isMobile() && UserAgent.isPhone();
            var appCenterCtrl = $scope.appCenterCtrl || $scope.$parent.appCenterCtrl;
            appCenterCtrl.searchFieldOn = true;
            vm.scrollDisabled = false;
            this.templateUrl = UtilService.loadTemplateForPlatform('people.html', 'peopleDesktop.html', 'peopleBrowser.html');

            // Because of the localStorage is one domain one origin, apps with nativenav enabled will have shared local storage on multiple webview, do not save it
            // If it is inside the WS1 app which the people tab will go directly to "#/people" instead, otherwise the apps page (which go to #/index) will keep loading people
            // Nativenav on iOS and Android load multiple webview simultaneously, so the the people controller will be Instantialized;
            var customizationSettings = TenantCustomizationService.getCustomizationSettings();
            if (UtilService.isNativeNavNotEnabled(customizationSettings)) {
                hznLocalStorage.last_active_page_v2 = "people";
            }

            function init() {
                vm.emptyFillers = [1, 2, 3, 4, 5, 6];
                vm.directReports = [];
                vm.managers = [];
                vm.peers = [];
                vm.visitedUsers = [];
                vm.visistedUserLoaded = false;
                vm.active = false;
                vm.isLoading = false;
                startLoading(false);
                getVisitedUsers();
                loadMyTeam();
            }

            function loadMyTeam(refresh) {
                startLoading(refresh);
                return getLoggedInUserDetails().then(function(user) {
                    vm.userId = user.id;
                    var orgHierarchyUrl = _.get(user._links, 'orgHierarchy.href', undefined);
                    if (orgHierarchyUrl) {
                        loadOrgHierarchy(orgHierarchyUrl, refresh);
                    } else {
                        doneLoading(refresh);
                    }
                }, function() {
                    doneLoading(refresh);
                });
            }

            function getVisitedUsers() {
                return PeopleService.getVisitedUsers().then(function(visitedUser) {
                    var users = PeopleService.getUsers(visitedUser);
                    PeopleSearchService.setRecentVisitedUser(users);
                    vm.visistedUserLoaded = true;
                });
            }

            function startLoading(refresh) {
                if (!refresh) {
                    vm.isLoading = true;
                }
            }

            function doneLoading(refresh) {
                if (!refresh) {
                    vm.isLoading = false;
                }
            }

            var getLoggedInUserDetails = function() {
                return SettingsService.getUserInfo().then(function(user) {
                    return user;
                });
            };

            var loadOrgHierarchy = function(orgHierarchyUrl, refresh) {
                PeopleService.getOrgHierarchy(orgHierarchyUrl, 'PEOPLE_DIRECTS_DETAILS').then(function(response) {
                    vm.directReports = PeopleService.getUsers(response.directReports);
                    var manager = _.take(response.managers);
                    vm.managers = PeopleService.getUsers(manager);
                    var immediateManager = _.head(manager);
                    if (immediateManager) {
                        loadUserPeers(immediateManager);
                    } else {
                        doneLoading(refresh);
                    }
                }, function() {
                    doneLoading(refresh);
                });
            };

            var loadUserPeers = function(manager, refresh) {
                var orgHierarchyUrl = _.find(manager.links, {'rel': 'orgHierarchy'}).href;
                PeopleService.getOrgHierarchy(orgHierarchyUrl, 'PEOPLE_PEER_DETAILS', refresh).then(function(response) {
                    var peerList = PeopleService.getUsers(response.directReports);
                    vm.peers = _.filter(peerList, function(user) {
                        return user.id !== vm.userId;
                    });
                    doneLoading(refresh);
                }, function() {
                    doneLoading(refresh);
                });
            };
            init();

            vm.userDetails = function(user) {
                $state.go('people.details', {
                    userId: encodeURIComponent(user.id)
                });
            };

            $scope.$on('Desktop-People-Refresh', function() {
                vm.clearCache();
            });

            vm.clearCache = function() {
                HttpProxyService.clearPeopleSearch();
                return loadMyTeam(true);
            };

            // For Hub Browser, the search is part of the people landing, not a different url
            $rootScope.$on('hub-browser-people-search-on', function() {
                vm.scrollDisabled = true;
            });

            $rootScope.$on('hub-browser-people-search-off', function() {
                vm.scrollDisabled = false;
            });
        }
    ]);
})(angular.module("com.vmware.greenbox.appCenter"));
