(function(module) {
    'use strict';

    module.service('PeopleSearchService', [function() {
        var service = this;
        service.recentVisitedUsers = [];

        service.setSearchQueryAndResults = function(searchQueryAndResults) {
            this.searchQueryAndResults = searchQueryAndResults;
        };
        service.getSearchQueryAndResults = function() {
            return this.searchQueryAndResults;
        };
        service.clearSearchQueryAndResults = function() {
            this.searchQueryAndResults = [];
        };
        service.setRecentVisitedUser = function(users) {
            this.recentVisitedUsers = users;
        };
        service.addRecentVisitedUser = function(user) {
            if (this.recentVisitedUsers.length) {
                var index = _.findIndex(this.recentVisitedUsers, {id: user.id});
                if (index < 0) {
                    this.recentVisitedUsers.splice(0, 0, user);
                } else {
                    this.recentVisitedUsers.splice(index, 1);
                    this.recentVisitedUsers.unshift(user);
                }

                if (this.recentVisitedUsers.length > 6) {
                    this.recentVisitedUsers.splice(-1, 1);
                }
            } else {
                this.recentVisitedUsers.push(user);
            }
        };
        service.getRecentVisitedUser = function() {
            return this.recentVisitedUsers || [];
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
