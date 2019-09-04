(function(module) {
    'use strict';

    module.controller('PeopleSearchController',
        ['PeopleService',
            '$timeout',
            '$scope',
            '$element',
            'PeopleSearchService',
            'UserAgent',
            '$rootScope',
            '$state',
            'UtilService',
            'ClientRuntimeService',
            function(PeopleService,
                     $timeout,
                     $scope,
                     $element,
                     PeopleSearchService,
                     UserAgent,
                     $rootScope,
                     $state,
                     UtilService,
                     ClientRuntimeService) {
                var vm = this;
                vm.innerControl = vm.control || {};
                var MIN_SEARCH_CHARS = 3;
                vm.recentVisitedUser = [];
                vm.isLoading = false;
                vm.showScrim = false;

                var getFirstPageTimeout;

                function init() {
                    vm.users = [];

                    vm.query = {
                        name: ''
                    };

                    var searchObj = PeopleSearchService.getSearchQueryAndResults();

                    if (searchObj && searchObj.query) {
                        vm.query.name = searchObj.query;
                    }

                    if (searchObj && searchObj.result) {
                        vm.users = searchObj.result;
                    }
                }

                vm.onSearch = function() {
                    var query = vm.query.name;
                    vm.noResults = false;
                    vm.reqChars = false;
                    vm.showScrim = true;

                    vm.recentVisitedUser = PeopleSearchService.getRecentVisitedUser();

                    if ((query.length > 0 && query.length < MIN_SEARCH_CHARS) || (query.length === 0 && vm.recentVisitedUser.length === 0)) {
                        vm.reqChars = true;
                        vm.users = [];
                    } else if (query.length === 0 && vm.recentVisitedUser.length > 0) {
                        // Needs to empty the users array to prevent users list and recent list shown together
                        vm.users = [];
                    }

                    if (query.length >= MIN_SEARCH_CHARS) {
                        vm.reqChars = false;
                        vm.recentVisitedUser = [];
                        vm.isLoading = true;

                        if (getFirstPageTimeout) {
                            $timeout.cancel(getFirstPageTimeout);
                        }
                        getFirstPageTimeout = $timeout(function() {
                            PeopleService.getFirstPage({searchText: query}, false).then(function(response) {
                                if (response.users) {
                                    vm.users = PeopleService.getUsers(response.users);
                                }
                                vm.noResults = response.totalResults === 0;
                                vm.isLoading = false;
                            }, function(err) {
                                vm.isLoading = false;
                                // Ideally should give out some kind of message to user to inform them there is error fetch data from the server
                            });
                        }, 500);
                    } else if (getFirstPageTimeout) {
                        $timeout.cancel(getFirstPageTimeout);
                        // When user started a search (query.name exceeds 3 characters, then using the back key to erase the query, need to reset the isLoading to false
                        vm.isLoading = false;
                    }

                    // for hub mobile browser/desktopapp, needs to disable scroll on the content-container while search is on
                    $rootScope.$broadcast('hub-browser-people-search-on');
                };

                $scope.$watch('ctrl.isActive', function(isActive) {
                    if (isActive) {
                        vm.users = [];
                        vm.onSearch();
                        $element.find('input').focus();
                    }
                });

                vm.innerControl.clearSearch = function() {
                    closeSearch();
                };

                vm.clearText = function() {
                    vm.query.name = '';
                    vm.users = [];
                    vm.onSearch();
                };

                vm.clearSearch = function() {
                    vm.reqChars = false;
                    vm.showScrim = false;
                    vm.users = [];
                    vm.query.name = '';
                    vm.recentVisitedUser = PeopleSearchService.getRecentVisitedUser();
                    vm.recentVisitedUser = [];
                };

                vm.userDetails = function(user) {
                    PeopleSearchService.clearSearchQueryAndResults();
                    closeSearch();
                    $state.go('people.details', {
                        userId: encodeURIComponent(user.id)
                    });
                };

                vm.closeOnBlur = function() {
                    $rootScope.$emit('people-search-field-on', false);
                    closeSearch();
                };

                function closeSearch() {
                    vm.clearSearch();
                    $element.find('input').blur();
                    // for hub mobile browser/desktopapp, needs to disable scroll on the content-container while search is on
                    $rootScope.$broadcast('hub-browser-people-search-off');
                }

                //navigating to other page, close search if open
                $rootScope.$on('$stateChangeStart', function() {
                    closeSearch();
                });

                vm.goBack = function() {
                    UtilService.goBack();
                };

                init();
            }]);
})(angular.module('com.vmware.greenbox.appCenter'));
