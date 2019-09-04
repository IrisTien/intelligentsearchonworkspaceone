
(function(module) {
    'use strict';

    module.service('SearchService', [function() {
        var service = this;
        var searchQueryAndResults;

        service.setSearchQueryAndResults = function(searchQueryAndResults) {
            this.searchQueryAndResults = searchQueryAndResults;
        };
        service.getSearchQueryAndResults = function() {
            return this.searchQueryAndResults;
        };
        service.clearSearchQueryAndResults = function() {
            this.searchQueryAndResults = undefined;
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
