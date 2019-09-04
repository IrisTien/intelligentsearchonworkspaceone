// (c) 2014 VMware, Inc.  All rights reserved.
angular.module('com.vmware.greenbox.appCenter').factory('PollingService', ['$q', '$http', '$interval', 'POLLING_INTERVALS',
    function($q, $http, $interval, POLLING_INTERVALS) {
        'use strict';
        var currentlyRunningRequest = {};
        var timeOutSeconds = POLLING_INTERVALS.TIMEOUT_SECONDS;
        var startTimes = {};

        function stop(appId) {
            if (currentlyRunningRequest[appId]) {
                $interval.cancel(currentlyRunningRequest[appId].timer);
                delete currentlyRunningRequest[appId];
                delete startTimes[appId];
            }
        }

        function start(appId, userTimer) {
            var pollingTimeInterval = POLLING_INTERVALS.START_POLLING_TIME_INTERVAL; // pooling interval
            var deferred = $q.defer();
            if (userTimer) {
                pollingTimeInterval = _.get(currentlyRunningRequest[appId], 'time', pollingTimeInterval);
            }
            //stop any previous calls
            stop(appId);

            var getData = function() {
                $http.get('/catalog-portal/services/api/apps/' + appId).then(
                    function(data) {
                        var status = _.get(data, 'data.installStatus', '');
                        var appStateReason = _.get(data, 'data.appStateReason', '');
                        var approvalRequiredForMdmApp = _.get(data, 'data.approvalRequiredForMdmApp', '');
                        var intervals = pollingTimeInterval;
                        if (currentlyRunningRequest[appId] && currentlyRunningRequest[appId].time >= 0) {
                            intervals = ++currentlyRunningRequest[appId].time;
                        }
                        if (hasTimedOut()) {
                            stop(appId);
                            deferred.reject('Timed out');
                        } else if ((status === 'ACTIVATED' || status === 'NOT_ACTIVATED' ||
                            (currentlyRunningRequest[appId] && status === 'PROCESSING' && !appStateReason && approvalRequiredForMdmApp))) {
                            deferred.resolve(data);
                        } else {
                            currentlyRunningRequest[appId] = {
                                timer: $interval(getData, incrementer(intervals) * 1000, 1),
                                time: intervals
                            };
                        }
                    }, function(error) {
                        deferred.reject(error);
                    }
                );
            };

            //start pool for appId
            setTimeout(function() {
                if (!startTimes[appId]) {
                    startTimes[appId] = new Date().getTime();
                }
                getData();
            }, incrementer(pollingTimeInterval) * 1000);

            var hasTimedOut = function() {
                var endTime = new Date().getTime();
                return (endTime - startTimes[appId]) > timeOutSeconds;
            };

            return deferred.promise;
        }

        function incrementer(n) {
            return n * 3;
        }

        return {
            start: start,
            stop: stop
        };
    }]);
