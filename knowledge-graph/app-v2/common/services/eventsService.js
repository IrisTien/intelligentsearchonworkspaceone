(function(module) {
    'use strict';

    module.service('EventsService', ['Resource', 'ConfigService', '$q',
        function(Resource, ConfigService, $q) {
        var eventsService = this;

        eventsService.getEvents = function() {
            return ConfigService.getEventsUrl().then(function(url) {
                return Resource(url, {
                    headers: {
                        'Accept': 'application/vnd.vmware.catalog.user.event-get-all-v1-hal+json',
                        'method': 'GET'
                    }
                }).get();
            });
        };

        eventsService.addEvent = function(action, appId) {
            return ConfigService.getEventsUrl().then(function(url) {
                return Resource(url, {
                    headers: {
                        'Content-Type': 'application/vnd.vmware.catalog.user.event-create-v1+json',
                        'Accept': 'application/vnd.vmware.catalog.user.event-create-confirmation-v1-hal+json',
                        'method': 'POST'
                    }
                }).postResource('{"action": "' + action + '", "eventData": { "appId" : "' + appId + '"}}');
            });
        };

        eventsService.addHubEventWithUrl = function(action, appId) {
            return ConfigService.getEventsUrl().then(function(url) {
                return Resource(url, {
                    headers: {
                        'Content-Type': 'application/vnd.vmware.catalog.user.event-create-v1+json',
                        'Accept': 'application/vnd.vmware.catalog.user.event-create-confirmation-v1-hal+json',
                        'method': 'POST'
                    }
                }).postResource('{"action": "' + action + '", "eventData": { "appId" : "' + appId + '", "url": "' + location.hash + '"}}');
            });
        };

        eventsService.deleteEvent = function(eventId) {
            return ConfigService.getEventsUrl().then(function(url) {
                return Resource(url + '/' + eventId, {
                    headers: {'method': 'DELETE'}
                }).deleteResource();
            });
        };

        eventsService.deleteAllEvents = function() {
            return ConfigService.getEventsUrl().then(function(url) {
                return Resource(url, {
                    headers: {'method': 'DELETE'}
                }).deleteResource();
            });
        };

        eventsService.getEventsOfType = function(eventType) {
            return eventsService.getEvents()
                .then(function(events) {
                    var defer = $q.defer();
                    var filteredEvents = _.filter(events, function(event) {
                        return event.action == eventType;
                    });
                    defer.resolve(filteredEvents);
                    return defer.promise;
                });
        };

        eventsService.filterEventsByType = function(events, eventType) {
            var filteredEvents = _.filter(events, function(event) {
                return event.action == eventType;
            });
            return filteredEvents;
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
