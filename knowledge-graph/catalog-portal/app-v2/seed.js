//TODO: Move services, appCenter, launcher components into different modules
// Define a new module for our app. The array holds the names of dependencies if any.
appCenter.factory('lodash', ['$window',
    function($window) {
        // place lodash include before angular
        return $window._;
    }
]);

//Retrieves or overrides whether to generate an error when a rejected promise is not handled.
//This feature is enabled by default.
appCenter.config(['$qProvider', function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

//angular 1.6.x adds ! in URL, we need to remove this for our routes to work correctly
appCenter.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix("");
}]);

//prevent pre-assignment bindings, we need to use $onInit in directive controller
appCenter.config(function($compileProvider) {
    $compileProvider.preAssignBindingsEnabled(true);
});

appCenter.config(['LocalizationProvider', '$injector', 'l10n_en', function(LocalizationProvider, $injector, l10n_en) {
    var l10n = $injector.has('l10n') ? $injector.get('l10n') : {};
    angular.extend(l10n_en, l10n);
    LocalizationProvider.setL10nMap(l10n_en);
}]);

//HammerJs Configuration
appCenter.config(['hammerDefaultOptsProvider', function(hammerDefaultOptsProvider) {
    //Setting up gestures that need to be recognized by HammerJs
    hammerDefaultOptsProvider.set({
        recognizers: [[Hammer.Press, {time: 500}]]//Minimum time to detect press as a hold event.
    });
}]);

appCenter.config(function($httpProvider) {
    var uccRetryCount = 0;
    var refreshingUccCookie = null;

    function notifyAndRefresh($notify, ConfigService, $timeout, $injector, entitlementRefreshMsg) {
        $notify.warning(entitlementRefreshMsg || 'api.session.expired.retry');
        ConfigService.doNotRefreshCache = true;
        if (!ConfigService.isReloading) {
            ConfigService.isReloading = true;
            $timeout(function() {
                var LocationReloadService = $injector.get('LocationReloadService');
                LocationReloadService.reload();
            }, 3000, false);
        }
    }

    function tryRenewingUserCatalogContext(ConfigService, $injector, $notify, $q, response, $timeout) {
        return ConfigService.refreshUserCatalogContextToken().then(function() {
            return $q.resolve();
        }, function() {
            //If refresh UCC renew call failed for some reason, notify session expired and refresh
            notifyAndRefresh($notify, ConfigService, $timeout, $injector);
        });
    }

    function checkisHZNAndRenewSession(ConfigService, $injector, $notify, $q, response, $timeout) {
        return ConfigService.apiAuthenticationVerify()
            .then(function(successResponse) {
                ConfigService.refreshingCookie = false;
            }, function(failureResponse) {
                if (failureResponse.status === 404 && uccRetryCount < 3) {//UCC is not valid, then try to renew it
                    //Increment ucc count
                    uccRetryCount++;
                    return tryRenewingUserCatalogContext(ConfigService, $injector, $notify, $q, response);
                } else if (uccRetryCount >= 3) {
                    uccRetryCount = 0;
                    var SignOutService = $injector.get('SignOutService');
                    SignOutService.continueSignOut();
                } else {//We get 401 if HZN is not valid, then notify and refresh
                    notifyAndRefresh($notify, ConfigService, $timeout, $injector);
                }
                ConfigService.refreshingCookie = false;
            });
    }

    var http401Interceptor = ['$q', '$notify', '$timeout', '$injector', 'LocalStorageConstants',
        function($q, $notify, $timeout, $injector, localStorageConstants) {
        return {
            'responseError': function(response) {
                var status = response.status;
                var ConfigService = $injector.get('ConfigService');
                var httpProxyService = $injector.get('HttpProxyService');
                var ClientRuntimeService = $injector.get('ClientRuntimeService');
                var UserAgent = $injector.get('UserAgent');
                var deferred = $q.defer();
                if (status === 401 && !ConfigService.isReloading) {
                    //If user context is missing or invalid
                    //first 401 will try to refresh the UCC cookie, any other UCC after that will be Queued
                    //because we use the same promise for all the subsequent 401
                    if (!refreshingUccCookie) {
                        refreshingUccCookie = checkisHZNAndRenewSession(ConfigService, $injector, $notify, $q, response, $timeout);
                    }
                    if (response.data && response.data.code && (response.data.code === "userContext.invalid" || response.data.code === "userContext.missing")) {
                        refreshingUccCookie.then(function() {
                            refreshingUccCookie = null;
                            $injector.get("$http")(response.config).then(function(resp) {
                                if (UserAgent.isHubApp()) {
                                    ClientRuntimeService.refreshUCC();
                                }
                                deferred.resolve(resp);
                            }, function() {
                                deferred.reject();
                            });
                        }, function() {
                            refreshingUccCookie = null;
                            deferred.reject();
                        });
                    } else {
                        //All other scenarios like HZN is expired or invalid
                        notifyAndRefresh($notify, ConfigService, $timeout, $injector);
                    }
                } else if (status === 403 || status === 409) {
                    if (response.data.code === "appId.not.found.incache") {
                            httpProxyService.clear(localStorageConstants.ENTITLEMENTS);
                            httpProxyService.clear(localStorageConstants.BOOKMARKS);
                            httpProxyService.clear(localStorageConstants.NEW_APP);
                            httpProxyService.clear(localStorageConstants.RECOMMENDED_APPS);
                            var currentHash = window.location.hash;
                            if (currentHash.indexOf('/details/') !== -1) {
                                window.history.back();
                            }
                            notifyAndRefresh($notify, ConfigService, $timeout, $injector, "api.entitlements.reload");
                        } else if (response.data.code !== "admin.terms.not.accepted") {
                        notifyAndRefresh($notify, ConfigService, $timeout, $injector);
                    }
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }

                return deferred.promise;
            }
        };
    }];

    var http412Interceptor = ['$q', '$notify', '$timeout', '$injector', 'JadeV2Scheme', 'HorizonClientScheme',
        function($q, $notify, $timeout, $injector, JadeV2Scheme, HorizonClientScheme) {
            return {
                'responseError': function(response) {
                    var status = response.status;
                    var ConfigService = $injector.get('ConfigService');
                    var UtilService = $injector.get('UtilService');
                    var UserAgent = $injector.get('UserAgent');
                    http412InterceptorHelper(status, $notify, $timeout, ConfigService, UserAgent, UtilService, JadeV2Scheme, HorizonClientScheme);
                    // otherwise
                    return $q.reject(response);
                }
            };
        }];

    //Prompt user if a 5xx error occurs.
    var http5xxInterceptor = ['$q', '$notify', function($q, $notify) {
        return {
            'responseError': function(response) {
                http5xxInterceptorHelper(response, $notify);
                return $q.reject(response);
            }
        };
    }];

    var timeoutInterceptor = ['$q', '$notify', '$injector', function($q, $notify, $injector) {
        return {

            'request': function(config) {
                var TIMEOUT_MILLIS = 120000;
                //For every new request set the retry attempt to 0. This variable serves as count of how many times
                //a request is retried.
                if (!config.retryAtempt) {
                    config.retryAtempt = 0;
                }
                if (!config.timeout) {
                    config.timeout = TIMEOUT_MILLIS;
                }
                return config || $q.when(config);
            },

            'responseError': function(response) {
                var MAX_RETRY = 3;
                var TIMEOUT_STATUS = 0;
                if (response.status === TIMEOUT_STATUS) {
                    if (response.config.retryAtempt < MAX_RETRY) {
                        response.config.retryAtempt++;
                        var $http = $injector.get('$http');
                        return $http(response.config);
                    } else {
                        $notify.warning('api.timeout');
                        return $q.reject(response);
                    }
                }
                return $q.reject(response);
            }
        };
    }];

    var httpCsrfInterceptor = ['$cookies', function($cookies) {
        return {
            'request': function(request) {
                if ($cookies.get('EUC_XSRF_TOKEN')) {
                    request.headers['X-XSRF-TOKEN'] = $cookies.get('EUC_XSRF_TOKEN');
                } else {
                    request.headers['X-XSRF-TOKEN'] = '';
                }
                return request;
            }
        };
    }];

    //implement sync call in angular
    var httpQueue = ['$q', function($q) {
        var queue = [];
        var syncEnabled = false;

        function executeTheQueuedCall() {
            syncEnabled = false;
            queue.shift();
            if (queue.length > 0) {
                queue[0]();
            }
        }

        return {
            request: function(config) {
                //queue only api calls not html and js files
                if ((syncEnabled || config.sync) && config.url.indexOf('.html') === -1) {
                    var deferred = $q.defer();
                    queue.push(function() {
                        deferred.resolve(config);
                    });

                    if (queue.length === 1) {
                        queue[0]();
                    }
                    syncEnabled = true;
                    return deferred.promise;
                } else {
                    return config;
                }
            },

            response: function(response) {
                executeTheQueuedCall();
                return response;
            },

            responseError: function(responseError) {
                executeTheQueuedCall();
                return $q.reject(responseError);
            }
        };
    }];

    $httpProvider.interceptors.push(httpCsrfInterceptor);
    $httpProvider.interceptors.push(timeoutInterceptor);
    $httpProvider.interceptors.push(http401Interceptor);
    $httpProvider.interceptors.push(http412Interceptor);
    $httpProvider.interceptors.push(http5xxInterceptor);
    $httpProvider.interceptors.push(httpQueue);
});

