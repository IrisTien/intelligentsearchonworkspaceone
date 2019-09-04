(function(module) {
    'use strict';

    module.service('EventsService', ['Resource', 'ConfigService', function(Resource, ConfigService){
        var eventsService = this;

        eventsService.getEvents = function () {
            return ConfigService.getEventsUrl().then(function(url){
                return Resource(url, {
                    headers: {'Accept': 'application/hal+json', 'method': 'GET'}
                }).get();
            });
        };

        eventsService.addEvent = function (action, appId) {
            return ConfigService.getEventsUrl().then(function(url){
                return Resource(url, {
                    headers: {'Content-Type': 'application/hal+json', 'method': 'POST'}
                }).postResource('{"action": "' + action + '", "eventData": { "appId" : "' + appId + '"}}');
            });
        };


    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
