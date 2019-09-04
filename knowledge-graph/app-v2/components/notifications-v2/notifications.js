appCenter.component('notificationsV2', {
    template: '<div ng-include="\'app-v2/components/notifications-v2/\' + notificationCtrl.templateUrl">',
    controllerAs: 'notificationCtrl',
    controller: ['NotificationService', 'UserAgent', 'hznLocalStorage', 'UpdateUrlParamsService', '$timeout', '$scope', '$state', 'ModalService', '$filter', '$notify', '$rootScope', 'UtilService',
        function(NotificationService, UserAgent, hznLocalStorage, UpdateUrlParamsService, $timeout, $scope, $state, ModalService, $filter, $notify, $rootScope, UtilService) {
            var vm = this;
            vm.filter = $state.params.filter;
            vm.isIOS = UserAgent.isIOS();
            vm.isAndroid = UserAgent.isAndroid();
            vm.notifications = [];
            vm.parsedNotification = {};
            vm.isMobile = UserAgent.isAWJadeMobile();
            vm.showFirstTimeMessage = false;
            vm.showNoNotificationsMessage = false;
            vm.showContextDialog = false;
            vm.isAWJadeTablet = UserAgent.isTablet();
            vm.isAWJadeDesktop = UserAgent.isAWJadeDesktop();
            vm.showCloseButton = !NotificationService.showNativeBell();
            vm.notificationId = vm.filter !== 'pending' && vm.filter !== 'completed' && vm.filter !== 'all' && vm.filter;
            vm.filterText = '';
            if (vm.notificationId) {
                vm.filter = 'all';
            }
            vm.filterText = vm.filter.substring(0, 1).toUpperCase() + vm.filter.substring(1);

            vm.toggleContextDialog = function() {
                vm.showContextDialog = !vm.showContextDialog;
            };
            this.templateUrl = UtilService.loadTemplateForPlatform('notificationsMobile.html', 'notificationsBrowser.html', 'notificationsBrowser.html');

            $rootScope.$on('hub-notification-acted-on', function(event, data) {
                if (vm.filter === 'pending') {
                    vm.removeFromView(data);
                    vm.parsedNotification = NotificationService.parseNotification(vm.notifications, false);
                }
            });

            vm.removeFromView = function(notification) {
                var notificationIndex = vm.notifications.findIndex(function(element) {
                    return element.id === notification.notificationId;
                });
                vm.notifications.splice(notificationIndex, 1);
            };

            this.leftNavLinks = NotificationService.filters;

            vm.notificationInSection = function(arr, notificationId) {
                var notificationIndex = arr.findIndex(function(element) {
                    return element.id === notificationId;
                });

                if (notificationIndex !== -1) {
                    arr.splice(notificationIndex, 1);
                    return true;
                }
                return false;
            };

            vm.filterNotifications = function(arr, filter) {
                var result = [];
                arr.forEach(function(element) {
                    var lastActionId = _.get(element, 'last_action_id', '');
                    var actions = _.get(element, 'notification_card.actions', []);
                    var priority = _.get(element, 'notification_card.importance', -1);
                    var read_at = _.get(element, 'read_at', '');

                    if (!read_at && (priority !== 1)) {
                        var url = element._links.markRead.href;
                        NotificationService.archiveNotification(url);
                    }

                    if (filter === 'pending') {
                        if (!lastActionId) {
                            result.push(element);
                        }
                    } else if (filter === 'completed') {
                        if (lastActionId) {
                            result.push(element);
                        }
                    } else {
                        result.push(element);
                    }
                });
                return result;
            };

            vm.clearFilter = function() {
                var state = ((UserAgent.isAWJadeMobile() && UserAgent.isNativeAppVersionIsEqualOrAbove("9.2")) || UserAgent.isBrowser()) ? 'notifications' : 'apps.notifications';
                $state.go(state, {
                    filter: ''
                });
            };

            vm.getNotifications = function() {
                vm.isLoading = true;
                vm.notifications = [];

                NotificationService.getNotifications('emptyReadState').then(function(notifications) {
                    if (!notifications.length) {
                        vm.showFirstTimeMessage = true;
                    }

                    vm.notifications = vm.filterNotifications(notifications, vm.filter);
                    NotificationService.setNotifications(notifications);
                    if (vm.notifications.length) {
                        var completedFilter = (vm.filter === 'completed');
                        vm.parsedNotification = NotificationService.parseNotification(vm.notifications, completedFilter);
                    } else {
                        vm.showNoNotificationsMessage = true;
                    }

                    /*
                    We use a timeout of 800 ms here to wait for the cards to load. Without it they can't be found
                    in the DOM as the cards are directives which dynamically rendered in an ng-repeat loop.
                    */
                    vm.isLoading = false;
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

            vm.goBack = function() {
                // Only go back to apps needs to show the nativenav
                UpdateUrlParamsService.showNativenav().then(function() {
                    $state.go('apps');
                });
            };

            if (!NotificationService.showNativeBell() && UserAgent.isAWJadeMobile()) {
                UpdateUrlParamsService.hideNativenav().then(function() {
                    vm.getNotifications();
                });
            } else {
                vm.getNotifications();
            }
        }]
});
