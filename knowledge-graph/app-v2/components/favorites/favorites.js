appCenter.component('favorites', {
    templateUrl: 'app-v2/components/favorites/favorites.html',
    controllerAs: 'favoritesCtrl',
    controller: ['$q',
        'BookmarksService',
        'HttpProxyService',
        'BootstrapService',
        'UserAgent',
        '$state',
        '$scope',
        'AppsService',
        'ModalService',
        '$filter',
        '$timeout',
        '$rootScope',
        '$notify',
        function($q,
                 BookmarksService,
                 HttpProxyService,
                 BootstrapService,
                 UserAgent,
                 $state,
                 $scope,
                 AppsService,
                 ModalService,
                 $filter,
                 $timeout,
                 $rootScope,
                 $notify) {
            var vm = this;

            // auto dismiss the editmode after the notify finishes, the current notify time is 3000
            var editModeAutoDismissTime = 3000;
            vm.emptyFillers = [1, 2, 3, 4, 5, 6, 7, 8];
            vm.favoritesBeforeEdit = [];
            // Get the favorites from the appService
            vm.favoritesInEditMode = AppsService.getFavorites();

            vm.sortingButtonEnabled = false;
            // This is a flag if user updated the order but did not click the sort action button
            vm.sortingOrderUpdatedWithoutActions = false;
            vm.sortingWarningMessageShow = false;

            vm.isWindows = UserAgent.isWindows();

            // Clone a copy of the original favorites from the service to use when use cancel the reordering
            var favoritesBeforeEdit = _.clone(vm.favoritesInEditMode);

            // Functions specific to the reordering
            vm.sortableOptions = {
                cursor: "move",
                placeholder: "sort-placeholder",
                forcePlaceholderSize: true,
                forceHelperSize: true,
                opacity: 0.8,
                revert: 100,
                helper: "clone",
                tolerance: "intersect",
                containment: "parent"
            };

            vm.sortingUpdate = function(e, ui) {
                // We are using css z-index to enable the button, if the button is enabled the z-index is jump from -1 (does not do anything)
                // to 50 and color is changed
                vm.sortingButtonEnabled = true;
                // Also update the flag, this will be used if user updated the order but clicked the model close button instead of the tow sort button - cancel or save
                vm.sortingOrderUpdatedWithoutActions = true;
            };

            var resetCustomView = function() {
                vm.favoritesInEditMode = favoritesBeforeEdit;
            };

            vm.cancelSorting = function() {
                vm.savingfavorites = false;
                // Once the button is clicked, disabled it prevent user to click the other button to cause complication
                vm.sortingButtonEnabled = false;
                resetCustomView();
                // Delay about 1000ms to go back to the apps landing page automatically
                $timeout(function() {
                    goToApps();
                    $rootScope.$broadcast('favorites-reordering-canceled');
                }, editModeAutoDismissTime / 3);
            };

            vm.saveCustomView = function() {
                vm.savingfavorites = true;
                vm.sortingOrderUpdatedWithoutActions = false;
                vm.sortingButtonEnabled = false;
                BookmarksService.saveCustomView(_.map(vm.favoritesInEditMode, 'appId')).then(function(data) {
                    HttpProxyService.clearAll();
                    $notify.success('hub.apps.edit.favorites.notify.success');
                    vm.savingfavorites = false;
                    // Delay about 3000ms to go back to the apps landing page automatically -- 3000ms is the onset of the notify message
                    $timeout(function() {
                        goToApps();
                    }, editModeAutoDismissTime);
                }, function() {
                    $notify.error('hub.apps.edit.favorites.notify.error');
                    vm.cancelSorting();
                    // Delay about 500ms to go back to the apps landing page automatically
                    $timeout(function() {
                        goToApps();
                    }, editModeAutoDismissTime);
                });
            };

            vm.exitEditMode = function(event) {
                // If the order is updated do not allow user to exit the editmode without taking actions -cancel or save to avoid complications
                // If server is saving the favorite new order also prevent exit the editmode
                if (vm.sortingOrderUpdatedWithoutActions || vm.savingfavorites) {
                    vm.sortingWarningMessageShow = true;
                    event.preventDefault();
                } else {
                    goToApps();
                }
            };

            var goToApps = function() {
                $state.go('apps');
            };

            // This is to deal with in the edit mode user have update the order but did not take actions (save or cancel)
            $scope.$on('$locationChangeStart', function(event, next, current) {
                if (vm.sortingOrderUpdatedWithoutActions) {
                    vm.sortingWarningMessageShow = true;
                    event.preventDefault();
                }
            });
        }]
});
