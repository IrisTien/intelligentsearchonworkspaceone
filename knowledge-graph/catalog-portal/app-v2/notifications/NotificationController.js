(function(module) {
    'use strict';
    module.controller('NotificationController', ['NotificationService', 'UserAgent', 'hznLocalStorage', 'UpdateUrlParamsService', '$timeout', '$scope', '$state', 'ModalService', '$filter', '$notify', '$rootScope', 'UtilService',
        function(NotificationService, UserAgent, hznLocalStorage, UpdateUrlParamsService, $timeout, $scope, $state, ModalService, $filter, $notify, $rootScope, UtilService) {
            var vm = this;
            var appCenterCtrl = $scope.appCenterCtrl;
            vm.isIOS = UserAgent.isIOS();
            vm.notifications = [];
            vm.priority = [];
            vm.today = [];
            vm.yesterday = [];
            vm.lastWeek = [];
            vm.lastMonth = [];
            vm.older = [];

            var OneDay = 1440;
            var TwoDays = 2880;
            var OneWeek = 10080;
            var OneMonth = 43200;

            vm.showFirstTimeMessage = false;
            vm.showNoNotificationsMessage = false;

            $rootScope.$on('new-notification-count-update', function(event, data) {
                if (appCenterCtrl.isNotificationDropdownActive) {
                    vm.notifications = data;
                }
            });

            var emptyStateCheck = function(notifications) {
                if (notifications.length == 0) {
                    vm.showNoNotificationsMessage = true;
                }
            };

            vm.archivedTab = $state.current.activeTab === "archivedNotifications";
            if (UserAgent.isAWJadeMobile()) {
                vm.notificationId = $state.params.notificationId || '';
            }

            if (UserAgent.isAWJadeWithNativenav()) {
                if (($state.prev.name === 'bookmarks' || $state.prev.name === 'catalog') && $state.current.name === 'notifications') {
                    hznLocalStorage.nativenav_people = 'false';
                }
                if (($state.prev.name === 'people') && ($state.current.name === 'notifications')) {
                    hznLocalStorage.nativenav_people = 'true';
                }
            }

            vm.timeDifference = function(created) {
                var createdTime = moment.utc(created);
                var now = moment();
                return UtilService.timeDifference(createdTime, now);
            };

            vm.notificationInSection = function(arr, notificationId) {
                var notificationIndex = arr.findIndex(function(element) {
                    return element.id === notificationId;
                });

                if (notificationIndex != -1) {
                    arr.splice(notificationIndex, 1);
                    return true;
                }
                return false;
            };

            vm.hubArchiveNotification = function(notificationId) {
               var found = false;
               var sections = [vm.priority, vm.today, vm.yesterday, vm.lastWeek, vm.lastMonth, vm.older];
               sections.forEach(function(array) {
                   if (!found) {
                       var foundInSection = vm.notificationInSection(array, notificationId);
                       if (foundInSection) {
                           found = true;
                       }
                   }
               });
            };

            vm.getNotifications = function(archived) {
                vm.isLoading = true;
                vm.notifications = [];
                vm.showNotificationsOverflowActions = false;
                vm.showArchived = archived;

                NotificationService.getNotifications(archived).then(function(notifications) {
                    vm.notifications = notifications;

                    if (!vm.notifications.length) {
                        NotificationService.getNotifications(!archived).then(function(notifications) {
                            if (!notifications.length) {
                                vm.showFirstTimeMessage = true;
                                vm.isLoading = false;
                            } else {
                                vm.showNoNotificationsMessage = true;
                                vm.isLoading = false;
                            }
                        }, function() {
                            vm.showNoNotificationsMessage = true;
                            vm.isLoading = false;
                        });
                    }

                    vm.notifications.forEach(function(notification) {
                        var priority = false;
                        var importance = _.get(notification, 'notification_card.importance', -1);

                        if (importance == 1) {
                            vm.priority.push(notification);
                            priority = true;
                        }

                        var created_time = _.get(notification, 'created_at', '');
                        var timeDifference = vm.timeDifference(created_time);

                        if (!priority) {
                            if (timeDifference < OneDay) {
                                vm.today.push(notification);
                            } else if (timeDifference >= OneDay && timeDifference < TwoDays) {
                                vm.yesterday.push(notification);
                            } else if (timeDifference >= TwoDays && timeDifference < OneWeek) {
                                vm.lastWeek.push(notification);
                            } else if (timeDifference >= OneWeek && timeDifference < OneMonth) {
                                vm.lastMonth.push(notification);
                            } else if (timeDifference >= OneMonth) {
                                vm.older.push(notification);
                            }
                        }
                    });

                    vm.isLoading = false;

                    /*
                    We use a timeout of 800 ms here to wait for the cards to load. Without it they can't be found
                    in the DOM as the cards are directives which dynamically rendered in an ng-repeat loop.
                    */

                    $timeout(function() {
                        if (vm.notificationId) {
                            var notificationElement = angular.element('#' + vm.notificationId);
                            if (notificationElement) {
                                notificationElement[0].scrollIntoView(true);
                                notificationElement[0].classList.add("notification-highlight");
                            }
                        }
                    }, 800);
                }, function() {
                    vm.isLoading = false;
                    vm.showNoNotificationsMessage = true;
                });
            };

            vm.archiveNotification = function(id) {
                var notificationIndex = vm.notifications.findIndex(function(element) {
                    return element.id === id;
                });
                vm.notifications.splice(notificationIndex, 1);
                vm.hubArchiveNotification(id);
                emptyStateCheck(vm.notifications);
            };

            vm.toggleNotificationsOverflowContainer = function() {
                vm.showNotificationsOverflowActions = !vm.showNotificationsOverflowActions;
            };

            vm.archiveAll = function() {
                NotificationService.archiveAllNotifications().then(function() {
                    if ($state.current.name == 'apps.notifications') {
                        $state.reload('apps.notifications');
                    } else {
                        $state.go('apps.notifications', {}, {reload: 'apps.notifications'});
                    }
                });
            };

            vm.hideNotificationOverflowActions = function() {
                vm.showNotificationsOverflowActions = false;
            };

            $scope.$on('notification-overlflow-actions', function(event, status) {
                vm.showNotificationsOverflowActions = status;
            });

            vm.goToArchived = function() {
                $state.go('archivedNotifications');
            };

            vm.hubGoToArchived = function() {
                location.hash = '#/apps/archivedNotifications?nativenav=Hide';
            };

            /*
            The below function is used in Hub only. Notifications can only be navigated to from the apps page and when push notifications are sent the app first navigates to the apps tab
            and then loads notifications. Therefore, the back button notifications will always lead back to the apps page on Hub.
            */
            vm.goBack = function() {
                // Archived tab goes to notification -- still hide nativenav
                if (vm.archivedTab) {
                    UtilService.goBack();
                } else {
                    // Only go back to apps needs to show the nativenav
                    UpdateUrlParamsService.showNativenav().then(function() {
                        $state.go('apps');
                    });
                }
            };

            if (UtilService.isHubNative()) {
                UpdateUrlParamsService.hideNativenav().then(function() {
                    vm.getNotifications(vm.archivedTab);
                });
            } else {
                vm.getNotifications(vm.archivedTab);
            }
        }]);
})(angular.module('com.vmware.greenbox.appCenter'));
