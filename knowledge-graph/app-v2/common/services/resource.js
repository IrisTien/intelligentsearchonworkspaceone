// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    'use strict';
//TODO: Make it a provider
    module.factory('Resource', ['$http', '$q', '$timeout', 'UtilService', function($http, $q, $timeout, UtilService) {
        // short cuts
        var isArray = angular.isArray;
        var extend = angular.extend;
        var forEach = angular.forEach;
        var copy = angular.copy;

        function ResourceFactory(url, config) {
            // Offset from UTC in minutes.  Positive offsets are ahead of GMT.
            var timezoneOffset = -(new Date()).getTimezoneOffset();
            var mockPromise = function(context) {
                if (context.mockData) {
                    var _this = context;
                    return $timeout(
                        function() {
                            return _this.mockData;
                        }, 0);
                }
            };

            var Resource = function(url, config) {
                Resource.prototype.self = url;
                Resource.prototype.config = extend({
                    transformRequest: function(data, getHeaders) {
                        if (UtilService.isFormData(data)) {
                            // If Content-Type added explicitly , browser will not add form-data boundary parameter.
                            // Keep Content-Type undefined so that browser will add automatically with form data boundary.
                            getHeaders()['Content-Type'] = undefined;
                            return data;
                        } else {
                            return angular.isObject(data) && !isFile(data) ? angular.toJson(data) : data;
                        }
                    }
                }, (config || {}));
                Resource.prototype.config.headers = extend({
                    'User-UTC-Offset': timezoneOffset
                }, (config && config.headers ? config.headers : {}));
            };

            //Instance method that performs HTTP GET on given URL
            Resource.prototype = {
                'mock': function(mockData) {
                    this.mockData = mockData;
                    return this;
                },

                'get': function() {
                    var deferred = $q.defer();
                    var getPromise = deferred.promise;
                    var thisResource = this; //The resource object itself
                    var getLink = function(resource, link) {
                        if (resource._links[link]) {
                            return resource._links[link].href;
                        } else {
                            return null;
                        }
                    };
                    var getDefaultParamsForLink = function(resource, link) {
                        if (resource._links[link].params) {
                            return copy(resource._links[link].params);
                        } else {
                            return {};
                        }
                    };
                    var extendedPromise = { // This allows to perform method chaining on promise object instead of passing pyramid of callbacks
                        'thenGetLink': function(link) {
                            var deferredInner = $q.defer();
                            var thenGetLinkPromise = extend(deferredInner.promise, extendedPromise);
                            // This points to promise object returned by get()
                            this.then(function(resource) {
                                deferredInner.resolve(getLink(resource, link));
                            });
                            return thenGetLinkPromise;
                        },
                        // This method will follow the link defined on top level resource
                        'thenFollowLink': function(link, mediaType, params, locale, optional) {
                            var deferredInner = $q.defer();
                            var thenFollowLinkPromise = extend(deferredInner.promise, extendedPromise);
                            // This points to promise object returned by get()
                            this.then(function(resource) {
                                var linkToFollow = getLink(resource, link);
                                // Do the get only if there is the link to follow was valid
                                if (linkToFollow) {
                                    // Get default params from link to follow
                                    var defaultParams = getDefaultParamsForLink(resource, link);
                                    // Use default params only when explicit params have not been specified
                                    var paramsToSend = params || defaultParams || {};
                                    var childRes = new Resource(
                                        linkToFollow, {
                                            'headers': {
                                                'Accept': mediaType
                                            },
                                            'params': UtilService.isEmpty(paramsToSend) ? null : paramsToSend
                                        }
                                    );
                                    if (locale) {
                                        childRes = new Resource(
                                            linkToFollow, {
                                                'headers': {
                                                    'Accept': mediaType,
                                                    'Accept-Language': locale
                                                },
                                                'params': UtilService.isEmpty(paramsToSend) ? null : paramsToSend
                                            });
                                    }

                                    if (optional && optional.contentType) {
                                        childRes.config.headers['Content-Type'] = optional.contentType;
                                    }
                                    if (optional && optional.data) {
                                        childRes.data = optional.data;
                                    }
                                    if (resource.mockData) {
                                        childRes.mock(resource.mockData);
                                    }
                                    childRes.get().then(function(childResource) {
                                        deferredInner.resolve(childResource);
                                    });
                                }
                            });
                            return thenFollowLinkPromise;
                        },
                        //This method will fetch an attribute of top level resource
                        'thenGet': function(attr, defaultObject) {
                            var deferredInner = $q.defer();
                            var thenGetPromise = extend(deferredInner.promise, extendedPromise);
                            //this points to promise object returned by get
                            this.then(function(resource) {
                                if (resource === undefined || resource[attr] === undefined) {
                                    //if link is not present then reject, so API call is not made with empty URL
                                    deferredInner.resolve(defaultObject);
                                } else {
                                  deferredInner.resolve(resource[attr]);
                                }
                            });
                            return thenGetPromise;
                        },
                        // This method loads all the items of top level summary resource
                        // attr points to array of links
                        'thenGetAllItems': function(attr, mediaType) {
                            var deferredInner = $q.defer();
                            //this points to promise object returned by get
                            var _this = this;
                            this.thenGet('items').then(function(links) {
                                if (!angular.isArray(links)) {
                                    deferredInner.resolve([]);
                                    return;
                                }
                                var promises = [];
                                var childResources = [];
                                for (var i = 0; i < links.length; i++) {
                                    var childRes = new Resource(getLink(links[i], attr), {'headers': {'Accept': mediaType}});
                                    if (_this.mockData && isArray(_this.mockData) && _this.mockData.length === links.length) {
                                        childRes.mock(_this.mockData[i]);
                                    } else if (_this.mockData) {
                                        childRes.mock(_this.mockData);
                                    }
                                    promises.push(childRes.get());
                                    promises[i].then(function(childResource) {
                                        childResources.push(childResource);
                                    });
                                }
                                //Wait for all the get to finish before calling promise
                                $q.all(promises).then(function() {
                                    deferredInner.resolve(childResources);
                                });
                            });
                            return deferredInner.promise;
                        }
                    };

                    var successHandler = function(response) {
                        if (isArray(response.data)) {
                            thisResource.array = [];
                            deferred.resolve(extend(thisResource.array, response.data));
                        } else {
                            deferred.resolve(extend(thisResource, response.data));
                        }
                    };

                    var errorHandler = function(data, status, headers, config) {
                        deferred.reject(data);
                    };

                    if (this.mockData) {
                        var _this = this;
                        $timeout(function() {
                            successHandler(_this.mockData);
                        }, 0);
                    } else if (this.data) {
                        $http.post(ensureContext(this.self), this.data, this.config).then(successHandler);
                    } else {
                        $http.get(this.self, this.config).then(successHandler, errorHandler);
                    }

                    return extend(getPromise, extendedPromise);
                },

                //Instance method that looks for url property and creates a new resource out of it.
                //TODO: This would change once we redesign HATEOAS links in our REST resources
                'getResource': function(resourceId, config) {
                    var resourceUrls = this[resourceId + '_url'];
                    if (isArray(resourceUrls)) {
                        var resources = [];
                        forEach(resourceUrls, function(resourceUrl) {
                            resources.push(new Resource(resourceUrl, (config || {})));
                        });
                        return resources;
                    }
                    return new Resource(resourceUrls);
                },

                'postResource': function(data) {
                    return this.mockData ? mockPromise(this) : $http.post(this.self, data, this.config);
                },
                'deleteResource': function() {
                    return this.mockData ? mockPromise(this) : $http['delete'](this.self, this.config);
                },

                'putResource': function(data) {
                    return this.mockData ? mockPromise(this) : $http.put(this.self, data, this.config);
                },
                'patchResource': function(data) {
                    return this.mockData ? mockPromise(this) : $http.patch(this.self, data, this.config);
                }

            };
            return new Resource(url, config);
        }

        return ResourceFactory;
    }]);
})(angular.module('com.vmware.workspace.services.rest', []));
