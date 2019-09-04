(function(module) {
    'use strict';
    module.controller('UserDetailsController', [
        '$scope',
        '$rootScope',
        'PeopleService',
        'SettingsService',
        '$state',
        'UtilService',
        '$timeout',
        'CopyToClipboardService',
        '$window',
        'ClientRuntimeService',
        'ProgressIndicatorService',
        'UserAgent',
        '$filter',
        'PeopleSearchService',
        function($scope,
                 $rootScope,
                 PeopleService,
                 SettingsService,
                 $state,
                 UtilService,
                 $timeout,
                 CopyToClipboardService,
                 $window,
                 ClientRuntimeService,
                 ProgressIndicatorService,
                 UserAgent,
                 $filter,
                 PeopleSearchService) {
            var vm = this;
            vm.isScrolled = false;
            vm.isLoading = false;
            vm.appCenterCtrl = $scope.appCenterCtrl || {};
            vm.copyEmailFieldOn = false;
            vm.isProfile = true;
            vm.directReportsToogle = true;
            vm.managerToggle = true;
            vm.isIE = UserAgent.isIE();
            vm.linksSupported = UserAgent.isNativeAppVersionIsEqualOrAbove('3.3') || UserAgent.isBrowser();
            // Do not use the nativeEmail for hub macapp v1 as the client side has not implemented it yet, the current macapp version is 9.1 so need to exclude the mac
            vm.nativeEmailClientSupported = UserAgent.isNativeAppVersionIsEqualOrAbove('3.3') && !UserAgent.isMac();
            vm.copyEmailSupported = UtilService.copyEmailSupported();
            vm.appCenterCtrl.searchFieldOn = false;
            vm.isBrowser = UserAgent.isBrowser();

            this.isAWJadeDesktop = UserAgent.isAWJadeDesktop();
            this.templateUrl = UserAgent.isAWJadeMobile() ? 'peopleDetail.html' : 'peopleDetailBrowser.html';

            // Added for hub
            vm.isIOS = UserAgent.isIOS();

            function init() {
                vm.userId = $state.params.userId;
                getUserDetails(vm.userId);
            }

            function startLoading() {
                vm.isLoading = true;
            }

            function doneLoading() {
                vm.isLoading = false;
            }

            var getUserDetails = function(userId) {
                startLoading();
                PeopleService.getUserDetails(userId).then(function(response) {
                    vm.user = response;
                    vm.user.initial = PeopleService.getInitial(vm.user);
                    vm.user.address = PeopleService.getAddress(vm.user);
                    PeopleSearchService.addRecentVisitedUser(PeopleService.constructUserObj(vm.user));
                    loadOrgHierarchy(vm.user);
                }, function() {
                    doneLoading();
                });
            };

            var loadOrgHierarchy = function(user) {
                vm.directReports = [];
                vm.managers = [];
                vm.peers = [];
                var orgUrl = _.find(user.links, {'rel': 'orgHierarchy'}).href;
                PeopleService.getUserOrgHierarchy(orgUrl).then(function(response) {
                    vm.directReports = PeopleService.getUsers(response.directReports);
                    vm.managers = PeopleService.getUsers(response.managers);
                    vm.managers.unshift(PeopleService.constructUserObj(vm.user));
                    doneLoading();
                });
            };

            vm.backBtnAction = function() {
                window.history.back();
            };

            vm.copyEmail = function(value) {
                var copyStatus = CopyToClipboardService.copy(value.emailAddress);
                if (copyStatus) {
                    value.isCopied = true;
                    $timeout(function() {
                        value.isCopied = false;
                    }, 3000);
                }
            };

            vm.openSocialUrl = function(value) {
                ClientRuntimeService.openUrl(value, 3); //3 means the url should always be opened in external browser. Refer JadeV2RuntimeService for other types
            };

            vm.toggleProfileTab = function() {
                vm.isProfile = !vm.isProfile;
            };

            vm.getManagerLabel = function() {
                var managerCount = vm.managerToggle ? vm.managers.length - 2 : vm.managers.length - 1;
                return managerCount > 1 ? managerCount + ' ' + $filter('i18n')('app.people.labels.managers') : managerCount + ' ' + $filter('i18n')('app.people.labels.manager');
            };

            vm.openEmail = function(emailAddress) {
                ClientRuntimeService.openEmail(emailAddress);
            };

            vm.openTel = function(phoneNumber) {
                ClientRuntimeService.openTel(phoneNumber);
            };

            vm.openSms = function(phoneNumber) {
                ClientRuntimeService.openSms(phoneNumber);
            };

            vm.openMaps = function(address) {
                if (UserAgent.isAWJadeMobile()) {
                    ClientRuntimeService.openMaps(address);
                } else {
                    ClientRuntimeService.openUrl("https://www.google.com/maps?q=" + address, 3); //3 means the url should always be opened in external browser. Refer JadeV2RuntimeService for other types
                }
            };

            // Hub specific functions
            vm.openSearch = function() {
                $state.go("people.search");
            };

            $scope.$on('Desktop-People-Details-Refresh', function() {
                init();
            });

            init();
        }]);
})(angular.module("com.vmware.greenbox.appCenter"));
