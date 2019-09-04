//TODO: Move services, appCenter, launcher components into different modules
// Define a new module for our app. The array holds the names of dependencies if any.
    angular.module("com.vmware.greenbox.appCenter", [
        'ngRoute',
        'ngCookies',
        'ngSanitize',
        'greenbox.appcenter.templates',
        'greenbox.components.templates',
        'com.vmware.workspace.services.rest',
        'com.vmware.workspace.components.modal',
        'com.vmware.greenbox.services.offlineService',
        'com.vmware.workspace.services.localization',
        'com.vmware.workspace.components.rating',
        'com.vmware.workspace.components.symbol',
        'com.vmware.workspace.components.spinner',
        'com.vmware.workspace.components.dropdown',
        'com.vmware.workspace.components.notify',
        'com.vmware.workspace.components.frameDrawer',
        'com.vmware.workspace.components.lineClamp',
        'com.vmware.workspace.components.message',
        'com.vmware.greenbox.l10n',
        'angular-gestures',
        'angular-carousel'])

        .factory('lodash', ['$window',
            function($window) {
                // place lodash include before angular
                return $window._;
            }
        ])

    
    
// configure app routes
    .config(['$routeProvider', function($routeProvider ) {
        $routeProvider
            // route for the catalog page
            .when('/catalog', {
                templateUrl : 'app/catalog/catalog.html',
                controller  : 'CatalogController',
                controllerAs : 'catalogCtrl'
            })
            .when('/details/:appId/:originPage', {
                templateUrl : 'app/details/details.html',
                controller : 'DetailsController',
                controllerAs : 'detailsCtrl'
            })
            .when('/launcher', {
                templateUrl : 'app/launcher/launcher.html',
                controller : 'LauncherController',
                controllerAs : 'launcherCtrl'
            })
            .when('/settings', {
                templateUrl : 'app/settings/settings.html',
                controller : 'SettingsController',
                controllerAs : 'settingsCtrl'
            })
            .when('/preferences', {
                templateUrl : 'app/preferences/preferences.html',
                controller : 'PreferencesController',
                controllerAs : 'preferencesCtrl'
            })
            .when('/about', {
                templateUrl : 'app/common/about.html'
            })
            .when('/index', {
                //This will decide what route to default to.
                controller: function($location, hznLocalStorage){
                    var lastActive = hznLocalStorage['last_active_page'];
                    if( workspaceOne && workspaceOne.hasLaunchableApps === false || lastActive === 'catalog') {
                        $location.path('/catalog');
                    }else{
                        $location.path('/launcher');
                    }
                },
                template : " "
            })
            .when('/changePassword', {
                templateUrl : 'app/common/changePassword.html'
            })
            .otherwise({
                redirectTo: '/index'
            });
    }])

   .config(['LocalizationProvider', '$injector', 'l10n_en', function(LocalizationProvider, $injector, l10n_en){
       var l10n = $injector.has('l10n') ? $injector.get('l10n') : {};
       angular.extend(l10n_en, l10n);
       LocalizationProvider.setL10nMap(l10n_en);
   }])

   //HammerJs Configuration
   .config(['hammerDefaultOptsProvider', function(hammerDefaultOptsProvider) {
        //Setting up gestures that need to be recognized by HammerJs
        hammerDefaultOptsProvider.set({
            recognizers: [[Hammer.Press, {time: 500}]]//Minimum time to detect press as a hold event.
        });
   }])

   .config(function($httpProvider) {
            var http401Interceptor = ['$q','$notify','$timeout','$injector', function($q, $notify,$timeout,$injector) {
                return {
                    'responseError': function(response) {
                        var status = response.status;
                        var ConfigService = $injector.get('ConfigService');
                        http401InterceptorHelper(status, $notify, $timeout, ConfigService);
                        // otherwise
                        return $q.reject(response);
                    }
                };
            }];

            var http412Interceptor = ['$q','$notify','$timeout','$injector', 'JadeV1Scheme', 'JadeV2Scheme', 'HorizonClientScheme',
                function($q, $notify,$timeout,$injector, JadeV1Scheme, JadeV2Scheme, HorizonClientScheme) {
                    return {
                        'responseError': function(response) {
                            var status = response.status;
                            var ConfigService = $injector.get('ConfigService');
                            var UtilService = $injector.get('UtilService');
                            var UserAgent = $injector.get('UserAgent');
                            http412InterceptorHelper(status, $notify, $timeout, ConfigService, UserAgent, UtilService, JadeV1Scheme, JadeV2Scheme, HorizonClientScheme);
                            // otherwise
                            return $q.reject(response);
                        }
                    };
                }];


            //Prompt user if a 5xx error occurs.
            var http5xxInterceptor = ['$q','$notify', function($q,$notify) {
                return {
                    'responseError': function(response) {
                        http5xxInterceptorHelper(response, $notify);
                        return $q.reject(response);
                    }
                };
            }];

            var timeoutInterceptor = ['$q','$notify','$injector', function ($q, $notify,$injector) {

                return {

                    'request':function (config) {
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

                    'responseError':function (response) {
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
                        if($cookies['EUC_XSRF_TOKEN']) {
                            request.headers['X-XSRF-TOKEN'] = $cookies['EUC_XSRF_TOKEN'];
                        } else {
                            request.headers['X-XSRF-TOKEN'] = '';
                        }
                        return request;
                    }
                };
            }];

            $httpProvider.interceptors.push(httpCsrfInterceptor);
            $httpProvider.interceptors.push(timeoutInterceptor);
            $httpProvider.interceptors.push(http401Interceptor);
            $httpProvider.interceptors.push(http412Interceptor);
            $httpProvider.interceptors.push(http5xxInterceptor);
        })
        .run(function($window, $cookies, ConfigService, $notify, $timeout, UserAgent, UtilService,
                      JadeV1Scheme, JadeV2Scheme, HorizonClientScheme){
            $window.onbeforeunload = function(){
                ConfigService.refreshCache();
            };

            var settings = {
                error : function(error) {
                    http401InterceptorHelper(error.status, $notify, $timeout, ConfigService);
                    http412InterceptorHelper(error.status, $notify, $timeout, ConfigService, UserAgent, UtilService,
                        JadeV1Scheme, JadeV2Scheme, HorizonClientScheme);
                    http5xxInterceptorHelper(error, $notify);
                }
            }

            //Add X-XSRF-TOKEN as default header for synchronous calls via $.ajax.
            //Add it here so that each $.ajax call will have this header, no matter RequestFactory is used.
            if ($cookies['EUC_XSRF_TOKEN']) {
                settings['headers'] = { 'X-XSRF-TOKEN': $cookies['EUC_XSRF_TOKEN']};
            } else {
                settings['headers'] = { 'X-XSRF-TOKEN': null};
            }

            //Ajax interceptor for requests sent using jQuery.
            $.ajaxSetup(settings);

        })

        .run(['$http', '$cookies', function($http, $cookies) {
            $http.defaults.xsrfCookieName = 'EUC_XSRF_TOKEN';
        }]);

        function http401InterceptorHelper(status, $notify, $timeout, ConfigService) {
            // 409 is thrown when tenant config state does not with toggles.
            // When API returns this error, then that means, we can try login.
            // At login also it might be a same problem. It will be better UX, since UI shows error page.
            if (status === 401 || status === 403 || status == 409) {
                //Force reload the page in case of authentication error
                $notify.warning('api.session.expired.retry');
                $timeout(function() {
                    ConfigService.doNotRefreshCache = true;
                    if(!ConfigService.isReloading){
                        ConfigService.isReloading = true;
                        location.reload(true);
                    }
                },3000,false);
            }
        }

        function http412InterceptorHelper(status, $notify, $timeout, ConfigService, UserAgent, UtilService, JadeV1Scheme, JadeV2Scheme, HorizonClientScheme) {
            // 412 is thrown when a security header expected is missing.
            // When API returns this error, then that means, we can try login.
            if (status === 412) {
                $notify.error('api.security.header.invalid.relogin');
                $timeout(function() {
                    if (UserAgent.isHorizon()){
                        UtilService.openURIScheme(HorizonClientScheme.LOGOUT);
                    } else if (UserAgent.isAWJadeV2()) {
                        UtilService.openURIScheme(JadeV2Scheme.SERVER_LOGOUT);
                    }
                    else {
                        ConfigService.getLogoutUrl().then(function(logoutUrl){
                            window.location.href = logoutUrl;
                        });
                    }
                },3000,false);
            }
        }

        function http5xxInterceptorHelper(error, $notify) {
            var status  =  error.status;
            var errorMsg  = 'api.error'
            if(status === 503) {
                error.handled = true;
                errorMsg = 'service.under.maintenance.error';
            }
            if (status >= 500) {
                $notify.warning(errorMsg);
            }
        }
