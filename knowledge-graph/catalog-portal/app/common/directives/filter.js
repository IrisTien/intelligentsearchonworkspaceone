(function(module) {

    'use strict';

    /*
    Filter Bar is responsible to render the filter bar and show current selected item in filter menu.
    Scope wise it resides below Filter menu. The reasoning for that is Filter menu should be a full screen
    page on mobile and a dropdown on desktop. To achieve full screen filter menu need to be placed at top of
    the hierarchy where it's parent can get hold of 100% height.
    */
    module.directive('filterBar', function ($rootScope) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            require: ['filterBar','^filterMenu'],
            link: postLink,
            controller: controller,
            controllerAs: '$filterBar',
            bindToController: true,
            scope: {selectedItem: '=', config: '=?filterBar', onFavorite: '&'},
            templateUrl: 'app/common/directives/filterBarTemplate.html'
        };

        function controller($scope) {
            var $filterBar = this;
            $filterBar.config = $filterBar.config || {};
        }

        function postLink(scope, element, attrs, controllers){
            var $filterBar = controllers[0];
            var $filter = controllers[1];

            scope.isClosed = $filter.config.closeFilterMenu;

            $rootScope.$broadcast('filterBarRendered', {
                isDesktop: $filterBar.config.isDesktop,
                element: $(element).find('.filterDropdown')
            });

            if ($filterBar.config.isDesktop) {
                $rootScope.$on('toggleFilterMenu', function(value) {
                    scope.isClosed = !scope.isClosed;
                });
            }

            $filterBar.toggle = function() {
                if ($filterBar.config.isDesktop) {
                    $filter.toggle();
                } else {
                    $filter.open();
                }
            };
            $filterBar.toggleFavorite = function() {
                $filterBar.config.isFavorited = !$filterBar.config.isFavorited;
                $filterBar.onFavorite();
            };
        }
    });

    /*
    Filter menu is responsible for appending the filter menu's template to appropriate element.
    Scope wise filter menu resides at top over filter bar. It is also responsible to open, close filter menu
    and invoke the callback when an item is selected.
    */
    module.directive('filterMenu', function ($templateRequest, $compile, $rootScope, DeviceBreakpointService) {
        return {
            restrict: 'A',
            scope: { config: '=filterMenu', onSelect: '&' },
            controller: controller,
            controllerAs: '$filter',
            bindToController: true,
            link: postLink
        };

        function controller($scope, $element, $timeout, $document, UserAgent) {
            var $filter = this;
            $filter.config.closeFilterMenu = true;
            $filter.config.mobileTemplateUrl = 'app/common/directives/filterMenuTemplate.html';
            $filter.config.desktopTemplateUrl = 'app/common/directives/desktopFilterMenuTemplate.html';

            $filter.open = function() {
                $filter.config.closeFilterMenu = false;
                $scope.$emit('toggleFilterMenu');
            };
            $filter.close = function() {
                $filter.config.closeFilterMenu = true;
                $scope.$emit('toggleFilterMenu');
            };
            $filter.toggle = function() {
                $filter.config.closeFilterMenu = !$filter.config.closeFilterMenu;
                $scope.$emit('toggleFilterMenu');
            };
            $filter.selectItem = function(item) {
                $filter.onSelect({item: item});
                $filter.close();
            };
            //Click away for filter dropdown
            $scope.$watch('$filter.config.closeFilterMenu', function(value){
                //Since we do not have dropdown on mobiles simply returning from the current function.
                if(DeviceBreakpointService.maxPotraitTablet()){
                    return;
                }
                if(!$filter.config.closeFilterMenu){
                    $timeout(function(){
                        if(UserAgent.isIOS()){
                            $document.bind('touchstart', closeDropdown);
                        }else{
                            $document.bind('click', closeDropdown);
                        }
                    });
                }else{
                    $timeout(function(){
                        if(UserAgent.isIOS()){
                            $document.unbind('touchstart', closeDropdown);
                        }else{
                            $document.unbind('click', closeDropdown);
                        }
                    });
                }
            });
            //Close dropdown
            var closeDropdown = function( event ) {
                /*If click/touchstart is from dropdown ignore it as we already call toggle which takes
                care of this case*/
                if($(event.target).is($filter.dropdownPanel)){
                    return;
                }
                //If click is dropdown menu itself ignore it
                if( event && $filter.dropdownPanel && $filter.dropdownPanel.find(event.target).length ) {
                    return;
                }
                //Clicked outside dropdown: close the dropdown
                $scope.$apply(function () {
                    $filter.config.closeFilterMenu = true;
                });
                $scope.$emit('toggleFilterMenu');
            };
        }

        function postLink(scope, element, attr, $filter) {
            var cleanUpFunc = $rootScope.$on('filterBarRendered', function(event, data) {
                if(data.isDesktop){
                    $filter.dropdownPanel = data.element;
                    buildFilterMenu($filter.config.desktopTemplateUrl, data.element, scope);
                    $('.desktopFilterMenuContainer').bind('click', function(cEvent) {
                        cEvent.stopPropagation();
                    });
                }else{
                    buildFilterMenu($filter.config.mobileTemplateUrl, element, scope);
                }
            });

            //Unregister events when out of scope
            scope.$on('$destroy', function() {
                cleanUpFunc();
            });

        }

        function buildFilterMenu (url, baseElement, scope) {
            $templateRequest(url)
                .then(function(html){
                    var template = angular.element(html);
                    baseElement.append( template );
                    $compile(template)(scope);
                })
                .catch( function(reason) {
                    console.error('Failed to load template: ' + url + ' [' + reason + ']');
                });
        }


    });

})(angular.module('com.vmware.greenbox.appCenter'));