appCenter.run(['$http', '$cookies', function($http) {
    $http.defaults.xsrfCookieName = 'EUC_XSRF_TOKEN';
}]);

function http412InterceptorHelper(status, $notify, $timeout, ConfigService, UserAgent, UtilService, JadeV2Scheme, HorizonClientScheme) {
    // 412 is thrown when a security header expected is missing.
    // When API returns this error, then that means, we can try login.
    if (status === 412) {
        $notify.error('api.security.header.invalid.relogin');
        $timeout(function() {
            if (UserAgent.isHorizon()) {
                UtilService.openURIScheme(HorizonClientScheme.LOGOUT);
            } else if (UserAgent.isAWJadeV2()) {
                UtilService.openURIScheme(JadeV2Scheme.REFRESH_COOKIE);
            } else {
                ConfigService.getLogoutUrl().then(function(logoutUrl) {
                    window.location.href = logoutUrl;
                });
            }
        }, 3000, false);
    }
}

function http5xxInterceptorHelper(error, $notify) {
    var suppressErrors = ['mobile.flows.notifications.registration.failed'];
    if (error.config.url.indexOf('/user/announcements/current') !== -1) {
        return;
    }
    var status = error.status;
    var errorCode = _.get(error, 'data.code', undefined);
    var errorMsg = errorCode === 'installation.error' ? 'installation.error' : 'api.error';
    if (status === 503) {
        error.handled = true;
        errorMsg = 'service.under.maintenance.error';
    }
    if (status >= 500 && suppressErrors.indexOf(errorCode) === -1) {
        $notify.warning(errorMsg);
    }
}
