(function(module) {
    'use strict';
    module.service('PeopleService',
        ['Resource',
        'ConfigService',
        'LocalStorageConstants',
        'HttpProxyService',
        function(Resource,
                 ConfigService,
                 LocalStorageConstants,
                 HttpProxyService) {
            this.getFirstPage = function(peopleSearchContext) {
                return ConfigService.getPeopleUrl().then(function(url) {
                    var response = {};
                    var peopleSearchUrl = url.replace("{userFilter}", peopleSearchContext.searchText);
                    var request = Resource(peopleSearchUrl, {
                        headers: {'Accept': 'application/vnd.vmware.catalog.user-hal+json', 'method': 'GET'}
                    });
                    return request.get().then(function(peopleResponse) {
                        response.totalResults = peopleResponse.totalResults;
                        response.itemsPerPage = peopleResponse.itemsPerPage;
                        response.users = peopleResponse.userResources;
                        return response;
                    });
                });
            };

            this.getUsers = function(userList) {
                var finalUserList = [];
                var that = this;
                if (userList) {
                    finalUserList = _.map(userList, function(user) {
                        return that.constructUserObj(user);
                    });
                }
                return finalUserList;
            };

            this.constructUserObj = function(user) {
                return {
                    id: user.id,
                    userName: user.firstName + " " + user.lastName,
                    initial: this.getInitial(user),
                    title: user.title,
                    email: user.emailAddress,
                    avatar: user.imageURL,
                    userDetailUrl: _.find(user.links, {'rel': 'userDetails'}) ? _.find(user.links, {'rel': 'userDetails'}).href : '',
                    isCopied: false
                };
            };

            this.getInitial = function(user) {
                return _.get(window, 'workspaceOne.language', '') === 'en' ? _.get(user, 'firstName[0]', '') + _.get(user, 'lastName[0]', '') : '';
            };

            this.getAddress = function(user) {
                return [user.address, user.locality, user.region, user.postalCode, user.country].filter(Boolean).join(", ");
            };

            this.getOrgHierarchy = function(orgHierarchyUrl, type) {
                var request = HttpProxyService.get(LocalStorageConstants[type], orgHierarchyUrl,
                    {
                        headers: {
                            'Accept': 'application/vnd.vmware.catalog.user-hal+json',
                            'method': 'GET'
                        }
                    });

                return request.then(function(peopleResponse) {
                    var response = {};
                    response.directReports = peopleResponse.directReportUsers ? peopleResponse.directReportUsers : [];
                    response.managers = peopleResponse.managementHierarchyUsers ? peopleResponse.managementHierarchyUsers : [];
                    return response;
                });
            };

            this.getUserOrgHierarchy = function(orgHierarchyUrl) {
                var request = Resource(orgHierarchyUrl, {
                    headers: {'Accept': 'application/vnd.vmware.catalog.user-hal+json', 'method': 'GET'}
                });
                return request.get().then(function(peopleResponse) {
                    var response = {};
                    response.directReports = peopleResponse.directReportUsers ? peopleResponse.directReportUsers : [];
                    response.managers = peopleResponse.managementHierarchyUsers ? peopleResponse.managementHierarchyUsers : [];
                    return response;
                });
            };

            this.getUserDetails = function(userId) {
                return ConfigService.getUserDetailsUrl().then(function(url) {
                    var detailsUrl = url.replace("{userId}", userId);
                    var request = Resource(detailsUrl, {
                        headers: {'Accept': 'application/vnd.vmware.catalog.user-hal+json', 'method': 'GET'}
                    });
                    return request.get().then(function(response) {
                        return response;
                    });
                });
            };

            this.getVisitedUsers = function() {
                return ConfigService.getVisitedUsersUrl().then(function(url) {
                    var request = Resource(url, {
                        headers: {'Accept': 'application/vnd.vmware.catalog.user-hal+json', 'method': 'GET'}
                    });
                    return request.get().then(function(response) {
                        return _.get(response, 'userResources', []);
                    });
                });
            };
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
