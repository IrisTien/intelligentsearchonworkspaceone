(function(module) {
    'use strict';

    module.directive('launcherItem', ['$timeout', function($timeout){

        return {
            restrict : 'A',
            scope : true,
            templateUrl : 'app/launcher/launcherItem.html',
            controller : ['$scope',
                          'LauncherService',
                          '$log',
                          '$sce',
                          'OfflineService',
                          'Localization',
                          'UserAgent',
                          'hznLocalStorage',
                          'DesktopLaunchService',
                          'lodash',
                          '$element',
                          'ClientRuntimeService',
                          function ($scope,
                                    LauncherService,
                                    $log,
                                    $sce,
                                    OfflineService,
                                    Localization,
                                    UserAgent,
                                    hznLocalStorage,
                                    DesktopLaunchService,
                                    lodash,
                                    $element,
                                    ClientRuntimeService) {
                             var vm = this;
                             vm.app = $scope.app;
                             var app = $scope.app;
                             vm.app.launching = false;
                             vm.isAWJade = UserAgent.isAWJade();
                             vm.isHorizon = UserAgent.isHorizon();

                             if ( app.type === 'VIRTUAL' ) {
                                 app.badge = 'virtual-app';
                             }
                             app.icon = app['_links']['icon']['href'];
                             app.launch = app['_links']['launch'] != undefined ? app['_links']['launch']['href'] : "";
                             app.resetDesktop = app['_links']['reset-desktop'] != undefined ? app['_links']['reset-desktop']['href'] : "";

                             var getFavoriteUrl = function(favApp){
                                 var favoriteTemplatedUrl = lodash.get(favApp, '_links.favorites.href');
                                 var templateText = 'favorite={boolValue}';
                                 var replacetext = 'favorite=' + !favApp.favorite;
                                 if(favoriteTemplatedUrl){
                                     return favoriteTemplatedUrl.replace(templateText, replacetext);
                                 }
                                 else{
                                     return "";
                                 }
                             };

                             vm.toggleFavorite = function(favApp, $event, isFilteredByFav, apps, index){
                                 var deviceOnline = OfflineService.isDeviceOnline();
                                 if($event){
                                     $event.stopPropagation();
                                 }
                                 if(deviceOnline) {
                                     var favoriteUrl = getFavoriteUrl(favApp);
                                     favApp.favorite = !favApp.favorite;
                                     if (favoriteUrl != undefined || favoriteUrl) {
                                         LauncherService.toggleFavorite(favoriteUrl, true).then(function(data){
                                             if(isFilteredByFav){
                                                 apps.splice(index, 1);
                                                 $scope.showLauncherMessage(apps);
                                                 $scope.$apply();
                                             }
                                         }, function(error){
                                             favApp.favorite = !favApp.favorite;
                                             if(!!error.handled) {//When system is under maintenance
                                                 return;
                                             }
                                             $scope.$modal.alert({
                                                 title: 'requestFailed',
                                                 message: 'error.failToFavoriteApp',
                                                 ok: 'ok'
                                             });
                                             $scope.$apply();
                                         });
                                     } else {
                                         $log.error('Unformatted favorite url');
                                     }
                                 }else{
                                     $scope.$modal.alert({
                                         title: 'requestFailed',
                                         message: 'favoriteStatus.offlineFavoriteMessage',
                                         ok: 'ok'
                                     });
                                 }
                             };
                             $scope.toggleFavorite = vm.toggleFavorite;

                              vm.resetDesktop = function(app, $event){
                                  var deviceOnline = OfflineService.isDeviceOnline();
                                  if($event){
                                      $event.stopPropagation();
                                  }
                                  if(deviceOnline) {
                                      if (app.resetDesktop != undefined || app.resetDesktop) {
                                          LauncherService.resetDesktop(app.resetDesktop).then(function(data){
                                              if (data) {
                                                  $scope.$modal.alert({
                                                      title: 'requestSuccessful',
                                                      message: 'resetDesktop.sucess',
                                                      ok: 'ok'
                                                  });
                                              } else {
                                                  $scope.$modal.alert({
                                                      title: 'requestFailed',
                                                      message: 'error.failToResetDesktop',
                                                      ok: 'ok'
                                                  });
                                              }
                                          });
                                      } else {
                                          $log.error('Unformatted resetDesktop url');
                                      }
                                  }else{
                                      $scope.$modal.alert({
                                          title: 'requestFailed',
                                          message: 'resetDesktopStatus.offlineMessage',
                                          ok: 'ok'
                                      });
                                  }
                              };
                              $scope.resetDesktop = vm.resetDesktop;

                              vm.openSetAppPasswordDialog = function($event) {
                                  if($event){
                                      $event.stopPropagation();
                                  }
                                  $scope.$modal.open('app/launcher/setAppPassword.html', { app: app });
                               }
                               $scope.openSetAppPasswordDialog = vm.openSetAppPasswordDialog;

                              vm.isAppNew = function(app) {
                                  return app.displayStatus === 'NEW';
                              };


                vm.launchApp = function (app, $event) {
                    //there is cases that app is launched when user says that the launching program are installed in dialog.
                    // So we need to check the event here
                    if ($event){
                      $event.preventDefault();
                    }

                    if(checkIfNativeClientIsInstalledFor(app)){
                        if (vm.isAppNew(app)) {
                            markAppLaunched(app);
                        }
                        ClientRuntimeService.launchApp(app,$scope);
                    }

                    function markAppLaunched(launchedApp){
                        var deviceOnline = OfflineService.isDeviceOnline();
                        if(deviceOnline) {
                            var appLaunchedUrl = lodash.get(launchedApp, '_links.markAppLaunched.href');
                            if (appLaunchedUrl) {
                                launchedApp.displayStatus = "LAUNCHED";
                                LauncherService.markAppLaunched(appLaunchedUrl, false).then(null, function(data){
                                });
                            } else {
                                $log.error('No appLaunched Url');
                            }
                        }
                    };

                    function checkIfNativeClientIsInstalledFor(app) {

                        if ($scope.shouldSuppressLaunchDialog || UserAgent.isAWJade()) {
                            return true;
                        }
                        switch(app.subType) {
                          case "THINAPP":
                          case "APPV":
                              if(!UserAgent.isHorizonDesktopInstalled()){
                                  vm.openAppDownloadDialog(app);
                                  return false;
                              }
                              break;
                          case "XENAPP":
                          case "XENAPPDELIVERYGROUP":
                              if (!UserAgent.isCitrixReceiverInstalled()){
                                  vm.openAppDownloadDialog(app);
                                  return false;
                              }
                              break;
                      }
                      return true;
                    }
                };

                vm.appInstalled = function (type) {
                    switch (type) {
                        case 'XENAPP':
                        case "XENAPPDELIVERYGROUP":
                            hznLocalStorage[UserAgent.hznCitrixReceiverInstalled] = "1" ; break;
                            break;
                        case 'THINAPP':
                            hznLocalStorage[UserAgent.hznHorizonWorkspaceInstalled] = "1" ; break;
                            break;
                        case 'APPV':
                            hznLocalStorage[UserAgent.hznHorizonWorkspaceInstalled] = "1" ; break;
                            break;
                        default: break;
                    }
                    $scope.$modal.close();
                    //try to launch the app
                    ClientRuntimeService.launchApp(app,$scope);
                };

                vm.openAppDownloadDialog = function (app) {
                    var description;
                    var hideOpenApp = false;
                    switch (app.subType){
                        case 'THINAPP':
                        case 'APPV':
                            var workspaceDownloadUrl = Localization.getLocalizedString('workspaceDownloadUrl');
                            description = Localization.getLocalizedString('horizonDesktopNotDetected', [workspaceDownloadUrl])
                            break;
                        case 'XENAPP':
                        case "XENAPPDELIVERYGROUP":
                            var citrixReceiverDownloadUrl = Localization.getLocalizedString('citrixReceiverDownloadUrl');
                            description = Localization.getLocalizedString('xenAppsReceiverNotDetected', [citrixReceiverDownloadUrl])
                            break;
                    }
                    $scope.$modal.open('app/launcher/appDownloadDialog.html', $scope, {params: {description: description}});
                };

                vm.triggerContextdialog = function() {
                    var emblem = $element.find('.emblem');
                    $timeout( function () { emblem.trigger('contextmenu'); }, false );
                }

              vm.openWithViewClient = function(app, $event) {
                  if ($event){
                      $event.preventDefault();
                  }
                  if ( ! (DesktopLaunchService.isViewApp(app)|| DesktopLaunchService.isDesktoneApp(app))) {
                      return;
                  }

                  DesktopLaunchService.launchByViewClient($scope, app);
              };

              vm.openWithBrowser = function(app, $event) {
                  if ($event){
                      $event.preventDefault();
                  }
                  if ( ! (DesktopLaunchService.isViewApp(app)|| DesktopLaunchService.isDesktoneApp(app))) {
                      return;
                  }
                  DesktopLaunchService.launchByBrowser($scope, app);
              };

              vm.isViewOptionSupported = function (app, clientType) {
                  if (app.subType !== 'VIEWPOOL' && app.subType !== 'VIEWAPP' && app.subType !== 'DESKTONEDESKTOP' && app.subType !== 'DESKTONEAPPLICATION') {
                      return false;
                  }
                  return DesktopLaunchService.isClientLaunchable(app, clientType);
              };

            if (app.subType === 'VIEWPOOL' || app.subType === 'VIEWAPP' || app.subType === 'DESKTONEDESKTOP' || app.subType === 'DESKTONEAPPLICATION') {
                app.isViewResource = true;
            }
            if (vm.isViewOptionSupported(app, "BROWSER")) {
                app.viewBrowserLaunchSupported = true;
            }
          if (vm.isViewOptionSupported(app, "NATIVE")) {
              app.viewClientLaunchSupported = true;
          }

            }],
            controllerAs: 'launcherItemCtrl',
            bindToController: true
        };

    }]);

})(angular.module('com.vmware.greenbox.appCenter'));
