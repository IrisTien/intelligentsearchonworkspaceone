(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/bookmarks/bookmarkContextDialog.html',
    '<section class="bookmark-contextdialog-container" ng-controller="BookmarkItemContextDialogController as dialogCtrl">\n' +
    '    <!--previously the scrim is wrapped inside the button tag and use the contextDialogDirective to close it-->\n' +
    '    <!--this cause some issue in mobile safari and chrome, the long-press activated the close action -->\n' +
    '    <div class="bookmark-contextdialog-scrim" ></div>\n' +
    '    <div class="bookmark-contextdialog-content">\n' +
    '\n' +
    '        <button class="bookmark-contextdialog-close-button-container">\n' +
    '            <svg svg-symbol="icon-close" class="close-button-icon"></svg>\n' +
    '        </button>\n' +
    '\n' +
    '        <div class="bookmark-contextdialog-header">\n' +
    '            <div class="bookmark-contextdialog-app-icon" ng-style="{\'background-image\':(\'url(\'+ app.icon+\')\')}"></div>\n' +
    '            <h2 class="bookmark-contextdialog-app-name">{{app.name}}</h2>\n' +
    '            <p class="bookmark-contextdialog-app-types">{{\'app.details.label.type.\'+app.subType | i18n}}</p>\n' +
    '\n' +
    '            <p class="bookmark-contextdialog-app-description">{{::dialogCtrl.appDescription}}</p>\n' +
    '\n' +
    '            <p ng-if="app.categories.length > 0" class="bookmark-contextdialog-app-category">\n' +
    '                <span class="category-label">{{::\'app.details.label.category\' | i18n}}</span>\n' +
    '                <span ng-repeat="category in app.categories"><span>{{category}}</span>{{$last ? \'\' : \', \'}}</span>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <div class="bookmark-contextdialog-actions">\n' +
    '            <ul class="bookmark-contextdialog-actions-list">\n' +
    '                <li ng-if="app.viewClientLaunchEnabled">\n' +
    '                    <a ng-click="bookmarkItemCtrl.openWithViewClient(bookmarkItemCtrl.app, $event)">\n' +
    '                        <svg svg-symbol="icon-horizon-small" class="branding-icon-primary"></svg>\n' +
    '                        <span>{{::\'myapps.dialog.openAppWithViewClient\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="app.viewBrowserLaunchEnabled">\n' +
    '                    <a ng-click="bookmarkItemCtrl.openWithBrowser(bookmarkItemCtrl.app, $event)" ng-show="bookmarkItemCtrl.isViewOptionSupported(bookmarkItemCtrl.app, \'BROWSER\')">\n' +
    '                        <svg svg-symbol="icon-horizon-browser" class="branding-icon-primary"></svg>\n' +
    '                        <span>{{::\'myapps.dialog.openAppWithBrowser\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="app.isViewResourceEnabled">\n' +
    '                    <a class="launchApp" id="pt-launchapp-link" ng-click="bookmarkItemCtrl.launchApp(bookmarkItemCtrl.app, $event)">\n' +
    '                        <svg svg-symbol="icon-openapp-small" class="branding-icon-primary"></svg>\n' +
    '                        <span ng-if="app.type === \'WEB\'">{{::\'myapps.dialog.openAppWithBrowser\' | i18n}}</span>\n' +
    '                        <span ng-if="app.type !== \'WEB\'">{{::\'myapps.dialog.openApp\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li>\n' +
    '                    <a class="detailLink" id="pt-detail-link" ng-click="dialogCtrl.appDetails(app);">\n' +
    '                        <svg svg-symbol="icon-show-details" class="branding-icon-primary"></svg>\n' +
    '                        <span>{{::\'app.details.label.seeFullDetails\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="!bookmarksCtrl.hideCatalogTab">\n' +
    '                    <a class="hideApp" id="pt-removeapp-link" ng-click="dialogCtrl.hideApp(app, bookmarksCtrl.visibleLauncherApps, $index, $event);">\n' +
    '                        <svg svg-symbol="icon-trash" class="branding-icon-primary"></svg>\n' +
    '                        <span>{{::\'app.details.label.removeBookmark\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="app.resetAllowed">\n' +
    '                    <a class="resetDesktop" ng-click="resetDesktop(app, $event)">\n' +
    '                        <svg svg-symbol="icon-power" class="branding-icon-primary"></svg>\n' +
    '                        <span>{{::\'app.details.label.resetDektop\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="app.usePerAppPassword" class="bookmark-contextdialog-action-setapppassword">\n' +
    '                    <a ng-click="openSetAppPasswordDialog(app, $event)">\n' +
    '                        <svg svg-symbol="icon-set-password" class="set-app-password-icon branding-icon-primary"></svg>\n' +
    '                        <span>{{::\'app.details.label.setAppPassword\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/bookmarks/bookmarkItem.html',
    '<!-- only trigger the long-hold on mobile devices using bookmarkItemCtrl.onMobileDevice property (which at the moment set to isAWJade)\n' +
    '     and through brwoser screen resize is small than 540px -->\n' +
    '<div  class="bookmark-app-item" ng-click="bookmarksCtrl.sortableOptions.disabled && bookmarkItemCtrl.launchApp(bookmarkItemCtrl.app, $event)"\n' +
    '      hm-hold="bookmarksCtrl.sortableOptions.disabled && bookmarkItemCtrl.triggerContextdialog($event)" ng-class="{\'dots-windows\': appCenterCtrl.isWindowsBrowser, \'dots-nowindows-mobile\': appCenterCtrl.isMobileNonWindowBrowser}">\n' +
    '  <!--  use the .bookmark-item-actions to activate the contextDialog -->\n' +
    '    <div class="bookmark-item-actions" ng-hide="!bookmarksCtrl.sortableOptions.disabled" contextdialog="{uris:{\'contextdialogTemplate\':(true)}, scope:{app:bookmarkItemCtrl.app}}"\n' +
    '         contextdialogTemplate="app-v2/bookmarks/bookmarkContextDialog.html" contextDialogTP="540">\n' +
    '        <svg svg-symbol="icon-dots" class="icon-bookmark-context-trigger"></svg>\n' +
    '    </div>\n' +
    '    <div class="bookmark-app-icon" image-load>\n' +
    '      <img ng-src="{{bookmarkItemCtrl.app.icon}}">\n' +
    '    </div>\n' +
    '\n' +
    '    <p class="bookmark-app-caption" line-clamp2 content="::bookmarkItemCtrl.app.name" lines="2"></p>\n' +
    '\n' +
    '    <div ng-if="app.disabledThinApps" class="thinapp-tooltip" ng-show="bookmarksCtrl.sortableOptions.disabled" tooltip tooltiptext="appCenter.nav.arrange.tooltip" triggerelement="bookmark-app-item" triggerdelay="500"></div>\n' +
    '\n' +
    '    <div ng-if="!app.disabledThinApps" class="nonthinapp-tooltip" ng-show="bookmarksCtrl.sortableOptions.disabled" tooltip tooltiptext="app.tooltip.clicktolaunch" triggerelement="bookmark-app-item" triggerdelay="500"></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/bookmarks/bookmarks.html',
    '<div ng-show="bookmarksCtrl.isLoading" class="apps-loading">\n' +
    '    <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '</div>\n' +
    '<article id="bookmarks-container" class="bookmarks content-container-scrollable" infinite-scroll onend="bookmarksCtrl.getNextPage()" ng-class="{\'disable-scroll\': appCenterCtrl.$state.current.activeTab == \'details\'}">\n' +
    '    <div class="content width-boundary">\n' +
    '        <section ng-if="appCenterCtrl.isAWJadeMobile && !appCenterCtrl.isAWJadeDocked && bookmarksCtrl.showBookmarksTooltip && !bookmarksCtrl.showNoAppsMsg" class="coachmarks">\n' +
    '            <h3 class="coachmark-header">{{::\'app.coachmarks.bookmarkTitle\' | i18n }}</h3>\n' +
    '            <p class="coachmark-message">{{::\'app.coachmarks.bookmarkMessage\' | i18n }}</p>\n' +
    '            <div class="coachmark-button-container">\n' +
    '                <a class="coachmark-button primary" ng-click="::bookmarksCtrl.closeTooltip()">{{::\'app.coachmarks.buttonText\' | i18n }}</a>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="sort-container content-body" id="sort-button" ng-if="!bookmarksCtrl.excludeThinApps" ng-show="bookmarksCtrl.visibleLauncherApps.length > 1">\n' +
    '\n' +
    '            <div class="sort-help-text branding-portal-text" ng-show="!bookmarksCtrl.sortableOptions.disabled && bookmarksCtrl.isTouchEnabled">{{::\'app.bookmarking.touch.disabled\'  | i18n}}</div>\n' +
    '            <div class="sort-section branding-portal-text" ng-show="bookmarksCtrl.sortableOptions.disabled">\n' +
    '                <div class="save-arrange" ng-click="bookmarksCtrl.enableSorting()">\n' +
    '                    <svg svg-symbol="icon-rearrange" class="icon-rearrange" ng-show="bookmarksCtrl.sortType.model === \'custom\'"></svg>\n' +
    '                    <span ng-show="bookmarksCtrl.sortType.model === \'custom\'">\n' +
    '                    {{::\'appCenter.nav.arrange\' | i18n}}\n' +
    '                </span>\n' +
    '                </div>\n' +
    '                <div dropdown-list class="dropdown-toggle-sort">\n' +
    '                    <span class="sort-label branding-portal-text">{{bookmarksCtrl.sortType.text}}</span>\n' +
    '                    <svg svg-symbol="icon-down-caret" class="sort-down-caret"></svg>\n' +
    '                    <div dropdown-panel-body class="sort-dropdown-container branding-portal-text" id= "pt-sort-dropdown" ng-include="\'app-v2/common/sortOrder.html\'">\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="sort-section" ng-hide="bookmarksCtrl.sortableOptions.disabled || bookmarksCtrl.savingBookmark">\n' +
    '                <span class="sort-action sort-cancel" ng-click="bookmarksCtrl.cancelSorting()">{{::\'button.cancel\' | i18n}}</span>\n' +
    '                <span class="sort-action sort-save" ng-click="bookmarksCtrl.saveCustomView()">{{::\'button.save\' | i18n}}</span>\n' +
    '            </div>\n' +
    '            <div class="sort-section" ng-show="bookmarksCtrl.savingBookmark">\n' +
    '                <span class="sort-action" ng-click="bookmarksCtrl.saveCustomView()">{{::\'appCenter.nav.arrange.saving\' | i18n}}</span>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="content-body" ng-class="{\'grid-sortable\': !bookmarksCtrl.sortableOptions.disabled}" pull-to-refresh="bookmarksCtrl.clearCache()" scroll-container=".bookmarks.content-container-scrollable">\n' +
    '            <div class="grid-container" ui-sortable="bookmarksCtrl.sortableOptions" ng-model="bookmarksCtrl.visibleLauncherApps">\n' +
    '                <div bookmark-item ng-repeat="app in bookmarksCtrl.visibleLauncherApps" class="grid-item"\n' +
    '                     ng-class="{\'disabled-thin-app\': app.disabledThinApps}"></div>\n' +
    '                <div ng-repeat="item in bookmarksCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                <div ng-class="{\'empty-bookmarkmsg-show\': bookmarksCtrl.showNoAppsMsg}" class="bookmark-empty-message-container">\n' +
    '                    <ng-include src="\'app-v2/svgincludes/illo-empty-bookmark.html\'" class="illo-empty-bookmark"></ng-include>\n' +
    '                    <p ng-if="!bookmarksCtrl.hideCatalogTab" class="bookmark-empty-message">{{::\'myapps.bookmarks.empty.message\' | i18n }}</p>\n' +
    '                    <p ng-if="bookmarksCtrl.hideCatalogTab" id="hide-catalog-no-bookmarks" class="bookmark-empty-message">{{::\'myapps.bookmarks.empty.hidecatalog.message\' | i18n }}</p>\n' +
    '                    <a ng-if="!bookmarksCtrl.hideCatalogTab" class="bookmark-empty-add" ng-href="#/catalog">{{::\'myapps.bookmarks.empty.addbookmarks\' | i18n }}</a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '<div ng-show="appCenterCtrl.$state.current.activeTab == \'details\'" class="content-container app-details" ui-view></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/catalog.html',
    '<div ng-show="catalogCtrl.isLoading" class="apps-loading">\n' +
    '    <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '</div>\n' +
    '<article id="catalog-container" class="catalog content-container-scrollable" infinite-scroll onend="catalogCtrl.getNextPage()" control="appCenterCtrl.scrollCtrl" ng-class="{\'disable-scroll\': appCenterCtrl.$state.current.activeTab == \'details\'}">\n' +
    '    <div class="content width-boundary">\n' +
    '        <section ng-if="catalogCtrl.showCatalogTooltip" class="coachmarks">\n' +
    '            <h3 class="coachmark-header">{{::\'app.coachmarks.catalogTitle\' | i18n }}</h3>\n' +
    '            <p class="coachmark-message">{{::\'app.coachmarks.catalogMessage\' | i18n }}</p>\n' +
    '            <div class="coachmark-button-container">\n' +
    '                <a class="coachmark-button primary" ng-click="::catalogCtrl.closeTooltip()">{{::\'app.coachmarks.buttonText\' | i18n }}</a>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="content-sidebar" ng-include="\'app-v2/catalog/catalogFilterDesktop.html\'" ng-class="{\'coachmarks-on\': catalogCtrl.showCatalogTooltip}">\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="content-body-with-sidebar" pull-to-refresh="catalogCtrl.clearCache()" scroll-container=".catalog.content-container-scrollable">\n' +
    '            <div class="grid-container" id="scroll-top-container">\n' +
    '                <div ng-if="catalogCtrl.visibleCatalogApps.length">\n' +
    '                    <p class="category-filter-name branding-portal-text" ng-hide="catalogCtrl.appCenterContext.selectedCategory.type && catalogCtrl.appCenterContext.selectedCategory.type ==\'all\'">\n' +
    '                        <span class="catagory-name-label"> {{catalogCtrl.appCenterContext.selectedCategory.name}}</span>\n' +
    '                        <span class="cagetory-filter-number">{{catalogCtrl.visibleCatalogApps.length}}</span>\n' +
    '                        <span ng-click="catalogCtrl.showAllCategories()" class="category-clear-all"><svg svg-symbol="icon-clearcategory"></svg></span>\n' +
    '                    </p>\n' +
    '                    <div catalog-item ng-repeat="app in catalogCtrl.visibleCatalogApps" class="grid-item" appdata="app"></div>\n' +
    '                    <div ng-repeat="item in catalogCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '                <div ng-if="catalogCtrl.showNoResultsMsg" class="empty-catalog">\n' +
    '                    <ng-include src="\'app-v2/svgincludes/illo-empty-search.html\'" class="illo-empty-catalog"></ng-include>\n' +
    '                    <p>{{::\'appCenter.catalog.empty\' | i18n }}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '\n' +
    '<section class="categories-filter-mobile" ng-include="\'app-v2/catalog/catalogFilterMobile.html\'">\n' +
    '</section>\n' +
    '<div ng-show="appCenterCtrl.$state.current.activeTab == \'details\'" class="content-container app-details" ui-view></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/catalogContainer.html',
    '<article id="catalog-container" class="catalog content-container-scrollable" infinite-scroll onend="catalogCtrl.getNextPage()" ng-class="{\'recommended-apps\': appCenterCtrl.directEnrollmentEnabled}">\n' +
    '    <div class="content width-boundary">\n' +
    '        <section ng-if="catalogCtrl.showCatalogTooltip" class="coachmarks">\n' +
    '            <h3 class="coachmark-header">{{::\'app.coachmarks.catalogTitle\' | i18n }}</h3>\n' +
    '            <p class="coachmark-message">{{::\'app.coachmarks.catalogMessage\' | i18n }}</p>\n' +
    '            <div class="coachmark-button-container">\n' +
    '                <a class="coachmark-button primary" ng-click="::catalogCtrl.closeTooltip()">{{::\'app.coachmarks.buttonText\' | i18n }}</a>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="content-sidebar" ng-include="\'app-v2/catalog/catalogFilterDesktop.html\'" ng-class="{\'coachmarks-on\': catalogCtrl.showCatalogTooltip}">\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="content-body-with-sidebar" pull-to-refresh="catalogCtrl.clearCache()" scroll-container=".catalog.content-container-scrollable">\n' +
    '            <div class="grid-container">\n' +
    '                <p class="category-filter-name" ng-hide="catalogCtrl.appCenterContext.selectedCategory.type && catalogCtrl.appCenterContext.selectedCategory.type ==\'all\'">{{catalogCtrl.appCenterContext.selectedCategory.name}} <span class="cagetory-filter-number">{{catalogCtrl.visibleCatalogApps.length}}</span></p>\n' +
    '                <div catalog-item ng-repeat="app in catalogCtrl.visibleCatalogApps" class="grid-item" appdata="app"\n' +
    '                     on-select-recommended-app="catalogCtrl.recommendedAppsStatusChanged()"></div>\n' +
    '                <div ng-repeat="item in catalogCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                <div ng-if="catalogCtrl.showNoResultsMsg" class="empty-catalog">\n' +
    '                    <svg svg-symbol="illo-empty-search" class="icon-empty-search"></svg>\n' +
    '                    <p>{{::\'appCenter.catalog.empty\' | i18n }}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '\n' +
    '<section class="categories-filter-mobile" ng-include="\'app-v2/catalog/catalogFilterMobile.html\'">\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/catalogFilterDesktop.html',
    '<div class="categories-filter-desktop">\n' +
    '    <ul class="categories-filter scrollable" prevent-parent-scroll>\n' +
    '        <li class="categories-default-filter" ng-repeat="label in catalogCtrl.defaultLabels"\n' +
    '            ng-class="[label.type, {\'is-selected\':catalogCtrl.appCenterContext.selectedCategory.name == label.name}]">\n' +
    '            <a title="{{::label.name}}"\n' +
    '               ng-click="catalogCtrl.filterByLabel(label);"><span>{{::label.name}}</span></a>\n' +
    '        </li>\n' +
    '        <li class="categories-separator"></li>\n' +
    '        <li ng-repeat="category in catalogCtrl.appCategories"\n' +
    '            ng-class="{\'is-selected\':catalogCtrl.appCenterContext.selectedCategory.name == category.name}" title="{{::category.name}}" ng-click="catalogCtrl.filterByLabel(category)">\n' +
    '            <span>{{::category.name}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/catalogFilterMobile.html',
    '<div class="mobile-catalog-filter-header">\n' +
    '    <div id="mobile-filter-close-button" class="icon-mobile-filter-close-button" ng-click="appCenterCtrl.closeMobileFilter()">\n' +
    '        <svg svg-symbol="icon-close"></svg>\n' +
    '    </div>\n' +
    '    <h2>{{::\'myapp.nav.mobile.filter.pagetitle\' | i18n }}</h2>\n' +
    '</div>\n' +
    '<div class="categories-fillter-mobile-content">\n' +
    '    <div class="categories-fillter-mobile-content-scrollable">\n' +
    '    <ul class="categories-filter default-filter-list-mobile">\n' +
    '        <li class="categories-default-filter"\n' +
    '            ng-repeat="label in catalogCtrl.defaultLabels"\n' +
    '            ng-class="[label.type, {\'is-selected\':catalogCtrl.appCenterContext.selectedCategory.name == label.name}]"\n' +
    '            id="mobile-categories-all"\n' +
    '            ng-click="catalogCtrl.filterByLabel(label);">\n' +
    '            <span>{{::label.name}}</span>\n' +
    '            <svg svg-symbol="icon-check" class="icon-category-filter-check branding-icon-primary"></svg>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '    <ul class="categories-filter">\n' +
    '        <li ng-repeat="category in catalogCtrl.appCategories"\n' +
    '            ng-class="{\'is-selected\':catalogCtrl.appCenterContext.selectedCategory.name == category.name}" title="{{::category.name}}" ng-click="catalogCtrl.filterByLabel(category)">\n' +
    '            <span>{{::category.name}}</span>\n' +
    '            <svg svg-symbol="icon-check" class="icon-category-filter-check branding-icon-primary"></svg>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/catalogItem.html',
    '<div class="catalog-item" ng-class="{\'tunnel-tile\': catalogItemCtrl.app.isTunnelRequired}">\n' +
    '    <svg svg-symbol="icon-tunnel" class="catalog-tunnel-icon-tablet" ng-if="catalogItemCtrl.app.isTunnelRequired"></svg>\n' +
    '    <div class="catalog-item-click-area" ng-click="catalogItemCtrl.itemClicked(catalogItemCtrl.app.appId)">\n' +
    '        <div class="catalog-app-icon" image-load>\n' +
    '            <img ng-src="{{catalogItemCtrl.app.backgroundImage}}">\n' +
    '        </div>\n' +
    '        <p line-clamp2 lines="2" content="::catalogItemCtrl.app.name" class="catalog-item-caption"></p>\n' +
    '        <p class="catalog-item-type">\n' +
    '            <svg ng-if="catalogItemCtrl.app.isHorizonResource || catalogItemCtrl.app.isHorizonAirResource" svg-symbol="icon-horizon-watermark"></svg>\n' +
    '            {{::catalogItemCtrl.app.appTypeDisplayVal}}\n' +
    '        </p>\n' +
    '        <p class="vpn-required-message" ng-if="catalogItemCtrl.app.isTunnelRequired">\n' +
    '            <svg svg-symbol="icon-tunnel" class="catalog-tunnel-icon-mobile"></svg>\n' +
    '            {{ ::\'app.tunnel.header\' | i18n }}\n' +
    '        </p>\n' +
    '        <div ng-if= "!catalogItemCtrl.directEnrollmentEnabled" tooltip tooltiptext="app.tooltip.viewdetails" triggerelement="catalog-item-click-area"></div>\n' +
    '        <div ng-if= "catalogItemCtrl.directEnrollmentEnabled" class="catalog-item-actions recommended-apps-select-action">\n' +
    '            <a class="catalog-button recommended-app-selector" ng-class="{\'app-selected\': catalogItemCtrl.app.isSelected}">\n' +
    '                <div class="icon-recommended-app-bg"></div>\n' +
    '                <svg svg-symbol="icon-recommended-app-selector"></svg>\n' +
    '            </a>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if= "!catalogItemCtrl.directEnrollmentEnabled" catalog-item-actions class="catalog-item-actions branding-icon-primary" app="catalogItemCtrl.app" stop-event="click"></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/entitlementNotLoadedMsgTemplate.html',
    '<div ng-controller="EntitlementErrorController as entitlementErrCtr" class="notify-message-container" ng-class="message.type + \'-\'">\n' +
    '    <button class="notify-close-button" ng-click="close($index)">\n' +
    '        <svg svg-symbol="icon-notify-close" class="message-icon"></svg>\n' +
    '    </button>\n' +
    '\n' +
    '\n' +
    '    <div id="more-details-error-info" ng-switch="message.argument" class="message-body entitlement-notloaded">\n' +
    '        <p ng-if="entitlementErrCtr.hideDetail">{{::message.text}}\n' +
    '            <br/>\n' +
    '            <a class="link" id="more-details-link" ng-click="entitlementErrCtr.hideDetail=!entitlementErrCtr.hideDetail">{{ ::\'appCenter.device.moreDetails\' | i18n }}</a>\n' +
    '        </p>\n' +
    '        <p ng-switch-when="MDM_DEVICE_NOT_ENROLLED" ng-if="!entitlementErrCtr.hideDetail && !(entitlementErrCtr.isAndroid && entitlementErrCtr.isAWJade2_0)">{{::entitlementErrCtr.detail}}\n' +
    '            <br/>\n' +
    '            <a class="link" ng-click="entitlementErrCtr.enroll($event, $index)">{{::\'appCenter.device.register\' | i18n}}</a>\n' +
    '        </p>\n' +
    '        <p ng-switch-default ng-if="!entitlementErrCtr.hideDetail">{{::entitlementErrCtr.detail}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/hubThinApps.html',
    '<div modal-new="modal-confirmation" class="hub-modal-thinapps-in-package hub-modal-container">\n' +
    '    <section class="dialog-container" ng-controller="ThinappsInPackageController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <div class="left-panel">\n' +
    '                <h3 class="modal-title">{{::app.name}}</h3>\n' +
    '                <p class="thinapp-info modal-content-text"><span>{{::\'app.thinappsInPackage.info\' | i18n}} </span>|  <span> {{\'app.thinappsInPackage.noOfAppsInPackage\' | i18n:ctrl.visibleCatalogApps.length}} </span></p>\n' +
    '            </div>\n' +
    '            <div class="search-form modal-thinapp right-panel">\n' +
    '                <div class="search-input-bar search-thinapp">\n' +
    '                    <label>\n' +
    '                        <svg svg-symbol="icon-searchglass"></svg>\n' +
    '                    </label>\n' +
    '                    <input type="text"\n' +
    '                           ng-model="ctrl.searchString"\n' +
    '                           placeholder="{{ ::\'app.thinappsInPackage.search.placeholder\' | i18n }}"\n' +
    '                           class="search-inputfield"\n' +
    '                           autocorrect="off"\n' +
    '                           autocapitalize="off" />\n' +
    '                    <button class="search-clear-button" id="pt-search-clear-button" ng-click="ctrl.clearSearch()" ng-show="ctrl.searchString">\n' +
    '                        <svg svg-symbol="icon-circle-x"></svg>\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="thinapp-info filtered-thinapps-msg" ng-if="ctrl.searchString">{{\'app.thinappsInPackage.noOfFilteredAppsInPackage\' | i18n:searchResults.length}}</p>\n' +
    '            <div class="apps-module-content">\n' +
    '                <div class="grid-container">\n' +
    '                    <app-item class="grid-item app-item"\n' +
    '                              ng-repeat="app in ctrl.visibleCatalogApps | searchThinappPackageFor:ctrl.searchString as searchResults"\n' +
    '                              app="app" modalobj="$modal" favorite-enabled="ctrl.favoritesEnabled"></app-item>\n' +
    '                    <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                    <div class="grid-item-empty" ng-repeat="app in ctrl.emptyCatalogModalFillers"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="$modal.close()">{{::\'button.close\' | i18n}}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary"\n' +
    '                    ng-if="!ctrl.customizationLoadFromDbFailed"\n' +
    '                    ng-click="ctrl.bookmarkAll();$modal.close()">\n' +
    '                {{::\'hub.thinAppsInPackage.button.favoriteAll\' | i18n}}\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/hubVppInviteAccept.html',
    '<div modal-new class="hub-vpp-registration-modal">\n' +
    '    <section class="dialog-container hub-modal-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3 class="modal-title">{{ ::title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="modal-content-text" ng-bind-html="message"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="modal.cancel()">{{ ::\'decline\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="modal.close(true)">{{ ::\'appCenter.acceptInvite\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/recommendedAppInstallModal.html',
    '<div modal-new="modal-alert" class="recommended-apps-install-modal">\n' +
    '    <section class="dialog-container no-header">\n' +
    '        <div class="dialog-body">\n' +
    '            <h2 ng-show="title">{{ title | i18n }}</h2>\n' +
    '            <p class="recommended-apps-install-message" ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions one-action">\n' +
    '            <button class="button-action primary-action" ng-click="$modal.close()">{{ ok | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/recommendedAppsContainer.html',
    '<header ng-if="catalogCtrl.visibleCatalogApps.length" class="recommended-apps-header header-container branding-portal-header-background branding-portal-header-text" ng-class="{\'docked-style\': appCenterCtrl.isAWJadeDocked}">\n' +
    '    <div class="header-left branding-portal-header-text">\n' +
    '        <div class="skip-button" ng-click="catalogCtrl.skipInstallRecommendedApps()">{{:: \'recommendedApps.skip\' | i18n }}</div>\n' +
    '    </div>\n' +
    '    <div class="header-center">\n' +
    '        <div class="mobile-title-container">\n' +
    '            <h2>{{appCenterCtrl.$state.current.mobilePageTitle | i18n}}</h2>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="header-right">\n' +
    '        <div class="recommended-apps-select-all" ng-click="catalogCtrl.toggleSelectAllRecommendedApps()" ng-class="{\'select-all\': catalogCtrl.selectAllRecommendedApps }">\n' +
    '            <!-- because of the branding issue we use two svg to achieve the selected and not selected effect -->\n' +
    '            <svg svg-symbol="icon-recommended-app-all" class="icon-recommended-app-all"></svg>\n' +
    '            <svg svg-symbol="icon-recommended-app-selector" class="icon-recommended-app-selector"></svg>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</header>\n' +
    '<article ng-if="catalogCtrl.visibleCatalogApps.length" class="catalog content-container-scrollable recommended-apps" infinite-scroll onend="catalogCtrl.getNextPage()">\n' +
    '    <div class="content width-boundary">\n' +
    '        <section class="content-body">\n' +
    '            <div class="help-content">\n' +
    '                <svg svg-symbol="icon-recommended-apps" class="help-icon"></svg>\n' +
    '                <p class="help-text">{{::\'recommendedApps.text1\' | i18n }}</p>\n' +
    '                <p class="help-text">{{::\'recommendedApps.text2\' | i18n }}</p>\n' +
    '            </div>\n' +
    '            <div class="grid-container">\n' +
    '                <div catalog-item ng-repeat="app in catalogCtrl.visibleCatalogApps" class="grid-item" appdata="app"\n' +
    '                     on-select-recommended-app="catalogCtrl.recommendedAppsStatusChanged()"></div>\n' +
    '                <div ng-repeat="item in catalogCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '<div ng-if="catalogCtrl.visibleCatalogApps.length" class="recommended-apps-toolbar">\n' +
    '    <div class="install-button" ng-class= "{\'install-disabled\': catalogCtrl.recommendedAppsCount == 0 }" ng-click="catalogCtrl.bulkInstall()" >{{::\'recommendedApps.install\' | i18n }} <span class="selected-appcount">{{catalogCtrl.recommendedAppsCount}}</span> {{::\'recommendedApps.apps\' | i18n }}</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/thinappMultiDeviceActivation.html',
    '<div modal-new="modal-confirmation" class="modal-thinapps-in-package modal-thinapp-devices">\n' +
    '    <section class="dialog-container" ng-controller="ThinappMultiDeviceActivationController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h2>{{app.name}}</h2>\n' +
    '            <p class="thinapp-info"><span>{{::\'app.thinappMultiDeviceAct.heading\' | i18n:ctrl.app.name}} </span>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="empty-devices-message" ng-if="ctrl.deviceReqs.length < 1 && !ctrl.isLoading">\n' +
    '                <ng-include src="\'app-v2/svgincludes/illo-empty-device.html\'" class="illo-empty-device"></ng-include>\n' +
    '                <p>{{::\'app.devices.emptyDeviceListMessage\' | i18n}}</p>\n' +
    '            </div>\n' +
    '            <ul class="thinapp-device-list" ng-if="ctrl.deviceReqs.length > 0 && !ctrl.isLoading">\n' +
    '                <li class="thinapp-device-heading">\n' +
    '                    <span class="thinapp-device-heading-name">{{::\'app.thinappMultiDeviceAct.tableColumn.deviceName\' | i18n }}</span>\n' +
    '                    <span class="thinapp-device-heading-time"> {{::\'app.thinappMultiDeviceAct.tableColumn.requestStatus\' | i18n}}</span>\n' +
    '                </li>\n' +
    '\n' +
    '                <li ng-repeat="device in ctrl.deviceReqs track by $index">\n' +
    '                    <span class="thinapp-device-name">{{::device.machineName}}</span>\n' +
    '                    <span class="thinapp-device-req-msg">\n' +
    '                        {{::ctrl.getThinappRequestStatusMsg(device)}}\n' +
    '                    </span>\n' +
    '                    <span class="thinapp-device-req-action" ng-show="ctrl.isRequestable(device)">\n' +
    '                        <a ng-click="ctrl.requestThinAppOnADevice(device.userDeviceId)">\n' +
    '                            {{::\'app.thinappMultiDeviceAct.button.request\' | i18n }}\n' +
    '                        </a>\n' +
    '                    </span>\n' +
    '                    <span class="thinapp-device-req-check" ng-show="!ctrl.isRequestable(device)">\n' +
    '                        <svg svg-symbol="icon-check"></svg>\n' +
    '                    </span>\n' +
    '\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <div class="thinapps-buttons-container">\n' +
    '                <button class="setting-button secondary-button thinapp-done-btn" ng-click="$modal.close()">{{::\'app.thinappsInPackage.button.done\' | i18n}}</button>\n' +
    '            </div>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/thinapps.html',
    '<div modal-new="modal-confirmation" class="modal-thinapps-in-package">\n' +
    '    <section class="dialog-container" ng-controller="ThinappsInPackageController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h2>{{app.name}}</h2>\n' +
    '            <p class="thinapp-info"><span>{{::\'app.thinappsInPackage.info\' | i18n}} </span>|  <span> {{\'app.thinappsInPackage.noOfAppsInPackage\' | i18n:ctrl.visibleCatalogApps.length}} </span></p>\n' +
    '\n' +
    '            <div class="search-form modal-thinapp">\n' +
    '                <div>\n' +
    '                    <div class="search-input-bar search-thinapp">\n' +
    '                        <label>\n' +
    '                            <svg svg-symbol="icon-searchglass"></svg>\n' +
    '                        </label>\n' +
    '                        <input type="text"\n' +
    '                               ng-model="ctrl.searchString"\n' +
    '                               placeholder="{{ ::\'app.thinappsInPackage.search.placeholder\' | i18n }}"\n' +
    '                               class="search-inputfield"\n' +
    '                               autocorrect="off"\n' +
    '                               autocapitalize="off" />\n' +
    '                        <button class="search-clear-button" id="pt-search-clear-button" ng-click="ctrl.clearSearch()" ng-show="ctrl.searchString">\n' +
    '                            <svg svg-symbol="icon-circle-x"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="thinapp-info filtered-thinapps-msg" ng-if="ctrl.searchString != \'\'">{{\'app.thinappsInPackage.noOfFilteredAppsInPackage\' | i18n:searchResults.length}}</p>\n' +
    '            <div class="catalog">\n' +
    '                <div catalog-item ng-repeat="app in ctrl.visibleCatalogApps | searchThinappPackageFor:ctrl.searchString as searchResults" class="grid-item" appdata="app" modalobj="$modal"></div>\n' +
    '                <!--make sure to have the empty fillers otherwise the last row will not align properly-->\n' +
    '                <div ng-repeat="item in ctrl.emptyCatalogModalFillers" class="grid-item-empty"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <p class="thinapp-action-desc" line-clamp2 content="::ctrl.instruction" lines="2"></p>\n' +
    '            <div class="thinapps-buttons-container">\n' +
    '                <button class="setting-button secondary-button thinapp-done-btn" ng-click="$modal.close()">{{::\'app.thinappsInPackage.button.done\' | i18n}}</button>\n' +
    '                <button class="setting-button primary-button thinapp-bookmarkall-btn" ng-click="ctrl.bookmarkAll()">{{::\'app.thinappsInPackage.button.bookmarkAll\' | i18n}}</button>\n' +
    '            </div>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/catalog/vppInviteAccept.html',
    '<div modal-new class="vpp-registration-modal">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <h2>{{ ::title }}</h2>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="message"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="modal.cancel()">{{ ::\'decline\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="modal.close(true)">{{ ::\'appCenter.acceptInvite\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/cdnErrorPage/errorPage.html',
    '<html>\n' +
    '<head>\n' +
    '    Error Page\n' +
    '</head>\n' +
    '<body>\n' +
    '<p>404 Not Found</p>\n' +
    '</body>\n' +
    '</html>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/aboutDialog.html',
    '<div modal class="dialog centered-">\n' +
    '    <div class="dialog-body typography">\n' +
    '        <h3>{{ \'app.about.heading\' | i18n }}</h3>\n' +
    '        <p>\n' +
    '            {{\'app.about.copyright\' | i18n }}\n' +
    '        </p>\n' +
    '        <p>\n' +
    '            <button ng-click="$modal.close(true);" class="link- button"> {{\'button.cancel\' | i18n }}</button>\n' +
    '            <a target="_blank" ng-href="{{\'app.about.patentsLink\' | i18n}}" class="primary- button"> {{\'app.about.button.label.patents\' | i18n }}</a>\n' +
    '            <a ng-if="isOnPrem" target="_blank" ng-href="{{\'app.about.licenseAgreementLink\' | i18n}}" class="primary- button"> {{\'app.about.button.label.licenseAgreement\' | i18n }}</a>\n' +
    '            <a ng-if="!isOnPrem" target="_blank" ng-href="{{\'app.about.saasLicenseAgreementLink\' | i18n}}" class="primary- button"> {{\'app.about.button.label.licenseAgreement\' | i18n }}</a>\n' +
    '        </p>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appInstallConfirmPrompt.html',
    '<div modal-new>\n' +
    '    <section class="dialog-container app-install-modal" stop-event="click">\n' +
    '        <header class="dialog-header app-install-modal-header">\n' +
    '            <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"></svg>\n' +
    '            <h3>{{ ::title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div>\n' +
    '                <h2>{{ ::name }}</h2>\n' +
    '                <p ng-if="size"> {{ ::sizeMessage }}</p>\n' +
    '                <p ng-if="price">{{ \'app.details.label.price\' + \':\' + price }}</p>\n' +
    '                <p>{{ ::installMessage }}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="modal.cancel()">{{ ::\'appCenter.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="modal.close(true)" ng-if="ok">{{ ok | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="modal.close(true)" ng-if="!ok">{{ ::\'appCenter.install\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/clientAppDownloadDialog.html',
    '<div modal-new="modal-confirmation" class="launch-client-download-dialog">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"></svg>\n' +
    '            <h3>{{ ::title }}</h3>\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action launch-client-download-dialog-cancel-btn" ng-click="$modal.close()">{{ ::\'appCenter.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action launch-client-download-dialog-launch-btn" ng-click="appCenterCtrl.virtualClientAppInstalled(app);">{{ ::\'myapps.launch.title.launch\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/horizonResources/hubLaunchDesktopDialog.html',
    '<div modal-new="modal-confirmation" class="hub-modal-container view-preference-modal">\n' +
    '    <section class="dialog-container" ng-controller="ViewDesktopLaunchController as preferencesCtrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3 class="modal-title" ng-bind-html="app.name"></h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="modal-content-text">\n' +
    '                {{::\'hub.preferences.launch.question\' | i18n}}&nbsp;\n' +
    '                {{::\'myapps.launch.view.preferredClient.changeLaunchPrefTip\' | i18n }}\n' +
    '            </p>\n' +
    '            <fieldset class="preference-options-container">\n' +
    '                <label>\n' +
    '                    <input type="radio" value="NATIVE" id="native" class="preference-option-radio-input"\n' +
    '                           ng-model="preferencesCtrl.preferredClient"\n' +
    '                           ng-class="{\'native-selected\' : preferencesCtrl.preferredClient === \'NATIVE\'}"/>\n' +
    '                    <div class="preference-option-container">\n' +
    '                        <svg class="preference-option-icon horizon" svg-symbol="icon-horizonclient-green" ></svg>\n' +
    '                        <svg class="preference-checked primary-icon-color" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                    </div>\n' +
    '                    <p class="preference-option-text">{{::\'myapps.launch.view.preferredClient.horizonView\' | i18n }}</p>\n' +
    '                    <a class="primary-link-color" target="_blank" ng-show = "preferencesCtrl.preferredClient === \'NATIVE\'" ng-href="{{::preferencesCtrl.installLink }}">{{::\'appCenter.action.install\' | i18n }}</a>\n' +
    '                </label>\n' +
    '                <label>\n' +
    '                    <input type="radio" value="BROWSER" id="browser" class="preference-option-radio-input"\n' +
    '                           ng-model="preferencesCtrl.preferredClient"\n' +
    '                           ng-class="{\'browser-selected\' : preferencesCtrl.preferredClient === \'BROWSER\'}"/>\n' +
    '                    <div class="preference-option-container">\n' +
    '                        <svg class="preference-option-icon browser" svg-symbol="icon-browser"></svg>\n' +
    '                        <svg class="preference-checked primary-icon-color" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                    </div>\n' +
    '                    <p class="preference-option-text">{{::\'myapps.launch.view.preferredClient.browser\' | i18n }}</p>\n' +
    '                </label>\n' +
    '            </fieldset>\n' +
    '            <p class="launch-requirement" ng-if="preferencesCtrl.preferredClient === \'BROWSER\'">{{::\'myapps.launch.view.preferredClient.byBrowser.description\' | i18n }}</p>\n' +
    '            <p class="launch-requirement" ng-if="preferencesCtrl.showInstallViewClientMsg()" ng-bind-html="preferencesCtrl.byViewClientDescription"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="$modal.close()">{{::\'appCenter.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="preferencesCtrl.launchByPreference()"> {{::\'app.details.action.open\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/horizonResources/hubLaunchViewClientDialog.html',
    '<div modal-new="modal-confirmation" class="horizon-view-launch-modal">\n' +
    '    <section class="dialog-container" ng-controller="ViewDesktopLaunchController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-close-icon" ng-click="$modal.cancel(); $event.stopPropagation();"></svg>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="modal-app-list-item-icon" image-load>\n' +
    '                <img ng-src="{{app._links.icon.href}}">\n' +
    '            </div>\n' +
    '            <h3 class="modal-title" ng-bind-html="app.name"></h3>\n' +
    '            <p class="modal-content-text" ng-bind-html="ctrl.byViewClientDescription"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="$modal.close()">{{::\'hub.appLaunch.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="ctrl.launchByViewClient();">{{::\'hub.appLaunch.open\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/horizonResources/launchDesktopDialog.html',
    '<div modal-new="modal-confirmation" class="modal-view-launch-options">\n' +
    '    <section class="dialog-container" ng-controller="ViewDesktopLaunchController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h2>{{\'myapps.launch.openApp\' | i18n:app.name}}</h2>\n' +
    '        </header>\n' +
    '            <div class="dialog-body">\n' +
    '                <p>{{\'myapps.launch.view.selectPreferredLaunchClient\' | i18n }}</p>\n' +
    '                <p>{{\'myapps.launch.view.preferredClient.changeLaunchPrefTip\' | i18n }}</p>\n' +
    '                <fieldset class="preference-options-container">\n' +
    '                    <label>\n' +
    '                        <input type="radio" ng-model="ctrl.preferredClient" value="NATIVE" id="native" class="preference-option-radio-input"  />\n' +
    '                        <div class="preference-option-container" id="preference-option-icon-horizonclient">\n' +
    '                            <svg class="preference-option-icon horizon" svg-symbol="icon-horizonclient-green" ></svg>\n' +
    '                            <svg class="preference-checked" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                            <p class="preference-option-text">{{\'myapps.launch.view.preferredClient.horizonView\' | i18n }}</p>\n' +
    '                        </div>\n' +
    '                    </label>\n' +
    '\n' +
    '                    <label>\n' +
    '                        <input type="radio" ng-model="ctrl.preferredClient" value="BROWSER" id="browser" class="preference-option-radio-input" />\n' +
    '                        <div class="preference-option-container" id="preference-option-icon-browser">\n' +
    '                            <svg class="preference-option-icon browser" svg-symbol="icon-browser"></svg>\n' +
    '                            <svg class="preference-checked" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                            <p class="preference-option-text">{{\'myapps.launch.view.preferredClient.browser\' | i18n }}</p>\n' +
    '                        </div>\n' +
    '                    </label>\n' +
    '                </fieldset>\n' +
    '                <p class="launch-requirement" ng-if="ctrl.preferredClient == \'BROWSER\'">{{\'myapps.launch.view.preferredClient.byBrowser.description\' | i18n }}</p>\n' +
    '                <p class="launch-requirement" ng-if="ctrl.showInstallViewClientMsg()" ng-bind-html="ctrl.byViewClientDescription"></p>\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions two-action">\n' +
    '                <button class="button-action view-launch-options-cancel-btn secondary-action" ng-click="$modal.close()">{{ \'appCenter.cancel\' | i18n }}</button>\n' +
    '                <button class="button-action view-launch-options-open-btn primary-action" ng-click="ctrl.launchByPreference()"> {{\'app.details.action.open\' | i18n }}</button>\n' +
    '            </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/horizonResources/launchViewClientDialog.html',
    '<div modal-new="modal-confirmation">\n' +
    '    <section class="dialog-container" ng-controller="ViewDesktopLaunchController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"></svg>\n' +
    '            <h3>{{\'myapps.launch.openApp\' | i18n:app.name}}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="ctrl.byViewClientDescription"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="$modal.close()">{{ \'appCenter.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="ctrl.launchByViewClient();">{{\'button.openHorizonView\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/launchPasswordDialog.html',
    '<div modal-new="modal-confirmation" class="launch-password-dialog">\n' +
    '    <section class="dialog-container set-app-password" ng-controller="LaunchPasswordController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"/>\n' +
    '            <h2>{{\'app.launchPassword.heading\' | i18n}}</h2>\n' +
    '        </header>\n' +
    '            <div class="dialog-body">\n' +
    '            <div>\n' +
    '                <p>{{\'app.launchPassword.view.instruction\' | i18n:app.name}}</p>\n' +
    '            </div>\n' +
    '            <div class="error-text">{{ctrl.errMsg}}</div>\n' +
    '            <fieldset class="fieldset">\n' +
    '                <div class="field-div">\n' +
    '                    <p><p>{{:: \'userInfo.profile.username\' | i18n}}</p></p>\n' +
    '                    <input class="input-password-field input-large" type="text" ng-model="ctrl.userName" disabled>\n' +
    '                </div>\n' +
    '                <div class="field-div">\n' +
    '                    <p>{{\'userInfo.profile.password\' | i18n }}</p>\n' +
    '                    <input class="input-password-field input-large" type="password" ng-keypress="ctrl.handleEnter($event)" ng-model="ctrl.pwd" required/>\n' +
    '                </div>\n' +
    '            </fieldset>\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions two-action">\n' +
    '                <button class="button-action secondary-action launch-password-cancel-btn" ng-click="ctrl.handleCancel();">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button class="button-action primary-action launch-password-signin-btn" ng-click="ctrl.getLaunchUrls();" tabindex="0" ng-disabled="ctrl.pwd == \'\'"> {{\'app.launchPassword.button.label.signin\' | i18n }} </button>\n' +
    '            </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appLaunch/passwordvault/installPasswordVaultExtensionDialog.html',
    '<div modal-new="modal-confirmation" class="install-password-vault-extension-dialog">\n' +
    '    <div ng-controller="InstallPasswordVaultExtensionController as ctrl">\n' +
    '        <section class="dialog-container">\n' +
    '            <header class="dialog-header">\n' +
    '                <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"></svg>\n' +
    '                <h3>{{\'myapps.launch.openApp\' | i18n:app.name}}</h3>\n' +
    '                <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '            </header>\n' +
    '            <div class="dialog-body">\n' +
    '                <p ng-bind-html="ctrl.extensionDescription">{{ ctrl.extensionDescription | i18n }}</p>\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions two-action">\n' +
    '                <button class="button-action secondary-action install-password-vault-extension-dialog-cancel-btn" ng-click="$modal.close()">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button ng-click="ctrl.openApp();" class="button-action primary-action install-password-vault-extension-dialog-openapp-btn">{{\'myapps.launch.title.launch\' | i18n }}</button>\n' +
    '            </footer>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/appPromotionBanner.html',
    '<div class="promobanner-container" ng-if="appBannerCtrl.showPromoBanner">\n' +
    '    <svg svg-symbol="icon-close-popup" class="promobanner-close-button" ng-click="appBannerCtrl.close()"></svg>\n' +
    '    <div class="promobanner-content">\n' +
    '        <div class="promobanner-text">\n' +
    '            <ng-include src="\'app-v2/svgincludes/icon-ws1-lockup.html\'" class="icon-ws1-promobanner"></ng-include>\n' +
    '            <h2 class="promobanner-title">{{::\'appCenter\' | i18n }}</h2>\n' +
    '            <p class="promobanner-message">{{::\'app.promotion.banner.message\' | i18n }}</p>\n' +
    '\n' +
    '            <label class="promobanner-option-text">\n' +
    '                <input type="checkbox" ng-model="appBannerCtrl.pvsettings" value="donotSHOW" id="promobanner-donotshow" class="promobanner-settings-choice" ng-change="appBannerCtrl.setPromoBannerPreference()" />\n' +
    '                <p class="promobanner-preference">{{ ::\'app.promotion.banner.donotshowagain\' | i18n}}</p>\n' +
    '            </label>\n' +
    '        </div>\n' +
    '\n' +
    '        <p class="promobanner-actions">\n' +
    '            <button class="promobanner-action secondary-button" id="pt-promo-openinapp-link"  ng-click="appBannerCtrl.openWorkspaceOneApp()">{{ ::\'app.promotion.banner.open\' | i18n }}</button>\n' +
    '            <button class="promobanner-action primary-button" id="pt-promo-download-link" ng-click="appBannerCtrl.downloadApp()"> {{::\'app.promotion.banner.download\' | i18n }}</button>\n' +
    '        </p>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/checkDeviceEnrollmentStatus.html',
    '<div class="animated-loader">\n' +
    '    <div class="animated-container">\n' +
    '        <div class="animated-logo"></div>\n' +
    '        <p>{{ ::\'appCenter.device.getDeviceEnrollmentStatus\' | i18n}}</p>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/confirmLogout.html',
    '<div modal-new="modal-confirmation">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ ::\'app.logout.title\' | i18n }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ ::\'app.logout.confirm.msg\' | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="button-action secondary-action" ng-click="$modal.cancel();"> {{::\'button.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="appCenterCtrl.continueSignout($event);">{{ ::\'userInfo.signout\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/deviceList-desktopapp.html',
    '<div class="empty-devices-message-desktopapp" ng-if="devicesCtrl.devices.length < 1 && !devicesCtrl.isLoading">\n' +
    '    <ng-include src="\'app-v2/svgincludes/illo-empty-device.html\'"></ng-include>\n' +
    '    <p>{{::\'app.devices.emptyDeviceListMessage\' | i18n}}</p>\n' +
    '</div>\n' +
    '<ul class="device-list-desktopapp" ng-if="devicesCtrl.devices.length > 0 && !devicesCtrl.isLoading">\n' +
    '    <li ng-repeat="device in devicesCtrl.devices track by $index" ng-class="device.osFamily">\n' +
    '        <p class="device-icon-name">\n' +
    '            <ng-include src="device.iconfilename" class="device-icon"></ng-include>\n' +
    '            <span class="device-name">{{::device.machineName}}</span>\n' +
    '        </p>\n' +
    '        <p class="device-heading-time"> {{::\'app.devices.tableColumn.lastLoginTime\' | i18n}}</p>\n' +
    '        <p class="last-login-time">\n' +
    '            <span class="login-date-time">{{::device.lastLoginTime | date:\'medium\'}}</span>\n' +
    '        </p>\n' +
    '        <p class="unlink-device" ng-show="device.osFamily == \'Windows\'">\n' +
    '            <a class="unlink-device-link" ng-click="devicesCtrl.unlinkDevice(device, $event)">\n' +
    '                {{\'app.devices.unlinkDevice\' | i18n }}\n' +
    '            </a>\n' +
    '        </p>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/deviceList.html',
    '<h2 class="settings-detail-title">{{::\'app.devices.heading\' | i18n }}</h2>\n' +
    '<div class="empty-devices-message" ng-if="devicesCtrl.devices.length < 1 && !devicesCtrl.isLoading">\n' +
    '    <ng-include src="\'app-v2/svgincludes/illo-empty-device.html\'" class="illo-empty-device"></ng-include>\n' +
    '    <p>{{::\'app.devices.emptyDeviceListMessage\' | i18n}}</p>\n' +
    '</div>\n' +
    '<ul class="device-list" ng-if="devicesCtrl.devices.length > 0 && !devicesCtrl.isLoading">\n' +
    '    <li class="device-heading"><p class="device-heading-name">{{::\'app.devices.heading\' | i18n }}</p> <p class="device-heading-time"> {{::\'app.devices.tableColumn.lastLoginTime\' | i18n}}</p></li>\n' +
    '\n' +
    '    <li ng-repeat="device in devicesCtrl.devices track by $index" ng-class="device.osFamily">\n' +
    '        <p class="device-icon-name">\n' +
    '            <ng-include src="device.iconfilename"></ng-include>\n' +
    '            <span class="device-name">{{::device.machineName}}</span>\n' +
    '        </p>\n' +
    '        <p class="last-login-time">\n' +
    '            <span class="heading">{{::\'app.devices.tableColumn.lastLoginTime\' | i18n}}</span>\n' +
    '            <span class="login-date-time">{{::device.lastLoginTime | date:\'medium\'}}</span>\n' +
    '        </p>\n' +
    '        <p class="unlink-device" ng-show="device.osFamily == \'Windows\'">\n' +
    '            <a class="unlink-device-link" ng-click="devicesCtrl.unlinkDevice(device, $event)">\n' +
    '                {{\'app.devices.unlinkDevice\' | i18n }}\n' +
    '            </a>\n' +
    '        </p>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/deviceNotEnrolledWarning.html',
    '<div modal-new>\n' +
    '    <section class="dialog-container">\n' +
    '        <div class="dialog-body">\n' +
    '            <svg class="modal-warning-message-icon" svg-symbol="icon-warning-big"></svg>\n' +
    '            <p>{{ \'appCenter.mdm.device.poll.error\' | i18n}}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="$modal.cancel()">{{ \'userInfo.signout\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="$modal.close()">{{ \'userInfo.tryAgain\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/devices.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back" id="pt-support-devices-button" ng-if="settingsCtrl"\n' +
    '             ng-click="settingsCtrl.dismissSettingsDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <div class="settings-back" id="pt-support-devices-button" ng-if="supportCtrl"\n' +
    '             ng-click="supportCtrl.dismissSupportDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'userInfo.devices\' | i18n}}</h2>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable device-page">\n' +
    '        <div class="settings-detail-content" ng-include="\'app-v2/common/deviceList.html\'" ng-controller="DevicesController as devicesCtrl">\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/catalogItemActionsAppDetailsTemplate.html',
    '<div class="catalog-item-actions-app-details">\n' +
    ' <span ng-if="catalogItemActionsCtrl.app.approvalRequiredForMdmApp">\n' +
    '        <!-- Non activated requestable apps -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'1\'"\n' +
    '           class="catalog-action catalog-activate two primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-requestapp" class="icon-request action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.request\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '     <!-- Pending for native app request  -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && catalogItemActionsCtrl.app.appStateReason === \'PendingApproval\'"\n' +
    '           class="catalog-action catalog-processing one">\n' +
    '            <svg svg-symbol="icon-dots" class="icon-processing action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.pending\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '     <!-- installing for native app request  -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && !catalogItemActionsCtrl.app.appStateReason"\n' +
    '           class="catalog-action catalog-processing one">\n' +
    '            <svg svg-symbol="icon-install-processing" class="icon-install-processing action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.installing\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'3\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '           class="catalog-action catalog-installed one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-installed" class="icon-installed action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.installed\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '         <a ng-if="catalogItemActionsCtrl.app.statusCode == \'4\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '                class="catalog-action catalog-update one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-install-update" class="icon-install-update action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.update\' | i18n}}</span>\n' +
    '        </a>\n' +
    '    </span>\n' +
    '    <span ng-if="!catalogItemActionsCtrl.app.approvalRequiredForMdmApp">\n' +
    '    <!-- Non activated requestable web apps -->\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.approvalRequired"\n' +
    '       class="catalog-action" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        <svg svg-symbol="icon-requestapp" class="icon-request action-icon"></svg>\n' +
    '        <span class="action-text">{{::\'appCenter.action.request\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a role="button" aria-label="bookmarkButtonLabel"\n' +
    '       ng-if="(catalogItemActionsCtrl.app.isBookmarkableApp || catalogItemActionsCtrl.app.isThinApp) && !(catalogItemActionsCtrl.hideBookmarksTab || catalogItemActionsCtrl.hideCatalogTab)"\n' +
    '       class="catalog-action"\n' +
    '       ng-class="{\'catalog-bookmarked\': catalogItemActionsCtrl.app.favorite , \'catalog-not-bookmarked\' : !catalogItemActionsCtrl.app.favorite, \'catalog-bookmarking\': catalogItemActionsCtrl.app.bookmarking}"\n' +
    '       ng-click="catalogItemActionsCtrl.toggleBookmark(catalogItemActionsCtrl.app, $event)">\n' +
    '        <svg ng-if="!catalogItemActionsCtrl.activateBookmarking" svg-symbol="icon-bookmark"\n' +
    '             class="icon-bookmark pt-button-bookmark action-icon"></svg>\n' +
    '        <div ng-if="catalogItemActionsCtrl.activateBookmarking"\n' +
    '             class="icon-detail-bookmarking pt-button-bookmark action-icon"></div>\n' +
    '        <span class="action-text" ng-if="!catalogItemActionsCtrl.app.favorite">{{::\'app.details.action.bookmark\' | i18n}}</span>\n' +
    '        <span class="action-text" ng-if="catalogItemActionsCtrl.app.favorite">{{::\'app.details.action.bookmarked\' | i18n}}</span>\n' +
    '    </a>\n' +
    '    <a role="button" aria-label="launchButtonLabel" ng-if="catalogItemActionsCtrl.app.isLaunchableApp"\n' +
    '       class="catalog-action"\n' +
    '       ng-click="catalogItemActionsCtrl.launchApp(catalogItemActionsCtrl.app, $event)">\n' +
    '        <svg svg-symbol="icon-openapp" class="icon-openapp action-icon"\n' +
    '             ng-if="!catalogItemActionsCtrl.app.isHorizonResource && !catalogItemActionsCtrl.app.isHorizonAirResource"></svg>\n' +
    '        <svg class="action-icon icon-launchapp"\n' +
    '             ng-if="catalogItemActionsCtrl.app.isHorizonResource || catalogItemActionsCtrl.app.isHorizonAirResource"\n' +
    '             svg-symbol="icon-horizonclient"></svg>\n' +
    '        <!--this one only shows on catalog page though css -->\n' +
    '        <span class="action-text"\n' +
    '              ng-if="!catalogItemActionsCtrl.app.isHorizonResource && !catalogItemActionsCtrl.app.isHorizonAirResource">{{::\'appCenter.action.open\' | i18n}}</span>\n' +
    '        <span class="action-text"\n' +
    '              ng-if="catalogItemActionsCtrl.app.isHorizonResource || catalogItemActionsCtrl.app.isHorizonAirResource">{{::\'app.details.action.launch\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.isViewableThinappPackage" class="catalog-action"\n' +
    '       ng-click="catalogItemActionsCtrl.viewThinAppPackage(catalogItemActionsCtrl.app, $event)">\n' +
    '        <svg svg-symbol="icon-openapp" class="icon-openapp action-icon"></svg>\n' +
    '        <!--this one only shows on catalog page though css -->\n' +
    '        <span class="action-text">{{::\'appCenter.action.view\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '       class="catalog-action" ng-click="catalogItemActionsCtrl.activateApp()" role="button" id="installButtonId"\n' +
    '       aria-label="installButtonLabel">\n' +
    '        <svg ng-if="!catalogItemActionsCtrl.app.mgmtRequired" svg-symbol="icon-install"\n' +
    '             class="icon-install action-icon"></svg>\n' +
    '        <svg ng-if="catalogItemActionsCtrl.app.mgmtRequired" svg-symbol="icon-install-mdm"\n' +
    '             class="icon-install-mdm action-icon icon-mdm-required"></svg>\n' +
    '        <span class="action-text">{{::\'appCenter.action.install\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '       class="catalog-action" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        <svg svg-symbol="icon-install-processing" class="icon-install-processing action-icon"></svg>\n' +
    '        <span class="action-text">{{::\'appCenter.action.installing\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.statusCode == \'3\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '       class="catalog-action" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        <svg svg-symbol="icon-installed" class="icon-installed action-icon"></svg>\n' +
    '        <span class="action-text">{{::\'appCenter.action.installed\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.statusCode == \'4\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '       class="catalog-action catalog-update one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        <svg svg-symbol="icon-install-update" class="icon-install-update action-icon"></svg>\n' +
    '        <span class="action-text">{{::\'appCenter.action.update\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.installStatus == \'ACTIVATED\' && catalogItemActionsCtrl.app.usePerAppPassword"\n' +
    '       ng-click="catalogItemActionsCtrl.openSetAppPasswordDialog(catalogItemActionsCtrl.app, $event)"\n' +
    '       class="catalog-action">\n' +
    '        <svg svg-symbol="icon-set-password" class="action-icon set-app-password-icon"></svg>\n' +
    '        <span class="action-text">{{::\'app.details.action.setPassword\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.isPasswordVaultApp && catalogItemActionsCtrl.app.showPvAppCredentialsLink"\n' +
    '       ng-click="catalogItemActionsCtrl.openSetPVAppPasswordDialog(catalogItemActionsCtrl.app, $event)"\n' +
    '       class="catalog-action">\n' +
    '        <svg svg-symbol="icon-set-password" class="action-icon set-app-password-icon"></svg>\n' +
    '        <span class="action-text">{{::\'app.details.action.pvAppCredentials\' | i18n}}</span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a ng-if="catalogItemActionsCtrl.app.resetAllowed"\n' +
    '       ng-click="catalogItemActionsCtrl.resetDesktop(catalogItemActionsCtrl.app, $event)"\n' +
    '       class="catalog-action reset-desktop-link">\n' +
    '        <svg svg-symbol="icon-power" class="action-icon icon-power"></svg>\n' +
    '        <span class="action-text">{{::\'app.details.label.resetDektop\' | i18n}}</span>\n' +
    '    </a>\n' +
    '    </span>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/catalogItemActionsTemplate.html',
    '<div ng-class="{\'two-buttons\': catalogItemActionsCtrl.app.isLaunchableApp}">\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.approvalRequiredForMdmApp">\n' +
    '        <!-- Non activated requestable apps -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'1\'"\n' +
    '           class="catalog-button catalog-activate two primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-requestapp" class="icon-request action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.request\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- Pending for native app request  -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && catalogItemActionsCtrl.app.appStateReason === \'PendingApproval\'"\n' +
    '           class="catalog-button catalog-processing one">\n' +
    '            <svg svg-symbol="icon-dots" class="icon-processing action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.pending\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- installing for native app request  -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && !catalogItemActionsCtrl.app.appStateReason"\n' +
    '           class="catalog-button catalog-processing one">\n' +
    '            <svg svg-symbol="icon-install-processing" class="icon-install-processing action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.installing\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'3\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '           class="catalog-button catalog-installed one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-installed" class="icon-installed action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.installed\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- update for native app request  -->\n' +
    '         <a ng-if="catalogItemActionsCtrl.app.statusCode == \'4\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '            class="catalog-button catalog-update one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-install-update" class="icon-install-update action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.update\' | i18n}}</span>\n' +
    '        </a>\n' +
    '    </span>\n' +
    '    <span ng-if="!catalogItemActionsCtrl.app.approvalRequiredForMdmApp">\n' +
    '        <!-- Non activated requestable web apps -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.approvalRequired"\n' +
    '           class="catalog-button catalog-activate two primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-requestapp" class="icon-request action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.request\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- Non activated mdm apps -->\n' +
    '        <a role="button" id="installButtonId" aria-label="installButtonLabel"\n' +
    '           ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '           class="catalog-button catalog-install one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg ng-if="!catalogItemActionsCtrl.app.mgmtRequired" svg-symbol="icon-install"\n' +
    '                 class="icon-install action-icon"></svg>\n' +
    '            <svg ng-if="catalogItemActionsCtrl.app.mgmtRequired" svg-symbol="icon-install-mdm"\n' +
    '                 class="icon-install-mdm action-icon icon-mdm-required"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.install\' | i18n}}\n' +
    '            <svg ng-if="catalogItemActionsCtrl.app.mgmtRequired" svg-symbol="icon-star"\n' +
    '                 class="action-text-icon icon-mdm-required branding-icon-primary"></svg>\n' +
    '        </span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- Proessing all apps -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && !catalogItemActionsCtrl.app.isMdmApp && catalogItemActionsCtrl.app.approvalRequired"\n' +
    '           class="catalog-button catalog-processing one">\n' +
    '            <svg svg-symbol="icon-dots" class="icon-processing action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.pending\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- Proessing MDM apps -->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '           class="catalog-button catalog-processing one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-install-processing" class="icon-install-processing action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.installing\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!--Activated web apps-->\n' +
    '        <a role="button" aria-label="bookmarkButtonLabel"\n' +
    '           ng-if="(catalogItemActionsCtrl.app.isBookmarkableApp || catalogItemActionsCtrl.app.isThinApp) && !(catalogItemActionsCtrl.hideBookmarksTab || catalogItemActionsCtrl.hideCatalogTab)"\n' +
    '           class="catalog-button catalog-bookmark two secondary"\n' +
    '           ng-class="{\'catalog-bookmarked\': catalogItemActionsCtrl.app.favorite , \'catalog-not-bookmarked\' : !catalogItemActionsCtrl.app.favorite, \'catalog-bookmarking\': catalogItemActionsCtrl.app.bookmarking}"\n' +
    '           ng-click="catalogItemActionsCtrl.toggleBookmark(catalogItemActionsCtrl.app, $event)">\n' +
    '            <svg ng-if="!catalogItemActionsCtrl.activateBookmarking" svg-symbol="icon-bookmark"\n' +
    '                 class="icon-bookmark pt-button-bookmark action-icon"></svg>\n' +
    '            <div ng-if="catalogItemActionsCtrl.activateBookmarking" class="activate-bookmarking"></div>\n' +
    '        </a>\n' +
    '        <a role="button" aria-label="launchButtonLabel" ng-if="catalogItemActionsCtrl.app.isLaunchableApp"\n' +
    '           class="catalog-button catalog-open two primary"\n' +
    '           ng-click="catalogItemActionsCtrl.launchApp(catalogItemActionsCtrl.app, $event)">\n' +
    '            <svg svg-symbol="icon-openapp" class="icon-openapp action-icon"></svg>\n' +
    '            <!--this one only shows on catalog page though css -->\n' +
    '            <span class="action-text">{{::\'appCenter.action.open\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- Activated mdm apps-->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'3\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '           class="catalog-button catalog-installed one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-installed" class="icon-installed action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.installed\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <!-- Update mdm apps-->\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.statusCode == \'4\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '           class="catalog-button catalog-update one primary" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '            <svg svg-symbol="icon-install-update" class="icon-install-update action-icon"></svg>\n' +
    '            <span class="action-text">{{::\'appCenter.action.update\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '        <a ng-if="catalogItemActionsCtrl.app.isViewableThinappPackage" class="catalog-button catalog-open"\n' +
    '           ng-class="{\'two secondary\': catalogItemActionsCtrl.app.perDeviceActivationRequired, \'one primary\': !catalogItemActionsCtrl.app.perDeviceActivationRequired}"\n' +
    '           ng-click="catalogItemActionsCtrl.viewThinAppPackage(catalogItemActionsCtrl.app, $event)">\n' +
    '            <svg svg-symbol="icon-openapp" class="icon-openapp action-icon"></svg>\n' +
    '            <!--this one only shows on catalog page though css -->\n' +
    '            <span class="action-text" ng-if="!catalogItemActionsCtrl.app.perDeviceActivationRequired">{{::\'appCenter.action.view\' | i18n}}</span>\n' +
    '        </a>\n' +
    '\n' +
    '    </span>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/collapsePanelTemplate.html',
    '<div class="collapse-panel-container">\n' +
    '    <header class="collapse-panel-header" ng-class="{\'collapsed\': collapsed, \'non-collapsible\': !collapsible}" ng-click="collapsible && toggleCollapsePanel()">\n' +
    '        <svg class="icon-expand-collapse" svg-symbol="icon-expand-collapse" ng-if="collapsible"></svg>\n' +
    '        <h3>{{headerlabel}}</h3>\n' +
    '    </header>\n' +
    '    <section ng-transclude class="collapse-panel-content" ng-class="{\'collapsed\': collapsed, \'non-collapsible\': !collapsible}"></section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/imageLoader.html',
    '<div class="bookmark-app-icon spinner-small" ng-hide="loaded">\n' +
    '    <div ng-if="!loaderImage" ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    <svg ng-if="loaderImage" svg-symbol="{{loaderImage}}" class="icon-app-loader"></svg>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/pullToRefresh.html',
    '<div id="pull-to-refresh">\n' +
    '    <div class="action-icon">&#8595;</div>\n' +
    '    <div class="pull-spinner">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-transclude></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/tabsPaneTemplate.html',
    '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/directives/tabsTemplate.html',
    '<div class="tabs-container">\n' +
    '    <ul class="nav-tabs">\n' +
    '        <li ng-repeat="pane in panes" ng-if="!pane.displaycheck" ng-class="[{active:pane.selected}, pane.datalabel]" ng-click="select(pane)" id="tab-{{$index}}">\n' +
    '            {{::pane.datalabel}}\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '    <div ng-if="!pane.displaycheck" class="tab-content" ng-transclude></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/dropdownList.html',
    '<div class="dropdown" ng-class="{\'is-active\' : $dropdown.isActive }" ng-transclude>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/enrollModal.html',
    '<div modal-new class="modal-fullscreen adaptive-management mobile-slide-modal">\n' +
    '    <div class="adaptive-management-header">\n' +
    '        <svg class="icon-modal-fullscreen-close" svg-symbol="icon-close" ng-click="modal.cancel()"></svg>\n' +
    '    </div>\n' +
    '    <div class="adaptive-management-content">\n' +
    '        <div class="adaptive-management-content-scrollable">\n' +
    '            <div class="adaptive-management-body">\n' +
    '                <h2 class="adaptive-management-title">{{ ::\'app.adaptivemanagement.ws1servicestitle\' | i18n }}</h2>\n' +
    '                <h3 class="adaptive-management-subtitle">{{ ::\'app.adaptivemanagement.ws1servicessubtitle\' | i18n }}</h3>\n' +
    '                <ul class="adaptive-benefits-list">\n' +
    '                    <li>\n' +
    '                        <svg svg-symbol="illo-direct-install"></svg>\n' +
    '                        <p>{{ ::\'app.adaptivemanagement.valueproposition1\' | i18n }}</p>\n' +
    '                    </li>\n' +
    '                    <li>\n' +
    '                        <svg svg-symbol="illo-network-access"></svg>\n' +
    '                        <p>{{ ::\'app.adaptivemanagement.valueproposition2\' | i18n }}</p>\n' +
    '                    </li>\n' +
    '                    <li>\n' +
    '                        <svg svg-symbol="illo-productivity"></svg>\n' +
    '                        <p>{{ ::\'app.adaptivemanagement.valueproposition3\' | i18n }}</p>\n' +
    '                    </li>\n' +
    '                    <li>\n' +
    '                        <svg svg-symbol="illo-sync-device"></svg>\n' +
    '                        <p>{{ ::\'app.adaptivemanagement.valueproposition4\' | i18n }}</p>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '\n' +
    '                <a href class="privacy-page-text privacy-link" ng-click="appCenterCtrl.openPrivacyPage($event, privacyUrl)">{{ ::\'app.adaptivemanagement.privacylink\' | i18n }}</a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <button class="adaptive-management-footer" type="button" role="button" id="adaptive-management-footer" ng-click="modal.close(true)">\n' +
    '        {{ ::\'appCenter.proceed\' | i18n }}\n' +
    '        <svg svg-symbol="icon-next-arrow"></svg>\n' +
    '    </button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/eulaModal.html',
    '<div modal-new>\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ ::title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="message"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="modal.cancel()">{{ ::\'decline\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="modal.close(true)">{{ ::\'accept\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/footer.html',
    '<a ng-click="::appCenterCtrl.gotoAppsFromFooter()" id="pt-bottomnav-apps" ng-class="{\'active branding-icon-primary\':appCenterCtrl.$state.current.activeTab == \'bookmarks\' || appCenterCtrl.$state.current.activeTab == \'catalog\'}">\n' +
    '    <svg svg-symbol="icon-apps" class="bottom-nav-apps"></svg>\n' +
    '    <p>{{::\'app.nav.tab.apps\' | i18n }}</p>\n' +
    '</a>\n' +
    '<a ng-if="appCenterCtrl.showPeopleTab" ng-click="::appCenterCtrl.gotoPeopleFromFooter()" id="pt-bottomnav-people" ng-class="{\'active branding-icon-primary\':appCenterCtrl.$state.current.activeTab == \'people\'}">\n' +
    '    <svg svg-symbol="icon-people" class="bottom-nav-people"></svg>\n' +
    '    <p>{{::\'app.nav.tab.people\' | i18n }}</p>\n' +
    '</a>\n' +
    '<a ng-href="#/support" ng-if="appCenterCtrl.isAWJadeMobile" ng-class="{\'active branding-icon-primary\':appCenterCtrl.$state.current.activeTab == \'support\'}" class="support-tab">\n' +
    '    <svg svg-symbol="icon-support" class="bottom-nav-support"></svg>\n' +
    '    <p>{{::\'app.nav.tab.support\' | i18n }}</p>\n' +
    '</a>\n' +
    '<a ng-href="#/settings" ng-class="{\'active branding-icon-primary\':appCenterCtrl.$state.current.activeTab == \'settings\'}" class="settings-tab">\n' +
    '    <svg svg-symbol="icon-setting-gear" class="bottom-nav-settings"></svg>\n' +
    '    <p>{{::\'app.nav.tab.settings\' | i18n }}</p>\n' +
    '</a>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/hubEulaModal.html',
    '<div modal-new="eula" class="hub-eula-modal-popup">\n' +
    '    <section class="dialog-container hub-modal-container">\n' +
    '        <section class="modal-body">\n' +
    '            <header class="dialog-header">\n' +
    '                <h3 class="modal-title">{{ ::title }}</h3>\n' +
    '            </header>\n' +
    '            <div class="dialog-body">\n' +
    '                <p class="modal-content-text" ng-bind-html="message"></p>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '        <footer class="dialog-actions two-action modal-footer">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="modal.cancel()">{{ ::\'decline\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="modal.close(true)">{{ ::\'accept\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/masthead-desktopapp.html',
    '<div ng-show="appCenterCtrl.brandingAvailable" class="main-desktopapp-header branding-portal-header-background branding-portal-header-text" ng-class="{\'settings-style\': appCenterCtrl.$state.current.activeTab == \'settings\'}">\n' +
    '    <div class="header-left-desktopapp"  >\n' +
    '        <nav class="top-nav-tabs-desktopapp" ng-if="appCenterCtrl.showTabsSection" ng-hide="(appCenterCtrl.isAWJadeWithNativenav || appCenterCtrl.isAWJadeWindowsWithNativenav) && (appCenterCtrl.$state.current.activeTab == \'details\' || appCenterCtrl.$state.current.activeTab == \'people\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\') " ng-class="{\'top-nav-catalog\': appCenterCtrl.$state.current.activeTab == \'catalog\'}">\n' +
    '            <a ng-click="appCenterCtrl.bookmark()" ng-if="appCenterCtrl.showBookmarksTab" class= "bookmark-nav" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'bookmarks\'}">\n' +
    '                <svg svg-symbol="icon-bookmark" class="icon-desktopapp-bookmark"></svg>\n' +
    '                <span>{{::\'app.nav.tab.bookmark\' | i18n }}</span>\n' +
    '            </a>\n' +
    '            <a ng-click="appCenterCtrl.catalog()" ng-if="appCenterCtrl.showCatalogTab"  class="catalog-nav" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'catalog\'}">\n' +
    '                <svg svg-symbol="icon-apps" class="icon-desktopapp-apps"></svg>\n' +
    '                <span>{{::\'app.nav.tab.catalog\' | i18n }}</span>\n' +
    '            </a>\n' +
    '            <a ng-if="appCenterCtrl.showPeopleTab" ng-hide = "appCenterCtrl.isAWJadeWithNativenav || appCenterCtrl.isAWJadeDocked || appCenterCtrl.isAWJadeWindowsWithNativenav" ng-click="appCenterCtrl.peopleSearch()" class="people-nav capsule-text-color" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'people\'}">\n' +
    '                <svg svg-symbol="icon-people"></svg>\n' +
    '                <span>{{::\'app.nav.tab.people\' | i18n }}</span>\n' +
    '            </a>\n' +
    '        </nav>\n' +
    '        <a class="desktopapp-details-back-button" id="pt-details-masthead-backbutton" ng-if="appCenterCtrl.$state.current.activeTab == \'details\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\'" ng-click="appCenterCtrl.backAction()">\n' +
    '            <svg svg-symbol="icon-detail-back" class="icon-setting-close-button"></svg>\n' +
    '            <span>{{\'app.settings.link.back\' | i18n}}</span>\n' +
    '        </a>\n' +
    '        <a class="people-home" ng-click="appCenterCtrl.peopleSearch()" ng-if="appCenterCtrl.$state.current.activeTab == \'peopleDetails\'">\n' +
    '            <svg svg-symbol="icon-people" class="icon-people-home"></svg>\n' +
    '        </a>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="header-right-desktopapp">\n' +
    '        <div ng-if="appCenterCtrl.$state.current.activeTab == \'bookmarks\' || appCenterCtrl.$state.current.activeTab == \'catalog\'" class="search-form desktopapp-search branding-portal-text" search-input search-controller="SearchController" template-url="app-v2/search/search-input.html" is-active="appCenterCtrl.searchFieldOn" control="appCenterCtrl.searchFieldToggle">\n' +
    '        </div>\n' +
    '        <div ng-if="appCenterCtrl.showPeopleTab && appCenterCtrl.$state.current.activeTab == \'people\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\'" class="search-form branding-portal-text"\n' +
    '             search-input search-controller="PeopleSearchController" template-url="app-v2/people/people-search-input.html"  is-active="appCenterCtrl.showRecentSearch" control="appCenterCtrl.searchFieldToggle">\n' +
    '        </div>\n' +
    '        <div ng-if="appCenterCtrl.$state.current.activeTab == \'bookmarks\' || appCenterCtrl.$state.current.activeTab == \'catalog\' || appCenterCtrl.$state.current.activeTab == \'people\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\'" class="desktopapp-header-button desktopapp-refresh-button" id="desktopapp-refresh-button" ng-click="appCenterCtrl.desktopRefresh(appCenterCtrl.$state.current.activeTab)">\n' +
    '            <svg svg-symbol="icon-refresh" ng-class="{\'icon-windows-refresh\': appCenterCtrl.isDesktopAppRefreshing}"></svg>\n' +
    '        </div>\n' +
    '        <div ng-if="appCenterCtrl.isAWJadeDesktop" class="desktopapp-header-button" id="desktopapp-install-button" ng-click="appCenterCtrl.showAppInstall()">\n' +
    '            <svg svg-symbol="icon-install" class="icon-windows-install"></svg>\n' +
    '        </div>\n' +
    '        <section dropdown-list="{ closeOnClick: false}" class="notification-desktop-container desktopapp desktopapp-header-button" dropdown-control=\'appCenterCtrl.isNotificationDropdownActive\' id="notification-button" ng-if="appCenterCtrl.appsLoaded && appCenterCtrl.inAppNotificationEnabled" ng-show="!appCenterCtrl.searchFieldOn || appCenterCtrl.$state.current.activeTab === \'people\' || appCenterCtrl.$state.current.activeTab === \'peopleDetails\'" >\n' +
    '            <div class="notification-bell-button desktopapp dropdown-toggle">\n' +
    '                <svg svg-symbol="icon-bell" class="icon-bell"></svg>\n' +
    '                <div notification-count></div>\n' +
    '            </div>\n' +
    '            <div dropdown-panel-body class="notification-dropdown-container branding-portal-text" id= "pt-notification-dropdown" ng-include="\'app-v2/notifications/notificationDesktop.html\'">\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '    <div class="sorting-overlay-desktop" ng-hide="appCenterCtrl.sortingDisabled"></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/masthead.html',
    '<div ng-show="appCenterCtrl.brandingAvailable" class="main-header header-container branding-portal-header-background branding-portal-header-text">\n' +
    '    <section toast></section>\n' +
    '    <section class="header-content width-boundary" ng-class="{\'searchform-show\': appCenterCtrl.searchFieldOn, \'people-searchform-show\': appCenterCtrl.showRecentSearch}">\n' +
    '        <div class="header-left">\n' +
    '            <div class="branding-logo"></div>\n' +
    '            <a class="page-back-button" ng-click="::appCenterCtrl.backAction(appCenterCtrl.$state.current.activeTab)">\n' +
    '                <svg svg-symbol="icon-page-back" class="icon-page-back" ng-class="{\'page-back-show\':appCenterCtrl.$state.current.activeTab == \'details\' || appCenterCtrl.$state.current.activeTab == \'notifications\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\' || appCenterCtrl.$state.current.activeTab == \'archivedNotifications\'}"></svg>\n' +
    '            </a>\n' +
    '            <a class="people-home" ng-click="appCenterCtrl.peopleSearch()" ng-if="appCenterCtrl.$state.current.activeTab === \'peopleDetails\'">\n' +
    '                <svg svg-symbol="icon-people" class="icon-people-home"></svg>\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="header-center">\n' +
    '            <div class="mobile-title-container">\n' +
    '                <h2 ng-click="appCenterCtrl.scrollToTop()">{{appCenterCtrl.$state.current.mobilePageTitle | i18n}}</h2>\n' +
    '            </div>\n' +
    '            <div ng-if="appCenterCtrl.$state.current.activeTab == \'bookmarks\' || appCenterCtrl.$state.current.activeTab == \'catalog\'" class="search-form branding-portal-text" search-input search-controller="SearchController" template-url="app-v2/search/search-input.html" is-active="appCenterCtrl.searchFieldOn" control="appCenterCtrl.searchFieldToggle">\n' +
    '            </div>\n' +
    '            <div ng-if="appCenterCtrl.showPeopleTab && appCenterCtrl.$state.current.activeTab == \'people\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\'" class="search-form branding-portal-text"\n' +
    '                 search-input search-controller="PeopleSearchController" template-url="app-v2/people/people-search-input.html"  is-active="appCenterCtrl.showRecentSearch" control="appCenterCtrl.searchFieldToggle"\n' +
    '                 ng-class="{\'notification-enabled\': appCenterCtrl.inAppNotificationEnabled}">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="header-right">\n' +
    '            <div class="mobile-search-button" role="button" aria-label="mobileSearchButtonLabel" ng-click="appCenterCtrl.toggleSearchField()" ng-if="appCenterCtrl.appsLoaded && appCenterCtrl.$state.current.activeTab !== \'people\'">\n' +
    '                <svg svg-symbol="icon-searchglass" class="icon-searchglass"></svg>\n' +
    '                <span role="button" aria-label="searchCancelLabel" class="search-cancel">{{::\'button.cancel\'|i18n}}</span>\n' +
    '            </div>\n' +
    '            <div class="mobile-search-button" role="button" aria-label="mobileSearchButtonLabel" ng-click="appCenterCtrl.cancelPeopleSearchField()" ng-if="appCenterCtrl.appsLoaded && appCenterCtrl.$state.current.activeTab === \'people\' && appCenterCtrl.showRecentSearch">\n' +
    '                <svg svg-symbol="icon-searchglass" class="icon-searchglass"></svg>\n' +
    '                <span role="button" aria-label="searchCancelLabel" class="search-cancel">{{::\'button.cancel\'|i18n}}</span>\n' +
    '            </div>\n' +
    '            <div class="notification-bell-button mobile" ng-click="appCenterCtrl.showNotification()" ng-if="appCenterCtrl.appsLoaded && appCenterCtrl.inAppNotificationEnabled && appCenterCtrl.isRenderNotificationBellForMobile" ng-hide="(appCenterCtrl.searchFieldOn && appCenterCtrl.$state.current.activeTab !== \'people\' ) || (appCenterCtrl.$state.current.activeTab === \'people\' && appCenterCtrl.showRecentSearch) || (appCenterCtrl.$state.current.activeTab !== \'catalog\' && appCenterCtrl.$state.current.activeTab !== \'bookmarks\' && appCenterCtrl.$state.current.activeTab !== \'people\' && appCenterCtrl.$state.current.activeTab !== \'peopleDetails\')">\n' +
    '                <svg svg-symbol="icon-bell" class="icon-bell"></svg>\n' +
    '                <div notification-count></div>\n' +
    '            </div>\n' +
    '            <div class="notifications-overflow-actions mobile" ng-if="appCenterCtrl.$state.current.activeTab == \'notifications\'" ng-click="appCenterCtrl.showNotificationsOverflowContainer()">\n' +
    '                <svg svg-symbol="icon-dots"></svg>\n' +
    '            </div>\n' +
    '            <section dropdown-list="{ closeOnClick: false}" class="notification-desktop-container" dropdown-control=\'appCenterCtrl.isNotificationDropdownActive\' id="notification-button" ng-if="appCenterCtrl.appsLoaded && appCenterCtrl.inAppNotificationEnabled && !appCenterCtrl.isRenderNotificationBellForMobile && !appCenterCtrl.isAWJadeDesktop" ng-show="!appCenterCtrl.searchFieldOn || appCenterCtrl.$state.current.activeTab === \'people\' || appCenterCtrl.$state.current.activeTab === \'peopleDetails\'">\n' +
    '                <div class="notification-bell-button desktop dropdown-toggle">\n' +
    '                    <svg svg-symbol="icon-bell" class="icon-bell"></svg>\n' +
    '                    <div notification-count></div>\n' +
    '                </div>\n' +
    '                <div dropdown-panel-body class="notification-dropdown-container branding-portal-text" id= "pt-notification-dropdown" ng-include="\'app-v2/notifications/notificationDesktop.html\'">\n' +
    '                </div>\n' +
    '            </section>\n' +
    '            <section dropdown-list class="profile-container" id="profile-button">\n' +
    '                <div class="dropdown-toggle dropdown-toggle-profile" ng-show="appCenterCtrl.userAvailable">\n' +
    '                    <div class="profile-avatar-container profile-avatar" image-load>\n' +
    '                        <img ng-src="{{appCenterCtrl.user.imageURL}}" ng-show="appCenterCtrl.user.imageURL" class="icon-profile-desktopapp"/>\n' +
    '                    </div>\n' +
    '                    <span class="profile-username">{{\'fullname\' | i18n : appCenterCtrl.user.firstName : appCenterCtrl.user.lastName}}</span>\n' +
    '                    <svg svg-symbol="icon-down-caret" class="profile-down-caret"></svg>\n' +
    '                </div>\n' +
    '                <div dropdown-panel-body class="profile-dropdown-container branding-portal-text" id= "pt-profile-dropdown" ng-include="\'app-v2/common/profileDesktop.html\'">\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '\n' +
    '    <section class="top-nav-container branding-portal-header-background branding-portal-header-text" ng-if="appCenterCtrl.appsLoaded && !appCenterCtrl.directEnrollmentEnabled">\n' +
    '        <div class="top-nav-content width-boundary">\n' +
    '            <div class="top-nav-actions" ng-class="{\'catalog-on\': appCenterCtrl.$state.current.activeTab == \'catalog\', \'filter-show\': appCenterCtrl.categoryFilterOn }" ng-click="appCenterCtrl.updateTopnavActions()">\n' +
    '                <svg svg-symbol="icon-category-filter" class="icon-category-filter" id="pt-category-filter-icon"></svg>\n' +
    '            </div>\n' +
    '            <nav class="top-nav-tabs branding-portal-text capsule-border" ng-if="appCenterCtrl.showTabsSection" ng-class="{\'top-nav-catalog\': appCenterCtrl.$state.current.activeTab == \'catalog\',\'top-nav-people\': appCenterCtrl.$state.current.activeTab == \'people\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\',\n' +
    '            \'bookmarks-hidden\': !appCenterCtrl.showBookmarksTab,\'catalog-hidden\': !appCenterCtrl.showCatalogTab}">\n' +
    '                <a ng-click="appCenterCtrl.bookmark()" ng-if="appCenterCtrl.showBookmarksTab" class= "bookmark-nav capsule-text-color" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'bookmarks\'}">{{::\'app.nav.tab.bookmark\' | i18n }}</a>\n' +
    '                <a ng-click="appCenterCtrl.catalog()" ng-if="appCenterCtrl.showCatalogTab" class="catalog-nav capsule-text-color" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'catalog\'}">{{::\'app.nav.tab.catalog\' | i18n }}</a>\n' +
    '                <a ng-click="appCenterCtrl.smartSearch()" class="people-nav capsule-text-color" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'smartSearch\'}">smart search</a>\n' +
    '                <a ng-if="appCenterCtrl.showPeopleTab" ng-click="appCenterCtrl.peopleSearch()" class="people-nav capsule-text-color" ng-class="{\'selected\': appCenterCtrl.$state.current.activeTab == \'people\' || appCenterCtrl.$state.current.activeTab == \'peopleDetails\'}">{{::\'app.nav.tab.people\' | i18n }}</a>\n' +
    '            </nav>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '    <div class="sorting-overlay" ng-hide="appCenterCtrl.sortingDisabled"></div>\n' +
    '</div><!--  end of header container  -->');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/hub-templates/alert.html',
    '<div modal-new="modal-alert" class="hub-modal-container hub-alert-modal">\n' +
    '    <section class="dialog-container">\n' +
    '        <section class="modal-body">\n' +
    '            <header class="dialog-header" ng-if="title">\n' +
    '                <h3 class="modal-title">{{::title | i18n }}</h3>\n' +
    '            </header>\n' +
    '            <div class="dialog-body">\n' +
    '                <p class="modal-content-text" ng-show="message">{{::message | i18n }}</p>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '        <footer class="dialog-actions one-action">\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="$modal.close()">{{::ok | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/hub-templates/confirm.html',
    '<div modal-new="modal-confirmation" class="hub-modal-container hub-confirm-modal">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header no-symbol" ng-if="title">\n' +
    '            <h3 class="modal-title">{{::title | i18n }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="modal-content-text" ng-show="message">{{::message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="$modal.cancel();$event.stopPropagation();">\n' +
    '                {{::cancel | i18n }}\n' +
    '            </button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="$modal.close()">\n' +
    '                {{::ok | i18n }}\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/alert.html',
    '<div modal-new="modal-alert">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header" ng-show="title">\n' +
    '             <h2 ng-show="title">{{ title | i18n }}</h2>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '             <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions one-action">\n' +
    '             <button class="button-action primary-action" ng-click="$modal.close()">{{ ok | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/bookmarkWarning.html',
    '<div modal-new="modal-confirmation">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header dialog-header-no-top-padding" ng-show="title">\n' +
    '            <div ng-show="title">{{ title | i18n }}</div>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="$modal.close()">\n' +
    '                {{ cancel | i18n }}\n' +
    '            </button>\n' +
    '            <button class="button-action primary-action" ng-click="$modal.cancel()">\n' +
    '                {{ ok | i18n }}\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/confirm.html',
    '<div modal-new="modal-confirmation">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header no-symbol" ng-show="title" ng-if="title">\n' +
    '            <h2 ng-show="title">{{ title | i18n }}</h2>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="$modal.cancel();$event.stopPropagation();">\n' +
    '                {{ cancel | i18n }}\n' +
    '            </button>\n' +
    '                <button class="button-action primary-action" ng-click="$modal.close()">\n' +
    '                    {{ ok | i18n }}\n' +
    '                </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/enrollDevice.html',
    '<div modal-new class="mobile-fullscreen">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-title dialog-actions-top">\n' +
    '            <svg class="modal-popup-close-icon" svg-symbol="icon-close-popup"></svg>\n' +
    '            <div class="modal-dialog-progress-indicator-container"></div>\n' +
    '        </header>\n' +
    '        <section class="dialog-body">\n' +
    '            <ul rn-carousel class="dialog-mobile-fullscreen-list direct-enrollment-list">\n' +
    '                <li class="dialog-mobile-fullscreen-item">\n' +
    '                    <h2 class="dialog-mobile-fullscreen-title">Add a new device</h2>\n' +
    '                    <h3 class="dialog-mobile-fullscreen-subtitle"></h3>\n' +
    '                    <p class="dialog-mobile-fullscreen-description">How would you like to receive the code to activate Workspace ONE on a different device?</p>\n' +
    '                </li>\n' +
    '\n' +
    '                <li class="dialog-mobile-fullscreen-item">\n' +
    '                    <h2 class="dialog-mobile-fullscreen-title">Enable Workspace Services</h2>\n' +
    '                    <h3 class="dialog-mobile-fullscreen-subtitle">Enroll this device to automatically receive</h3>\n' +
    '                    <p class="workspace-list-item">Direct installation for all corporate resources.</p>\n' +
    '                    <p class="workspace-list-item">Secured corporate network access.</p>\n' +
    '                    <p class="workspace-list-item">Syncronized apps and content on all of your devices.</p>\n' +
    '                    <p class="workspace-list-item">Enhanced app experience that will make you more productive.</p>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </section>\n' +
    '        <footer class="dialog-actions one-action mobile-fullscreen-enrollment">\n' +
    '            <button class="button-action" ng-click="modal.cancel()">\n' +
    '                SEND REQUEST\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/errorMessage.html',
    '<div modal-new="modal-errormessage">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header" ng-show="title">\n' +
    '            <svg class="modal-warning-message-icon-desktop" svg-symbol="icon-error-big"></svg>\n' +
    '             <h2 ng-show="title">{{ title | i18n }}</h2>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <svg class="modal-error-message-icon" svg-symbol="icon-error-big"></svg>\n' +
    '             <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions one-action">\n' +
    '             <button class="button-action" ng-click="$modal.close()">\n' +
    '                  {{ ok | i18n }}\n' +
    '             </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/eulaTemplate.html',
    '<div modal class="fullscreen">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="message"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action" ng-click="modal.cancel()">{{ \'decline\' | i18n }}</button>\n' +
    '            <button class="button-action" ng-click="modal.close(true)">{{ \'accept\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/mdmError.html',
    '<div modal-new="modal-mdm-error" class="modal-mdm-error">\n' +
    '    <section class="dialog-container">\n' +
    '        <div class="dialog-body">\n' +
    '            <svg class="modal-mdm-error-icon" svg-symbol="icon-warning-big"></svg>\n' +
    '            <p>{{ ::\'appCenter.mdm.device.error\' | i18n }}</p>\n' +
    '            <p>{{ ::\'appCenter.mdm.device.error.contact\' | i18n}}</p>\n' +
    '            <button class="button-action primary-action mdm-signout-button" ng-click="$modal.close()">\n' +
    '                {{ ::\'userInfo.signout\' | i18n }}\n' +
    '            </button>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/modal.html',
    '<div class="modal-container">\n' +
    '    <div class="modal-overlay"></div>\n' +
    '    <div class="modal-content" ng-transclude></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/setAppPassword.html',
    '<div modal-new="modal-confirmation">\n' +
    '    <section class="dialog-container set-app-password" ng-controller="SetAppPasswordController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"/>\n' +
    '            <div class="item-caption-title">\n' +
    '                <h1>{{\'app.setAppPassword.heading\' | i18n:ctrl.app.name}}</h1>\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <form name="appAuthForm">\n' +
    '            <div class="dialog-body">\n' +
    '                <div>\n' +
    '                    <p>{{ "app.setAppPassword.instruction" | i18n}}</p>\n' +
    '                </div>\n' +
    '                <div class="error-text" ng-show="appAuthForm.$error.unique">{{ "app.setAppPassword.error.passwordsNoMatch" | i18n}}</div>\n' +
    '                <fieldset class="fieldset">\n' +
    '                    <div class="field-div">\n' +
    '                        <p>{{:: \'app.setAppPassword.label.password\' | i18n}}</p>\n' +
    '                        <input class="input-password-field input-large"\n' +
    '                               id="password1"\n' +
    '                               type="password"\n' +
    '                               ng-minlength="3"\n' +
    '                               ng-model="ctrl.password1"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                    </div>\n' +
    '                    <div class="field-div">\n' +
    '                        <p>{{\'app.setAppPassword.label.confirmPassword\' | i18n }}</p>\n' +
    '                        <input class="input-password-field input-large"\n' +
    '                               id="password2"\n' +
    '                               type="password"\n' +
    '                               ng-minlength="3"\n' +
    '                               ng-model="ctrl.password2"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                    </div>\n' +
    '                </fieldset>\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions two-action">\n' +
    '                <button class="button-action secondary-action" ng-click="$modal.close()">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button class="button-action save-button primary-action" ng-click="ctrl.setAppPassword($event)" ng-disabled="appAuthForm.$invalid"> {{\'button.save\' | i18n }}</button>\n' +
    '            </footer>\n' +
    '        </form>\n' +
    '    </section>\n' +
    '    <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/spinner.html',
    '<div modal-new="modal-spinner">\n' +
    '    <section class="dialog-container">\n' +
    '        <div class="dialog-body">\n' +
    '            <h2 ng-show="title">{{ title | i18n }}</h2>\n' +
    '            <p ng-show="message">{{ message | i18n }}</p>\n' +
    '            <div class="spinner"></div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/modalDialog/templates/warningMessage.html',
    '<div modal-new="modal-warningmessage">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header" ng-show="title">\n' +
    '            <svg class="modal-warning-message-icon-desktop" svg-symbol="icon-warning-big"></svg>\n' +
    '             <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '             <h2 ng-show="title">{{ title | i18n }}</h2>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <svg class="modal-warning-message-icon" svg-symbol="icon-warning-big"></svg>\n' +
    '             <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '             <button class="button-action" ng-click="$modal.cancel()">\n' +
    '                {{ cancel | i18n }}\n' +
    '             </button>\n' +
    '             <button class="button-action" ng-click="$modal.close()">\n' +
    '                  {{ ok | i18n }}\n' +
    '             </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/passwordVaultBanner.html',
    '<div ng-controller="PasswordVaultBannerController as passwordVaultBannerCtrl" class="passwordvault-banner" ng-if="appCenterCtrl.$state.current.activeTab == \'bookmarks\' || appCenterCtrl.$state.current.activeTab == \'catalog\'">\n' +
    '    <svg svg-symbol="icon-ws1-lockup" class="icon-ws1-pv"></svg>\n' +
    '    <p class="passwordvault-text">{{ ::\'app.passwordVault.banner.msg\' | i18n }}</p>\n' +
    '    <p class="passwordvault-text">{{ ::\'app.passwordVault.banner.setPreference\' | i18n}}</p>\n' +
    '\n' +
    '    <label class="pv-option-text">\n' +
    '        <input type="checkbox" ng-model="passwordVaultBannerCtrl.pvsettings" value="donotSHOW" id="pt-donotshow" class="pv-settings-choice" ng-change="passwordVaultBannerCtrl.setPVBannerPreference()" />\n' +
    '        <span class="pv-banner-preference">{{ ::\'app.passwordVault.banner.donotshowagain\' | i18n}}</span>\n' +
    '    </label>\n' +
    '    <p class="actions-wrapper">\n' +
    '    <a class="button-action secondary-button" ng-click="close($index)">{{ ::\'app.passwordVault.banner.button.later\' | i18n}}</a>\n' +
    '    <a class="button-action primary-button" ng-click="passwordVaultBannerCtrl.installPasswordVaultPlugin()">{{ ::\'app.passwordVault.banner.button.get\' | i18n}}</a>\n' +
    '    </p>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/privateAppInstructionsModal.html',
    '<div modal-new class="modal-fullscreen private-app-instructions" stop-event="click">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <div class="app-instructions-back" ng-click="$modal.close()">\n' +
    '                {{\'appCenter.internalApp.installtionModalTitle\' | i18n}}\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="instructionsTitle">\n' +
    '                {{\'appCenter.internalApp.installationStepTitle\' | i18n}}\n' +
    '            </p>\n' +
    '            <div class="stepper">\n' +
    '                <div class="step">\n' +
    '                    <div>\n' +
    '                        <div class="circle">1</div>\n' +
    '                        <div class="line"></div>\n' +
    '                    </div>\n' +
    '                    <div class="body">{{\'appCenter.internalApp.step1\' | i18n}}</div>\n' +
    '                </div>\n' +
    '                <div class="step">\n' +
    '                    <div>\n' +
    '                        <div class="circle">2</div>\n' +
    '                        <div class="line"></div>\n' +
    '                    </div>\n' +
    '                    <div class="body">{{\'appCenter.internalApp.step2\' | i18n}}</div>\n' +
    '                </div>\n' +
    '                <div class="step">\n' +
    '                    <div>\n' +
    '                        <div class="circle">3</div>\n' +
    '                        <div class="line"></div>\n' +
    '                    </div>\n' +
    '                    <div class="body">{{\'appCenter.internalApp.step3\' | i18n}}</div>\n' +
    '                </div>\n' +
    '                <div class="step">\n' +
    '                    <div>\n' +
    '                        <div class="circle">4</div>\n' +
    '                        <div class="line"></div>\n' +
    '                    </div>\n' +
    '                    <div class="body">{{\'appCenter.internalApp.step4\' | i18n}}</div>\n' +
    '                </div>\n' +
    '                <div class="step">\n' +
    '                    <div>\n' +
    '                        <div class="circle">5</div>\n' +
    '                        <div class="line"></div>\n' +
    '                    </div>\n' +
    '                    <div class="body">{{\'appCenter.internalApp.step5\' | i18n}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <p class="tutorialLink" ng-click="modal.open(\'app-v2/common/privateAppTutorialModal.html\', { modal: modal, modalOverAModal: true })">{{\'appCenter.internalApp.watchTutorial\' | i18n}}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="modal.cancel()">\n' +
    '                {{ \'appCenter.cancel\' | i18n }}\n' +
    '            </button>\n' +
    '            <button class="button-action primary-action" ng-click="modal.close(true)">\n' +
    '                {{ \'appCenter.install\' | i18n }}\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/privateAppTutorialModal.html',
    '<div modal-new class="modal-fullscreen mobile-slide-modal private-app-video">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <div class="tutorialImageHeader">\n' +
    '                <p ng-click="modal.close()">{{\'appCenter.done\' | i18n}}</p>\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="tutorialImage">\n' +
    '                <video autoplay muted loop controls webkit-playsinline\n' +
    '                       poster="app-v2/images/trust_private_app_poster.png" preload="auto">\n' +
    '                    <source src="app-v2/images/trust_private_app_tutorial.mp4" type="video/mp4">\n' +
    '                </video>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/profile-desktopapp.html',
    '<div dropdown-list="false" id="profile-sidepanel-button">\n' +
    '	<div class="dropdown-toggle dropdown-toggle-desktopapp">\n' +
    '		<div class="profile-avatar-container profile-avatar" image-load>\n' +
    '			<img ng-src="{{appCenterCtrl.user.imageURL}}" ng-show="appCenterCtrl.user.imageURL" class="icon-profile-desktopapp"/>\n' +
    '		</div>\n' +
    '	</div>\n' +
    '	<div dropdown-panel-body class="profile-dropdown-desktopapp-container branding-portal-text" id= "pt-profile-dropdown" ng-include="\'app-v2/settings/settings-desktopapp.html\'">\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/profileDesktop.html',
    '<ul class="profile-list">\n' +
    '	<li ng-show="!appCenterCtrl.isAWJade && appCenterCtrl.user.adminUser">\n' +
    '		<a ng-click="appCenterCtrl.adminConsole($event)">{{\'userInfo.adminConsole\' | i18n}}</a>\n' +
    '	</li>\n' +
    '	<li class="desktopOnly ">\n' +
    '		<a ng-href="#/settings/account" class="profile-account-link" id="pt-profile-settings">{{\'userInfo.settings\' | i18n}}</a>\n' +
    '	</li>\n' +
    '	<li id="pt-profile-signout" class="border-top signout-link" ng-show="appCenterCtrl.isBrowser" ng-click="appCenterCtrl.signout($event)">\n' +
    '		<a>{{\'userInfo.signout\' | i18n}}</a>\n' +
    '	</li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/recommendedAppsTunnelModal.html',
    '<div modal-new class="modal-fullscreen adaptive-management mobile-slide-modal tunnel-modal">\n' +
    '    <div class="adaptive-management-header">\n' +
    '        <svg class="icon-modal-fullscreen-close" svg-symbol="icon-close" ng-click="modal.cancel()"></svg>\n' +
    '    </div>\n' +
    '    <div class="adaptive-management-content">\n' +
    '        <div class="adaptive-management-content-scrollable">\n' +
    '            <div class="tunnel-app-body">\n' +
    '                <svg class="tunnel-svg" svg-symbol="illo-vpn-tunnel"></svg>\n' +
    '                <p class="tunnel-app-text">{{ ::\'recommendedApps.tunnel.text.line1\' | i18n }}\n' +
    '                    <span class="tunnel-app-name" id="pt-tunnel-app-name" ng-repeat="appname in appNames"><span>{{appname}}</span>{{$last ? \'\' : \', \'}}</span>\n' +
    '                </p>\n' +
    '                <p class="tunnel-app-text">{{ ::\'recommendedApps.tunnel.text.line2\' | i18n }}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <button class="adaptive-management-footer" type="button" role="button" id="adaptive-management-footer" ng-click="modal.close(true)">\n' +
    '        {{ ::\'app.tunnel.continue\' | i18n }}\n' +
    '    </button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/sortOrder.html',
    '<ul class="sort-list">\n' +
    '    <li ng-repeat="type in bookmarksCtrl.sortType.types" ng-class="{\'selected\': type.id === bookmarksCtrl.sortType.model}">\n' +
    '        <a class="sort-order-list-label" ng-click="bookmarksCtrl.changeSortType(type.id, type.text)">{{type.text}}</a>\n' +
    '    </li>\n' +
    '</ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/spinner.html',
    '<div class=\'spinner center\'>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '    <div class=\'spinner-blade\'></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/tunnelInstallNonAndroidForWorkDeviceModal.html',
    '<div modal-new class="modal-fullscreen adaptive-management mobile-slide-modal tunnel-install-modal">\n' +
    '    <div class="adaptive-management-header">\n' +
    '        <svg class="icon-modal-fullscreen-close" svg-symbol="icon-close" ng-click="modal.cancel()"></svg>\n' +
    '    </div>\n' +
    '    <div class="adaptive-management-content">\n' +
    '        <div class="adaptive-management-content-scrollable">\n' +
    '            <div class="tunnel-app-body">\n' +
    '                <p class="tunnel-install-help-text">{{ ::\'app.tunnel.installHelpText\' | i18n }}</p>\n' +
    '                <p class="tunnel-install-step">\n' +
    '                    <a id="tunnelApp" ng-click="catalogService.handleTunnelRedirect(tunnelUrl)"> {{ ::\'app.tunnel.installStep1\' | i18n:tunnelAppName }} </a>\n' +
    '                </p>\n' +
    '                <p class="tunnel-install-step">\n' +
    '                    <a id="dependentApp" ng-click="catalogService.installDependentApp(dependentApp)"> {{ ::\'app.tunnel.installStep2\' | i18n:dependentApp.name }} </a>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <button class="adaptive-management-footer" type="button" role="button" id="adaptive-management-footer" ng-click="modal.close(true)">\n' +
    '        {{ ::\'button.close\' | i18n }}\n' +
    '    </button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/tunnelModal.html',
    '<div modal-new class="modal-fullscreen adaptive-management mobile-slide-modal tunnel-modal">\n' +
    '    <div class="adaptive-management-header">\n' +
    '        <svg class="icon-modal-fullscreen-close" svg-symbol="icon-close" ng-click="modal.cancel()"></svg>\n' +
    '    </div>\n' +
    '    <div class="adaptive-management-content">\n' +
    '        <div class="adaptive-management-content-scrollable">\n' +
    '            <div class="tunnel-app-body">\n' +
    '                <svg class="tunnel-svg" svg-symbol="illo-vpn-tunnel"></svg>\n' +
    '                <p class="tunnel-app-text">{{ ::\'app.tunnel.text.line1\' | i18n }} <span class="tunnel-app-name" id="pt-tunnel-app-name">{{::name}}</span></p>\n' +
    '                <p class="tunnel-app-text">{{ ::\'app.tunnel.text.line2\' | i18n }}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <button class="adaptive-management-footer" type="button" role="button" id="adaptive-management-footer" ng-click="modal.close(true)">\n' +
    '        {{ ::\'app.tunnel.continue\' | i18n }}\n' +
    '    </button>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/common/unenrollWarning.html',
    '<div modal-new class="modal-unenroll">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg class="modal-warning-message-icon-desktop" svg-symbol="icon-warning-big"></svg>\n' +
    '            <h3>{{ \'appCenter.device.unEnrollWarningTitle\' | i18n}}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <svg class="modal-warning-message-icon" svg-symbol="icon-warning-big"></svg>\n' +
    '            <p>{{ \'appCenter.device.mdmUnEnrollMessage\' | i18n}}</p>\n' +
    '            <p>{{ \'appCenter.device.mdmUnEnrollConfirmationMessage\' | i18n}}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action" ng-click="appCenterCtrl.unEnrollCallback();modal.close(true)">{{ \'appCenter.device.remove\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action" ng-click="modal.cancel()">{{ \'appCenter.device.keep\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appItem/appItem.html',
    '<div class="app-tile" ng-if="appItemCtrl.app.isMdmApp" ui-sref="apps.details({ appId: \'{{appItemCtrl.app.appId}}\' })">\n' +
    '    <div class="app-icon" image-load>\n' +
    '        <img ng-src="{{::appItemCtrl.app.icon}}">\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="app-tile" ng-if="!appItemCtrl.app.isMdmApp" ng-click="appItemCtrl.launchApp(appItemCtrl.app, $event)">\n' +
    '    <div class="app-icon" image-load>\n' +
    '        <img ng-src="{{::appItemCtrl.app.icon}}">\n' +
    '    </div>\n' +
    '</div>\n' +
    '<!-- the entire app-label will launch the context dialog box, not the icon-dots ::appItemCtrl.app.name-->\n' +
    '<p class="app-label" line-clamp3 lines="2" content="::appItemCtrl.app.name" actionsheet="{uris:{\'contextdialogTemplate\':(true)}, scope:{app:appItemCtrl.app, favoriteEnabled: appItemCtrl.favoriteEnabled}}"\n' +
    '   contextdialogTemplate="app-v2/components/appItem/favoritesContextDialog.html">\n' +
    '</p>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appItem/appItemBrowser.html',
    '<div ng-class="{\'tooltip\': appItemCtrl.app.disabledThinApps && !appItemCtrl.app.thinappPackage}"\n' +
    '     data-tooltip="{{ ::\'appCenter.nav.arrange.tooltip\' | i18n }}">\n' +
    '    <div class="app-tile" ng-if="!appItemCtrl.app.thinappPackage"\n' +
    '         ng-class="{\'disable-app\': appItemCtrl.app.disabledThinApps}"\n' +
    '         ng-click="appItemCtrl.launchApp(appItemCtrl.app, $event)">\n' +
    '        <div class="app-icon" image-load>\n' +
    '            <img ng-src="{{::appItemCtrl.app.icon}}">\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="app-tile" ng-if="appItemCtrl.app.thinappPackage"\n' +
    '         ng-click="appItemCtrl.openThinAppPackageModal(appItemCtrl.app, $event)">\n' +
    '        <div class="app-icon" image-load>\n' +
    '            <img ng-src="{{::appItemCtrl.app.icon}}">\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="app-label-container">\n' +
    '    <p class="app-label" line-clamp3 lines="2" content="::appItemCtrl.app.name" >\n' +
    '    </p>\n' +
    '    <div class="app-item-actions" contextdialog="{uris:{\'contextdialogTemplate\':(true)}, scope:{app:appItemCtrl.app, favoriteEnabled: appItemCtrl.favoriteEnabled}}"\n' +
    '         contextdialogTemplate="app-v2/components/appItem/appItemContextDialogBrowser.html"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appItem/appItemContextDialogBrowser.html',
    '<section class="appitem-contextdialog-container" ng-controller="BookmarkItemContextDialogController as dialogCtrl">\n' +
    '    <ul class="appitem-contextdialog-actions-list">\n' +
    '        <li ng-if="app.viewClientLaunchEnabled">\n' +
    '            <a class="browser-open-link" ng-click="appItemCtrl.openWithViewClient(appItemCtrl.app, $event)">\n' +
    '                <span id="pt-view-client-text" class="nativenav-show">{{::\'myapps.dialog.openAppWithViewClient\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '\n' +
    '        <li ng-if="app.viewBrowserLaunchEnabled">\n' +
    '            <a class="browser-open-link" ng-click="appItemCtrl.openWithBrowser(appItemCtrl.app, $event)" ng-show="appItemCtrl.isViewOptionSupported(appItemCtrl.app, \'BROWSER\')">\n' +
    '                <span id="pt-view-browser-text" class="nativenav-show">{{::\'myapps.dialog.openAppWithBrowser\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '\n' +
    '        <li ng-if="app.isViewResourceEnabled">\n' +
    '            <a class="browser-open-link" class="launchApp" id="pt-launchapp-link" ng-click="appItemCtrl.launchApp(appItemCtrl.app, $event)">\n' +
    '                <span ng-if="app.type === \'WEB\'" id="pt-launchapp-web-text" class="nativenav-show">{{::\'myapps.dialog.openAppWithBrowser\' | i18n}}</span>\n' +
    '                <span ng-if="app.type !== \'WEB\'" id="pt-launchapp-nonweb-text" class="nativenav-show">{{::\'myapps.dialog.openApp\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '\n' +
    '        <li>\n' +
    '            <a class="detailLink" id="pt-detail-link" ng-click="dialogCtrl.hubAppDetails(app);" actiontype="links">\n' +
    '                <span id="pt-detail-text" class="nativenav-hide">{{::\'hub.contextDialog.label.viewDetails\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '\n' +
    '        <li ng-if="dialogCtrl.isBookmarkableApp(app) && favoriteEnabled">\n' +
    '            <a class="toggleFavApp" id="pt-togglefav-link" ng-click="dialogCtrl.hubToggleFavoriteApp(app, appItemCtrl.visibleLauncherApps, $index, $event);">\n' +
    '                <span id="pt-toggle-favorite-text" class="nativenav-show">{{appItemCtrl.contextDialogFavoriteLabel}}</span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '        <li ng-if="app.resetAllowed">\n' +
    '            <a class="resetDesktop" ng-click="resetDesktop(app, $event)">\n' +
    '                <span id="pt-reset-password" class="nativenav-show">{{::\'app.details.label.resetDektop\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appItem/appItemFavoriteEdit.html',
    '<div class="app-tile">\n' +
    '    <div class="app-icon" image-load>\n' +
    '        <img ng-src="{{::appItemCtrl.app.icon}}">\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="app-label-container edit-mode">\n' +
    '    <p class="app-label" line-clamp3 lines="2" content="::appItemCtrl.app.name" >\n' +
    '    </p>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appItem/favoritesContextDialog.html',
    '<section class="appitem-contextdialog-container" ng-controller="BookmarkItemContextDialogController as dialogCtrl">\n' +
    '    <!-- scrim to dismiss the dialog box -->\n' +
    '    <button class="appitem-contextdialog-scrim nativenav-show"></button>\n' +
    '\n' +
    '    <div class="appitem-contextdialog-content">\n' +
    '        <div class="appitem-contextdialog-actions">\n' +
    '            <ul class="appitem-contextdialog-actions-list">\n' +
    '                <!-- I am not sure whether the following three items are needed for hub -->\n' +
    '                <li ng-if="app.viewClientLaunchEnabled">\n' +
    '                    <a class="browser-open-link" ng-click="appItemCtrl.openWithViewClient(appItemCtrl.app, $event)">\n' +
    '                        <span id="pt-view-client-text" class="nativenav-show">{{::\'myapps.dialog.openAppWithViewClient\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '\n' +
    '                <li ng-if="app.viewBrowserLaunchEnabled">\n' +
    '                    <a class="browser-open-link" ng-click="appItemCtrl.openWithBrowser(appItemCtrl.app, $event)" ng-show="appItemCtrl.isViewOptionSupported(appItemCtrl.app, \'BROWSER\')">\n' +
    '                        <span id="pt-view-browser-text" class="nativenav-show">{{::\'myapps.dialog.openAppWithBrowser\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '\n' +
    '                <li ng-if="app.isViewResourceEnabled">\n' +
    '                    <a class="browser-open-link" class="launchApp" id="pt-launchapp-link" ng-click="appItemCtrl.launchApp(appItemCtrl.app, $event)">\n' +
    '                        <span ng-if="app.type === \'WEB\'" id="pt-launchapp-web-text" class="nativenav-show">{{::\'myapps.dialog.openAppWithBrowser\' | i18n}}</span>\n' +
    '                        <span ng-if="app.type !== \'WEB\'" id="pt-launchapp-nonweb-text" class="nativenav-show">{{::\'myapps.dialog.openApp\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '\n' +
    '                <li>\n' +
    '                    <a class="detailLink" id="pt-detail-link" ng-click="dialogCtrl.hubAppDetails(app);" actiontype="links">\n' +
    '                        <span id="pt-detail-text" class="nativenav-hide">{{::\'hub.actionsheet.label.viewDetails\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '\n' +
    '                <li ng-if="dialogCtrl.isBookmarkableApp(app) && favoriteEnabled">\n' +
    '                    <a class="toggleFavApp" id="pt-togglefav-link" ng-click="dialogCtrl.hubToggleFavoriteApp(app, appItemCtrl.visibleLauncherApps, $index, $event);">\n' +
    '                        <span id="pt-toggle-favorite-text" class="nativenav-show">{{appItemCtrl.actionSheetLabel}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="app.resetAllowed">\n' +
    '                    <a class="resetDesktop" ng-click="resetDesktop(app, $event)">\n' +
    '                        <span id="pt-reset-password" class="nativenav-show">{{::\'app.details.label.resetDektop\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '            <!-- Only iOS has the cancel button -->\n' +
    '            <ul ng-if="dialogCtrl.isIOS" class="appitem-contextdialog-actions-list cancel-action">\n' +
    '                <li>\n' +
    '                    <a id="pt-ios-cancel-link">\n' +
    '                        <span id="pt-ios-cancel-text" class="nativenav-show">{{::\'button.cancel\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appList/appList.html',
    '<div class="app-list">\n' +
    '    <header class="masthead-mobile">\n' +
    '        <masthead sub-page="true" title="appListCtrl.appListLabel | i18n" search-path="\'apps.search\'"\n' +
    '                  hide-avatar="true"></masthead>\n' +
    '    </header>\n' +
    '    <div ng-show="appListCtrl.isLoading" class="loading-app-details-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <section class="content-container">\n' +
    '        <div class="content-container-scrollable" infinite-scroll onend="appListCtrl.getNextPage()"\n' +
    '             ng-class="{\'scroll-disabled\': appListCtrl.scrollDisabled}">\n' +
    '            <div class="content">\n' +
    '                <app-list-item ng-repeat="app in appListCtrl.visibleApps" app="app" class="app-list-item" favorite-enabled="appListCtrl.favoriteEnabled && appListCtrl.app.isBookmarkableApp"\n' +
    '                               ng-click="appListCtrl.hubListGoToDetails(app.appId)"></app-list-item>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '\n' +
    '<div ui-view></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appList/appListBrowser.html',
    '<div ng-if="appListCtrl.isLoading" class="loading-app-list-container">\n' +
    '    <div ng-include="\'app-v2/components/appList/appListBrowserPreview.html\'"></div>\n' +
    '</div>\n' +
    '<section class="content-container app-list-browser">\n' +
    '    <div class="page-breadcrumb-bar" ng-if="!appListCtrl.isAWJadeDesktop">\n' +
    '        <div class="app-list-content">\n' +
    '            <h2 class="page-breadcrumb-text"><a ui-sref="apps" class="app-list-apps-link">{{::\'hub.nav.label.apps\' | i18n}}</a> &#47; {{appListCtrl.appListLabel}}</h2>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="apps-list-header" ng-if="appListCtrl.isAWJadeDesktop">\n' +
    '        <h2 class="section-headline-style2">{{appListCtrl.appListLabel}}</h2>\n' +
    '        <a ui-sref="apps" class="app-list-dismiss-button"><svg svg-symbol="icon-close-popup"></svg></a>\n' +
    '    </div>\n' +
    '    <div class="content-container-scrollable" infinite-scroll onend="appListCtrl.getNextPage()"\n' +
    '         ng-class="{\'scroll-disabled\': appListCtrl.scrollDisabled}">\n' +
    '        <div class="app-list-content">\n' +
    '            <div class="app-list-wrapper">\n' +
    '                <h2 class="app-list-section-header" ng-if="!appListCtrl.isAWJadeDesktop">{{appListCtrl.appListLabel}}</h2>\n' +
    '                <app-list-item ng-repeat="app in appListCtrl.visibleApps" app="app" class="app-list-item" favorite-enabled="appListCtrl.favoriteEnabled"\n' +
    '                               ng-click="appListCtrl.hubListGoToDetails(app.appId)"></app-list-item>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '<div class="details-uiview" ui-view></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appList/appListBrowserPreview.html',
    '<section class="content-container app-list-browser">\n' +
    '    <div class="page-breadcrumb-bar"></div>\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="app-list-content">\n' +
    '            <div class="app-list-wrapper">\n' +
    '                <div ng-repeat="app in [1, 2, 3, 4, 5, 6, 7]" class="app-list-item">\n' +
    '                    <div class="preview-app-list-item-icon preview-animating-bg"></div>\n' +
    '                    <p class="preview-app-list-item-name preview-animating-bg"></p>\n' +
    '                    <p class="preview-app-list-item-type preview-animating-bg"></p>\n' +
    '                    <div class="app-list-item-actions">\n' +
    '                        <svg svg-symbol="icon-star" class="icon-preview-favorite"></svg>\n' +
    '                        <span class="preview-app-button preview-animating-bg"></span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appListItem/appListItem.html',
    '<div ng-if="(!appListItemCtrl.hideVirtualApp || appListItemCtrl.hideVirtualApp && appListItemCtrl.app.type !== \'VIRTUAL\')">\n' +
    '    <div class="app-list-item-icon" image-load>\n' +
    '        <img ng-src="{{appListItemCtrl.app.backgroundImage}}">\n' +
    '    </div>\n' +
    '    <p line-clamp3 lines="2" content="::appListItemCtrl.app.name" class="app-list-item-name"></p>\n' +
    '    <p class="app-list-item-type" ng-if="appListItemCtrl.app.appTypeDisplayVal">\n' +
    '        <svg ng-if="appListItemCtrl.app.isHorizonResource || appListItemCtrl.app.isHorizonAirResource"\n' +
    '             svg-symbol="icon-horizon-watermark"></svg>\n' +
    '        {{::appListItemCtrl.app.appTypeDisplayVal}}\n' +
    '    </p>\n' +
    '    <p class="app-list-item-type" ng-if="appListItemCtrl.app.isTunnelRequired" ng-class="{\'tunnle-list-item\': appListItemCtrl.app.isTunnelRequired}">\n' +
    '        <svg svg-symbol="icon-tunnel" class="app-list-item-tunnel-icon-mobile"></svg>\n' +
    '        {{ ::\'app.tunnel.header\' | i18n }}\n' +
    '    </p>\n' +
    '    <div catalog-item-actions current-view="HUB_APP_LIST" app="appListItemCtrl.app" show-favorite ="!appListItemCtrl.isLoadFromDbFailed && appListItemCtrl.app.isBookmarkableApp" class="app-list-item-actions" stop-event="click">\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="appListItemCtrl.hideVirtualApp && appListItemCtrl.app.type === \'VIRTUAL\'">\n' +
    '    <div class="app-list-item-icon" image-load>\n' +
    '        <img class="img-invert" ng-src="{{appListItemCtrl.app.backgroundImage}}">\n' +
    '    </div>\n' +
    '    <p line-clamp3 lines="2" content="::appListItemCtrl.app.name" class="app-list-item-name"></p>\n' +
    '    <p class="app-list-item-type">\n' +
    '        {{ ::\'app.virtual.disabled\' | i18n }}\n' +
    '    </p>\n' +
    '    <div class="app-list-item-actions container-invert">\n' +
    '        {{ ::\'app.virtual.not.available\' | i18n }}\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appListItem/appListItemAction.html',
    '<div>\n' +
    '    <!-- Favorite app -->\n' +
    '    <span role="button" aria-label="favoriteButtonLabel"\n' +
    '          ng-if="catalogItemActionsCtrl.showFavorite && catalogItemActionsCtrl.favoriteEnabled"\n' +
    '          ng-click="catalogItemActionsCtrl.toggleBookmark(catalogItemActionsCtrl.app, $event)"\n' +
    '          ng-class="{\'app-favorited\': catalogItemActionsCtrl.app.favorite && !catalogItemActionsCtrl.app.bookmarking,\n' +
    '                \'app-not-favorited\' : !catalogItemActionsCtrl.app.favorite && !catalogItemActionsCtrl.app.bookmarking,\n' +
    '                \'app-favoriting\': catalogItemActionsCtrl.app.bookmarking}">\n' +
    '        <span ng-if="catalogItemActionsCtrl.appDetailsPage">\n' +
    '            <span class="app-button secondary-btn app-favorite-button">{{::\'appCenter.action.favorite\' | i18n}}</span>\n' +
    '            <span class="app-button secondary-btn app-un-favorite-button">{{::\'appCenter.action.unfavorite\' | i18n}}</span>\n' +
    '            <span class="app-button app-favoriting-spinner"><spinner-loading></spinner-loading></span>\n' +
    '        </span>\n' +
    '        <span ng-if="(!catalogItemActionsCtrl.isAWJadeMobile && !catalogItemActionsCtrl.appDetailsPage)">\n' +
    '            <svg svg-symbol="icon-favorite" class="icon-app-favorite-button"></svg>\n' +
    '            <svg svg-symbol="icon-favorite" class="icon-app-un-favorite-button"></svg>\n' +
    '            <span class="app-favoriting-spinner"><spinner-loading></spinner-loading></span>\n' +
    '        </span>\n' +
    '    </span>\n' +
    '\n' +
    '    <!-- Non activated requestable web apps -->\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.approvalRequired"\n' +
    '          class="app-button primary-btn app-activate" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        {{::\'appCenter.action.request\' | i18n}}\n' +
    '    </span>\n' +
    '\n' +
    '    <!-- Non activated mdm apps -->\n' +
    '    <span role="button" id="installButtonId" aria-label="installButtonLabel"\n' +
    '          ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '          class="app-button primary-btn app-install" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '         {{::\'appCenter.action.install\' | i18n}}\n' +
    '    </span>\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.statusCode == \'1\' && catalogItemActionsCtrl.app.isMdmApp\n' +
    '    && catalogItemActionsCtrl.app.mgmtRequired"\n' +
    '          class="app-managed">{{::\'hub.require.app.management\' | i18n}}</span>\n' +
    '\n' +
    '    <!-- Processing all apps -->\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && !catalogItemActionsCtrl.app.isMdmApp && catalogItemActionsCtrl.app.approvalRequired"\n' +
    '          class="app-button secondary-btn app-pending">\n' +
    '        {{::\'appCenter.action.pending\' | i18n}}\n' +
    '    </span>\n' +
    '\n' +
    '    <!-- Processing MDM apps -->\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.statusCode == \'2\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '          class="app-button secondary-btn app-installing" ng-click="catalogItemActionsCtrl.showInfo(catalogItemActionsCtrl.app, $event)">\n' +
    '        {{::\'appCenter.action.installing\' | i18n}}\n' +
    '    </span>\n' +
    '\n' +
    '    <span role="button" aria-label="launchButtonLabel" ng-if="catalogItemActionsCtrl.app.isLaunchableApp"\n' +
    '          class="app-button primary-btn app-open"\n' +
    '          ng-click="catalogItemActionsCtrl.launchApp(catalogItemActionsCtrl.app, $event)">\n' +
    '        {{::\'appCenter.action.open\' | i18n}}\n' +
    '    </span>\n' +
    '\n' +
    '    <!-- Activated mdm apps-->\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.statusCode == \'3\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '          class="app-button secondary-btn app-re-install" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        {{::\'appCenter.action.reinstall\' | i18n}}\n' +
    '    </span>\n' +
    '\n' +
    '    <!-- Update mdm apps-->\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.statusCode == \'4\' && catalogItemActionsCtrl.app.isMdmApp"\n' +
    '          class="app-button primary-btn app-update" ng-click="catalogItemActionsCtrl.activateApp()">\n' +
    '        {{::\'appCenter.action.update\' | i18n}}\n' +
    '    </span>\n' +
    '\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.isViewableThinappPackage" class="app-button primary-btn app-view"\n' +
    '          ng-click="catalogItemActionsCtrl.viewThinAppPackage(catalogItemActionsCtrl.app, $event)">\n' +
    '        <span ng-if="!catalogItemActionsCtrl.app.perDeviceActivationRequired">{{::\'appCenter.action.view\' | i18n}}</span>\n' +
    '    </span>\n' +
    '\n' +
    '    <span ng-if="catalogItemActionsCtrl.app.resetAllowed"\n' +
    '       ng-click="catalogItemActionsCtrl.resetDesktop(catalogItemActionsCtrl.app, $event)"\n' +
    '       class="app-button secondary-btn app-reset">\n' +
    '        <span class="action-text">{{::\'app.details.label.resetDektop\' | i18n}}</span>\n' +
    '    </span>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appPromotions/appPromotions.html',
    '<data-owl-carousel class="owl-carousel" data-options="appPromotionsCtrl.carouselConfig" ng-if="appPromotionsCtrl.refresh">\n' +
    '    <div class="promotion-container item" owl-carousel-item="" ng-repeat="promotion in ::appPromotionsCtrl.promotions"\n' +
    '         ng-class="{\'one\': $index%3 === 0, \'two\': $index%3 === 1, \'three\': $index%3 === 2}"  ng-style="{width:appPromotionsCtrl.promotionWidth}">\n' +
    '        <div class="promotion-card category-promotion" ng-if="promotion.customizationEntityType === \'CATEGORY\'">\n' +
    '            <p class="category-title">{{::\'hub.promotions.banner.category.title\' | i18n}}</p>\n' +
    '            <p class="category-name">{{promotion.identifier}}</p>\n' +
    '            <a class="app-button promotions-button"\n' +
    '               ui-sref="apps.list({ category: \'{{promotion.identifier}}\', type:\'category\' })">\n' +
    '                {{::\'hub.promotions.banner.category.open\' | i18n}}\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="promotion-card app-promotion" ng-if="promotion.customizationEntityType === \'APPLICATION\'">\n' +
    '            <div class="promotion-card-container">\n' +
    '                <div class="promotion-app-icon">\n' +
    '                    <div class="app-tile">\n' +
    '                        <div class="app-icon" image-load>\n' +
    '                            <img ng-src="{{appPromotionsCtrl.getAppIcon(promotion.identifier)}}">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="promotion-details">\n' +
    '                    <p class="app-name">{{appPromotionsCtrl.getAppName(promotion.identifier)}}</p>\n' +
    '                    <div ng-if="appPromotionsCtrl.isVirtualAppEnabled(promotion.identifier)">\n' +
    '                        <div class="restrict-icon"></div>\n' +
    '                        <span class="disabled-by-admin">\n' +
    '                            {{::\'hub.promotions.banner.disabled\' | i18n}}\n' +
    '                        </span>\n' +
    '                    </div>\n' +
    '                    <a class="app-button promotions-button" ng-if="!appPromotionsCtrl.isVirtualAppEnabled(promotion.identifier)"\n' +
    '                       ui-sref="apps.details({ appId: \'{{promotion.identifier}}\' })">\n' +
    '                        {{::\'hub.promotions.banner.app.get\' | i18n}}\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</data-owl-carousel>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appPromotions/appPromotionsBrowser.html',
    '<data-owl-carousel class="owl-carousel" data-options="appPromotionsBrowserCtrl.carouselConfig" ng-class="{\'ios-android\': appPromotionsBrowserCtrl.isIOSAndroid,\n' +
    '    \'lone-banner\': appPromotionsBrowserCtrl.promotions.length == 1}">\n' +
    '    <div class="promotion-card" owl-carousel-item="" ng-repeat="promotion in ::appPromotionsBrowserCtrl.promotions"\n' +
    '         ng-class="{\'one\': $index%3 === 0, \'two\': $index%3 === 1, \'three\': $index%3 === 2}">\n' +
    '        <div class="promotion-card-content category-promotion" ng-if="promotion.customizationEntityType === \'CATEGORY\'">\n' +
    '            <div class="category-promotion-wrapper">\n' +
    '                <p class="category-promo-title">{{::\'hub.promotions.banner.category.title\' | i18n}}</p>\n' +
    '                <p class="category-promo-name" line-clamp2 lines="2" content="::promotion.identifier"></p>\n' +
    '                <a class="app-button promotion-app-action-button" ui-sref="apps.list({ category: \'{{promotion.identifier}}\', type:\'category\' })">\n' +
    '                    {{::\'hub.promotions.banner.category.open\' | i18n}}\n' +
    '                </a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="promotion-card-content app-promotion" ng-if="promotion.customizationEntityType === \'APPLICATION\'">\n' +
    '            <div class="app-promo-tile">\n' +
    '                <div class="app-promo-icon" image-load>\n' +
    '                    <img ng-src="{{appPromotionsBrowserCtrl.getAppIcon(promotion.identifier)}}">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="app-promo-title-content">\n' +
    '                <p class="app-promo-name" line-clamp2 lines="2" content="::appPromotionsBrowserCtrl.getAppName(promotion.identifier)"></p>\n' +
    '                <a class="app-button promotion-app-action-button" ui-sref="apps.details({ appId: \'{{promotion.identifier}}\' })">\n' +
    '                    {{::\'hub.promotions.banner.app.get\' | i18n}}\n' +
    '                </a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</data-owl-carousel>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appRating/appRating.html',
    '<h2 class="section-headline-style2">{{\'app.rating.label\' | i18n}}</h2>\n' +
    '<div class="user-rating-container">\n' +
    '    <p class="thumbs-container like"\n' +
    '       ng-class="{\'is-rated\': appRatingCtrl.ratingData.rating === 1,\n' +
    '       \'disable-thumbs-container\': appRatingCtrl.hideVirtualApp && appRatingCtrl.app && appRatingCtrl.app.type === \'VIRTUAL\'}"\n' +
    '       ng-click="appRatingCtrl.updateLikeRating()">\n' +
    '        <svg class="icon-thumbs reverse-icon" svg-symbol="icon-thumbs"></svg>\n' +
    '        <span class="rating-text">{{ appRatingCtrl.ratingData.likes }}</span>\n' +
    '    </p>\n' +
    '    <p class="thumbs-container dislike"\n' +
    '       ng-class="{\'is-rated\': appRatingCtrl.ratingData.rating === -1,\n' +
    '       \'disable-thumbs-container\': appRatingCtrl.hideVirtualApp && appRatingCtrl.app && appRatingCtrl.app.type === \'VIRTUAL\'}"\n' +
    '       ng-click="appRatingCtrl.updateDislikeRating()">\n' +
    '        <svg class="icon-thumbs icon-thumbs-down" svg-symbol="icon-thumbs"></svg>\n' +
    '        <span class="rating-text">{{ appRatingCtrl.ratingData.dislikes }}</span>\n' +
    '    </p>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/appModuleTemplates.html',
    '<script type="text/ng-template" id="Promotions">\n' +
    '    <app-promotions class="promotions-app"\n' +
    '                    promotions="appsCtrl.promotions" applications="appsCtrl.promotionApplication"\n' +
    '                    categories="appsCtrl.promotionCategory">\n' +
    '    </app-promotions>\n' +
    '</script>\n' +
    '<script type="text/ng-template" id="Recommended">\n' +
    '    <section class="apps-recommended-apps">\n' +
    '        <div class="apps-module-header">\n' +
    '            <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                <span>{{::\'hub.apps.recommended\' | i18n}}</span>\n' +
    '            </h2>\n' +
    '            <a class="apps-module-see-all primary-text-color recommended-apps-see-all"\n' +
    '               ng-if="appsCtrl.recommendedApps.length > appsCtrl.oneRowSectionAppsCount" ng-click="appsCtrl.toggleOneRowAppsModule(\'recommended\')">\n' +
    '                <span class="see-all-span" ng-show="appsCtrl.appsModuleOneRow.recommended">{{::\'hub.apps.see.all\' | i18n}} &#40;{{appsCtrl.recommendedApps.length}}&#41;</span>\n' +
    '                <span class="see-less-span" ng-show="!appsCtrl.appsModuleOneRow.recommended">{{::\'hub.apps.see.less\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="apps-module-content">\n' +
    '            <div class="grid-container">\n' +
    '                <app-item class="grid-item app-item"\n' +
    '                          ng-repeat="app in appsCtrl.recommendedApps | limitTo: appsCtrl.displayedRecommendedAppsCount" app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</script>\n' +
    '<script type="text/ng-template" id="NewApps">\n' +
    '    <section class="apps-newapps">\n' +
    '        <div class="apps-module-header">\n' +
    '            <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                <span>{{::\'hub.apps.newApps\' | i18n}}</span>\n' +
    '            </h2>\n' +
    '            <a class="apps-module-see-all primary-text-color newapps-see-all"\n' +
    '               ng-if="appsCtrl.newApps.length > appsCtrl.oneRowSectionAppsCount" ng-click="appsCtrl.toggleOneRowAppsModule(\'newApps\')">\n' +
    '                <span class="see-all-span" ng-show="appsCtrl.appsModuleOneRow.newApps">{{::\'hub.apps.see.all\' | i18n}} &#40;{{appsCtrl.newApps.length}}&#41;</span>\n' +
    '                <span class="see-less-span" ng-show="!appsCtrl.appsModuleOneRow.newApps">{{::\'hub.apps.see.less\' | i18n}}</span>\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="apps-module-content">\n' +
    '            <div class="grid-container">\n' +
    '                <app-item class="grid-item app-item"\n' +
    '                          ng-repeat="app in appsCtrl.newApps | limitTo: appsCtrl.displayedNewAppsCount"\n' +
    '                          app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</script>\n' +
    '<script type="text/ng-template" id="Favorites">\n' +
    '    <!-- This is the favoriteapps section -->\n' +
    '    <section class="apps-configure-favorites" ng-if="!appsCtrl.favorites.length && !appsCtrl.entitlementsLoadFromDbFailed">\n' +
    '        <div class="apps-module-content configure-section" ng-click="appsCtrl.goToAllAppsList()">\n' +
    '            <p class="configure-favorites-message">{{::\'hub.apps.configure.favorites.msg\' | i18n}}</p>\n' +
    '            <button class="button-configure-favorites">{{::\'hub.apps.configure.favorites\' | i18n}}</button>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '    <section class="apps-favorite" ng-if="appsCtrl.favorites.length">\n' +
    '        <div class="apps-module-header" ng-hide="appsCtrl.favoritesOnlyView">\n' +
    '            <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                <svg svg-symbol="icon-star" class="icon-apps-section-favorite"></svg>\n' +
    '                <span>{{::\'hub.apps.favorites\' | i18n}}</span>\n' +
    '            </h2>\n' +
    '            <a class="apps-module-link primary-text-color favorite-apps-configure" ng-hide = "appsCtrl.isFavoritesEditDisabled" ng-click = "appsCtrl.goToFavoriteEditMode()">\n' +
    '                {{::\'hub.apps.edit.favorites\' | i18n}}\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="apps-module-content">\n' +
    '            <div class="grid-container">\n' +
    '                <app-item class="grid-item app-item"\n' +
    '                          ng-repeat="app in appsCtrl.favorites" app="app" favorite-enabled="appsCtrl.favoritesEnabled" app-in-favorites=true></app-item>\n' +
    '                <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</script>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/appModuleTemplatesMobile.html',
    '<script type="text/ng-template" id="Promotions">\n' +
    '    <app-promotions class="promotions"\n' +
    '                    promotions="appsCtrl.promotions" applications="appsCtrl.promotionApplication"\n' +
    '                    categories="appsCtrl.promotionCategory">\n' +
    '    </app-promotions>\n' +
    '</script>\n' +
    '<script type="text/ng-template" id="Recommended">\n' +
    '    <section class="apps-recommended-apps">\n' +
    '        <div class="apps-module-header">\n' +
    '            <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                <span>{{::\'hub.apps.recommended\' | i18n}}</span>\n' +
    '            </h2>\n' +
    '            <a class="apps-module-see-all primary-text-color recommended-apps-see-all"\n' +
    '               ng-if="appsCtrl.recommendedApps.length > appsCtrl.maxSectionAppsCount"\n' +
    '               ng-click="appsCtrl.getRecommendedApps()">\n' +
    '                {{::\'hub.apps.see.all\' | i18n}} &#40;{{appsCtrl.recommendedApps.length}}&#41;\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="apps-module-content carousel-section">\n' +
    '            <div class="grid-container"\n' +
    '                 ng-class="{\'carousel-container\': appsCtrl.recommendedApps.length > appsCtrl.minSectionAppsCount}">\n' +
    '                <app-item class="grid-item app-item"\n' +
    '                          ng-repeat="app in appsCtrl.recommendedApps | limitTo: appsCtrl.maxSectionAppsCount"\n' +
    '                          ng-class="{\'grid-item-carousel\': appsCtrl.recommendedApps.length > appsCtrl.minSectionAppsCount}"\n' +
    '                          app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"\n' +
    '                     ng-if="appsCtrl.recommendedApps.length < appsCtrl.minSectionAppsCount"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</script>\n' +
    '<script type="text/ng-template" id="NewApps">\n' +
    '    <section class="apps-newapps">\n' +
    '        <div class="apps-module-header">\n' +
    '            <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                <span>{{::\'hub.apps.newApps\' | i18n}}</span>\n' +
    '            </h2>\n' +
    '            <a class="apps-module-see-all primary-text-color newapps-see-all"\n' +
    '               ng-if="appsCtrl.newApps.length > appsCtrl.maxSectionAppsCount"\n' +
    '               ui-sref="apps.list({ type: \'newApps\' })">\n' +
    '                {{::\'hub.apps.see.all\' | i18n}} &#40;{{appsCtrl.newApps.length}}&#41;\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="apps-module-content carousel-section">\n' +
    '            <div class="grid-container"\n' +
    '                 ng-class="{\'carousel-container\': appsCtrl.newApps.length > appsCtrl.minSectionAppsCount}">\n' +
    '                <app-item class="grid-item app-item"\n' +
    '                          ng-repeat="app in appsCtrl.newApps | limitTo: appsCtrl.maxSectionAppsCount"\n' +
    '                          ng-class="{\'grid-item-carousel\': appsCtrl.newApps.length > appsCtrl.minSectionAppsCount}"\n' +
    '                          app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"\n' +
    '                     ng-if="appsCtrl.newApps.length < appsCtrl.minSectionAppsCount"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</script>\n' +
    '<script type="text/ng-template" id="Favorites">\n' +
    '    <!-- This is the favoriteapps section -->\n' +
    '    <section class="apps-favorite">\n' +
    '        <div class="apps-module-header" ng-hide="appsCtrl.favoritesOnlyView">\n' +
    '            <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                <svg svg-symbol="icon-star" class="icon-apps-section-favorite"></svg>\n' +
    '                <span>{{::\'hub.apps.favorites\' | i18n}}</span>\n' +
    '            </h2>\n' +
    '            <a class="apps-module-see-all primary-text-color favorite-apps-see-all"\n' +
    '               ng-if="appsCtrl.favorites.length > appsCtrl.minFavoriteCount"\n' +
    '               ui-sref="apps.list({ type: \'favorite\' })"> {{::\'hub.apps.see.all\' | i18n}} &#40;{{appsCtrl.favorites.length}}&#41;\n' +
    '            </a>\n' +
    '        </div>\n' +
    '        <div class="apps-module-content">\n' +
    '            <div class="grid-container">\n' +
    '                <app-item class="grid-item app-item"\n' +
    '                          ng-repeat="app in appsCtrl.favorites | limitTo: appsCtrl.favoritesOnlyView ? appsCtrl.favorites.length : appsCtrl.minFavoriteCount"\n' +
    '                          app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '\n' +
    '</script>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/browser.html',
    '<div ng-if="appsCtrl.appLoading" class="apps-loading-preview-container">\n' +
    '    <div ng-include="\'app-v2/components/apps/browserPreview.html\'"></div>\n' +
    '</div>\n' +
    '<main class="content-container apps-landing" app-orientation-directive min-favorite-count="appsCtrl.minFavoriteCount"\n' +
    '      max-section-apps-count="appsCtrl.maxSectionAppsCount" one-row-section-apps-count="appsCtrl.oneRowSectionAppsCount"\n' +
    '      min-section-apps-count="appsCtrl.minSectionAppsCount" update-displayed-apps="appsCtrl.updateDisplayedApps()">\n' +
    '    <article class="content-container-scrollable" ng-class="{\'scroll-hidden\': appsCtrl.scrollDisabled}">\n' +
    '        <div class="content" ng-class="{\'no-category\': appsCtrl.fullScreenView}">\n' +
    '            <section class="search-module" ng-hide="appsCtrl.noApps">\n' +
    '                <app-search class="search-bar-container"></app-search>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '        <div class="content left-panel" ng-if="!appsCtrl.appLoading" ng-class="{\'no-category\': appsCtrl.fullScreenView}">\n' +
    '             <!--display empty state when there is no entitlements-->\n' +
    '            <section class="apps-module apps-empty" ng-if="appsCtrl.noApps">\n' +
    '                <div class="hub-no-apps-all" ng-include="\'app-v2/svgincludes-hub/hub-no-apps.html\'"></div>\n' +
    '                <p class="no-apps-text">{{::\'hub.apps.no.apps.msg1\' | i18n}}</p>\n' +
    '                <p class="no-apps-text">{{::\'hub.apps.no.apps.msg2\' | i18n}}</p>\n' +
    '            </section>\n' +
    '\n' +
    '            <!-- Display other type of app module like newApps, recommended apps -->\n' +
    '            <ng-include src="customization" ng-if="appsCtrl.canBeDisplayedBrowser(customization)"\n' +
    '                        ng-repeat="customization in appsCtrl.customizationsOrder" class="apps-module {{customization | lowercase}}" ng-class="{\'no-border2\': !appsCtrl.favorites.length && !appsCtrl.entitlementsLoadFromDbFailed}">\n' +
    '            </ng-include>\n' +
    '\n' +
    '             <!--display all apps when there is no customization-->\n' +
    '            <section class="apps-module apps-all" ng-if="appsCtrl.showAllApps">\n' +
    '                <div class="apps-module-header">\n' +
    '                    <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                        <span>{{::\'hub.apps.allApps\' | i18n}}</span>\n' +
    '                    </h2>\n' +
    '                </div>\n' +
    '                <div class="apps-module-content">\n' +
    '                    <div class="grid-container">\n' +
    '                        <app-item class="grid-item app-item"\n' +
    '                                  ng-repeat="app in appsCtrl.entitlements"\n' +
    '                                  app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                        <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                        <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module-category" ng-if="appsCtrl.canCategoryBeDisplayed(customization)">\n' +
    '                <div class="category-container browser">\n' +
    '                    <category-component category="appsCtrl.categories"\n' +
    '                                        default-label="appsCtrl.defaultLabels"></category-component>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</main>\n' +
    '\n' +
    '<div ui-view ng-if="!appsCtrl.appLoading"></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/browserPreview.html',
    '<main class="preview-content-container">\n' +
    '    <article class="content-container-scrollable">\n' +
    '        <div class="content">\n' +
    '            <section class="search-module">\n' +
    '                <div class="preview-search-bar-container"></div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="content left-panel preview-apps">\n' +
    '            <section class="apps-module preview-promotions" ng-if="appsCtrl.previewShowPromotions">\n' +
    '                <div class="preview-promotion-card preview-animating-bg"></div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-favorite" ng-if="appsCtrl.previewShowFavorites">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-content">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3,5,6,7,8]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-recommended-apps" ng-if="appsCtrl.previewShowRecommendedApps">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-content one-row">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3,4,5]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-new-apps" ng-if="appsCtrl.previewShowNewApps">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-content one-row">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-all" ng-if="appsCtrl.previewShowAllApps">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-conten">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3,4,5,6,9,10,11,12,13,14,15,16]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="preview-category-container">\n' +
    '                <div class="preview-category category-browser">\n' +
    '                    <h2 class="preview-category-header preview-animating-bg"></h2>\n' +
    '                    <ul>\n' +
    '                        <li class="preview-category-list-item preview-animating-bg" ng-repeat="item in [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12]"></li>\n' +
    '                    </ul>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</main>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/desktop.html',
    '<header class="breadcrumb-container">\n' +
    '    <breadcrumb></breadcrumb>\n' +
    '</header>\n' +
    '<div ng-if="appsCtrl.appLoading" class="apps-desktop-loading-container">\n' +
    '    <div ng-include="\'app-v2/components/apps/desktopPreview.html\'"></div>\n' +
    '</div>\n' +
    '<main class="content-container apps-landing" app-orientation-directive min-favorite-count="appsCtrl.minFavoriteCount"\n' +
    '      max-section-apps-count="appsCtrl.maxSectionAppsCount" one-row-section-apps-count="appsCtrl.oneRowSectionAppsCount"\n' +
    '      min-section-apps-count="appsCtrl.minSectionAppsCount" update-displayed-apps="appsCtrl.updateDisplayedApps()">\n' +
    '    <article class="content-container-scrollable" ng-class="{\'scroll-hidden\': appsCtrl.scrollDisabled}">\n' +
    '        <div class="content left-panel" ng-if="!appsCtrl.appLoading"  ng-class="{\'no-category\': appsCtrl.fullScreenView}">\n' +
    '            <!-- display empty state when there is no entitlements -->\n' +
    '            <section class="apps-module apps-empty" ng-if="appsCtrl.noApps">\n' +
    '                <div class="hub-no-apps-all" ng-include="\'app-v2/svgincludes-hub/hub-no-apps.html\'"></div>\n' +
    '                <p class="no-apps-text">{{::\'hub.apps.no.apps.msg1\' | i18n}}</p>\n' +
    '                <p class="no-apps-text">{{::\'hub.apps.no.apps.msg2\' | i18n}}</p>\n' +
    '            </section>\n' +
    '\n' +
    '            <!-- Display other type of app module like newApps, recommended apps -->\n' +
    '            <ng-include src="customization" ng-if="appsCtrl.canBeDisplayedBrowser(customization)"\n' +
    '                        ng-repeat="customization in appsCtrl.customizationsOrder" class="apps-module {{customization | lowercase}}" ng-class="{\'no-border2\': !appsCtrl.favorites.length && !appsCtrl.entitlementsLoadFromDbFailed}">\n' +
    '            </ng-include>\n' +
    '\n' +
    '            <!-- display all apps when there is no customization -->\n' +
    '            <section class="apps-module apps-all" ng-if="appsCtrl.showAllApps">\n' +
    '                <div class="apps-module-header">\n' +
    '                    <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                        <span>{{::\'hub.apps.allApps\' | i18n}}</span>\n' +
    '                    </h2>\n' +
    '                </div>\n' +
    '                <div class="apps-module-content">\n' +
    '                    <div class="grid-container">\n' +
    '                        <app-item class="grid-item app-item"\n' +
    '                                  ng-repeat="app in appsCtrl.entitlements"\n' +
    '                                  app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                        <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                        <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module-category" ng-if="appsCtrl.canCategoryBeDisplayed(customization)">\n' +
    '                <div class="category-container desktop">\n' +
    '                    <category-component category="appsCtrl.categories"\n' +
    '                                        default-label="appsCtrl.defaultLabels"></category-component>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</main>\n' +
    '\n' +
    '<div ui-view ng-if="!appsCtrl.appLoading"></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/desktopPreview.html',
    '<main class="preview-content-container">\n' +
    '    <article class="content-container-scrollable">\n' +
    '        <div class="content left-panel preview-apps">\n' +
    '            <section class="apps-module preview-promotions" ng-if="appsCtrl.previewShowPromotions">\n' +
    '                <div class="preview-promotion-card preview-animating-bg"></div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-favorite" ng-if="appsCtrl.previewShowFavorites">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-content">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3,5,6,7,8]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-recommended-apps" ng-if="appsCtrl.previewShowRecommendedApps">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-content one-row">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3,4,5]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-new-apps" ng-if="appsCtrl.previewShowNewApps">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-content one-row">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="apps-module apps-all" ng-if="appsCtrl.previewShowAllApps">\n' +
    '                <h2 class="preview-apps-module-headline"></h2>\n' +
    '                <div class="preview-apps-module-conten">\n' +
    '                    <div class="grid-container">\n' +
    '                        <div class="grid-item app-item" ng-repeat="app in [1,2,3,4,5,6,9,10,11,12,13,14,15,16]">\n' +
    '                            <div class="preview-app-tile preview-animating-bg"></div>\n' +
    '                            <p class="preview-app-label-container preview-animating-bg"></p>\n' +
    '                        </div>\n' +
    '                        <div class="grid-item-empty app-item" ng-repeat="app in [1,2,3,4,5,6]">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="preview-category-container">\n' +
    '                <div class="preview-category category-browser">\n' +
    '                    <h2 class="preview-category-header preview-animating-bg"></h2>\n' +
    '                    <ul>\n' +
    '                        <li class="preview-category-list-item preview-animating-bg" ng-repeat="item in [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12]"></li>\n' +
    '                    </ul>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</main>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/apps/mobile.html',
    '<div ng-show="appsCtrl.appLoading" class="loading-container">\n' +
    '    <spinner-loading></spinner-loading>\n' +
    '</div>\n' +
    '\n' +
    '<header class="masthead-mobile" ng-class="{\'no-notification\': !appsCtrl.inAppNotificationEnabled}">\n' +
    '    <masthead sub-page="false" title="\'hub.apps\' | i18n" search-path="\'apps.search\'"\n' +
    '              hide-search="appsCtrl.noApps || appsCtrl.appLoading"></masthead>\n' +
    '</header>\n' +
    '\n' +
    '<main class="content-container" app-orientation-directive min-favorite-count="appsCtrl.minFavoriteCount"\n' +
    '      max-section-apps-count="appsCtrl.maxSectionAppsCount" one-row-section-apps-count="appsCtrl.oneRowSectionAppsCount"\n' +
    '      min-section-apps-count="appsCtrl.minSectionAppsCount" update-displayed-apps="appsCtrl.updateDisplayedApps()">\n' +
    '    <article class="content-container-scrollable" ng-class="{\'scroll-hidden\': appsCtrl.scrollDisabled}">\n' +
    '        <div class="content" pull-to-refresh="appsCtrl.clearCache()" scroll-container=".content-container-scrollable"\n' +
    '             ng-if="!appsCtrl.appLoading">\n' +
    '\n' +
    '            <!-- This is the no apps section -->\n' +
    '            <section class="apps-module apps-empty" ng-if="appsCtrl.noApps">\n' +
    '                <div class="hub-no-apps" ng-include="\'app-v2/svgincludes-hub/hub-no-apps.html\'"></div>\n' +
    '                <p class="no-apps-text">{{::\'hub.apps.no.apps.msg1\' | i18n}}</p>\n' +
    '                <p class="no-apps-text">{{::\'hub.apps.no.apps.msg2\' | i18n}}</p>\n' +
    '            </section>\n' +
    '\n' +
    '            <ng-include src="customization" ng-if="appsCtrl.canBeDisplayed(customization)"\n' +
    '                        ng-repeat="customization in appsCtrl.customizationsOrder"\n' +
    '                        class="apps-module">\n' +
    '            </ng-include>\n' +
    '\n' +
    '            <!--display all apps when there is no customization-->\n' +
    '            <section class="apps-module apps-all" ng-if="appsCtrl.showAllApps">\n' +
    '                <div class="apps-module-header">\n' +
    '                    <h2 class="section-headline-style2 apps-module-headline">\n' +
    '                        <span>{{::\'hub.apps.allApps\' | i18n}}</span>\n' +
    '                    </h2>\n' +
    '                </div>\n' +
    '                <div class="apps-module-content">\n' +
    '                    <div class="grid-container">\n' +
    '                        <app-item class="grid-item app-item"\n' +
    '                                  ng-repeat="app in appsCtrl.entitlements"\n' +
    '                                  app="app" favorite-enabled="appsCtrl.favoritesEnabled"></app-item>\n' +
    '                        <!-- Do not remove these still needed if the app count number small than the minSectionAppsCount -->\n' +
    '                        <div class="grid-item-empty" ng-repeat="app in appsCtrl.emptyFillers"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '\n' +
    '            <section class="apps-module-category"\n' +
    '                     ng-if="appsCtrl.canCategoryBeDisplayed(customization)">\n' +
    '                <div class="category-container">\n' +
    '                    <category-component category="appsCtrl.categories"\n' +
    '                                        default-label="appsCtrl.defaultLabels"></category-component>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</main>\n' +
    '\n' +
    '<div ui-view ng-if="!appsCtrl.appLoading"></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/appSearch.html',
    '<div class="apps-search" search-input search-controller="SearchController"\n' +
    '     template-url="app-v2/components/appSearch/searchInput.html" is-active="true">\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/appSearchBrowser.html',
    '<div class="apps-search-browser" search-input search-controller="SearchController"\n' +
    '     template-url="app-v2/components/appSearch/searchInputBrowser.html">\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/searchDropDown.html',
    '<div class="search-results">\n' +
    '    <!-- loading spinner section-->\n' +
    '    <div ng-if="ctrl.loading && ctrl.isAWJadeMobile" class="search-app-loading">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <div ng-if="ctrl.loading && !ctrl.isAWJadeMobile" class="search-app-loading">\n' +
    '        <div ng-include="\'app-v2/components/appSearch/searchDropDownPreview.html\'"></div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div id="search-container" class="search-results-content">\n' +
    '        <div class="section-headline-style2 app-search-header app-count" ng-show="ctrl.appCount">{{ctrl.appCount}} {{::\'hub.apps.search.header\' | i18n}}</div>\n' +
    '        <div class="app-search-section-header total-app-count" ng-show="ctrl.totalAppCount">\n' +
    '            <span class="search-category-length">{{\'hub.apps.search.in.app\' | i18n : ctrl.totalAppCount}}</span>\n' +
    '        </div>\n' +
    '        <div ng-repeat="app in ctrl.apps track by $index+app.appId+app.categoryName" class="search-item-app" ng-include="\'app-v2/components/appSearch/searchItem.html\'"></div>\n' +
    '        <div class="search-empty-result" ng-if="ctrl.noResults">\n' +
    '            <h2 class="empty-page-heading">{{ ::\'hub.apps.search.no.result.header\' | i18n }}</h2>\n' +
    '            <p class="search-empty-message">{{ ::\'hub.apps.search.no.result.msg\' | i18n }}</p>\n' +
    '            <section class="hub-no-apps" ng-include="\'app-v2/svgincludes-hub/hub-no-search-results.html\'"></section>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/searchDropDownPreview.html',
    '<div class="search-results">\n' +
    '    <div id="search-container" class="search-results-content">\n' +
    '        <div class="section-headline-style2 preview-app-search-header preview-animating-bg"></div>\n' +
    '        <div class="preview-app-search-section-header preview-animating-bg"></div>\n' +
    '        <div ng-repeat="app in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" class="preview-app-search-item" >\n' +
    '            <div class="preview-app-search-item-icon preview-animating-bg"></div>\n' +
    '            <p class="preview-app-search-item-name preview-animating-bg"></p>\n' +
    '            <p class="preview-app-search-item-type preview-animating-bg"></p>\n' +
    '            <div class="search-item-actions">\n' +
    '                <svg svg-symbol="icon-star" class="icon-preview-favorite"></svg>\n' +
    '                <span class="preview-app-button preview-animating-bg"></span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/searchInput.html',
    '<div>\n' +
    '    <header class="masthead-mobile search">\n' +
    '        <div class="search-back-button-android" ng-click="ctrl.goBack()">\n' +
    '            <svg svg-symbol="icon-search-back-android" class="icon-search-back-android"></svg>\n' +
    '        </div>\n' +
    '        <div class="search-input-bar">\n' +
    '            <label>\n' +
    '                <svg svg-symbol="icon-searchglass" class="icon-input-searchglass"></svg>\n' +
    '            </label>\n' +
    '            <input type="text"\n' +
    '                   ng-model="ctrl.query.name"\n' +
    '                   ng-change="ctrl.onsearch()"\n' +
    '                   ng-model-options="{ debounce: 500 }"\n' +
    '                   placeholder="{{ ::\'hub.apps.search.text\' | i18n }}"\n' +
    '                   class="search-inputfield"\n' +
    '                   autocorrect="off"\n' +
    '                   autocapitalize="off"/>\n' +
    '            <!--on mobile screen clear text and on desktop screen close search-->\n' +
    '            <button class="search-clear-button people-search-clear-text" ng-click="ctrl.clearSearchResults()" ng-show="ctrl.query.name && !ctrl.loading">\n' +
    '                <svg svg-symbol="icon-circle-x" class="search-clear-x-button"></svg>\n' +
    '                <svg svg-symbol="icon-circle-x-android" class="search-clear-x-button-android"></svg>\n' +
    '            </button>\n' +
    '        </div>\n' +
    '        <div class="mobile-search-cancel" ng-click="ctrl.goBack()">\n' +
    '            <span class="search-cancel">{{::\'button.cancel\'|i18n}}</span>\n' +
    '        </div>\n' +
    '    </header>\n' +
    '    <main class="content-container" scroll-input-blur>\n' +
    '        <article class="content-container-scrollable">\n' +
    '            <div class="content">\n' +
    '                <div search-dropdown template-url="app-v2/components/appSearch/searchDropDown.html"\n' +
    '                     search-item="\'.search-item-app.active\'" ng-if="ctrl.query.name.length"></div>\n' +
    '            </div>\n' +
    '        </article>\n' +
    '    </main>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/searchInputBrowser.html',
    '<div>\n' +
    '    <div class="search-input-bar">\n' +
    '        <label>\n' +
    '            <svg svg-symbol="icon-searchglass" class="icon-input-searchglass"></svg>\n' +
    '        </label>\n' +
    '        <input type="text"\n' +
    '               ng-model="ctrl.query.name"\n' +
    '               ng-change="ctrl.onsearch()"\n' +
    '               ng-model-options="{ debounce: 500 }"\n' +
    '               placeholder="{{ ::\'hub.apps.search.text\' | i18n }}"\n' +
    '               class="search-inputfield"\n' +
    '               autocorrect="off"\n' +
    '               autocapitalize="off"/>\n' +
    '        <!--on mobile screen clear text and on desktop screen close search-->\n' +
    '        <button class="search-clear-button" ng-click="ctrl.clearSearchResults()" ng-show="ctrl.query.name && !ctrl.loading">\n' +
    '            <svg svg-symbol="icon-circle-x" class="search-clear-x-button"></svg>\n' +
    '        </button>\n' +
    '    </div>\n' +
    '    <div class="search-results-scrim ng-isolate-scope" id="pt-search-scrim" ng-show="ctrl.query.name.length >=1" search-results-close\n' +
    '         close="ctrl.clearSearchResults()" show-scrim="ctrl.query.name.length >=1">\n' +
    '    </div>\n' +
    '    <div search-dropdown scroll-input-blur template-url="app-v2/components/appSearch/searchDropDown.html"\n' +
    '             search-item="\'.search-item-app.active\'" ng-if="ctrl.query.name.length">\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/appSearch/searchItem.html',
    '<div class="app-search-section-header category-name" ng-if="app.isCategory">\n' +
    '    <span class="search-category-length">{{\'hub.apps.search.in.category\' | i18n : app.length}}</span>\n' +
    '    <span ng-bind-html="app.categoryName | highlight:ctrl.query.name"></span>\n' +
    '</div>\n' +
    '<div class="app-search-item" ng-if="!app.isCategory" ng-click="ctrl.details(app)">\n' +
    '    <div ng-show="app.name">\n' +
    '        <div class="app-search-item-icon" image-load>\n' +
    '            <img ng-src="{{app._links.icon.href}}">\n' +
    '        </div>\n' +
    '        <p class="app-search-item-name" ng-bind-html="app.name | highlight:ctrl.query.name"></p>\n' +
    '        <p class="app-search-item-type">\n' +
    '            <svg ng-if="app.isHorizonResource || app.isHorizonAirResource" svg-symbol="icon-horizon-watermark"></svg>\n' +
    '            {{::app.appTypeDisplayVal}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '\n' +
    '    <div\n' +
    '        ng-if="!ctrl.isAWJadeMobile"\n' +
    '        catalog-item-actions\n' +
    '        current-view="HUB_APP_LIST"\n' +
    '        class="search-item-actions"\n' +
    '        show-favorite ="!ctrl.isLoadFromDbFailed && app.isBookmarkableApp"\n' +
    '        app="app"\n' +
    '        stop-event="click">\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/breadcrumb/breadcrumb.html',
    '<h2 class="desktop-page-title">\n' +
    '    {{::breadcrumbCtrl.desktopPageTitle}}\n' +
    '</h2>\n' +
    '<section class="desktop-right-module" ng-class="{\'notifications-enabled\': breadcrumbCtrl.inAppNotificationEnabled}">\n' +
    '    <app-search class="search-bar-container" ng-if="breadcrumbCtrl.$state.current.currentTab == \'apps\'"></app-search>\n' +
    '    <people-search class="search-bar-container" ng-if="breadcrumbCtrl.$state.current.currentTab  == \'people\'"></people-search>\n' +
    '    <div ng-if="breadcrumbCtrl.inAppNotificationEnabled" ui-sref="notifications" class="hub-desktop-notification-bell-button">\n' +
    '        <svg svg-symbol="icon-bell"></svg>\n' +
    '        <div notification-count></div>\n' +
    '    </div>\n' +
    '    <div class="desktop-refresh-button" ng-if="!breadcrumbCtrl.hideRefresh" ng-class="{\'is-refreshing\': breadcrumbCtrl.isDesktopAppRefreshing}" ng-click="breadcrumbCtrl.desktopRefresh(breadcrumbCtrl.$state.current.currentTab)">\n' +
    '        <svg svg-symbol="icon-refresh" class="icon-desktop-refresh"></svg>\n' +
    '    </div>\n' +
    '    <div class="desktop-install-button" ng-if="!breadcrumbCtrl.hideInstall" id="desktopapp-install-button" ng-click="breadcrumbCtrl.showAppInstall()">\n' +
    '        <svg svg-symbol="icon-install" class="icon-windows-install"></svg>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/category/category.html',
    '<section class="category category-mobile">\n' +
    '    <h2 class="section-headline-style2 category-header">{{::\'hub.apps.categories\' | i18n}}</h2>\n' +
    '    <ul class="category-default-items">\n' +
    '        <li class="category-list-item" ng-repeat="label in categoryCtrl.defaultLabel"\n' +
    '            title="{{label.name}}"\n' +
    '            ui-sref="apps.list({ type: \'{{label.type}}\' })">\n' +
    '            <span>{{label.name}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '    <ul class="category-custom-items">\n' +
    '        <li class="category-list-item" ng-repeat="category in categoryCtrl.category"\n' +
    '            title="{{category.name}}"\n' +
    '            ng-click="categoryCtrl.getAppsByCategory(category)">\n' +
    '            <span>{{category.name}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/category/categoryBrowser.html',
    '<section class="category category-browser">\n' +
    '    <h2 class="section-headline-style2 left-nav-heading">{{::\'hub.apps.categories\' | i18n}}</h2>\n' +
    '    <ul class="category-default-items">\n' +
    '        <li class="category-list-item" ng-repeat="label in categoryCtrl.defaultLabel"\n' +
    '            title="{{label.name}}"\n' +
    '            ui-sref="apps.list({ type: \'{{label.type}}\' })" ui-sref-active="is-selected">\n' +
    '            <span>{{label.name}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '    <ul class="category-custom-items">\n' +
    '        <li class="category-list-item" ng-repeat="category in categoryCtrl.category"\n' +
    '            title="{{category.name}}"\n' +
    '            ui-sref="apps.list({ type: \'category\', category: \'{{category.name}}\' })" ui-sref-active="is-selected">\n' +
    '            <span>{{category.name}}</span>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</section>\n' +
    '<div class="category-bottom-scrim"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/changePassword/changePassword.html',
    '<div class="password-change-container">\n' +
    '    <div ng-show="cpCtrl.isLoading" class="loading-app-details-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <section class="masthead-mobile app-details-actions">\n' +
    '        <div class="masthead-mobile-left">\n' +
    '            <span class="app-details-close" ng-click="cpCtrl.nativeClose()">\n' +
    '                <svg svg-symbol="icon-close" class="icon-close"></svg>\n' +
    '            </span>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '    <section class="content-container">\n' +
    '        <div class="content-container-scrollable">\n' +
    '            <div class="password-container support-changepassword content">\n' +
    '                <div class="headline">\n' +
    '                    <h2>{{::\'app.changePassword.title\' | i18n}}</h2>\n' +
    '                </div>\n' +
    '                <form name="changePasswordForm" novalidate>\n' +
    '                    <div class="error-messages">\n' +
    '                        <span class="error" ng-show="cpCtrl.showErrors"\n' +
    '                              ng-repeat="error in cpCtrl.errorMessages">{{ error.description }}&nbsp;</span>\n' +
    '                        <span class="error" ng-show="cpCtrl.errorMessage">{{cpCtrl.errorMessage}}</span>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field" id="pt-mobile-password-input"\n' +
    '                               type="{{cpCtrl.currentInputType}}"\n' +
    '                               ng-model="cpCtrl.currentPassword"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.currentpassword\' | i18n}}</label>\n' +
    '                        <button ng-show="cpCtrl.currentPassword" class="reveal-password-button"\n' +
    '                                ng-click="cpCtrl.togglePassword(\'current\')">\n' +
    '                            <svg ng-if="!cpCtrl.showCurrentPassword" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showCurrentPassword" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field" ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                               type="{{cpCtrl.newInputType1}}"\n' +
    '                               ng-model="cpCtrl.newPassword"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.newpassword\' | i18n}}</label>\n' +
    '                        <button ng-show="cpCtrl.newPassword" class="reveal-password-button"\n' +
    '                                ng-click="cpCtrl.togglePassword(\'new1\')">\n' +
    '                            <svg ng-if="!cpCtrl.showNewPassword1" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showNewPassword1" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field" ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                               type="{{cpCtrl.newInputType2}}"\n' +
    '                               ng-model="cpCtrl.confirmNewPassword"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.confirmpassword\' | i18n}}</label>\n' +
    '                        <button ng-show="cpCtrl.confirmNewPassword" class="reveal-password-button"\n' +
    '                                ng-click="cpCtrl.togglePassword(\'new2\')">\n' +
    '                            <svg ng-if="!cpCtrl.showNewPassword2" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showNewPassword2" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                </form>\n' +
    '                <div ng-show="cpCtrl.policies" class="policy-container-mobile">\n' +
    '                    <div class="password-policy">\n' +
    '                        <p class="password-requirement-title">{{:: \'app.passwordPolicy.passwordRequirements\' |\n' +
    '                            i18n}}</p>\n' +
    '                        <p class="password-requirement-desc" ng-bind-html="cpCtrl.policyString"></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="button-section">\n' +
    '                    <button class="primary-btn save-password" ng-click="cpCtrl.changePasswordConfirm($event)"\n' +
    '                            ng-class="{\'is-disabled\': changePasswordForm.$invalid}"\n' +
    '                            ng-disabled="changePasswordForm.$invalid">{{:: \'hub.password.done\' | i18n }}\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/details/details.html',
    '<article class="details-apps">\n' +
    '    <div ng-show="detailsCtrl.isLoading" class="loading-app-details-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <div ng-if="!detailsCtrl.isLoading">\n' +
    '        <section class="masthead-mobile app-details-actions">\n' +
    '            <div class="masthead-mobile-left app-details-close-button" ng-click="detailsCtrl.hubBackBtnAction()">\n' +
    '                <detail-close-button></detail-close-button>\n' +
    '            </div>\n' +
    '            <div class="app-logo-header" ng-style="{\'background-image\':(\'url(\'+ detailsCtrl.iconStyle+\')\')}"></div>\n' +
    '            <div class="app-action-header"\n' +
    '                 ng-if="(!detailsCtrl.isHideVirtualAppEnabled || detailsCtrl.isHideVirtualAppEnabled && detailsCtrl.app.type !== \'VIRTUAL\')">\n' +
    '                <div catalog-item-actions current-view="HUB_APP_LIST" app="detailsCtrl.app"></div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="content-container">\n' +
    '            <div class="content-container-scrollable" scroll-check currentview="details-apps" elemclass=".details-apps">\n' +
    '                <div class="content details-apps-content">\n' +
    '                    <!-- details-page-header section -->\n' +
    '                    <section class="details-page-header">\n' +
    '                        <div class="details-app-tile">\n' +
    '                            <div class="app-logo" ng-style="{\'background-image\':(\'url(\'+ detailsCtrl.iconStyle+\')\')}"></div>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <h2 class="detail-page-app-title">{{ ::detailsCtrl.name }}</h2>\n' +
    '                        <p class="detail-page-app-version" ng-if="::detailsCtrl.version">\n' +
    '                            <span>{{::\'app.details.label.version\' | i18n}}</span>\n' +
    '                            <span>{{::detailsCtrl.version}}</span>\n' +
    '                        </p>\n' +
    '                        <p class="detail-page-app-size" ng-if="detailsCtrl.appSize && detailsCtrl.app.isMdmApp">\n' +
    '                            <span>{{::\'app.details.label.size\' | i18n}}</span>\n' +
    '                            <span>{{::detailsCtrl.appSize}}</span>\n' +
    '                        </p>\n' +
    '                        <p class="detail-page-app-type" ng-if="!detailsCtrl.app.isMdmApp">\n' +
    '                            <svg class="icon-horizon" ng-if="detailsCtrl.app.isHorizonResource || detailsCtrl.app.isHorizonAirResource" svg-symbol="icon-horizon-watermark"></svg>\n' +
    '                            <span>{{::detailsCtrl.app.appTypeDisplayVal}}</span>\n' +
    '                        </p>\n' +
    '\n' +
    '                        <div ng-if="(!detailsCtrl.isHideVirtualAppEnabled || detailsCtrl.isHideVirtualAppEnabled && detailsCtrl.app.type !== \'VIRTUAL\')"\n' +
    '                             catalog-item-actions current-view="HUB_APP_LIST" app-details-page="true" show-favorite="detailsCtrl.isHubAppFavoritesEnabled && !detailsCtrl.loadFromDbFailed && detailsCtrl.app.isBookmarkableApp" class="app-details-action" app="detailsCtrl.app"></div>\n' +
    '\n' +
    '                        <div launch-message ng-if="detailsCtrl.showNativeLaunchMessage"></div>\n' +
    '                        <div class="details-page-app-not-available" ng-if="detailsCtrl.isHideVirtualAppEnabled && detailsCtrl.app.type === \'VIRTUAL\'">\n' +
    '                            {{:: \'app.virtual.unavailable\' | i18n }}\n' +
    '                        </div>\n' +
    '                    </section>\n' +
    '\n' +
    '                    <section class="section-container app-rating-container" ng-if= "detailsCtrl.isAppRatingsEnabled && !detailsCtrl.loadFromDbFailed">\n' +
    '                        <app-rating app="detailsCtrl.app" rating-data="detailsCtrl.appRatingData"\n' +
    '                                    hide-virtual-app="detailsCtrl.isHideVirtualAppEnabled"></app-rating>\n' +
    '                    </section>\n' +
    '\n' +
    '                    <section class="detail-page-description section-container" ng-if="::detailsCtrl.descriptionHTML">\n' +
    '                        <h2 class="section-headline-style2 description-header">{{::\'app.details.label.description\' | i18n}}</h2>\n' +
    '                        <div ng-if="::detailsCtrl.descriptionHTML" class="detail-page-description-text-container">\n' +
    '                            <div class="description-content">\n' +
    '                                <div id="description" ng-bind-html="::detailsCtrl.descriptionHTML"></div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </section>\n' +
    '\n' +
    '                    <section ng-if="::detailsCtrl.screenshots.length" class="section-container detail-page-screenshots" id="screenshots">\n' +
    '                        <h2 class="section-headline-style2 screenshots-header">{{::\'app.details.label.screenshots\' | i18n}}</h2>\n' +
    '                        <ul rn-carousel-control rn-carousel class="detail-page-screenshot-carousel" rn-carousel-index="carouselIndex">\n' +
    '                            <li class="detail-page-screenshot-container" ng-repeat="item in ::detailsCtrl.screenshots">\n' +
    '                                <img class="detail-page-screenshot" ng-src="{{item.href}}" ng-swipe-left="swiping=true" ng-swipe-right="swiping=true" ng-click="swiping ? ( swiping = false ) : detailsCtrl.hubOpenZoomedImageCarousel($index)">\n' +
    '                            </li>\n' +
    '                        </ul>\n' +
    '                    </section>\n' +
    '\n' +
    '                    <section class="section-container detail-page-categories" ng-if="::detailsCtrl.categories.length">\n' +
    '                        <h2 class="section-headline-style2 categories-header">{{::\'app.details.label.category\' | i18n}}</h2>\n' +
    '                        <ul class="categories-content">\n' +
    '                            <li ng-repeat="category in ::detailsCtrl.categories">{{category}}{{$last ? \'\' : \',&nbsp;\'}}</li>\n' +
    '                        </ul>\n' +
    '                    </section>\n' +
    '\n' +
    '                    <section class="section-container detail-page-support" ng-if="detailsCtrl.creatorName || detailsCtrl.supportEmail || detailsCtrl.supportPhone">\n' +
    '                        <h2 class="section-headline-style2">{{::\'app.details.label.support\' | i18n}}</h2>\n' +
    '                        <p class="detail-support-text" ng-if="::detailsCtrl.creatorName">{{::\'app.details.label.developer\' | i18n}}:&nbsp;{{detailsCtrl.creatorName}}</p>\n' +
    '                        <p class="detail-support-text" ng-if="::detailsCtrl.supportEmail">{{::\'app.details.label.email\' | i18n}}:&nbsp;{{detailsCtrl.supportEmail}}</p>\n' +
    '                        <p class="detail-support-text" ng-if="::detailsCtrl.supportPhone">{{::\'app.details.label.phone\' | i18n}}:&nbsp;{{detailsCtrl.supportPhone}}</p>\n' +
    '                    </section>\n' +
    '\n' +
    '                    <section class="section-container app-feedback" ng-if="::detailsCtrl.isAppFeedbackSupported" ng-click="detailsCtrl.openEmail()">\n' +
    '                        <a class="feedback-label">{{::\'app.details.label.sendFeedback\' | i18n}}</a>\n' +
    '                    </section>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/details/detailsBrowser.html',
    '<div ng-if="detailsCtrl.isLoading" class="loading-app-details-container">\n' +
    '    <div ng-include="\'app-v2/components/details/detailsBrowserPreview.html\'"></div>\n' +
    '</div>\n' +
    '<section class="content-container details-apps" ng-if="!detailsCtrl.isLoading">\n' +
    '    <div class="page-breadcrumb-bar" ng-if="!detailsCtrl.isAWJadeDesktop">\n' +
    '        <div class="content">\n' +
    '            <h2 class="page-breadcrumb-text"><a ui-sref="apps" class="app-detail-apps-link">{{::\'hub.nav.label.apps\' | i18n}}</a> &#47; {{ ::detailsCtrl.name }}</h2>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <a ng-if="detailsCtrl.isAWJadeDesktop" ui-sref="apps" class="app-detail-dismiss-button"><svg svg-symbol="icon-back"></svg> {{::\'hub.apps.detail.back\' | i18n}}</a>\n' +
    '    <div class="content-container-scrollable" scroll-check currentview="details-apps" elemclass=".details-apps">\n' +
    '        <div class="content details-apps-content">\n' +
    '            <!-- details-page-header section -->\n' +
    '            <section class="details-page-header">\n' +
    '                <div class="details-app-tile">\n' +
    '                    <div class="app-logo" ng-style="{\'background-image\':(\'url(\'+ detailsCtrl.iconStyle+\')\')}"></div>\n' +
    '                </div>\n' +
    '\n' +
    '                <h2 class="detail-page-app-title">{{ ::detailsCtrl.name }}</h2>\n' +
    '                <p class="detail-page-app-version" ng-if="::detailsCtrl.version">\n' +
    '                    <span>{{::\'app.details.label.version\' | i18n}}</span>\n' +
    '                    <span>{{::detailsCtrl.version}}</span>\n' +
    '                </p>\n' +
    '                <p class="detail-page-app-size" ng-if="detailsCtrl.appSize && detailsCtrl.app.isMdmApp">\n' +
    '                    <span>{{::\'app.details.label.size\' | i18n}}</span>\n' +
    '                    <span>{{::detailsCtrl.appSize}}</span>\n' +
    '                </p>\n' +
    '                <p class="detail-page-app-type" ng-if="!detailsCtrl.app.isMdmApp">\n' +
    '                    <svg class="icon-horizon" ng-if="detailsCtrl.app.isHorizonResource || detailsCtrl.app.isHorizonAirResource" svg-symbol="icon-horizon-watermark"></svg>\n' +
    '                    <span>{{::detailsCtrl.app.appTypeDisplayVal}}</span>\n' +
    '                </p>\n' +
    '\n' +
    '                <div catalog-item-actions current-view="HUB_APP_LIST" app-details-page="true" show-favorite="detailsCtrl.isHubAppFavoritesEnabled && !detailsCtrl.loadFromDbFailed && detailsCtrl.app.isBookmarkableApp" class="app-details-action" app="detailsCtrl.app"></div>\n' +
    '\n' +
    '                <div launch-message ng-if="detailsCtrl.showNativeLaunchMessage"></div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="section-container app-rating-container" ng-if= "detailsCtrl.isAppRatingsEnabled && !detailsCtrl.loadFromDbFailed">\n' +
    '                <app-rating rating-data="detailsCtrl.appRatingData"></app-rating>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="detail-page-description section-container" ng-if="::detailsCtrl.descriptionHTML">\n' +
    '                <h2 class="section-headline-style2 description-header">{{::\'app.details.label.description\' | i18n}}</h2>\n' +
    '                <div ng-if="::detailsCtrl.descriptionHTML" class="detail-page-description-text-container">\n' +
    '                    <div class="description-content">\n' +
    '                        <div id="description" ng-bind-html="::detailsCtrl.descriptionHTML"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section ng-if="::detailsCtrl.screenshots.length" class="section-container detail-page-screenshots" id="screenshots">\n' +
    '                <h2 class="section-headline-style2 screenshots-header">{{::\'app.details.label.screenshots\' | i18n}}</h2>\n' +
    '                <ul rn-carousel-control rn-carousel class="detail-page-screenshot-carousel" rn-carousel-index="carouselIndex">\n' +
    '                    <li class="detail-page-screenshot-container" ng-repeat="item in ::detailsCtrl.screenshots">\n' +
    '                        <img class="detail-page-screenshot" ng-src="{{item.href}}" ng-swipe-left="swiping=true" ng-swipe-right="swiping=true" ng-click="swiping ? ( swiping = false ) : detailsCtrl.hubOpenZoomedImageCarousel($index)">\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="section-container detail-page-categories" ng-if="::detailsCtrl.categories.length">\n' +
    '                <h2 class="section-headline-style2 categories-header">{{::\'app.details.label.category\' | i18n}}</h2>\n' +
    '                <ul class="categories-content">\n' +
    '                    <li ng-repeat="category in ::detailsCtrl.categories">{{category}}{{$last ? \'\' : \',&nbsp;\'}}</li>\n' +
    '                </ul>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="section-container detail-page-support" ng-if="detailsCtrl.creatorName || detailsCtrl.supportEmail || detailsCtrl.supportPhone">\n' +
    '                <h2 class="section-headline-style2">{{::\'app.details.label.support\' | i18n}}</h2>\n' +
    '                <p class="detail-support-text" ng-if="::detailsCtrl.creatorName">{{::\'app.details.label.developer\' | i18n}}:&nbsp;{{detailsCtrl.creatorName}}</p>\n' +
    '                <p class="detail-support-text" ng-if="::detailsCtrl.supportEmail">{{::\'app.details.label.email\' | i18n}}:&nbsp;{{detailsCtrl.supportEmail}}</p>\n' +
    '                <p class="detail-support-text" ng-if="::detailsCtrl.supportPhone">{{::\'app.details.label.phone\' | i18n}}:&nbsp;{{detailsCtrl.supportPhone}}</p>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="section-container app-feedback" ng-if="::detailsCtrl.isAppFeedbackSupported" ng-click="detailsCtrl.openEmail()">\n' +
    '                <a class="feedback-label">{{::\'app.details.label.sendFeedback\' | i18n}}</a>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/details/detailsBrowserPreview.html',
    '<section class="content-container details-apps">\n' +
    '    <div class="page-breadcrumb-bar"></div>\n' +
    '    <div class="content-container-scrollable" scroll-check currentview="details-apps" elemclass=".details-apps">\n' +
    '        <div class="content details-apps-content">\n' +
    '            <!-- details-page-header section -->\n' +
    '            <section class="details-page-header">\n' +
    '                <div class="preview-details-app-tile"></div>\n' +
    '\n' +
    '                <h2 class="preview-detail-page-app-title preview-animating-bg"></h2>\n' +
    '                <p class="preview-detail-page-app-type preview-animating-bg"></p>\n' +
    '\n' +
    '                <div class="app-details-action">\n' +
    '                    <span class="preview-app-button preview-animating-bg"></span>\n' +
    '                    <span class="preview-app-button preview-animating-bg"></span>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <!--<section class="section-container app-rating-container" ng-if= "::detailsCtrl.isAppRatingsEnabled">-->\n' +
    '            <section class="section-container preview-app-rating-container">\n' +
    '                <p class="preview-apps-rating preview-animating-bg"></p>\n' +
    '                <p class="preview-apps-rating preview-animating-bg"></p>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="detail-page-description section-container" >\n' +
    '                <h2 class="section-headline-style2 preview-description-header"></h2>\n' +
    '                <div class="detail-page-description-text-container">\n' +
    '                    <p class="preview-detail-page-description-line"></p>\n' +
    '                    <p class="preview-detail-page-description-line"></p>\n' +
    '                    <p class="preview-detail-page-description-line short"></p>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="section-container detail-page-categories" ng-if="::detailsCtrl.categories.length">\n' +
    '                <h2 class="section-headline-style2 preview-categories-header"></h2>\n' +
    '                <ul class="categories-content">\n' +
    '                    <li class="preview-details-category-item1"></li>\n' +
    '                    <li class="preview-details-category-item2"></li>\n' +
    '                </ul>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/details/nativeLaunchMessageTemplate.html',
    '<div class="notify-container launch-message">\n' +
    '    <div class="notify-message-list">\n' +
    '        <div class="notify-message-container">\n' +
    '            <div class="message-body">\n' +
    '                <p class="message-text">{{::\'app.details.label.launchMessage\' | i18n}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/details/zoomedImageCarousel.html',
    '<div modal-new="modal-zommed-image-carousel" class="hub-modal-details-screenshots-zoomed">\n' +
    '    <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '    <section class="dialog-container modal-zommed-image-carousel">\n' +
    '        <div class="dialog-body">\n' +
    '            <ul rn-carousel rn-carousel-index="carouselIndex" class="zoomed-image-carousel-list">\n' +
    '                <li ng-repeat="image in screenshots">\n' +
    '                    <img class="zoomed-image-carousel-item" ng-src="{{image.href }}" >\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <div rn-carousel-indicators ng-if="screenshots.length > 1" slides="screenshots" rn-carousel-index="carouselIndex"></div>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/favorites/favorites.html',
    '<section class="content-container app-favorites-edit">\n' +
    '    <div ng-show="favoritesCtrl.isLoading" class="loading-favorites-editmode">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <main class="container-favorites-edit">\n' +
    '        <div class="content-favorites-edit">\n' +
    '            <div class="app-favorites-edit-header">\n' +
    '                <h2>{{::\'hub.apps.edit.favorites.prompt\' | i18n}}</h2>\n' +
    '                <p class="windows-touchscreen-message" ng-if="favoritesCtrl.isWindows">{{::\'hub.apps.edit.favorites.windowstouchscreenmessage\' | i18n}}</p>\n' +
    '                <div class="editmode-close-button" ng-click="favoritesCtrl.exitEditMode($event)">\n' +
    '                    <svg svg-symbol="icon-close-popup"></svg>\n' +
    '                </div>\n' +
    '\n' +
    '                <div class="sort-warning-message-container" ng-if="favoritesCtrl.sortingWarningMessageShow">\n' +
    '                    <h2 class="sort-warning-message update-without-actions" ng-if="favoritesCtrl.sortingOrderUpdatedWithoutActions">\n' +
    '                        {{::\'hub.apps.edit.favorites.favoritesupdatedwithoutactions\' | i18n}}\n' +
    '                    </h2>\n' +
    '                    <h2 class="sort-warning-message" ng-if="favoritesCtrl.savingfavorites">\n' +
    '                        {{::\'hub.apps.edit.favorites.savecustomordering\' | i18n}}\n' +
    '                    </h2>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <section class="content-favorites-edit-body">\n' +
    '\n' +
    '                <div class="grid-container" ui-sortable="favoritesCtrl.sortableOptions" ng-model="favoritesCtrl.favoritesInEditMode" ui-sortable-update="favoritesCtrl.sortingUpdate()">\n' +
    '                    <app-item currentview="FAVORITES_EDIT" class="grid-item app-item" ng-repeat="app in favoritesCtrl.favoritesInEditMode" app="app"></app-item>\n' +
    '                    <div class="grid-item-empty" ng-repeat="app in favoritesCtrl.emptyFillers"></div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '            <div class="app-favorites-edit-footer">\n' +
    '                <div class="sort-actions-container">\n' +
    '                    <span class="sort-action sort-cancel" ng-click="favoritesCtrl.cancelSorting()" ng-class="{\'sort-button-enabled\' : favoritesCtrl.sortingButtonEnabled}">{{::\'hub.apps.edit.favorites.cancel\' | i18n}}</span>\n' +
    '                    <span class="sort-action primary-btn sort-save" ng-click="favoritesCtrl.saveCustomView()" ng-class="{\'sort-button-enabled\' : favoritesCtrl.sortingButtonEnabled}">{{::\'hub.apps.edit.favorites.save\' | i18n}}</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </main>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/masthead/mobile.html',
    '<h1 class="masthead-headline">{{mastheadCtr.title}}</h1>\n' +
    '<div class="masthead-mobile-left">\n' +
    '    <div ng-if="mastheadCtr.showNotificationsBell && mastheadCtr.inAppNotificationEnabled" ui-sref="apps.notifications" class="hub-notification-bell-button">\n' +
    '        <svg svg-symbol="icon-bell"></svg>\n' +
    '        <div notification-count></div>\n' +
    '    </div>\n' +
    '    <div class="mobile-subpage-back-button" ng-if="mastheadCtr.subPage"\n' +
    '         ng-click="mastheadCtr.goBack()">\n' +
    '        <subpage-back-button></subpage-back-button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="masthead-mobile-right">\n' +
    '    <input type="text" class="dummy-input" ng-if="mastheadCtr.isIOS">\n' +
    '    <div ng-click="mastheadCtr.openSearch(mastheadCtr.searchPath)" class="search-icon" ng-hide="mastheadCtr.hideSearch">\n' +
    '        <svg svg-symbol="icon-searchglass" class="icon-bell" ng-hide="mastheadCtr.disabled"></svg>\n' +
    '    </div>\n' +
    '    <div class="masthead-avatar" ng-click="mastheadCtr.accounts()" ng-hide="mastheadCtr.hideAvatar">\n' +
    '        <p class="masthead-avatar-initial" ng-if="mastheadCtr.userInfo.initials"><span>{{mastheadCtr.userInfo.initials}}</span></p>\n' +
    '        <img ng-if="mastheadCtr.userInfo.imageURL" ng-src="{{mastheadCtr.userInfo.imageURL}}" class="masthead-avatar-image"/>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/newAppsNotificationList/newAppsList.html',
    '<div class="app-list">\n' +
    '    <div ng-show="newAppsListCtrl.isLoading" class="loading-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <header class="masthead-mobile">\n' +
    '        <masthead sub-page="true" title="newAppsListCtrl.newAppsLabel | i18n" search-path="\'apps.search\'"\n' +
    '                  hide-search="true" hide-avatar="true"></masthead>\n' +
    '        <div class="masthead-mobile-right" actionsheet="{uris:{\'contextdialogTemplate\':(true)}}"\n' +
    '             contextdialogTemplate="app-v2/components/notifications/newAppsContextDialog.html" >\n' +
    '            <svg svg-symbol="icon-dots" class="notifications-overflow-menu" ></svg>\n' +
    '        </div>\n' +
    '    </header>\n' +
    '    <section class="content-container">\n' +
    '        <div class="content-container-scrollable">\n' +
    '            <div class="content">\n' +
    '                <app-list-item ng-repeat="app in newAppsListCtrl.newApps" app="app" hide-virtual-app="newAppsListCtrl.hideVirtualApp"\n' +
    '                               favorite-enabled="newAppsListCtrl.favoriteEnabled" class="app-list-item new-app"\n' +
    '                               ng-click="newAppsListCtrl.goToAppDetails(app.appId)"></app-list-item>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '\n' +
    '<div ui-view></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notificationDetails/notificationDetails.html',
    '<article class="hub-long-notification">\n' +
    '    <section class="masthead-mobile long-card-details-actions">\n' +
    '        <div class="masthead-mobile-left"\n' +
    '             ng-click="notificationLongCardCtrl.hubBackBtnAction()">\n' +
    '            <svg svg-symbol="icon-subpage-back" class="icon-subpage-back"></svg>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '\n' +
    '\n' +
    '    <notification-card-v2 data="notificationLongCardCtrl.cardDetails" is-long-card="true"></notification-card-v2>\n' +
    '</article>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notificationPreference/notificationPreference.html',
    '<div ng-if="notificationPreferenceCtrl.loading">\n' +
    '    <div ng-include="\'app-v2/components/notificationPreference/notificationPreferencePreview.html\'"></div>\n' +
    '</div>\n' +
    '<div class="preference-title-left-container" ng-if="!notificationPreferenceCtrl.loading">\n' +
    '    <p class="preference-instruction">{{::\'hub.nav.label.notification\' | i18n }}</p>\n' +
    '</div>\n' +
    '<div class="preference-selection-container">\n' +
    '    <div ng-repeat="connector in notificationPreferenceCtrl.connectors">\n' +
    '        <span>{{connector.name}}</span>\n' +
    '        <div class="preference-toggle" ng-if="connector.status === \'REGISTERED\' || connector.status === \'UNREGISTERED\'">\n' +
    '            <label class="switch">\n' +
    '                <input type="checkbox" ng-model="connector.status" ng-change="notificationPreferenceCtrl.updatePreference(connector.id)" ng-true-value="\'REGISTERED\'" ng-false-value="\'UNREGISTERED\'">\n' +
    '                <span class="slider round"></span>\n' +
    '            </label>\n' +
    '        </div>\n' +
    '        <div class="preference-toggle preference-pending-user" ng-if="connector.status === \'PENDING_USER_ACTION\'"><div></div></div>\n' +
    '        <div class="preference-toggle preference-in-progress" ng-if="connector.status === \'IN_PROGRESS\'"><spinner-loading></spinner-loading></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notificationPreference/notificationPreferencePreview.html',
    '<div class="preference-title-left-container">\n' +
    '    <p class="preference-instruction preview-animating-bg"></p>\n' +
    '</div>\n' +
    '<div class="preference-selection-container">\n' +
    '    <div ng-repeat="connector in [1,2,3]">\n' +
    '        <span class="preview-animating-bg preference-name">{{connector.name}}</span>\n' +
    '        <div class="preference-toggle preview-animating-bg"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/emptyNotifications.html',
    '<div ng-if="!notificationCtrl.notifications.length && !notificationCtrl.isLoading && !notificationCtrl.showFirstTimeMessage && notificationCtrl.showNoNotificationsMessage"\n' +
    '     class="empty-notification">\n' +
    '    <p class="empty-v2-notification-title primary-text-color">{{::\'hub.notifications.congratulations\' | i18n}}</p>\n' +
    '    <p class="empty-v2-notification-description">{{::\'hub.v2.notifications.empty.description\' | i18n}}</p>\n' +
    '    <div class="icon-v2-empty-notification" ng-include="\'app-v2/svgincludes-hub/hub-v2-notifications-empty.html\'"></div>\n' +
    '    <a class="view-archived-button primary-link-color"\n' +
    '       ui-sref="notifications({filter:\'all\'})">{{::\'app.notification.see.all\' | i18n}}</a>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/firstTimeMessage.html',
    '<div ng-if="notificationCtrl.showFirstTimeMessage && !notificationCtrl.isLoading" class="empty-notification">\n' +
    '    <p class="empty-v2-notification-title primary-text-color">{{::\'hub.notifications.welcome\' | i18n}}</p>\n' +
    '    <p class="empty-v2-notification-description">{{::\'hub.v2.notifications.first.time.description\' | i18n}}</p>\n' +
    '    <div class="icon-v2-empty-notification" ng-include="\'app-v2/svgincludes-hub/hub-v2-notifications-empty.html\'"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/longCardCollapsed.html',
    '<div ng-class="{\'hub-notifications-collapsed\': showMoreDetails}">\n' +
    '    <div ng-transclude></div>\n' +
    '</div>\n' +
    '<div class="hub-notification-card-more-details" ng-if="showMoreDetails" ng-click="goToLongCard(notificationCardCtrl.id)">\n' +
    '    {{::\'hub.notifications.moreDetails\' | i18n}}\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationCard.html',
    '<div id="{{ notificationCardCtrl.id }}" class="hub-notifications-card-container" long-card-directive ng-class="{\'hub-notifications-card-container-hidden\': !loaded, \'hub-notifications-card-container-mobile\': notificationCardCtrl.isMobileApp, \'priority-border\' : notificationCardCtrl.isUnactedPriority}">\n' +
    '    <div class="notifications-content">\n' +
    '        <div class="notifications-header-container">\n' +
    '            <svg ng-if="notificationCardCtrl.isNewAppNotification" svg-symbol="icon-notification-new-apps"\n' +
    '                 class="icon-notifications-ws1 icon-new-app-notification"></svg>\n' +
    '            <div ng-if="notificationCardCtrl.image" class="icon-notifications-ws1 image-holder" image-load>\n' +
    '                <img class="icon-notification-image" ng-src="{{notificationCardCtrl.image}}"/>\n' +
    '            </div>\n' +
    '            <svg ng-if="!notificationCardCtrl.isNewAppNotification && !notificationCardCtrl.image"\n' +
    '                 svg-symbol="icon-notification-default" class="icon-notifications-ws1 icon-default-notification"></svg>\n' +
    '            <div>\n' +
    '                <h2 class="notifications-title-with-subtitle">{{ notificationCardCtrl.title }}</h2>\n' +
    '                <span ng-if="notificationCardCtrl.subtitle" class="notifications-subtitle">{{ notificationCardCtrl.subtitle }}</span>\n' +
    '                <span class="notifications-subtitle-timestamp"> {{notificationCardCtrl.date}}</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="notifications-body-container">\n' +
    '            <p class="notifications-body-text" ng-if="notificationCardCtrl.message" ng-bind-html="notificationCardCtrl.message"></p>\n' +
    '            <div ng-if="notificationCardCtrl.additionalBodySection" class="notifications-additional-body-section">\n' +
    '                <div ng-repeat="app in notificationCardCtrl.newApps" class="notification-new-app-icon-container">\n' +
    '                    <img ng-src={{app.iconUrl}} class="icon-additional-body-icons"\n' +
    '                         ng-class="{\'notification-img-invert\': notificationCardCtrl.hideVirtualApp && app.appType === \'VIRTUAL\'}">\n' +
    '                </div>\n' +
    '                <p ng-if="notificationCardCtrl.excessIconsMessage"\n' +
    '                   class="notification-extra-icon-text">{{::notificationCardCtrl.excessIconsMessage }}</p>\n' +
    '            </div>\n' +
    '            <div ng-if="notificationCardCtrl.bodyFieldsSection" class="notifications-card-body-fields-section">\n' +
    '                <p class="notifications-body-text field-body-text">{{::notificationCardCtrl.cardBodyFieldTitle }}</p>\n' +
    '                <p class="notifications-body-text field-body-text">{{::notificationCardCtrl.cardBodyFieldDescription }}</p>\n' +
    '                <div ng-repeat="(key, value) in notificationCardCtrl.cardBodyFieldContent"\n' +
    '                     class="notification-card-body-fields-content">\n' +
    '                    <p class="key">{{::key }}</p>\n' +
    '                    <p class="value" time-stamp-check="{{value}}"></p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div ng-if="notificationCardCtrl.bodyFields.length > 1" class="notifications-card-body-fields-section">\n' +
    '                <div ng-repeat="fields in notificationCardCtrl.bodyFields | limitTo : 3" class="notification-card-body-fields-content">\n' +
    '                    <div ng-if="fields.type === \'GENERAL\'">\n' +
    '                        <p class="key">{{::fields.title }}</p>\n' +
    '                        <p class="value" time-stamp-check="{{fields.description}}"></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div ng-if="notificationCardCtrl.actions.length" class="notifications-actions-container">\n' +
    '            <div class="hub-action-container" ng-class="notificationCardCtrl.getHubLabelClass(action)"\n' +
    '                 ng-repeat="action in notificationCardCtrl.actions">\n' +
    '                <div id="{{ action.id }}" class="notification-button" ng-click="notificationCardCtrl.performAction(action, true)"\n' +
    '                     ng-class="notificationCardCtrl.getLabelClass(action)"\n' +
    '                     ng-bind="notificationCardCtrl.getHubLabel(action)">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationLongCard.html',
    '<section class="content-container details-notifications">\n' +
    '    <div class="page-breadcrumb-bar">\n' +
    '        <div class="content">\n' +
    '            <h2 class="page-breadcrumb-text">\n' +
    '                <a ui-sref="notifications" class="notification-link">{{::\'hub.nav.label.notification\' | i18n}}</a>\n' +
    '                &#47; {{ ::notificationCardCtrl.title }}\n' +
    '            </h2>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <a ng-if="notificationCardCtrl.isAWJadeDesktop" ui-sref="notifications" class="app-detail-dismiss-button"><svg svg-symbol="icon-back"></svg> {{::\'hub.people.notifications.back\' | i18n}}</a>\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="content">\n' +
    '            <div class="notifications-header-container hub-long-card-notifications-header-container section-container">\n' +
    '                <div ng-if="notificationCardCtrl.image" class="hub-long-card-icon image-holder" image-load>\n' +
    '                    <img class="icon-notification-image" ng-src="{{notificationCardCtrl.image}}"/>\n' +
    '                </div>\n' +
    '                <svg ng-if="!notificationCardCtrl.isNewAppNotification && !notificationCardCtrl.image"\n' +
    '                     svg-symbol="icon-notification-default"\n' +
    '                     class="hub-long-card-icon icon-default-notification"></svg>\n' +
    '                <div class="hub-long-notifications-timestamp">{{ notificationCardCtrl.date }}</div>\n' +
    '                <div ng-if="notificationCardCtrl.titleAndSubtitle">\n' +
    '                    <h2 class="notifications-title-with-subtitle">{{ notificationCardCtrl.title }}</h2>\n' +
    '                    <span class="notifications-subtitle" ng-if="notificationCardCtrl.subtitle">{{ notificationCardCtrl.subtitle }}</span>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCardCtrl.actions.length"\n' +
    '                     class="hub-long-card-notifications-actions-container header-actions">\n' +
    '                    <div class="hub-action-container" ng-class="notificationCardCtrl.getHubLabelClass(action)"\n' +
    '                         ng-repeat="action in notificationCardCtrl.actions">\n' +
    '                        <div class="notification-button"\n' +
    '                             ng-click="notificationCardCtrl.performAction(action, true)"\n' +
    '                             ng-class="notificationCardCtrl.getLabelClass(action)"\n' +
    '                             ng-bind="notificationCardCtrl.getHubLabel(action)">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="notifications-body-container hub-long-card-notifications-body-container">\n' +
    '                <section class="section-container" ng-if="notificationCardCtrl.message">\n' +
    '                    <h2 class="section-headline-style2 description-header">{{::\'hub.long.card.description\' | i18n}}</h2>\n' +
    '                    <div>\n' +
    '                        <div class="description-content" ng-if="::notificationCardCtrl.message">\n' +
    '                            <div ng-bind-html="::notificationCardCtrl.message"></div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </section>\n' +
    '                <section class="section-container" ng-if="notificationCardCtrl.additionalBodySection">\n' +
    '                    <div ng-repeat="app in notificationCardCtrl.newApps"\n' +
    '                         class="notification-new-app-icon-container">\n' +
    '                        <img ng-src={{app.iconUrl}} class="icon-additional-body-icons">\n' +
    '                    </div>\n' +
    '                    <p ng-if="notificationCardCtrl.excessIconsMessage"\n' +
    '                       class="notification-extra-icon-text">{{::notificationCardCtrl.excessIconsMessage }}</p>\n' +
    '                </section>\n' +
    '                <section class="section-container" ng-if="notificationCardCtrl.bodyFieldsSection">\n' +
    '                    <p class="notifications-body-text field-body-text">{{::notificationCardCtrl.cardBodyFieldTitle }}</p>\n' +
    '                    <p class="notifications-body-text field-body-text">{{::notificationCardCtrl.cardBodyFieldDescription }}</p>\n' +
    '                    <div ng-repeat="(key, value) in notificationCardCtrl.cardBodyFieldContent"\n' +
    '                         class="notification-card-body-fields-content">\n' +
    '                        <p class="key">{{::key }}</p>\n' +
    '                        <p class="value">{{::value }}</p>\n' +
    '                    </div>\n' +
    '                </section>\n' +
    '                <section class="section-container" ng-if="notificationCardCtrl.bodyFields.length > 1">\n' +
    '                    <div ng-repeat="fields in notificationCardCtrl.bodyFields | filter:{type : \'GENERAL\'}"\n' +
    '                         class="notification-card-body-fields-content">\n' +
    '                        <p class="key">{{::fields.title }}</p>\n' +
    '                        <p class="value">{{::fields.description }}</p>\n' +
    '                    </div>\n' +
    '                </section>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="notificationCardCtrl.actions.length"\n' +
    '         class="hub-long-card-notifications-actions-container footer-actions">\n' +
    '        <div class="hub-action-container" ng-class="notificationCardCtrl.getHubLabelClass(action)"\n' +
    '             ng-repeat="action in notificationCardCtrl.actions">\n' +
    '            <div class="notification-button" ng-click="notificationCardCtrl.performAction(action, true)"\n' +
    '                 ng-class="notificationCardCtrl.getLabelClass(action)"\n' +
    '                 ng-bind="notificationCardCtrl.getHubLabel(action)">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notifications-new-apps/notificationsNewAppsDesktopModal.html',
    '<section class="content-container app-favorites-edit notifications-new-apps-modal">\n' +
    '    <div ng-show="notificationNewAppsCtrl.isLoading" class="loading-favorites-editmode">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <main class="container-favorites-edit">\n' +
    '        <div class="content-favorites-edit">\n' +
    '            <div class="bookmark-all-header">\n' +
    '                <h2>{{::\'app.notification.newApps.title\' | i18n}}</h2>\n' +
    '                <p class="bookmark-all-message">{{::\'app.notification.newApps.subtitle\' | i18n}}</p>\n' +
    '                <div class="editmode-close-button" ng-click="notificationNewAppsCtrl.goToNotifications()">\n' +
    '                    <svg svg-symbol="icon-close-popup"></svg>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <section class="new-apps-modal-body">\n' +
    '                <div class="grid-container">\n' +
    '                    <app-item currentview="FAVORITES_EDIT" class="grid-item app-item" ng-repeat="app in notificationNewAppsCtrl.newApps" ng-click="notificationNewAppsCtrl.goToAppDetails(app.appId)" app="app"></app-item>\n' +
    '                    <div class="grid-item-empty" ng-repeat="app in notificationNewAppsCtrl.emptyFillers"></div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '            <div class="app-favorites-edit-footer">\n' +
    '                <div class="sort-actions-container">\n' +
    '                    <span class="sort-action primary-btn sort-save sort-button-enabled favorite-all-btn" ng-click="notificationNewAppsCtrl.bookmarkAll()">{{::\'hub.notifications.new.apps.favorite.all\' | i18n}}</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </main>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationsBrowser.html',
    '<header class="breadcrumb-container">\n' +
    '    <breadcrumb hide-install="true" hide-refresh="true"></breadcrumb>\n' +
    '</header>\n' +
    '<section class="content-container">\n' +
    '    <div ng-if="notificationCtrl.isLoading" class="notification-loading-container">\n' +
    '        <div ng-include="\'app-v2/components/notifications-v2/notificationsBrowserPreview.html\'"></div>\n' +
    '    </div>\n' +
    '    <div class="content-container-scrollable" ng-if="!notificationCtrl.isLoading">\n' +
    '        <a ng-if="notificationCtrl.isAWJadeDesktop" ui-sref="apps" class="notifications-back-button"><svg svg-symbol="icon-back"></svg> {{::\'hub.apps.detail.back\' | i18n}}</a>\n' +
    '        <div class="content">\n' +
    '            <div class="hub-notifications-nav-container">\n' +
    '                <h2 class="notification-page-title desktop-page-title ng-binding">\n' +
    '                    {{::\'hub.nav.label.notification\' | i18n}}\n' +
    '                </h2>\n' +
    '                <notifications-left-nav links="notificationCtrl.leftNavLinks" header-label="::\'hub.nav.label.notifications.filter\' | i18n"></notifications-left-nav>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '<section class="notifications-container content-container" ng-if="!notificationCtrl.isLoading">\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="notifications-content-wrapper">\n' +
    '            <ng-include src="\'app-v2/components/notifications-v2/emptyNotifications.html\'"></ng-include>\n' +
    '            <ng-include src="\'app-v2/components/notifications-v2/firstTimeMessage.html\'"></ng-include>\n' +
    '            <div ng-if="notificationType.notifications.length" ng-repeat="notificationType in notificationCtrl.parsedNotification track by notificationType.label">\n' +
    '                <h2 class="section-headline-style2 notifications-timestamp">{{notificationType.label}}</h2>\n' +
    '                <notification-card-v2\n' +
    '                        ng-repeat="notification in notificationType.notifications track by notification.id"\n' +
    '                        data="notification"\n' +
    '                        ></notification-card-v2>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '<div ui-view ng-if="notificationCtrl.notifications.length"></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationsBrowserPreview.html',
    '<section class="content-container">\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="content">\n' +
    '            <section class="preview-notification-leftnav">\n' +
    '                <div class="preview-category category-browser">\n' +
    '                    <h2 class="preview-category-header preview-animating-bg"></h2>\n' +
    '                    <ul>\n' +
    '                        <li class="preview-category-list-item preview-animating-bg" ng-repeat="item in [1,2,3]"></li>\n' +
    '                    </ul>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '<section class="notifications-container content-container">\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="notifications-content-wrapper">\n' +
    '            <h2 class="preview-notification-section-title preview-animating-bg"></h2>\n' +
    '            <div class="preview-notification-card" ng-repeat="item in [1,2,3,4,5,6]">\n' +
    '                <div class="preview-notification-card-header">\n' +
    '                    <div class="preview-notification-card-header-avatar preview-animating-bg"></div>\n' +
    '                    <h2 class="preview-notification-card-header-title preview-animating-bg"></h2>\n' +
    '                </div>\n' +
    '                <p class="preview-notification-description-line"></p>\n' +
    '                <p class="preview-notification-description-line short"></p>\n' +
    '                <p class="preview-notification-description-line timestamp"></p>\n' +
    '                <div class="preview-notification-card-actions"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationsMobile.html',
    '<article class="notifications-subpage-container">\n' +
    '    <div ng-show="notificationCtrl.isLoading" class="loading-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <header class="masthead-mobile no-search-masthead">\n' +
    '        <div ng-if="notificationCtrl.showCloseButton" class="masthead-mobile-left app-details-close-button" ng-click="notificationCtrl.goBack()">\n' +
    '            <detail-close-button></detail-close-button>\n' +
    '        </div>\n' +
    '        <h2 class="masthead-headline">{{::\'hub.notifications\' | i18n }}</h2>\n' +
    '        <div class="masthead-mobile-right" ng-class="{\'masthead-extended-width\': notificationCtrl.isAndroid}">\n' +
    '            <div class="filter-text-container" actionsheet="{uris:{\'contextdialogTemplate\':(true)}}" contextdialogTemplate="app-v2/components/notifications-v2/notificationsV2ContextDialogMobile.html" ng-class="{\'android-filter-text-container\': notificationCtrl.isAndroid}" ng-bind="notificationCtrl.filterText"></div>\n' +
    '            <div ng-show="notificationCtrl.isAndroid" class="solid-down-arrow"></div>\n' +
    '        </div>\n' +
    '    </header>\n' +
    '    <section class="content-container">\n' +
    '        <div class="content-container-scrollable">\n' +
    '            <div class="hub-notifications-container">\n' +
    '                <ng-include src="\'app-v2/components/notifications-v2/firstTimeMessage.html\'"></ng-include>\n' +
    '                <ng-include src="\'app-v2/components/notifications-v2/emptyNotifications.html\'"></ng-include>\n' +
    '                <div ng-repeat="notificationType in notificationCtrl.parsedNotification track by notificationType.label">\n' +
    '                    <div ng-if="notificationType.notifications.length">\n' +
    '                        <h2 class="section-headline-style2 notifications-timestamp" ng-class="{\'hub-notifications-timestamp-tablet\': notificationCtrl.isAWJadeTablet}">{{notificationType.label}}</h2>\n' +
    '                        <notification-card-v2 ng-repeat="notification in notificationType.notifications track by notification.id"\n' +
    '                                              data="notification"></notification-card-v2>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</article>\n' +
    '<div ui-view ng-if="notificationCtrl.notifications.length"></div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationsV2ContextDialog.html',
    '<section class="hub-notification-dialog-container" ng-controller="NotificationV2ContextDialogController as notificationDialogCtrl">\n' +
    '    <ul class="hub-notification-actions-list">\n' +
    '        <li ng-repeat="filter in notificationDialogCtrl.filtersList">\n' +
    '            <a class="browser-open-link" ng-click="notificationDialogCtrl.goToFilter(filter.filterName)">\n' +
    '                <span ng-class="{\'notifications-menu-item-selected-text\' : notificationDialogCtrl.filter === filter.filterName}" id="hub-notifications-filter-{{filter.filterName}}" ng-bind="filter.label" class="nativenav-show"></span>\n' +
    '            </a>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/notificationsV2ContextDialogMobile.html',
    '<section class="appitem-contextdialog-container" ng-controller="NotificationV2ContextDialogController as ctrl">\n' +
    '    <!-- scrim to dismiss the dialog box -->\n' +
    '    <button class="appitem-contextdialog-scrim nativenav-hide"></button>\n' +
    '\n' +
    '    <div class="appitem-contextdialog-content">\n' +
    '        <div class="appitem-contextdialog-actions">\n' +
    '            <ul class="appitem-contextdialog-actions-list">\n' +
    '                <li ng-repeat="filter in ctrl.filtersList">\n' +
    '                    <div ng-if="ctrl.isAndroid" class="menu-item-container">\n' +
    '                        <svg svg-symbol="icon-filter-selected" class="notifications-dialog-overflow-menu" ng-if="ctrl.filter === filter.filterName"></svg>\n' +
    '                    </div>\n' +
    '                    <a class="hub-notifications-filter-action" id="pt-notifications-{{filter.filterName}}" ng-click="ctrl.goToFilter(filter.filterName)">\n' +
    '                        <span ng-class="{\'notifications-menu-item-selected-text\' : ctrl.isAndroid && ctrl.filter === filter.filterName}" ng-bind="filter.label" class="nativenav-hide"></span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '            <ul ng-if="ctrl.isIOS" class="appitem-contextdialog-actions-list cancel-action">\n' +
    '                <li>\n' +
    '                    <a>\n' +
    '                        <span class="nativenav-hide">{{::\'button.cancel\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '\n' +
    '            <ul ng-if="ctrl.isAndroid" class="appitem-contextdialog-actions-list cancel-action notifications-context-dialog-cancel">\n' +
    '                <li>\n' +
    '                    <div class="menu-item-container">\n' +
    '                        <svg svg-symbol="icon-notification-filter-cancel" class="notifications-dialog-overflow-menu-cancel" ></svg>\n' +
    '                    </div>\n' +
    '                    <a class="hub-notifications-filter-action">\n' +
    '                        <span class="nativenav-hide">{{::\'button.cancel\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/snackBarNotifications/genericSnackBarNotifications.html',
    '<div ng-controller="SnackBarNotificationsController as ctr" class="snack-bar-container"\n' +
    '     ng-click="ctr.goToNotification();close($index);">\n' +
    '    <div class="alert-icon">\n' +
    '        <svg svg-symbol="snack-bar-alert"></svg>\n' +
    '    </div>\n' +
    '    <div class="message">\n' +
    '        <div class="title">{{::\'hub.snack.bar.generic.message\' | i18n : ctr.notificationLength}}</div>\n' +
    '        <div class="sub-title" ng-if="ctr.isAWJadeMobile">{{::\'hub.snack.bar.mobile.generic.action\' | i18n}}</div>\n' +
    '        <div class="sub-title" ng-if="!ctr.isAWJadeMobile">{{::\'hub.snack.bar.browser.generic.action\' | i18n}}</div>\n' +
    '    </div>\n' +
    '    <div class="close" ng-click="close($index)">\n' +
    '        <svg svg-symbol="icon-close"></svg>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications-v2/snackBarNotifications/snackBarNotifications.html',
    '<div ng-controller="SnackBarNotificationsController as ctr" class="snack-bar-container"\n' +
    '     ng-click="ctr.goToNotification(ctr.notificationId);close($index);">\n' +
    '    <div class="alert-icon">\n' +
    '        <svg svg-symbol="snack-bar-alert"></svg>\n' +
    '    </div>\n' +
    '    <div class="message">\n' +
    '        <div class="title">{{ctr.title}}</div>\n' +
    '        <div class="sub-title" ng-if="ctr.subTitle">{{ctr.subTitle}}</div>\n' +
    '        <div class="sub-title description" ng-if="!ctr.subTitle && ctr.description">{{ctr.description}}</div>\n' +
    '    </div>\n' +
    '    <div class="close" ng-click="close($index)">\n' +
    '        <svg svg-symbol="icon-close"></svg>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications/hubNotificationCardMobile.html',
    '<div id="{{ notificationCardCtrl.id }}" class="hub-notifications-card-container hub-notifications-card-container-mobile">\n' +
    '    <svg ng-if="!notificationCardCtrl.notification.read_at" svg-symbol="icon-close-popup" class="notifications-close-button" ng-click="notificationCardCtrl.dismissNotification()"></svg>\n' +
    '    <div class="notifications-content">\n' +
    '        <div class="notifications-header-container" ng-class="{\'priority-background\':notificationCardCtrl.isPriority && !notificationCardCtrl.read_at}">\n' +
    '            <svg ng-if="notificationCardCtrl.isNewAppNotification" svg-symbol="icon-notification-new-apps" class="icon-notifications-ws1 icon-new-app-notification"></svg>\n' +
    '            <div ng-if="notificationCardCtrl.image" class="icon-notifications-ws1 image-holder" image-load>\n' +
    '                <img class="icon-notification-image" ng-src="{{notificationCardCtrl.image}}"/>\n' +
    '            </div>\n' +
    '            <svg ng-if="!notificationCardCtrl.isNewAppNotification && !notificationCardCtrl.image" svg-symbol="icon-notification-default" class="icon-notifications-ws1 icon-default-notification"></svg>\n' +
    '            <div ng-if="!notificationCardCtrl.titleAndSubtitle">\n' +
    '                <h2 class="notifications-title">{{ notificationCardCtrl.title }}</h2>\n' +
    '            </div>\n' +
    '            <div ng-if="notificationCardCtrl.titleAndSubtitle">\n' +
    '                <h2 class="notifications-title-with-subtitle">{{ notificationCardCtrl.title }}</h2>\n' +
    '                <span class="notifications-subtitle">{{ notificationCardCtrl.subtitle }}</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="notifications-body-container">\n' +
    '            <p class="notifications-body-text" ng-bind-html="notificationCardCtrl.message"></p>\n' +
    '            <div ng-if="notificationCardCtrl.additionalBodySection" class="notifications-additional-body-section">\n' +
    '                <div ng-repeat="app in notificationCardCtrl.newApps" class="notification-new-app-icon-container">\n' +
    '                    <img ng-src={{app.iconUrl}} class="icon-additional-body-icons"\n' +
    '                         ng-class="{\'notification-img-invert\': (notificationCardCtrl.hideVirtualApp && app.appType === \'VIRTUAL\')}">\n' +
    '                </div>\n' +
    '                <p ng-if="notificationCardCtrl.excessIconsMessage" class="notification-extra-icon-text">{{::notificationCardCtrl.excessIconsMessage }}</p>\n' +
    '            </div>\n' +
    '            <div ng-if="notificationCardCtrl.bodyFieldsSection" class="notifications-card-body-fields-section">\n' +
    '                <p class="notifications-body-text field-body-text">{{::notificationCardCtrl.cardBodyFieldTitle }}</p>\n' +
    '                <p class="notifications-body-text field-body-text">{{::notificationCardCtrl.cardBodyFieldDescription }}</p>\n' +
    '                <div ng-repeat="(key, value) in notificationCardCtrl.cardBodyFieldContent" class="notification-card-body-fields-content">\n' +
    '                    <p class="key">{{::key }}</p>\n' +
    '                    <p class="value">{{::value }}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="hub-notifications-date" ng-if="!notificationCardCtrl.read_at">{{ notificationCardCtrl.date }}</div>\n' +
    '        </div>\n' +
    '        <div class="notifications-archived-text primary-text-color" ng-if="notificationCardCtrl.showArchivedMessage()">\n' +
    '            <p class="left">{{::\'hub.notifications.archived.label\' | i18n}}</p>\n' +
    '            <p class="timestamp" ng-bind="notificationCardCtrl.archivedTimeLabel()"></p>\n' +
    '        </div>\n' +
    '        <div ng-if="notificationCardCtrl.actions.length" class="notifications-actions-container">\n' +
    '            <div class="hub-action-container" ng-class="notificationCardCtrl.getHubLabelClass(action)" ng-repeat="action in notificationCardCtrl.actions">\n' +
    '                <div class="notification-button" ng-click="notificationCardCtrl.performAction(action, true)"\n' +
    '                     ng-class="notificationCardCtrl.getLabelClass(action)" ng-bind="notificationCardCtrl.getHubLabel(action)">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications/newAppsContextDialog.html',
    '<section class="appitem-contextdialog-container" ng-controller="NewAppsNotificationController as newAppsNotificationCtrl">\n' +
    '    <!-- scrim to dismiss the dialog box -->\n' +
    '    <button class="appitem-contextdialog-scrim"></button>\n' +
    '\n' +
    '    <div class="appitem-contextdialog-content">\n' +
    '        <div class="appitem-contextdialog-actions">\n' +
    '            <ul class="appitem-contextdialog-actions-list">\n' +
    '                <li>\n' +
    '                    <a class="hub-bookmark-all-new-apps" ng-click="newAppsNotificationCtrl.bookmarkAll()">\n' +
    '                        <span>{{::\'hub.notifications.new.apps.favorite.all\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '            <!-- Only iOS has the cancel button -->\n' +
    '            <ul ng-if="newAppsNotificationCtrl.isIOS" class="appitem-contextdialog-actions-list cancel-action">\n' +
    '                <li><a>{{::\'button.cancel\' | i18n}}</a></li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications/notifications.html',
    '<article class="notifications-subpage-container">\n' +
    '    <div ng-show="notificationCtrl.isLoading" class="loading-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <header class="masthead-mobile no-search-masthead">\n' +
    '        <div ng-if="notificationCtrl.archivedTab" class="masthead-mobile-left archive-back-button" ng-click="notificationCtrl.goBack()">\n' +
    '            <subpage-back-button></subpage-back-button>\n' +
    '        </div>\n' +
    '        <div ng-if="!notificationCtrl.archivedTab" class="masthead-mobile-left app-details-close-button" ng-click="notificationCtrl.goBack()">\n' +
    '            <detail-close-button></detail-close-button>\n' +
    '        </div>\n' +
    '        <h2 ng-if="!notificationCtrl.archivedTab" class="masthead-headline">{{::\'hub.notifications\' | i18n }}</h2>\n' +
    '        <h2 ng-if="notificationCtrl.archivedTab" class="masthead-headline">{{::\'myapps.mobilepagetitle.archived\' | i18n }}</h2>\n' +
    '        <div class="masthead-mobile-right" ng-hide="notificationCtrl.showFirstTimeMessage || notificationCtrl.archivedTab" actionsheet="{uris:{\'contextdialogTemplate\':(true)}}"\n' +
    '             contextdialogTemplate="app-v2/components/notifications/notificationsContextDialog.html">\n' +
    '            <svg svg-symbol="icon-dots-large" class="notifications-overflow-menu" ></svg>\n' +
    '        </div>\n' +
    '    </header>\n' +
    '    <section class="content-container">\n' +
    '        <div class="content-container-scrollable">\n' +
    '            <div class="notifications-content-wrapper" ng-if="!notificationCtrl.archivedTab">\n' +
    '                <div ng-if="notificationCtrl.showFirstTimeMessage && !notificationCtrl.isLoading" class="empty-notification">\n' +
    '                    <p class="empty-notification-title">{{::\'hub.notifications.welcome\' | i18n}}</p>\n' +
    '                    <p class="empty-notification-description">{{::\'hub.notifications.first.time.message\' | i18n}}</p>\n' +
    '                    <div class="icon-empty-notification" ng-include="\'app-v2/svgincludes-hub/hub-notification-all-caughtup.html\'"></div>\n' +
    '                </div>\n' +
    '                <div ng-if="!notificationCtrl.notifications.length && !notificationCtrl.isLoading && notificationCtrl.showNoNotificationsMessage" class="empty-notification">\n' +
    '                    <p class="empty-notification-title">{{::\'hub.notifications.congratulations\' | i18n}}</p>\n' +
    '                    <p class="empty-notification-description">{{::\'hub.notifications.empty.description1\' | i18n}}</p>\n' +
    '                    <p class="empty-notification-description">{{::\'hub.notifications.empty.description2\' | i18n}}</p>\n' +
    '                    <div class="icon-empty-notification" ng-include="\'app-v2/svgincludes-hub/hub-notification-all-caughtup.html\'"></div>\n' +
    '                    <button class="view-archived-button primary-link-color" ng-click="notificationCtrl.hubGoToArchived()">{{::\'app.notification.see.archived\' | i18n}}</button>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCtrl.priority.length">\n' +
    '                    <h2 class="section-headline-style2 notifications-timestamp">{{\'hub.notifications.priority\' | i18n }}</h2>\n' +
    '                    <hub-notification-card ng-repeat="notification in notificationCtrl.priority track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCtrl.today.length">\n' +
    '                    <h2 class="section-headline-style2 notifications-timestamp">{{\'hub.notifications.today\' | i18n }}</h2>\n' +
    '                    <hub-notification-card ng-repeat="notification in notificationCtrl.today track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCtrl.yesterday.length">\n' +
    '                    <h2 class="section-headline-style2 notifications-timestamp">{{\'hub.notifications.yesterday\' | i18n }}</h2>\n' +
    '                    <hub-notification-card ng-repeat="notification in notificationCtrl.yesterday track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCtrl.lastWeek.length">\n' +
    '                    <h2 class="section-headline-style2 notifications-timestamp">{{\'hub.notifications.lastWeek\' | i18n }}</h2>\n' +
    '                    <hub-notification-card ng-repeat="notification in notificationCtrl.lastWeek track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCtrl.lastMonth.length">\n' +
    '                    <h2 class="section-headline-style2 notifications-timestamp">{{\'hub.notifications.lastMonth\' | i18n }}</h2>\n' +
    '                    <hub-notification-card ng-repeat="notification in notificationCtrl.lastMonth track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '                </div>\n' +
    '                <div ng-if="notificationCtrl.older.length > 0">\n' +
    '                    <h2 class="section-headline-style2 notifications-timestamp">{{\'hub.notifications.older\' | i18n }}</h2>\n' +
    '                    <hub-notification-card ng-repeat="notification in notificationCtrl.older track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="notifications-content-wrapper" ng-if="notificationCtrl.archivedTab">\n' +
    '                <div ng-if="!notificationCtrl.notifications.length && !notificationCtrl.isLoading && notificationCtrl.showNoNotificationsMessage" class="empty-notification">\n' +
    '                    <p class="empty-notification-title">{{::\'hub.notifications.congratulations\' | i18n}}</p>\n' +
    '                    <p class="empty-notification-description">{{::\'hub.notifications.empty.description.archived\' | i18n}}</p>\n' +
    '                    <div class="icon-empty-notification" ng-include="\'app-v2/svgincludes-hub/hub-notification-all-caughtup.html\'"></div>\n' +
    '                </div>\n' +
    '                <hub-notification-card ng-repeat="notification in notificationCtrl.notifications track by notification.id" data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></hub-notification-card>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</article>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notifications/notificationsContextDialog.html',
    '<section class="appitem-contextdialog-container" ng-controller="NotificationController as notificationCtrl">\n' +
    '    <!-- scrim to dismiss the dialog box -->\n' +
    '    <button class="appitem-contextdialog-scrim nativenav-hide"></button>\n' +
    '\n' +
    '    <div class="appitem-contextdialog-content">\n' +
    '        <div class="appitem-contextdialog-actions">\n' +
    '            <ul class="appitem-contextdialog-actions-list">\n' +
    '                <li>\n' +
    '                    <a class="hub-notifications-see-archived" id="pt-notifications-see-archived-link" ng-click="notificationCtrl.hubGoToArchived($event)">\n' +
    '                        <span class="nativenav-hide">{{::\'app.notification.see.archived\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li ng-if="notificationCtrl.notifications.length">\n' +
    '                    <a class="hub-notifications-archive-all" id="pt-notifications-archived-link" ng-click="notificationCtrl.archiveAll($event)">\n' +
    '                        <span class="nativenav-hide">{{::\'app.notification.archive.all\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '            <!-- Only iOS has the cancel button -->\n' +
    '            <ul ng-if="notificationCtrl.isIOS" class="appitem-contextdialog-actions-list cancel-action">\n' +
    '                <li>\n' +
    '                    <a>\n' +
    '                        <span class="nativenav-hide">{{::\'button.cancel\' | i18n}}</span>\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/notificationsLeftNav/notificationsLeftNav.html',
    '<h2 class="left-nav-heading section-headline-style2">{{notificationsLeftNav.headerLabel }}</h2>\n' +
    '<ul class="left-nav-list">\n' +
    '    <li class="category-list-item {{nav.class}}" ng-repeat="nav in notificationsLeftNav.links" title="{{nav.label}}" ui-sref="{{nav.link}}" ui-sref-active="is-selected">\n' +
    '        <span>{{nav.label}}</span>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/people.html',
    '<div ng-show="peopleCtrl.isLoading" class="loading-people-container">\n' +
    '    <spinner-loading></spinner-loading>\n' +
    '</div>\n' +
    '\n' +
    '<header class="masthead-mobile people">\n' +
    '    <masthead title="\'hub.people\' | i18n" search-placeholder="\'hub.people.search.text\' | i18n" search-path="\'people.search\'"></masthead>\n' +
    '</header>\n' +
    '\n' +
    '<section class="content-container people">\n' +
    '    <article class="content-container-scrollable people">\n' +
    '        <div class="content" pull-to-refresh="peopleCtrl.clearCache()" scroll-container=".people.content-container-scrollable">\n' +
    '            <!-- people team section -- manager -->\n' +
    '            <div class="people-team-section people-manager-panel">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.manager\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="manager" category="\'team\'" class="grid-item people-team-item"\n' +
    '                                 ng-repeat="manager in peopleCtrl.managers track by $index+manager.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <!-- people team section -- peers -->\n' +
    '            <div class="people-team-section people-peer-panel" ng-if="peopleCtrl.peers.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.mypeers\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="peer" category="\'team\'" class="grid-item people-team-item" ng-repeat="peer in peopleCtrl.peers track by $index+peer.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- people team section -- direct reports -->\n' +
    '            <div class="people-team-section people-directreport-panel" ng-if="peopleCtrl.directReports.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.directreports\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="directReport" category="\'team\'" class="grid-item people-team-item"\n' +
    '                             ng-repeat="directReport in peopleCtrl.directReports track by $index+directReport.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</section>\n' +
    '\n' +
    '<!-- people detail page -->\n' +
    '<div ui-view></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleBrowser.html',
    '<div ng-if="peopleCtrl.isLoading" class="loading-people-container">\n' +
    '    <div ng-include="\'app-v2/components/people/peopleBrowserPreview.html\'"></div>\n' +
    '</div>\n' +
    '<section class="content-container people" ng-if="!peopleCtrl.isLoading">\n' +
    '    <article class="content-container-scrollable people" ng-class="{\'scroll-hidden\': peopleCtrl.scrollDisabled}">\n' +
    '        <div class="content">\n' +
    '            <section class="people-search-module" >\n' +
    '                <people-search class="search-bar-container"></people-search>\n' +
    '            </section>\n' +
    '            <!-- people team section -- peers -->\n' +
    '            <div class="people-team-section people-peer-panel" ng-if="peopleCtrl.peers.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.mypeers\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="peer" category="\'team\'" class="grid-item people-team-item" ng-repeat="peer in peopleCtrl.peers track by $index+peer.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- people team section -- direct reports -->\n' +
    '            <div class="people-team-section people-directreport-panel" ng-if="peopleCtrl.directReports.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.directreports\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="directReport" category="\'team\'" class="grid-item people-team-item"\n' +
    '                                 ng-repeat="directReport in peopleCtrl.directReports track by $index+directReport.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- people team section -- manager -->\n' +
    '            <div class="people-team-section people-manager-panel" ng-if="peopleCtrl.managers.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.manager\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="manager" category="\'team\'" class="grid-item people-team-item"\n' +
    '                                 ng-repeat="manager in peopleCtrl.managers track by $index+manager.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</section>\n' +
    '\n' +
    '<!-- people detail page -->\n' +
    '<div ui-view></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleBrowserPreview.html',
    '<section class="content-container people">\n' +
    '    <article class="content-container-scrollable people">\n' +
    '        <div class="content">\n' +
    '            <section class="people-search-module" >\n' +
    '                <div class="preview-search-bar-container preview-animating-bg"></div>\n' +
    '            </section>\n' +
    '\n' +
    '            <!-- people team section -- peers -->\n' +
    '            <div class="people-team-section people-peer-panel">\n' +
    '                <h2 class="section-headline-style2 people-team-header">\n' +
    '                    <p class="preview-people-team-header preview-animating-bg"></p>\n' +
    '                </h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <div class="grid-item people-team-item" ng-repeat="peer in [1,2,3,4,5,6,7,8]">\n' +
    '                        <div class="preview-people-avatar preview-animating-bg"></div>\n' +
    '                        <p class="preview-user-item-name preview-animating-bg"></p>\n' +
    '                        <p class="preview-user-item-title preview-animating-bg"></p>\n' +
    '                    </div>\n' +
    '                    <div ng-repeat="item in [1,2,3,4,5,6]" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="people-team-section people-manager-panel">\n' +
    '                <h2 class="section-headline-style2 people-team-header">\n' +
    '                    <p class="preview-people-team-header preview-animating-bg"></p>\n' +
    '                </h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <div class="grid-item people-team-item" ng-repeat="manager in [1]">\n' +
    '                        <div class="preview-people-avatar preview-animating-bg"></div>\n' +
    '                        <p class="preview-user-item-name preview-animating-bg"></p>\n' +
    '                        <p class="preview-user-item-title preview-animating-bg"></p>\n' +
    '                    </div>\n' +
    '                    <div ng-repeat="item in [1,2,3,4,5,6]" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleDesktop.html',
    '<header class="breadcrumb-container">\n' +
    '    <breadcrumb></breadcrumb>\n' +
    '</header>\n' +
    '<div ng-if="peopleCtrl.isLoading" class="loading-people-container">\n' +
    '    <div ng-include="\'app-v2/components/people/peopleDesktopPreview.html\'"></div>\n' +
    '</div>\n' +
    '<section class="content-container people" ng-if="!peopleCtrl.isLoading">\n' +
    '    <article class="content-container-scrollable people">\n' +
    '        <div class="content">\n' +
    '            <!-- people team section -- peers -->\n' +
    '            <div class="people-team-section people-peer-panel" ng-if="peopleCtrl.peers.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.mypeers\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="peer" category="\'team\'" class="grid-item people-team-item" ng-repeat="peer in peopleCtrl.peers track by $index+peer.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- people team section -- direct reports -->\n' +
    '            <div class="people-team-section people-directreport-panel" ng-if="peopleCtrl.directReports.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.directreports\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="directReport" category="\'team\'" class="grid-item people-team-item"\n' +
    '                                 ng-repeat="directReport in peopleCtrl.directReports track by $index+directReport.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- people team section -- manager -->\n' +
    '            <div class="people-team-section people-manager-panel" ng-if="peopleCtrl.managers.length">\n' +
    '                <h2 class="section-headline-style2 people-team-header">{{::\'hub.people.labels.manager\'  | i18n }}</h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <people-item user="manager" category="\'team\'" class="grid-item people-team-item"\n' +
    '                                 ng-repeat="manager in peopleCtrl.managers track by $index+manager.id"></people-item>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </article>\n' +
    '</section>\n' +
    '\n' +
    '<!-- people detail page -->\n' +
    '<div ui-view></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleDesktopPreview.html',
    '<section class="preview-content-container people">\n' +
    '        <div class="content">\n' +
    '            <!-- people team section -- peers -->\n' +
    '            <div class="people-team-section people-peer-panel">\n' +
    '                <h2 class="section-headline-style2 people-team-header">\n' +
    '                    <p class="preview-people-team-header preview-animating-bg"></p>\n' +
    '                </h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <div class="grid-item people-team-item" ng-repeat="peer in [1,2,3,4,5,6,7,8]">\n' +
    '                        <div class="preview-people-avatar preview-animating-bg"></div>\n' +
    '                        <p class="preview-user-item-name preview-animating-bg"></p>\n' +
    '                        <p class="preview-user-item-title preview-animating-bg"></p>\n' +
    '                    </div>\n' +
    '                    <div ng-repeat="item in [1,2,3,4,5,6]" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="people-team-section people-manager-panel">\n' +
    '                <h2 class="section-headline-style2 people-team-header">\n' +
    '                    <p class="preview-people-team-header preview-animating-bg"></p>\n' +
    '                </h2>\n' +
    '                <div class="grid-container">\n' +
    '                    <div class="grid-item people-team-item" ng-repeat="manager in [1]">\n' +
    '                        <div class="preview-people-avatar preview-animating-bg"></div>\n' +
    '                        <p class="preview-user-item-name preview-animating-bg"></p>\n' +
    '                        <p class="preview-user-item-title preview-animating-bg"></p>\n' +
    '                    </div>\n' +
    '                    <div ng-repeat="item in [1,2,3,4,5,6]" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleDetail.html',
    '<article class="details-people">\n' +
    '    <div ng-show="userDetailsCtrl.isLoading" class="loading-people-details-container">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '    <header class="masthead-mobile">\n' +
    '        <div ng-click="::userDetailsCtrl.backBtnAction()" class="people-detail-back-button">\n' +
    '            <detail-close-button></detail-close-button>\n' +
    '        </div>\n' +
    '        <h2 class="user-detail-small-header">{{userDetailsCtrl.user.firstName + " " + userDetailsCtrl.user.lastName}}</h2>\n' +
    '        <div ng-click="::userDetailsCtrl.openSearch()" class="people-detail-search-button">\n' +
    '            <svg svg-symbol="icon-searchglass" class="icon-bell"></svg>\n' +
    '        </div>\n' +
    '    </header>\n' +
    '\n' +
    '    <section class="content-container">\n' +
    '        <div class="content-container-scrollable"  scroll-check currentview="details-people" elemclass=".details-people">\n' +
    '            <section class="user-detail-header">\n' +
    '                <div class="user-detail-header-avatar" image-load>\n' +
    '                    <span ng-if="userDetailsCtrl.user.initial" class="user-detail-initial">{{userDetailsCtrl.user.initial}}</span>\n' +
    '                    <img ng-show="userDetailsCtrl.user.imageURL" ng-src="{{userDetailsCtrl.user.imageURL}}" class="user-avatar-img-style"/>\n' +
    '                </div>\n' +
    '                <p class="user-detail-header-name">\n' +
    '                    {{userDetailsCtrl.user.firstName + " " + userDetailsCtrl.user.lastName}}\n' +
    '                </p>\n' +
    '                <p class="user-detail-header-employeenumber" ng-if="userDetailsCtrl.user.employeeNumber">\n' +
    '                    &#40; {{userDetailsCtrl.user.employeeNumber}} &#41;\n' +
    '                </p>\n' +
    '                <p class="user-detail-header-text user-detail-title">\n' +
    '                    {{userDetailsCtrl.user.title}}\n' +
    '                </p>\n' +
    '                <p class="user-detail-header-text user-detail-buiness-unit" ng-if="userDetailsCtrl.user.businessUnit">\n' +
    '                    {{userDetailsCtrl.user.businessUnit}}\n' +
    '                </p>\n' +
    '            </section><!--end of user-detail-page-header -->\n' +
    '\n' +
    '            <!-- tabs for the two sections -->\n' +
    '            <nav class="user-profile-tabs">\n' +
    '                <p ng-click="!userDetailsCtrl.isProfile && userDetailsCtrl.toggleProfileTab()" class="user-profile-tab profile"\n' +
    '                   ng-class="{\'selected\': userDetailsCtrl.isProfile, \'primary-link-color\':  userDetailsCtrl.isIOS}">\n' +
    '                    {{ ::\'app.people.labels.profile\' | i18n }}\n' +
    '                </p>\n' +
    '                <p ng-click="userDetailsCtrl.isProfile && userDetailsCtrl.toggleProfileTab()" class="user-profile-tab organization"\n' +
    '                   ng-class="{\'selected\': !userDetailsCtrl.isProfile, \'primary-link-color\':  userDetailsCtrl.isIOS}">\n' +
    '                    {{ ::\'hub.people.labels.organization\' | i18n }}\n' +
    '                </p>\n' +
    '            </nav>\n' +
    '\n' +
    '            <section class="user-detail-profile-section" ng-class="{\'tab-hidden\':!userDetailsCtrl.isProfile}">\n' +
    '                <div class="user-detail-profile-content">\n' +
    '                    <!-- email section : removed all the copy email logic as it is for desktop/browser -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.emailAddress" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.workEmail\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content">\n' +
    '                            {{::userDetailsCtrl.user.emailAddress}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="::userDetailsCtrl.nativeEmailClientSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openEmailButtonLabel" ng-click="userDetailsCtrl.openEmail(userDetailsCtrl.user.emailAddress)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-email" class="user-search-item-email-icon"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <!-- work phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.phoneNumber" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.workPhone\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content">\n' +
    '                            {{::userDetailsCtrl.user.phoneNumber}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.phoneNumber)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <!-- mobile phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.mobile" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.mobile\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content">\n' +
    '                            {{::userDetailsCtrl.user.mobile}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                             <span class="message-icon-spacing">\n' +
    '                                  <a role="button" aria-label="openSmsButtonLabel" ng-click="userDetailsCtrl.openSms(userDetailsCtrl.user.mobile)" stop-event="click">\n' +
    '                                       <svg svg-symbol="icon-sms" class="user-search-item-sms-icon branding-icon-primary"></svg>\n' +
    '                                  </a>\n' +
    '                             </span>\n' +
    '                            <span>\n' +
    '                                <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.mobile)" stop-event="click">\n' +
    '                                     <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                                </a>\n' +
    '                            </span>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <!-- alternative phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.alternatePhoneNumber" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.alternateNumber\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content">\n' +
    '                            {{::userDetailsCtrl.user.alternatePhoneNumber}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="::userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.alternatePhoneNumber)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <!-- address phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.address" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.address\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content no-ellipsis">\n' +
    '                            {{::userDetailsCtrl.user.address}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openMapsButtonLabel" ng-click="userDetailsCtrl.openMaps(userDetailsCtrl.user.address)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-maps" class="user-icon-maps branding-icon-primary"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- employee number-->\n' +
    '\n' +
    '                <div class="user-detail-profile-content" ng-if="userDetailsCtrl.user.employeeNumber || userDetailsCtrl.user.skills || userDetailsCtrl.user.businessUnit || userDetailsCtrl.user.costCenter || userDetailsCtrl.user.physicalDeliveryOfficeName">\n' +
    '                    <!-- email section : removed all the copy email logic as it is for desktop/browser -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.employeeNumber" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.employeeNumber\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content employee-number">\n' +
    '                            {{::userDetailsCtrl.user.employeeNumber}}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <!-- skills section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.skills" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.skills\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content employee-skills">\n' +
    '                            {{::userDetailsCtrl.user.skills}}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                    <!-- business unit section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.businessUnit" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.businessUnit\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content employee-business-unit">\n' +
    '                            {{::userDetailsCtrl.user.businessUnit}}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                    <!-- costCenter section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.costCenter" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.costCenter\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content employee-cost-center">\n' +
    '                            {{::userDetailsCtrl.user.costCenter}}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                    <!-- Office Location section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.physicalDeliveryOfficeName" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.physicalDeliveryOfficeName\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content employee-office-location">\n' +
    '                            {{::userDetailsCtrl.user.physicalDeliveryOfficeName}}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- section II social media info-->\n' +
    '                <div class="user-detail-profile-content"\n' +
    '                     ng-if="userDetailsCtrl.user.linkedInProfileUrl || userDetailsCtrl.user.slack || userDetailsCtrl.user.socialCast\n' +
    '                                        ||userDetailsCtrl.user.skypeForBusiness">\n' +
    '                    <!-- linkedIn phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.linkedInProfileUrl" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.linkedIn\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content long-links">\n' +
    '                            {{::userDetailsCtrl.user.linkedInProfileUrl}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openLinkedInButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.linkedInProfileUrl)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-linkedin" class="user-icon-social linked-in"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <!-- slack phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.slack" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.slack\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content long-links">\n' +
    '                            {{::userDetailsCtrl.user.slack}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openSlackButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.slack)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-slack" class="user-icon-social slack"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <!-- socialcast phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.socialCast" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.socialcast\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content long-links">\n' +
    '                            {{::userDetailsCtrl.user.socialCast}}\n' +
    '                        </p>\n' +
    '                        <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                            <a role="button" aria-label="openSocialcastButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.socialCast)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-socialcast" class="user-icon-social socialcast"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <!-- skype phone section -->\n' +
    '                    <div ng-if="userDetailsCtrl.user.skypeForBusiness" class="user-detail-profile-item">\n' +
    '                        <p class="user-detail-profile-item-label">\n' +
    '                            {{ ::\'app.people.labels.skypeForBusiness\' | i18n }}\n' +
    '                        </p>\n' +
    '                        <p class="user-detail-profile-item-content long-links">\n' +
    '                            {{::userDetailsCtrl.user.skypeForBusiness}}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="user-detail-org-section" ng-class="{\'tab-hidden\':userDetailsCtrl.isProfile}">\n' +
    '                <collapse-panel class="user-org-manager-section" currentview = "HUB_CP" headerlabel="{{userDetailsCtrl.getManagerLabel()}}"\n' +
    '                                ng-if="userDetailsCtrl.managers.length > 2" ng-class="{\'collapsed\': collapsed, \'no-direct-reports\': userDetailsCtrl.directReports.length==0}" collapsed="userDetailsCtrl.managerToggle">\n' +
    '                    <people-item user="manager" category="\'org\'" class="people-org-item" ng-class="{\'current-user\': manager.id === userDetailsCtrl.user.id, \'no-direct-reports\': userDetailsCtrl.directReports.length==0}"\n' +
    '                         ng-repeat="manager in userDetailsCtrl.managers | orderBy:\'$index\':true track by $index+manager.id">\n' +
    '                    </people-item>\n' +
    '                </collapse-panel>\n' +
    '                <div class="current-user-section" ng-if="userDetailsCtrl.managerToggle">\n' +
    '                     <people-item user="manager" category="\'org\'" class="people-org-item" ng-class="{\'current-user\': manager.id === userDetailsCtrl.user.id, \'no-direct-reports\': userDetailsCtrl.directReports.length==0, \'no-managers-section\': userDetailsCtrl.managers.length <= 2}"\n' +
    '                         ng-repeat="manager in userDetailsCtrl.managers | limitTo : 2 | orderBy:\'$index\':true track by $index+manager.id"></people-item>\n' +
    '                </div>\n' +
    '                <collapse-panel class="user-org-reportee-section" currentview = "HUB_CP" ng-if="userDetailsCtrl.directReports.length"\n' +
    '                                headerlabel="{{userDetailsCtrl.directReports.length}} {{ ::\'app.people.labels.directReports\' | i18n }}" collapsible = "false">\n' +
    '                    <people-item user="reportee" category="\'org\'" class="people-org-item"\n' +
    '                         ng-repeat="reportee in userDetailsCtrl.directReports track by $index+reportee.id">\n' +
    '                    </people-item>\n' +
    '                </collapse-panel>\n' +
    '            </section>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</article>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleDetailBrowser.html',
    '<section class="content-container details-people">\n' +
    '    <div ng-if="userDetailsCtrl.isLoading" class="loading-people-details-container">\n' +
    '        <div ng-include="\'app-v2/components/people/peopleDetailBrowserPreview.html\'"></div>\n' +
    '    </div>\n' +
    '    <div class="page-breadcrumb-bar" ng-if="!userDetailsCtrl.isAWJadeDesktop">\n' +
    '        <div class="content">\n' +
    '            <h2 class="page-breadcrumb-text"><a ui-sref="people" class="people-detail-people-link">{{::\'hub.nav.label.people\' | i18n}}</a> &#47; {{userDetailsCtrl.user.firstName + " " + userDetailsCtrl.user.lastName}}</h2>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <a ng-if="userDetailsCtrl.isAWJadeDesktop" ui-sref="people" class="people-detail-dismiss-button"><svg svg-symbol="icon-back"></svg> {{::\'hub.people.detail.back\' | i18n}}</a>\n' +
    '    <div class="content-container-scrollable" currentview="details-people">\n' +
    '        <div class="content">\n' +
    '        <section class="user-detail-header">\n' +
    '            <div class="user-detail-header-avatar" image-load>\n' +
    '                <span ng-if="userDetailsCtrl.user.initial" class="user-detail-initial">{{::userDetailsCtrl.user.initial}}</span>\n' +
    '                <img ng-show="userDetailsCtrl.user.imageURL" ng-src="{{::userDetailsCtrl.user.imageURL}}" class="user-avatar-img-style"/>\n' +
    '            </div>\n' +
    '            <div class="people-details-header-content-mobile" ng-if="!userDetailsCtrl.isAWJadeDesktop">\n' +
    '                <p class="user-detail-header-name-style">\n' +
    '                    {{::userDetailsCtrl.user.firstName}} {{::userDetailsCtrl.user.lastName}}\n' +
    '                </p>\n' +
    '                <p class="user-detail-header-text user-detail-header-employeenumber" ng-if="userDetailsCtrl.user.employeeNumber">\n' +
    '                    &#40; {{::userDetailsCtrl.user.employeeNumber}} &#41;\n' +
    '                </p>\n' +
    '                <p class="user-detail-header-text user-detail-title">\n' +
    '                    {{::userDetailsCtrl.user.title}}\n' +
    '                </p>\n' +
    '                <p class="user-detail-header-text user-detail-buiness-unit" ng-if="userDetailsCtrl.user.businessUnit">\n' +
    '                    {{::userDetailsCtrl.user.businessUnit}}\n' +
    '                </p>\n' +
    '            </div>\n' +
    '            <div class="people-details-header-content">\n' +
    '                <p class="user-detail-header-name-style">\n' +
    '                    {{::userDetailsCtrl.user.firstName}} {{::userDetailsCtrl.user.lastName}}\n' +
    '                </p>\n' +
    '                <span class="user-detail-header-text user-detail-title">\n' +
    '                    {{::userDetailsCtrl.user.title}}\n' +
    '                </span>\n' +
    '                <span class="user-detail-header-text user-detail-buiness-unit" ng-if="userDetailsCtrl.user.businessUnit">\n' +
    '                &#47; {{::userDetailsCtrl.user.businessUnit}}\n' +
    '                </span>\n' +
    '                <span class="user-detail-header-text user-detail-header-employeenumber" ng-if="userDetailsCtrl.user.employeeNumber">\n' +
    '                &#47; {{::userDetailsCtrl.user.employeeNumber}}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '\n' +
    '        </section><!--end of user-detail-page-header -->\n' +
    '\n' +
    '        <!-- tabs for the two sections -->\n' +
    '        <nav class="user-profile-tabs">\n' +
    '            <p ng-click="!userDetailsCtrl.isProfile && userDetailsCtrl.toggleProfileTab()" class="user-profile-tab profile"\n' +
    '               ng-class="{\'selected\': userDetailsCtrl.isProfile}">\n' +
    '                <span>{{ ::\'app.people.labels.profile\' | i18n }}</span>\n' +
    '            </p>\n' +
    '            <p ng-click="userDetailsCtrl.isProfile && userDetailsCtrl.toggleProfileTab()" class="user-profile-tab organization"\n' +
    '               ng-class="{\'selected\': !userDetailsCtrl.isProfile}">\n' +
    '                <span>{{ ::\'hub.people.labels.organization\' | i18n }}</span>\n' +
    '            </p>\n' +
    '        </nav>\n' +
    '\n' +
    '        <section class="user-detail-profile-section" ng-class="{\'tab-hidden\':!userDetailsCtrl.isProfile}">\n' +
    '            <div class="user-detail-profile-content">\n' +
    '                <!-- email section : removed all the copy email logic as it is for desktop/browser -->\n' +
    '                <div ng-if="userDetailsCtrl.user.emailAddress" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.workEmail\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content user-email allow-user-select" ng-class="{\'copied-email-highlight\': userDetailsCtrl.user.isCopied}">\n' +
    '                        <span>{{::userDetailsCtrl.user.emailAddress}}</span>\n' +
    '                    </p>\n' +
    '                    <div ng-show="!userDetailsCtrl.user.isCopied" class="user-profile-action">\n' +
    '                        <div ng-if="::userDetailsCtrl.copyEmailSupported">\n' +
    '                            <a role="button" class="people-detail-copy-email-button" aria-label="copyEmailButtonLabel" ng-click="userDetailsCtrl.copyEmail(userDetailsCtrl.user)" title="{{\'app.tooltip.copyEmail\' | i18n}}" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-copy-email" class="user-search-item-copy-email-icon"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                        <div ng-if="::userDetailsCtrl.nativeEmailClientSupported">\n' +
    '                            <a role="button" aria-label="openEmailButtonLabel" ng-click="userDetailsCtrl.openEmail(userDetailsCtrl.user.emailAddress)" stop-event="click">\n' +
    '                                <svg svg-symbol="icon-email" class="user-search-item-email-icon"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="user-profile-email-copied-notification" ng-show="userDetailsCtrl.user.isCopied">\n' +
    '                        <svg svg-symbol="icon-messaging-check" class="icon-check primary-icon-color"></svg>\n' +
    '                        <span class="user-search-email-copied">{{ ::\'app.peopleSearch.emailCopied\' | i18n }}</span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- work phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.phoneNumber" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.workPhone\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content allow-user-select">\n' +
    '                        {{::userDetailsCtrl.user.phoneNumber}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="::appCenterCtrl.isAWJadeMobile && userDetailsCtrl.linksSupported" class="user-profile-action work-phone">\n' +
    '                        <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.phoneNumber)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- mobile phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.mobile" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.mobile\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content allow-user-select">\n' +
    '                        {{::userDetailsCtrl.user.mobile}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="::appCenterCtrl.isAWJadeMobile && userDetailsCtrl.linksSupported" class="user-profile-action mobile-phone">\n' +
    '                         <span class="message-icon-spacing">\n' +
    '                              <a role="button" aria-label="openSmsButtonLabel" ng-click="userDetailsCtrl.openSms(userDetailsCtrl.user.mobile)" stop-event="click">\n' +
    '                                   <svg svg-symbol="icon-sms" class="user-search-item-sms-icon branding-icon-primary"></svg>\n' +
    '                              </a>\n' +
    '                         </span>\n' +
    '                        <span>\n' +
    '                            <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.mobile)" stop-event="click">\n' +
    '                                 <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                            </a>\n' +
    '                        </span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- alternative phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.alternatePhoneNumber" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.alternateNumber\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content allow-user-select">\n' +
    '                        {{::userDetailsCtrl.user.alternatePhoneNumber}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="::appCenterCtrl.isAWJadeMobile && userDetailsCtrl.linksSupported" class="user-profile-action alternative-phone">\n' +
    '                        <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.alternatePhoneNumber)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- address phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.address" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.address\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content no-ellipsis allow-user-select">\n' +
    '                        {{::userDetailsCtrl.user.address}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                        <a role="button" aria-label="openMapsButtonLabel" ng-click="userDetailsCtrl.openMaps(userDetailsCtrl.user.address)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-maps" class="user-icon-maps branding-icon-primary"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <!-- employee number-->\n' +
    '\n' +
    '            <div class="user-detail-profile-content" ng-if="userDetailsCtrl.user.employeeNumber || userDetailsCtrl.user.skills || userDetailsCtrl.user.businessUnit || userDetailsCtrl.user.costCenter || userDetailsCtrl.user.physicalDeliveryOfficeName">\n' +
    '                <!-- email section : removed all the copy email logic as it is for desktop/browser -->\n' +
    '                <div ng-if="userDetailsCtrl.user.employeeNumber" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.employeeNumber\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content employee-number">\n' +
    '                        {{::userDetailsCtrl.user.employeeNumber}}\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- skills section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.skills" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.skills\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content employee-skills">\n' +
    '                        {{::userDetailsCtrl.user.skills}}\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '                <!-- business unit section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.businessUnit" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.businessUnit\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content employee-business-unit">\n' +
    '                        {{::userDetailsCtrl.user.businessUnit}}\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '                <!-- costCenter section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.costCenter" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.costCenter\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content employee-cost-center">\n' +
    '                        {{::userDetailsCtrl.user.costCenter}}\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '                <!-- Office Location section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.physicalDeliveryOfficeName" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.physicalDeliveryOfficeName\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content employee-office-location">\n' +
    '                        {{::userDetailsCtrl.user.physicalDeliveryOfficeName}}\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- section II social media info-->\n' +
    '            <div class="user-detail-profile-content"\n' +
    '                 ng-if="userDetailsCtrl.user.linkedInProfileUrl || userDetailsCtrl.user.slack || userDetailsCtrl.user.socialCast\n' +
    '                                    ||userDetailsCtrl.user.skypeForBusiness">\n' +
    '                <!-- linkedIn phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.linkedInProfileUrl" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.linkedIn\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content long-links">\n' +
    '                        {{::userDetailsCtrl.user.linkedInProfileUrl}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                        <a role="button" aria-label="openLinkedInButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.linkedInProfileUrl)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-linkedin" class="user-icon-social linked-in"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- slack phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.slack" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.slack\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content long-links">\n' +
    '                        {{::userDetailsCtrl.user.slack}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                        <a role="button" aria-label="openSlackButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.slack)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-slack" class="user-icon-social slack"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- socialcast phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.socialCast" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.socialcast\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content long-links">\n' +
    '                        {{::userDetailsCtrl.user.socialCast}}\n' +
    '                    </p>\n' +
    '                    <div ng-if="userDetailsCtrl.linksSupported" class="user-profile-action">\n' +
    '                        <a role="button" aria-label="openSocialcastButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.socialCast)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-socialcast" class="user-icon-social socialcast"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <!-- skype phone section -->\n' +
    '                <div ng-if="userDetailsCtrl.user.skypeForBusiness" class="user-detail-profile-item">\n' +
    '                    <p class="user-detail-profile-item-label">\n' +
    '                        {{ ::\'app.people.labels.skypeForBusiness\' | i18n }}\n' +
    '                    </p>\n' +
    '                    <p class="user-detail-profile-item-content long-links">\n' +
    '                        {{::userDetailsCtrl.user.skypeForBusiness}}\n' +
    '                    </p>\n' +
    '                    <div class="user-profile-action" ng-if="userDetailsCtrl.linksSupported && userDetailsCtrl.isBrowser">\n' +
    '                        <a role="button" aria-label="openSkypeForBusinessButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.skypeForBusiness)" stop-event="click">\n' +
    '                            <svg svg-symbol="icon-skype" class="user-icon-social icon-skype"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="user-detail-org-section" ng-class="{\'tab-hidden\':userDetailsCtrl.isProfile}">\n' +
    '            <collapse-panel class="user-org-manager-section" currentview = "HUB_CP" headerlabel="{{userDetailsCtrl.getManagerLabel()}}"\n' +
    '                            ng-if="userDetailsCtrl.managers.length > 2" ng-class="{\'collapsed\': collapsed, \'no-direct-reports\': userDetailsCtrl.directReports.length==0}" collapsed="userDetailsCtrl.managerToggle">\n' +
    '                <people-item user="manager" category="\'org\'" class="people-org-item" ng-class="{\'current-user\': manager.id === userDetailsCtrl.user.id, \'no-direct-reports\': userDetailsCtrl.directReports.length==0}"\n' +
    '                     ng-repeat="manager in userDetailsCtrl.managers | orderBy:\'$index\':true track by $index+manager.id">\n' +
    '                </people-item>\n' +
    '            </collapse-panel>\n' +
    '            <div class="current-user-section" ng-if="userDetailsCtrl.managerToggle">\n' +
    '                 <people-item user="manager" category="\'org\'" class="people-org-item" ng-class="{\'current-user\': manager.id === userDetailsCtrl.user.id, \'no-direct-reports\': userDetailsCtrl.directReports.length==0, \'no-managers-section\': userDetailsCtrl.managers.length <= 2}"\n' +
    '                     ng-repeat="manager in userDetailsCtrl.managers | limitTo : 2 | orderBy:\'$index\':true track by $index+manager.id"></people-item>\n' +
    '            </div>\n' +
    '            <collapse-panel class="user-org-reportee-section" currentview = "HUB_CP" ng-if="userDetailsCtrl.directReports.length"\n' +
    '                            headerlabel="{{userDetailsCtrl.directReports.length}} {{ ::\'app.people.labels.directReports\' | i18n }}" collapsible = "false">\n' +
    '                <people-item user="reportee" category="\'org\'" class="people-org-item"\n' +
    '                     ng-repeat="reportee in userDetailsCtrl.directReports track by $index+reportee.id">\n' +
    '                </people-item>\n' +
    '            </collapse-panel>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleDetailBrowserPreview.html',
    '<section class="content-container details-people">\n' +
    '    <div class="page-breadcrumb-bar" ng-if="!userDetailsCtrl.isAWJadeDesktop">\n' +
    '        <div class="content">\n' +
    '            <h2 class="page-breadcrumb-text"></h2>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="content-container-scrollable" currentview="details-people">\n' +
    '        <div class="content">\n' +
    '        <section class="user-detail-header">\n' +
    '            <div class="preview-user-detail-header-avatar preview-animating-bg">\n' +
    '            </div>\n' +
    '            <div class="people-details-header-content-mobile" ng-if="!userDetailsCtrl.isAWJadeDesktop">\n' +
    '                <p class="preview-user-detail-header-text preview-animating-bg"></p>\n' +
    '                <p class="preview-user-detail-header-text preview-animating-bg"></p>\n' +
    '            </div>\n' +
    '            <div class="people-details-header-content">\n' +
    '                <p class="preview-user-detail-header-name-style preview-animating-bg"></p>\n' +
    '                <p class="preview-user-detail-description preview-animating-bg"></p>\n' +
    '            </div>\n' +
    '\n' +
    '        </section><!--end of user-detail-page-header -->\n' +
    '\n' +
    '        <!-- tabs for the two sections -->\n' +
    '        <nav class="user-profile-tabs">\n' +
    '            <div class="user-profile-tab profile"><p class="preview-profile preview-animating-bg"></p></div>\n' +
    '            <div class="user-profile-tab organization"><p class="preview-organization preview-animating-bg"></p></div>\n' +
    '        </nav>\n' +
    '\n' +
    '        <section class="user-detail-profile-section">\n' +
    '            <div class="user-detail-profile-content">\n' +
    '                <!-- email section : removed all the copy email logic as it is for desktop/browser -->\n' +
    '                <div class="user-detail-profile-item" ng-repeat="item in [1,2,3,4,5,6,7,8,9]">\n' +
    '                    <p class="preview-user-detail-profile-item-label preview-animating-bg"></p>\n' +
    '                    <p class="preview-user-detail-profile-item-content preview-animating-bg"></p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '\n' +
    '        <section class="user-detail-org-section">\n' +
    '            <div class="preview-user-org-item" ng-repeat="reportee in [1,2,3,4,5]">\n' +
    '                <div class="preview-user-org-item-avatar preview-animating-bg"></div>\n' +
    '                <p class="preview-user-org-item-name preview-animating-bg"></p>\n' +
    '                <p class="preview-user-org-item-title preview-animating-bg"></p>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/people/peopleItem.html',
    '<div ng-click="peopleItemCtrl.userDetails(peopleItemCtrl.user)">\n' +
    '    <div class="user-{{peopleItemCtrl.category}}-item-avatar" image-load>\n' +
    '        <p class="user-{{peopleItemCtrl.category}}-item-initial"><span ng-if="peopleItemCtrl.user.initial">{{peopleItemCtrl.user.initial}}</span></p>\n' +
    '        <img ng-if="peopleItemCtrl.user.avatar" ng-src="{{peopleItemCtrl.user.avatar}}" class="user-avatar-img-style"/>\n' +
    '    </div>\n' +
    '    <p class="user-{{peopleItemCtrl.category}}-item-name">{{::peopleItemCtrl.user.userName}}</p>\n' +
    '    <p class="user-{{peopleItemCtrl.category}}-item-title">{{::peopleItemCtrl.user.title}}</p>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearch.html',
    '<div class="people-search" search-input search-controller="PeopleSearchController"\n' +
    '     template-url="app-v2/components/peopleSearch/searchInput.html" is-active="true">\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearchBrowser.html',
    '<div class="people-search-browser" search-input search-controller="PeopleSearchController"\n' +
    '     template-url="app-v2/components/peopleSearch/searchInputBrowser.html">\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearchDropDown.html',
    '<div class="search-results">\n' +
    '    <!-- loading spinner section-->\n' +
    '    <div ng-show="ctrl.isLoading" class="search-people-loading">\n' +
    '        <spinner-loading></spinner-loading>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- people search result items section-->\n' +
    '    <div class="search-people-recent-container" ng-if="!ctrl.reqChars && ctrl.recentVisitedUser.length && !ctrl.users.length">\n' +
    '        <h2 class="section-headline-style2 people-search-headerline">\n' +
    '            {{::\'app.people.labels.recent\' | i18n }}\n' +
    '        </h2>\n' +
    '        <p ng-repeat="recentUser in ctrl.recentVisitedUser track by $index+recentUser.id"\n' +
    '             ng-mousedown="ctrl.userDetails(recentUser)" class="search-people-recent-item"\n' +
    '             ng-include="\'app-v2/components/peopleSearch/peopleSearchRecentItem.html\'">\n' +
    '        </p>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- people search result items section-->\n' +
    '    <h2 class="section-headline-style2 people-search-headerline" ng-if="!ctrl.reqChars && ctrl.users.length > 0">{{ctrl.users.length}} {{::\'hub.people.search.result\' | i18n }}</h2>\n' +
    '    <div ng-repeat="user in ctrl.users track by $index+user.id"  ng-if="!ctrl.reqChars" class="search-people-item"\n' +
    '         ng-include="\'app-v2/components/peopleSearch/peopleSearchItem.html\'"\n' +
    '         ng-click="ctrl.userDetails(user)">\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- people empty result section-->\n' +
    '    <div class="search-people-empty-result" ng-if="ctrl.noResults">\n' +
    '        <h2 class="empty-page-heading">{{ ::\'hub.apps.search.no.result.header\' | i18n }}</h2>\n' +
    '        <p class="search-empty-message">{{ ::\'hub.apps.searchpeople.no.result.msg\' | i18n }}</p>\n' +
    '        <section class="search-module hub-no-apps" ng-include="\'app-v2/svgincludes-hub/hub-no-search-results.html\'"></section>\n' +
    '    </div>\n' +
    '    <div class="search-people-empty-result" ng-if="ctrl.reqChars && !vm.isLoading">\n' +
    '        <p>{{::\'appCenter.peopleSearch.atLeastThreeChars\' | i18n }}</p>\n' +
    '        <section class="search-module hub-no-apps" ng-include="\'app-v2/svgincludes-hub/hub-no-search-results.html\'"></section>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearchDropDownBrowser.html',
    '<div class="search-results-people">\n' +
    '    <!-- loading spinner section-->\n' +
    '    <div ng-if="ctrl.isLoading" class="search-people-loading">\n' +
    '        <div ng-include="\'app-v2/components/peopleSearch/peopleSearchDropDownBrowserPreview.html\'"></div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="search-results-content">\n' +
    '    <!-- people search recent items section-->\n' +
    '     <div class="search-people-recent-container" ng-if="!ctrl.reqChars && ctrl.recentVisitedUser.length && !ctrl.users.length">\n' +
    '        <h2 class="section-headline-style2 people-search-headerline">\n' +
    '            {{::\'app.people.labels.recent\' | i18n }}\n' +
    '        </h2>\n' +
    '        <p ng-repeat="recentUser in ctrl.recentVisitedUser track by $index+recentUser.id"\n' +
    '             ng-mousedown="ctrl.userDetails(recentUser)" class="search-people-recent-item"\n' +
    '             ng-include="\'app-v2/components/peopleSearch/peopleSearchRecentItem.html\'">\n' +
    '        </p>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- people search result items section-->\n' +
    '    <h2 class="section-headline-style2 people-search-headerline" ng-if="!ctrl.reqChars && ctrl.users.length > 0">{{ctrl.users.length}} {{::\'hub.people.search.result\' | i18n }}</h2>\n' +
    '    <div ng-repeat="user in ctrl.users track by $index+user.id"  ng-if="!ctrl.reqChars" class="search-people-item"\n' +
    '         ng-include="\'app-v2/components/peopleSearch/peopleSearchItem.html\'"\n' +
    '         ng-click="ctrl.userDetails(user)">\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- people empty result section-->\n' +
    '    <div class="search-people-empty-result" ng-if="ctrl.noResults">\n' +
    '        <h2 class="empty-page-heading">{{ ::\'hub.apps.search.no.result.header\' | i18n }}</h2>\n' +
    '        <p class="search-empty-message">{{ ::\'hub.apps.searchpeople.no.result.msg\' | i18n }}</p>\n' +
    '        <section class="hub-no-apps" ng-include="\'app-v2/svgincludes-hub/hub-no-search-results.html\'"></section>\n' +
    '    </div>\n' +
    '    <div class="search-people-empty-result" ng-if="ctrl.reqChars && !vm.isLoading">\n' +
    '        <p>{{::\'appCenter.peopleSearch.atLeastThreeChars\' | i18n }}</p>\n' +
    '        <section class="hub-no-apps" ng-include="\'app-v2/svgincludes-hub/hub-no-search-results.html\'"></section>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearchDropDownBrowserPreview.html',
    '<div class="search-results-people">\n' +
    '    <div class="search-results-content">\n' +
    '    <!-- people search recent items section-->\n' +
    '     <div class="search-people-recent-container">\n' +
    '        <h2 class="section-headline-style2 people-search-headerline">\n' +
    '            <p class="preview-people-search-headerline preview-animating-bg"></p>\n' +
    '        </h2>\n' +
    '         <div ng-repeat="user in [1,2,3,4,5,6,7,8]" class="search-people-item">\n' +
    '             <div class="preview-search-people-item-avatar preview-animating-bg"></div>\n' +
    '             <p class="preview-search-people-item-name preview-animating-bg"></p>\n' +
    '             <p class="preview-search-people-item-title preview-animating-bg"></p>\n' +
    '         </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearchItem.html',
    '<div class="search-people-item-avatar" image-load>\n' +
    '    <p ng-if="user.initial" class="search-people-avatar-initial"><span>{{user.initial}}</span></p>\n' +
    '    <img ng-if="user.avatar" ng-src="{{user.avatar}}" class="user-avatar-img-style"/>\n' +
    '</div>\n' +
    '<p class="search-people-item-name" ng-bind-html="user.userName | highlight:ctrl.query.name"></p>\n' +
    '<p class="search-people-item-title" ng-bind-html="user.title"></p>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/peopleSearchRecentItem.html',
    '<svg svg-symbol="icon-search-recent-android" class="icon-search-recent-android"></svg>\n' +
    '{{recentUser.userName}}\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/searchInput.html',
    '<div>\n' +
    '    <header class="masthead-mobile search">\n' +
    '        <div class="search-back-button-android" ng-click="ctrl.goBack()">\n' +
    '            <svg svg-symbol="icon-search-back-android" class="icon-search-back-android"></svg>\n' +
    '        </div>\n' +
    '        <div class="search-input-bar">\n' +
    '            <label>\n' +
    '                <svg svg-symbol="icon-searchglass" class="icon-input-searchglass"></svg>\n' +
    '            </label>\n' +
    '            <input type="text"\n' +
    '                   ng-model="ctrl.query.name"\n' +
    '                   ng-change="ctrl.onSearch()"\n' +
    '                   ng-model-options="{ debounce: 500 }"\n' +
    '                   placeholder="{{ ::\'appCenter.peopleSearch.placeholder\' | i18n }}"\n' +
    '                   class="search-inputfield"\n' +
    '                   autocorrect="off"\n' +
    '                   autocapitalize="off"/>\n' +
    '            <!--on mobile screen clear text and on desktop screen close search-->\n' +
    '            <button class="search-clear-button people-search-clear-text" ng-click="ctrl.clearText()" ng-show="ctrl.query.name && !ctrl.loading">\n' +
    '                <svg svg-symbol="icon-circle-x" class="search-clear-x-button"></svg>\n' +
    '                <svg svg-symbol="icon-circle-x-android" class="search-clear-x-button-android"></svg>\n' +
    '            </button>\n' +
    '        </div>\n' +
    '        <div class="mobile-search-cancel" ng-click="ctrl.goBack()">\n' +
    '            <span class="search-cancel">{{::\'button.cancel\'|i18n}}</span>\n' +
    '        </div>\n' +
    '    </header>\n' +
    '    <div ng-if="ctrl.loading">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'" class="small"></div>\n' +
    '    </div>\n' +
    '    <main class="content-container" scroll-input-blur>\n' +
    '        <article class="content-container-scrollable">\n' +
    '            <div class="content">\n' +
    '                <div search-dropdown template-url="app-v2/components/peopleSearch/peopleSearchDropDown.html"\n' +
    '                     search-item="\'.search-item-people.active\'"></div>\n' +
    '            </div>\n' +
    '        </article>\n' +
    '    </main>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/peopleSearch/searchInputBrowser.html',
    '<div>\n' +
    '     <div class="search-input-bar">\n' +
    '        <label>\n' +
    '            <svg svg-symbol="icon-searchglass" class="icon-input-searchglass"></svg>\n' +
    '        </label>\n' +
    '        <input type="text"\n' +
    '               ng-model="ctrl.query.name"\n' +
    '               ng-click="ctrl.onSearch()"\n' +
    '               ng-change="ctrl.onSearch()"\n' +
    '               ng-model-options="{ debounce: 500 }"\n' +
    '               placeholder="{{ ::\'appCenter.peopleSearch.placeholder\' | i18n }}"\n' +
    '               class="search-inputfield"\n' +
    '               autocorrect="off"\n' +
    '               autocapitalize="off"/>\n' +
    '            <!--on mobile screen clear text and on desktop screen close search-->\n' +
    '        <button class="search-clear-button people-search-clear-text" ng-click="ctrl.clearText()" ng-show="ctrl.query.name && !ctrl.loading">\n' +
    '            <svg svg-symbol="icon-circle-x" class="search-clear-x-button"></svg>\n' +
    '        </button>\n' +
    '    </div>\n' +
    '    <div class="search-results-scrim" id="pt-search-scrim" ng-show="ctrl.showScrim" search-results-close\n' +
    '         close="ctrl.closeOnBlur()" show-scrim="ctrl.showScrim"></div>\n' +
    '    <div search-dropdown scroll-input-blur template-url="app-v2/components/peopleSearch/peopleSearchDropDownBrowser.html"\n' +
    '             search-item="\'.search-item-people.active\'" ng-if="ctrl.showScrim"></div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/ribbon/ribbon.html',
    '<div dropdown-list class="settings-mobile-container">\n' +
    '    <div class="dropdown-toggle hamburger-menu">\n' +
    '        <span class="first-line"></span>\n' +
    '        <span class="second-line"></span>\n' +
    '        <span class="third-line"></span>\n' +
    '    </div>\n' +
    '    <div dropdown-panel-body class="settings-mobile-panel" id= "pt-ribbon-dropdown" ng-include="\'app-v2/components/ribbon/settingMobilePanel.html\'">\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="mobile-title-container" ng-class="{\'notification-mobile-browser-container\' : ribbonCtrl.showNotificationsFilters}">\n' +
    '    <!-- make sure this one is two way binding-->\n' +
    '   <h2><span class="notification-browser-title">{{ribbonCtrl.browserPageTitle }}</span><span ng-if="ribbonCtrl.showNotificationsFilters" class="ribbon-notification-count" notification-count></span></h2>\n' +
    '    <div class="notifications-filter-browser-mobile" ng-if="ribbonCtrl.showNotificationsFilters"  contextdialog="{uris:{\'contextdialogTemplate\':(true)}}" contextdialogTemplate="app-v2/components/notifications-v2/notificationsV2ContextDialog.html">\n' +
    '        <p class="browser-mobile-filter-text" ng-bind="ribbonCtrl.filter"></p>\n' +
    '        <svg svg-symbol="icon-notification-filter" class="notifications-overflow-menu"></svg>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="ribbon-nav-list">\n' +
    '    <!-- to do the following is just for layout transition, the ng-if depending on the tenant configuration will add later to avoid to write to many protractor tests at once -->\n' +
    '    <ul>\n' +
    '        <li id="ribbon-nav-logo" class="ribbon-nav-logo"></li>\n' +
    '        <li id="ribbon-nav-apps" ui-sref-active="selected-tab"><a ui-sref="apps">{{::\'hub.nav.label.apps\' | i18n }}</a></li>\n' +
    '        <li id="ribbon-nav-people" ng-if="ribbonCtrl.showPeopleTab" ui-sref-active="selected-tab"><a ui-sref="people">{{::\'hub.nav.label.people\' | i18n }}</a></li>\n' +
    '        <li id="ribbon-nav-notifications" ng-if="ribbonCtrl.showNotifications" ui-sref-active="selected-tab"><a ui-sref="notifications">{{::\'hub.nav.label.notification\' | i18n }}</a><span class="ribbon-notification-count" notification-count></span></li>\n' +
    '    </ul>\n' +
    '\n' +
    '    <section dropdown-list class="ribbon-profile-container" ng-class="{\'settings-active\': ribbonCtrl.isSettingsLoaded}">\n' +
    '        <div class="dropdown-toggle ribbon-dropdown-toggle">\n' +
    '            <div class="ribbon-avatar">\n' +
    '                <p class="ribbon-avatar-initial" ng-if="ribbonCtrl.userInfo.initials"><span>{{::ribbonCtrl.userInfo.initials}}</span></p>\n' +
    '                <img ng-if="ribbonCtrl.userInfo.imageURL" ng-src="{{::ribbonCtrl.userInfo.imageURL}}" class="masthead-avatar-image"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div dropdown-panel-body class="ribbon-profile-dropdown-container" id= "pt-profile-dropdown" ng-include="\'app-v2/components/ribbon/ribbonDropdown.html\'">\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/ribbon/ribbonDropdown.html',
    '<ul class="ribbon-profile-list">\n' +
    '    <li ng-if="ribbonCtrl.userInfo.adminUser" ng-click="ribbonCtrl.adminConsole($event)">\n' +
    '        <a>{{\'hub.userInfo.adminConsole\' | i18n}}</a>\n' +
    '    </li>\n' +
    '    <li class="profile-settings-link" ng-click="ribbonCtrl.goToSettings($event)">\n' +
    '        <a>{{\'hub.userInfo.settings\' | i18n}}</a>\n' +
    '    </li>\n' +
    '    <li class="profile-signout-link" ng-click="ribbonCtrl.hubSignOut($event)">\n' +
    '        <a>{{\'hub.userInfo.signout\' | i18n}}</a>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/ribbon/settingMobilePanel.html',
    '<a class="mobile-panel-scrim"></a>\n' +
    '<div class="settings-mobile-panel-content">\n' +
    '    <ul id="mobile-nav-list" class="mobile-nav-list">\n' +
    '        <li class="mobile-nav-apps" ui-sref-active="selected-tab"><a ui-sref="apps">{{::\'hub.nav.label.apps\' | i18n }}</a></li>\n' +
    '        <li class="mobile-nav-people" ng-if="ribbonCtrl.showPeopleTab" ui-sref-active="selected-tab"><a ui-sref="people">{{::\'hub.nav.label.people\' | i18n }}</a></li>\n' +
    '        <li class="mobile-nav-notification" ng-if="ribbonCtrl.showNotifications" ui-sref-active="selected-tab"><a ui-sref="notifications">{{::\'hub.nav.label.notification\' | i18n }}</a></li>\n' +
    '        <li class="mobile-nav-divider"></li>\n' +
    '        <li class="mobile-nav-account" ui-sref-active="selected-tab">\n' +
    '            <a ui-sref="settings">{{::\'hub.nav.label.account\' | i18n }}</a>\n' +
    '            <div class="mobile-nav-avatar">\n' +
    '                <p class="mobile-avatar-initial" ng-if="ribbonCtrl.userInfo.initials"><span>{{::ribbonCtrl.userInfo.initials}}</span></p>\n' +
    '                <img ng-if="ribbonCtrl.userInfo.imageURL" ng-src="{{ribbonCtrl.userInfo.imageURL}}"/>\n' +
    '            </div>\n' +
    '        </li>\n' +
    '        <li class="mobile-nav-signout"><a ng-click="ribbonCtrl.hubSignOut($event)">{{::\'hub.nav.label.signout\' | i18n }}</a></li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingList/settingList.html',
    '<li class="nav-subpage-link {{settingListCtrl.page.pageId}}">\n' +
    '    <a title="{{::settingListCtrl.settingsNavName}}" ui-sref="settingListCtrl.settingsNavName">{{::settingListCtrl.settingsNavName}}</a>\n' +
    '</li>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settings/settings.html',
    '<section class="content-container hub-browser-settings">\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="content settings-content">\n' +
    '            <!-- User profile -->\n' +
    '\n' +
    '            <div class="user-details-container">\n' +
    '                <div class="profile-avatar" image-load>\n' +
    '                    <p class="profile-detail-initial" ng-if="hubSettingsCtrl.user.initials"><span>{{::hubSettingsCtrl.user.initials}}</span></p>\n' +
    '                    <img ng-src="{{::hubSettingsCtrl.user.imageURL}}" ng-show="hubSettingsCtrl.user.imageURL" class="settings-user-avatar"/>\n' +
    '                </div>\n' +
    '                <div class="user-name-details">\n' +
    '                    <p class="user-name">{{::hubSettingsCtrl.user.firstName}}&nbsp;{{::hubSettingsCtrl.user.lastName}}</p>\n' +
    '                    <p class="user-details">\n' +
    '                        <span class="user-title" ng-if="hubSettingsCtrl.user.title">{{::hubSettingsCtrl.user.title}}</span>\n' +
    '                        <span class="user-bu" ng-if="hubSettingsCtrl.user.businessUnit">&#47; {{::hubSettingsCtrl.user.businessUnit}}</span>\n' +
    '                        <span class="user-emp-no" ng-if="hubSettingsCtrl.user.employeeNumber">&#47; {{::hubSettingsCtrl.user.employeeNumber}}</span>\n' +
    '                    </p>\n' +
    '                    <div class="user-change-password" ng-if="hubSettingsCtrl.isPasswordChangeEnabled">\n' +
    '                        <a class="about-sublink change-password-link primary-link-color" ng-click="hubSettingsCtrl.openChangePassword()">{{::\'userInfo.profile.passwordchange\' | i18n}} {{::\'userInfo.profile.password\' | i18n}}</a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- Download Hub -->\n' +
    '            <div class="hub-download-banner" ng-if="hubSettingsCtrl.downloadTitle">\n' +
    '                <div class="download-image">\n' +
    '                    <h2 class="section-headline-style2 download-title">{{::hubSettingsCtrl.downloadTitle}}</h2>\n' +
    '                    <p class="download-subtitle">{{::hubSettingsCtrl.downloadSubtitle}}</p>\n' +
    '                    <button class="app-button primary-btn download-button" ng-click="hubSettingsCtrl.downloadApp();"> {{::\'button.download\' | i18n }}</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- Preferences -->\n' +
    '            <preferences-hub-browser></preferences-hub-browser>\n' +
    '\n' +
    '            <!-- About -->\n' +
    '            <div class="about-content-container">\n' +
    '                <h2 class="section-headline-style2">{{\'hub.about.title\' | i18n }}</h2>\n' +
    '                <div class="about-content">\n' +
    '                    <p class="about-copyright">{{::\'app.about.copyright\' | i18n }}</p>\n' +
    '                </div>\n' +
    '                <div class="about-links primary-link-color">\n' +
    '                    <a target="_blank" ng-href="{{::\'app.about.patentsLink\' | i18n}}" class="about-sublink patent-button">\n' +
    '                        <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.patents\' | i18n }}\n' +
    '                    </a>\n' +
    '                    <a ng-if="workspaceOne.isOnPrem" target="_blank" ng-href="{{::\'app.about.licenseAgreementLink\' | i18n}}" class="about-sublink licence-button" >\n' +
    '                        <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.licenseAgreement\' | i18n }}\n' +
    '                    </a>\n' +
    '                    <a ng-if="!workspaceOne.isOnPrem" target="_blank" ng-href="{{::\'app.about.saasLicenseAgreementLink\' | i18n}}" class="about-sublink license-button" >\n' +
    '                        <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.licenseAgreement\' | i18n }}\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingSubpage/partials/about.html',
    '<section class="content-container settings-subpage">\n' +
    '    <div ng-include="\'app-v2/components/settingSubpage/settingsBreadcrumb.html\'"></div>\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="settings-content-wrapper">\n' +
    '            <p class="about-copyright">{{::\'app.about.copyright\' | i18n }}</p>\n' +
    '\n' +
    '            <a target="_blank" ng-href="{{::\'app.about.patentsLink\' | i18n}}" class="about-sublink patent-button">\n' +
    '                <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.patents\' | i18n }}\n' +
    '            </a>\n' +
    '\n' +
    '            <a ng-if="isOnPrem" target="_blank" ng-href="{{::\'app.about.licenseAgreementLink\' | i18n}}" class="about-sublink licence-button" >\n' +
    '                <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.licenseAgreement\' | i18n }}\n' +
    '            </a>\n' +
    '\n' +
    '            <a ng-if="!isOnPrem" target="_blank" ng-href="{{::\'app.about.saasLicenseAgreementLink\' | i18n}}" class="about-sublink license-button" >\n' +
    '                <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.licenseAgreement\' | i18n }}\n' +
    '            </a>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingSubpage/partials/account.html',
    '<section class="content-container settings-subpage">\n' +
    '    <div ng-include="\'app-v2/components/settingSubpage/settingsBreadcrumb.html\'"></div>\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="settings-content-wrapper">\n' +
    '            <div class="settings-profile-container">\n' +
    '\n' +
    '                <div class="settings-profile-avatar-container profile-avatar" image-load>\n' +
    '                    <img ng-src="{{::settingSubpageCtrl.user.imageURL}}" ng-show="settingSubpageCtrl.user.imageURL" class="settings-user-avatar"/>\n' +
    '                </div>\n' +
    '                <p class="account-item account-name">\n' +
    '                    <span class="account-label">{{::\'userInfo.profile.name\' | i18n}} </span>\n' +
    '                    <span class="account-content">{{::settingSubpageCtrl.user.firstName}} {{::hubSettingsCtrl.user.lastName}}</span>\n' +
    '                </p>\n' +
    '                <p class="account-item account-username">\n' +
    '                    <span class="account-label">{{::\'userInfo.profile.username\' | i18n}} </span>\n' +
    '                    <span class="account-content">{{::settingSubpageCtrl.user.userName}}</span>\n' +
    '                </p>\n' +
    '                <p class="account-item account-email">\n' +
    '                    <span class="account-label">{{::\'userInfo.profile.email\' | i18n}} </span>\n' +
    '                    <span class="account-content">{{::settingSubpageCtrl.user.emailAddress}}</span>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '            <div class="settings-password-container" ng-if="settingSubpageCtrl.user.changePasswordAllowed">\n' +
    '                <h2>{{::\'userInfo.profile.password\' | i18n}}\n' +
    '                    <span class="password-change" ng-click="::settingSubpageCtrl.openPasswordDialog()">{{::\'userInfo.profile.passwordchange\' | i18n}}</span>\n' +
    '                </h2>\n' +
    '                <p>{{::\'userInfo.profile.passwordprompt\' | i18n}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingSubpage/partials/devices.html',
    '<section class="content-container settings-subpage">\n' +
    '    <div ng-include="\'app-v2/components/settingSubpage/settingsBreadcrumb.html\'"></div>\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="settings-content-wrapper">\n' +
    '            Devices content goes here\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingSubpage/partials/preferences.html',
    '<h2 class="section-headline-style2">{{\'hub.preferences.title\' | i18n }}</h2>\n' +
    '<div class="preferences-container" ng-controller="PreferencesController as preferencesCtrl">\n' +
    '    <div class="preference-title-left-container">\n' +
    '        <p class="preference-instruction">{{::\'hub.preferences.horizon.subtitle\' | i18n }}</p>\n' +
    '    </div>\n' +
    '    <div class="preference-selection-container">\n' +
    '        <p>{{::\'hub.preferences.launch.question\' | i18n}}</p>\n' +
    '        <fieldset class="preference-options-container" ng-init="preferencesCtrl.preferredClientTemp = preferencesCtrl.preferredClient">\n' +
    '            <label>\n' +
    '                <input type="radio" value="NATIVE" id="native" class="preference-option-radio-input"\n' +
    '                       ng-model="preferencesCtrl.preferredClientTemp"\n' +
    '                       ng-class="{\'native-selected\' : preferencesCtrl.preferredClientTemp === \'NATIVE\'}"/>\n' +
    '                <div class="preference-option-container">\n' +
    '                    <svg class="preference-option-icon horizon" svg-symbol="icon-horizonclient-green" ></svg>\n' +
    '                    <svg class="preference-checked primary-icon-color" svg-symbol="icon-preference-checkmark"></svg>\n' +
    '                    <p class="preference-option-text">{{::\'myapps.launch.view.preferredClient.horizonView\' | i18n }}</p>\n' +
    '                    <a class="primary-link-color" target="_blank" ng-show = "preferencesCtrl.preferredClientTemp === \'NATIVE\'" ng-href="{{preferencesCtrl.installLink }}">{{::\'appCenter.action.install\' | i18n }}</a>\n' +
    '                </div>\n' +
    '            </label>\n' +
    '            <label>\n' +
    '                <input type="radio" value="BROWSER" id="browser" class="preference-option-radio-input"\n' +
    '                       ng-model="preferencesCtrl.preferredClientTemp"\n' +
    '                       ng-class="{\'browser-selected\' : preferencesCtrl.preferredClientTemp === \'BROWSER\'}"/>\n' +
    '                <div class="preference-option-container">\n' +
    '                    <svg class="preference-option-icon browser" svg-symbol="icon-browser"></svg>\n' +
    '                    <svg class="preference-checked primary-icon-color" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                    <p class="preference-option-text">{{::\'myapps.launch.view.preferredClient.browser\' | i18n }}</p>\n' +
    '                </div>\n' +
    '            </label>\n' +
    '        </fieldset>\n' +
    '    </div>\n' +
    '    <notification-preference class="preference-notifications" ng-if="preferencesCtrl.notificationPreference"></notification-preference>\n' +
    '    <div class="preference-actions">\n' +
    '        <a class="app-button primary-btn preferences-update-button" ng-click="preferencesCtrl.saveLaunchDesktopPreference();"> {{::\'button.update\' | i18n }}</a>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingSubpage/partials/whatsnew.html',
    '<section class="content-container settings-subpage">\n' +
    '    <div ng-include="\'app-v2/components/settingSubpage/settingsBreadcrumb.html\'"></div>\n' +
    '    <div class="content-container-scrollable">\n' +
    '        <div class="settings-content-wrapper">\n' +
    '            What is new content goes here\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/settingSubpage/settingsBreadcrumb.html',
    '<div class="apps-navigation-bar">\n' +
    '    <div class="app-list-content">\n' +
    '        <h2 class="app-list-navigation-text"><a ng-click="settingSubpageCtrl.goToSettingsDefaultPage()" class="settings-default-link">{{::\'hub.nav.label.settings\' | i18n}}</a> &#47; {{::settingSubpageCtrl.breadcrumbName}}</h2>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/alertInstallingPrompt.html',
    '<div modal-new class="hub-modal-installing-popup hub-modal-container">\n' +
    '    <section class="dialog-container" stop-event="click">\n' +
    '        <section class="modal-body">\n' +
    '            <div class="dialog-body">\n' +
    '                <p class="hub-install-confirm-modal-title modal-content-text">{{ ::title }}</p>\n' +
    '                <h3 class="install-app-name no-ellipsis">{{ ::name }}</h3>\n' +
    '                <p class="modal-content-text">{{ ::message }}</p>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '        <footer class="dialog-actions one-action">\n' +
    '            <div class="button-action primary-action modal-button-primary" ng-click="$modal.close()">{{ ::\'ok\' | i18n }}</div>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/appInstallConfirmPrompt.html',
    '<div modal-new class="hub-modal-container hub-modal-install-confirmation">\n' +
    '    <section class="dialog-container" stop-event="click">\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="hub-install-confirm-modal-title modal-content-text">{{ ::title }}</p>\n' +
    '            <h3 class="install-app-name no-ellipsis">{{ ::name }}</h3>\n' +
    '            <p class="modal-content-text" ng-if="size"> {{ ::sizeMessage }}</p>\n' +
    '            <p class="modal-content-text" ng-if="price">{{ \'app.details.label.price\' + \':\' + price }}</p>\n' +
    '            <p class="modal-content-text">{{ ::installMessage }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <div class="button-action secondary-action modal-button-secondary" ng-click="modal.cancel()">{{ ::\'appCenter.cancel\' | i18n }}</div>\n' +
    '            <div class="button-action primary-action modal-button-primary" ng-click="modal.close(true)">{{ ::\'appCenter.install\' | i18n }}</div>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/clientAppDownloadDialog.html',
    '<div modal-new="modal-confirmation" class="hub-modal-container hub-launch-client-download-dialog">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-close-icon" ng-click="$modal.cancel(); $event.stopPropagation();"></svg>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="modal-app-list-item-icon" image-load>\n' +
    '                <img ng-src="{{app._links.icon.href}}">\n' +
    '            </div>\n' +
    '            <h3 class="modal-title" ng-bind-html="app.name"></h3>\n' +
    '            <p class="modal-content-text" ng-bind-html="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="$modal.cancel(); $event.stopPropagation();">{{ ::\'appCenter.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="$modal.close()"> {{ ::\'myapps.launch.title.launch\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/collapsePanelTemplate.html',
    '<div class="collapse-panel-container">\n' +
    '    <header class="collapse-panel-header" ng-class="{\'collapsed\': collapsed, \'non-collapsible\': !collapsible}" ng-click="toggleCollapsePanel()">\n' +
    '        <div class="icon-expand-collapse primary-border-color"></div>\n' +
    '        <h3>{{headerlabel}}</h3>\n' +
    '    </header>\n' +
    '    <section ng-transclude class="collapse-panel-content" ng-class="{\'collapsed\': collapsed, \'non-collapsible\': !collapsible}"></section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/detailCloseButtonAndroid.html',
    '<svg id="icon-detail-close-button-android" class="icon-detail-close-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n' +
    '    <polygon id="Shape" points="23 10.4 21.6 9 16 14.6 10.4 9 9 10.4 14.6 16 9 21.6 10.4 23 16 17.4 21.6 23 23 21.6 17.4 16 23 10.4" stroke="transparent"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/detailCloseButtonIOS.html',
    '<svg id="icon-detail-close-button-ios" class="icon-detail-close-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n' +
    '    <path d="M16,15.29l8.15-8.14a.49.49,0,1,1,.7.7L16.71,16l8.14,8.15a.49.49,0,0,1-.7.7L16,16.71,7.85,24.85a.49.49,0,0,1-.7-.7L15.29,16,7.15,7.85a.49.49,0,0,1,.7-.7Z" stroke="transparent"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/launchPasswordDialog.html',
    '<div modal-new="modal-confirmation" class="hub-launch-password-dialog hub-modal-container">\n' +
    '    <section class="dialog-container set-app-password" ng-controller="LaunchPasswordController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3 class="modal-title">{{:: \'app.launchPassword.heading\' | i18n}}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="modal-content-text">{{:: \'app.launchPassword.view.instruction\' | i18n:app.name}}</p>\n' +
    '            <p class="error-text">{{ctrl.errMsg}}</p>\n' +
    '            <input type="text" placeholder="{{ ::\'hub.placeholder.changepassword.username\' | i18n }}" ng-model="ctrl.userName" disabled>\n' +
    '            <input type="password"  placeholder="{{ ::\'hub.placeholder.changepassword.password\' | i18n }}" ng-keypress="ctrl.handleEnter($event)" ng-model="ctrl.pwd" required/>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="button-action secondary-action modal-button-secondary" ng-click="ctrl.handleCancel();">{{:: \'button.cancel\' | i18n }}</button>\n' +
    '            <button class="button-action primary-action modal-button-primary" ng-click="ctrl.getLaunchUrls();" tabindex="0" ng-disabled="!ctrl.pwd"> {{:: \'app.launchPassword.button.label.signin\' | i18n }} </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/pullToRefresh.html',
    '<div id="pull-to-refresh">\n' +
    '    <div class="action-icon">&#8595;</div>\n' +
    '    <div class="pull-spinner">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-transclude></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/setAppPassword.html',
    '<div modal-new="modal-confirmation" class="hub-modal-container hub-setapp-password-dialog">\n' +
    '    <section class="dialog-container" ng-controller="SetAppPasswordController as ctrl">\n' +
    '        <form name="appAuthForm">\n' +
    '            <header class="dialog-header">\n' +
    '                <h3 class="modal-title">{{:: \'app.setAppPassword.heading\' | i18n:ctrl.app.name}}</h3>\n' +
    '            </header>\n' +
    '            <div class="dialog-body">\n' +
    '                <p class="modal-content-text">{{:: "app.setAppPassword.instruction" | i18n}}</p>\n' +
    '                <p class="error-text" ng-show="appAuthForm.$error.unique">{{ "app.setAppPassword.error.passwordsNoMatch" | i18n}}</p>\n' +
    '                <input id="password1" type="password"\n' +
    '                   placeholder="{{ ::\'hub.placeholder.changepassword.password\' | i18n }}"\n' +
    '                   ng-minlength="3"\n' +
    '                   ng-model="ctrl.password1"\n' +
    '                   disable-copy-paste\n' +
    '                   required />\n' +
    '                <input id="password2" type="password"\n' +
    '                   placeholder="{{ ::\'hub.placeholder.changepassword.confirmpassword\' | i18n }}"\n' +
    '                   ng-minlength="3"\n' +
    '                   ng-model="ctrl.password2"\n' +
    '                   disable-copy-paste\n' +
    '                   required />\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions two-action">\n' +
    '                <button class="button-action secondary-action modal-button-secondary" ng-click="ctrl.handleCancel();">{{:: \'button.cancel\' | i18n }}</button>\n' +
    '                <button class="button-action save-button primary-action modal-button-primary" ng-click="ctrl.setAppPassword($event)" ng-disabled="appAuthForm.$invalid"> {{:: \'button.save\' | i18n }}</button>\n' +
    '            </footer>\n' +
    '        </form>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/spinnerAndroid.html',
    '<div class="loading-spinner-overlay" ng-if="spinnerCtrl.overlay == \'true\'"></div>\n' +
    '<svg class="loader-android" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n' +
    '    <circle cx="12" cy="12" r="10.25" fill="none" stroke="#797e7f" stroke-width="3"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/spinnerIOS.html',
    '<div class="loading-spinner-overlay" ng-if="spinnerCtrl.overlay == \'true\'"></div>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="loader-ios">\n' +
    '    <rect x="11.15" y="18" width="1.71" height="5.19" rx="0.85" ry="0.85"/>\n' +
    '    <rect x="15.48" y="16.83" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(-7.52 10.77) rotate(-30)"/>\n' +
    '    <rect x="18.57" y="13.63" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="matrix(0.5, -0.87, 0.87, 0.5, -4.34, 24.93)"/>\n' +
    '    <rect x="19.74" y="9.41" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(8.59 32.59) rotate(-90)"/>\n' +
    '    <rect x="18.57" y="5.1" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(22.47 28.36) rotate(-120)"/>\n' +
    '    <rect x="15.37" y="1.99" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(27.98 16.65) rotate(-150)"/>\n' +
    '    <rect x="11.15" y="0.81" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(24 6.81) rotate(180)"/>\n' +
    '    <rect x="6.91" y="1.98" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(16.78 4.66) rotate(150)"/>\n' +
    '    <rect x="3.72" y="5.18" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(13.6 7.7) rotate(120)"/>\n' +
    '    <rect x="2.56" y="9.41" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(15.41 8.59) rotate(90)"/>\n' +
    '    <rect x="3.68" y="13.63" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(16.31 4.19) rotate(60)"/>\n' +
    '    <rect x="6.91" y="16.83" width="1.71" height="5.19" rx="0.85" ry="0.85" transform="translate(10.75 -1.28) rotate(30)"/>\n' +
    '</svg>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/subpageBackButtonAndroid.html',
    '<svg id="icon-search-back-android" class="icon-subpage-back-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n' +
    '    <polygon points="24 15 11.83 15 17.42 9.41 16 8 8 16 16 24 17.41 22.59 11.83 17 24 17 24 15" stroke="transparent"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/subpageBackButtonIOS.html',
    '<svg id="icon-subpage-back-ios" class="icon-subpage-back-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n' +
    '    <polygon points="19.38 7 10 16 19.38 25 21.14 23.3 13.54 16 21.14 8.7 19.38 7" stroke="transparent"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/tunnelError.html',
    '<div modal-new class="modal-fullscreen mobile-slide-modal hub-tunnel-error-modal">\n' +
    '    <div class="dialog-header">\n' +
    '        <div class="tunnel-modal-close" ng-click="modal.cancel()">\n' +
    '            <svg svg-symbol="icon-close-android" class="icon-modal-fullscreen-close"></svg>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="dialog-body tunnel-modal-content">\n' +
    '        <h2 class="tunnel-app-header">{{ ::\'app.tunnel.installHelpText\' | i18n }}</h2>\n' +
    '        <p class="tunnel-app-text">\n' +
    '            <a id="tunnelApp" ng-click="catalogService.handleTunnelRedirect(tunnelUrl)">\n' +
    '                {{ ::\'app.tunnel.installStep1\' | i18n:tunnelAppName }} </a>\n' +
    '        </p>\n' +
    '        <p class="tunnel-app-text">\n' +
    '            <a id="dependentApp" ng-click="catalogService.installDependentApp(dependentApp)">\n' +
    '                {{ ::\'app.tunnel.installStep2\' | i18n:dependentApp.name }} </a>\n' +
    '        </p>\n' +
    '        <button class="tunnel-modal-button primary-btn" type="button" role="button" id="tunnel-error-footer" ng-click="modal.close(true)">\n' +
    '            {{ ::\'button.close\' | i18n }}\n' +
    '        </button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/components/shared/tunnelModal.html',
    '<div modal-new class="modal-fullscreen mobile-slide-modal hub-tunnel-modal">\n' +
    '    <div class="dialog-header">\n' +
    '        <div class="tunnel-modal-close" ng-click="modal.cancel()">\n' +
    '            <svg svg-symbol="icon-close-android" class="icon-modal-fullscreen-close"></svg>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="dialog-body tunnel-modal-content">\n' +
    '        <ng-include src="\'app-v2/svgincludes-hub/hub-tunnel-required.html\'" class="hub-tunnel-required"></ng-include>\n' +
    '        <h2 class="tunnel-app-header">{{ ::\'hub.tunnel.text.line1\' | i18n }} <span class="tunnel-app-header" id="pt-tunnel-app-name">{{::name}}</span></h2>\n' +
    '        <p class="tunnel-app-text">{{ ::\'hub.tunnel.text.line2\' | i18n }}</p>\n' +
    '        <button class="tunnel-modal-button primary-btn" type="button" role="button" id="tunnel-modal-footer" ng-click="modal.close(true)">\n' +
    '            {{ ::\'app.tunnel.continue\' | i18n }}\n' +
    '        </button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/details/details.html',
    '<article class="details content-container-scrollable">\n' +
    '    <div id="details-spinner-container" class="apps-loading spinner-foreground" style="display: none;">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '    <div class="content width-boundary" id="detail-content">\n' +
    '        <section class="content-body" ng-if="!detailsCtrl.isLoading">\n' +
    '            <div ng-hide= "appCenterCtrl.isAWJadeDesktop || appCenterCtrl.isAWJadeDocked" class="details-back-button" id="pt-details-content-backbutton" ng-click="::detailsCtrl.backBtnAction()">\n' +
    '                <svg svg-symbol="icon-detail-back" class="icon-setting-close-button"></svg>\n' +
    '                <span>{{\'app.settings.link.back\' | i18n}}</span>\n' +
    '            </div>\n' +
    '            <section class="detail-page-header">\n' +
    '                    <div class="detail-page-header-content">\n' +
    '                        <div class="detail-page-header-icon" ng-style="{\'background-image\':(\'url(\'+ detailsCtrl.iconStyle+\')\')}"></div>\n' +
    '                        <div class="detail-page-header-description">\n' +
    '                            <p class="detail-page-app-title">{{ ::detailsCtrl.name }}</p>\n' +
    '                            <ul class="detail-page-app-type">\n' +
    '                                <li>\n' +
    '                                    <svg ng-if="detailsCtrl.app.isHorizonResource || detailsCtrl.app.isHorizonAirResource" svg-symbol="icon-horizon-watermark"></svg>\n' +
    '                                    {{::detailsCtrl.app.appTypeDisplayVal}}\n' +
    '                                </li>\n' +
    '                            </ul>\n' +
    '                        </div>\n' +
    '                        <div class="details-header-message details-wsservice-required" ng-if="detailsCtrl.app.isWorkspaceServiceRequired">\n' +
    '                            <svg svg-symbol="icon-info-wsservice" class="icon-detail-ws-required" ></svg>\n' +
    '                            <p>{{ ::\'app.details.wsrequired.msg\' | i18n }}</p>\n' +
    '                        </div>\n' +
    '                        <div class="details-header-message details-vpn-required" ng-if="detailsCtrl.app.isTunnelRequired">\n' +
    '                            <svg svg-symbol="icon-tunnel" class="icon-detail-tunnel" ></svg>\n' +
    '                            <p>{{ ::\'app.tunnel.message\' | i18n }}</p>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="details-common-actions branding-icon-primary" catalog-item-actions app="detailsCtrl.app" stop-event="click" current-view="APP_DETAILS"></div>\n' +
    '            </section>\n' +
    '            <section ng-if="::detailsCtrl.showMissingInfoMsg" class="details-missing-info-msg">\n' +
    '                <div class="details-missing-info-msg-content">\n' +
    '                    <svg svg-symbol="icon-notify-info" class="details-missing-info-icon"></svg>\n' +
    '                    <span>\n' +
    '                        {{\'app.details.info.msg.missingInfo\' | i18n}}\n' +
    '                    </span>\n' +
    '                </div>\n' +
    '            </section>\n' +
    '            <section ng-if="::detailsCtrl.screenshots.length" class="detail-page-screenshots" id="screenshots" >\n' +
    '                <p class="detail-page-subtitle">{{::\'app.details.label.screenshots\' | i18n}}</p>\n' +
    '                <ul rn-carousel-control rn-carousel class="detail-page-screenshot-carousel" rn-carousel-index="carouselIndex">\n' +
    '                    <li class="detail-page-screenshot-container" ng-repeat="item in ::detailsCtrl.screenshots">\n' +
    '                        <img class="detail-page-screenshot" ng-src="{{item.href}}" ng-swipe-left="swiping=true" ng-swipe-right="swiping=true" ng-click="swiping ? ( swiping = false ) : detailsCtrl.openZoomedImageCarousel($index)">\n' +
    '                    </li>\n' +
    '\n' +
    '                </ul>\n' +
    '            </section>\n' +
    '\n' +
    '            <section class="detail-page-description" >\n' +
    '                <p ng-if="::detailsCtrl.descriptionHTML" class="detail-page-subtitle">{{::\'app.details.label.description\' | i18n}}</p>\n' +
    '                <div ng-if="::detailsCtrl.descriptionHTML" class="detail-page-description-text-container">\n' +
    '                    <div class="detail-page-description-text">\n' +
    '                        <div id="description" ng-bind-html="::detailsCtrl.descriptionHTML"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="detail-page-description-meta-data-container">\n' +
    '                    <ul class="detail-page-description-meta-data">\n' +
    '                        <li ng-if="::detailsCtrl.categories.length" class="detail-page-meta-data-item" >\n' +
    '                            <p class="meta-data-title">{{::\'app.details.label.category\' | i18n}}</p>\n' +
    '                            <!-- Class "clickable" can be applied to the ul to change style once flow from UX is confirmed-->\n' +
    '                            <ul class="meta-data-value">\n' +
    '                                    <li ng-repeat="cat in ::detailsCtrl.categories">{{cat}}{{$last ? \'\' : \', \'}} </li>\n' +
    '                            </ul>\n' +
    '                        </li>\n' +
    '                        <li ng-if="::detailsCtrl.version" class="detail-page-meta-data-item">\n' +
    '                            <p class="meta-data-title">{{::\'app.details.label.version\' | i18n}}</p>\n' +
    '                            <p class="meta-data-value ">{{::detailsCtrl.version}}</p>\n' +
    '                        </li>\n' +
    '                    </ul>\n' +
    '                </div> \n' +
    '            </section>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/details/passwordVaultAppCredentials.html',
    '<div modal-new="modal-confirmation">\n' +
    '    <section class="dialog-container set-app-password" ng-controller="PasswordVaultAppCredentialsController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <svg svg-symbol="icon-notify-info" class="icon-appinstall-confirm"/>\n' +
    '            <div class="item-caption-title">\n' +
    '                <h1>{{\'pvapp.setAppPassword.heading\' | i18n:ctrl.app.name}}</h1>\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <form name="appAuthForm">\n' +
    '            <div class="dialog-body">\n' +
    '                <div>\n' +
    '                    <p>{{ "pvapp.setAppPassword.instruction" | i18n}}</p>\n' +
    '                </div>\n' +
    '                <div class="error-text" ng-show="appAuthForm.$error.username">{{ "pvapp.setAppPassword.error.userNameEmpty" | i18n}}</div>\n' +
    '                <div class="error-text" ng-show="appAuthForm.$error.password">{{ "pvapp.setAppPassword.error.passwordEmpty" | i18n}}</div>\n' +
    '                <fieldset class="fieldset">\n' +
    '                    <div class="field-div" ng-if="ctrl.showUserName">\n' +
    '                        <p>{{:: \'pvapp.setAppPassword.label.username\' | i18n}}</p>\n' +
    '                        <input class="input-password-field input-large" id="username" type="text" ng-minlength="3" ng-model="ctrl.username">\n' +
    '                    </div>\n' +
    '                    <div class="field-div" ng-if="ctrl.showPassword">\n' +
    '                        <p>{{:: \'pvapp.setAppPassword.label.password\' | i18n}}</p>\n' +
    '                        <input class="input-password-field input-large" id="password" type="password" ng-model="ctrl.password">\n' +
    '                        <a class="detailLink" id="clearTextPassword" ng-click="ctrl.toggleShowClearTextPassword()">\n' +
    '                            <svg svg-symbol="icon-show-password-blue"></svg>\n' +
    '                        </a>\n' +
    '                        <a class="detailLink" id="copyPasswordToClipboard" ng-click="ctrl.copyPasswordToClipboard()">\n' +
    '                            <svg svg-symbol="icon-clipboard"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </fieldset>\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions two-action">\n' +
    '                <button class="button-action secondary-action" ng-click="$modal.close()">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button class="button-action save-button primary-action" ng-click="ctrl.setPVAppCredentials($event)"> {{\'button.save\' | i18n }}</button>\n' +
    '            </footer>\n' +
    '        </form>\n' +
    '    </section>\n' +
    '    <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/details/zoomedImageCarousel.html',
    '<div modal-new="modal-zommed-image-carousel" class="modal-details-screenshots-zoomed">    \n' +
    '    <section class="dialog-container modal-zommed-image-carousel">\n' +
    '            <div class="dialog-body">\n' +
    '                <ul rn-carousel rn-carousel-index="carouselIndex" class="zoomed-image-carousel-list">\n' +
    '                    <li ng-repeat="image in screenshots">\n' +
    '                        <img class="zoomed-image-carousel-item" ng-src="{{image.href }}" >\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '            <footer class="dialog-actions">\n' +
    '                <div rn-carousel-indicators ng-if="screenshots.length > 1" slides="screenshots" rn-carousel-index="carouselIndex"></div>\n' +
    '            </footer>\n' +
    '        </section>\n' +
    '\n' +
    '        <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/new-app-icon-item.html',
    '<div class="notification-new-app-icon-container">\n' +
    '    <img ng-src="{{ app.iconUrl }}" class="icon-additional-body-icons">\n' +
    '    <p tooltip tooltiptext="{{ app.appName }}" triggerelement="notification-new-app-icon-container"></p>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/newEntitlementsDesktopModal.html',
    '<div modal-new="modal-confirmation" class="modal-notification-new-apps">\n' +
    '    <section class="dialog-container" ng-controller="NewAppsNotificationController as ctrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h2>{{::\'app.notification.newApps.title\' | i18n}}</h2>\n' +
    '            <p class="new-apps-info"><span>{{::\'app.notification.newApps.subtitle\' | i18n}}</span></p>\n' +
    '            <svg svg-symbol="icon-close-popup" class="new-apps-modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="catalog">\n' +
    '                <div catalog-item ng-repeat="app in ctrl.newApps" class="grid-item new-app" appdata="app" modalobj="$modal"></div>\n' +
    '                <!--Empty fillers to make sure that the last row aligns properly-->\n' +
    '                <div ng-repeat="item in ctrl.emptyCatalogModalFillers" class="grid-item-empty"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <p class="thinapp-action-desc" line-clamp2 content="::ctrl.instruction" lines="2"></p>\n' +
    '            <div class="thinapps-buttons-container">\n' +
    '                <button class="setting-button primary-button bookmark-all-btn thinapp-bookmarkall-btn" ng-click="ctrl.bookmarkAll()">{{::\'app.thinappsInPackage.button.bookmarkAll\' | i18n}}</button>\n' +
    '            </div>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/newEntitlementsMobile.html',
    '<article id="catalog-container" class="catalog content-container-scrollable" infinite-scroll>\n' +
    '    <div class="content width-boundary">\n' +
    '        <section class="content-body-with-sidebar" scroll-container=".catalog.content-container-scrollable">\n' +
    '            <div class="grid-container new-apps-mobile-container">\n' +
    '                <div catalog-item ng-repeat="app in ctrl.newApps" class="grid-item new-app" appdata="app"></div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '        <div class="mobile-notifications-overflow-actions-container" ng-class="{\'active\': ctrl.showNewAppsNotificationsOverflowActions}">\n' +
    '            <div class="overflow-actions-overlay" ng-click="ctrl.hideNewAppsNotificationOverflowActions()">\n' +
    '            </div>\n' +
    '            <div class="overflow-actions-content">\n' +
    '                <svg svg-symbol="icon-close-popup" class="overflow-actions-close" ng-click="ctrl.hideNewAppsNotificationOverflowActions()"></svg>\n' +
    '                <p class="list-item bookmark-all-new-apps" ng-click="ctrl.bookmarkAll()">{{::\'app.thinappsInPackage.button.bookmarkAll\' | i18n}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</article>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/notificationCardDesktop.html',
    '<div class="notifications-card-container-desktop" ng-class="{ \'notification-disabled\' : !notificationCardCtrl.cardEnabled}">\n' +
    '    <svg ng-if="!notificationCardCtrl.notification.read_at" svg-symbol="icon-close-popup" class="notifications-close-button" ng-click="notificationCardCtrl.dismissNotification()"></svg>\n' +
    '    <div class="notifications-content">\n' +
    '        <div class="notifications-header-container">\n' +
    '            <svg ng-if="notificationCardCtrl.isNewAppNotification" svg-symbol="icon-notification-new-apps" class="icon-notifications-ws1 icon-new-app-notification"></svg>\n' +
    '            <div ng-if="notificationCardCtrl.image" class="icon-notifications-ws1 image-holder">\n' +
    '                <img class="icon-notification-image" ng-src="{{notificationCardCtrl.image}}"/>\n' +
    '            </div>\n' +
    '            <svg ng-if="!notificationCardCtrl.isNewAppNotification && !notificationCardCtrl.image" svg-symbol="icon-notification-default" class="icon-notifications-ws1 icon-default-notification"></svg>\n' +
    '            <h2 class="notifications-title">{{ notificationCardCtrl.title }}</h2>\n' +
    '        </div>\n' +
    '        <div class="notifications-body-container">\n' +
    '            <p class="notifications-body-text" ng-bind-html="notificationCardCtrl.message"></p>\n' +
    '            <div ng-if="notificationCardCtrl.additionalBodySection" class="notifications-additional-body-section">\n' +
    '                <div ng-repeat="app in notificationCardCtrl.newApps" ng-include="\'app-v2/notifications/new-app-icon-item.html\'" class="new-app-icon-container"></div>\n' +
    '                <p ng-if="notificationCardCtrl.excessIconsMessage" class="notification-extra-icon-text">{{ notificationCardCtrl.excessIconsMessage }}</p>\n' +
    '            </div>\n' +
    '            <div class="notifications-date">{{ notificationCardCtrl.date }}</div>\n' +
    '        </div>\n' +
    '        <div class="notifications-actions-container">\n' +
    '            <span ng-repeat="action in notificationCardCtrl.actions" ng-click="notificationCardCtrl.performAction(action)"\n' +
    '                  ng-style="notificationCardCtrl.desktopMaxButtonWidthStyle" ng-class="notificationCardCtrl.getLabelClass(action)" ng-bind="notificationCardCtrl.getLabel(action)"></span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/notificationCardMobile.html',
    '<div id="{{ notificationCardCtrl.id }}" ng-class="{ \'notification-disabled\' : !notificationCardCtrl.cardEnabled, \'notifications-card-container-mobile\' : !notificationCardCtrl.isHubEnabled, \'hub-notifications-card-container-mobile\' : notificationCardCtrl.isHubEnabled}">\n' +
    '    <svg ng-if="!notificationCardCtrl.notification.read_at" svg-symbol="icon-close-popup" class="notifications-close-button" ng-click="notificationCardCtrl.dismissNotification()"></svg>\n' +
    '    <div class="notifications-content">\n' +
    '        <div class="notifications-header-container">\n' +
    '            <svg ng-if="notificationCardCtrl.isNewAppNotification" svg-symbol="icon-notification-new-apps" class="icon-notifications-ws1 icon-new-app-notification"></svg>\n' +
    '            <div ng-if="notificationCardCtrl.image" class="icon-notifications-ws1 image-holder" image-load>\n' +
    '                <img class="icon-notification-image" ng-src="{{notificationCardCtrl.image}}"/>\n' +
    '            </div>\n' +
    '            <svg ng-if="!notificationCardCtrl.isNewAppNotification && !notificationCardCtrl.image" svg-symbol="icon-notification-default" class="icon-notifications-ws1 icon-default-notification"></svg>\n' +
    '            <h2 class="notifications-title">{{ notificationCardCtrl.title }}</h2>\n' +
    '        </div>\n' +
    '        <div class="notifications-body-container">\n' +
    '            <p class="notifications-body-text" ng-bind-html="notificationCardCtrl.message"></p>\n' +
    '            <div ng-if="notificationCardCtrl.additionalBodySection" class="notifications-additional-body-section">\n' +
    '                <div ng-repeat="app in notificationCardCtrl.newApps" class="notification-new-app-icon-container">\n' +
    '                    <img ng-src={{app.iconUrl}} class="icon-additional-body-icons">\n' +
    '                </div>\n' +
    '                <p ng-if="notificationCardCtrl.excessIconsMessage" class="notification-extra-icon-text">{{ notificationCardCtrl.excessIconsMessage }}</p>\n' +
    '            </div>\n' +
    '            <div class="notifications-date">{{ notificationCardCtrl.date }}</div>\n' +
    '        </div>\n' +
    '        <div class="notifications-actions-container">\n' +
    '            <span ng-repeat="action in notificationCardCtrl.actions" ng-click="notificationCardCtrl.performAction(action)"\n' +
    '                  ng-class="notificationCardCtrl.getLabelClass(action)" ng-bind="notificationCardCtrl.getLabel(action)"></span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/notificationDesktop.html',
    '<div class="desktop-notifications-container" ng-if="appCenterCtrl.isNotificationDropdownActive" ng-controller="NotificationController as notificationCtrl">\n' +
    '    <div class="notification-header">\n' +
    '        <svg ng-show="notificationCtrl.showArchived" class="close-archived" svg-symbol="icon-detail-back" ng-click="notificationCtrl.getNotifications()"></svg>\n' +
    '        <span ng-show="!notificationCtrl.showArchived">{{::\'myapps.mobilepagetitle.notification\' | i18n}}</span>\n' +
    '        <span ng-show="notificationCtrl.showArchived">{{::\'myapps.mobilepagetitle.archived\' | i18n}}</span>\n' +
    '        <svg ng-show="!notificationCtrl.showArchived" class="notifications-overflow-actions" svg-symbol="icon-dots" ng-click="notificationCtrl.toggleNotificationsOverflowContainer()"></svg>\n' +
    '    </div>\n' +
    '    <div ng-show="notificationCtrl.isLoading" class="apps-loading">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '    <div class="notifications-container desktop">\n' +
    '        <div class="notification-item" ng-repeat="notification in notificationCtrl.notifications track by notification.id">\n' +
    '            <div notification-card data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></div>\n' +
    '        </div>\n' +
    '        <div ng-if="!notificationCtrl.notifications.length && !notificationCtrl.isLoading" class="empty-notification">\n' +
    '            <svg class="icon-empty-notification" svg-symbol="icon-empty-notification"></svg>\n' +
    '            <p class="notification-description">\n' +
    '                {{::\'app.notification.empty\' | i18n}}\n' +
    '            </p>\n' +
    '            <p ng-if="notificationCtrl.hasArchivedNotifications">\n' +
    '                <button class="view-archived-button" ng-click="notificationCtrl.getNotifications(true)">{{::\'app.notification.see.archived\' | i18n}}</button>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="notifications-overflow-actions-container" ng-show="notificationCtrl.showNotificationsOverflowActions">\n' +
    '        <svg svg-symbol="icon-close-popup" class="notifications-overflow-close" ng-click="notificationCtrl.toggleNotificationsOverflowContainer()"></svg>\n' +
    '        <p class="overflow-action archive-all" ng-click="notificationCtrl.archiveAll()">{{::\'app.notification.archive.all\' | i18n}} </p>\n' +
    '        <p class="overflow-action" ng-click="notificationCtrl.getNotifications(true)">{{::\'app.notification.see.archived\' | i18n}}</p>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notifications/notificationMobile.html',
    '<div ng-show="notificationCtrl.isLoading" class="apps-loading">\n' +
    '    <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '</div>\n' +
    '<div class="notifications-container mobile">\n' +
    '    <div class="notification-item angular-animate" ng-repeat="notification in notificationCtrl.notifications track by notification.id">\n' +
    '        <div notification-card data="notification" on-archive="notificationCtrl.archiveNotification(notification.id)"></div>\n' +
    '    </div>\n' +
    '    <div ng-if="!notificationCtrl.notifications.length && !notificationCtrl.isLoading" class="empty-notification">\n' +
    '        <svg class="icon-empty-notification" svg-symbol="icon-empty-notification"></svg>\n' +
    '        <p class="notification-description">\n' +
    '            {{::\'app.notification.empty\' | i18n}}\n' +
    '        </p>\n' +
    '        <p ng-if="notificationCtrl.hasArchivedNotifications">\n' +
    '            <button class="view-archived-button" ng-click="notificationCtrl.goToArchived($event)">{{::\'app.notification.see.archived\' | i18n}}</button>\n' +
    '        </p>\n' +
    '    </div>\n' +
    '    <div class="mobile-notifications-overflow-actions-container" ng-class="{\'active\': notificationCtrl.showNotificationsOverflowActions}">\n' +
    '        <div class="overflow-actions-overlay" ng-click="notificationCtrl.hideNotificationOverflowActions()">\n' +
    '        </div>\n' +
    '        <div class="overflow-actions-content">\n' +
    '            <svg svg-symbol="icon-close-popup" class="overflow-actions-close" ng-click="notificationCtrl.hideNotificationOverflowActions()"></svg>\n' +
    '            <p class="list-item archive-all" ng-click="notificationCtrl.archiveAll()">{{::\'app.notification.archive.all\' | i18n}}</p>\n' +
    '            <p class="list-item" ng-click="notificationCtrl.goToArchived()">{{::\'app.notification.see.archived\' | i18n}}</p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notify/templates/defaultMessageTemplate.html',
    '<div class="notify-message-container" ng-class="message.type">\n' +
    '    <div class="message-body">\n' +
    '        <div class="message-icon" ng-if="message.type != \'progress\'">\n' +
    '            <svg svg-symbol="icon-notify-{{message.type}}"></svg>\n' +
    '        </div>\n' +
    '        <button ng-show="message.type === \'info\' || message.type === \'error\'" class="notify-close-button" ng-click="close($index)">\n' +
    '            <svg svg-symbol="icon-notify-close"></svg>\n' +
    '        </button>\n' +
    '        <p class="message-text">{{message.text}}</p>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notify/templates/defaultMessageTemplateHub.html',
    '<div class="notify-message-container" ng-class="message.type">\n' +
    '    <div class="message-body">\n' +
    '        <div class="message-text">{{message.text}}</div>\n' +
    '        <button ng-show="message.type === \'info\' || message.type === \'error\'" class="notify-close-button" ng-click="close($index)">\n' +
    '            <svg svg-symbol="icon-notify-close"></svg>\n' +
    '        </button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/notify/templates/messageContextTemplate.html',
    '<div class="notify-content">\n' +
    '    <ul class="notify-message-list">\n' +
    '        <li ng-repeat="message in _messagesArray_">\n' +
    '            <div notify-message="message">\n' +
    '            </div>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/people-recent-search-item.html',
    '<svg svg-symbol="icon-recents"></svg>\n' +
    '{{recentUser.userName}}\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/people-search-dropdown.html',
    '<div class="search-results">\n' +
    '    <div id="search-container">\n' +
    '        <div ng-show="ctrl.isLoading" class="people-searchresults-loading">\n' +
    '            <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '        </div>\n' +
    '        <div ng-repeat="user in ctrl.users track by $index+user.id"  ng-if="!ctrl.reqChars" class="people-search-item"\n' +
    '             ng-include="\'app-v2/people/people-search-item.html\'"\n' +
    '             ng-click="ctrl.userDetails(user)">\n' +
    '        </div>\n' +
    '        <div class="people-search-recent-container" ng-show="!ctrl.reqChars && ctrl.recentVisitedUser.length && !ctrl.users.length">\n' +
    '            <h3 class="people-recent-title">\n' +
    '                {{::\'app.people.labels.recent\' | i18n }}\n' +
    '            </h3>\n' +
    '            <div ng-repeat="recentUser in ctrl.recentVisitedUser track by $index+recentUser.id"\n' +
    '                 ng-mousedown="ctrl.userDetails(recentUser)" class="people-search-recent-item"\n' +
    '                 ng-include="\'app-v2/people/people-recent-search-item.html\'">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="people-search-empty-result" ng-if="ctrl.noResults">\n' +
    '            <ng-include src="\'app-v2/svgincludes/illo-people-search-no-result.html\'" class="illo-people-search-no-result"></ng-include>\n' +
    '            <p>{{ ::\'appCenter.peopleSearch.noResults\' | i18n }}</p>\n' +
    '            <p>{{ ::\'appCenter.peopleSearch.tryNewSearch\' | i18n }}</p>\n' +
    '        </div>\n' +
    '        <div class="people-search-empty-result" ng-if="ctrl.reqChars && !vm.isLoading">\n' +
    '            <ng-include src="\'app-v2/svgincludes/illo-people-search-no-result.html\'" class="illo-people-search-no-result"></ng-include>\n' +
    '            <p>{{::\'appCenter.peopleSearch.atLeastThreeChars\' | i18n }}</p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/people-search-input.html',
    '<div>\n' +
    '    <div id="people-search-input" class="search-input-bar">\n' +
    '        <label>\n' +
    '            <svg svg-symbol="icon-searchglass"></svg>\n' +
    '        </label>\n' +
    '        <input type="text"\n' +
    '            ng-model="ctrl.query.name"\n' +
    '            ng-click="ctrl.onSearch()"\n' +
    '            ng-change="ctrl.onSearch()"\n' +
    '            placeholder="{{ ::\'appCenter.peopleSearch.placeholder\' | i18n }}"\n' +
    '            class="search-inputfield"\n' +
    '            autocorrect="off"\n' +
    '            autocapitalize="off" />\n' +
    '        <!--on mobile screen clear text and on desktop screen close search-->\n' +
    '        <button class="search-clear-button people-search-clear-text" ng-click="ctrl.clearText()" ng-show="ctrl.query.name && !ctrl.loading">\n' +
    '            <svg svg-symbol="icon-circle-x"></svg>\n' +
    '        </button>\n' +
    '        <button class="search-clear-button people-search-clear-search" ng-click="ctrl.clearSearch()" ng-show="ctrl.query.name && !ctrl.loading">\n' +
    '            <svg svg-symbol="icon-circle-x"></svg>\n' +
    '        </button>\n' +
    '    </div>\n' +
    '    <div class="search-result-scrim" id="people-pt-search-scrim" ng-show="ctrl.showScrim" search-results-close close="ctrl.closeOnBlur()" show-scrim="ctrl.showScrim"></div>\n' +
    '    <div search-dropdown template-url="app-v2/people/people-search-dropdown.html" ng-show="ctrl.showScrim" search-item="\'.search-item-people.active\'"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/people-search-item.html',
    '<div class="people-search-avatar" image-load>\n' +
    '    <span ng-if="user.initial" class="user-detail-initial">{{user.initial}}</span>\n' +
    '    <img ng-show="user.avatar" ng-src="{{user.avatar}}" class="people-search-avatar-icon"/>\n' +
    '</div>\n' +
    '<div class="people-search-item-body" ng-class="{\'no-email\': !ctrl.copyEmailSupported && !ctrl.nativeEmailClientSupported}">\n' +
    '    <p class="people-search-item-name" ng-bind-html="user.userName | highlight:ctrl.query.name"></p>\n' +
    '    <p class="people-search-item-title" ng-bind-html="user.title"></p>\n' +
    '    <p class="people-search-item-email" ng-class="{\'copied-email-highlight\': user.isCopied}">\n' +
    '        <span>{{user.email}}</span>\n' +
    '    </p>\n' +
    '</div>\n' +
    '<div ng-if="!user.isCopied" class="people-search-tooltip-trigger">\n' +
    '    <div ng-if="::ctrl.copyEmailSupported">\n' +
    '        <a role="button" aria-label="copyEmailButtonLabel" ng-click="ctrl.copyEmail(user)" stop-event="click">\n' +
    '            <svg svg-symbol="icon-copy-email" class="people-search-item-copy-email-icon branding-icon-primary"></svg>\n' +
    '        </a>\n' +
    '        <p class="copy-email-tooltip" tooltip tooltiptext="app.tooltip.copyEmail"\n' +
    '             triggerelement="people-search-tooltip-trigger"></p>\n' +
    '    </div>\n' +
    '    <div ng-if="::ctrl.nativeEmailClientSupported">\n' +
    '        <a role="button" aria-label="openEmailButtonLabel" ng-click="ctrl.openEmail(user.email)" stop-event="click">\n' +
    '            <svg svg-symbol="icon-email" class="people-search-item-email-icon branding-icon-primary"></svg>\n' +
    '        </a>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<p ng-if="user.isCopied" class="email-copied-notification" ng-class="{\'copied-email\': user.isCopied}">\n' +
    '    <svg svg-symbol="icon-messaging-check" class="icon-check branding-icon-primary"></svg>\n' +
    '    <span class="people-search-email-copied">{{ ::\'app.peopleSearch.emailCopied\' | i18n }}</span>\n' +
    '</p>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/people.html',
    '<div ng-show="peopleCtrl.isLoading" class="apps-loading">\n' +
    '    <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '</div>\n' +
    '<article id="people-container" class="people content-container-scrollable" ng-class="{\'disable-scroll\': appCenterCtrl.$state.current.activeTab == \'peopleDetails\'}">\n' +
    '    <div class="content with-boundary" pull-to-refresh="peopleCtrl.clearCache()" scroll-container=".people.content-container-scrollable">\n' +
    '        <section class="people-search-illo-header">\n' +
    '                <ng-include src="\'app-v2/svgincludes/illo-people-search-start.html\'" class="illo-people-search-start"></ng-include>\n' +
    '                <p class="search-for-people-text">{{ ::\'appCenter.peopleSearch.atLeastThreeChars\' | i18n }}</p>\n' +
    '        </section>\n' +
    '        <section class="content-body people-team-section" ng-if="peopleCtrl.managers.length || peopleCtrl.directReports.length || peopleCtrl.peers.length">\n' +
    '            <div class="people-team-header">\n' +
    '                <h3 class="people-team-title">{{ ::\'app.people.labels.team\' | i18n }}</h3>\n' +
    '            </div>\n' +
    '            <header class="collapse-panel-header non-collapsible">\n' +
    '                <h3>{{::\'app.people.labels.manager\' | i18n}}</h3>\n' +
    '            </header>\n' +
    '            <div class="grid-container">\n' +
    '                <div user-Item user="manager" class="grid-item people-team-item manager-card"\n' +
    '                 ng-repeat="manager in peopleCtrl.managers track by $index+manager.id"></div>\n' +
    '                <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '            </div>\n' +
    '\n' +
    '            <collapse-panel collapsible="peopleCtrl.collapsible" ng-class="{\'collapsible-header\' : peopleCtrl.collapsible}" class="people-peer-panel" ng-if="peopleCtrl.peers.length" headerlabel="{{::\'app.people.labels.peers\' | i18n}}">\n' +
    '                <div class="grid-container">\n' +
    '                    <div user-Item user="peer" class="grid-item people-team-item"\n' +
    '                         ng-repeat="peer in peopleCtrl.peers track by $index+peer.id"></div>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </collapse-panel>\n' +
    '\n' +
    '            <collapse-panel collapsible="peopleCtrl.collapsible" ng-class="{\'collapsible-header\' : peopleCtrl.collapsible}" class="people-directreports-panel" ng-if="peopleCtrl.directReports.length" headerlabel="{{::\'app.people.labels.directReports\' | i18n}}">\n' +
    '                <div class="grid-container">\n' +
    '                    <div user-Item user="directReport" class="grid-item people-team-item"\n' +
    '                         ng-repeat="directReport in peopleCtrl.directReports track by $index+directReport.id"></div>\n' +
    '                    <div ng-repeat="item in peopleCtrl.emptyFillers" class="grid-item-empty"></div>\n' +
    '                </div>\n' +
    '            </collapse-panel>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '<div ng-show="appCenterCtrl.$state.current.activeTab == \'peopleDetails\'" class="content-container user-details" ui-view></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/userDetails.html',
    '<div ng-show="userDetailsCtrl.isLoading" class="apps-loading">\n' +
    '    <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '</div>\n' +
    '<article class="details">\n' +
    '    <div class="user-details-loaded-container" ng-class="{\'header-collapsed\':userDetailsCtrl.isScrolled}">\n' +
    '        <section class="user-detail-page-header">\n' +
    '            <svg svg-symbol="user-header-background-ie" class="ie-header-background branding-icon-primary"\n' +
    '                 ng-if="::userDetailsCtrl.isIE"></svg>\n' +
    '           <div class="content user-detail-page">\n' +
    '               <section class="content-body">\n' +
    '                   <div ng-hide="appCenterCtrl.isAWJadeDesktop || appCenterCtrl.isAWJadeDocked"\n' +
    '                        class="details-back-button user-details-back-button"\n' +
    '                        id="pt-details-content-backbutton">\n' +
    '                       <span ng-click="::userDetailsCtrl.backBtnAction()" class="back-button">\n' +
    '                           <svg svg-symbol="icon-detail-back" class="icon-setting-close-button"></svg>\n' +
    '                           <span>{{\'app.settings.link.back\' | i18n}}</span>\n' +
    '                       </span>\n' +
    '                       <span class="people-home" ng-click="appCenterCtrl.peopleSearch()">\n' +
    '                           <svg svg-symbol="icon-people" class="icon-people-home"></svg>\n' +
    '                       </span>\n' +
    '                   </div>\n' +
    '\n' +
    '                   <div class="user-detail-header-body">\n' +
    '                       <div class="user-detail-header-avatar-container" image-load>\n' +
    '                           <span ng-if="userDetailsCtrl.user.initial" class="user-detail-initial">{{userDetailsCtrl.user.initial}}</span>\n' +
    '                           <img ng-show="userDetailsCtrl.user.imageURL" ng-src="{{userDetailsCtrl.user.imageURL}}"\n' +
    '                                class="user-detail-header-avatar"/>\n' +
    '                       </div>\n' +
    '                       <div class="user-detail-header-labels">\n' +
    '                           <p class="user-detail-header-name">\n' +
    '                               {{userDetailsCtrl.user.firstName + " " + userDetailsCtrl.user.lastName}}\n' +
    '                           </p>\n' +
    '                           <p class="user-detail-header-text">\n' +
    '                               {{userDetailsCtrl.user.title}}\n' +
    '                           </p>\n' +
    '                           <p class="user-detail-header-text">\n' +
    '                               {{userDetailsCtrl.user.costCenter}}\n' +
    '                           </p>\n' +
    '                       </div>\n' +
    '                   </div>\n' +
    '                   <!-- tabs for the two sections -->\n' +
    '                    <div class="user-profile-tab">\n' +
    '                        <nav class="user-profile-nav">\n' +
    '                            <div ng-click="!userDetailsCtrl.isProfile && userDetailsCtrl.toggleProfileTab()"\n' +
    '                                 class="user-profile-nav-item"\n' +
    '                                 ng-class="{\'selected\': userDetailsCtrl.isProfile}">\n' +
    '                                <a>{{ ::\'app.people.labels.profile\' | i18n }}</a>\n' +
    '                            </div>\n' +
    '                            <div ng-click="userDetailsCtrl.isProfile && userDetailsCtrl.toggleProfileTab()"\n' +
    '                                 class="user-profile-nav-item"\n' +
    '                                 ng-class="{\'selected\': !userDetailsCtrl.isProfile}">\n' +
    '                                <a>{{ ::\'app.people.labels.org\' | i18n }}</a>\n' +
    '                            </div>\n' +
    '                        </nav>\n' +
    '                    </div>\n' +
    '                </section>\n' +
    '            </div>\n' +
    '        </section><!--end of user-detail-page-header -->\n' +
    '        <div class="content-container-scrollable">\n' +
    '            <div class="content">\n' +
    '                <section class="content-body user-details-content-body" ng-if="userDetailsCtrl.user">\n' +
    '                    <section class="user-profile-section" ng-class="{\'tab-hidden\':!userDetailsCtrl.isProfile}">\n' +
    '                        <div class="scroll-hidden" scroll scrolled="userDetailsCtrl.isScrolled">\n' +
    '                            <h3 class="user-details-profile-header">{{ ::\'app.people.labels.profile\' | i18n }}</h3>\n' +
    '                            <div class="user-details-profile-content">\n' +
    '                                <div ng-if="userDetailsCtrl.user.emailAddress" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.workEmail\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content"\n' +
    '                                         ng-class="{\'copied-email-highlight\': userDetailsCtrl.user.isCopied}">\n' +
    '                                        <span class="allow-user-select">{{userDetailsCtrl.user.emailAddress}}</span>\n' +
    '                                    </div>\n' +
    '                                    <div ng-show="!userDetailsCtrl.user.isCopied" class="user-profile-action-icon">\n' +
    '                                        <div ng-if="::userDetailsCtrl.copyEmailSupported">\n' +
    '                                            <a role="button" aria-label="copyEmailButtonLabel" ng-click="userDetailsCtrl.copyEmail(userDetailsCtrl.user)" stop-event="click">\n' +
    '                                                <svg svg-symbol="icon-copy-email" class="user-search-item-copy-email-icon branding-icon-primary"></svg>\n' +
    '                                            </a>\n' +
    '                                            <div class="profile-copy-email-tooltip" tooltip tooltiptext="app.tooltip.copyEmail"\n' +
    '                                                 triggerelement="user-profile-action-icon"></div>\n' +
    '                                        </div>\n' +
    '                                        <div ng-if="::userDetailsCtrl.nativeEmailClientSupported">\n' +
    '                                            <a role="button" aria-label="openEmailButtonLabel" ng-click="userDetailsCtrl.openEmail(userDetailsCtrl.user.emailAddress)" stop-event="click">\n' +
    '                                                <svg svg-symbol="icon-email" class="user-search-item-email-icon branding-icon-primary"></svg>\n' +
    '                                            </a>\n' +
    '                                        </div>\n' +
    '                                    </div>\n' +
    '                                    <div class="user-profile-email-copied-notification"\n' +
    '                                         ng-show="userDetailsCtrl.user.isCopied"\n' +
    '                                         ng-class="{\'copied-email-mobile\': people.isCopied}">\n' +
    '                                        <svg svg-symbol="icon-messaging-check"\n' +
    '                                                 class="branding-icon-primary  icon-check branding-icon-primary"></svg>\n' +
    '                                        <span class="user-search-email-copied">\n' +
    '                                            {{ ::\'app.peopleSearch.emailCopied\' | i18n }}\n' +
    '                                        </span>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.phoneNumber" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.workPhone\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content allow-user-select">\n' +
    '                                        {{::userDetailsCtrl.user.phoneNumber}}\n' +
    '                                    </div>\n' +
    '                                    <div ng-if="::appCenterCtrl.isAWJadeMobile && userDetailsCtrl.linksSupported"\n' +
    '                                         class="user-profile-action-icon branding-icon-primary phone">\n' +
    '                                        <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.phoneNumber)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.mobile" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.mobile\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content allow-user-select">\n' +
    '                                        {{::userDetailsCtrl.user.mobile}}\n' +
    '                                    </div>\n' +
    '                                    <div ng-if="::appCenterCtrl.isAWJadeMobile && userDetailsCtrl.linksSupported"\n' +
    '                                         class="user-profile-action-icon branding-icon-primary">\n' +
    '                                        <span class="message-icon-spacing">\n' +
    '                                            <a role="button" aria-label="openSmsButtonLabel" ng-click="userDetailsCtrl.openSms(userDetailsCtrl.user.mobile)" stop-event="click">\n' +
    '                                                <svg svg-symbol="icon-sms" class="user-search-item-sms-icon branding-icon-primary"></svg>\n' +
    '                                            </a>\n' +
    '                                        </span>\n' +
    '                                        <span>\n' +
    '                                            <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.mobile)" stop-event="click">\n' +
    '                                                <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                                            </a>\n' +
    '                                        </span>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.alternatePhoneNumber" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.alternateNumber\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content allow-user-select">\n' +
    '                                        {{::userDetailsCtrl.user.alternatePhoneNumber}}\n' +
    '                                    </div>\n' +
    '                                    <div ng-if="::appCenterCtrl.isAWJadeMobile && userDetailsCtrl.linksSupported"\n' +
    '                                         class="user-profile-action-icon branding-icon-primary phone">\n' +
    '                                        <a role="button" aria-label="openDiallerButtonLabel" ng-click="userDetailsCtrl.openTel(userDetailsCtrl.user.alternatePhoneNumber)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-call" class="user-search-item-call-icon"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.address" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.address\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content no-ellipsis allow-user-select">\n' +
    '                                        {{::userDetailsCtrl.user.address}}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-profile-action-icon" ng-if="userDetailsCtrl.linksSupported">\n' +
    '                                        <a role="button" aria-label="openMapsButtonLabel" ng-click="userDetailsCtrl.openMaps(userDetailsCtrl.user.address)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-maps" class="user-icon-maps branding-icon-primary"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="user-details-profile-content"\n' +
    '                                 ng-if="userDetailsCtrl.user.linkedInProfileUrl || userDetailsCtrl.user.slack || userDetailsCtrl.user.socialCast\n' +
    '                                    ||userDetailsCtrl.user.skypeForBusiness">\n' +
    '                                <div ng-if="userDetailsCtrl.user.linkedInProfileUrl" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.linkedIn\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content">\n' +
    '                                        {{::userDetailsCtrl.user.linkedInProfileUrl}}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-profile-action-icon branding-icon-primary social"\n' +
    '                                         ng-if="userDetailsCtrl.linksSupported">\n' +
    '                                        <a role="button" aria-label="openLinkedInButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.linkedInProfileUrl)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-linkedin" class="user-icon-social linked-in"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.slack" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.slack\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content">\n' +
    '                                        {{::userDetailsCtrl.user.slack}}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-profile-action-icon branding-icon-primary social"\n' +
    '                                         ng-if="userDetailsCtrl.linksSupported">\n' +
    '                                        <a role="button" aria-label="openSlackButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.slack)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-slack" class="user-icon-social slack"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.socialCast" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.socialcast\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content">\n' +
    '                                        {{::userDetailsCtrl.user.socialCast}}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-profile-action-icon branding-icon-primary social"\n' +
    '                                         ng-if="userDetailsCtrl.linksSupported">\n' +
    '                                        <a role="button" aria-label="openSocialcastButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.socialCast)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-socialcast" class="user-icon-social socialcast"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div ng-if="userDetailsCtrl.user.skypeForBusiness" class="user-details-profile-item">\n' +
    '                                    <div class="user-details-profile-item-label">\n' +
    '                                        {{ ::\'app.people.labels.skypeForBusiness\' | i18n }}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-details-profile-item-label-content">\n' +
    '                                        {{::userDetailsCtrl.user.skypeForBusiness}}\n' +
    '                                    </div>\n' +
    '                                    <div class="user-profile-action-icon branding-icon-primary social" ng-if="userDetailsCtrl.linksSupported && userDetailsCtrl.isBrowser">\n' +
    '                                        <a role="button" aria-label="openSkypeForBusinessButtonLabel" ng-click="userDetailsCtrl.openSocialUrl(userDetailsCtrl.user.skypeForBusiness)" stop-event="click">\n' +
    '                                            <svg svg-symbol="icon-skype" class="user-icon-social icon-skype"></svg>\n' +
    '                                        </a>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </section>\n' +
    '                    <section class="user-org-section" ng-class="{\'tab-hidden\':userDetailsCtrl.isProfile}"\n' +
    '                             ng-if="userDetailsCtrl.managers.length || userDetailsCtrl.directReports.length">\n' +
    '                        <div class="scroll-hidden" scroll scrolled="userDetailsCtrl.isScrolled">\n' +
    '                            <h3 class="user-details-profile-header header-org">{{ ::\'app.people.labels.org\' | i18n }}</h3>\n' +
    '                            <div class="user-details-org-content">\n' +
    '                                <collapse-panel class="user-org-manager-section"\n' +
    '                                                ng-if="userDetailsCtrl.managers.length > 2"\n' +
    '                                                headerlabel="{{userDetailsCtrl.getManagerLabel()}}"\n' +
    '                                                collapsed="userDetailsCtrl.managerToggle"\n' +
    '                                                collapsible="userDetailsCtrl.managerToggle">\n' +
    '                                    <div user-item user="manager" class="people-team-item"\n' +
    '                                         ng-repeat="manager in userDetailsCtrl.managers | orderBy:\'$index\':true track by $index+manager.id"\n' +
    '                                         ng-class="{\'current-user\': manager.id === userDetailsCtrl.user.id}"></div>\n' +
    '                                </collapse-panel>\n' +
    '                                <div class="manager-collapsed" ng-if="userDetailsCtrl.managerToggle">\n' +
    '                                    <div ng-if="userDetailsCtrl.managerToggle">\n' +
    '                                        <div user-item user="manager" class="people-team-item"\n' +
    '                                             ng-class="{\'current-user\': manager.id === userDetailsCtrl.user.id}"\n' +
    '                                             ng-repeat="manager in userDetailsCtrl.managers | limitTo : 2 | orderBy:\'$index\':true track by $index+manager.id"></div>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <collapse-panel class="user-org-reportee-section"\n' +
    '                                                ng-if="userDetailsCtrl.directReports.length"\n' +
    '                                                headerlabel="{{userDetailsCtrl.directReports.length}} {{ ::\'app.people.labels.directReports\' | i18n }}">\n' +
    '                                    <div user-item user="reportee" class="people-team-item"\n' +
    '                                         ng-repeat="reportee in userDetailsCtrl.directReports track by $index+reportee.id"></div>\n' +
    '                                </collapse-panel>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </section>\n' +
    '                </section>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</article>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/people/userItem.html',
    '<div ng-click="userDetails(user)">\n' +
    '    <div class="user-details-section" ng-class="{\'reduce-card-width-on-hover\': user.email && !user.isCopied}">\n' +
    '        <div class="user-team-item-avatar" image-load>\n' +
    '            <span ng-if="user.initial" class="user-detail-initial">{{user.initial}}</span>\n' +
    '            <img ng-show="user.avatar" ng-src="{{user.avatar}}"/>\n' +
    '        </div>\n' +
    '        <div ng-if="!user.isCopied">\n' +
    '            <p class="user-team-item-name">{{::user.userName}}</p>\n' +
    '            <p class="user-team-item-title">{{::user.title}}</p>\n' +
    '        </div>\n' +
    '        <div class="email-details-copied" ng-if="user.isCopied">\n' +
    '            <p class="copied-email-highlight">\n' +
    '                <span>{{user.email}}</span>\n' +
    '            </p>\n' +
    '            <p class="email-copied-text">\n' +
    '                <svg svg-symbol="icon-messaging-check" class="icon-check branding-icon-primary"></svg>\n' +
    '                <span>\n' +
    '                    {{ ::\'app.peopleSearch.emailCopied\' | i18n }}\n' +
    '                </span>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="copy-email-section" ng-if="user.email">\n' +
    '        <div ng-if="!user.isCopied" class="copy-icon-placeholder">\n' +
    '            <div ng-if="::copyEmailSupported">\n' +
    '                <a role="button" aria-label="copyEmailButtonLabel" ng-click="copyEmail(user)" stop-event="click">\n' +
    '                    <svg svg-symbol="icon-copy-email" class="people-search-item-copy-email-icon branding-icon-primary"></svg>\n' +
    '                </a>\n' +
    '                <div class="copy-email-tooltip" tooltip tooltiptext="app.tooltip.copyEmail"\n' +
    '                     triggerelement="copy-email-section"></div>\n' +
    '            </div>\n' +
    '            <div ng-if="::nativeEmailClientSupported">\n' +
    '                <a role="button" aria-label="openEmailButtonLabel" ng-click="openEmail(user.email)" stop-event="click">\n' +
    '                    <svg svg-symbol="icon-email" class="people-search-item-email-icon branding-icon-primary"></svg>\n' +
    '                </a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/search/search-dropdown.html',
    '<div class="search-results">\n' +
    '    <div id="search-container">\n' +
    '        <div id="search-spinner-container" class="apps-loading spinner-foreground" style="display: none;">\n' +
    '            <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '        </div>\n' +
    '        <div ng-repeat="app in ctrl.apps track by $index+app.appId+app.categoryName" class="search-item-app" ng-include="\'app-v2/search/search-item.html\'"></div>\n' +
    '        <div class="search-empty-result" ng-if="ctrl.noResults">\n' +
    '            <ng-include src="\'app-v2/svgincludes/illo-empty-search.html\'" class="illo-empty-search"></ng-include>\n' +
    '            <p>{{ ::\'appCenter.search.noResults\' | i18n }}</p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/search/search-input.html',
    '<div>\n' +
    '    <div class="search-input-bar">\n' +
    '        <label>\n' +
    '            <svg svg-symbol="icon-searchglass"></svg>\n' +
    '        </label>\n' +
    '        <input type="text"\n' +
    '            ng-model="ctrl.query.name"\n' +
    '            ng-change="ctrl.onsearch()"\n' +
    '            ng-model-options="{ debounce: 500 }"\n' +
    '            placeholder="{{ ::\'appCenter.search.placeholder\' | i18n }}"\n' +
    '            class="search-inputfield"\n' +
    '            autocorrect="off"\n' +
    '            autocapitalize="off" />\n' +
    '        <button class="search-clear-button" id="pt-search-clear-button" ng-click="ctrl.xButtonClearSearch()" ng-show="ctrl.query.name">\n' +
    '            <svg svg-symbol="icon-circle-x"></svg>\n' +
    '        </button>\n' +
    '    </div>\n' +
    '    <div class="search-result-scrim" id="pt-search-scrim" ng-show="ctrl.query.name.length >=1" search-results-close close="ctrl.clearSearchResults()" show-scrim="ctrl.query.name.length >=1"></div>\n' +
    '    <div class="search-results-placeholder" ng-show="ctrl.query.name.length == 0">\n' +
    '        <ng-include src="\'app-v2/svgincludes/illo-start-search.html\'" class="icon-start-search"></ng-include>\n' +
    '        <p>{{ ::\'appCenter.searchApps\' | i18n }}</p>\n' +
    '    </div>\n' +
    '    <div search-dropdown template-url="app-v2/search/search-dropdown.html" search-item="\'.search-item-app.active\'" ng-if="ctrl.query.name.length"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/search/search-item.html',
    '<div class="search-results-header" ng-if="app.isCategory">\n' +
    '    <p><span ng-bind-html="app.categoryName | highlight:ctrl.query.name"/> <span class="search-category-length" ng-bind="app.length"/></p>\n' +
    '</div>\n' +
    '<div class="search-item" ng-if="!app.isCategory">\n' +
    '    <div ng-click="ctrl.details(app)" class="search-item-image" icon url="app._links.icon.href"></div>\n' +
    '    <div ng-click="ctrl.details(app)" class="search-item-body" ng-show="app.name">\n' +
    '        <p class="search-item-name" ng-bind-html="app.name | highlight:ctrl.query.name"></p>\n' +
    '        <p class="search-item-type">\n' +
    '            <svg ng-if="app.isHorizonResource || app.isHorizonAirResource" svg-symbol="icon-horizon-watermark"></svg>\n' +
    '            {{::app.appTypeDisplayVal}}\n' +
    '        </p>\n' +
    '        <p class="search-item-vpn-required-message" ng-if="app.isTunnelRequired">\n' +
    '            <svg svg-symbol="icon-tunnel" class="catalog-tunnel-icon-mobile"></svg>\n' +
    '            {{ ::\'app.tunnel.header\' | i18n }}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '    <div class="search-item-actions branding-icon-primary" catalog-item-actions app="app" current-view="\'SEARCH\'" stop-event="click"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/about.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back settings-about-button" id="pt-settings-about-back" ng-click="::settingsCtrl.dismissSettingsDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'userInfo.about\' | i18n}}</h2>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="settings-detail-content-scrollable">\n' +
    '        <div class="settings-detail-content">\n' +
    '            <h2 class="settings-detail-title">{{\'app.about.heading\' | i18n }}</h2>\n' +
    '            <p class="about-description">{{\'app.about.copyright\' | i18n }}</p>\n' +
    '\n' +
    '            <a target="_blank" ng-href="{{\'app.about.patentsLink\' | i18n}}" class="about-sublink patent-button">\n' +
    '                <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.patents\' | i18n }}\n' +
    '            </a>\n' +
    '\n' +
    '            <a ng-if="isOnPrem" target="_blank" ng-href="{{\'app.about.licenseAgreementLink\' | i18n}}" class="about-sublink licence-button" >\n' +
    '                <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.licenseAgreement\' | i18n }}\n' +
    '            </a>\n' +
    '\n' +
    '            <a ng-if="!isOnPrem" target="_blank" ng-href="{{\'app.about.saasLicenseAgreementLink\' | i18n}}" class="about-sublink licence-button" >\n' +
    '                <svg svg-symbol="icon-openapp-small"></svg>{{\'app.about.button.label.licenseAgreement\' | i18n }}\n' +
    '            </a>\n' +
    '\n' +
    '            <div class="about-promo-container" ng-if="settingsCtrl.showMacAppDownloadBanner || appCenterCtrl.isMobileNonWindowBrowser">\n' +
    '                <h2 class="settings-detail-title promo-download-title">{{::\'userInfo.settings.promo.title\' | i18n}}</h2>\n' +
    '                <p>{{::\'userInfo.settings.promo.message\' |i18n}}</p>\n' +
    '                <p class="about-promo-actions">\n' +
    '                    <button class="about-promo-action primary-button" id="pt-promo-download-link" ng-click="settingsCtrl.downloadApp()"> {{::\'app.promotion.banner.download\' | i18n }}</button>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/account.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back settings-account-button" ng-click="::settingsCtrl.dismissSettingsDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'userInfo.account\' | i18n}}</h2>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable" >\n' +
    '        <div class="settings-detail-content">\n' +
    '            <div class="setting-desktop-profile-container" ng-show="appCenterCtrl.userAvailable">\n' +
    '                <h2 class="settings-detail-title">{{::\'userInfo.profile\' | i18n}}</h2>\n' +
    '                <div class="desktop-profile-avatar-container profile-avatar" image-load>\n' +
    '                    <img ng-src="{{appCenterCtrl.user.imageURL}}" ng-show="appCenterCtrl.user.imageURL" class="settings-user-avatar"/>\n' +
    '                </div>\n' +
    '                <p class="settings-profile-name">\n' +
    '                    <span class="profile-label">{{::\'userInfo.profile.name\' | i18n}} </span>\n' +
    '                    <span class="profile-content">{{\'fullname\' | i18n : appCenterCtrl.user.firstName : appCenterCtrl.user.lastName}}</span>\n' +
    '                </p>\n' +
    '                <p class="settings-profile-username"><span class="profile-label">{{::\'userInfo.profile.username\' | i18n}} </span>\n' +
    '                    <span class="profile-content">{{::appCenterCtrl.user.userName}}</span>\n' +
    '                </p>\n' +
    '                <p class="settings-profile-email"><span class="profile-label">{{::\'userInfo.profile.email\' | i18n}} </span>\n' +
    '                    <span class="profile-content">{{::appCenterCtrl.user.emailAddress}}</span>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '            <div class="setting-desktop-profile-container" ng-if="settingsCtrl.userInfo.changePasswordAllowed">\n' +
    '                <h2>{{::\'userInfo.profile.password\' | i18n}}\n' +
    '                <span class="password-change" ng-click="::settingsCtrl.openPasswordDialog()">{{::\'userInfo.profile.passwordchange\' | i18n}}</span>\n' +
    '                </h2>\n' +
    '                <p>{{::\'userInfo.profile.passwordprompt\' | i18n}}</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/changePasswordDialog.html',
    '<div modal-new class="modal-changepassword">\n' +
    '    <section class="dialog-container" ng-controller="ChangePasswordController as cpCtrl">\n' +
    '        <header class="dialog-header">\n' +
    '            <h2>{{::\'app.changePassword.title\' | i18n}}</h2>\n' +
    '        </header>\n' +
    '\n' +
    '        <div class="dialog-body">\n' +
    '\n' +
    '            <div class="right-container">\n' +
    '                <div ng-show="cpCtrl.policies" class="policy-container">\n' +
    '                    <div class="password-policy">\n' +
    '                        <p class="password-requirement-title">{{:: \'app.passwordPolicy.passwordRequirements\' | i18n}}</p>\n' +
    '                        <p ng-bind-html="cpCtrl.policyString"></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="password-container">\n' +
    '                <form name="changePasswordForm" novalidate>\n' +
    '                    <div class="error-messages">\n' +
    '                        <svg ng-show="cpCtrl.showErrors || cpCtrl.errorMessage" class="icon-password-error" svg-symbol="icon-notify-error"></svg>\n' +
    '                        <span class="server-errors" ng-show="cpCtrl.showErrors" ng-repeat="error in cpCtrl.errorMessages">{{ error.description }}&nbsp;</span>\n' +
    '                        <span class="mismatch-error" ng-show="cpCtrl.errorMessage">{{cpCtrl.errorMessage}}</span>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field"\n' +
    '                                type="{{cpCtrl.currentInputType}}"\n' +
    '                                ng-model="cpCtrl.currentPassword"\n' +
    '                                disable-copy-paste\n' +
    '                                required />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.currentpassword\' | i18n}}</label>\n' +
    '                        <button class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'current\')">\n' +
    '                            <svg ng-if="!cpCtrl.showCurrentPassword" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showCurrentPassword" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field"\n' +
    '                               ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                               type="{{cpCtrl.newInputType1}}"\n' +
    '                               ng-model="cpCtrl.newPassword"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.newpassword\' | i18n}}</label>\n' +
    '                        <button class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'new1\')">\n' +
    '                            <svg ng-if="!cpCtrl.showNewPassword1" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showNewPassword1" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field"\n' +
    '                               ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                               type="{{cpCtrl.newInputType2}}"\n' +
    '                               ng-model="cpCtrl.confirmNewPassword"\n' +
    '                               disable-copy-paste\n' +
    '                               required />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.confirmpassword\' | i18n}}</label>\n' +
    '                        <button class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'new2\')">\n' +
    '                            <svg ng-if="!cpCtrl.showNewPassword2" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showNewPassword2" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                </form>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <footer class="dialog-actions two-action">\n' +
    '            <button class="setting-button secondary-button" ng-click="cpCtrl.closePasswordForm($event)">{{:: \'button.cancel\' | i18n }}</button>\n' +
    '            <button class="setting-button primary-button password-save-button" ng-click="cpCtrl.changePasswordConfirm($event)" ng-disabled="changePasswordForm.$invalid">{{:: \'button.save\' | i18n }}</button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/devicelist-desktopapp-nativenav.html',
    '<div modal-new class="modal-fullscreen modal-settings-nativenav" >\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header no-symbol">\n' +
    '            <h2 class="settings-desktopapp-nativenav-heading">{{::\'userInfo.devices\' | i18n}}</h2>\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '        </header>\n' +
    '\n' +
    '        <div class="dialog-body" ng-controller="DevicesController as devicesCtrl">\n' +
    '            <div class="empty-devices-message-desktopapp" ng-if="devicesCtrl.devices.length < 1 && !devicesCtrl.isLoading">\n' +
    '                <ng-include src="\'app-v2/svgincludes/illo-empty-device.html\'"></ng-include>\n' +
    '                <p>{{::\'app.devices.emptyDeviceListMessage\' | i18n}}</p>\n' +
    '            </div>\n' +
    '\n' +
    '            <ul class="device-list-desktopapp-nativenav" ng-if="devicesCtrl.devices.length > 0 && !devicesCtrl.isLoading">\n' +
    '                <li ng-repeat="device in devicesCtrl.devices track by $index" ng-class="device.osFamily">\n' +
    '                    <p class="device-icon-name">\n' +
    '                        <ng-include src="device.iconfilename" class="device-icon"></ng-include>\n' +
    '                        <span>{{::device.machineName}}</span>\n' +
    '                    </p>\n' +
    '\n' +
    '                    <div class="device-info-container">\n' +
    '                        <p class="device-heading-time"> {{::\'app.devices.tableColumn.lastLoginTime\' | i18n}}</p>\n' +
    '                        <p class="login-date-time">{{::device.lastLoginTime | date:\'medium\'}}</span>\n' +
    '                        <p class="unlink-device" ng-show="device.osFamily == \'Windows\'">\n' +
    '                            <a class="unlink-device-link" ng-click="devicesCtrl.unlinkDevice(device, $event)">\n' +
    '                                {{\'app.devices.unlinkDevice\' | i18n }}\n' +
    '                            </a>\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '    <div ng-show="!devicesCtrl.isLoading" class="devicelist-loading">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/hubBrowserChangePassword.html',
    '<div modal-new class="hub-modal-container modal-changepassword">\n' +
    '    <section class="dialog-container" ng-controller="ChangePasswordController as cpCtrl">\n' +
    '        <div ng-show="cpCtrl.isLoading" class="loading-app-details-container">\n' +
    '            <spinner-loading></spinner-loading>\n' +
    '        </div>\n' +
    '        <header class="dialog-header">\n' +
    '            <div class="mobile-subpage-back-button"\n' +
    '                 ng-click="cpCtrl.closePasswordForm($event)">\n' +
    '                <subpage-back-button class="change-password-page"></subpage-back-button>\n' +
    '            </div>\n' +
    '            <h2>{{::\'app.changePassword.title\' | i18n}}</h2>\n' +
    '            <div class="editmode-close-button" ng-click="cpCtrl.closePasswordForm($event)">\n' +
    '                <svg svg-symbol="icon-close-popup"></svg>\n' +
    '            </div>\n' +
    '            <div class="header-actions">\n' +
    '                <button class="sort-action primary-btn sort-save password-save-button for-mobile"\n' +
    '                        ng-class="{\'enabled-state\': !changePasswordForm.$invalid}"\n' +
    '                        ng-click="cpCtrl.changePasswordConfirm($event)"\n' +
    '                        ng-disabled="changePasswordForm.$invalid">\n' +
    '                    {{:: \'button.save\' | i18n }}\n' +
    '                </button>\n' +
    '            </div>\n' +
    '        </header>\n' +
    '        <main class="dialog-body">\n' +
    '            <div class="password-container">\n' +
    '                <form name="changePasswordForm" novalidate>\n' +
    '                    <div class="error-messages">\n' +
    '                        <svg ng-show="cpCtrl.showErrors || cpCtrl.errorMessage" class="icon-password-error" svg-symbol="icon-notify-error"></svg>\n' +
    '                        <span class="server-errors" ng-show="cpCtrl.showErrors" ng-repeat="error in cpCtrl.errorMessages">{{ error.description }}&nbsp;</span>\n' +
    '                        <span class="mismatch-error" ng-show="cpCtrl.errorMessage">{{cpCtrl.errorMessage}}</span>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field"\n' +
    '                               type="{{cpCtrl.currentInputType}}"\n' +
    '                               ng-model="cpCtrl.currentPassword"\n' +
    '                               required\n' +
    '                               disable-copy-paste />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.currentpassword\' | i18n}}</label>\n' +
    '                        <button class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'current\')">\n' +
    '                            <svg ng-if="!cpCtrl.showCurrentPassword" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showCurrentPassword" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input class="input-password-field"\n' +
    '                               ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                               type="{{cpCtrl.newInputType1}}"\n' +
    '                               ng-model="cpCtrl.newPassword"\n' +
    '                               required\n' +
    '                               disable-copy-paste />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.newpassword\' | i18n}}</label>\n' +
    '                        <button class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'new1\')">\n' +
    '                            <svg ng-if="!cpCtrl.showNewPassword1" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showNewPassword1" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                    <div class="input-placeholder-animate">\n' +
    '                        <input\n' +
    '                                class="input-password-field"\n' +
    '                                ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                                type="{{cpCtrl.newInputType2}}"\n' +
    '                                ng-model="cpCtrl.confirmNewPassword"\n' +
    '                                required\n' +
    '                                disable-copy-paste />\n' +
    '                        <label>{{:: \'app.passwordPolicy.label.confirmpassword\' | i18n}}</label>\n' +
    '                        <button class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'new2\')">\n' +
    '                            <svg ng-if="!cpCtrl.showNewPassword2" svg-symbol="icon-show-password"></svg>\n' +
    '                            <svg ng-if="cpCtrl.showNewPassword2" svg-symbol="icon-hide-password"></svg>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                </form>\n' +
    '            </div>\n' +
    '            <div class="right-container">\n' +
    '                <div ng-show="cpCtrl.policies" class="policy-container">\n' +
    '                    <div class="password-policy">\n' +
    '                        <p class="password-requirement-title">{{:: \'app.passwordPolicy.passwordRequirements\' | i18n}}</p>\n' +
    '                        <p ng-bind-html="cpCtrl.policyString"></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </main>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="button-action primary-action password-save-button for-desktop"\n' +
    '                    ng-class="{\'enabled-state\': !changePasswordForm.$invalid}"\n' +
    '                    ng-click="cpCtrl.changePasswordConfirm($event)"\n' +
    '                    ng-disabled="changePasswordForm.$invalid">\n' +
    '                {{:: \'button.save\' | i18n }}\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/preferences.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back settings-preferences-button" ng-click="::settingsCtrl.dismissSettingsDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'userInfo.preferences\' | i18n}}</h2>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable">\n' +
    '        <div class="settings-detail-content">\n' +
    '            <h2 class="settings-detail-title">{{\'myapps.launch.view.selectPreferredLaunchClientTitle\' | i18n }}</h2>\n' +
    '            <p class="preference-instruction">{{\'myapps.launch.view.selectPreferredLaunchClientText\' | i18n }}</p>\n' +
    '            <p class="preference-instruction">{{\'myapps.launch.view.selectPreferredLaunchClientText2\' | i18n }}</p>\n' +
    '            <fieldset class="preference-options-container" ng-init="preferencesCtrl.preferredClientTemp = preferencesCtrl.preferredClient">\n' +
    '\n' +
    '                <label>\n' +
    '                    <input type="radio" ng-model="preferencesCtrl.preferredClientTemp" value="NATIVE" id="native" class="preference-option-radio-input"  />\n' +
    '                    <div class="preference-option-container">\n' +
    '                        <svg class="preference-option-icon horizon" svg-symbol="icon-horizonclient-green" ></svg>\n' +
    '                        <svg class="preference-checked" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                        <p class="preference-option-text">{{\'myapps.launch.view.preferredClient.horizonView\' | i18n }}</p>\n' +
    '                        <a target="_blank" ng-show = "preferencesCtrl.preferredClientTemp === \'NATIVE\'" ng-href="{{ preferencesCtrl.installLink }}">{{\'appCenter.action.install\' | i18n }}</a>\n' +
    '                    </div>\n' +
    '                </label>\n' +
    '\n' +
    '                <label>\n' +
    '                    <input type="radio" ng-model="preferencesCtrl.preferredClientTemp" value="BROWSER" id="browser" class="preference-option-radio-input" />\n' +
    '                    <div class="preference-option-container">\n' +
    '                        <svg class="preference-option-icon browser" svg-symbol="icon-browser"></svg>\n' +
    '                        <svg class="preference-checked" svg-symbol="icon-preference-checkmark" ></svg>\n' +
    '                        <p class="preference-option-text">{{\'myapps.launch.view.preferredClient.browser\' | i18n }}</p>\n' +
    '                    </div>\n' +
    '                </label>\n' +
    '            </fieldset>\n' +
    '\n' +
    '            <div ng-if="preferencesCtrl.showActions" class="preference-actions">\n' +
    '                <a class="setting-button cancel-preference secondary-button" ng-click="preferencesCtrl.cancelPreferenceChange();"> {{\'button.cancel\' | i18n }}</a>\n' +
    '                <a class="setting-button save-button primary-button" ng-click="preferencesCtrl.saveLaunchDesktopPreference();"> {{\'button.save\' | i18n }}</a>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pv-preference-container" id="pt-pv-preference" ng-if="preferencesCtrl.showPVPreference">\n' +
    '                <h2>{{ \'app.passwordVault.preference.title\' | i18n}}</h2>\n' +
    '                <p>{{ \'app.passwordVault.preference.instruction\' | i18n}}</p>\n' +
    '                <a id="pt-pv-storelink" ng-click="preferencesCtrl.installPasswordVaultPlugin()">\n' +
    '                    <svg svg-symbol="icon-ws1-lockup"></svg>\n' +
    '                    <span>{{ \'app.passwordVault.preference.getextension\' | i18n}}</span>\n' +
    '                </a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/settings-desktopapp.html',
    '<article class="settings-desktopapp" id="settings-desktopapp"  ng-controller="SettingsController as settingsCtrl">\n' +
    '    <button class="settings-desktop-close-button">\n' +
    '        <svg svg-symbol="icon-close" class="icon-close-desktopapp-settings"></svg>\n' +
    '    </button>\n' +
    '    <tabs>\n' +
    '        <pane datalabel="{{\'app.desktopapp.settings.title.account\' | i18n}}" id="pt-desktopapp-account">\n' +
    '            <div class="setting-desktop-profile-container">\n' +
    '                <h2 class="settings-detail-title">{{::\'userInfo.profile\' | i18n}}</h2>\n' +
    '                <div class="desktop-profile-avatar-container profile-avatar" image-load>\n' +
    '                    <img ng-src="{{appCenterCtrl.user.imageURL}}" ng-show="appCenterCtrl.user.imageURL" class="desktopapp-profile-image"/>\n' +
    '                </div>\n' +
    '                <p class="settings-profile-name">\n' +
    '                    <span class="profile-label">{{::\'userInfo.profile.name\' | i18n}} </span>\n' +
    '                    <span class="profile-content">{{\'fullname\' | i18n : appCenterCtrl.user.firstName : appCenterCtrl.user.lastName}}</span>\n' +
    '                </p>\n' +
    '                <p class="settings-profile-username"><span class="profile-label">{{::\'userInfo.profile.username\' | i18n}} </span>\n' +
    '                    <span class="profile-content">{{::appCenterCtrl.user.userName}}</span>\n' +
    '                </p>\n' +
    '                <p class="settings-profile-email"><span class="profile-label">{{::\'userInfo.profile.email\' | i18n}} </span>\n' +
    '                    <span class="profile-content">{{::appCenterCtrl.user.emailAddress}}</span>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '\n' +
    '            <div ng-if="::appCenterCtrl.passwordChangeEnabled">\n' +
    '                <h2 class="settings-detail-title-desktopapp">{{::\'userInfo.profile.password\' | i18n}}\n' +
    '                    <span class="password-change" ng-click="::settingsCtrl.openPasswordDialog()">{{::\'userInfo.profile.passwordchange\' | i18n}}</span>\n' +
    '                </h2>\n' +
    '                <p>{{::\'userInfo.profile.passwordprompt\' | i18n}}</p>\n' +
    '            </div>\n' +
    '\n' +
    '        </pane>\n' +
    '        <pane displaycheck="appCenterCtrl.mdmOnlyWS1" datalabel="{{\'app.desktopapp.settings.title.devices\' | i18n}}" id="pt-desktopapp-devices">\n' +
    '            <div class="device-list-desktopapp-container" ng-include="\'app-v2/common/deviceList-desktopapp.html\'" ng-controller="DevicesController as devicesCtrl">\n' +
    '            </div>\n' +
    '        </pane>\n' +
    '    </tabs>\n' +
    '\n' +
    '    <section class="settings-desktopapp-footer" >\n' +
    '        <ul class="settings-desktopapp-footer-list">\n' +
    '            <li class="nav-about-native-link" ng-click="::settingsCtrl.nativeAbout()" id="pt-desktopapp-native-about">\n' +
    '                <svg class="settings-footer-icon " svg-symbol="icon-about"></svg>\n' +
    '                <div tooltip tooltiptext="userInfo.about" arrow="bottom" triggerelement="nav-about-native-link"></div>\n' +
    '            </li>\n' +
    '            <li class="nav-termsofuse-link" ng-if="appCenterCtrl.isTermsOfUseEnabled" ng-click="settingsCtrl.termsOfUseForDesktopApp()" id="pt-desktopapp-native-termsofuse">\n' +
    '                <svg class="settings-footer-icon" svg-symbol="icon-termsofuse"></svg>\n' +
    '                <div tooltip tooltiptext="userInfo.termsofuse" arrow="bottom" triggerelement="nav-termsofuse-link"></div>\n' +
    '            </li>\n' +
    '            <li class="nav-signout-link align-right" ng-if="appCenterCtrl.isAWJadeDesktop" ng-click="appCenterCtrl.signout($event)" id="pt-desktopapp-native-signout">\n' +
    '                <svg class="settings-footer-icon" svg-symbol="icon-signout"></svg>\n' +
    '                <span>{{\'userInfo.signout\' | i18n}}</span>\n' +
    '            </li>\n' +
    '            <li class="nav-removeaccount-link align-right" ng-if="appCenterCtrl.isAWJadeMobile && appCenterCtrl.isAWJadeDocked" ng-click="appCenterCtrl.unEnrollConfirm($event)" id="pt-docked-native-removeaccount">\n' +
    '                <svg class="settings-footer-icon" svg-symbol="icon-signout"></svg>\n' +
    '                <span>{{\'userInfo.removeAccount\'| i18n}}</span>\n' +
    '            </li>\n' +
    '        </ul>\n' +
    '    </section>\n' +
    '</article>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/settings.html',
    '<article class="settings content-container-scrollable" ng-if="!appCenterCtrl.isAWJadeDesktop" ng-hide="appCenterCtrl.isAWJadeDocked && appCenterCtrl.isAWJadeWithNativenav">\n' +
    '	<div class="content width-boundary">\n' +
    '			<div class="settings-mobile-header" >\n' +
    '				<div class="mobile-avatar-container profile-avatar" image-load>\n' +
    '					<img ng-src="{{appCenterCtrl.user.imageURL}}" ng-show="appCenterCtrl.user.imageURL" class="icon-mobile-image"/>\n' +
    '				</div>\n' +
    '				<p class="settings-name">{{\'fullname\' | i18n : appCenterCtrl.user.firstName : appCenterCtrl.user.lastName}}</p>\n' +
    '				<p class="settings-emailaddress">{{::appCenterCtrl.user.emailAddress}}</p>\n' +
    '				<p class="settings-username">{{::appCenterCtrl.user.userName}}</p>\n' +
    '			</div>\n' +
    '\n' +
    '			<ul class="settings-nav">\n' +
    '				<li class="nav-account-link" ng-show="!appCenterCtrl.isAWJade" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'account\'}">\n' +
    '					<a title="{{\'userInfo.account\' | i18n}}" ng-click="settingsCtrl.subPageNavigate(\'account\')"><p>{{\'userInfo.account\' | i18n}}</p>\n' +
    '						<svg svg-symbol="icon-caret-right"></svg>\n' +
    '					</a>\n' +
    '				</li>\n' +
    '				<li ng-if="::!appCenterCtrl.isAWJadeMobile && !appCenterCtrl.mdmOnlyWS1" class="nav-devices-link" id="pt-leftnav-devices" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'devices\'}">\n' +
    '					<a title="{{\'userInfo.devices\' | i18n}}" ng-click="settingsCtrl.subPageNavigate(\'devices\')"><p>{{\'userInfo.devices\' | i18n}}</p>\n' +
    '						<svg svg-symbol="icon-caret-right"></svg>\n' +
    '					</a>\n' +
    '				</li>\n' +
    '				<li ng-hide="::appCenterCtrl.isAWJadeMobile" class="nav-about-app-tips" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'tips\'}">\n' +
    '					<a title="{{\'userInfo.tips\' | i18n}}" id="settings-leftnav-app-tips" ng-click="settingsCtrl.subPageNavigate(\'tips\')"><p>{{\'userInfo.tips\' | i18n}}</p>\n' +
    '						<svg svg-symbol="icon-caret-right"></svg>\n' +
    '					</a>\n' +
    '				</li>\n' +
    '				<li ng-if="::!appCenterCtrl.isAWJadeMobile" class="nav-about-link" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'about\'}" >\n' +
    '					<a title="{{\'userInfo.about\' | i18n}}" id="settings-leftnav-about" ng-click="settingsCtrl.subPageNavigate(\'about\')"><p>{{\'userInfo.about\' | i18n}}</p>\n' +
    '						<svg svg-symbol="icon-caret-right"></svg>\n' +
    '					</a>\n' +
    '				</li>\n' +
    '				<li ng-if="::appCenterCtrl.isAWJadeMobile" class="nav-about-native-link" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'about\'}"  ng-click="::settingsCtrl.nativeAbout()">\n' +
    '					<p>{{\'userInfo.about\' | i18n}}</p>\n' +
    '					<svg svg-symbol="icon-caret-right"></svg>\n' +
    '				</li>\n' +
    '				<li ng-if="::appCenterCtrl.isAWJadeMobile && appCenterCtrl.inAppNotificationEnabled && settingsCtrl.showNotificationTab" class="nav-notifications-native-link" ng-click="::settingsCtrl.nativeNotification()">\n' +
    '					<span>{{\'userInfo.notifications\' | i18n}}</span>\n' +
    '					<svg svg-symbol="icon-caret-right"></svg>\n' +
    '				</li>\n' +
    '				<li class="nav-preferences-link" ng-show="!appCenterCtrl.isAWJadeMobile" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'preferences\'}"  >\n' +
    '					<a title="{{\'userInfo.preferences\' | i18n}}" id="settings-leftnav-preferences" ng-click="settingsCtrl.subPageNavigate(\'preferences\')" class="pt-nav-preferences"\n' +
    '						<p>{{\'userInfo.preferences\' | i18n}}</p>\n' +
    '						<svg svg-symbol="icon-caret-right"></svg>\n' +
    '					</a>\n' +
    '				</li>\n' +
    '				<li class="nav-termsofuse-link" id="pt-nav-termsofuse" ng-if="appCenterCtrl.isAWJadeMobile && appCenterCtrl.isTermsOfUseEnabled" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'termsofuse\'}">\n' +
    '					<a ng-click="settingsCtrl.subPageNavigate(\'termsofuse\')"><p>{{\'userInfo.termsofuse\' | i18n}}</p>\n' +
    '						<svg svg-symbol="icon-caret-right"></svg>\n' +
    '					</a>\n' +
    '				</li>\n' +
    '				<li class="nav-signout-link" id="pt-nav-signout" ng-show="appCenterCtrl.isBrowser || appCenterCtrl.isWindowsJade" ng-click="appCenterCtrl.signout($event)">\n' +
    '					<p>{{\'userInfo.signout\' | i18n}}</p>\n' +
    '				</li>\n' +
    '				<li class="nav-removeaccount-link" id="pt-nav-removeaccount" ng-if="appCenterCtrl.isAWJadeMobile && !appCenterCtrl.isWindowsJade && settingsCtrl.removeAccountOrSignOutEnabled" ng-click="appCenterCtrl.unEnrollConfirm($event)">\n' +
    '					<p>{{\'userInfo.removeAccount\'| i18n}}</p>\n' +
    '				</li>\n' +
    '			</ul>\n' +
    '	</div>\n' +
    '</article>\n' +
    '\n' +
    '<!--in order to get the 100% height from the device, and also to animate from right without shifting the content container, the detail panels will have to be outside of the content-container\n' +
    '     This make it difficult to use a directive and use ng-transclent-->\n' +
    '<div class="settings-details-container" ng-if="!appCenterCtrl.isAWJadeDesktop" ng-hide="appCenterCtrl.isAWJadeDocked && appCenterCtrl.isAWJadeWithNativenav">\n' +
    '	<div class="settings-back-button" ng-click="::appCenterCtrl.backAction()">\n' +
    '		<svg svg-symbol="icon-detail-back" class="icon-setting-close-button"></svg>\n' +
    '		<span>{{\'app.settings.link.back\' | i18n}}</span>\n' +
    '	</div>\n' +
    '	<section class="settings-detail settings-account" ng-include="\'app-v2/settings/account.html\'"  ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'account\'}">\n' +
    '\n' +
    '	</section>\n' +
    '	<section class="settings-detail settings-about" id="pt-settings-about-detail" ng-include="\'app-v2/settings/about.html\'" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'about\'}">\n' +
    '\n' +
    '	</section>\n' +
    '\n' +
    '	<section class="settings-detail settings-devices" ng-include="\'app-v2/common/devices.html\'" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'devices\'}">\n' +
    '    </section>\n' +
    '\n' +
    '	<section class="settings-detail settings-tips" id="pt-settings-about-app-tips" ng-include="\'app-v2/settings/tipsDesktop.html\'" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'tips\'}" ng-controller="AppTipsController as appTipsCtrl" >\n' +
    '	</section>\n' +
    '\n' +
    '	<section class="settings-detail settings-preferences" ng-include="\'app-v2/settings/preferences.html\'" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'preferences\'}" ng-controller="PreferencesController as preferencesCtrl">\n' +
    '\n' +
    '	</section>\n' +
    '	<section class="settings-detail settings-termsofuse" ng-include="\'app-v2/settings/termsofuse.html\'" ng-class="{\'is-selected\': settingsCtrl.settingActiveTab == \'termsofuse\'}">\n' +
    '	</section>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '<article class="settings-nativenav content-container-scrollable" ng-if="appCenterCtrl.isAWJadeDesktop || (appCenterCtrl.isAWJadeDocked && appCenterCtrl.isAWJadeWithNativenav)">\n' +
    '	<div class="content width-boundary">\n' +
    '		<div class="settings-mobile-header">\n' +
    '			<div class="desktopapp-native-avatar-container profile-avatar" image-load>\n' +
    '				<img ng-src="{{appCenterCtrl.user.imageURL}}" ng-show="appCenterCtrl.user.imageURL" class="icon-mobile-image"/>\n' +
    '			</div>\n' +
    '			<p class="settings-name">{{\'fullname\' | i18n : appCenterCtrl.user.firstName : appCenterCtrl.user.lastName}}</p>\n' +
    '			<p class="settings-username">{{::\'userInfo.profile.username\' | i18n}} {{::appCenterCtrl.user.userName}}</p>\n' +
    '			<p class="settings-emailaddress">{{::appCenterCtrl.user.emailAddress}}</p>\n' +
    '		</div>\n' +
    '		<ul class="nativenav-settings-nav">\n' +
    '			<li class="nav-about-devices-link" ng-if="!appCenterCtrl.hideDevicesTab" ng-click="settingsCtrl.openDeviceListForDesktopappNativenav()" id="pt-desktopapp-nativenav-devices">\n' +
    '				<span>{{\'userInfo.devices\' | i18n}}</span>\n' +
    '			</li>\n' +
    '			<li class="nav-about-native-link" ng-click="settingsCtrl.nativeAbout()" id="pt-desktopapp-nativenav-about">\n' +
    '				<span>{{\'userInfo.about\' | i18n}}</span>\n' +
    '			</li>\n' +
    '			<li class="nav-termsofuse-link" ng-if="appCenterCtrl.isTermsOfUseEnabled" ng-click="settingsCtrl.termsOfUseForDesktopAppNativenav()" id="pt-desktopapp-nativenav-termsofuse">\n' +
    '				<span>{{\'userInfo.termsofuse\' | i18n}}</span>\n' +
    '			</li>\n' +
    '			<li class="nav-signout-link align-right" ng-if="!(appCenterCtrl.isAWJadeDocked && appCenterCtrl.isAWJadeWithNativenav)" ng-click="appCenterCtrl.signoutNativenav($event)" id="pt-desktopapp-nativenav-signout">\n' +
    '				<span>{{\'userInfo.signout\' | i18n}}</span>\n' +
    '			</li>\n' +
    '			<li class="nav-removeaccount-link" id="pt-nav-removeaccount-docked" ng-if="appCenterCtrl.isAWJadeMobile && appCenterCtrl.isAWJadeDocked && settingsCtrl.removeAccountOrSignOutEnabled" ng-click="appCenterCtrl.unEnrollConfirm($event)">\n' +
    '				<p>{{\'userInfo.removeAccount\'| i18n}}</p>\n' +
    '			</li>\n' +
    '		</ul>\n' +
    '	</div>\n' +
    '</article>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/signoutnativenav-confirm.html',
    '<div modal-new class="modal-fullscreen modal-settings-nativenav">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header no-symbol">\n' +
    '            <h2 class="settings-desktopapp-nativenav-heading">{{ ::\'app.logout.title\' | i18n }}</h2>\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.cancel(); $event.stopPropagation();"></svg>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p class="settings-desktopapp-nativenav-message">{{ ::\'app.logout.confirm.msg\' | i18n }}</p>\n' +
    '            <p class="settings-desktopapp-nativenav-actions">\n' +
    '                <span class="button-action-desktopapp secondary-button" ng-click="$modal.cancel(); $event.stopPropagation();">\n' +
    '                {{ ::\'button.cancel\' | i18n }}\n' +
    '                </span>\n' +
    '                <span class="button-action-desktopapp primary-button" ng-click="$modal.close();">\n' +
    '                {{ ::\'userInfo.signout\' | i18n }}\n' +
    '                </span>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/termsofuse-desktopapp-nativenav.html',
    '<div modal-new class="modal-fullscreen modal-settings-nativenav">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header no-symbol">\n' +
    '            <h2 class="settings-desktopapp-nativenav-heading">{{::\'userInfo.termsofuse\' | i18n}}</h2>\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '        </header>\n' +
    '\n' +
    '        <div class="dialog-body">\n' +
    '            <div id="tou-data" class="tou-values tou-data" ng-if="appCenterCtrl.touContent">\n' +
    '                <p class="tou-content" ng-bind-html="appCenterCtrl.touContent"></p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '    <div ng-show="!appCenterCtrl.touContent" class="tou-loading">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/termsofuse-desktopapp.html',
    '<div modal-new class="modal-termsofuse">\n' +
    '    <section class="dialog-container">\n' +
    '        <header class="dialog-header no-symbol">\n' +
    '            <h2>{{::\'userInfo.termsofuse\' | i18n}}</h2>\n' +
    '            <svg svg-symbol="icon-close-popup" class="modal-popup-close-icon" ng-click="$modal.close()"></svg>\n' +
    '        </header>\n' +
    '\n' +
    '        <div class="dialog-body">\n' +
    '            <div id="tou-data" class="tou-values tou-data" ng-if="appCenterCtrl.touContent">\n' +
    '                <p class="tou-content" ng-bind-html="appCenterCtrl.touContent"></p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '    <div ng-show="!appCenterCtrl.touContent" class="tou-loading">\n' +
    '        <div ng-include="\'app-v2/common/spinner.html\'"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/termsofuse.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <h2>{{\'userInfo.termsofuse\' | i18n}}</h2>\n' +
    '        <div class="settings-back settings-termsofuse-button" id="pt-settings-tou-back" ng-click="::settingsCtrl.dismissSettingsDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable">\n' +
    '        <div class="settings-detail-content">\n' +
    '            <div id="tou-header" class="tou-values tou-header">{{\'userInfo.termsofuse\' | i18n}}</div>\n' +
    '            <div id="tou-data" class="tou-values tou-data" ng-if="settingsCtrl.touContent">\n' +
    '                <p class="tou-content" ng-bind-html="::settingsCtrl.touContent"></p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/settings/tipsDesktop.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back settings-account-button" ng-click="::settingsCtrl.dismissSettingsDetail()" id="pt-settings-about-app-tips-back">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'userInfo.tips\' | i18n}}</h2>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable" ng-controller="AppTipsController as appTipsCtrl">\n' +
    '        <div class="settings-detail-content setting-app-tips-content">\n' +
    '            <!-- this section serves desktop browser and mobile tablet browser excluding phones -->\n' +
    '            <div ng-hide="appTipsCtrl.device ==\'phone\'" class="setting-tips-desktop">\n' +
    '                <div class="section-container">\n' +
    '                    <h2 class="settings-detail-title">{{::\'userInfo.tips.title\' | i18n}}</h2>\n' +
    '                    <p>{{::\'userInfo.tips.intro\' | i18n}}</p>\n' +
    '                    <h3>{{::\'userInfo.tips.bookmarks\' | i18n}}</h3>\n' +
    '\n' +
    '                    <div class="subsection-container" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'">\n' +
    '                        <p class="tips-section-header">{{::\'userInfo.tips.desktop\' | i18n}}</p>\n' +
    '                        <p>{{::\'userInfo.tips.bookmarks.desktop1\' | i18n}}</p>\n' +
    '                        <p>{{::\'userInfo.tips.bookmarks.desktop2\' | i18n}}</p>\n' +
    '                        <p ng-include="\'app-v2/svgincludes/tips-bookmarks-desktop.html\'" class="illo-tips-bookmarks-desktop"></p>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="subsection-container desktop-rearrange" id="pt-tips-bookmark-reordering" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'">\n' +
    '                        <p class="tips-section-header">\n' +
    '                            {{::\'userInfo.tips.reordering.title\' | i18n}}\n' +
    '                        </p>\n' +
    '                        <p>{{::\'userInfo.tips.reordering.text1\' | i18n}}</p>\n' +
    '                        <p>{{::\'userInfo.tips.reordering.text2\' | i18n}}</p>\n' +
    '                        <p>{{::\'userInfo.tips.reordering.text3\' | i18n}}</p>\n' +
    '                        <p class="tips-desktop-rearrange">\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-rearrange.html\'" class="illo-tips-rearrange"></ng-include>\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-rearrange2.html\'" class="illo-tips-rearrange"></ng-include>\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-rearrange3.html\'" class="illo-tips-rearrange"></ng-include>\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="subsection-container">\n' +
    '                        <p class="tips-section-header mobile-devices">{{::\'userInfo.tips.mobile\' | i18n}}</p>\n' +
    '                        <p>{{::\'userInfo.tips.bookmarks.mobile\' | i18n}}</p>\n' +
    '                        <p class="tips-device tips-mobile-bookmarks">\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-bookmarks-phone.html\'" class="illo-tips-bookmarks-phone" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'"></ng-include>\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-bookmarks-tablet.html\'" class="illo-tips-bookmarks-tablet"></ng-include>\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <h3>{{::\'userInfo.tips.catalog\' | i18n}}</h3>\n' +
    '\n' +
    '                    <div class="subsection-container" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'">\n' +
    '                        <p class="tips-section-header">{{::\'userInfo.tips.desktop\' | i18n}}</p>\n' +
    '                        <p ng-bind-html="::appTipsCtrl.tipsDesktopCatalogText1"></p>\n' +
    '                        <p>{{::\'userInfo.tips.catalog.desktop2\' | i18n}}</p>\n' +
    '                        <ng-include src="\'app-v2/svgincludes/tips-catalog-desktop.html\'" class="illo-tips-catalog-desktop"></ng-include>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="subsection-container tips-catalog-mobile">\n' +
    '                        <p class="tips-section-header mobile-devices">{{::\'userInfo.tips.mobile\' | i18n}}</p>\n' +
    '                        <p ng-bind-html="::appTipsCtrl.tipsDesktopCatalogMobileText1"></p>\n' +
    '                        <p ng-bind-html="::appTipsCtrl.tipsDesktopCatalogMobileText2"></p>\n' +
    '                        <p ng-bind-html="::appTipsCtrl.tipsDesktopCatalogMobileText3 "></p>\n' +
    '                        <p class="tips-device" id="pt-illo-catalog-phone" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'">\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-catalog-actions-phone.html\'" class="illo-tips-catalog-phone"></ng-include>\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-catalog-install-phone.html\'" class="illo-tips-catalog-phone"></ng-include>\n' +
    '                        </p>\n' +
    '                        <p class="tips-device" id="pt-illo-catalog-tablet">\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-catalog-actions-tablet.html\'" class="illo-tips-catalog-tablet"></ng-include>\n' +
    '                            <ng-include src="\'app-v2/svgincludes/tips-catalog-install-tablet.html\'" class="illo-tips-catalog-tablet"></ng-include>\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div ng-if="appCenterCtrl.showPeopleTab">\n' +
    '                        <h3><svg svg-symbol="icon-newtips" class="tips-inlineicon"></svg> {{::\'userInfo.tips.people\' | i18n}}</h3>\n' +
    '\n' +
    '                        <div class="subsection-container" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'">\n' +
    '                            <p class="tips-section-header">{{::\'userInfo.tips.desktop\' | i18n}}</p>\n' +
    '                            <p ng-bind-html="::appTipsCtrl.tipsDesktopPeopleMobileText1" class="text-inline-svg"></p>\n' +
    '                            <p ng-include="\'app-v2/svgincludes/tips-people-desktop.html\'" class="illo-tips-people-desktop"></p>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="subsection-container tips-people-mobile">\n' +
    '                            <p class="tips-section-header mobile-devices">{{::\'userInfo.tips.mobile\' | i18n}}</p>\n' +
    '                            <p ng-bind-html="::appTipsCtrl.tipsDesktopPeopleMobileText1" class="text-inline-svg"></p>\n' +
    '                            <p class="tips-device">\n' +
    '                                <ng-include src="\'app-v2/svgincludes/tips-people-phone.html\'" class="illo-tips-bookmarks-phone" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'"></ng-include>\n' +
    '                                <ng-include src="\'app-v2/svgincludes/tips-people-tablet.html\'" class="illo-tips-bookmarks-tablet"></ng-include>\n' +
    '                            </p>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div ng-if="appCenterCtrl.inAppNotificationEnabled">\n' +
    '                        <h3><svg svg-symbol="icon-newtips" class="tips-inlineicon"></svg> {{::\'userInfo.tips.notification\' | i18n}}</h3>\n' +
    '\n' +
    '                        <div class="subsection-container" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'">\n' +
    '                            <p class="tips-section-header">{{::\'userInfo.tips.desktop\' | i18n}}</p>\n' +
    '                            <p ng-bind-html="::appTipsCtrl.tipsDesktopNotificationMobileText1" class="text-inline-svg"></p>\n' +
    '                            <p ng-include="\'app-v2/svgincludes/tips-notification-desktop.html\'" class="illo-tips-notification-desktop"></p>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="subsection-container tips-notification-mobile">\n' +
    '                            <p class="tips-section-header mobile-devices">{{::\'userInfo.tips.mobile\' | i18n}}</p>\n' +
    '                            <p ng-bind-html="::appTipsCtrl.tipsDesktopNotificationMobileText1" class="text-inline-svg"></p>\n' +
    '                            <p class="tips-device">\n' +
    '                                <ng-include src="\'app-v2/svgincludes/tips-notification-phone.html\'" class="illo-tips-bookmarks-phone" ng-hide="appTipsCtrl.device ==\'non-windows-tablet-browser\'"></ng-include>\n' +
    '                                <ng-include src="\'app-v2/svgincludes/tips-notification-tablet.html\'" class="illo-tips-bookmarks-tablet"></ng-include>\n' +
    '                            </p>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <!-- this section serves mobile phone browsers -->\n' +
    '            <div ng-if="appTipsCtrl.device ==\'phone\'" class="tips-mobile-phone-browser">\n' +
    '                <ul rn-carousel rn-carousel-controls class="settings-tips-carousel-phone">\n' +
    '                    <li class="apptips-item" ng-repeat= "tip in carouselPhoneImages" ng-class="{\'active\': carouselIndex === $index}">\n' +
    '                        <ng-include src="tip.svglink"></ng-include>\n' +
    '                        <h3>{{tip[\'header\'] | i18n}}</h3>\n' +
    '                        <p ng-bind-html="tip[\'message\']" class="text-inline-svg"></p>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/support/changePasswordMobile.html',
    '<div class="settings-detail-content-container modal-changepassword mobile" ng-controller="ChangePasswordController as cpCtrl">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back" id="pt-support-password-button"\n' +
    '             ng-click="::supportCtrl.dismissSupportDetail();cpCtrl.closePasswordForm()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'app.changePassword.title\' | i18n}}</h2>\n' +
    '        <button class="support-header-button primary password-save-button" ng-click="cpCtrl.changePasswordConfirm($event)" ng-disabled="changePasswordForm.$invalid">{{:: \'button.save\' | i18n }}</button>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable">\n' +
    '        <div class="password-container support-changepassword">\n' +
    '            <form name="changePasswordForm" novalidate>\n' +
    '                <div class="error-messages">\n' +
    '                    <svg ng-show="cpCtrl.showErrors || cpCtrl.errorMessage" class="icon-password-error" svg-symbol="icon-notify-error"></svg>\n' +
    '                    <span class="server-errors" ng-show="cpCtrl.showErrors" ng-repeat="error in cpCtrl.errorMessages">{{ error.description }}&nbsp;</span>\n' +
    '                    <span class="mismatch-error" ng-show="cpCtrl.errorMessage">{{cpCtrl.errorMessage}}</span>\n' +
    '                </div>\n' +
    '                <div class="input-placeholder-animate">\n' +
    '                    <input class="input-password-field"\n' +
    '                           id="pt-mobile-password-input"\n' +
    '                           type="{{cpCtrl.currentInputType}}"\n' +
    '                           ng-model="cpCtrl.currentPassword"\n' +
    '                           required\n' +
    '                           disable-copy-paste />\n' +
    '                    <label>{{:: \'app.passwordPolicy.label.currentpassword\' | i18n}}</label>\n' +
    '                    <button ng-show="cpCtrl.currentPassword" class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'current\')">\n' +
    '                        <svg ng-if="!cpCtrl.showCurrentPassword" svg-symbol="icon-show-password"></svg>\n' +
    '                        <svg ng-if="cpCtrl.showCurrentPassword" svg-symbol="icon-hide-password"></svg>\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <div class="input-placeholder-animate">\n' +
    '                    <input class="input-password-field"\n' +
    '                           ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                           type="{{cpCtrl.newInputType1}}"\n' +
    '                           ng-model="cpCtrl.newPassword"\n' +
    '                           required\n' +
    '                           disable-copy-paste />\n' +
    '                    <label>{{:: \'app.passwordPolicy.label.newpassword\' | i18n}}</label>\n' +
    '                    <button ng-show="cpCtrl.newPassword" class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'new1\')">\n' +
    '                        <svg ng-if="!cpCtrl.showNewPassword1" svg-symbol="icon-show-password"></svg>\n' +
    '                        <svg ng-if="cpCtrl.showNewPassword1" svg-symbol="icon-hide-password"></svg>\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <div class="input-placeholder-animate">\n' +
    '                    <input class="input-password-field"\n' +
    '                           ng-class="{\'error\' : cpCtrl.errorMessage}"\n' +
    '                           type="{{cpCtrl.newInputType2}}"\n' +
    '                           ng-model="cpCtrl.confirmNewPassword"\n' +
    '                           required\n' +
    '                           disable-copy-paste />\n' +
    '                    <label>{{:: \'app.passwordPolicy.label.confirmpassword\' | i18n}}</label>\n' +
    '                    <button ng-show="cpCtrl.confirmNewPassword" class="reveal-password-button" ng-click="cpCtrl.togglePassword(\'new2\')">\n' +
    '                        <svg ng-if="!cpCtrl.showNewPassword2" svg-symbol="icon-show-password"></svg>\n' +
    '                        <svg ng-if="cpCtrl.showNewPassword2" svg-symbol="icon-hide-password"></svg>\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '            </form>\n' +
    '        </div>\n' +
    '        <div ng-show="cpCtrl.policies" class="policy-container-mobile">\n' +
    '            <div class="password-policy">\n' +
    '                <p class="password-requirement-title">{{:: \'app.passwordPolicy.passwordRequirements\' | i18n}}</p>\n' +
    '                <p ng-bind-html="cpCtrl.policyString"></p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/support/reportProblems.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back" id="pt-support-report-button"\n' +
    '             ng-click="::supportCtrl.dismissSupportDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'appCenter.support.sendReportTitle\' | i18n }}</h2>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable">\n' +
    '        <section id="report-ios-problems" ng-if="supportCtrl.isIOS">\n' +
    '            <p ng-include="\'app-v2/svgincludes/illo-shake.html\'"></p>\n' +
    '            <p>{{::\'appCenter.reportProblems.ios.sendLogInstruction\' | i18n}}</p>\n' +
    '            <p>{{::\'appCenter.reportProblems.ios.turnOnOffInstruction\' | i18n}}</p>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/support/support.html',
    '<article class="support content-container-scrollable">\n' +
    '    <div class="content width-boundary">\n' +
    '        <section class="content-body">\n' +
    '            <section id="self-service" ng-if="appCenterCtrl.passwordChangeEnabled || !supportCtrl.hideDevicesTab">\n' +
    '                <p class="section-title">{{\'appCenter.support.selfservice\' | i18n}}</p>\n' +
    '                <a ng-href="#/support/change-password" class="support-item change-password" ng-if="appCenterCtrl.passwordChangeEnabled">\n' +
    '                    <svg svg-symbol="icon-caret-right"></svg>\n' +
    '                    <p class="support-item-title">{{::\'appCenter.support.managepassword\' | i18n}}</p>\n' +
    '                    <p class="support-item-desc">{{::\'appCenter.support.managepasswordtext\' | i18n}}</p>\n' +
    '                </a>\n' +
    '                <a ng-href="#/support/devices" class="support-item manage-devices" ng-if="!supportCtrl.hideDevicesTab">\n' +
    '                    <svg svg-symbol="icon-caret-right"></svg>\n' +
    '                    <p class="support-item-title">{{::\'appCenter.support.managedevices\' | i18n}}</p>\n' +
    '                    <p class="support-item-desc">{{::\'appCenter.support.managedevicestext\' | i18n}}</p>\n' +
    '                </a>\n' +
    '            </section>\n' +
    '\n' +
    '            <section id="get-help">\n' +
    '                <p class="section-title">{{::\'appCenter.support.gethelp\' | i18n}}</p>\n' +
    '                <a ng-href="#/support/tips-mobile" class="support-item app-tips" id="pt-support-apptips">\n' +
    '                    <svg svg-symbol="icon-caret-right"></svg>\n' +
    '                    <p class="support-item-title">{{::\'userInfo.tips\' | i18n}}</p>\n' +
    '                    <p class="support-item-desc">{{::\'userInfo.tips.intro\' | i18n}}</p>\n' +
    '                </a>\n' +
    '                <a ng-href="#/support/report-problems" class="support-item report-problems" id="send-report" ng-if="supportCtrl.isIOS">\n' +
    '                    <svg svg-symbol="icon-caret-right"></svg>\n' +
    '                    <p class="support-item-title">{{::\'appCenter.support.sendReportTitle\' | i18n}}</p>\n' +
    '                    <p class="support-item-desc">{{::\'appCenter.support.sendReportDetails\' | i18n}}</p>\n' +
    '                </a>\n' +
    '            </section>\n' +
    '        </section>\n' +
    '    </div>\n' +
    '</article>\n' +
    '\n' +
    '<!--in order to get the 100% height from the device, and also to animate from right without shifting the content container, the detail panels will have to be outside of the content-container\n' +
    '     This make it difficult to use a directive and use ng-transclent-->\n' +
    '<div class="support-details-container">\n' +
    '    <section class="settings-detail support-change-password" ng-include="\'app-v2/support/changePasswordMobile.html\'" ng-class="{\'is-selected\': supportCtrl.settingActiveTab == \'change-password\'}"></section>\n' +
    '    <section class="settings-detail support-devices" ng-include="\'app-v2/common/devices.html\'"  ng-class="{\'is-selected\': supportCtrl.settingActiveTab == \'devices\'}"></section>\n' +
    '    <section class="settings-detail support-app-tips" ng-include="\'app-v2/support/tipsMobileApp.html\'" ng-class="{\'is-selected\': supportCtrl.settingActiveTab == \'tips-mobile\'}"></section>\n' +
    '    <section class="settings-detail support-report-problems" ng-include="\'app-v2/support/reportProblems.html\'" ng-class="{\'is-selected\': supportCtrl.settingActiveTab == \'report-problems\'}"></section>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/support/tipsMobileApp.html',
    '<div class="settings-detail-content-container">\n' +
    '    <div class="settings-detail-mobile-header">\n' +
    '        <div class="settings-back" id="pt-support-tips-button"\n' +
    '             ng-click="::supportCtrl.dismissSupportDetail()">\n' +
    '            <svg svg-symbol="icon-page-back" class="icon-page-back"></svg>\n' +
    '        </div>\n' +
    '        <h2>{{::\'userInfo.tips\' | i18n}}</h2>\n' +
    '    </div>\n' +
    '    <div class="settings-detail-content-scrollable" ng-controller="AppTipsController as appTipsCtrl">\n' +
    '        <div class="settings-detail-content setting-app-tips-content">\n' +
    '            <div ng-if="appTipsCtrl.device ==\'phone\'" class="carousel-container" id="pt-support-apptips-carousel-phone">\n' +
    '                <ul rn-carousel rn-carousel-controls class="settings-tips-carousel-phone">\n' +
    '                    <li class="apptips-item" ng-repeat= "tip in carouselPhoneImages" ng-class="{\'active\': carouselIndex === $index}">\n' +
    '                        <ng-include src="tip.svglink"></ng-include>\n' +
    '                        <h3>{{ tip[\'header\'] | i18n}}</h3>\n' +
    '                        <p ng-bind-html="tip[\'message\']" class="text-inline-svg"></p>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '\n' +
    '            <div ng-if="appTipsCtrl.device ==\'tablet\'" class="carousel-container" id="pt-support-apptips-carousel-tablet">\n' +
    '                <ul rn-carousel rn-carousel-controls class="settings-tips-carousel-tablet">\n' +
    '                    <li class="apptips-item" ng-repeat= "tip in carouselTabletImages" ng-class="{\'active\': carouselIndex === $index}">\n' +
    '                        <ng-include src="tip.svglink"></ng-include>\n' +
    '                        <h3>{{ tip[\'header\'] | i18n}}</h3>\n' +
    '                        <p ng-bind-html="tip[\'message\']" class="text-inline-svg"></p>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes-hub/hub-no-apps.html',
    '<svg id="hub-no-apps" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">\n' +
    '    <g class="primary-items">\n' +
    '        <path d="M28.78,173.66l7.57-13a19.48,19.48,0,0,1,17.46-10.83H211.36a19.48,19.48,0,0,1,17.26,10.44L236,172.38" transform="translate(-0.25 -0.25)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '    <g class="secondary-items">\n' +
    '        <path d="M173.53,212.53H92.13a29,29,0,0,1-29-29.05V81.77a23.49,23.49,0,0,1,6.69-16.42L99.88,34.51a23.5,23.5,0,0,1,16.82-7.09h56.83a29.05,29.05,0,0,1,29.05,29.05v127A29,29,0,0,1,173.53,212.53Z" transform="translate(-0.25 -0.25)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4" stroke-dasharray="12.16 12.16"/>\n' +
    '        <line x1="91.41" y1="71.4" x2="173.75" y2="71.4" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="91.41" y1="88.5" x2="157.47" y2="88.5" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="91.41" y1="105.6" x2="142.55" y2="105.6" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '    <g class="primary-items">\n' +
    '        <path d="M228.46,168.61h-49a8.85,8.85,0,0,0-8.42,5.87,40.41,40.41,0,0,1-76.5,0,8.84,8.84,0,0,0-8.42-5.87h-49a9.54,9.54,0,0,0-9.54,9.54v44.39a9.54,9.54,0,0,0,9.54,9.54H228.46a9.54,9.54,0,0,0,9.54-9.54V178.15A9.54,9.54,0,0,0,228.46,168.61Z" transform="translate(-0.25 -0.25)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <circle cx="132.58" cy="153.25" r="24.39" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="132.58" y1="138" x2="132.58" y2="155.87" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="132.75" y1="163.75" x2="132.76" y2="163.75" stroke-linecap="round" stroke-miterlimit="10" stroke-width="6"/>\n' +
    '    </g>\n' +
    '    <g class="secondary-items">\n' +
    '        <line x1="252.74" y1="78.62" x2="245.69" y2="87.06" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="253.44" y1="86.37" x2="245" y2="79.32" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="32.47" y1="45.45" x2="21.96" y2="42.23" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="25.61" y1="49.1" x2="28.83" y2="38.59" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="12.74" y1="139.32" x2="11.69" y2="128.37" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="6.74" y1="134.37" x2="17.69" y2="133.31" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes-hub/hub-no-search-results.html',
    '<svg id="hub-no-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">\n' +
    '    <g class="secondary-items">\n' +
    '        <line x1="20.38" y1="114.21" x2="14.21" y2="127.42" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="23.9" y1="123.9" x2="10.69" y2="117.73" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="220.65" y1="137.53" x2="214.49" y2="150.74" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="224.18" y1="147.22" x2="210.96" y2="141.05" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="127.67" y1="16.7" x2="113.09" y2="16.7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="120.38" y1="23.99" x2="120.38" y2="9.41" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M229.76,25.4V78.9a12.24,12.24,0,0,1-12.24,12.23h-5.25" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M171,60.18V36.06a9.93,9.93,0,0,1,2.82-6.92l12.68-13a9.89,9.89,0,0,1,7.09-3h23.93a12.24,12.24,0,0,1,7.77,2.77" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M200.21,91.13h-17A12.24,12.24,0,0,1,171,78.9V71" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="183.04" y1="31.79" x2="217.72" y2="31.79" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="183.04" y1="51.48" x2="204.58" y2="51.48" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="183.04" y1="41.64" x2="210.87" y2="41.64" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M37.62,79.78a28.88,28.88,0,0,0,32.57,0" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>\n' +
    '        <path d="M70.19,79.78a28.91,28.91,0,1,0-32.57,0" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M37.62,79.78a16.29,16.29,0,0,1,32.57,0" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>\n' +
    '        <circle id="head" cx="53.91" cy="46.27" r="9.64" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '    <g class="primary-items">\n' +
    '        <path d="M91.22,194.38H82.76a21.19,21.19,0,0,1-21.18-21.19V90.42A21.19,21.19,0,0,1,82.76,69.24h58.45" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M156,69.24h9.49a21.18,21.18,0,0,1,21.18,21.18v82.77a21.19,21.19,0,0,1-21.18,21.19H109.17" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <circle cx="124.15" cy="131.81" r="32.73" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M138.33,125.18l-16.91,17.08a.66.66,0,0,1-.94,0l-7.69-7.69" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <circle id="searchglass-circle" cx="176.7" cy="187.22" r="28.18" />\n' +
    '        <circle cx="176.7" cy="187.22" r="28.18" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M176.7,204.62a17.4,17.4,0,0,1-17.41-17.4" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="196.61" y1="207.13" x2="201.6" y2="212.12" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <rect x="205.79" y="208.79" width="8.76" height="23.8" rx="2.9" ry="2.9" transform="translate(-94.49 213.25) rotate(-45)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '    <g class="secondary-items">\n' +
    '        <path d="M32.14,161.29l3.79-3.08a16.41,16.41,0,0,1,20.7,0L76.06,174a10.23,10.23,0,0,1,3.77,7.92v27.93a9.78,9.78,0,0,1-9.78,9.78H59.66" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M45.89,219.6H22.51a9.78,9.78,0,0,1-9.78-9.78V181.89A10.23,10.23,0,0,1,16.5,174L23,168.71" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M77.08,216.75,52.76,198.12a10.62,10.62,0,0,0-12.95,0L15.62,216.75" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="39.51" y1="198.36" x2="12.87" y2="180.27" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="53.13" y1="198.4" x2="79.83" y2="180.27" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes-hub/hub-notification-all-caughtup.html',
    '<svg id="hub-notifications-all-caughtup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">\n' +
    '    <g class="secondary-items">\n' +
    '        <path d="M197.43,226.12h43.29a6.91,6.91,0,0,0,6.95-6.25q.06-.76.06-1.53a19.61,19.61,0,0,0-3.24-10.83" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M163.89,208.23a17.07,17.07,0,0,0-4.08,11.09v.07a6.91,6.91,0,0,0,7,6.74H190" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M175.17,202.27a17,17,0,0,0-5.73,1.64" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M238.55,201.68A19.73,19.73,0,0,0,228,198.63h0a27,27,0,0,0-25.16-20.07" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M24.73,83.87H19a6.91,6.91,0,0,1-7-6.26Q12,76.86,12,76.08a19.62,19.62,0,0,1,4.92-13" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M21.31,59.57A19.71,19.71,0,0,1,32.7,56h0A27,27,0,0,1,47.15,38.5" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="54.68" y1="83.45" x2="33.4" y2="83.45" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M53.92,36.31A26.94,26.94,0,0,1,85.52,59.6a17.15,17.15,0,0,1,12.71,7.9" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M170.43,105h18.88a13.5,13.5,0,0,1,13.51,13.49" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="87.07" y1="172.25" x2="87.07" y2="161.22" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M131.37,198.17H100.58a13.49,13.49,0,0,1-13.51-13.48v-2.56" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="23.68" y1="110.4" x2="18.95" y2="120.52" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="26.39" y1="117.83" x2="16.24" y2="113.1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="56.76" y1="193.2" x2="52.03" y2="203.32" fstroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="59.47" y1="200.62" x2="49.32" y2="195.89" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="109.97" y1="42.05" x2="98.78" y2="42.05" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="104.37" y1="47.64" x2="104.37" y2="36.46" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M202.82,132.84v71A7.8,7.8,0,0,1,191,210.53L173.59,200.1a13.54,13.54,0,0,0-7-1.93H131.37" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '    <g class="primary-items">\n' +
    '        <path d="M68.19,67.5A13.5,13.5,0,0,0,54.68,81v24.34" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M170.43,131.78V81a13.49,13.49,0,0,0-13.5-13.49H68.42" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M156.93,160.67a13.49,13.49,0,0,0,13.5-13.48v-22" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M54.68,120.25v46.1A7.81,7.81,0,0,0,66.5,173l17.42-10.44a13.5,13.5,0,0,1,7-1.92h52.31" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M95.2,111.62H86.89a4.71,4.71,0,1,1,0-9.41H99.54" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M95.2,121H86.89a4.71,4.71,0,1,1,0-9.41H95.2" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M95.2,130.45H86.89a4.71,4.71,0,0,1,0-9.42H95.2" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M127,108.55a13.31,13.31,0,0,0-11.35-6.34h-4.13l-8.71-16.6a1,1,0,0,0-.91-.55,6.31,6.31,0,0,0-5.83,8.69l3.45,8.46" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M95.2,130.45H90.48a4.71,4.71,0,1,0,0,9.41h25.19a13.27,13.27,0,0,0,10.73-5.43" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <path d="M137.29,139.64h-3.94a6.35,6.35,0,0,1-6.35-6.36V108.56a6.35,6.35,0,0,1,6.35-6.35h3.94a6.35,6.35,0,0,1,6.35,6.35v24.72A6.35,6.35,0,0,1,137.29,139.64Z" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="157.7" y1="38.5" x2="157.7" y2="57.21" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="198.78" y1="79.5" x2="180.03" y2="79.5" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '        <line x1="186.74" y1="50.51" x2="173.49" y2="63.74" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/>\n' +
    '    </g>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes-hub/hub-tunnel-required.html',
    '<svg id="illo-tunnel-hub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">\n' +
    '    <g class="secondary-items">\n' +
    '        <path d="M23.74,109.87,19,120" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M27.14,117.6,17,112.87" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M56.74,193,52,203.13" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M222.85,164,212,166.69" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M59.14,199.73,49,195" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M218.71,170.86,216,160" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M110.19,42H99" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M163.73,76.05l2.71-10.86" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M105,47.18V36" stroke-linecap="round" stroke-width="4"/>\n' +
    '        <path d="M160.2,67.75l10.8,2.7" stroke-linecap="round" stroke-width="4"/>\n' +
    '    </g>\n' +
    '    <g id="tunnel">\n' +
    '        <circle cx="115" cy="129.51" r="60" fill="#7ec64f"/>\n' +
    '        <line x1="115" y1="146.9" x2="115" y2="151.32" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '        <line x1="115" y1="159.61" x2="115" y2="164.04" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '        <path d="M88.42,152.87V108.63a30,30,0,0,1,53.09,0v44.24" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '        <path d="M81,161.2l25-25,.18-.13V117.71a10,10,0,0,1,17.69,0v18.34l.18.13,25,25" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '        <line x1="106.15" y1="136.03" x2="123.85" y2="136.03" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '    </g>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes-hub/hub-v2-notifications-empty.html',
    '<svg width="200px" height="200px" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <g>\n' +
    '        <path stroke-width="0"\n' +
    '              d="M180,99.7388265 C180,55.7000693 144.183,20 100,20 C55.817,20 20,55.7000693 20,99.7388265 C20,122.731517 29.768,143.447664 45.388,158 C58.902,151.600959 78.362,147.582122 100,147.582122 C121.638,147.582122 141.098,151.600959 154.612,158 C170.232,143.447664 180,122.731517 180,99.7388265"\n' +
    '              opacity="0.1"></path>\n' +
    '    </g>\n' +
    '    <g class="secondary-items">\n' +
    '        <path stroke-width="0"\n' +
    '              d="M80.2113555,42.4340063 L82.6665996,42.4340063 C83.2204734,42.4340063 83.6694768,42.8799303 83.6694768,43.4300055 C83.6694768,43.9800807 83.2204734,44.4260048 82.6665996,44.4260048 L80.2113555,44.4260048 L80.2113555,46.8644102 C80.2113555,47.4144854 79.762352,47.8604094 79.2084782,47.8604094 C78.6546044,47.8604094 78.205601,47.4144854 78.205601,46.8644102 L78.205601,44.4260048 L75.750758,44.4260048 C75.1968842,44.4260048 74.7478808,43.9800807 74.7478808,43.4300055 C74.7478808,42.8799303 75.1968842,42.4340063 75.750758,42.4340063 L78.205601,42.4340063 L78.205601,39.9959993 C78.205601,39.4459241 78.6546044,39 79.2084782,39 C79.762352,39 80.2113555,39.4459241 80.2113555,39.9959993 L80.2113555,42.4340063 Z M52.5381439,124.135277 L54.8447313,124.968863 C55.3652161,125.156962 55.6336144,125.72849 55.4442158,126.245405 C55.2548172,126.76232 54.679343,127.028877 54.1588583,126.840778 L51.8522709,126.007193 L51.0130026,128.297761 C50.823604,128.814676 50.2481299,129.081234 49.7276451,128.893134 C49.2071604,128.705034 48.938762,128.133507 49.1281607,127.616592 L49.9674289,125.326023 L47.6602137,124.492211 C47.1397289,124.304112 46.8713306,123.732584 47.0607292,123.215669 C47.2501278,122.698754 47.825602,122.432197 48.3460867,122.620296 L50.6533019,123.454108 L51.4929452,121.162516 C51.6823438,120.645601 52.257818,120.379044 52.7783027,120.567143 C53.2987875,120.755243 53.5671858,121.32677 53.3777872,121.843686 L52.5381439,124.135277 Z M156.00128,72.7767472 L158.308196,73.6108045 C158.828655,73.7989746 159.096975,74.3705383 158.907505,74.8874278 C158.718036,75.4043173 158.142525,75.670797 157.622066,75.4826269 L155.31515,74.6485696 L154.475289,76.9397839 C154.28582,77.4566734 153.710309,77.7231531 153.18985,77.534983 C152.669391,77.3468129 152.401071,76.7752492 152.590541,76.2583597 L153.430402,73.9671453 L151.123421,73.1330647 C150.602962,72.9448945 150.334643,72.3733308 150.524112,71.8564413 C150.713582,71.3395518 151.289092,71.0730721 151.809551,71.2612422 L154.116532,72.0953229 L154.956328,69.8042844 C155.145798,69.287395 155.721308,69.0209153 156.241767,69.2090854 C156.762226,69.3972555 157.030546,69.9688192 156.841077,70.4857087 L156.00128,72.7767472 Z M154.80697,113.093879 C152.114245,112.024176 149.11163,112.024176 146.418905,113.093879 C143.726179,114.163582 140.723565,114.163582 138.03084,113.093879 L133.83781,111.427572 L133.83781,94.7674928 L138.03084,96.4337995 C140.723565,97.5025067 143.726179,97.5025067 146.418905,96.4337995 C149.11163,95.3640963 152.114245,95.3640963 154.80697,96.4337995 L158.136523,97.7564865 C158.659022,97.9636544 159,98.465638 159,99.0233976 L159,112.744283 C159,113.709407 158.018183,114.369754 157.115594,114.011195 L154.80697,113.093879 Z M110.754713,79.7961298 L112.191306,79.7961298 C114.406662,79.7961298 116.202815,81.5799645 116.202815,83.7801269 L116.202815,89.0533015 C118.252706,91.3125179 119.500476,94.3037731 119.500476,97.5847763 L119.500476,118.707929 C119.500476,120.516663 118.024241,121.982774 116.203016,121.982774 C114.38179,121.982774 112.905555,120.516663 112.905555,118.707929 L112.873233,118.707929 L112.905355,127.742538 L112.905355,152.717591 C113.520322,153.611637 113.879951,154.692667 113.879951,155.857108 L113.879951,157.999502 L112.905355,157.999502 L103.632751,158 L102.657754,157.999502 L102.657754,155.857108 C102.657754,154.692414 103.01754,153.611166 103.632751,152.717008 L103.632751,131.089096 C103.632751,129.240521 102.124424,127.742538 100.263084,127.742538 C98.4017437,127.742538 96.8924134,129.240521 96.8924134,131.089096 L96.8924134,152.716571 C97.5078087,153.610814 97.8677116,154.692224 97.8677116,155.857108 L97.8677116,157.999502 L96.8924134,157.999502 L87.6208132,158 L86.6455151,157.999502 L86.6455151,155.857108 C86.6455151,154.692224 87.0054179,153.610814 87.6208132,152.716571 L87.6208132,127.742538 L87.5902621,119.149743 C87.3730605,120.749508 85.9929051,121.982774 84.3225505,121.982774 C82.5013254,121.982774 81.0250901,120.516663 81.0250901,118.707929 L81.0250901,97.5847763 C81.0250901,94.3039872 82.2726975,91.3129081 84.3223499,89.0537437 L84.3223499,83.7801269 C84.3223499,81.5799645 86.1185031,79.7961298 88.3338589,79.7961298 L89.7710903,79.7961298 C89.0760219,78.3193236 88.6877743,76.6715907 88.6877743,74.9338606 C88.6877743,68.5843653 93.8696411,63.4380371 100.262984,63.4380371 C106.655323,63.4380371 111.838193,68.5843653 111.838193,74.9338606 C111.838193,76.6715907 111.44987,78.3193236 110.754713,79.7961298 Z M95.0082076,103.214264 L105.517358,103.214264 C106.624535,103.214264 107.523113,102.322844 107.523113,101.222265 L107.523113,95.5928773 C107.523113,94.4922982 106.624535,93.6008788 105.517358,93.6008788 L95.0082076,93.6008788 C93.9010311,93.6008788 93.0024531,94.4922982 93.0024531,95.5928773 L93.0024531,101.222265 C93.0024531,102.322844 93.9010311,103.214264 95.0082076,103.214264 Z"></path>\n' +
    '    </g>\n' +
    '    <g class="primary-items">\n' +
    '        <path stroke-width="0"\n' +
    '              d="M86.3944561,149.610923 C65.4718921,151.305207 47.2667732,156.849183 36.5993111,164.801322 C36.157178,165.130913 35.5304625,165.041162 35.1995028,164.600857 C34.8685431,164.160552 34.9586669,163.536427 35.4008,163.206836 C46.4286607,154.986035 65.0548688,149.318686 86.3944566,147.612384 L86.3944578,141.391285 C86.394123,141.380691 86.3939543,141.370054 86.3939543,141.359379 C86.3939543,141.348703 86.394123,141.338066 86.3944579,141.327471 L86.3944605,128.294999 L86.3752672,122.88189 C85.7170392,123.291594 84.9391299,123.528375 84.1056634,123.528375 C81.7373882,123.528375 79.8176806,121.616604 79.8176806,119.25812 L79.8176806,98.137885 C79.8176806,94.740978 81.05508,91.6320587 83.1054674,89.2336945 L83.1054674,84.3351421 C83.1054674,81.5968419 85.325395,79.3745833 88.0706588,79.3559516 C87.673188,78.1386816 87.4583501,76.8393705 87.4583501,75.4900976 C87.4583501,68.5914799 93.0730429,63 100.0003,63 C106.926889,63 112.54225,68.5918105 112.54225,75.4900976 C112.54225,76.839354 112.327371,78.1386703 111.929837,79.3559564 C114.67478,79.3749588 116.894332,81.5970732 116.894332,84.3351421 L116.894332,89.2332267 C118.944959,91.6316544 120.182519,94.7407572 120.182519,98.137885 L120.182519,119.25812 C120.182519,121.616604 118.262812,123.528375 115.894536,123.528375 C115.045038,123.528375 114.253254,123.282397 113.587081,122.858055 L113.606346,128.291482 L113.606346,141.334743 C113.606545,141.342931 113.606646,141.351143 113.606646,141.359379 C113.606646,141.367614 113.606545,141.375826 113.606346,141.384014 L113.606346,147.610412 C118.278524,147.983251 122.841315,148.548161 127.247035,149.297464 C127.791436,149.390053 128.15739,149.90461 128.064416,150.44676 C127.971443,150.98891 127.454749,151.353351 126.910349,151.260762 C122.613725,150.530013 118.163768,149.9768 113.606346,149.608596 L113.606346,152.968861 C114.222703,153.967878 114.578142,155.143691 114.578142,156.402169 L114.578142,158.544267 C114.578142,159.094266 114.130428,159.540129 113.578146,159.540129 L112.638276,159.540129 C112.627675,159.54046 112.617032,159.540627 112.60635,159.540627 L103.360387,159.540627 C103.349704,159.540627 103.339061,159.54046 103.32846,159.540129 L102.38819,159.540129 C101.835908,159.540129 101.388194,159.094266 101.388194,158.544267 L101.388194,156.402169 C101.388194,155.143418 101.743787,153.967369 102.360391,152.968212 L102.360391,149.082202 C101.575418,149.071515 100.788483,149.066153 99.9998,149.066153 C99.2107155,149.066153 98.423843,149.071569 97.6394094,149.082331 L97.6394094,152.967726 C98.2561973,153.966988 98.6119055,155.143214 98.6119055,156.402169 L98.6119055,158.544267 C98.6119055,159.094266 98.1641921,159.540129 97.6119095,159.540129 L96.6713401,159.540129 C96.6607387,159.54046 96.6500956,159.540627 96.6394134,159.540627 L87.3944503,159.540627 C87.3837681,159.540627 87.373125,159.54046 87.3625236,159.540129 L86.4219542,159.540129 C85.8696717,159.540129 85.4219582,159.094266 85.4219582,158.544267 L85.4219582,156.402169 C85.4219582,155.143214 85.7776668,153.966986 86.3944555,152.967724 L86.3944561,149.610923 Z M97.6394094,147.090404 C98.4239263,147.079776 99.2107957,147.07443 99.9998,147.07443 C100.788433,147.07443 101.575365,147.079729 102.360391,147.090295 L102.360391,131.637578 C102.360391,130.339257 101.30411,129.287344 100.0004,129.287344 C98.6964071,129.287344 97.6394094,130.339539 97.6394094,131.637578 L97.6394094,141.327584 C97.6397419,141.338142 97.6399094,141.348741 97.6399094,141.359379 C97.6399094,141.370017 97.6397419,141.380616 97.6394094,141.391173 L97.6394094,147.090404 Z M139.611027,154.06639 C139.07895,153.918982 138.76761,153.369934 138.91563,152.840056 C139.06365,152.310179 139.614977,152.000126 140.147054,152.147534 C150.181942,154.927622 158.580832,158.720696 164.59914,163.206393 C165.041298,163.535952 165.131469,164.16007 164.800542,164.600399 C164.469615,165.040729 163.842906,165.130527 163.400748,164.800968 C157.60045,160.477763 149.42315,156.784763 139.611027,154.06639 Z M134.478162,113.449687 L134.478162,158.544466 C134.478162,159.094466 134.030449,159.540328 133.478166,159.540328 C132.925884,159.540328 132.47817,159.094466 132.47817,158.544466 L132.47817,95.3211898 C132.47817,95.2405515 132.487794,95.1621518 132.505961,95.0870675 C132.551609,94.8960502 132.651904,94.7297383 132.786907,94.601574 C132.874446,94.5181553 132.977179,94.4504206 133.090555,94.4029018 C133.320835,94.3056858 133.590031,94.2927392 133.85017,94.396402 L138.030741,96.0623141 C140.477495,97.0360623 143.20577,97.0360623 145.652227,96.0624328 C148.575626,94.8979076 151.835573,94.8979076 154.758972,96.0624328 L158.078344,97.3846925 C158.979081,97.7428093 159.568562,98.6109103 159.568562,99.5763077 L159.568562,113.295299 C159.568562,114.964906 157.874968,116.106808 156.318184,115.486669 L154.016194,114.56948 C151.569614,113.594895 148.841585,113.594895 146.395005,114.56948 C143.471606,115.734006 140.21166,115.734006 137.288146,114.569435 L134.478162,113.449687 Z M157.56857,113.295299 L157.56857,99.5763077 C157.56857,99.425126 157.476924,99.2901634 157.33618,99.234206 L154.016194,97.9117016 C151.569614,96.9371159 148.841585,96.9371159 146.394707,97.9118203 C143.471483,99.0751914 140.211782,99.0751914 137.288146,97.9116558 L134.478662,96.7921071 L134.478662,111.304628 L138.031039,112.720212 C140.477618,113.694797 143.205648,113.694797 145.652227,112.720212 C148.575626,111.555686 151.835573,111.555686 154.759041,112.720239 L157.060998,113.637414 C157.304013,113.734219 157.56857,113.555842 157.56857,113.295299 Z M105.239579,102.770733 C105.791715,102.770733 106.239575,102.324879 106.239575,101.774872 L106.239575,96.1462612 C106.239575,95.5962541 105.791715,95.1503995 105.239579,95.1503995 L94.7606209,95.1503995 C94.2084851,95.1503995 93.7606249,95.5962541 93.7606249,96.1462612 L93.7606249,101.774872 C93.7606249,102.324879 94.2084851,102.770733 94.7606209,102.770733 L105.239579,102.770733 Z M105.239579,104.762457 L94.7606209,104.762457 C93.1040746,104.762457 91.7606329,103.425031 91.7606329,101.774872 L91.7606329,96.1462612 C91.7606329,94.4961016 93.1040746,93.158676 94.7606209,93.158676 L105.239579,93.158676 C106.896125,93.158676 108.239567,94.4961016 108.239567,96.1462612 L108.239567,101.774872 C108.239567,103.425031 106.896125,104.762457 105.239579,104.762457 Z M111.606355,150.913537 L111.606357,142.35524 L104.360383,142.35524 L104.360383,150.913274 C105.400108,150.231313 106.645106,149.834461 107.983168,149.834461 C109.321403,149.834461 110.566549,150.231415 111.606355,150.913537 Z M95.6394174,150.913077 L95.6394174,142.35524 L88.3944463,142.35524 L88.3944463,150.913077 C89.4341111,150.231237 90.6789981,149.834461 92.0169319,149.834461 C93.3548656,149.834461 94.5997527,150.231237 95.6394174,150.913077 Z M86.3637286,119.627622 L86.290461,98.9638836 C86.2885108,98.4138878 86.7346406,97.9664538 87.2869197,97.9645117 C87.8391988,97.9625696 88.2884904,98.406855 88.2904405,98.9568508 L88.3944463,128.291482 L88.3944463,140.363517 L95.6394174,140.363517 L95.6394174,131.637578 C95.6394174,129.239357 97.5920261,127.29562 100.0004,127.29562 C102.408675,127.29562 104.360383,129.239259 104.360383,131.637578 L104.360383,140.363517 L111.606357,140.363517 L111.60636,128.294999 L111.50236,98.9638836 C111.50041,98.4138878 111.94654,97.9664538 112.498819,97.9645117 C113.051098,97.9625696 113.50039,98.406855 113.50234,98.9568508 L113.573413,119.002938 C113.59503,119.084381 113.606546,119.169911 113.606546,119.25812 C113.606546,120.516606 114.630826,121.536652 115.894536,121.536652 C117.158247,121.536652 118.182527,120.516606 118.182527,119.25812 L118.182527,98.137885 C118.182527,91.6474979 112.899621,86.3867168 106.382574,86.3867168 L106.134437,86.3867168 C104.320893,87.4014608 102.228408,87.9801952 100.0003,87.9801952 C97.7719263,87.9801952 95.6793202,87.4014685 93.865742,86.3867168 L93.6176255,86.3867168 C87.1005788,86.3867168 81.8176726,91.6474979 81.8176726,98.137885 L81.8176726,119.25812 C81.8176726,120.516606 82.8419532,121.536652 84.1056634,121.536652 C85.2430407,121.536652 86.1864671,120.710359 86.3637286,119.627622 Z M88.920234,81.347557 L88.1054475,81.347557 C86.4487388,81.347557 85.1054595,82.6852828 85.1054595,84.3351421 L85.1054595,87.3199486 C86.8969234,85.9200256 89.0448228,84.9519029 91.3911348,84.5729171 C90.4019385,83.6427055 89.5646539,82.5539877 88.920234,81.347557 Z M111.080157,81.347557 C110.435673,82.5539779 109.598322,83.6426997 108.609077,84.572919 C110.95521,84.951878 113.10296,85.9198838 114.89434,87.3196361 L114.89434,84.3351421 C114.89434,82.6852828 113.551061,81.347557 111.894352,81.347557 L111.080157,81.347557 Z M110.542258,75.4900976 C110.542258,69.6918357 105.822351,64.9917234 100.0003,64.9917234 C94.177608,64.9917234 89.4583421,69.6914784 89.4583421,75.4900976 C89.4583421,81.2880782 94.1779667,85.9884717 100.0003,85.9884717 C105.821992,85.9884717 110.542258,81.2877209 110.542258,75.4900976 Z M94.4261222,75.4900976 C94.4261222,76.0400968 93.9784088,76.4859593 93.4261262,76.4859593 C92.8738437,76.4859593 92.4261302,76.0400968 92.4261302,75.4900976 C92.4261302,71.3241245 95.8168319,67.947441 100.0001,67.947441 C100.552383,67.947441 101.000096,68.3933035 101.000096,68.9433027 C101.000096,69.4933019 100.552383,69.9391644 100.0001,69.9391644 C96.921397,69.9391644 94.4261222,72.4241229 94.4261222,75.4900976 Z M96.6119135,156.402169 C96.6119135,153.874955 94.554637,151.826184 92.0169319,151.826184 C89.4792267,151.826184 87.4219502,153.874955 87.4219502,156.402169 L87.4219502,157.548405 L96.6119135,157.548405 L96.6119135,156.402169 Z M112.57815,156.402169 C112.57815,153.874955 110.520873,151.826184 107.983168,151.826184 C105.445463,151.826184 103.388186,153.874955 103.388186,156.402169 L103.388186,157.548405 L112.57815,157.548405 L112.57815,156.402169 Z"></path>\n' +
    '    </g>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/hub-no-apps.html',
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg width="196px" height="203px" viewBox="0 0 196 203" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <!-- Generator: sketchtool 50.2 (55047) - http://www.bohemiancoding.com/sketch -->\n' +
    '    <title>320B1B1A-7279-4E81-9FCB-A22A5CCFF5C3</title>\n' +
    '    <desc>Created with sketchtool.</desc>\n' +
    '    <defs></defs>\n' +
    '    <g id="iOS-mobile-and-tablet" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
    '        <g id="v1-apps-none" transform="translate(-82.000000, -229.000000)">\n' +
    '            <g id="compliance_empty" transform="translate(84.000000, 231.000000)">\n' +
    '                <g id="inbox" transform="translate(11.294118, 131.159091)" stroke-linecap="round" stroke-width="4">\n' +
    '                    <path d="M144.353054,1.646725 L149.134984,1.646725 C154.951454,1.646725 160.286795,4.87821364 162.986089,10.0363841 L168.942607,19.7738159" id="Stroke-1" stroke="#123E66"></path>\n' +
    '                    <path d="M2.65818353,20.8086159 L8.72990118,10.3452864 C11.3704659,5.01751364 16.7984188,1.64582045 22.7413835,1.64582045 L27.9186071,1.64582045" id="Stroke-3" stroke="#123E66"></path>\n' +
    '                    <path d="M30.1772047,16.7463023 L30.1772047,11.9522114" id="Stroke-5" stroke="#CCD5E1"></path>\n' +
    '                    <path d="M142.094231,11.9519852 L142.094231,16.7460761" id="Stroke-9" stroke="#CCD5E1"></path>\n' +
    '                    <path d="M162.857562,16.7463023 L123.576621,16.7463023 C120.561092,16.7463023 117.798551,18.6051432 116.822739,21.4635068 C112.467727,34.2537795 100.387539,43.4575295 86.1366212,43.4575295 C71.8857035,43.4575295 59.8032565,34.2537795 55.4482447,21.4635068 C54.4746918,18.6051432 51.7098918,16.7463023 48.6943624,16.7463023 L9.41342118,16.7463023 C5.18716235,16.7463023 1.76052706,20.1767909 1.76052706,24.4078023 L1.76052706,60.0649841 C1.76052706,64.2959955 5.18716235,67.7264841 9.41342118,67.7264841 L162.857562,67.7264841 C167.083821,67.7264841 170.510456,64.2959955 170.510456,60.0649841 L170.510456,24.4078023 C170.510456,20.1767909 167.083821,16.7463023 162.857562,16.7463023 Z" id="Stroke-17" stroke="#123E66"></path>\n' +
    '                </g>\n' +
    '                <g id="document" transform="translate(40.658824, 38.443182)" stroke="#CCD5E1" stroke-linecap="round" stroke-width="4">\n' +
    '                    <path d="M0.812498824,95.3861273 L0.812498824,44.2386045 C0.812498824,39.3088318 2.73701647,34.5757977 6.17720471,31.0503318 L30.3330635,6.27935455 C33.8816753,2.64082045 38.7449224,0.589763636 43.8250165,0.589763636 L89.4238871,0.589763636 C102.294664,0.589763636 112.730428,11.0350023 112.730428,23.9202523 L112.730428,100.026445" id="Stroke-7" stroke-dasharray="9.270211971507353,9.270211971507353"></path>\n' +
    '                    <path d="M23.7382024,33.8478648 L89.8042729,33.8478648" id="Stroke-11"></path>\n' +
    '                    <path d="M23.7382024,61.3211716 L64.7674729,61.3211716" id="Stroke-13"></path>\n' +
    '                    <path d="M23.7382024,47.5849705 L76.7414965,47.5849705" id="Stroke-15"></path>\n' +
    '                </g>\n' +
    '                <g id="exclamation" transform="translate(76.800000, 115.329545)">\n' +
    '                    <path d="M40.1968941,20.4397875 C40.1968941,31.2581511 31.4371765,40.0299807 20.6309647,40.0299807 C9.82249412,40.0299807 1.06277647,31.2581511 1.06277647,20.4397875 C1.06277647,9.62142386 9.82249412,0.849594318 20.6309647,0.849594318 C31.4371765,0.849594318 40.1968941,9.62142386 40.1968941,20.4397875 Z" id="Stroke-21" stroke="#123E66" stroke-width="4"></path>\n' +
    '                    <path d="M20.6300612,8.19676477 L20.6300612,22.545117" id="Stroke-23" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                    <path d="M23.1303529,30.1810636 C23.1303529,31.5627568 22.0099765,32.6843932 20.6298353,32.6843932 C19.2474353,32.6843932 18.1293176,31.5627568 18.1293176,30.1810636 C18.1293176,28.7971091 19.2474353,27.6777341 20.6298353,27.6777341 C22.0099765,27.6777341 23.1303529,28.7971091 23.1303529,30.1810636" id="Fill-25" fill="#123E66"></path>\n' +
    '                </g>\n' +
    '                <g id="left_plus" transform="translate(0.000000, 104.022727)" stroke="#CCD5E1" stroke-linecap="round" stroke-width="4">\n' +
    '                    <path d="M8.47510588,2.16683864 L3.08103529,13.735975" id="Stroke-29"></path>\n' +
    '                    <path d="M11.5561412,10.6501182 L0,5.25224318" id="Stroke-33"></path>\n' +
    '                </g>\n' +
    '                <g id="right_plus" transform="translate(178.447059, 104.022727)" stroke="#CCD5E1" stroke-linecap="round" stroke-width="4">\n' +
    '                    <path d="M10.2640941,2.16683864 L4.87002353,13.735975" id="Stroke-37"></path>\n' +
    '                    <path d="M13.3451294,10.6501182 L1.78898824,5.25224318" id="Stroke-41"></path>\n' +
    '                </g>\n' +
    '                <g id="top_plus" transform="translate(119.717647, 0.000000)" stroke="#CCD5E1" stroke-linecap="round" stroke-width="4">\n' +
    '                    <path d="M13.5409694,6.38360341 L0.787651765,6.38360341" id="Stroke-45"></path>\n' +
    '                    <path d="M7.16431059,12.7669807 L7.16431059,-0.000678409091" id="Stroke-49"></path>\n' +
    '                </g>\n' +
    '            </g>\n' +
    '        </g>\n' +
    '    </g>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/hub-no-search-results.html',
    '<svg width="196px" height="198px" viewBox="0 0 196 198" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <!-- Generator: sketchtool 50.2 (55047) - http://www.bohemiancoding.com/sketch -->\n' +
    '    <title>3C7AC192-1944-47A3-87F7-4C423798104D</title>\n' +
    '    <desc>Created with sketchtool.</desc>\n' +
    '    <defs>\n' +
    '        <path d="M0.224282353,25.3123765 C0.224282353,39.2741647 11.5409882,50.5931294 25.5050353,50.5931294 C39.4668235,50.5931294 50.7857882,39.2741647 50.7857882,25.3123765 C50.7857882,11.3505882 39.4668235,0.0316235294 25.5050353,0.0316235294 C11.5409882,0.0316235294 0.224282353,11.3505882 0.224282353,25.3123765" id="path-1"></path>\n' +
    '        <path d="M1.22428235,25.3123765 C1.22428235,39.2741647 12.5409882,50.5931294 26.5050353,50.5931294 C40.4668235,50.5931294 51.7857882,39.2741647 51.7857882,25.3123765 C51.7857882,11.3505882 40.4668235,0.0316235294 26.5050353,0.0316235294 C12.5409882,0.0316235294 1.22428235,11.3505882 1.22428235,25.3123765 Z" id="path-3"></path>\n' +
    '        <path d="M0.224282353,25.3123765 C0.224282353,39.2741647 11.5409882,50.5931294 25.5050353,50.5931294 C39.4668235,50.5931294 50.7857882,39.2741647 50.7857882,25.3123765 C50.7857882,11.3505882 39.4668235,0.0316235294 25.5050353,0.0316235294 C11.5409882,0.0316235294 0.224282353,11.3505882 0.224282353,25.3123765 Z" id="path-5"></path>\n' +
    '        <path d="M0.224282353,25.3123765 C0.224282353,39.2741647 11.5409882,50.5931294 25.5050353,50.5931294 C39.4668235,50.5931294 50.7857882,39.2741647 50.7857882,25.3123765 C50.7857882,11.3505882 39.4668235,0.0316235294 25.5050353,0.0316235294 C11.5409882,0.0316235294 0.224282353,11.3505882 0.224282353,25.3123765 Z" id="path-7"></path>\n' +
    '    </defs>\n' +
    '    <g id="iOS-mobile-and-tablet" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
    '        <g id="iOS-search-mobile-typing-Copy" transform="translate(-90.000000, -213.000000)">\n' +
    '            <g id="no_results" transform="translate(92.000000, 215.000000)">\n' +
    '                <path d="M63.0790024,40.6628894 C63.0790024,26.7011012 51.7600376,15.3821365 37.7982494,15.3821365 C23.8364612,15.3821365 12.5174965,26.7011012 12.5174965,40.6628894 C12.5174965,54.6246776 23.8364612,65.9436424 37.7982494,65.9436424 C51.7600376,65.9436424 63.0790024,54.6246776 63.0790024,40.6628894" id="Fill-1" fill="#FFFFFF"></path>\n' +
    '                <g id="Group-5" transform="translate(12.294118, 15.350287)">\n' +
    '                    <mask id="mask-2" fill="white">\n' +
    '                        <use xlink:href="#path-1"></use>\n' +
    '                    </mask>\n' +
    '                    <g id="Clip-4"></g>\n' +
    '                    <path d="M33.9313506,16.8851576 C33.9313506,21.5405929 30.1591153,25.3128282 25.5059388,25.3128282 C20.8505035,25.3128282 17.0782682,21.5405929 17.0782682,16.8851576 C17.0782682,12.2297224 20.8505035,8.45974588 25.5059388,8.45974588 C30.1591153,8.45974588 33.9313506,12.2297224 33.9313506,16.8851576" id="Fill-3" fill="#FFFFFF" mask="url(#mask-2)"></path>\n' +
    '                </g>\n' +
    '                <g id="Group-8" transform="translate(11.294118, 15.350287)">\n' +
    '                    <mask id="mask-4" fill="white">\n' +
    '                        <use xlink:href="#path-3"></use>\n' +
    '                    </mask>\n' +
    '                    <g id="Clip-7"></g>\n' +
    '                    <path d="M34.9313506,16.8851576 C34.9313506,21.5405929 31.1591153,25.3128282 26.5059388,25.3128282 C21.8505035,25.3128282 18.0782682,21.5405929 18.0782682,16.8851576 C18.0782682,12.2297224 21.8505035,8.45974588 26.5059388,8.45974588 C31.1591153,8.45974588 34.9313506,12.2297224 34.9313506,16.8851576 Z" id="Stroke-6" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round" mask="url(#mask-4)"></path>\n' +
    '                </g>\n' +
    '                <g id="Group-11" transform="translate(12.294118, 15.350287)">\n' +
    '                    <mask id="mask-6" fill="white">\n' +
    '                        <use xlink:href="#path-5"></use>\n' +
    '                    </mask>\n' +
    '                    <g id="Clip-10"></g>\n' +
    '                    <path d="M39.7631812,54.8042541 L11.2455341,54.8042541 L11.2455341,46.4443482 C11.2455341,38.5700894 17.6289694,32.1866541 25.5054871,32.1866541 C33.3797459,32.1866541 39.7631812,38.5700894 39.7631812,46.4443482 L39.7631812,54.8042541 Z" id="Fill-9" fill="#FFFFFF" mask="url(#mask-6)"></path>\n' +
    '                </g>\n' +
    '                <g id="Group-14" transform="translate(12.294118, 15.350287)">\n' +
    '                    <mask id="mask-8" fill="white">\n' +
    '                        <use xlink:href="#path-7"></use>\n' +
    '                    </mask>\n' +
    '                    <g id="Clip-13"></g>\n' +
    '                    <path d="M39.7631812,54.8042541 L11.2455341,54.8042541 L11.2455341,46.4443482 C11.2455341,38.5700894 17.6289694,32.1866541 25.5054871,32.1866541 C33.3797459,32.1866541 39.7631812,38.5700894 39.7631812,46.4443482 L39.7631812,54.8042541 Z" id="Stroke-12" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round" mask="url(#mask-8)"></path>\n' +
    '                </g>\n' +
    '                <path d="M63.0790024,40.6628894 C63.0790024,26.7011012 51.7600376,15.3821365 37.7982494,15.3821365 C23.8364612,15.3821365 12.5174965,26.7011012 12.5174965,40.6628894 C12.5174965,54.6246776 23.8364612,65.9436424 37.7982494,65.9436424 C51.7600376,65.9436424 63.0790024,54.6246776 63.0790024,40.6628894 Z" id="Stroke-16" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M180.896753,71.4691765 L150.913129,71.4691765 C145.004047,71.4691765 140.213082,66.6782118 140.213082,60.7691294 L140.213082,23.3020235 C140.213082,21.0409412 141.096282,18.8702118 142.6752,17.2528941 L153.766024,5.89327059 C155.394635,4.224 157.628612,3.28207059 159.961976,3.28207059 L180.896753,3.28207059 C186.805835,3.28207059 191.599059,8.07303529 191.599059,13.9843765 L191.599059,60.7691294 C191.599059,66.6782118 186.805835,71.4691765 180.896753,71.4691765" id="Fill-18" fill="#FFFFFF"></path>\n' +
    '                <g id="Group-23" transform="translate(176.188235, 13.091464)">\n' +
    '                    <path d="M15.40992,0.892461176 L15.40992,47.6772141 C15.40992,53.5862965 10.6189553,58.3772612 4.70761412,58.3772612 L0.110908235,58.3772612" id="Fill-20" fill="#FFFFFF"></path>\n' +
    '                    <path d="M15.40992,0.892461176 L15.40992,47.6772141 C15.40992,53.5862965 10.6189553,58.3772612 4.70761412,58.3772612 L0.110908235,58.3772612" id="Stroke-22" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                </g>\n' +
    '                <g id="Group-27" transform="translate(140.047059, 2.797346)">\n' +
    '                    <path d="M0.165571765,41.6045741 L0.165571765,20.5049035 C0.165571765,18.2438212 1.04877176,16.0730918 2.62768941,14.4557741 L13.7185129,3.09615059 C15.3493835,1.42688 17.5811012,0.484950588 19.9144659,0.484950588 L40.8492424,0.484950588 C43.42656,0.484950588 45.7915482,1.39751529 47.6392659,2.91544471" id="Fill-24" fill="#FFFFFF"></path>\n' +
    '                    <path d="M0.165571765,41.6045741 L0.165571765,20.5049035 C0.165571765,18.2438212 1.04877176,16.0730918 2.62768941,14.4557741 L13.7185129,3.09615059 C15.3493835,1.42688 17.5811012,0.484950588 19.9144659,0.484950588 L40.8492424,0.484950588 C43.42656,0.484950588 45.7915482,1.39751529 47.6392659,2.91544471" id="Stroke-26" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                </g>\n' +
    '                <g id="Group-31" transform="translate(140.047059, 53.750287)">\n' +
    '                    <path d="M25.7112847,17.7188894 L10.8662965,17.7188894 C4.95721412,17.7188894 0.166249412,12.9279247 0.166249412,7.01884235 L0.166249412,0.136207059" id="Fill-28" fill="#FFFFFF"></path>\n' +
    '                    <path d="M25.7112847,17.7188894 L10.8662965,17.7188894 C4.95721412,17.7188894 0.166249412,12.9279247 0.166249412,7.01884235 L0.166249412,0.136207059" id="Stroke-30" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                </g>\n' +
    '                <path d="M150.738522,19.5736094 L181.072264,19.5736094" id="Stroke-32" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M150.738522,36.7914918 L169.577111,36.7914918" id="Stroke-34" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M150.738522,28.1819859 L175.072828,28.1819859" id="Stroke-36" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <g id="Group-41" transform="translate(43.917647, 51.491464)">\n' +
    '                    <path d="M26.5169882,110.274409 L19.1193412,110.274409 C8.88912941,110.274409 0.594729412,101.982268 0.594729412,91.7497976 L0.594729412,19.3590212 C0.594729412,9.12880941 8.88912941,0.834409412 19.1193412,0.834409412 L70.2342588,0.834409412" id="Fill-38" fill="#FFFFFF"></path>\n' +
    '                    <path d="M26.5169882,110.274409 L19.1193412,110.274409 C8.88912941,110.274409 0.594729412,101.982268 0.594729412,91.7497976 L0.594729412,19.3590212 C0.594729412,9.12880941 8.88912941,0.834409412 19.1193412,0.834409412 L70.2342588,0.834409412" id="Stroke-40" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                </g>\n' +
    '                <g id="Group-45" transform="translate(85.835294, 51.491464)">\n' +
    '                    <path d="M41.29152,0.835087059 L49.5926965,0.835087059 C59.8229082,0.835087059 68.1173082,9.12948706 68.1173082,19.3596988 L68.1173082,91.7504753 C68.1173082,101.980687 59.8229082,110.275087 49.5926965,110.275087 L0.293872941,110.275087" id="Fill-42" fill="#FFFFFF"></path>\n' +
    '                    <path d="M41.29152,0.835087059 L49.5926965,0.835087059 C59.8229082,0.835087059 68.1173082,9.12948706 68.1173082,19.3596988 L68.1173082,91.7504753 C68.1173082,101.980687 59.8229082,110.275087 49.5926965,110.275087 L0.293872941,110.275087" id="Stroke-44" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                </g>\n' +
    '                <path d="M127.860254,107.046776 C127.860254,122.858541 115.043689,135.672847 99.2319247,135.672847 C83.4224188,135.672847 70.6058541,122.858541 70.6058541,107.046776 C70.6058541,91.2350118 83.4224188,78.4184471 99.2319247,78.4184471 C115.043689,78.4184471 127.860254,91.2350118 127.860254,107.046776 Z" id="Stroke-46" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M90.3039247,98.4736376 C90.3039247,93.4590494 94.4398306,89.4089788 99.4860424,89.5490259 C104.143736,89.67552 108.028913,93.5606965 108.157666,98.2206494 C108.261572,102.004179 106.011784,105.277214 102.763595,106.677685 C100.669666,107.578955 99.2330541,109.535096 99.2330541,111.814249 L99.2330541,115.182155" id="Stroke-48" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M102.525064,125.126174 C102.525064,126.944527 101.050052,128.419539 99.2316988,128.419539 C97.4133459,128.419539 95.9405929,126.944527 95.9405929,125.126174 C95.9405929,123.307821 97.4133459,121.832809 99.2316988,121.832809 C101.050052,121.832809 102.525064,123.307821 102.525064,125.126174" id="Fill-50" fill="#123E66"></path>\n' +
    '                <path d="M18.7590776,132.826955 L22.0795482,130.134438 C27.3539012,125.853967 34.9051482,125.853967 40.18176,130.134438 L57.1748894,143.922296 C59.2597835,145.614155 60.4727718,148.157591 60.4727718,150.845591 L60.4727718,175.272508 C60.4727718,179.995708 56.6440659,183.824414 51.9208659,183.824414 L42.8336188,183.824414" id="Fill-52" fill="#FFFFFF"></path>\n' +
    '                <path d="M18.7590776,132.826955 L22.0795482,130.134438 C27.3539012,125.853967 34.9051482,125.853967 40.18176,130.134438 L57.1748894,143.922296 C59.2597835,145.614155 60.4727718,148.157591 60.4727718,150.845591 L60.4727718,175.272508 C60.4727718,179.995708 56.6440659,183.824414 51.9208659,183.824414 L42.8336188,183.824414" id="Stroke-54" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M30.7877647,183.823511 L10.3386353,183.823511 C5.61543529,183.823511 1.78898824,179.994805 1.78898824,175.271605 L1.78898824,150.844687 C1.78898824,148.156687 2.99971765,145.613252 5.08687059,143.921393 L10.7610353,139.315652" id="Fill-56" fill="#FFFFFF"></path>\n' +
    '                <path d="M30.7877647,183.823511 L10.3386353,183.823511 C5.61543529,183.823511 1.78898824,179.994805 1.78898824,175.271605 L1.78898824,150.844687 C1.78898824,148.156687 2.99971765,145.613252 5.08687059,143.921393 L10.7610353,139.315652" id="Stroke-58" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M58.0689318,181.336546 L36.7998494,165.039134 C33.4567906,162.475369 28.8081318,162.479887 25.4695906,165.050428 L4.31119059,181.336546" id="Fill-60" fill="#FFFFFF"></path>\n' +
    '                <path d="M58.0689318,181.336546 L36.7998494,165.039134 C33.4567906,162.475369 28.8081318,162.479887 25.4695906,165.050428 L4.31119059,181.336546" id="Stroke-62" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M25.2077929,165.251238 L1.91254588,149.428179" id="Fill-64" fill="#FFFFFF"></path>\n' +
    '                <path d="M25.2077929,165.251238 L1.91254588,149.428179" id="Stroke-66" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M37.1239906,165.286475 L60.4711906,149.427275" id="Fill-68" fill="#FFFFFF"></path>\n' +
    '                <path d="M37.1239906,165.286475 L60.4711906,149.427275" id="Stroke-70" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M8.47465412,91.6528941 L3.08284235,103.209035" id="Fill-72" fill="#FFFFFF"></path>\n' +
    '                <path d="M8.47465412,91.6528941 L3.08284235,103.209035" id="Stroke-74" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M11.5561412,100.128 L0,94.7339294" id="Fill-76" fill="#FFFFFF"></path>\n' +
    '                <path d="M11.5561412,100.128 L0,94.7339294" id="Stroke-78" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M183.635576,112.049619 L178.243765,123.60576" id="Fill-80" fill="#FFFFFF"></path>\n' +
    '                <path d="M183.635576,112.049619 L178.243765,123.60576" id="Stroke-82" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M186.717064,120.524725 L175.160922,115.130654" id="Fill-84" fill="#FFFFFF"></path>\n' +
    '                <path d="M186.717064,120.524725 L175.160922,115.130654" id="Stroke-86" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M102.3168,6.37688471 L89.5634824,6.37688471" id="Fill-88" fill="#FFFFFF"></path>\n' +
    '                <path d="M102.3168,6.37688471 L89.5634824,6.37688471" id="Stroke-90" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M95.9401412,12.7530918 L95.9401412,-0.000225882353" id="Fill-92" fill="#FFFFFF"></path>\n' +
    '                <path d="M95.9401412,12.7530918 L95.9401412,-0.000225882353" id="Stroke-94" stroke="#CCD5E1" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M169.840489,155.505544 C169.840489,169.119473 158.803878,180.156085 145.189948,180.156085 C131.578278,180.156085 120.541666,169.119473 120.541666,155.505544 C120.541666,141.891614 131.578278,130.855002 145.189948,130.855002 C158.803878,130.855002 169.840489,141.891614 169.840489,155.505544" id="Fill-96" fill="#FFFFFF"></path>\n' +
    '                <path d="M169.840489,155.505544 C169.840489,169.119473 158.803878,180.156085 145.189948,180.156085 C131.578278,180.156085 120.541666,169.119473 120.541666,155.505544 C120.541666,141.891614 131.578278,130.855002 145.189948,130.855002 C158.803878,130.855002 169.840489,141.891614 169.840489,155.505544 Z" id="Stroke-98" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M145.190852,170.729562 C136.783511,170.729562 129.966381,163.912433 129.966381,155.505092" id="Stroke-100" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M162.603445,172.917685 L166.969751,177.283991" id="Stroke-102" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '                <path d="M182.741082,191.220932 L180.906918,193.055096 C179.917553,194.044461 178.313788,194.044461 177.324424,193.055096 L166.186165,181.916838 C165.1968,180.927473 165.1968,179.323708 166.186165,178.334344 L168.020329,176.500179 C169.009694,175.510814 170.613459,175.510814 171.602824,176.500179 L182.741082,187.638438 C183.730447,188.627802 183.730447,190.231567 182.741082,191.220932" id="Fill-104" fill="#FFFFFF"></path>\n' +
    '                <path d="M182.741082,191.220932 L180.906918,193.055096 C179.917553,194.044461 178.313788,194.044461 177.324424,193.055096 L166.186165,181.916838 C165.1968,180.927473 165.1968,179.323708 166.186165,178.334344 L168.020329,176.500179 C169.009694,175.510814 170.613459,175.510814 171.602824,176.500179 L182.741082,187.638438 C183.730447,188.627802 183.730447,190.231567 182.741082,191.220932 Z" id="Stroke-106" stroke="#123E66" stroke-width="4" stroke-linecap="round"></path>\n' +
    '            </g>\n' +
    '        </g>\n' +
    '    </g>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/hub-tunnel-required.html',
    '<svg id="illo-tunnel-hub"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180">\n' +
    '    <path d="M13.74,79.87,9,90" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M17.14,87.6,7,82.87" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M46.74,163,42,173.13" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M212.85,134,202,136.69" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M49.14,169.73,39,165" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M208.71,140.86,206,130" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M100.19,12H89" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M153.73,46.05l2.71-10.86" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M95,17.18V6" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <path d="M150.2,37.75,161,40.45" fill="none" stroke="#ccd5e1" stroke-linecap="round" stroke-width="4"/>\n' +
    '    <circle cx="105" cy="99.51" r="60" fill="#7ec64f"/>\n' +
    '    <line x1="105" y1="116.9" x2="105" y2="121.32" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '    <line x1="105" y1="129.61" x2="105" y2="134.04" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '    <path d="M78.42,122.87V78.63a30,30,0,0,1,53.09,0v44.24" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '    <path d="M71,131.2l25-25,.18-.13V87.71a10,10,0,0,1,17.69,0v18.34l.18.13,25,25" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '    <line x1="96.15" y1="106.03" x2="113.85" y2="106.03" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/icon-ws1-lockup.html',
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">\n' +
    '    <polygon points="5.1 14.85 5.1 10.95 8.4 12.85 11.8 14.85 8.4 16.75 5.1 18.75 5.1 14.85" fill="#6cb23e"/>\n' +
    '    <polygon points="5.1 22.55 5.1 18.75 8.4 20.65 11.8 22.55 8.4 24.55 5.1 26.45 5.1 22.55" fill="#6cb23e"/>\n' +
    '    <polygon points="11.8 18.75 11.8 22.55 8.4 20.65 5.1 18.75 8.4 16.75 11.8 14.85 11.8 18.75" fill="#a9da1e"/>\n' +
    '    <polygon points="11.8 10.95 11.8 14.85 8.4 12.85 5.1 10.95 8.4 9.05 11.8 7.05 11.8 10.95" fill="#a9da1e"/>\n' +
    '    <polygon points="11.8 10.95 11.8 7.05 15.2 9.05 18.5 10.95 15.2 12.85 11.8 14.85 11.8 10.95" fill="#6cb23e"/>\n' +
    '    <polygon points="18.5 7.05 18.5 10.95 15.2 9.05 11.8 7.05 15.2 5.15 18.5 3.25 18.5 7.05" fill="#a9da1e"/>\n' +
    '    <polygon points="34.9 14.85 34.9 10.95 31.6 12.85 28.2 14.85 31.6 16.75 34.9 18.75 34.9 14.85" fill="#0093d1"/>\n' +
    '    <polygon points="34.9 22.55 34.9 18.75 31.6 20.65 28.2 22.55 31.6 24.55 34.9 26.45 34.9 22.55" fill="#0093d1"/>\n' +
    '    <polygon points="28.2 18.75 28.2 22.55 31.6 20.65 34.9 18.75 31.6 16.75 28.2 14.85 28.2 18.75" fill="#87c9de"/>\n' +
    '    <polygon points="28.2 10.95 28.2 14.85 31.6 12.85 34.9 10.95 31.6 9.05 28.2 7.05 28.2 10.95" fill="#87c9de"/>\n' +
    '    <polygon points="28.2 10.95 28.2 7.05 24.8 9.05 21.5 10.95 24.8 12.85 28.2 14.85 28.2 10.95" fill="#0093d1"/>\n' +
    '    <polygon points="21.5 7.05 21.5 10.95 24.8 9.05 28.2 7.05 24.8 5.15 21.5 3.25 21.5 7.05" fill="#87c9de"/>\n' +
    '    <polygon points="13.3 29.05 13.3 25.15 9.9 27.05 6.6 29.05 9.9 30.95 13.3 32.85 13.3 29.05" fill="#c33"/>\n' +
    '    <polygon points="13.3 29.05 13.3 32.85 16.6 30.95 20 29.05 16.6 27.05 13.3 25.15 13.3 29.05" fill="#ef8a20"/>\n' +
    '    <polygon points="20 32.85 20 29.05 16.6 30.95 13.3 32.85 16.6 34.85 20 36.75 20 32.85" fill="#c33"/>\n' +
    '    <polygon points="26.7 29.05 26.7 25.15 30.1 27.05 33.4 29.05 30.1 30.95 26.7 32.85 26.7 29.05" fill="#ef8a20"/>\n' +
    '    <polygon points="26.7 29.05 26.7 32.85 23.4 30.95 20 29.05 23.4 27.05 26.7 25.15 26.7 29.05" fill="#c33"/>\n' +
    '    <polygon points="20 32.85 20 29.05 23.4 30.95 26.7 32.85 23.4 34.85 20 36.75 20 32.85" fill="#ef8a20"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-android.html',
    '<svg id="icon-android" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">\n' +
    '	<path d="M32,2H8A6,6,0,0,0,2,8V32a6,6,0,0,0,6,6H32a6,6,0,0,0,6-6V8A6,6,0,0,0,32,2Z" transform="translate(-2 -2)" fill="#a4ca39" stroke-width="0"/>\n' +
    '	<path d="M13,13.53a6.52,6.52,0,0,1,3.4-4.12l-1.1-2a.26.26,0,0,1,.45-.25l1.11,2.06a8,8,0,0,1,6.26,0l1.11-2a.26.26,0,0,1,.45.25l-1.1,2a6.49,6.49,0,0,1,3.47,4.35,5.89,5.89,0,0,1,.1.64v.77H12.84c0-.07,0-.15,0-.22A5.77,5.77,0,0,1,13,13.53Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<path d="M12.25,19.73v4h0a1.59,1.59,0,0,1-3.17,0V17a1.59,1.59,0,0,1,3.17,0h0Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<path d="M27.18,26.18a1.59,1.59,0,0,1-1.59,1.59H24.26v3.65a1.59,1.59,0,0,1-3.17,0V27.77H18.92v3.65a1.59,1.59,0,0,1-3.17,0h0V27.77H14.4a1.59,1.59,0,0,1-1.59-1.59V15.72H27.18Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<path d="M30.92,19.73v4a1.59,1.59,0,0,1-3.17,0h0V17h0a1.59,1.59,0,0,1,3.17,0Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<circle cx="14.73" cy="9.95" r="0.67" fill="#a4ca39" stroke-width="0"/>\n' +
    '	<circle cx="21.27" cy="9.95" r="0.67" fill="#a4ca39" stroke-width="0"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-empty-bookmark.html',
    '<svg id="illo-empty-bookmark" xmlns="http://www.w3.org/2000/svg" width="270" height="240" viewBox="0 0 270 240">\n' +
    '    <path d="M190.6,203.3l-73.15-30a6.67,6.67,0,0,1-3.67-8.64L140.28,100a6.67,6.67,0,0,1,8.67-3.63l73.15,30a6.67,6.67,0,0,1,3.63,8.67l-26.46,64.65A6.67,6.67,0,0,1,190.6,203.3Z" fill="#fff"/>\n' +
    '    <path d="M188.2,167.15l-52.08-21.34a1,1,0,0,1-.55-1.3l2.22-5.41a1,1,0,0,1,1.3-.55l52.08,21.34a1,1,0,0,1,.55,1.3l-2.22,5.41A1,1,0,0,1,188.2,167.15Z" fill="#d7dadd" opacity="0.4" style="isolation:isolate"/>\n' +
    '    <path id="right_line_2" data-name="right line 2" d="M164,175.83l-34.37-14.08a1,1,0,0,1-.55-1.3l2.22-5.41a1,1,0,0,1,1.3-.55l34.37,14.08a1,1,0,0,1,.55,1.3l-2.22,5.41A1,1,0,0,1,164,175.83Z" fill="#d7dadd" opacity="0.4" style="isolation:isolate"/>\n' +
    '    <path id="right_bg_top" data-name="right bg top" d="M221.35,126.13,149.69,96.77a7.48,7.48,0,0,0-9.73,4.07l-6.82,16.66,85.46,35,6.82-16.66A7.48,7.48,0,0,0,221.35,126.13Z" fill="#d7dadd" opacity="0.5" style="isolation:isolate"/>\n' +
    '    <circle cx="149.06" cy="110.15" r="2.65" transform="translate(-9.37 206.32) rotate(-67.72)" fill="#9ba0a6"/>\n' +
    '    <circle cx="158.56" cy="114.04" r="2.65" transform="translate(-7.08 217.53) rotate(-67.72)" fill="#9ba0a6"/>\n' +
    '    <circle cx="168.16" cy="117.98" r="2.65" transform="translate(-4.76 228.85) rotate(-67.72)" fill="#9ba0a6"/>\n' +
    '    <path d="M190.6,203.3l-73.15-30a6.67,6.67,0,0,1-3.67-8.64L140.28,100a6.67,6.67,0,0,1,8.67-3.63l73.15,30a6.67,6.67,0,0,1,3.63,8.67l-26.46,64.65A6.67,6.67,0,0,1,190.6,203.3Z" fill="none" stroke="#c6cacc" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="133.53" y1="117.51" x2="218.29" y2="152.25" fill="none" stroke="#c6cacc" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M133.2,165.9,47.88,176.1a6.58,6.58,0,0,1-7.3-5.74L31.41,93.66a6.58,6.58,0,0,1,5.74-7.29l85.31-10.21a6.58,6.58,0,0,1,7.32,5.75v0l9.17,76.67A6.58,6.58,0,0,1,133.2,165.9Z" fill="#fff"/>\n' +
    '    <path d="M110.47,132.66l-59.7,7.13a1,1,0,0,1-1.11-.87l-.76-6.32a1,1,0,0,1,.87-1.11l59.7-7.14a1,1,0,0,1,1.11.87l.76,6.32a1,1,0,0,1-.86,1.12Z" fill="#d7dadd" opacity="0.4" style="isolation:isolate"/>\n' +
    '    <path id="left_line2" data-name="left line2" d="M83.29,156.66l-29.79,3.5a1,1,0,0,1-1.06-.84l-.72-6.17a1,1,0,0,1,.84-1.06l29.79-3.5a1,1,0,0,1,1.06.84l.72,6.17A1,1,0,0,1,83.29,156.66Z" fill="#d7dadd" opacity="0.4" style="isolation:isolate"/>\n' +
    '    <path d="M121,77.26,39,87.06a8,8,0,0,0-7,8.83l2.28,19,97.74-11.7-2.28-19.05A8,8,0,0,0,121,77.26Z" fill="#d7dadd" opacity="0.5" style="isolation:isolate"/>\n' +
    '    <circle id="left_dot" data-name="left dot" cx="47.41" cy="99.82" r="2.82" transform="translate(-11.52 6.34) rotate(-6.82)" fill="#c6cacc"/>\n' +
    '    <circle cx="69.27" cy="97.2" r="2.82" transform="translate(-11.05 8.91) rotate(-6.82)" fill="#c6cacc"/>\n' +
    '    <circle cx="58.27" cy="98.52" r="2.82" transform="translate(-11.29 7.62) rotate(-6.82)" fill="#c6cacc"/>\n' +
    '    <path d="M132.78,165,48.29,175.13a6.67,6.67,0,0,1-7.39-5.81l-9-74.86a6.67,6.67,0,0,1,5.86-7.39h0L122.29,77a6.67,6.67,0,0,1,7.39,5.81l9,74.86a6.67,6.67,0,0,1-5.86,7.4Z" fill="none" stroke="#c6cacc" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="34.77" y1="114.76" x2="131.72" y2="103.17" fill="none" stroke="#c6cacc" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '    <path d="M184.19,142.55H85.78a6.67,6.67,0,0,1-6.65-6.65V48.53a6.67,6.67,0,0,1,6.65-6.65h98.45a6.67,6.67,0,0,1,6.65,6.65v87.38a6.67,6.67,0,0,1-6.69,6.65Z" fill="#fff"/>\n' +
    '    <path d="M162.72,103.19H94.21a1,1,0,0,1-1-1V94.66a1,1,0,0,1,1-1h68.52a1,1,0,0,1,1,1v7.5a1,1,0,0,1-1,1Z" fill="#cdd0d2" opacity="0.5" style="isolation:isolate"/>\n' +
    '    <path d="M139.56,123H94.21a1,1,0,0,1-1-1v-7.5a1,1,0,0,1,1-1h45.36a1,1,0,0,1,1,1V122a1,1,0,0,1-1,1Z" fill="#cdd0d2" opacity="0.5" style="isolation:isolate"/>\n' +
    '    <path d="M181.78,42H88.11a9,9,0,0,0-9,9v21.8H190.84V51.07a9,9,0,0,0-9-9Z" fill="#cdd0d2" opacity="0.5" style="isolation:isolate"/>\n' +
    '    <circle cx="96.57" cy="57.29" r="3.21" fill="#b7bdc4"/>\n' +
    '    <circle cx="110.06" cy="57.29" r="3.21" fill="#b7bdc4"/>\n' +
    '    <circle cx="123.55" cy="57.29" r="3.21" fill="#b7bdc4"/>\n' +
    '    <path d="M184.19,142.55H85.78a6.67,6.67,0,0,1-6.65-6.65V48.53a6.67,6.67,0,0,1,6.65-6.65h98.45a6.67,6.67,0,0,1,6.65,6.65v87.38a6.67,6.67,0,0,1-6.69,6.65Z" fill="none" stroke="#b7bdc4" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="79.54" y1="72.69" x2="190.38" y2="72.69" fill="none" stroke="#b7bdc4" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <ellipse cx="128.44" cy="226.38" rx="33.11" ry="4.38" fill="#d7dadd"/>\n' +
    '    <line x1="245.46" y1="150.41" x2="253.32" y2="150.41" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="249.4" y1="154.33" x2="249.4" y2="146.47" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="59.73" y1="19.61" x2="67.59" y2="19.61" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="63.66" y1="23.55" x2="63.66" y2="15.68" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <circle cx="18.71" cy="171.39" r="3.53" fill="#d7dadd"/>\n' +
    '    <circle cx="28.28" cy="51.5" r="4.04" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <circle cx="234.29" cy="84.11" r="4.04" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <circle cx="43.21" cy="201.53" r="4.04" fill="none" stroke="#d7dadd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M159.24,71.32l16.82,12.79c0-.2.06-46.5.06-46.5a5.07,5.07,0,0,0-4.82-5.26h-24.1a5.07,5.07,0,0,0-4.82,5.26s0,46.3.06,46.5Z" fill="#9fdaed"/>\n' +
    '    <path d="M159.24,72.66l16.82,11.43c0-.2.06-47.5.06-47.5,0-2.89-1.17-4.26-3.82-4.26h-26.1c-2.65,0-3.82,1.37-3.82,4.26,0,0,0,47.3.06,47.5Z" fill="none" stroke="#36a8df" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="175.59" y1="23.2" x2="180.09" y2="17.84" fill="none" stroke="#36a8df" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="159.23" y1="17.75" x2="159.23" y2="10.75" fill="none" stroke="#36a8df" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="142.88" y1="23.2" x2="138.38" y2="17.84" fill="none" stroke="#36a8df" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '\n' +
    '\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-empty-device.html',
    '<svg id="illo-empty-device" xmlns="http://www.w3.org/2000/svg" width="200" height="160" viewBox="0 0 200 160">\n' +
    '    <path d="M69.89,28.11Q71.74,27,73.68,26" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M52.66,43.63a64.5,64.5,0,0,1,5-5.72" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M70.64,137.66a64.35,64.35,0,0,1-18.11-16.15" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M125.39,142.78a64.4,64.4,0,0,1-35.92,2.36" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M156.39,46.77a63.64,63.64,0,0,1,10.67,29.34" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M88.09,20.49a64.15,64.15,0,0,1,15.29-1.83q2.79,0,5.53.24" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M156.69,135.72l2.88,5.32a1,1,0,0,1-1,1H131.74a1,1,0,0,1-1-1l2.88-5.32a1,1,0,0,1,1-1h21.11A1,1,0,0,1,156.69,135.72Z" fill="#f2f4f9"/>\n' +
    '    <path d="M132.22,138.38,130.77,141a1,1,0,0,0,1,1h26.87a1,1,0,0,0,1-1l-1.51-2.66Z" fill="#d7dce0" opacity="0.6" style="isolation:isolate"/>\n' +
    '    <path d="M156.69,135.72l2.88,5.32a1,1,0,0,1-1,1H131.74a1,1,0,0,1-1-1l2.88-5.32a1,1,0,0,1,1-1h21.11A1,1,0,0,1,156.69,135.72Z" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M147.8,137h-5.24a1,1,0,0,1-1-1v-5.64a1,1,0,0,1,1-1h5.24a1,1,0,0,1,1,1V136A1,1,0,0,1,147.8,137Z" fill="#f2f4f9"/>\n' +
    '    <rect x="142.56" y="129.38" width="2.21" height="6.46" fill="#d7dadd" opacity="0.6" style="isolation:isolate"/>\n' +
    '    <path d="M130.78,53.38a40.26,40.26,0,0,1,5.67,6.36" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M88.09,46.22a39.76,39.76,0,0,1,8.66-2.61" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M104.82,123h-.92a39.87,39.87,0,0,1-27.78-11.22" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M142,70.76a39.74,39.74,0,0,1,1.5,6.51" fill="none" stroke="#d0d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <circle cx="80.51" cy="22.32" r="3" fill="#fff" stroke="#c6cacc" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>\n' +
    '    <circle cx="79.94" cy="142.42" r="3.24" fill="#fff" stroke="#c6cacc" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>\n' +
    '    <circle cx="63.83" cy="32.13" r="3" fill="#c6cacc"/>\n' +
    '    <path d="M173.39,129.38H117a6,6,0,0,1-6-6V88.28a6,6,0,0,1,6-6h56.41a6,6,0,0,1,6,6v35.1A6,6,0,0,1,173.39,129.38Z" fill="#f2f4f9"/>\n' +
    '    <path d="M144.94,45.89c3.85-1.24,7.63-3.84,8-8.56a9.07,9.07,0,0,0-6.06-8.84,23.06,23.06,0,0,0,.3-3.43A11.8,11.8,0,0,0,124,22a6.82,6.82,0,0,0-11.73,4.6v.38h-.6a9.72,9.72,0,0,0-9.85,9.58c0,4,2.64,6.92,6.1,8.36,5,2.09,12,1.73,19.83,1.79S141.08,47.14,144.94,45.89Z" fill="#fdfeff"/>\n' +
    '    <path d="M152.52,39.85c-4,1.1-9.68.71-17.88.65s-15.47.25-20.68-1.6c-3.61-1.28-6.4-3.9-6.37-7.4a7.38,7.38,0,0,1,1.07-3.72,9.67,9.67,0,0,0-6.52,9c0,4,2.64,6.92,6.1,8.36,5,2.09,12,1.73,19.83,1.78s13.28.49,17.15-.76c3.22-1,6.38-3,7.56-6.41Z" fill="#e8ebed"/>\n' +
    '    <path d="M136.31,21.25a4.53,4.53,0,0,1,4.16,2.57,5.12,5.12,0,0,1,.25,3.48" fill="none" stroke="#bac1c6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M144.94,45.89c3.85-1.24,7.63-3.84,8-8.56a9.07,9.07,0,0,0-6.06-8.84,23.06,23.06,0,0,0,.3-3.43A11.8,11.8,0,0,0,124,22a6.82,6.82,0,0,0-11.73,4.6v.38h-.6a9.72,9.72,0,0,0-9.85,9.58c0,4,2.64,6.92,6.1,8.36,5,2.09,12,1.73,19.83,1.79S141.08,47.14,144.94,45.89Z" fill="none" stroke="#bac1c6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M170.39,121H120a3,3,0,0,1-3-3V91a3,3,0,0,1,3-3h50.37a3,3,0,0,1,3,3v27A3,3,0,0,1,170.39,121Z" fill="#fff"/>\n' +
    '    <path d="M79.8,105.72H45.13a4,4,0,0,1-4-4V52.83a4,4,0,0,1,4-4H79.8a4,4,0,0,1,4,4v48.89A4,4,0,0,1,79.8,105.72Z" fill="#f5f6f7"/>\n' +
    '    <rect x="42" y="100.61" width="41.8" height="4.89" fill="#d7dce0" opacity="0.6" style="isolation:isolate"/>\n' +
    '    <circle cx="62.47" cy="100.39" r="2" fill="#fff" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '    <rect x="42" y="55.09" width="41.17" height="39.34" fill="#fff"/>\n' +
    '    <line x1="41.13" y1="95.26" x2="83.79" y2="95.26" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <circle cx="139.35" cy="65.27" r="2.5" transform="translate(5.81 141.72) rotate(-54.89)" fill="#c6cacc"/>\n' +
    '    <path d="M162.61,102.3H125.87a.63.63,0,0,1-.63-.63V95.94a.63.63,0,0,1,.63-.63h36.74a.63.63,0,0,1,.63.63h0v5.74a.63.63,0,0,1-.63.63Z" fill="#e8ebed"/>\n' +
    '    <polygon points="113.61 82.98 111.75 84.84 111.75 126.42 136.44 82.98 113.61 82.98" fill="#f0f1f2" opacity="0.7" style="isolation:isolate"/>\n' +
    '    <path d="M170.39,121.33H120a3,3,0,0,1-3-3v-27a3,3,0,0,1,3-3h50.37a3,3,0,0,1,3,3v27A3,3,0,0,1,170.39,121.33Z" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M155.81,114.38h-30a.57.57,0,0,1-.57-.57V108a.57.57,0,0,1,.57-.57h30a.57.57,0,0,1,.57.57h0v5.86a.57.57,0,0,1-.57.57Z" fill="#e8ebed"/>\n' +
    '    <path d="M75.57,69.23H47a.56.56,0,0,1-.56-.56V62.8a.56.56,0,0,1,.56-.56H75.57a.56.56,0,0,1,.56.56v5.89A.56.56,0,0,1,75.57,69.23Z" fill="#e8ebed"/>\n' +
    '    <path d="M67.39,81.28H46.95a.47.47,0,0,1-.47-.47h0V74.76a.47.47,0,0,1,.47-.47H67.39a.47.47,0,0,1,.47.47h0v6.06a.47.47,0,0,1-.47.47Z" fill="#e8ebed"/>\n' +
    '    <polygon points="43.55 48.84 41.13 51.26 41.13 80.72 60.19 48.84 43.55 48.84" fill="#f0f1f2" opacity="0.7" style="isolation:isolate"/>\n' +
    '    <line x1="41.13" y1="54.28" x2="83.79" y2="54.28" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M79.8,105.72H45.13a4,4,0,0,1-4-4V52.83a4,4,0,0,1,4-4H79.8a4,4,0,0,1,4,4v48.89A4,4,0,0,1,79.8,105.72Z" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M43.88,118.08H24.63a4,4,0,0,1-4-4V74.76a4,4,0,0,1,4-4H43.88a4,4,0,0,1,4,4v39.32A4,4,0,0,1,43.88,118.08Z" fill="#fff"/>\n' +
    '    <rect x="21.11" y="113.56" width="26.21" height="4.54" fill="#d7dce0" opacity="0.6" style="isolation:isolate"/>\n' +
    '    <circle cx="34.26" cy="113.56" r="1.8" fill="#fff" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '    <line x1="21.67" y1="109.14" x2="46.83" y2="109.14" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path d="M40.75,90H27.26a.39.39,0,0,1-.39-.39V83.38a.39.39,0,0,1,.39-.39H40.75a.39.39,0,0,1,.39.39v6.23A.39.39,0,0,1,40.75,90Z" fill="#e8ebed"/>\n' +
    '    <path d="M33.61,102.3H27.15a.27.27,0,0,1-.27-.27V95.58a.27.27,0,0,1,.27-.27h6.46a.27.27,0,0,1,.27.27V102A.27.27,0,0,1,33.61,102.3Z" fill="#e8ebed"/>\n' +
    '    <polygon points="22.88 70.36 20.63 72.61 20.63 99.97 38.31 70.36 22.88 70.36" fill="#f0f1f2" opacity="0.7" style="isolation:isolate"/>\n' +
    '    <line id="phone" x1="21.67" y1="76.78" x2="46.83" y2="76.78" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path id="phone-2" d="M43.88,118.08H24.63a4,4,0,0,1-4-4V74.76a4,4,0,0,1,4-4H43.88a4,4,0,0,1,4,4v39.32A4,4,0,0,1,43.88,118.08Z" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path id="desktop_stand" d="M141.55,129.83v6.4a.38.38,0,0,0,.4.34h6.43a.38.38,0,0,0,.4-.34v-6.4" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '    <path id="desktop" d="M174.39,129.38H116a5,5,0,0,1-5-5V87.28a5,5,0,0,1,5-5h58.41a5,5,0,0,1,5,5v37.1A5,5,0,0,1,174.39,129.38Z" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-empty-search.html',
    '<svg id="illo-empty-search" xmlns="http://www.w3.org/2000/svg" width="240" height="200" viewBox="0 0 240 200">\n' +
    '    <path d="M113.42,129.2H176a.89.89,0,0,1,.65.28l23.92,25a.89.89,0,0,1-.65,1.51h-110a1.48,1.48,0,0,1-1.07-2.51l23.94-24A.9.9,0,0,1,113.42,129.2Z" fill="#f4f4f4"/>\n' +
    '    <path d="M201.69,106.46,178.46,83.78a1.19,1.19,0,0,0-2,.85V130.5a1.19,1.19,0,0,0,.38.87L200.17,154c.76.71,1.9,0,1.9-1.74V107.32A1.19,1.19,0,0,0,201.69,106.46Z" fill="#f9f9f9"/>\n' +
    '    <polygon points="87.44 101.81 113.05 81.81 113.05 130.01 87.44 155 87.44 101.81" fill="#f9f9f9"/>\n' +
    '    <rect x="113.05" y="104.16" width="63.37" height="25.04" fill="#f9f9f9"/>\n' +
    '    <path d="M201.36,130.33A71.38,71.38,0,0,1,213,136.27,73.55,73.55,0,0,1,224.46,146l-7.85,7.3c-.95-.9-5.25-4.89-7.14-6.25-5.4-3.91-8.08-4.09-8.08-4.09" fill="#e0e1e2" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M113.73,104.2H198.8a2.56,2.56,0,0,1,2.56,2.56v46.69A2.56,2.56,0,0,1,198.8,156H90a2.56,2.56,0,0,1-2.56-2.56V124.5" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <polyline points="200.41 104.56 176.58 81.81 119.69 81.81" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="171.39" y1="129.19" x2="169.89" y2="129.19" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="162.33" y1="129.19" x2="122.91" y2="129.19" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" stroke-dasharray="3.24 7.56"/>\n' +
    '    <line x1="119.13" y1="129.19" x2="117.63" y2="129.19" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="111.32" y1="132.4" x2="110.24" y2="133.44" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="105.96" y1="137.53" x2="95.88" y2="147.19" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" stroke-dasharray="2.54 5.92"/>\n' +
    '    <line x1="93.75" y1="149.24" x2="92.66" y2="150.28" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="113.05" y1="110.31" x2="113.05" y2="111.81" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="113.05" y1="116.63" x2="113.05" y2="121.11" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" stroke-dasharray="2.07 4.82"/>\n' +
    '    <line x1="113.05" y1="123.51" x2="113.05" y2="125.01" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="176.42" y1="81.82" x2="176.42" y2="98.44" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M176.66,190.53a.93.93,0,0,0,1.09,1.41c5.55-2.06,18.28-7.09,28.24-13.22,8.6-5.29,15.86-12.55,17.87-15.91a6.45,6.45,0,0,0,1-3.39V146.75a.39.39,0,0,0-.68-.27A76.27,76.27,0,0,1,203.88,162c-10.27,5.42-24.68,9.11-30.06,10.38a.83.83,0,0,0-.2,1.53l10.61,5.76Z" fill="#efefef" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="176.42" y1="110.31" x2="176.42" y2="111.81" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="176.42" y1="116.63" x2="176.42" y2="121.11" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" stroke-dasharray="2.07 4.82"/>\n' +
    '    <line x1="176.42" y1="123.51" x2="176.42" y2="125.01" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="177.66" y1="132.4" x2="178.75" y2="133.44" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="183.02" y1="137.53" x2="193.1" y2="147.19" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" stroke-dasharray="2.54 5.92"/>\n' +
    '    <line x1="195.24" y1="149.24" x2="196.32" y2="150.28" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M118.43,94.53h0A2.56,2.56,0,0,0,119,91L108,75.59a2.56,2.56,0,0,0-3.52-.55L16,138.2h0a2.56,2.56,0,0,0-.6,3.57l11,15.38h0a2.56,2.56,0,0,0,3.57.6Z" fill="#efefef"/>\n' +
    '    <path d="M67.69,101.48l37.08-26.39a2.56,2.56,0,0,1,3.52.55l11,15.38a2.56,2.56,0,0,1-.6,3.57h0L81.24,121.38" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M69.14,130l-39,27.79a2.56,2.56,0,0,1-3.57-.6h0l-11-15.38a2.56,2.56,0,0,1,.6-3.57h0l38.44-27.39" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <polyline points="48.55 93.95 27.29 107.94 15.72 138.19" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <polyline points="106.84 74.81 83.44 71.03 56.28 88.89" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <path d="M68.18,103l14.09,19.82a2.41,2.41,0,0,1-.77,2.23l-9,6.41a2.41,2.41,0,0,1-2.35,0L56.1,111.68l-8-18.82L55.57,88Z" fill="#e0e1e2" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <polygon points="169.65 36.73 153.29 34.59 156.75 8 131.76 40.12 148.13 42.24 144.67 68.83 169.65 36.73" fill="#fce895" stroke="#f7c34d" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="117.42" y1="34.12" x2="111.92" y2="31.72" fill="none" stroke="#f7c34d" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="124.57" y1="26.3" x2="121.68" y2="20.61" fill="none" stroke="#f7c34d" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '    <line x1="116.53" y1="44.68" x2="110.4" y2="46.43" fill="none" stroke="#f7c34d" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-ios.html',
    '<svg id="illo-ios" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">\n' +
    '	<path id="tile" d="M32,38H8a6,6,0,0,1-6-6V8A6,6,0,0,1,8,2H32a6,6,0,0,1,6,6V32A6,6,0,0,1,32,38Z" transform="translate(-2 -2.03)" fill="#9da2a8" stroke-width="0"/>\n' +
    '	<path id="leaf" d="M23.37,11a4.48,4.48,0,0,0,1.29-3.51A5.85,5.85,0,0,0,21,9.12a4.29,4.29,0,0,0-1.32,3.4A4.88,4.88,0,0,0,23.37,11Z" transform="translate(-2 -2.03)" fill="#fff" stroke-width="0"/>\n' +
    '	<path id="apple" d="M26,19.85a5.17,5.17,0,0,1,2.39-4.34,5.11,5.11,0,0,0-4-2.26c-1.72-.18-3.36,1-4.23,1s-2.22-1-3.65-1a5.39,5.39,0,0,0-4.57,2.86c-2,3.49-.5,8.65,1.4,11.48.93,1.39,2,2.94,3.49,2.88s1.93-.93,3.62-.93,2.17.93,3.65.91,2.46-1.41,3.38-2.8A12.73,12.73,0,0,0,29,24.46,5,5,0,0,1,26,19.85Z" transform="translate(-2 -2.03)" fill="#fff" stroke-width="0"/>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-macos.html',
    '<svg id="icon-macos" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">\n' +
    '	<path id="tile" d="M32,38H8a6,6,0,0,1-6-6V8A6,6,0,0,1,8,2H32a6,6,0,0,1,6,6V32A6,6,0,0,1,32,38Z" transform="translate(-2 -2.03)" fill="#9da2a8" stroke-width="0"/>\n' +
    '	<path id="leaf" d="M23.37,11a4.48,4.48,0,0,0,1.29-3.51A5.85,5.85,0,0,0,21,9.12a4.29,4.29,0,0,0-1.32,3.4A4.88,4.88,0,0,0,23.37,11Z" transform="translate(-2 -2.03)" fill="#fff" stroke-width="0"/>\n' +
    '	<path id="apple" d="M26,19.85a5.17,5.17,0,0,1,2.39-4.34,5.11,5.11,0,0,0-4-2.26c-1.72-.18-3.36,1-4.23,1s-2.22-1-3.65-1a5.39,5.39,0,0,0-4.57,2.86c-2,3.49-.5,8.65,1.4,11.48.93,1.39,2,2.94,3.49,2.88s1.93-.93,3.62-.93,2.17.93,3.65.91,2.46-1.41,3.38-2.8A12.73,12.73,0,0,0,29,24.46,5,5,0,0,1,26,19.85Z" transform="translate(-2 -2.03)" fill="#fff" stroke-width="0"/>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-people-search-no-result.html',
    '<svg id="illo-people-search-no-result" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">\n' +
    '	<path d="M136,113.47c-12,0-26,19.59-26.82,26.45l74,.58c-.79-6.69-17.15-27-27.41-27h-5.66v-3.15a28.58,28.58,0,0,0,25.52-24,7,7,0,0,0,6.16-7v-.83A7,7,0,0,0,176,71.57V65a28.54,28.54,0,0,0-28.45-28.45h-3.36A28.53,28.53,0,0,0,115.73,65v6.53a7,7,0,0,0-5.83,6.92v.83a7,7,0,0,0,6.16,7,28.58,28.58,0,0,0,25.52,24v3.15Z" style="fill:#fff;stroke:#ced2d6;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.600000023841858px"/>\n' +
    '	<path d="M163.8,114.74a25.48,25.48,0,0,1-13.93,4.14h-7.93A25.43,25.43,0,0,1,128,114.74a34.25,34.25,0,0,0-25.94,31.62h87.67A34.25,34.25,0,0,0,163.8,114.74Z" style="fill:#dcdfe2"/>\n' +
    '	<path d="M128,114.74h-.71l-.06,0h-.68l-.09,0h-.13c-.41.12-.81.25-1.21.39a1,1,0,0,0,.32,1.94.86.86,0,0,0,.32,0c.75-.25,1.52-.48,2.28-.67a1,1,0,0,0,.47.59,28.88,28.88,0,0,0,2.91,1.41,1.06,1.06,0,0,0,.38.07,1,1,0,0,0,.39-1.92l-.46-.2h0l-.05,0h0l0,0h-.22l-1.16-.56h0l0,0H130l0,0h0c-.15-.07-.29-.15-.43-.23a1.53,1.53,0,0,0-.27-.11.43.43,0,0,1,0-.05c-.41-.24-.81-.49-1.21-.75Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M121,117.42a1.11,1.11,0,0,0-.46.11l-.88.48h0l-.13.07h-.1l-.06,0h0l0,0h-.1l-.06,0H119l0,0h-.14l0,0h-.15l0,0h-.11l-.08,0h-.06s0,0,0,0h0l-.37.24a1,1,0,0,0,.54,1.84,1,1,0,0,0,.53-.15c.79-.5,1.62-1,2.45-1.41a1,1,0,0,0-.47-1.89Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M114.58,121.77a1,1,0,0,0-.65.24l-.57.5h0l-.11.1h-.08l-.07.07h0v0h0v0h0v0h0l-.06,0h0l0,0h0l0,0h0l0,0h0l-.08.07h0v0h0v0h0v0h0l-.08.07h0v0h0l-.12.12h0l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0c.65-.67,1.34-1.32,2-1.94a1,1,0,0,0-.66-1.75Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M109.35,127.48a1,1,0,0,0-.81.42c-.59.81-1.14,1.64-1.65,2.51a1,1,0,0,0,.35,1.37,1,1,0,0,0,.51.14,1,1,0,0,0,.86-.49c.48-.8,1-1.6,1.55-2.36a1,1,0,0,0-.23-1.4,1,1,0,0,0-.58-.19Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M105.57,134.25a1,1,0,0,0-.92.62c-.21.49-.4,1-.58,1.48h0v0h0v0h0v0h0s0,.09,0,.13h0v0h0v0h0v0h0v0h0v0h0l0,.09h0v0h0v0h0v0h0v0h0v0h0a.19.19,0,0,0,0,.07h0v0h0v0h0v0h0v0h0v0h0v0h0a.36.36,0,0,0,0,.11h0v0h0v0h0c0,.11-.06.21-.1.32a1,1,0,0,0,.66,1.25,1,1,0,0,0,.3.05,1,1,0,0,0,1-.7c.28-.9.61-1.79,1-2.66a1,1,0,0,0-.54-1.3.91.91,0,0,0-.39-.08Z" style="fill:#bdc2c6"/><path d="M103.45,141.71a1,1,0,0,0-1,.83v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0c-.08.61-.14,1.23-.18,1.85a1,1,0,0,0,.34.83h1.3a1,1,0,0,0,.35-.69c.07-.94.18-1.88.33-2.81a1,1,0,0,0-.83-1.15Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M109.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M117.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M125.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M133.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M141.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M149.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M157.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M165.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M173.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M181.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M189.24,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,.5-.14c0-.6-.08-1.2-.15-1.8a1,1,0,0,0-.35-.06Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M187.6,138.23a.82.82,0,0,0-.26,0,1,1,0,0,0-.7,1.23c.25.9.46,1.83.62,2.75a1,1,0,0,0,1,.82h.17a1,1,0,0,0,.81-1.16,1.55,1.55,0,0,0,0-.21h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v-.06h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0l0-.16h0v0h0v0h0c-.1-.45-.21-.89-.33-1.34a1,1,0,0,0-1-.74Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M184.71,131.05a1,1,0,0,0-.48.12,1,1,0,0,0-.4,1.36c.45.82.87,1.67,1.24,2.53a1,1,0,0,0,.92.6,1.14,1.14,0,0,0,.4-.08,1,1,0,0,0,.51-1.32,2.44,2.44,0,0,0-.1-.24h0v0h0v0h0v0h0v0h0v0h-.07a.54.54,0,0,0,0-.11h0v0h0v0h0v0h0c-.16-.35-.33-.69-.5-1H186l0-.06h-.09l0,0h0v0h0v0h-.05l-.2-.37a1,1,0,0,0-.88-.51Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M180.23,124.72a1,1,0,0,0-.66.25,1,1,0,0,0-.08,1.42c.63.69,1.23,1.43,1.79,2.18a1,1,0,0,0,.8.4,1,1,0,0,0,.6-.2,1,1,0,0,0,.2-1.4l-.41-.54h0v0h0v0h0l0,0h0l0,0h0v0h-.08l0-.06h-.07l-.09-.12h0c-.35-.43-.7-.84-1.06-1.24a1,1,0,0,0-.75-.33Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M174.42,119.59a1,1,0,0,0-.57,1.82c.77.53,1.53,1.11,2.25,1.71a1,1,0,0,0,.64.23,1,1,0,0,0,.77-.36,1,1,0,0,0-.13-1.41c-.33-.27-.65-.53-1-.79h0l0,0h0l-.09-.07h-.08v0h0l0,0h-.29l-.06,0h-.09l-.12-.09h0l-.55-.39a1.06,1.06,0,0,0-.57-.17Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M167.58,116a1,1,0,0,0-.93.64,1,1,0,0,0,.57,1.29c.87.34,1.74.72,2.58,1.13a1,1,0,0,0,.44.1,1,1,0,0,0,.45-1.89c-.27-.14-.54-.27-.82-.39h-.1l-.07,0h-.35l-.06,0h-.11c-.41-.18-.82-.35-1.24-.51a1.13,1.13,0,0,0-.36-.06Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M163.76,115a.94.94,0,0,0-.52.15l-.45.27h0l0,0h-.27l0,0h0l0,0h0c-.34.19-.69.38-1,.55h0l-.05,0h0l0,0h0l0,0h0l0,0h-.46a1,1,0,0,0,.42,1.9,1.06,1.06,0,0,0,.42-.09,27.71,27.71,0,0,0,2.84-1.53,1,1,0,0,0,.33-1.38,1,1,0,0,0-.86-.47Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M156.12,118.13a.85.85,0,0,0-.23,0l-.84.19h-.47c-.32.06-.64.12-1,.16h-.69a1,1,0,0,0,.12,2h.12a28.21,28.21,0,0,0,3.18-.57,1,1,0,0,0,.74-1.21,1,1,0,0,0-1-.77Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M147.94,118.88h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M136.78,118.37a1,1,0,0,0-.19,2,26.47,26.47,0,0,0,3.2.44h.08a1,1,0,0,0,1-.93,1,1,0,0,0-.92-1.07l-.26,0h-.18c-.8-.08-1.59-.19-2.37-.34H137l-.2,0Z" style="fill:#bdc2c6"/>\n' +
    '	<path d="M133.23,112.92l12.12,6.52a1.09,1.09,0,0,1,.37,1.57l-6.16,8.78a1.07,1.07,0,0,1-1.69.09l-11.7-13.31a1.08,1.08,0,0,1,.46-1.73l5.74-2A1,1,0,0,1,133.23,112.92Z" style="fill:#eff3f4;stroke:#ced2d6;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.600000023841858px;stroke-dasharray:3,4"/><path d="M158.58,112.93l-12.12,6.53a1.08,1.08,0,0,0-.37,1.56l6.16,8.79a1.08,1.08,0,0,0,1.69.09l11.7-13.32a1.07,1.07,0,0,0-.46-1.72l-5.74-2A1.08,1.08,0,0,0,158.58,112.93Z" style="fill:#eff3f4;stroke:#ced2d6;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.600000023841858px;stroke-dasharray:3,4"/>\n' +
    '	<path d="M178.85,54.66a27.85,27.85,0,0,0-2.76-7.92l0,0c-.3-.59-.5-.94-.5-.94h0a34.08,34.08,0,0,0-60.29,1.7l0,0a26.21,26.21,0,0,0-2.4,7.16,78.28,78.28,0,0,0,.23,19.54L118,75.68l6-21.84a51.4,51.4,0,0,0,23,5.09,51.24,51.24,0,0,0,23.2-5.2L175,75l3.6-.81S179.9,63.05,178.85,54.66Z" style="fill:#e3e6e8;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;stroke-dasharray:3,5"/>\n' +
    '	<path d="M62,29.85c-22.41,0-40.58,21.06-40.58,47v57.19h81.17V76.89C102.54,50.91,84.37,29.85,62,29.85Z" style="fill:#e3e6e8"/>\n' +
    '	<polyline points="21.37 132.58 21.37 134.08 22.87 134.08" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px"/>\n' +
    '	<line x1="27.94" y1="134.08" x2="98.5" y2="134.08" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;stroke-dasharray:3.0457000732421875,5.076200008392334"/>\n' +
    '	<polyline points="101.04 134.08 102.54 134.08 102.54 132.58" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px"/>\n' +
    '	<path d="M102.54,127.66V76.89c0-26-18.17-47-40.58-47s-40.59,21.06-40.59,47v53.23" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;stroke-dasharray:2.954699993133545,4.924499988555908"/><path d="M51.05,114.74c-19,0-29.68,19.74-29.68,26.1L100,141c0-6.49-8.09-26.23-27.14-26.23H66.35V112A29,29,0,0,0,91.8,91.26h1A6.63,6.63,0,0,0,93,78V62.89A27.86,27.86,0,0,0,65.18,35.12H58.73A27.85,27.85,0,0,0,31,62.89V78a6.65,6.65,0,0,0-6.5,6.62h0a6.65,6.65,0,0,0,6.63,6.63h1A29,29,0,0,0,57.56,112v2.79Z" style="fill:#fff;stroke:#ced2d6;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.600000023841858px"/>\n' +
    '	<path d="M94.53,63.3c-.17-3.65-.87-10-1-10.75a.66.66,0,0,0,0-.15c-4-11.21-14.64-20.19-27.07-20.19h-9c-12.44,0-23.06,9-27,20.22a.32.32,0,0,0,0,.09c-.13.63-1.66,8-1.66,11.17,0,2.77,0,17.11,0,20.58a.74.74,0,0,0,1.09.6l48.45-27a.77.77,0,0,1,1,.25c1.69,2.62,10,15.93,14.91,22,0,0,1,.55,1-.76C95.19,74,94.68,66.74,94.53,63.3Z" style="fill:#e3e6e8"/>\n' +
    '	<path d="M82,113.45a28.79,28.79,0,0,1-40.12,0A36.08,36.08,0,0,0,15,146.36h94A36.09,36.09,0,0,0,82,113.45Z" style="fill:#eff3f4"/>\n' +
    '	<path d="M41.89,113.45h-.48l-.13,0h-.37l-.21.06h-.37l-.12,0H39.8l-.77.26a1,1,0,0,0,.33,2,1,1,0,0,0,.33-.06c.78-.27,1.58-.52,2.38-.74a1,1,0,0,0,.32,1.08A30.68,30.68,0,0,0,45,118.45a1,1,0,0,0,1.09-1.67c-.4-.27-.8-.54-1.19-.83h0l0,0h-.15l0,0h0c-.34-.25-.66-.5-1-.76a1,1,0,0,0-.57-.22.83.83,0,0,0,.06-.21c-.44-.37-.85-.75-1.25-1.13Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M34.9,116.2a1,1,0,0,0-.46.11l-.83.44H33.4l0,0h-.23c-.44.25-.87.51-1.3.78a1,1,0,0,0,.54,1.85,1,1,0,0,0,.53-.16c.79-.5,1.62-1,2.46-1.4a1,1,0,0,0,.42-1.35,1,1,0,0,0-.88-.54Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M28.43,120.5a1,1,0,0,0-.64.24l-.1.08h0l-.18.15h-.07l0,0h0v0h0a.69.69,0,0,0-.13.11h-.12v0h0l-.11.1h0v0h0v0h0l0,0h0v0h0l-.13.11h0l0,0h0l0,0h-.05v0h0l-.15.13h0v0h0v0h0l0,0h0l-.09.08h-.19l0,0h0v0H25.9l0,0h0l-.28.28a1,1,0,0,0,0,1.42,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29c.67-.66,1.37-1.3,2.09-1.9a1,1,0,0,0,.13-1.41,1.06,1.06,0,0,0-.78-.36Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M23.06,126.11a1,1,0,0,0-.79.39c-.17.22-.34.44-.5.67h0v0h0l0,0h0c-.41.57-.81,1.15-1.2,1.75a1,1,0,0,0,.31,1.38,1,1,0,0,0,.54.16,1,1,0,0,0,.84-.46c.51-.79,1.05-1.57,1.63-2.32a1,1,0,0,0-.19-1.4,1,1,0,0,0-.61-.21Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M19.05,132.76a1,1,0,0,0-.91.58c-.41.91-.79,1.83-1.13,2.77a1,1,0,0,0,.6,1.28,1,1,0,0,0,.34.06,1,1,0,0,0,.94-.66c.32-.88.68-1.76,1.07-2.62a1,1,0,0,0-.49-1.32,1.06,1.06,0,0,0-.42-.09Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M16.62,140.12a1,1,0,0,0-1,.8c-.05.27-.11.55-.16.82h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0l0,.14h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0c0,.1,0,.21,0,.31h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0l0,.28A1,1,0,0,0,16,145h.12a1,1,0,0,0,.42-.09,1,1,0,0,0-.11.45,1,1,0,0,0,1,1h3a1,1,0,1,0,0-2h-3a.91.91,0,0,0-.41.09.9.9,0,0,0,.09-.33c.12-.93.27-1.87.46-2.79a1,1,0,0,0-.77-1.19l-.21,0Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M28.46,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#ced2d6"/><path d="M36.46,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,0,0,1-1,1,1,0,0,0-1-1Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M44.46,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M52.46,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#ced2d6"/><path d="M60.46,144.36h-3a1,1,0,0,0,0,2h3a1,1,0,1,0,0-2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M68.46,144.36h-3a1,1,0,1,0,0,2h3a1,1,0,0,0,1-1,1,1,0,0,0-1-1Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M76.46,144.36h-3a1,1,0,1,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M84.46,144.36h-3a1,1,0,1,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M92.46,144.36h-3a1,1,0,1,0,0,2h3a1,1,0,0,0,0-2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M100.46,144.36h-3a1,1,0,1,0,0,2h3a1,1,0,0,0,1-1,1,1,0,0,0-1-1Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M108.46,144.36h-3a1,1,0,1,0,0,2h3a1,1,0,0,0,.49-.13c0-.61-.08-1.21-.14-1.81a1,1,0,0,0-.35-.06Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M106.83,138.22a1.27,1.27,0,0,0-.26,0,1,1,0,0,0-.7,1.22c.24.91.45,1.84.61,2.76a1,1,0,0,0,1,.83l.17,0a1,1,0,0,0,.81-1.15c-.07-.41-.15-.8-.23-1.2h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0c-.11-.46-.22-.91-.34-1.36a1,1,0,0,0-1-.75Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M104,131a1,1,0,0,0-.47.11,1,1,0,0,0-.42,1.36c.44.83.86,1.69,1.22,2.55a1,1,0,0,0,.92.61,1.1,1.1,0,0,0,.4-.08,1,1,0,0,0,.52-1.31c-.29-.69-.6-1.36-.93-2h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0l0-.07H105v0h0l-.12-.23A1,1,0,0,0,104,131Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M99.61,124.59a1,1,0,0,0-.76,1.66c.62.71,1.21,1.46,1.76,2.22a1,1,0,0,0,.81.41,1,1,0,0,0,.81-1.58c-.59-.81-1.21-1.6-1.86-2.36a1,1,0,0,0-.76-.35Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M93.94,119.29a1,1,0,0,0-.6,1.8c.75.57,1.49,1.17,2.2,1.79a1,1,0,0,0,.66.25,1,1,0,0,0,.66-1.74c-.54-.48-1.1-1-1.67-1.4H95v0h0l-.48-.37a1,1,0,0,0-.6-.2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M87.25,115.35a1,1,0,0,0-.41,1.92c.86.38,1.71.81,2.53,1.26a1,1,0,0,0,.49.13,1,1,0,0,0,.48-1.88l-.37-.2h-.19l-.07,0h-.14c-.63-.33-1.27-.64-1.91-.93a1,1,0,0,0-.41-.09Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M82,113.45h0l0,0h0l0,0h0l0,0h0l-.11.11h0l0,0h0l0,0h0l0,0h0l0,0h-.23l0,0h0l0,0h0l-.44.39h0l0,0h0l0,0h-.12l-.17.14a1,1,0,0,0,.64,1.77,1,1,0,0,0,.64-.23c.26-.22.52-.44.77-.67h.12a1,1,0,0,0,1-.72,1,1,0,0,0-.67-1.24l-.94-.26h0Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M76.92,117.51a.93.93,0,0,0-.5.14h-.36l-.06,0h0l0,0h0c-.59.32-1.2.63-1.82.92h0l-.05,0h-.32a1,1,0,0,0-.5,1.33,1,1,0,0,0,.91.58,1,1,0,0,0,.41-.08c1-.44,1.93-.93,2.85-1.46a1,1,0,0,0-.5-1.87Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M69.29,120.64a.77.77,0,0,0-.25,0l-.44.11h-.2c-.47.11-1,.21-1.43.3h-.19l-.69.11a1,1,0,0,0,.16,2h.15a31.25,31.25,0,0,0,3.14-.65,1,1,0,0,0-.25-2Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M58,121.32a1,1,0,0,0-.13,2,28.57,28.57,0,0,0,3.2.27h0a1,1,0,0,0,0-2h-.5a22,22,0,0,1-2.31-.21h0l-.16,0Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M50.06,119.06a1,1,0,0,0-.92.6,1,1,0,0,0,.52,1.32,29.12,29.12,0,0,0,3,1.13.79.79,0,0,0,.3,0,1,1,0,0,0,.31-2c-.65-.21-1.29-.44-1.91-.69h-.12l0,0h-.07l-.65-.27a1,1,0,0,0-.4-.09Z" style="fill:#ced2d6"/>\n' +
    '	<path d="M95.15,74.64c0,.84,0,1.26,0,1.5" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px"/>\n' +
    '	<path d="M94.28,80.7a.69.69,0,0,1-.15-.07c-4.81-6-13-19.12-14.64-21.71a.77.77,0,0,0-1-.25L29.73,84.47a.74.74,0,0,1-1.08-.6s0-2,.05-4.11" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px;stroke-dasharray:3.095099925994873,5.1585001945495605"/>\n' +
    '	<path d="M28.73,77.19c0-.6,0-1.12,0-1.5" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2px"/>\n' +
    '	<line x1="28.29" y1="21.32" x2="31.19" y2="25.39" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px"/>\n' +
    '	<line x1="22.38" y1="28.71" x2="27.22" y2="29.96" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px"/>\n' +
    '	<line x1="37.2" y1="18.13" x2="36.81" y2="23.11" style="fill:none;stroke:#bdc2c6;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-people-search-start.html',
    '<svg id="illo-people-search-start" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96">\n' +
    '	<path d="M18.85,47.32c.26,0,.39.2.46.46A18.42,18.42,0,0,0,35.79,63.35a.51.51,0,0,1,.46.52V66a.56.56,0,0,1-.53.53H32.13A36.18,36.18,0,0,0,22.32,71H55.93c-2.61-1.9-6.14-3.27-10.79-4.51H41.41a.56.56,0,0,1-.52-.53V63.87a.51.51,0,0,1,.46-.52A18.35,18.35,0,0,0,57.83,47.78a.58.58,0,0,1,.46-.46A4.16,4.16,0,0,0,62,43.2v-.52a4.2,4.2,0,0,0-3.47-4.12A.54.54,0,0,1,58,38V33.72A18.39,18.39,0,0,0,39.65,15.34H37.49A18.39,18.39,0,0,0,19.11,33.72V38a.54.54,0,0,1-.45.52,4.2,4.2,0,0,0-3.41,4.12v.52A4.16,4.16,0,0,0,18.85,47.32Z" fill="#f9f9f9"/><path d="M27.62,67.27a21.58,21.58,0,0,0-16.09,20H65.81a21.44,21.44,0,0,0-16.09-20,15.57,15.57,0,0,1-8.63,2.62H36.18a14.86,14.86,0,0,1-8.56-2.62Z" fill="#aeb4b7"/>\n' +
    '	<path d="M18.79,47.85a19,19,0,0,0,17,16V65.9H32.13c-1.7.52-3.21,1.11-4.65,1.7h2.88c.59-.2,1.24-.46,1.9-.65h3.53a1,1,0,0,0,1.05-1V63.81a1.06,1.06,0,0,0-1-1.05,17.8,17.8,0,0,1-16-15,1,1,0,0,0-.91-.85,3.62,3.62,0,0,1-3.21-3.6v-.52a3.64,3.64,0,0,1,3-3.6,1,1,0,0,0,.85-1V33.79A18,18,0,0,1,37.49,15.87h2.22A17.88,17.88,0,0,1,57.57,33.72V38a1.11,1.11,0,0,0,.85,1,3.66,3.66,0,0,1,3,3.6v.52a3.61,3.61,0,0,1-3.21,3.6,1,1,0,0,0-.91.85,17.94,17.94,0,0,1-16,15.11,1.11,1.11,0,0,0-1,1.05V65.9a1,1,0,0,0,1.05,1H45c.79.19,1.57.45,2.29.65h3.27c-1.63-.59-3.4-1.18-5.43-1.7H41.35V63.81a19,19,0,0,0,17-16,4.72,4.72,0,0,0,4.12-4.65v-.52a4.65,4.65,0,0,0-3.85-4.58V33.79a19,19,0,0,0-18.91-18.9H37.49a19,19,0,0,0-18.9,18.9V38a4.64,4.64,0,0,0-3.86,4.58v.52A4.64,4.64,0,0,0,18.79,47.85Z" fill="#b5b9bc"/>\n' +
    '	<path d="M73.53,80.16a11.56,11.56,0,0,1-1.44.06A30.43,30.43,0,0,1,67.18,80" fill="none" stroke="#d7d9db" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="2 5"/><path d="M97.66,67.27a32,32,0,0,1-8,7.52" fill="none" stroke="#d7d9db" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="2 5"/>\n' +
    '	<path d="M103,38.63a33.8,33.8,0,0,1,1.24,7.84,31.87,31.87,0,0,1-.13,4.39" fill="none" stroke="#d7d9db" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="2 5"/><path d="M85.36,18a33.51,33.51,0,0,1,8.57,5.82" fill="none" stroke="#d7d9db" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="2 5"/>\n' +
    '	<path d="M59.47,16.72a28.59,28.59,0,0,1,6-1.44" fill="none" stroke="#d7d9db" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="2 5"/>\n' +
    '	<path d="M44.88,52.36a4.25,4.25,0,0,1-8.3.2" fill="none" stroke="#a0a5a8" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<path d="M27.35,68.78a16.87,16.87,0,0,0,8.83,2.48h4.91a16.87,16.87,0,0,0,8.83-2.48A20.32,20.32,0,0,1,64.37,86H13A20.23,20.23,0,0,1,27.35,68.78" fill="#ced2d6"/>\n' +
    '	<path d="M30.36,65.64l7.92,4.25a.74.74,0,0,1,.26,1l-4.06,5.76a.71.71,0,0,1-1.11.07l-7.65-8.7A.66.66,0,0,1,26.05,67l3.72-1.31A.49.49,0,0,1,30.36,65.64Z" fill="#b7babc" stroke="#a0a5a8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path d="M47,65.64l-7.91,4.25a.73.73,0,0,0-.26,1l4.05,5.76a.72.72,0,0,0,1.12.07l7.65-8.7A.67.67,0,0,0,51.29,67l-3.73-1.31A.6.6,0,0,0,47,65.64Z" fill="#b7babc" stroke="#a0a5a8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<ellipse cx="29.45" cy="39.15" rx="1.05" ry="1.31" fill="#a0a5a8"/>\n' +
    '	<ellipse cx="50.57" cy="39.15" rx="1.05" ry="1.31" fill="#a0a5a8"/>\n' +
    '	<path d="M59.53,24.7c-1.5-6-6.21-16-21.12-14.72-4.71.39-9.81,3.14-14.52,3.79a37.21,37.21,0,0,1-7.26.46s.13,2.09,3.07,6.28a20.71,20.71,0,0,0-1.11,2h0a21.26,21.26,0,0,0-1.37,5.3,51.73,51.73,0,0,0,0,12.09l3.14,1,3.92-14.26a41.78,41.78,0,0,0,11.25,4,64.54,64.54,0,0,0,19.68-.79l2.49,10.6,2.35-.53S61.17,29.54,59.53,24.7Z" fill="#b7babc" stroke="#a0a5a8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path d="M81.83,20.64H69a.58.58,0,0,1-.58-.59V11.62A.58.58,0,0,1,69,11H81.83a.58.58,0,0,1,.59.59V20A.6.6,0,0,1,81.83,20.64Z" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<polyline points="68.36 12.73 75.42 17.63 82.49 12.66" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<line x1="82.42" y1="20.05" x2="77.32" y2="16.32" fill="none" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<line x1="73.53" y1="16.32" x2="68.43" y2="20.05" fill="none" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<path d="M99.43,25c-4,0-7.2,2.55-7.2,5.75a5.56,5.56,0,0,0,2.16,4.06,4,4,0,0,1-2,1.89,5,5,0,0,0,3.66-.13,3.84,3.84,0,0,0,.78-.45,8.13,8.13,0,0,0,2.56.39c4,0,7.19-2.55,7.19-5.76S103.35,25,99.43,25Z" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<circle cx="99.43" cy="30.78" r="0.72" fill="#a0c96b"/>\n' +
    '	<circle cx="96.55" cy="30.78" r="0.72" fill="#a0c96b"/>\n' +
    '	<circle cx="102.3" cy="30.71" r="0.72" fill="#a0c96b"/>\n' +
    '	<polyline points="100.14 62.24 95.83 64.07 95.83 53.34 100.14 51.51" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<polyline points="104.66 53.34 108.91 51.51 108.91 62.24 104.66 64.07" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<polygon points="100.14 62.24 104.46 64.07 104.46 53.34 100.14 51.51 100.14 62.24" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<path d="M86,75.19H82.09a.59.59,0,0,1-.58-.59V71.92a.58.58,0,0,1,.58-.59H86a.58.58,0,0,1,.59.59V74.6C86.67,74.92,86.35,75.19,86,75.19Z" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<path d="M90.66,84.08H86.74a.58.58,0,0,1-.59-.59V80.81a.58.58,0,0,1,.59-.59h3.92a.58.58,0,0,1,.59.59v2.68A.58.58,0,0,1,90.66,84.08Z" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<path d="M81.44,84.08H77.52a.58.58,0,0,1-.59-.59V80.81a.58.58,0,0,1,.59-.59h3.92a.58.58,0,0,1,.59.59v2.68A.58.58,0,0,1,81.44,84.08Z" fill="#e3f2a5" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<line x1="84.06" y1="75.38" x2="84.06" y2="77.61" fill="none" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '	<polyline points="88.63 80.09 88.63 77.8 79.61 77.8 79.48 77.8 79.48 80.09" fill="none" stroke="#a0c96b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-shake.html',
    '<svg id="illo-shake" xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">\n' +
    '	<circle cx="149.83" cy="129.58" r="5.13" transform="matrix(0.81, -0.58, 0.58, 0.81, -47.38, 110.97)" fill="#fff"/>\n' +
    '	<path d="M89.34,171.37l18.12-26s7.5,4.65,11.43,6.44,8.71,2.24,12.45.1c2.7-1.54,4.53-4.2,6.25-6.79q5.76-8.65,11.16-17.53s5.21-17.66,1-29.43c-2.22-6.25-11.45-15.24-19.62-22.3h0c-7.22-6.24-39.5-26.4-44.91-26.33-3.46,0-8.86,2.88-10.64,5.85C67,68.16,63.55,71.1,56.35,84.91c-2.35,4.51-2.73,11.55-1.6,15,.85,2.59,3,7.57,5,9.51,4.43,4.5,6.67,5.93,13.86,10.89l-.69,1-18.12,26" fill="#efefef" stroke="#b0b0b0" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M182.37,120.47l-50.75,36.15a4,4,0,0,1-5.58-.94L55.4,56.5a4,4,0,0,1,.94-5.58l50.75-36.15a4,4,0,0,1,5.58.94l70.65,99.18A4,4,0,0,1,182.37,120.47Z" fill="#f2ebce" stroke="#b7ab97" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M162,106.74l-36.46,26a3,3,0,0,1-4.18-.7l-50-70.23A3,3,0,0,1,72,57.6l36.46-26a3,3,0,0,1,4.18.7l50,70.23A3,3,0,0,1,162,106.74Z" fill="#fff" stroke="#b7ab97" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M110,46.44h0a12.3,12.3,0,0,1,.93-17.31l10.51-9.44a12.3,12.3,0,0,1,17.31.93h0a12.3,12.3,0,0,1-.93,17.31l-10.51,9.44A12.29,12.29,0,0,1,110,46.44Z" fill="#efefef" stroke="#b0b0b0" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M125.46,66.82h0a12.81,12.81,0,0,1,1-18l12.9-11.58a12.81,12.81,0,0,1,18,1h0a12.81,12.81,0,0,1-1,18l-12.9,11.58A12.81,12.81,0,0,1,125.46,66.82Z" fill="#efefef" stroke="#b0b0b0" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M140.2,86.36h0a11.73,11.73,0,0,1,.89-16.51l11.79-10.59a11.73,11.73,0,0,1,16.51.89h0a11.73,11.73,0,0,1-.89,16.51L156.72,87.25A11.73,11.73,0,0,1,140.2,86.36Z" fill="#efefef" stroke="#b0b0b0" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M153.2,105h0A11,11,0,0,1,154,89.48L162.4,82a11,11,0,0,1,15.52.83h0a11,11,0,0,1-.84,15.52l-8.36,7.5A11,11,0,0,1,153.2,105Z" fill="#efefef" stroke="#b0b0b0" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M74.13,122.57c-6.76-5-7.72-4.68-13.93-10.4A24.53,24.53,0,0,1,52.94,98.6,34.2,34.2,0,0,1,57,78.93C64,66.32,66,66.57,73.83,54.51c1.83-2.8,3.88-5.79,7.06-6.85,3.82-1.27,7.91.67,11.39,2.71,7.5,4.4,14.89,10.82,18,14.72,1,1.27,3.91,6.87,2.4,9.29-2.64,4.24-5,6.19-10,6.27s-10.39-2.31-15.44-6.71c-1.09,4.65,3.5,12.8,3.53,17.57,0,5.08-1.05,9.67-3.32,15.71" fill="#efefef" stroke="#b0b0b0" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<circle cx="149.83" cy="128.47" r="5.24" transform="translate(-46.74 110.76) rotate(-35.46)" fill="#fff" stroke="#b7ab97" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<line x1="83.51" y1="39.53" x2="89.35" y2="35.32" fill="none" stroke="#b7ab97" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M210.51,105.33a26,26,0,0,1-6.65,36.14" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M197.66,113.39a12.45,12.45,0,0,1-3.19,17.32" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M43.2,21.46A26,26,0,0,0,29.47,55.54" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M49.74,35.14a12.46,12.46,0,0,0-6.58,16.34" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-start-search.html',
    '<svg id="illo-start-search" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">\n' +
    '	<path d="M166.81,6.94A25.51,25.51,0,0,0,147,44.71c-.95,4.65-4.12,8-8.69,10.36a27.48,27.48,0,0,0,18.27-.7A25.5,25.5,0,1,0,166.81,6.89Z" fill="#c2e1f9" stroke="#669cdd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<polyline points="99.95 147.66 99.95 140.75 93.34 140.75 93.34 147.66" fill="#e0e1e2"/>\n' +
    '	<path d="M144.15,149h.19a6.93,6.93,0,0,1,11.35-6.56,9.07,9.07,0,0,1,17.5,4.54,6.84,6.84,0,0,1,.06,13.62,5.77,5.77,0,0,1-1,.1h-28.1a5.87,5.87,0,0,1-5.85-5.85h0A5.86,5.86,0,0,1,144.15,149Z" fill="#fff" stroke="#e0e0e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<circle cx="96.64" cy="94.87" r="44.69" fill="#fff" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M102.35,149.53,106.64,185a1,1,0,0,1,0,.11c0,4.47-4.52,8.12-10,8.12s-10-3.65-10-8.12a1,1,0,0,1,0-.11l4.29-35.43a1,1,0,0,1,1.09-.81h9.23A1,1,0,0,1,102.35,149.53Z" fill="#d7dadd" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<circle cx="96.64" cy="94.87" r="44.69" fill="#efefef" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<circle cx="96.64" cy="94.88" r="35.9" fill="#fff" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M82.53,169.51h-.24A9,9,0,0,0,67.58,161a11.75,11.75,0,0,0-22.68,5.89,8.87,8.87,0,0,0-.08,17.65,7.52,7.52,0,0,0,1.35.12H82.53a7.6,7.6,0,0,0,7.58-7.58h0A7.6,7.6,0,0,0,82.53,169.51Z" fill="#fff" stroke="#bac1c6" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M70.19,94.87A26.45,26.45,0,0,1,96.64,68.42h0" fill="#fff" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M32.31,123.17h-.14a5.4,5.4,0,0,0,.1-1,5.34,5.34,0,0,0-8.85-4,7,7,0,0,0-13.49,3.5,5.27,5.27,0,0,0,0,10.5,4.53,4.53,0,0,0,.8.07H32.31a4.52,4.52,0,0,0,4.51-4.51h0a4.52,4.52,0,0,0-4.48-4.56Z" fill="#fff" stroke="#e0e0e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<path d="M165.76,37.75V36.3a6.41,6.41,0,0,1,.8-3.26,10.5,10.5,0,0,1,2.93-3,12.23,12.23,0,0,0,2.7-2.38,3.45,3.45,0,0,0,.65-2,2.22,2.22,0,0,0-.94-1.93,4.47,4.47,0,0,0-2.62-.66A15,15,0,0,0,162.6,25l-2.13-4.27a18.6,18.6,0,0,1,9.23-2.44,9.82,9.82,0,0,1,6.39,1.93,6.31,6.31,0,0,1,2.4,5.11,6.85,6.85,0,0,1-1,3.71,13.91,13.91,0,0,1-3.71,3.51,11.48,11.48,0,0,0-2.35,2.1,3.27,3.27,0,0,0-.5,1.89v1.17Z" fill="#669cdd"/>\n' +
    '	<path d="M165.14,44.43a3.27,3.27,0,0,1,.88-2.48,3.56,3.56,0,0,1,2.56-.84,3.46,3.46,0,0,1,2.51.86,3.79,3.79,0,0,1,0,4.89,3.4,3.4,0,0,1-2.5.89,3.5,3.5,0,0,1-2.54-.87A3.25,3.25,0,0,1,165.14,44.43Z" fill="#669cdd"/>\n' +
    '	<line x1="51.75" y1="53.08" x2="47.87" y2="48.51" fill="none" stroke="#669cdd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<line x1="46.31" y1="62.19" x2="40.03" y2="61.06" fill="none" stroke="#669cdd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<line x1="60.6" y1="48.44" x2="60.53" y2="42.83" fill="none" stroke="#669cdd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<line x1="93.34" y1="140.03" x2="93.34" y2="148.03" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<line x1="99.95" y1="148.03" x2="99.95" y2="140.03" fill="none" stroke="#abb1b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>\n' +
    '	<rect width="200" height="200" fill="none"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/illo-windows.html',
    '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">\n' +
    '	<path id="tile" d="M32,2H8A6,6,0,0,0,2,8V32a6,6,0,0,0,6,6H32a6,6,0,0,0,6-6V8A6,6,0,0,0,32,2Z" transform="translate(-2 -2)" fill="#00a1f1" stroke-width="0"/>\n' +
    '	<path id="window4" d="M17.2,28.35,9,27.25V20.44c2.71,0,5.42.07,8.2,0Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<path id="window3" d="M17.2,19.56c-2.78,0-5.49.07-8.2.07V12.82c2.71-.44,5.42-.81,8.2-1.1Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<path id="window2" d="M29,29.6V30c-3.59-.59-7.25-1-10.84-1.54v-8H29Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '	<path id="window1" d="M29,10.11v9.38c-3.59,0-7.25.07-10.84.07v-8C21.75,11,25.41,10.48,29,10Z" transform="translate(-2 -2)" fill="#fff" stroke-width="0"/>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-bell.html',
    '<svg id="tips-bell" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">\n' +
    '    <path d="M9,3a1,1,0,0,0,0-.24A1.12,1.12,0,0,0,8,1.6,1.12,1.12,0,0,0,7,2.79,1,1,0,0,0,7,3Zm.16,9.68a1.23,1.23,0,0,1,.29.78A1.38,1.38,0,0,1,8,14.79a1.38,1.38,0,0,1-1.45-1.3,1.18,1.18,0,0,1,.29-.78Zm-6.61-.06A4.68,4.68,0,0,1,4.36,9.37V6.66a3.64,3.64,0,0,1,7.28,0V9.38a4.68,4.68,0,0,1,1.81,3.27Z" fill="none" stroke="#6c747d" stroke-miterlimit="10"/>\n' +
    '    <rect width="16" height="16" fill="none"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-bookmark.html',
    '<svg id="tips-bookmark" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\n' +
    '    <path d="M8,11.5,13.5,15V1.73A.76.76,0,0,0,12.77,1H3.23a.79.79,0,0,0-.73.75V15Z" fill="none" stroke="#6c747d" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-bookmarks-desktop.html',
    '<svg id="tips-bookmarks-desktop" xmlns="http://www.w3.org/2000/svg" width="270" height="215" viewBox="0 0 270 215">\n' +
    '	<path d="M249.7,186.67H19.56a4.18,4.18,0,0,1-4.2-4.2V21.16a4.18,4.18,0,0,1,4.2-4.2H249.74a4.18,4.18,0,0,1,4.2,4.2V182.42A4.28,4.28,0,0,1,249.7,186.67Z" fill="#f4f6f9"/>\n' +
    '	<path d="M253.9,43.73H15.36V22.18a4.83,4.83,0,0,1,4.84-4.84H249.11a4.83,4.83,0,0,1,4.84,4.84V43.73Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M249.7,187H19.56a4.18,4.18,0,0,1-4.2-4.2V21.5a4.18,4.18,0,0,1,4.2-4.2H249.74a4.18,4.18,0,0,1,4.2,4.2V182.76A4.24,4.24,0,0,1,249.7,187Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M193.16,29.14H76.1a.91.91,0,0,1-.85-1V23.33a.91.91,0,0,1,.85-1H193.16a.91.91,0,0,1,.85,1v4.84A.91.91,0,0,1,193.16,29.14Z" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.5"/>\n' +
    '	<circle cx="238.8" cy="26.13" r="3.77" fill="#eff0f4" opacity="0.8" style="isolation:isolate" />\n' +
    '	<rect x="110.75" y="34.69" width="23.75" height="5.09" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="146.38" y="34.69" width="18.66" height="5.09" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="107.71" y="43.26" width="29.82" height="0.94" fill="#00adf5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M72.49,87.46h-24a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1H72.53a1.12,1.12,0,0,1,1.1,1.1V86.36A1.13,1.13,0,0,1,72.49,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M110.5,87.46H86.4a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,110.5,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M148.46,87.46H124.36a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,148.46,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M186.42,87.46H162.33a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,186.42,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M224.38,87.46H200.29a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.09,1.09,0,0,1,224.38,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M72.49,131.7h-24a1.12,1.12,0,0,1-1.1-1.1V98.87a1.12,1.12,0,0,1,1.1-1.1H72.53a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,72.49,131.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M128.86,159.65H86.15a2,2,0,0,1-2-2V99.93a2,2,0,0,1,2-2h42.71a2,2,0,0,1,2,2v57.73A2,2,0,0,1,128.86,159.65Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="93.87" y="139.42" width="27.27" height="6.36" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<circle cx="118.6" cy="103.02" r="0.89" fill="#d4d9dd"/>\n' +
    '	<circle cx="121.99" cy="103.02" r="0.89" fill="#d4d9dd"/>\n' +
    '	<circle cx="125.43" cy="103.02" r="0.89" fill="#d4d9dd"/>\n' +
    '	<path d="M114.65,129.19H101.42A2.46,2.46,0,0,1,99,126.73v-12.3a2.46,2.46,0,0,1,2.46-2.46h13.23a2.46,2.46,0,0,1,2.46,2.46v12.3A2.46,2.46,0,0,1,114.65,129.19Z" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M117.11,118.93H99v-4.5a2.46,2.46,0,0,1,2.46-2.46h13.23a2.46,2.46,0,0,1,2.46,2.46v4.5Z" fill="#e1e5ea"/>\n' +
    '	<path d="M111,119.23l3.35,1.91a.38.38,0,0,0,.55-.34v-10a.56.56,0,0,0-.55-.55h-7.13a.56.56,0,0,0-.55.55v10a.37.37,0,0,0,.55.34l3.35-1.91A.73.73,0,0,1,111,119.23Z" fill="#fff"/>\n' +
    '	<path d="M111,118.25l2.67,1.53a.31.31,0,0,0,.47-.25v-8a.46.46,0,0,0-.42-.47H108a.44.44,0,0,0-.42.47v8a.31.31,0,0,0,.47.25l2.67-1.53C110.75,118.17,110.88,118.17,111,118.25Z" fill="#e1e5ea"/>\n' +
    '	<path d="M212.37,199.67H124.71A2.72,2.72,0,0,1,122,197V112.39a2.72,2.72,0,0,1,2.72-2.72h87.61a2.72,2.72,0,0,1,2.72,2.72V197A2.65,2.65,0,0,1,212.37,199.67Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="153.69" y="126.18" width="33.44" height="10.32" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="153.69" y="149.77" width="48.63" height="10.32" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="153.69" y="173.36" width="40.33" height="10.32" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M138,126.65h-3.71a.52.52,0,0,0-.52.52v8.63a.52.52,0,0,0,.52.52H143a.52.52,0,0,0,.52-.52v-3.71" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="138.54" y1="131.57" x2="144.78" y2="125.33" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<polyline points="139.72 125.05 145.06 125.05 145.06 130.35" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="135.82" y1="151.6" x2="141.17" y2="151.6" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="135.82" y1="153.8" x2="138.78" y2="153.8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<path d="M142.34,149.11h-7.74a.57.57,0,0,0-.56.56v9.52a.58.58,0,0,0,.61.56h4.74v-3.56H143v-6.47A.62.62,0,0,0,142.34,149.11Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="139.39" y1="159.76" x2="142.95" y2="156.2" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<path d="M143,173.88v9a1.25,1.25,0,0,1-1.22,1.27h-6.47a1.22,1.22,0,0,1-1.22-1.27v-9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="132.87" y1="173.88" x2="144.13" y2="173.88" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="138.5" y1="176.46" x2="138.5" y2="181.57" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="140.75" y1="176.46" x2="140.75" y2="181.57" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<line x1="136.25" y1="176.46" x2="136.25" y2="181.57" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<polyline points="135.45 173.88 136.57 172 140.42 172 141.55 173.88" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-bookmarks-phone.html',
    '<svg id="illo-bookmarks-phone" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="610" height="580" viewBox="0 0 610 580">\n' +
    '	<defs>\n' +
    '		<linearGradient id="linear-gradient" x1="150.9" y1="99.95" x2="268.9" y2="99.95" gradientTransform="matrix(1, 0, 0, -1, 0, 436)" gradientUnits="userSpaceOnUse">\n' +
    '		<stop offset="0" stop-color="#00adf5" stop-opacity="0.1"/>\n' +
    '		<stop offset="0.24" stop-color="#0ba0e6" stop-opacity="0.08"/><stop offset="0.71" stop-color="#1d8bce" stop-opacity="0.03"/>\n' +
    '		<stop offset="1" stop-color="#2483c5" stop-opacity="0"/>\n' +
    '		</linearGradient>\n' +
    '	</defs>\n' +
    '	<path id="phone-bg" d="M334.2,434.1H15.5L14.2,101.3a55.16,55.16,0,0,1,55-55H278a55.16,55.16,0,0,1,55,55Z" fill="#f2f3f7"/>\n' +
    '	<path id="page-bg" d="M311.1,433.7H37.4V137.5a7.55,7.55,0,0,1,7.5-7.5H303.7a7.55,7.55,0,0,1,7.5,7.5Z" fill="#fafbfc"/>\n' +
    '	<path id="masthead" d="M311.1,210.2H37.4V137.6a8,8,0,0,1,8-8H303.1a8,8,0,0,1,8,8Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<path id="tile1" d="M120.4,316.7H52.9a3.8,3.8,0,0,1-3.8-3.8v-87a3,3,0,0,1,3-3h68.3a3.8,3.8,0,0,1,3.8,3.8h0V313A3.92,3.92,0,0,1,120.4,316.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path id="tile2" d="M208,316.7H140.5a3.8,3.8,0,0,1-3.8-3.8v-87a3,3,0,0,1,3-3H208a3.8,3.8,0,0,1,3.8,3.8h0V313A3.85,3.85,0,0,1,208,316.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path id="tile3" d="M295.6,316.7H228.1a3.8,3.8,0,0,1-3.8-3.8v-87a3,3,0,0,1,3-3h68.3a3.8,3.8,0,0,1,3.8,3.8V313A3.78,3.78,0,0,1,295.6,316.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path id="tile4" d="M120.4,422.3H52.9a3.8,3.8,0,0,1-3.8-3.8v-87a3,3,0,0,1,3-3h68.3a3.8,3.8,0,0,1,3.8,3.8v86.3A3.92,3.92,0,0,1,120.4,422.3Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path id="tile5" d="M208,422.3H140.5a3.8,3.8,0,0,1-3.8-3.8v-87a3,3,0,0,1,3-3H208a3.8,3.8,0,0,1,3.8,3.8v86.3A3.85,3.85,0,0,1,208,422.3Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path id="catalog" d="M238.9,184.7H113.3a14.08,14.08,0,0,1-14.1-14.06s0,0,0,0h0a14.08,14.08,0,0,1,14.06-14.1H238.9A14.08,14.08,0,0,1,253,170.56s0,0,0,0h0a14.08,14.08,0,0,1-14.06,14.1Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<path id="bookmark-border" d="M168.6,189.4H114.2a18.78,18.78,0,0,1-18.8-18.76s0,0,0,0h0a18.78,18.78,0,0,1,18.76-18.8H168.6a18.78,18.78,0,0,1,18.8,18.76s0,0,0,0h0a18.78,18.78,0,0,1-18.76,18.8Z" fill="#fff"/>\n' +
    '	<path id="bookmark" d="M168.6,185.7H114.2a15,15,0,0,1-15-15h0a15,15,0,0,1,15-15h54.4a15,15,0,0,1,15,15h0A15,15,0,0,1,168.6,185.7Z" fill="#dce0e5"/>\n' +
    '	<circle id="middle_circle" data-name="middle circle" cx="150.9" cy="308.3" r="17" fill="none" stroke="#00adf5" stroke-miterlimit="10" stroke-width="3" opacity="0.1" style="isolation:isolate"/>\n' +
    '	<circle id="inner_circle" data-name="inner circle" cx="150.9" cy="308.3" r="13" fill="#00adf5" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<circle id="outer_circle" data-name="outer circle" cx="150.9" cy="308.3" r="23" fill="none" stroke="#00adf5" stroke-miterlimit="10" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<path id="phone_top_dropshadow" data-name="phone top dropshadow" d="M15.5,434.1,14.2,101.3a55.16,55.16,0,0,1,55-55H278a55.16,55.16,0,0,1,55,55l1.2,332.8" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path id="left-border" d="M37.4,433.7V137.5a7.55,7.55,0,0,1,7.5-7.5H303.7a7.55,7.55,0,0,1,7.5,7.5V433.8" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<polygon id="zoom_light" data-name="zoom light" points="150.9 308.3 268.9 136.4 268.9 535.7 150.9 308.3" fill="url(#linear-gradient)"/>\n' +
    '	<path id="_2nd_phone_white_border" data-name=" 2nd phone white border" d="M602.2,530.7H243.6l-1.4-361.5c0-32.9,27.8-59.7,61.9-59.7H539c34,0,61.9,26.9,61.9,59.7Z" fill="#fff"/>\n' +
    '	<path id="_2nd_phone_bg" data-name=" 2nd phone bg" d="M592.9,531.7h-340l-1.3-354.9a58.75,58.75,0,0,1,58.6-58.6H532.9a58.75,58.75,0,0,1,58.6,58.6Z" fill="#f2f3f7"/>\n' +
    '	<path id="_2nd_phone_grey_border" data-name=" 2nd phone grey border" d="M252.9,531.7l-1.3-357.6c0-30.8,27.6-56,61.4-56H530.2c33.8,0,61.4,25.2,61.4,56l1.3,357.6" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path id="masthead2" d="M568.2,292.9h-292V215.5a8.6,8.6,0,0,1,8.6-8.6H559.7a8.6,8.6,0,0,1,8.6,8.6Z" fill="#fff"/>\n' +
    '	<path id="_2nd_catalog" data-name=" 2nd catalog" d="M491.2,265.7h-134a15,15,0,0,1-15-15h0a15,15,0,0,1,15-15h134a15,15,0,0,1,15,15h0a15,15,0,0,1-15,15Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<path id="_2nd_bookmark_border" data-name=" 2nd bookmark border" d="M416.2,270.7h-58a20.06,20.06,0,0,1-20-20h0a20.06,20.06,0,0,1,20-20h58a20.06,20.06,0,0,1,20,20h0A20,20,0,0,1,416.2,270.7Z" fill="#fff"/>\n' +
    '	<path id="_2nd_bookmark" data-name=" 2nd bookmark" d="M416.2,266.7h-58a16,16,0,0,1-16-16h0a16,16,0,0,1,16-16h58a16,16,0,0,1,16,16h0A16,16,0,0,1,416.2,266.7Z" fill="#dce0e5"/>\n' +
    '	<path id="_2nd_masthead" data-name=" 2nd masthead" d="M569.2,530.8h-294v-317a8,8,0,0,1,8-8H561.1a8,8,0,0,1,8,8l.1,317Z" fill="#5e7499" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<path id="context-whitebg" d="M568.2,531.8h-292V299.4a11.61,11.61,0,0,1,11.6-11.6H556.6a11.61,11.61,0,0,1,11.6,11.6V531.8Z" fill="#fff"/>\n' +
    '	<path id="context-border" d="M276.2,531.8V299.4a11.61,11.61,0,0,1,11.6-11.6H556.6a11.61,11.61,0,0,1,11.6,11.6V531.8h0" fill="none" stroke="#d5dce2" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<rect id="open_text" data-name="open text" x="363.2" y="387.5" width="109.5" height="24" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M318.9,388.1h-9.2a1.32,1.32,0,0,0-1.3,1.3v21.5a1.32,1.32,0,0,0,1.3,1.3h21.5a1.32,1.32,0,0,0,1.3-1.3v-9.2" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="320.2" y1="400.3" x2="335.6" y2="384.8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<polyline points="323.1 384.1 336.4 384.1 336.4 397.3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<rect id="details_text" data-name="details text" x="363.2" y="437.8" width="164.8" height="24" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<line x1="313.3" y1="441.3" x2="327.4" y2="441.3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="313.3" y1="447.1" x2="321.2" y2="447.1" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path d="M330.5,434.8H310a1.47,1.47,0,0,0-1.5,1.44s0,0,0,.06v24.9a1.56,1.56,0,0,0,1.6,1.5h12.5v-9.4H332V436.2a1.39,1.39,0,0,0-1.38-1.4Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="322.7" y1="462.8" x2="332.1" y2="453.4" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<rect id="trash_text" data-name="trash text" x="363.2" y="488.1" width="132" height="24" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M331.5,488.8v22.3a3.14,3.14,0,0,1-3.08,3.2H312.3a3.14,3.14,0,0,1-3.1-3.18V488.8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="306.4" y1="488.8" x2="334.4" y2="488.8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="320.4" y1="495.2" x2="320.4" y2="507.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="325.9" y1="495.2" x2="325.9" y2="507.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="314.8" y1="495.2" x2="314.8" y2="507.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<polyline points="312.8 488.8 315.6 484 325.1 484 327.9 488.8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path d="M344.7,357.4h-32a6,6,0,0,1-6-6v-30a6,6,0,0,1,6-6h32a6,6,0,0,1,6,6v30A6,6,0,0,1,344.7,357.4Z" fill="#00adf5" opacity="0.3" style="isolation:isolate"/>\n' +
    '	<path d="M350.7,332.4h-44v-11a6,6,0,0,1,6-6h32a6,6,0,0,1,6,6Z" fill="#00adf5" opacity="0.4" style="isolation:isolate"/>\n' +
    '	<path d="M334.7,332.4l8.2,4.7a.93.93,0,0,0,1.4-.8V312.1a1.37,1.37,0,0,0-1.34-1.4H325.6a1.43,1.43,0,0,0-1.4,1.4v24.2a1,1,0,0,0,1.4.8l8.2-4.7A.75.75,0,0,1,334.7,332.4Z" fill="#fff"/>\n' +
    '	<path d="M334.6,329.9l6.5,3.7a.73.73,0,0,0,1.1-.6V313.7a1.11,1.11,0,0,0-1.1-1.1H327.3a1.11,1.11,0,0,0-1.1,1.1V333a.7.7,0,0,0,1.1.6l6.5-3.7A1.1,1.1,0,0,1,334.6,329.9Z" fill="#00adf5" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect id="app_desc" data-name="app desc" x="380.1" y="325" width="132" height="24" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '</svg>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-bookmarks-tablet.html',
    '<svg id="illo-bookmarks-tablet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="610" height="585" viewBox="0 0 610 585">\n' +
    '	<defs>\n' +
    '		<linearGradient id="linear-gradient" x1="131.1" y1="974.75" x2="249" y2="974.75" gradientTransform="matrix(1, 0, 0, -1, 0, 1272)" gradientUnits="userSpaceOnUse">\n' +
    '			<stop offset="0" stop-color="#00adf5" stop-opacity="0.1"/>\n' +
    '			<stop offset="0.24" stop-color="#0ba0e6" stop-opacity="0.08"/>\n' +
    '			<stop offset="0.71" stop-color="#1d8bce" stop-opacity="0.03"/>\n' +
    '			<stop offset="1" stop-color="#2483c5" stop-opacity="0"/>\n' +
    '		</linearGradient>\n' +
    '	</defs>\n' +
    '	<path d="M305.8,447.8H41A32.61,32.61,0,0,1,8.4,415.2V38.2A32.61,32.61,0,0,1,41,5.6H305.8a32.61,32.61,0,0,1,32.6,32.6v377A32.61,32.61,0,0,1,305.8,447.8Z" fill="#f2f3f7"/>\n' +
    '	<path d="M305.8,448.8H41A32.61,32.61,0,0,1,8.4,416.2V39.2A32.61,32.61,0,0,1,41,6.6H305.8a32.61,32.61,0,0,1,32.6,32.6v377A32.61,32.61,0,0,1,305.8,448.8Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M310.6,394.9H35.1a6.66,6.66,0,0,1-6.6-6.6V54.6A6.66,6.66,0,0,1,35.1,48H310.6a6.66,6.66,0,0,1,6.6,6.6V388.2A6.62,6.62,0,0,1,310.6,394.9Z" fill="#fafbfc"/>\n' +
    '	<path d="M317.2,107.4H28.5V55.8a7.7,7.7,0,0,1,7.7-7.7H309.5a7.7,7.7,0,0,1,7.7,7.7v51.6Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M231,88.4H118a11.07,11.07,0,0,1-11.1-11.1h0A11.07,11.07,0,0,1,118,66.2H231a11.07,11.07,0,0,1,11.1,11.1h0A11,11,0,0,1,231,88.4Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<path d="M169.6,92.1H118.5a14.87,14.87,0,0,1-14.9-14.9h0a14.87,14.87,0,0,1,14.9-14.9h51.1a14.87,14.87,0,0,1,14.9,14.9h0A14.94,14.94,0,0,1,169.6,92.1Z" fill="#fff"/>\n' +
    '	<path d="M169.2,89.1H118.7a11.86,11.86,0,0,1-11.9-11.9h0a11.86,11.86,0,0,1,11.9-11.9h50.5a11.86,11.86,0,0,1,11.9,11.9h0A11.86,11.86,0,0,1,169.2,89.1Z" fill="#dce0e5"/>\n' +
    '	<path d="M95.1,192H46.7a2.22,2.22,0,0,1-2.2-2.2V126.6a2.22,2.22,0,0,1,2.2-2.2H95.1a2.22,2.22,0,0,1,2.2,2.2v63.2A2.22,2.22,0,0,1,95.1,192Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M163.1,192H114.7a2.22,2.22,0,0,1-2.2-2.2V126.6a2.22,2.22,0,0,1,2.2-2.2h48.4a2.22,2.22,0,0,1,2.2,2.2v63.2A2.1,2.1,0,0,1,163.1,192Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M231.1,192H182.7a2.22,2.22,0,0,1-2.2-2.2V126.6a2.22,2.22,0,0,1,2.2-2.2h48.4a2.22,2.22,0,0,1,2.2,2.2v63.2A2.22,2.22,0,0,1,231.1,192Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M95.1,275.8H46.7a2.22,2.22,0,0,1-2.2-2.2V210.4a2.22,2.22,0,0,1,2.2-2.2H95.1a2.22,2.22,0,0,1,2.2,2.2v63.2A2.16,2.16,0,0,1,95.1,275.8Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M163,275.8H114.6a2.22,2.22,0,0,1-2.2-2.2V210.4a2.22,2.22,0,0,1,2.2-2.2H163a2.22,2.22,0,0,1,2.2,2.2v63.2A2.16,2.16,0,0,1,163,275.8Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M231,275.8H182.6a2.22,2.22,0,0,1-2.2-2.2V210.4a2.22,2.22,0,0,1,2.2-2.2H231a2.22,2.22,0,0,1,2.2,2.2v63.2A2.16,2.16,0,0,1,231,275.8Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M95.1,359.7H46.7a2.22,2.22,0,0,1-2.2-2.2V294.3a2.22,2.22,0,0,1,2.2-2.2H95.1a2.22,2.22,0,0,1,2.2,2.2v63.2A2.22,2.22,0,0,1,95.1,359.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M163,359.7H114.6a2.22,2.22,0,0,1-2.2-2.2V294.3a2.22,2.22,0,0,1,2.2-2.2H163a2.22,2.22,0,0,1,2.2,2.2v63.2A2.22,2.22,0,0,1,163,359.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<circle cx="172.9" cy="422.2" r="14.9" fill="#fcfcfc" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<circle cx="172.9" cy="422.2" r="11.6" fill="#dce0e5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M566.7,578.4H253.4a38.3,38.3,0,0,1-38.3-38.3V99.2a38.3,38.3,0,0,1,38.3-38.3H566.7A38.3,38.3,0,0,1,605,99.2V540A38.26,38.26,0,0,1,566.7,578.4Z" fill="#fff"/>\n' +
    '	<path d="M560.5,570.9H259.6a37,37,0,0,1-37-37V105.4a37,37,0,0,1,37-37H560.5a37,37,0,0,1,37,37V533.8A36.94,36.94,0,0,1,560.5,570.9Z" fill="#f2f3f7"/>\n' +
    '	<path d="M560.5,570.9H259.6a37,37,0,0,1-37-37V105.4a37,37,0,0,1,37-37H560.5a37,37,0,0,1,37,37V533.8A36.94,36.94,0,0,1,560.5,570.9Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="3"/>\n' +
    '	<path d="M566.6,510.7H253.5a7.55,7.55,0,0,1-7.5-7.5V124.1a7.55,7.55,0,0,1,7.5-7.5H566.6a7.55,7.55,0,0,1,7.5,7.5V503.2A7.49,7.49,0,0,1,566.6,510.7Z" fill="#fafbfc" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M574.1,183.7H246V125a8.75,8.75,0,0,1,8.8-8.8H565.3a8.75,8.75,0,0,1,8.8,8.8v58.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M476.2,162.4H347.7A12.72,12.72,0,0,1,335,149.7h0A12.72,12.72,0,0,1,347.7,137H476.1a12.72,12.72,0,0,1,12.7,12.7h0A12.63,12.63,0,0,1,476.2,162.4Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<path d="M406.3,166.7H348.2a16.94,16.94,0,0,1-16.9-16.9h0a16.94,16.94,0,0,1,16.9-16.9h58.1a16.94,16.94,0,0,1,16.9,16.9h0A16.94,16.94,0,0,1,406.3,166.7Z" fill="#fff"/>\n' +
    '	<path d="M405.9,163.3H348.5A13.44,13.44,0,0,1,335,149.8h0a13.44,13.44,0,0,1,13.5-13.5h57.4a13.44,13.44,0,0,1,13.5,13.5h0A13.51,13.51,0,0,1,405.9,163.3Z" fill="#dce0e5"/>\n' +
    '	<path d="M321.7,280.1h-55a2.48,2.48,0,0,1-2.5-2.5V205.7a2.48,2.48,0,0,1,2.5-2.5h55a2.48,2.48,0,0,1,2.5,2.5v71.9A2.48,2.48,0,0,1,321.7,280.1Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M553.4,280.1h-55a2.48,2.48,0,0,1-2.5-2.5V205.7a2.48,2.48,0,0,1,2.5-2.5h55a2.48,2.48,0,0,1,2.5,2.5v71.9A2.48,2.48,0,0,1,553.4,280.1Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M321.7,375.5h-55a2.48,2.48,0,0,1-2.5-2.5V301.1a2.48,2.48,0,0,1,2.5-2.5h55a2.48,2.48,0,0,1,2.5,2.5V373A2.54,2.54,0,0,1,321.7,375.5Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M553.3,375.5h-55a2.48,2.48,0,0,1-2.5-2.5V301.1a2.48,2.48,0,0,1,2.5-2.5h55a2.48,2.48,0,0,1,2.5,2.5V373A2.54,2.54,0,0,1,553.3,375.5Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M321.7,470.8h-55a2.48,2.48,0,0,1-2.5-2.5V396.4a2.48,2.48,0,0,1,2.5-2.5h55a2.48,2.48,0,0,1,2.5,2.5v71.9A2.48,2.48,0,0,1,321.7,470.8Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M398.9,470.8h-55a2.48,2.48,0,0,1-2.5-2.5V396.4a2.48,2.48,0,0,1,2.5-2.5h55a2.48,2.48,0,0,1,2.5,2.5v71.9A2.48,2.48,0,0,1,398.9,470.8Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10"/>\n' +
    '	<path d="M566.6,510.7H253.5a7.55,7.55,0,0,1-7.5-7.5V124.1a7.55,7.55,0,0,1,7.5-7.5H566.6a7.55,7.55,0,0,1,7.5,7.5V503.2A7.49,7.49,0,0,1,566.6,510.7Z" fill="#5e7499" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<path d="M528.2,447.9H295.7a7.55,7.55,0,0,1-7.5-7.5v-240a7.55,7.55,0,0,1,7.5-7.5H528.2a7.55,7.55,0,0,1,7.5,7.5v240A7.49,7.49,0,0,1,528.2,447.9Z" fill="#fff" stroke="#d5dce2" stroke-miterlimit="10" stroke-width="2"/>\n' +
    '	<rect x="360.9" y="343.9" width="136.9" height="20.6" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<line x1="318.1" y1="346.9" x2="329.9" y2="346.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="318.1" y1="351.9" x2="324.6" y2="351.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path d="M332.5,341.5H315.4a1.24,1.24,0,0,0-1.2,1.3v20.9a1.32,1.32,0,0,0,1.3,1.3H326v-7.9h7.9V342.8A1.49,1.49,0,0,0,332.5,341.5Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="325.9" y1="365" x2="333.8" y2="357.1" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<rect x="360.9" y="392.9" width="113.4" height="20.6" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M333.7,393.3v19.4a2.78,2.78,0,0,1-2.7,2.8H317a2.71,2.71,0,0,1-2.7-2.8V393.3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="311.8" y1="393.3" x2="336.2" y2="393.3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="324" y1="398.9" x2="324" y2="409.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="328.8" y1="398.9" x2="328.8" y2="409.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="319.1" y1="398.9" x2="319.1" y2="409.9" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<polyline points="317.4 393.3 319.8 389.2 328.1 389.2 330.6 393.3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<rect x="360.9" y="294.9" width="94.1" height="20.6" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M322.8,295.1h-8a1.11,1.11,0,0,0-1.1,1.1v18.7a1.11,1.11,0,0,0,1.1,1.1h18.7a1.11,1.11,0,0,0,1.1-1.1v-8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<line x1="323.9" y1="305.8" x2="337.4" y2="292.3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<polyline points="326.5 291.7 338 291.7 338 303.2" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path d="M349.7,264.1h-32a6,6,0,0,1-6-6v-30a6,6,0,0,1,6-6h32a6,6,0,0,1,6,6v30A6,6,0,0,1,349.7,264.1Z" fill="#00adf5" opacity="0.3" style="isolation:isolate"/>\n' +
    '	<path d="M355.7,239.1h-44v-11a6,6,0,0,1,6-6h32a6,6,0,0,1,6,6Z" fill="#00adf5" opacity="0.4" style="isolation:isolate"/>\n' +
    '	<path d="M339.6,239.1l8.2,4.7a.93.93,0,0,0,1.4-.8V218.8a1.37,1.37,0,0,0-1.4-1.4H330.5a1.43,1.43,0,0,0-1.4,1.4V243a1,1,0,0,0,1.4.8l8.2-4.7A.75.75,0,0,1,339.6,239.1Z" fill="#fff"/>\n' +
    '	<path d="M339.5,236.6l6.5,3.7a.73.73,0,0,0,1.1-.6V220.4a1.11,1.11,0,0,0-1.1-1.1H332.2a1.11,1.11,0,0,0-1.1,1.1v19.3a.7.7,0,0,0,1.1.6l6.5-3.7A1.1,1.1,0,0,1,339.5,236.6Z" fill="#00adf5" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="377.1" y="233.5" width="112.5" height="20.6" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<circle cx="131.1" cy="258.4" r="17" fill="none" stroke="#00adf5" stroke-miterlimit="10" stroke-width="3" opacity="0.1" style="isolation:isolate"/>\n' +
    '	<circle cx="131.1" cy="258.4" r="13" fill="#00adf5" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<polygon points="131.1 258.4 249 25.4 249 569.1 131.1 258.4" fill="url(#linear-gradient)"/>\n' +
    '	<circle cx="131.1" cy="258.4" r="23" fill="none" stroke="#00adf5" stroke-miterlimit="10" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<circle cx="410.1" cy="541.8" r="16.9" fill="#fff"/>\n' +
    '	<circle cx="410.1" cy="541.8" r="13.1" fill="#dce0e5" opacity="0.7" style="isolation:isolate"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-catalog-actions-phone.html',
    '<svg id="tips-catalog-actions-phone" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">\n' +
    '	<path d="M161.66,185H38.84l-.5-148.83A21.22,21.22,0,0,1,59.51,15H140a21.22,21.22,0,0,1,21.17,21.17Z" fill="#f2f3f7"/>\n' +
    '	<path d="M152.74,184.86H47.26V50.11a2.9,2.9,0,0,1,2.89-2.89h99.7a2.9,2.9,0,0,1,2.89,2.89Z" fill="#fafbfc"/>\n' +
    '	<path d="M38.84,185l-.5-149.77C38.34,24.1,48.31,15,60.52,15H139c12.21,0,22.18,9.1,22.18,20.23L161.63,185" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M152.74,78.14H47.26v-28a3.11,3.11,0,0,1,3.11-3.11h99.3a3.11,3.11,0,0,1,3.11,3.11v28Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M75.07,68.32h48.41a5.41,5.41,0,0,0,5.42-5.42h0a5.41,5.41,0,0,0-5.42-5.42H75.07a5.41,5.41,0,0,0-5.42,5.42h0A5.41,5.41,0,0,0,75.07,68.32Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M102.17,70.13h21a7.25,7.25,0,0,0,7.22-7.22h0a7.25,7.25,0,0,0-7.22-7.22h-21a7.25,7.25,0,0,0-7.22,7.22h0A7.22,7.22,0,0,0,102.17,70.13Z" fill="#fff"/>\n' +
    '	<path d="M102.17,68.68h21a5.8,5.8,0,0,0,5.78-5.78h0a5.8,5.8,0,0,0-5.78-5.78h-21a5.8,5.8,0,0,0-5.78,5.78h0A5.78,5.78,0,0,0,102.17,68.68Z" fill="#dce0e5"/>\n' +
    '	<rect x="77.42" y="87.46" width="27.96" height="5.78" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M69.08,103.32H57.52a2.9,2.9,0,0,1-2.89-2.89V88.87A2.9,2.9,0,0,1,57.52,86H69.08A2.9,2.9,0,0,1,72,88.87v11.56A2.9,2.9,0,0,1,69.08,103.32Z" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="77.42" y="96.17" width="16.65" height="5.78" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M121.86,173.15l2.6,1.48a.3.3,0,0,0,.43-.25v-7.73a.42.42,0,0,0-.43-.43h-5.53a.44.44,0,0,0-.43.43v7.73a.3.3,0,0,0,.43.25l2.6-1.48A.49.49,0,0,1,121.86,173.15Z" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M140.17,167.44h-2.74a.36.36,0,0,0-.36.36v6.39a.36.36,0,0,0,.36.36h6.39a.36.36,0,0,0,.36-.36v-2.74" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="140.57" y1="171.09" x2="145.15" y2="166.47" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<polyline points="141.43 166.25 145.37 166.25 145.37 170.19" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<rect x="77.42" y="163.33" width="27.96" height="5.78" transform="translate(-0.32 0.17) rotate(-0.11)" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M69.08,179.22l-11.56,0a2.9,2.9,0,0,1-2.89-2.89l0-11.56a2.9,2.9,0,0,1,2.89-2.89l11.56,0a2.9,2.9,0,0,1,2.89,2.89l0,11.56A2.9,2.9,0,0,1,69.08,179.22Z" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="77.42" y="172.03" width="16.65" height="5.78" transform="translate(-0.33 0.16) rotate(-0.11)" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<polygon points="142.66 93.89 142.66 90.68 140.03 90.68 140.03 93.89 138.51 93.89 141.36 96.75 144.18 93.89 142.66 93.89" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M137,96.14V97.8a.82.82,0,0,0,.83.83h7a.82.82,0,0,0,.83-.83V96.14" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M47.26,184.86V50.11a2.9,2.9,0,0,1,2.89-2.89h99.7a2.9,2.9,0,0,1,2.89,2.89V184.86" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.81"/>\n' +
    '	<path d="M176.4,154.66H23.6a3.07,3.07,0,0,1-3.07-3.07V112.9a3.07,3.07,0,0,1,3.07-3.07H176.4a3.07,3.07,0,0,1,3.07,3.07v38.69A3.07,3.07,0,0,1,176.4,154.66Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="62.14" y="122.14" width="42.56" height="7.23" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M50.22,143.82H34.83A3.87,3.87,0,0,1,31,140V124.53a3.87,3.87,0,0,1,3.86-3.86H50.26a3.87,3.87,0,0,1,3.87,3.86V140A3.92,3.92,0,0,1,50.22,143.82Z" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="62.14" y="135.15" width="23.99" height="7.23" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M156.9,127h-4.77a.65.65,0,0,0-.65.65v11.09a.65.65,0,0,0,.65.65h11.09a.65.65,0,0,0,.65-.65V134" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<line x1="157.55" y1="133.34" x2="165.53" y2="125.36" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<polyline points="159.06 124.96 165.93 124.96 165.93 131.82" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M129.55,137.21l4.44,2.57a.51.51,0,0,0,.76-.43V126.15a.76.76,0,0,0-.72-.76H124.6a.73.73,0,0,0-.72.76v13.19a.51.51,0,0,0,.76.43l4.44-2.57A.53.53,0,0,1,129.55,137.21Z" fill="#00adf5" opacity="0.3" style="isolation:isolate"/>\n' +
    '	<path d="M129.55,137.21l4.44,2.57a.51.51,0,0,0,.76-.43V126.15a.76.76,0,0,0-.72-.76H124.6a.73.73,0,0,0-.72.76v13.19a.51.51,0,0,0,.76.43l4.44-2.57A.53.53,0,0,1,129.55,137.21Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-catalog-actions-tablet.html',
    '<svg id="tips-catalog-actions-tablet" xmlns="http://www.w3.org/2000/svg" width="220" height="200" viewBox="0 0 220 200">\n' +
    '	<path d="M205.41,43.94V156.06A13.94,13.94,0,0,1,191.47,170H28.53a13.94,13.94,0,0,1-13.94-13.94V43.94A13.92,13.92,0,0,1,28.53,30H191.47A13.94,13.94,0,0,1,205.41,43.94Z" fill="#f2f3f7"/>\n' +
    '	<path d="M205.41,43.94V156.06A13.94,13.94,0,0,1,191.47,170H28.53a13.94,13.94,0,0,1-13.94-13.94V43.94A13.92,13.92,0,0,1,28.53,30H191.47A13.94,13.94,0,0,1,205.41,43.94Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M182.53,157.52h-152a2.81,2.81,0,0,1-2.82-2.82v-109a2.81,2.81,0,0,1,2.82-2.82h152a2.81,2.81,0,0,1,2.82,2.82v109A2.86,2.86,0,0,1,182.53,157.52Z" fill="#fafbfc" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.38"/>\n' +
    '	<path d="M91.74,96.85H72.4a.92.92,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93H91.74a.93.93,0,0,1,.93.93V95.93A.93.93,0,0,1,91.74,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M119.68,96.85H100.35a.92.92,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93h19.34a.93.93,0,0,1,.93.93V95.93A.9.9,0,0,1,119.68,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M147.66,96.85H128.33a.92.92,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93h19.34a.93.93,0,0,1,.93.93V95.93A.93.93,0,0,1,147.66,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M175.65,96.85H156.31a.93.93,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93h19.34a.93.93,0,0,1,.93.93V95.93A.93.93,0,0,1,175.65,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<rect x="36.47" y="67.25" width="15.83" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.47" y="78.38" width="18.21" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.47" y="89.5" width="25.36" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.47" y="100.6" width="14.11" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.47" y="111.72" width="19.87" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.47" y="122.85" width="23.51" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.47" y="133.97" width="14.11" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<path d="M91.74,132.55H72.4a.92.92,0,0,1-.93-.93V104.34a.92.92,0,0,1,.93-.93H91.74a.92.92,0,0,1,.93.93v27.28A1,1,0,0,1,91.74,132.55Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M119.68,132.55H100.35a.92.92,0,0,1-.93-.93V104.34a.92.92,0,0,1,.93-.93h19.34a.92.92,0,0,1,.93.93v27.28A.92.92,0,0,1,119.68,132.55Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M185.28,61.36H27.67V46a3.18,3.18,0,0,1,3.18-3.18H182.07A3.18,3.18,0,0,1,185.25,46l0,15.33Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M85.61,55.53h40.56a3.48,3.48,0,0,0,3.48-3.48h0a3.48,3.48,0,0,0-3.48-3.48H85.61a3.48,3.48,0,0,0-3.48,3.48h0A3.5,3.5,0,0,0,85.61,55.53Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M107.5,56.69h18.28a4.55,4.55,0,0,0,4.44-4.64h0a4.55,4.55,0,0,0-4.44-4.64H107.5a4.55,4.55,0,0,0-4.44,4.64h0A4.55,4.55,0,0,0,107.5,56.69Z" fill="#fff"/>\n' +
    '	<path d="M107.7,55.76h17.85a3.63,3.63,0,0,0,3.54-3.71h0a3.63,3.63,0,0,0-3.54-3.71H107.7a3.63,3.63,0,0,0-3.54,3.71h0A3.63,3.63,0,0,0,107.7,55.76Z" fill="#dce0e5"/>\n' +
    '	<circle cx="196.04" cy="100" r="5.96" fill="#fff"/>\n' +
    '	<circle cx="196.04" cy="100" r="4.64" fill="#dce0e5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M182.53,157.52h-152a2.81,2.81,0,0,1-2.82-2.82v-109a2.81,2.81,0,0,1,2.82-2.82h152a2.81,2.81,0,0,1,2.82,2.82v109A2.86,2.86,0,0,1,182.53,157.52Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M159.82,143.44H117.43a2,2,0,0,1-2-2V80.53a2,2,0,0,1,2-2h42.38a2,2,0,0,1,2,2v60.93A2,2,0,0,1,159.82,143.44Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M159.82,143.11H117.43a2,2,0,0,1-2-2V129.21H161.8v11.92A2,2,0,0,1,159.82,143.11Z" fill="#f7f9fc" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<line x1="115.45" y1="129.21" x2="161.8" y2="129.21" fill="none" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<line x1="145.32" y1="141.29" x2="145.32" y2="131.36" fill="none" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<rect x="125.38" y="112.45" width="26.49" height="5.96" fill="#eff0f4" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M144.16,104.83h-10.6a2.66,2.66,0,0,1-2.65-2.65V91.59a2.66,2.66,0,0,1,2.65-2.65h10.6a2.66,2.66,0,0,1,2.65,2.65v10.6A2.66,2.66,0,0,1,144.16,104.83Z" fill="#eff0f4" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M152.43,135.66l4-2a11.24,11.24,0,0,1,1.85-3.15,12,12,0,1,1-2.65,8.71Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10"/>\n' +
    '	<path d="M155.94,100.53l2.12-3.94a12.05,12.05,0,1,1,2.55,5Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10"/>\n' +
    '	<line x1="167.63" y1="91.62" x2="171.8" y2="91.62" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="167.63" y1="93.38" x2="169.95" y2="93.38" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M172.73,89.7h-6.06a.43.43,0,0,0-.43.46v7.38a.45.45,0,0,0,.46.46h3.71V95.23h2.78V90.17A.45.45,0,0,0,172.73,89.7Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="170.41" y1="98.01" x2="173.2" y2="95.23" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M122.7,137.19l-2.12-3.94a12.05,12.05,0,1,0-2.55,5Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10"/>\n' +
    '	<path d="M108.46,127.22h-2.85a.4.4,0,0,0-.4.4v6.59a.4.4,0,0,0,.4.4h6.59a.4.4,0,0,0,.4-.4v-2.85" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="108.86" y1="130.96" x2="113.63" y2="126.19" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<polyline points="109.78 125.96 113.86 125.96 113.86 130.07" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M167.83,141.46l2.71,1.56a.31.31,0,0,0,.46-.26v-8a.45.45,0,0,0-.46-.46h-5.73a.47.47,0,0,0-.46.46v8a.32.32,0,0,0,.46.26l2.71-1.56A.25.25,0,0,1,167.83,141.46Z" fill="#00adf5" opacity="0.3" style="isolation:isolate"/>\n' +
    '	<path d="M167.83,141.46l2.71,1.56a.31.31,0,0,0,.46-.26v-8a.45.45,0,0,0-.46-.46h-5.73a.47.47,0,0,0-.46.46v8a.32.32,0,0,0,.46.26l2.71-1.56A.25.25,0,0,1,167.83,141.46Z" fill="none" stroke="#00adf5" stroke-miterlimit="10" stroke-width="0.8" opacity="0.7" style="isolation:isolate"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-catalog-desktop.html',
    '<svg id="tips-catalog-desktop" xmlns="http://www.w3.org/2000/svg" width="275" height="210" viewBox="0 0 275 210">\n' +
    '	<path d="M252.27,190H22.69a4.18,4.18,0,0,1-4.19-4.21V24.21A4.18,4.18,0,0,1,22.69,20H252.31a4.18,4.18,0,0,1,4.19,4.21V185.79A4.24,4.24,0,0,1,252.27,190Z" fill="#f4f6f9"/>\n' +
    '	<path d="M256.46,46.48H18.5V24.89A4.83,4.83,0,0,1,23.32,20H251.68a4.83,4.83,0,0,1,4.82,4.84V46.48h0Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M252.27,190H22.69a4.18,4.18,0,0,1-4.19-4.21V24.21A4.18,4.18,0,0,1,22.69,20H252.31a4.18,4.18,0,0,1,4.19,4.21V185.79A4.24,4.24,0,0,1,252.27,190Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M196.13,31.86H78.83a.91.91,0,0,1-.85-1V26a.91.91,0,0,1,.85-1h117.3a.91.91,0,0,1,.85,1v4.84A.91.91,0,0,1,196.13,31.86Z" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.5"/>\n' +
    '	<path d="M115.89,100.79H86.52a1.41,1.41,0,0,1-1.4-1.4V58a1.41,1.41,0,0,1,1.4-1.4h29.37a1.41,1.41,0,0,1,1.4,1.4v41.4A1.41,1.41,0,0,1,115.89,100.79Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M158.3,100.79H129a1.41,1.41,0,0,1-1.4-1.4V58a1.42,1.42,0,0,1,1.4-1.4H158.3a1.41,1.41,0,0,1,1.4,1.4v41.4A1.41,1.41,0,0,1,158.3,100.79Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M200.72,100.79H171.35a1.41,1.41,0,0,1-1.4-1.4V58a1.41,1.41,0,0,1,1.4-1.4h29.37a1.41,1.41,0,0,1,1.4,1.4v41.4A1.41,1.41,0,0,1,200.72,100.79Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M243.13,100.79H213.77a1.41,1.41,0,0,1-1.4-1.4V58a1.42,1.42,0,0,1,1.4-1.4h29.37a1.41,1.41,0,0,1,1.4,1.4v41.4A1.39,1.39,0,0,1,243.13,100.79Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="31.23" y="55.87" width="24.01" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<rect x="31.23" y="72.74" width="27.63" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<rect x="31.23" y="89.61" width="38.51" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<rect x="31.23" y="106.49" width="21.38" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<rect x="31.23" y="123.36" width="30.13" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<rect x="31.23" y="140.23" width="35.66" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<rect x="31.23" y="157.1" width="21.38" height="8.03" fill="#e6e9ef" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M115.89,154.9H86.52a1.41,1.41,0,0,1-1.4-1.4V112.1a1.41,1.41,0,0,1,1.4-1.4h29.37a1.41,1.41,0,0,1,1.4,1.4v41.39A1.39,1.39,0,0,1,115.89,154.9Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M158.3,154.9H129a1.41,1.41,0,0,1-1.4-1.4V112.1a1.41,1.41,0,0,1,1.4-1.4H158.3a1.41,1.41,0,0,1,1.4,1.4v41.39A1.39,1.39,0,0,1,158.3,154.9Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M206.29,166.84h-54.4a2.56,2.56,0,0,1-2.55-2.55V86.09a2.56,2.56,0,0,1,2.55-2.55h54.4a2.56,2.56,0,0,1,2.55,2.55v78.2A2.56,2.56,0,0,1,206.29,166.84Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M206.29,166.41h-54.4a2.56,2.56,0,0,1-2.55-2.55v-15.3h59.5v15.3A2.56,2.56,0,0,1,206.29,166.41Z" fill="#f7f9fc" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<line x1="149.34" y1="148.56" x2="208.84" y2="148.56" fill="none" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="0.5"/>\n' +
    '	<line x1="187.67" y1="164.07" x2="187.67" y2="151.32" fill="none" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="0.5"/>\n' +
    '	<rect x="162.09" y="127.06" width="34" height="7.65" fill="#eff0f4" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M186.18,117.24h-13.6a3.41,3.41,0,0,1-3.4-3.4v-13.6a3.41,3.41,0,0,1,3.4-3.4h13.6a3.41,3.41,0,0,1,3.4,3.4v13.6A3.38,3.38,0,0,1,186.18,117.24Z" fill="#eff0f4" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M196.77,156.85l5.1-2.59a14.41,14.41,0,0,1,2.38-4,15.44,15.44,0,1,1-3.4,11.18Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M201.31,111.76,204,106.7a15.47,15.47,0,1,1,3.27,6.46Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<line x1="216.32" y1="100.32" x2="221.67" y2="100.32" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<line x1="216.32" y1="102.54" x2="219.29" y2="102.54" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M222.86,97.86h-7.78a.55.55,0,0,0-.55.6v9.48a.58.58,0,0,0,.6.6h4.76V105h3.57v-6.5A.58.58,0,0,0,222.86,97.86Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<line x1="219.89" y1="108.49" x2="223.46" y2="104.92" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M158.6,158.8l-2.72-5.06a15.47,15.47,0,1,0-3.27,6.46Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M140.37,146h-3.65a.52.52,0,0,0-.51.51v8.46a.52.52,0,0,0,.51.51h8.46a.52.52,0,0,0,.51-.51v-3.65" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<line x1="140.88" y1="150.82" x2="147" y2="144.7" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<polyline points="142.03 144.4 147.3 144.4 147.3 149.63" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<circle cx="241.86" cy="28.84" r="3.78" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="114.87" y="37.42" width="23.8" height="5.1" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="150.53" y="37.42" width="18.7" height="5.1" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="145" y="46.01" width="29.75" height="0.93" fill="#00adf5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M216.57,164.24l3.49,2a.39.39,0,0,0,.6-.34V155.62a.58.58,0,0,0-.6-.6H212.7a.61.61,0,0,0-.6.6V165.9a.41.41,0,0,0,.6.34l3.49-2A.58.58,0,0,1,216.57,164.24Z" fill="#00adf5" opacity="0.3" style="isolation:isolate"/>\n' +
    '	<path d="M216.57,164.24l3.49,2a.39.39,0,0,0,.6-.34V155.62a.58.58,0,0,0-.6-.6H212.7a.61.61,0,0,0-.6.6V165.9a.41.41,0,0,0,.6.34l3.49-2A.58.58,0,0,1,216.57,164.24Z" fill="none" stroke="#00adf5" stroke-miterlimit="10" stroke-width="1.1" opacity="0.7" style="isolation:isolate"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-catalog-install-phone.html',
    '<svg id="tips-catalog-install-phone" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">\n' +
    '	<path d="M161.5,185H38.68L38.17,36.17A21.25,21.25,0,0,1,59.38,15h80.45A21.22,21.22,0,0,1,161,36.17Z" fill="#f2f3f7"/>\n' +
    '	<path d="M152.58,184.86H47.1V50.11A2.9,2.9,0,0,1,50,47.22h99.7a2.9,2.9,0,0,1,2.89,2.89V184.86Z" fill="#fafbfc"/>\n' +
    '	<path d="M38.68,185,38.17,35.23C38.17,24.1,48.14,15,60.35,15h78.46C151,15,161,24.1,161,35.23L161.46,185" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M152.58,78.14H47.1v-28a3.11,3.11,0,0,1,3.11-3.11h99.3a3.11,3.11,0,0,1,3.11,3.11v28Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M74.91,68.32h48.41a5.41,5.41,0,0,0,5.42-5.42h0a5.41,5.41,0,0,0-5.42-5.42H74.91a5.41,5.41,0,0,0-5.42,5.42h0A5.41,5.41,0,0,0,74.91,68.32Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M102,70.13h21a7.25,7.25,0,0,0,7.22-7.22h0A7.25,7.25,0,0,0,123,55.68H102a7.25,7.25,0,0,0-7.22,7.22h0A7.22,7.22,0,0,0,102,70.13Z" fill="#fff"/>\n' +
    '	<path d="M102,68.68h21a5.8,5.8,0,0,0,5.78-5.78h0A5.8,5.8,0,0,0,123,57.12H102a5.8,5.8,0,0,0-5.78,5.78h0A5.77,5.77,0,0,0,102,68.68Z" fill="#dce0e5"/>\n' +
    '	<path d="M47.1,184.86V50.11A2.9,2.9,0,0,1,50,47.22h99.7a2.9,2.9,0,0,1,2.89,2.89V184.86" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.81"/>\n' +
    '	<rect x="77.4" y="137.57" width="27.96" height="5.78" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M69.06,153.46H57.5a2.9,2.9,0,0,1-2.89-2.89V139a2.9,2.9,0,0,1,2.89-2.89H69.06A2.9,2.9,0,0,1,71.95,139v11.56A2.9,2.9,0,0,1,69.06,153.46Z" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="77.4" y="146.31" width="16.65" height="5.78" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M121.84,173.15l2.6,1.48a.3.3,0,0,0,.43-.25v-7.73a.42.42,0,0,0-.43-.43h-5.53a.44.44,0,0,0-.43.43v7.73a.3.3,0,0,0,.43.25l2.6-1.48A.49.49,0,0,1,121.84,173.15Z" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M140.19,167.44h-2.74a.36.36,0,0,0-.36.36v6.39a.36.36,0,0,0,.36.36h6.39a.36.36,0,0,0,.36-.36v-2.74" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="140.55" y1="171.09" x2="145.14" y2="166.47" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<polyline points="141.42 166.25 145.35 166.25 145.39 170.19" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<rect x="77.4" y="163.33" width="27.96" height="5.78" transform="translate(-0.32 0.17) rotate(-0.11)" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M69.06,179.22l-11.56,0a2.9,2.9,0,0,1-2.89-2.89l0-11.56a2.9,2.9,0,0,1,2.89-2.89l11.56,0a2.9,2.9,0,0,1,2.89,2.89l0,11.56A2.9,2.9,0,0,1,69.06,179.22Z" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="77.44" y="172.03" width="16.65" height="5.78" transform="translate(-0.33 0.16) rotate(-0.11)" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<path d="M176.38,130.81H23.58a3.07,3.07,0,0,1-3.07-3.07V89.06A3.07,3.07,0,0,1,23.58,86H176.42a3.07,3.07,0,0,1,3.07,3.07v38.69A3.12,3.12,0,0,1,176.38,130.81Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="62.12" y="98.3" width="42.56" height="7.22" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M50.2,120H34.81a3.87,3.87,0,0,1-3.86-3.86V100.69a3.87,3.87,0,0,1,3.86-3.86H50.24a3.87,3.87,0,0,1,3.87,3.86v15.43A3.92,3.92,0,0,1,50.2,120Z" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="62.12" y="111.31" width="23.99" height="7.22" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<polygon points="155.07 107.04 155.07 101.19 150.27 101.19 150.27 107.04 147.52 107.04 152.65 112.21 157.82 107.04 155.07 107.04" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M144.74,111.13v3a1.53,1.53,0,0,0,1.52,1.52h12.82a1.53,1.53,0,0,0,1.52-1.52v-3" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<polygon points="142.25 144.03 142.25 140.82 139.57 140.82 139.57 144.03 138.09 144.03 140.91 146.85 143.76 144.03 142.25 144.03" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M136.58,146.27v1.66a.82.82,0,0,0,.83.83h7a.82.82,0,0,0,.83-.83v-1.66" fill="none" stroke="#d1d7e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-catalog-install-tablet.html',
    '<svg id="tips-catalog-install-tablet" xmlns="http://www.w3.org/2000/svg" width="220" height="200" viewBox="0 0 220 200">\n' +
    '	<path d="M205.26,43.94V156.06A13.94,13.94,0,0,1,191.32,170H28.38a13.94,13.94,0,0,1-13.94-13.94V43.94A13.94,13.94,0,0,1,28.38,30H191.32A13.94,13.94,0,0,1,205.26,43.94Z" fill="#f2f3f7"/>\n' +
    '	<path d="M205.26,43.94V156.06A13.94,13.94,0,0,1,191.32,170H28.38a13.94,13.94,0,0,1-13.94-13.94V43.94A13.94,13.94,0,0,1,28.38,30H191.32A13.94,13.94,0,0,1,205.26,43.94Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.14"/>\n' +
    '	<path d="M182.38,157.52h-152a2.81,2.81,0,0,1-2.82-2.82v-109a2.81,2.81,0,0,1,2.82-2.82h152a2.81,2.81,0,0,1,2.82,2.82v109A2.86,2.86,0,0,1,182.38,157.52Z" fill="#fafbfc" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.38"/>\n' +
    '	<path d="M91.59,96.85H72.25a.92.92,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93H91.59a.93.93,0,0,1,.93.93V95.93A.93.93,0,0,1,91.59,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M119.54,96.85H100.2a.92.92,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93h19.34a.93.93,0,0,1,.93.93V95.93A.9.9,0,0,1,119.54,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M147.51,96.85H128.18a.92.92,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93h19.34a.93.93,0,0,1,.93.93V95.93A.93.93,0,0,1,147.51,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M175.5,96.85H156.16a.93.93,0,0,1-.93-.93V68.64a.93.93,0,0,1,.93-.93H175.5a.93.93,0,0,1,.93.93V95.93A.93.93,0,0,1,175.5,96.85Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<rect x="36.32" y="67.25" width="15.83" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.32" y="78.38" width="18.21" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.32" y="89.5" width="25.36" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.32" y="100.6" width="14.11" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.32" y="111.72" width="19.87" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.32" y="122.85" width="23.51" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<rect x="36.32" y="133.97" width="14.11" height="5.3" fill="#e6e9ef" opacity="0.5" style="isolation:isolate"/>\n' +
    '	<path d="M91.59,132.55H72.25a.92.92,0,0,1-.93-.93V104.31a.92.92,0,0,1,.93-.93H91.59a.92.92,0,0,1,.93.93v27.28A1,1,0,0,1,91.59,132.55Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M119.54,132.55H100.2a.92.92,0,0,1-.93-.93V104.31a.92.92,0,0,1,.93-.93h19.34a.92.92,0,0,1,.93.93v27.28A.93.93,0,0,1,119.54,132.55Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.76"/>\n' +
    '	<path d="M185.13,61.36H27.52V46a3.18,3.18,0,0,1,3.18-3.18H181.92A3.18,3.18,0,0,1,185.1,46l0,15.33Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<path d="M85.46,55.53H126a3.48,3.48,0,0,0,3.48-3.48h0A3.48,3.48,0,0,0,126,48.58H85.46A3.48,3.48,0,0,0,82,52.05h0A3.5,3.5,0,0,0,85.46,55.53Z" fill="none" stroke="#dce0e5" stroke-miterlimit="10" stroke-width="0.76"/>\n' +
    '	<path d="M107.35,56.69h18.28a4.55,4.55,0,0,0,4.44-4.64h0a4.55,4.55,0,0,0-4.44-4.64H107.35a4.55,4.55,0,0,0-4.44,4.64h0A4.55,4.55,0,0,0,107.35,56.69Z" fill="#fff"/>\n' +
    '	<path d="M107.55,55.76H125.4a3.63,3.63,0,0,0,3.54-3.71h0a3.63,3.63,0,0,0-3.54-3.71H107.55A3.63,3.63,0,0,0,104,52.05h0A3.63,3.63,0,0,0,107.55,55.76Z" fill="#dce0e5"/>\n' +
    '	<circle cx="195.89" cy="100" r="5.96" fill="#fff"/>\n' +
    '	<circle cx="195.89" cy="100" r="4.64" fill="#dce0e5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M182.38,157.52h-152a2.81,2.81,0,0,1-2.82-2.82v-109a2.81,2.81,0,0,1,2.82-2.82h152a2.81,2.81,0,0,1,2.82,2.82v109A2.86,2.86,0,0,1,182.38,157.52Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M132.51,143.44H90.13a2,2,0,0,1-2-2V80.53a2,2,0,0,1,2-2h42.38a2,2,0,0,1,2,2v60.93A2,2,0,0,1,132.51,143.44Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M132.51,143.11H90.13a2,2,0,0,1-2-2V129.21H134.5v11.92A2,2,0,0,1,132.51,143.11Z" fill="#f7f9fc" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<line x1="88.14" y1="129.21" x2="134.5" y2="129.21" fill="none" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="0.8"/>\n' +
    '	<rect x="98.08" y="112.45" width="26.49" height="5.96" fill="#eff0f4" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M116.85,104.83h-10.6a2.66,2.66,0,0,1-2.65-2.65V91.59a2.66,2.66,0,0,1,2.65-2.65h10.6a2.66,2.66,0,0,1,2.65,2.65v10.6A2.66,2.66,0,0,1,116.85,104.83Z" fill="#eff0f4" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M128.31,100.53l2.12-3.94a12.05,12.05,0,1,1,2.55,5Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10"/>\n' +
    '	<line x1="140" y1="91.62" x2="144.17" y2="91.62" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="140" y1="93.38" x2="142.32" y2="93.38" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M145.1,89.7H139a.43.43,0,0,0-.43.46v7.38a.45.45,0,0,0,.46.46h3.71V95.23h2.78V90.17A.45.45,0,0,0,145.1,89.7Z" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<line x1="142.78" y1="98.01" x2="145.56" y2="95.23" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M205.26,43.94V156.06A13.94,13.94,0,0,1,191.32,170H28.38a13.94,13.94,0,0,1-13.94-13.94V43.94A13.94,13.94,0,0,1,28.38,30H191.32A13.94,13.94,0,0,1,205.26,43.94Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M103.67,137.85l-4.21,1.49a11.72,11.72,0,0,1-2.25,2.88,12,12,0,1,1,3.78-8.31Z" fill="#fff" stroke="#e2e6ed" stroke-miterlimit="10"/>\n' +
    '	<polygon points="90.69 132.42 90.69 129.07 87.95 129.07 87.95 132.42 86.36 132.42 89.3 135.36 92.28 132.42 90.69 132.42" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '	<path d="M84.77,134.74v1.72a.88.88,0,0,0,.86.86H93a.88.88,0,0,0,.86-.86v-1.72" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-install.html',
    '<svg id="tips-install" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\n' +
    '    <polygon points="10.2 6.8 10.2 1.5 5.8 1.5 5.8 6.8 3.3 6.8 8 11.5 12.7 6.8 10.2 6.8" fill="none" stroke="#6c747d" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '    <path d="M1,10.5v2.7a1.32,1.32,0,0,0,1.3,1.3H13.6a1.32,1.32,0,0,0,1.3-1.3V10.5" fill="none" stroke="#6c747d" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-mdm.html',
    '<svg id="tips-mdm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\n' +
    '    <circle cx="8" cy="8" r="5" fill="#6c747d"/>\n' +
    '    <polygon points="10.16 9.99 9.13 10.72 8.01 9.21 6.86 10.72 5.84 9.99 6.96 8.39 5.25 7.87 5.63 6.67 7.31 7.21 7.31 5.28 8.7 5.28 8.7 7.21 10.37 6.67 10.75 7.87 9.04 8.39 10.16 9.99" fill="#fff"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-notification-desktop.html',
    '<svg id="illo-tips-notification-desktop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 215">\n' +
    '	<path d="M249.7,186.67H19.56a4.18,4.18,0,0,1-4.2-4.16V21.16A4.18,4.18,0,0,1,19.52,17H249.74a4.18,4.18,0,0,1,4.2,4.16v161.3A4.28,4.28,0,0,1,249.7,186.67Z" fill="#f4f6f9"/>\n' +
    '	<path d="M253.9,43.73H15.36V22.18a4.83,4.83,0,0,1,4.82-4.84H249.11A4.83,4.83,0,0,1,254,22.16V43.73Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M249.7,187H19.56a4.18,4.18,0,0,1-4.2-4.16V21.5a4.18,4.18,0,0,1,4.16-4.2H249.74a4.18,4.18,0,0,1,4.2,4.16v161.3A4.24,4.24,0,0,1,249.7,187Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M193.16,29.14H76.1a.91.91,0,0,1-.85-1V23.33a.91.91,0,0,1,.81-1h117.1a.91.91,0,0,1,.85,1v4.88a.91.91,0,0,1-.85,1Z" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.5"/>\n' +
    '	<circle cx="238.8" cy="26.13" r="3.77" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="110.75" y="34.69" width="23.75" height="5.09" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="146.38" y="34.69" width="18.66" height="5.09" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="107.71" y="43.26" width="29.82" height="0.94" fill="#00adf5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M72.49,87.46h-24a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,72.49,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M110.5,87.46H86.4a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,110.5,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M148.46,87.46h-24.1a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,148.46,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M186.42,87.46H162.33a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36A1.12,1.12,0,0,1,186.42,87.46Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M224.38,87.46H200.29a1.12,1.12,0,0,1-1.1-1.1V54.63a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V86.36a1.09,1.09,0,0,1-1.08,1.1Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M72.49,131.7h-24a1.12,1.12,0,0,1-1.1-1.1V98.87a1.12,1.12,0,0,1,1.1-1.1h24a1.12,1.12,0,0,1,1.1,1.1V130.6A1.12,1.12,0,0,1,72.49,131.7Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="113.89" y="123.32" width="129.31" height="77.53" rx="3" ry="3" fill="#fff" stroke="#cfd5df" stroke-miterlimit="10"/>\n' +
    '	<circle cx="134.94" cy="145.58" r="10.78" fill="#f1f2f5"/>\n' +
    '	<polygon points="153.91 143.44 212.91 143.44 212.91 136.44 153.91 136.44 153.91 143.44" fill="#eff0f4"/>\n' +
    '	<polygon points="153.91 155.21 176.91 155.21 176.91 148.21 153.91 148.21 153.91 155.21" fill="#eff0f4"/>\n' +
    '	<polygon points="125.91 170.09 227.91 170.09 227.91 163.09 125.91 163.09 125.91 170.09" fill="#eff0f4"/>\n' +
    '	<path d="M235.5,141.55l-10.09-10.08" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<path d="M225.5,141.47l10-10" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<rect x="124.59" y="179.8" width="100.75" height="10.33" rx="3" ry="3" fill="#00adf5"/>\n' +
    '	<path d="M215.86,174.53a12.48,12.48,0,0,0,.29,3.83l-2.23,4.11,4.91,1.15a12.76,12.76,0,0,0,22.39-7.17A12.61,12.61,0,0,0,229.51,163c-.33,0-.66,0-1,0A12.66,12.66,0,0,0,215.86,174.53Z" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<path d="M234.69,171.13l-1.19-1a.18.18,0,0,0-.27,0l-6.88,8.27-3.23-3a.2.2,0,0,0-.27,0l-1,1.2c-.09.1-.06.17.05.26l4.39,4.14a.33.33,0,0,0,.46,0l.38-.44a.1.1,0,0,0,0,0l.06-.06,7.52-9A.2.2,0,0,0,234.69,171.13Z" fill="none" stroke="#00adf5" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"/>\n' +
    '	<rect x="113.89" y="36.15" width="129.31" height="77.53" rx="3" ry="3" fill="#fff" stroke="#cfd5df" stroke-miterlimit="10"/>\n' +
    '	<circle cx="134.94" cy="58.42" r="10.78" fill="#f1f2f5"/>\n' +
    '	<polygon points="153.91 56.28 212.91 56.28 212.91 49.28 153.91 49.28 153.91 56.28" fill="#eff0f4"/>\n' +
    '	<polygon points="153.91 68.05 176.91 68.05 176.91 61.05 153.91 61.05 153.91 68.05" fill="#eff0f4"/>\n' +
    '	<polygon points="125.91 82.92 227.91 82.92 227.91 75.92 125.91 75.92 125.91 82.92" fill="#eff0f4"/>\n' +
    '	<path d="M235.5,54.39,225.41,44.3" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<path d="M225.5,54.3l10-10" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<rect x="124.59" y="92.63" width="100.75" height="10.33" rx="3" ry="3" fill="#00adf5"/>\n' +
    '	<path d="M215.86,87.37a12.41,12.41,0,0,0,.29,3.82l-2.23,4.12,4.91,1.14a12.76,12.76,0,0,0,22.39-7.16,12.61,12.61,0,0,0-11.71-13.5c-.33,0-.66,0-1,0A12.67,12.67,0,0,0,215.86,87.37Z" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<path d="M234.69,84l-1.19-1a.2.2,0,0,0-.27,0l-6.88,8.28-3.23-3a.19.19,0,0,0-.27,0l-1,1.19c-.09.11-.06.17.05.27l4.39,4.14a.33.33,0,0,0,.46,0l.38-.43a.21.21,0,0,0,0-.06l.06-.06,7.52-9A.2.2,0,0,0,234.69,84Z" fill="none" stroke="#00adf5" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"/>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-notification-phone.html',
    '<svg id="tips-notification-phone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 610 580">\n' +
    '	<path id="Fill-1" d="M483.3,530.7H131.6l-1.4-424c0-33.2,27.3-60.4,60.7-60.4H421.3c33.4,0,60.7,27.2,60.7,60.4Z" fill="#f2f3f7"/>\n' +
    '	<path id="Fill-3" d="M457.8,530.3H155.7v-384a8.26,8.26,0,0,1,8.3-8.2H449.5a8.26,8.26,0,0,1,8.3,8.2Z" fill="#fafbfc" stroke="#c8cfdc"/>\n' +
    '	<path id="Stroke-5" d="M131.6,530.7l-1.4-426.8c0-31.7,28.6-57.6,63.5-57.6H418.3c34.9,0,63.5,25.9,63.5,57.6l1.4,426.8" fill="none" stroke="#e2e6ed" stroke-width="1.15"/>\n' +
    '	<polygon id="Fill-22" points="322.1 485.3 242.1 485.5 242.1 469 322.1 468.8 322.1 485.3" fill="#eff0f4"/>\n' +
    '	<path id="Fill-24" d="M201.6,514.3a24.75,24.75,0,1,1,24.8-24.8,24.86,24.86,0,0,1-24.8,24.8" fill="#eff0f4"/>\n' +
    '	<polygon id="Fill-26" points="289.8 510.2 242.1 510.3 242.1 493.8 289.8 493.8 289.8 510.2" fill="#eff0f4"/>\n' +
    '	<polygon id="Fill-28" points="391.6 210.9 242.1 211.2 242.1 194.1 391.5 193.8 391.6 210.9" fill="#eff0f4"/>\n' +
    '	<path id="Fill-30" d="M201.6,239.4a24.75,24.75,0,1,1,24.8-24.8,24.86,24.86,0,0,1-24.8,24.8" fill="#eff0f4"/>\n' +
    '	<polygon id="Fill-32" points="289.8 235.3 242.1 235.4 242.1 219 289.8 218.9 289.8 235.3" fill="#eff0f4"/>\n' +
    '	<path id="Fill-35" d="M492.8,480.7H125.1a8.79,8.79,0,0,1-8.8-8.7V257.4a8.73,8.73,0,0,1,8.8-8.7H492.8a8.79,8.79,0,0,1,8.8,8.7V472a8.73,8.73,0,0,1-8.8,8.7" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<polygon id="Fill-37" points="235.6 304.2 410.8 304.2 410.8 283.6 235.6 283.6 235.6 304.2" fill="#eff0f4"/>\n' +
    '	<path id="Fill-39" d="M179.4,345.4a32.9,32.9,0,1,1,33.1-32.9,33,33,0,0,1-33.1,32.9" fill="#eff0f4"/>\n' +
    '	<polygon id="Fill-41" points="235.6 341.3 304.3 341.3 304.3 320.7 235.6 320.7 235.6 341.3" fill="#eff0f4"/>\n' +
    '	<polygon id="Fill-43" points="150.1 385.3 455.4 385.3 455.4 364.7 150.1 364.7 150.1 385.3" fill="#eff0f4"/>\n' +
    '	<path id="Stroke-45" d="M449.1,297.1,478,268.4" fill="none" stroke="#9da2a8" stroke-linecap="round"/>\n' +
    '	<path id="Stroke-47" d="M476.9,296.6l-28.4-28.3" fill="none" stroke="#9da2a8" stroke-linecap="round"/>\n' +
    '	<path id="Fill-49" d="M438.4,447.7H161.1a11.05,11.05,0,0,1-11.1-11V425.1a11.05,11.05,0,0,1,11.1-11H438.4a11.05,11.05,0,0,1,11.1,11v11.6a11.05,11.05,0,0,1-11.1,11" fill="#00adf5"/>\n' +
    '	<path id="Fill-52" d="M415.8,422.5l6.6-12.2a36,36,0,0,1-.9-11.4A37.51,37.51,0,1,1,456,439a37.9,37.9,0,0,1-25.8-13.1Z" fill="#fff" stroke="#c8cfdc" stroke-width="2"/>\n' +
    '	<path id="Stroke-54" d="M479.2,389.5l-3.7-3a.52.52,0,0,0-.8.1l-21.2,25.2-10-9.3a.61.61,0,0,0-.8,0l-3.2,3.6c-.3.3-.2.5.2.8l13.5,12.6a1,1,0,0,0,1.4-.1l1.2-1.3c.1-.1.1-.1.1-.2l.2-.2,23.2-27.4A.52.52,0,0,0,479.2,389.5Z" fill="none" stroke="#00adf5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>\n' +
    '	<path id="Fill-57" d="M457.8,179.1H155.7V147a8.83,8.83,0,0,1,8.9-8.8H448.9a8.83,8.83,0,0,1,8.9,8.8v32.1Z" fill="#fff" stroke="#e2e6ed"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-notification-tablet.html',
    '<svg id="tips-notification-tablet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">\n' +
    '	<path d="M204.8,44.2V155.9a13.87,13.87,0,0,1-13.9,13.9H28.6a13.87,13.87,0,0,1-13.9-13.9V44.2A13.87,13.87,0,0,1,28.6,30.3H191a13.85,13.85,0,0,1,13.8,13.9" fill="#f2f3f7"/>\n' +
    '	<path d="M204.8,44.2V155.9a13.87,13.87,0,0,1-13.9,13.9H28.6a13.87,13.87,0,0,1-13.9-13.9V44.2A13.87,13.87,0,0,1,28.6,30.3H191A13.85,13.85,0,0,1,204.8,44.2Z" fill="none" stroke="#e2e6ed" stroke-width="1.92"/>\n' +
    '	<path d="M182,157.3H30.6a2.8,2.8,0,0,1-2.8-2.8V46a2.86,2.86,0,0,1,2.8-2.8H182a2.8,2.8,0,0,1,2.8,2.8V154.5a2.8,2.8,0,0,1-2.8,2.8" fill="#f3f4f5"/>\n' +
    '	<path d="M91.6,96.9H72.3a.9.9,0,0,1-.9-.9V68.8a.9.9,0,0,1,.9-.9H91.6a.9.9,0,0,1,.9.9V96a.9.9,0,0,1-.9.9" fill="#fff"/>\n' +
    '	<path d="M119.4,96.9H100.1a.9.9,0,0,1-.9-.9V68.8a.9.9,0,0,1,.9-.9h19.3a.9.9,0,0,1,.9.9V96a.9.9,0,0,1-.9.9" fill="#fff"/>\n' +
    '	<path d="M147.3,96.9H128a.9.9,0,0,1-.9-.9V68.8a.9.9,0,0,1,.9-.9h19.3a.9.9,0,0,1,.9.9V96a.9.9,0,0,1-.9.9" fill="#fff"/>\n' +
    '	<path d="M175.2,96.9H155.9a.9.9,0,0,1-.9-.9V68.8a.9.9,0,0,1,.9-.9h19.3a.9.9,0,0,1,.9.9V96a.9.9,0,0,1-.9.9" fill="#fff"/>\n' +
    '	<polygon points="36.5 72.7 52.3 72.7 52.3 67.4 36.5 67.4 36.5 72.7" fill="#e6e9ef"/>\n' +
    '	<polygon points="36.5 83.7 54.6 83.7 54.6 78.5 36.5 78.5 36.5 83.7" fill="#e6e9ef"/>\n' +
    '	<polygon points="36.5 94.8 61.8 94.8 61.8 89.5 36.5 89.5 36.5 94.8" fill="#e6e9ef"/>\n' +
    '	<polygon points="36.5 105.9 50.5 105.9 50.5 100.6 36.5 100.6 36.5 105.9" fill="#e6e9ef"/>\n' +
    '	<polygon points="36.5 117 56.3 117 56.3 111.7 36.5 111.7 36.5 117" fill="#e6e9ef"/>\n' +
    '	<polygon points="36.5 128 59.9 128 59.9 122.8 36.5 122.8 36.5 128" fill="#e6e9ef"/>\n' +
    '	<polygon points="36.5 139.1 50.5 139.1 50.5 133.8 36.5 133.8 36.5 139.1" fill="#e6e9ef"/>\n' +
    '	<path d="M91.6,132.4H72.3a.9.9,0,0,1-.9-.9V104.3a.9.9,0,0,1,.9-.9H91.6a.9.9,0,0,1,.9.9v27.2a.9.9,0,0,1-.9.9" fill="#fff"/>\n' +
    '	<path d="M119.4,132.4H100.1a.9.9,0,0,1-.9-.9V104.3a.9.9,0,0,1,.9-.9h19.3a.9.9,0,0,1,.9.9v27.2a.9.9,0,0,1-.9.9" fill="#fff"/>\n' +
    '	<path d="M184.8,61.5H27.7V46.2A3.16,3.16,0,0,1,30.9,43H181.6a3.16,3.16,0,0,1,3.2,3.2Z" fill="#fff"/>\n' +
    '	<path d="M85.5,55.7h40.4a3.5,3.5,0,0,0,0-7H85.5A3.54,3.54,0,0,0,82,52.2,3.48,3.48,0,0,0,85.5,55.7Z" fill="none" stroke="#dce0e5" stroke-width="1.28"/>\n' +
    '	<path d="M106.8,56.9h19.1a4.59,4.59,0,0,0,4.6-4.6,4.65,4.65,0,0,0-4.6-4.6H106.8a4.59,4.59,0,0,0-4.6,4.6,4.65,4.65,0,0,0,4.6,4.6" fill="#fff"/>\n' +
    '	<path d="M107.1,55.9h18.6a3.7,3.7,0,1,0,0-7.4H107.1a3.76,3.76,0,0,0-3.7,3.7,3.63,3.63,0,0,0,3.7,3.7" fill="#dce0e5"/>\n' +
    '	<path d="M195.5,94.1a5.9,5.9,0,1,1-5.9,5.9,5.79,5.79,0,0,1,5.9-5.9" fill="#fff"/>\n' +
    '	<path d="M195.5,95.4a4.59,4.59,0,0,1,4.6,4.6,4.65,4.65,0,0,1-4.6,4.6,4.6,4.6,0,0,1,0-9.2" fill="#dce0e5"/>\n' +
    '	<path d="M182,157.3H30.6a2.8,2.8,0,0,1-2.8-2.8V46a2.86,2.86,0,0,1,2.8-2.8H182a2.8,2.8,0,0,1,2.8,2.8V154.5A2.8,2.8,0,0,1,182,157.3Z" fill="none" stroke="#e2e6ed" stroke-width="0.64"/>\n' +
    '	<polygon points="142.3 66.5 154.2 66.5 154.2 62.9 142.3 62.9 142.3 66.5" fill="#eff0f4"/>\n' +
    '	<path d="M178.64,140h-66a1.62,1.62,0,0,1-1.61-1.61V100.07a1.62,1.62,0,0,1,1.61-1.61h66a1.62,1.62,0,0,1,1.61,1.61v38.29A1.65,1.65,0,0,1,178.64,140Z" fill="#fff" stroke="#cfd5df" stroke-miterlimit="10" stroke-width="0.6"/>\n' +
    '	<circle cx="122.25" cy="110.35" r="5.78" fill="#f1f2f5"/>\n' +
    '	<polygon points="132.42 109.17 164.02 109.17 164.02 105.42 132.42 105.42 132.42 109.17" fill="#eff0f4"/>\n' +
    '	<polygon data-name="Fill-8" points="132.42 115.49 144.74 115.49 144.74 111.74 132.42 111.74 132.42 115.49" fill="#eff0f4"/>\n' +
    '	<polygon points="117.43 123.47 172.06 123.47 172.06 119.72 117.43 119.72 117.43 123.47" fill="#eff0f4"/>\n' +
    '	<path d="M176.13,108.21l-5.41-5.41" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<path d="M170.77,108.15l5.36-5.35" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<path d="M169.06,134.18H118.28a1.65,1.65,0,0,1-1.6-1.6v-2.31a1.6,1.6,0,0,1,1.6-1.6h50.78a1.57,1.57,0,0,1,1.6,1.6v2.31A1.57,1.57,0,0,1,169.06,134.18Z" fill="#00adf5"/>\n' +
    '	<path d="M165.63,125.83a6.52,6.52,0,0,0,.16,2l-1.18,2.2,2.63.59A6.76,6.76,0,0,0,171.9,133a6.85,6.85,0,0,0,7.33-6.21,6.77,6.77,0,0,0-6.26-7.23h-.54A6.82,6.82,0,0,0,165.63,125.83Z" fill="#fff" stroke="#c8cfdc" stroke-width="0.6"/>\n' +
    '	<path id="Stroke-32" d="M175.7,124l-.65-.54a.1.1,0,0,0-.16,0l-3.69,4.45-1.71-1.61a.12.12,0,0,0-.17,0l-.53.64a.1.1,0,0,0,0,.16l2.36,2.2a.24.24,0,0,0,.26,0l.22-.22V129l.05,0,4-4.82A.1.1,0,0,0,175.7,124Z" fill="none" stroke="#00adf5" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"/>\n' +
    '	<path d="M178.64,93.26h-66a1.65,1.65,0,0,1-1.61-1.6V53.36a1.61,1.61,0,0,1,1.61-1.6h66a1.61,1.61,0,0,1,1.61,1.6v38.3A1.65,1.65,0,0,1,178.64,93.26Z" fill="#fff" stroke="#cfd5df" stroke-miterlimit="10" stroke-width="0.6"/>\n' +
    '	<circle cx="122.25" cy="63.65" r="5.78" fill="#f1f2f5"/>\n' +
    '	<polygon points="132.42 62.52 164.02 62.52 164.02 58.77 132.42 58.77 132.42 62.52" fill="#eff0f4"/>\n' +
    '	<polygon points="132.42 68.79 144.74 68.79 144.74 65.04 132.42 65.04 132.42 68.79" fill="#eff0f4"/>\n' +
    '	<polygon points="117.43 76.77 172.06 76.77 172.06 73.02 117.43 73.02 117.43 76.77" fill="#eff0f4"/>\n' +
    '	<path d="M176.13,61.5l-5.41-5.4" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<path d="M170.77,61.45l5.36-5.35" fill="none" stroke="#9da2a8" stroke-linecap="round" stroke-width="0.5"/>\n' +
    '	<path d="M169.06,87.53H118.28a1.6,1.6,0,0,1-1.6-1.6V83.62a1.6,1.6,0,0,1,1.6-1.6h50.78a1.57,1.57,0,0,1,1.6,1.6v2.31A1.6,1.6,0,0,1,169.06,87.53Z" fill="#00adf5"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-open.html',
    '<svg id="icon-inline-open" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\n' +
    '    <path d="M6.25,3H1.63A.63.63,0,0,0,1,3.64V14.37a.63.63,0,0,0,.63.63H12.36a.63.63,0,0,0,.63-.63V9.75" fill="none" stroke="#6c747d" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '    <line x1="6.89" y1="9.11" x2="14.63" y2="1.37" fill="none" stroke="#6c747d" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '    <polyline points="8.37 1 15 1 15 7.63" fill="none" stroke="#6c747d" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-people-desktop.html',
    '<svg id="tips-bookmarks-desktop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 215">\n' +
    '	<path d="M249.71,202.22H20A4.17,4.17,0,0,1,15.76,198V37.62A4.17,4.17,0,0,1,20,33.44h229.8a4.17,4.17,0,0,1,4.19,4.18V198a4.23,4.23,0,0,1-4.23,4.18" fill="#f4f6f9"/>\n' +
    '	<path d="M253.9,121.28H15.76v-83a4.82,4.82,0,0,1,4.83-4.81H249.11a4.82,4.82,0,0,1,4.83,4.81V59.73Z" fill="#fff"/>\n' +
    '	<path d="M253.9,121.28H15.76v-83a4.82,4.82,0,0,1,4.83-4.81H249.11a4.82,4.82,0,0,1,4.83,4.81V59.73Z" fill="none" stroke="#edeeef" stroke-width="0.86"/>\n' +
    '	<path d="M249.71,202.22H20A4.17,4.17,0,0,1,15.76,198V37.62A4.17,4.17,0,0,1,20,33.44h229.8a4.17,4.17,0,0,1,4.19,4.18V198A4.23,4.23,0,0,1,249.71,202.22Z" fill="none" stroke="#e2e6ed" stroke-width="0.86"/>\n' +
    '	<polygon points="157.41 90.4 112.44 90.48 112.42 83.01 157.39 82.93 157.41 90.4" fill="#e5e5e5"/>\n' +
    '	<polygon points="161.08 99.13 108.75 99.22 108.74 93.73 161.07 93.63 161.08 99.13" fill="#e5e5e5"/>\n' +
    '	<polygon points="157.01 107.88 112.83 107.96 112.81 102.47 157 102.38 157.01 107.88" fill="#e5e5e5"/>\n' +
    '	<path d="M43.18,52.59a6.19,6.19,0,1,1,6.21-6.18,6.19,6.19,0,0,1-6.21,6.18" fill="#00adf5"/>\n' +
    '	<path d="M28.2,52.59a6.19,6.19,0,1,1,6.21-6.18,6.19,6.19,0,0,1-6.21,6.18" fill="#eff0f4"/>\n' +
    '	<path d="M241.07,52.59a6.19,6.19,0,1,1,6.21-6.18,6.19,6.19,0,0,1-6.21,6.18" fill="#eff0f4"/>\n' +
    '	<path d="M134.91,77a12.62,12.62,0,1,1,12.66-12.61A12.63,12.63,0,0,1,134.91,77" fill="#eff0f4"/>\n' +
    '	<path d="M42.81,45.85l3.95-7.32a22.38,22.38,0,1,1,4.72,9.35Z" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<path d="M69.94,34.4A9.18,9.18,0,0,0,58.08,43H70.49" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M72.74,26.14a5.64,5.64,0,1,1-5.64-5.62A5.62,5.62,0,0,1,72.74,26.14Z" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M73.66,41.51a5.07,5.07,0,1,1,7.18,0A5.1,5.1,0,0,1,73.66,41.51Z" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M74.43,42.73l-2.25,3.63" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<polygon points="49.39 134.17 123.68 134.17 123.68 127.82 49.39 127.82 49.39 134.17" fill="#e6e9ef"/>\n' +
    '	<polygon points="49.39 148.74 97.99 148.74 97.99 141.99 49.39 141.99 49.39 148.74" fill="#e6e9ef"/>\n' +
    '	<polygon points="49.39 162.91 112.25 162.91 112.25 156.16 49.39 156.16 49.39 162.91" fill="#e6e9ef"/>\n' +
    '	<polygon points="49.39 177.08 86.54 177.08 86.54 170.33 49.39 170.33 49.39 177.08" fill="#e6e9ef"/>\n' +
    '	<polygon points="183.62 134.57 203.85 134.57 203.85 127.82 183.62 127.82 183.62 134.57" fill="#e6e9ef"/>\n' +
    '	<polygon points="183.62 148.74 209.64 148.74 209.64 141.99 183.62 141.99 183.62 148.74" fill="#e6e9ef"/>\n' +
    '	<polygon points="183.62 162.91 216.07 162.91 216.07 156.16 183.62 156.16 183.62 162.91" fill="#e6e9ef"/>\n' +
    '	<polygon points="183.62 177.08 201.65 177.08 201.65 170.33 183.62 170.33 183.62 177.08" fill="#e6e9ef"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-people-phone.html',
    '<svg id="tips-people-phone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 305 290">\n' +
    '	<path d="M244.4,268h-176L67.75,55A30.42,30.42,0,0,1,98.1,24.67H213.37A30.42,30.42,0,0,1,243.72,55Z" fill="#f2f3f7"/>\n' +
    '	<path d="M232.4,267.79H81.27V74.93a4.14,4.14,0,0,1,4.14-4.14H228.26a4.14,4.14,0,0,1,4.14,4.14h0Z" fill="#dce0e5" fill-opacity="0"/>\n' +
    '	<path d="M232.4,255.24H81.27v-180a4.43,4.43,0,0,1,4.43-4.43H228a4.43,4.43,0,0,1,4.43,4.42h0Z" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<path d="M69.19,268,68.51,53.62c0-15.92,14.3-28.95,31.79-28.95H212.7c17.48,0,31.78,13,31.78,28.95L245.16,268" fill="none" stroke="#e2e6ed" stroke-width="1.16"/>\n' +
    '	<polygon points="196.76 206.26 116.61 206.41 116.59 193.06 196.73 192.91 196.76 206.26" fill="#e2e3ea" opacity="0.76" style="isolation:isolate"/>\n' +
    '	<polygon points="203.31 221.85 110.05 222.02 110.03 212.21 203.29 212.03 203.31 221.85" fill="#eff0f4" opacity="0.78" style="isolation:isolate"/>\n' +
    '	<polygon points="196.06 237.5 117.31 237.64 117.29 227.82 196.04 227.67 196.06 237.5" fill="#eff0f4" opacity="0.78" style="isolation:isolate"/>\n' +
    '	<path d="M124.49,105.45A10.48,10.48,0,1,1,135,95a10.48,10.48,0,0,1-10.49,10.47h0" fill="#00adf5"/><path d="M99.19,105.45A10.48,10.48,0,1,1,109.68,95a10.47,10.47,0,0,1-10.49,10.47h0" fill="#eff0f4"/>\n' +
    '	<path d="M216.54,105.45A10.48,10.48,0,1,1,227,95a10.47,10.47,0,0,1-10.48,10.47h0" fill="#eff0f4"/>\n' +
    '	<path d="M156.67,182.3a22.54,22.54,0,1,1,22.57-22.54,22.54,22.54,0,0,1-22.57,22.54" fill="#eff0f4"/>\n' +
    '	<path d="M127,94.17l4.83-9a27.41,27.41,0,1,1,5.79,11.48Z" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<path d="M160.2,80.14a11.24,11.24,0,0,0-3.3-.5,11.11,11.11,0,0,0-11.21,11h15.17" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>\n' +
    '	<path d="M163.61,70a6.89,6.89,0,1,1-6.9-6.89h0A6.89,6.89,0,0,1,163.61,70Z" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>\n' +
    '	<path d="M164.74,88.85a6.19,6.19,0,1,1,8.77,0,6.2,6.2,0,0,1-8.77,0Z" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>\n' +
    '	<path d="M165.68,90.35l-2.75,4.45" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-people-tablet.html',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">\n' +
    '	<path d="M211.39,45.4V161.75A14.45,14.45,0,0,1,197,176.23H28.25a14.45,14.45,0,0,1-14.44-14.48V45.4A14.45,14.45,0,0,1,28.25,30.93H197A14.45,14.45,0,0,1,211.39,45.4" fill="#f2f3f7"/>\n' +
    '	<path d="M211.39,45.4V161.75A14.45,14.45,0,0,1,197,176.23H28.25a14.45,14.45,0,0,1-14.44-14.48V45.4A14.45,14.45,0,0,1,28.25,30.93H197A14.45,14.45,0,0,1,211.39,45.4Z" fill="none" stroke="#e2e6ed" stroke-width="1.92"/>\n' +
    '	<path d="M187.69,163.25H30.3a2.9,2.9,0,0,1-2.9-2.91V47.27a2.91,2.91,0,0,1,2.9-2.91H187.69a2.91,2.91,0,0,1,2.9,2.91V160.34a2.9,2.9,0,0,1-2.9,2.91" fill="#fafbfc"/>\n' +
    '	<path d="M190.56,107H27.37V47.56a3.31,3.31,0,0,1,3.31-3.31H187.26a3.31,3.31,0,0,1,3.3,3.31Z" fill="#fff"/>\n' +
    '	<path d="M201.67,97.39a6.19,6.19,0,1,1-6.17,6.19,6.19,6.19,0,0,1,6.17-6.19" fill="#fff"/>\n' +
    '	<path d="M201.67,98.77a4.81,4.81,0,1,1-4.8,4.81,4.8,4.8,0,0,1,4.8-4.81" fill="#dce0e5"/>\n' +
    '	<path d="M187.69,163.25H30.3a2.9,2.9,0,0,1-2.9-2.91V47.27a2.91,2.91,0,0,1,2.9-2.91H187.69a2.91,2.91,0,0,1,2.9,2.91V160.34A2.9,2.9,0,0,1,187.69,163.25Z" fill="none" stroke="#e2e6ed" stroke-width="0.64"/>\n' +
    '	<polygon points="48.82 120.18 108.97 120.18 108.97 115 48.82 115 48.82 120.18" fill="#e6e9ef"/>\n' +
    '	<polygon points="48.82 132.04 88.17 132.04 88.17 126.55 48.82 126.55 48.82 132.04" fill="#e6e9ef"/>\n' +
    '	<polygon points="48.82 143.58 99.71 143.58 99.71 138.09 48.82 138.09 48.82 143.58" fill="#e6e9ef"/>\n' +
    '	<polygon points="48.82 155.12 78.89 155.12 78.89 149.63 48.82 149.63 48.82 155.12" fill="#e6e9ef"/>\n' +
    '	<polygon points="133.5 120.5 149.88 120.5 149.88 115 133.5 115 133.5 120.5" fill="#e6e9ef"/>\n' +
    '	<polygon points="133.5 132.04 154.57 132.04 154.57 126.55 133.5 126.55 133.5 132.04" fill="#e6e9ef"/>\n' +
    '	<polygon points="133.5 143.58 159.78 143.58 159.78 138.09 133.5 138.09 133.5 143.58" fill="#e6e9ef"/>\n' +
    '	<polygon points="133.5 155.12 148.1 155.12 148.1 149.63 133.5 149.63 133.5 155.12" fill="#e6e9ef"/>\n' +
    '	<polygon points="127.57 84.18 91.16 84.25 91.14 78.17 127.56 78.1 127.57 84.18" fill="#e5e5e5"/>\n' +
    '	<polygon points="130.55 91.29 88.18 91.37 88.17 86.89 130.54 86.81 130.55 91.29" fill="#e5e5e5"/>\n' +
    '	<polygon points="127.25 98.42 91.47 98.48 91.46 94.01 127.24 93.94 127.25 98.42" fill="#e5e5e5"/>\n' +
    '	<path d="M50.17,59.85a5,5,0,1,1,5-5,5,5,0,0,1-5,5" fill="#00adf5"/>\n' +
    '	<path d="M38,59.85a5,5,0,1,1,5-5,5,5,0,0,1-5,5" fill="#eff0f4"/>\n' +
    '	<path d="M180.57,59.85a5,5,0,1,1,5-5,5,5,0,0,1-5,5" fill="#eff0f4"/>\n' +
    '	<path d="M109.36,73.26A10.27,10.27,0,1,1,119.61,63a10.26,10.26,0,0,1-10.25,10.27" fill="#eff0f4"/>\n' +
    '	<path d="M49.87,54.35l3.19-6a18.51,18.51,0,0,1-.42-5.54A18.18,18.18,0,1,1,56.89,56Z" fill="#fff" stroke="#c8cfdc"/>\n' +
    '	<path d="M71.84,45a7.54,7.54,0,0,0-2.19-.33A7.38,7.38,0,0,0,62.23,52H72.28" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<path d="M74.1,38.3a4.57,4.57,0,1,1-4.56-4.57A4.57,4.57,0,0,1,74.1,38.3Z" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<path d="M74.85,50.82a4.11,4.11,0,1,1,5.81,0A4.13,4.13,0,0,1,74.85,50.82Z" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '	<path d="M75.47,51.81l-1.82,3" fill="none" stroke="#07a9ed" stroke-linecap="round" stroke-linejoin="round"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-people.html',
    '<svg id="icon-people" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">\n' +
    '    <path d="M8.52,14" style="fill:none;stroke:#6c747d;stroke-miterlimit:10"/>\n' +
    '    <path d="M8.23,13.37H1.81A4.57,4.57,0,0,1,6.27,8.71h.06A3.42,3.42,0,0,1,7.67,9" style="fill:none;stroke:#6c747d;stroke-miterlimit:10"/>\n' +
    '    <path id="body" d="M7.67,8.44A5.46,5.46,0,0,0,6.33,8.2a4.57,4.57,0,0,0-4.52,4.61H8" style="fill:none"/>\n' +
    '    <circle cx="6.48" cy="4.12" r="2.92" style="fill:none;stroke:#6c747d;stroke-miterlimit:10"/>\n' +
    '    <circle id="searchglass" cx="11.72" cy="10.25" r="2.63" style="fill:none;stroke:#6c747d;stroke-miterlimit:10"/>\n' +
    '    <line x1="10.27" y1="12.75" x2="9.1" y2="14.62" style="fill:none;stroke:#6c747d;stroke-linecap:round;stroke-miterlimit:10"/>\n' +
    '    <rect width="16" height="16" style="fill:none"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-rearrange.html',
    '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="280" height="180" viewBox="0 0 280 180">\n' +
    '	<path d="M244.55,174.7H15a4.18,4.18,0,0,1-4.19-4.2V9.2A4.18,4.18,0,0,1,15,5H244.6a4.18,4.18,0,0,1,4.19,4.2V170.46A4.28,4.28,0,0,1,244.55,174.7Z" fill="#f4f6f9"/>\n' +
    '	<path d="M248.74,31.76h-238V10.22a4.83,4.83,0,0,1,4.82-4.84H244a4.83,4.83,0,0,1,4.82,4.84V31.76Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M244.55,175H15a4.18,4.18,0,0,1-4.19-4.2V9.54A4.18,4.18,0,0,1,15,5.34H244.6a4.18,4.18,0,0,1,4.19,4.2V170.8A4.24,4.24,0,0,1,244.55,175Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M188.3,17.17H71.23a.91.91,0,0,1-.85-1V11.36a.91.91,0,0,1,.85-1H188.3a.91.91,0,0,1,.85,1V16.2A.91.91,0,0,1,188.3,17.17Z" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<circle cx="233.94" cy="14.16" r="3.77" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="105.89" y="22.73" width="23.75" height="5.09" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="141.51" y="22.73" width="18.66" height="5.09" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="102.89" y="31.31" width="29.75" height="0.93" fill="#00adf5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<path d="M67.63,89.92h-24a1.12,1.12,0,0,1-1.1-1.1V57.09a1.12,1.12,0,0,1,1.1-1.1H67.67a1.12,1.12,0,0,1,1.1,1.1V88.81A1.13,1.13,0,0,1,67.63,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M105.63,89.92H81.54a1.12,1.12,0,0,1-1.1-1.1V57.09a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,105.63,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M143.59,89.92H119.5a1.12,1.12,0,0,1-1.1-1.1V57.09a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,143.59,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M181.55,89.92H157.46a1.12,1.12,0,0,1-1.1-1.1V57.09a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,181.55,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M219.51,89.92H195.42a1.12,1.12,0,0,1-1.1-1.1V57.09a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.09,1.09,0,0,1,219.51,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M67.63,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1H67.67a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,67.63,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="175.51" y="39.21" width="30.54" height="8.48" fill="#e1e5ea" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M105.59,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,105.59,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M143.55,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,143.55,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<polyline points="219.53 42.18 216.13 45.57 212.74 42.18" fill="none" stroke="#cdd0d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M266.34,136.3h-87.9a2.64,2.64,0,0,1-2.73-2.54V54.86a2.64,2.64,0,0,1,2.73-2.54h87.86A2.64,2.64,0,0,1,269,54.86v78.9A2.57,2.57,0,0,1,266.34,136.3Z" fill="#fff" stroke="#e1e8ef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<rect x="189.71" y="65.71" width="54.43" height="10.26" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="189.71" y="89.18" width="54.43" height="10.26" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="175.71" y="107.05" width="93.31" height="21.46" fill="#00adf5" opacity="0.05" style="isolation:isolate"/>\n' +
    '	<rect x="189.71" y="112.65" width="65.32" height="10.26" fill="#00adf5" opacity="0.1" style="isolation:isolate"/>\n' +
    '	<rect x="175.71" y="107.05" width="1.87" height="21.46" fill="#00adf5" opacity="0.7" style="isolation:isolate"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-rearrange2.html',
    '<svg id="tips-rearrange2" xmlns="http://www.w3.org/2000/svg" width="280" height="180" viewBox="0 0 280 180">\n' +
    '	<path d="M254.77,174.7H25.19A4.18,4.18,0,0,1,21,170.5V9.2A4.18,4.18,0,0,1,25.19,5H254.81A4.18,4.18,0,0,1,259,9.2V170.46A4.28,4.28,0,0,1,254.77,174.7Z" fill="#f4f6f9"/>\n' +
    '	<path d="M77.84,89.92h-24a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1H77.88a1.12,1.12,0,0,1,1.1,1.1V88.81A1.13,1.13,0,0,1,77.84,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M115.85,89.92H91.75a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,115.85,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M191.77,89.92H167.68a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,191.77,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M229.73,89.92H205.64a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.09,1.09,0,0,1,229.73,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M77.84,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1H77.88a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,77.84,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M115.8,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,115.8,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M153.76,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,153.76,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M138.49,41.73a27.4,27.4,0,0,0-24,14.18,27.36,27.36,0,0,0,23.93,40.55A27.37,27.37,0,0,0,165.12,63l2.5-6.86,2.27-6.24-6.62-.57-6.47-.55a27.62,27.62,0,0,0-18.31-7Z" fill="#67c4f9" opacity="0.1" style="isolation:isolate"/>\n' +
    '	<path d="M138.49,46.82a22.08,22.08,0,0,1,10.69,2.76,22.36,22.36,0,0,1,5.39,4.11l8.27.71-3,8.36a22.26,22.26,0,1,1-21.31-15.93" fill="#fff"/>\n' +
    '	<rect x="185.72" y="39.21" width="30.54" height="8.48" fill="#e1e5ea"/>\n' +
    '	<rect x="166.57" y="39.21" width="14.85" height="8.48" fill="#e1e5ea"/>\n' +
    '	<path d="M259,31.76H21V10.22a4.83,4.83,0,0,1,4.82-4.84H254.18A4.83,4.83,0,0,1,259,10.22V31.76Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M254.77,175H25.19A4.18,4.18,0,0,1,21,170.8V9.54a4.18,4.18,0,0,1,4.19-4.2H254.81A4.18,4.18,0,0,1,259,9.54V170.8A4.24,4.24,0,0,1,254.77,175Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M198.51,17.17H81.45a.91.91,0,0,1-.85-1V11.36a.91.91,0,0,1,.85-1H198.51a.91.91,0,0,1,.85,1V16.2A.91.91,0,0,1,198.51,17.17Z" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.55"/>\n' +
    '	<circle cx="244.15" cy="14.16" r="3.77" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="116.1" y="22.73" width="23.75" height="5.09" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="151.73" y="22.73" width="18.66" height="5.09" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="113.1" y="31.31" width="29.75" height="0.93" fill="#00adf5" opacity="0.7" style="isolation:isolate"/>\n' +
    '	<polyline points="229.74 42.18 226.35 45.57 222.95 42.18" fill="none" stroke="#cdd0d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1"/>\n' +
    '	<path d="M162.84,54.39l-8.27-.71a22.36,22.36,0,1,0,5.23,9.07Z" fill="#fff" stroke="#67c4f9" stroke-miterlimit="10" stroke-width="1.1" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<line x1="138.54" y1="66.2" x2="138.54" y2="61.17" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="136.03 62.43 138.54 59.92 141.06 62.43" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<line x1="138.54" y1="72.48" x2="138.54" y2="77.5" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="141.06 76.24 138.54 78.76 136.03 76.24" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<line x1="135.4" y1="69.34" x2="130.38" y2="69.34" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="131.63 71.85 129.12 69.34 131.63 66.83" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<line x1="141.68" y1="69.34" x2="146.71" y2="69.34" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="145.45 66.83 147.96 69.34 145.45 71.85" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/svgincludes/tips-rearrange3.html',
    '<svg id="tips-rearrange3" xmlns="http://www.w3.org/2000/svg" width="280" height="180" viewBox="0 0 280 180">\n' +
    '	<path d="M254.77,174.7H25.19A4.18,4.18,0,0,1,21,170.5V9.2A4.18,4.18,0,0,1,25.19,5H254.81A4.18,4.18,0,0,1,259,9.2V170.46A4.28,4.28,0,0,1,254.77,174.7Z" fill="#f4f6f9"/>\n' +
    '	<path d="M77.84,89.92h-24a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1H77.88a1.12,1.12,0,0,1,1.1,1.1V88.81A1.13,1.13,0,0,1,77.84,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M115.85,89.92H91.75a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,115.85,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M153.81,89.92H129.71a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,153.81,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M191.77,89.92H167.68a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.12,1.12,0,0,1,191.77,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M229.73,89.92H205.64a1.12,1.12,0,0,1-1.1-1.1V57.08a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1V88.81A1.09,1.09,0,0,1,229.73,89.92Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M77.84,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1H77.88a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,77.84,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M153.76,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,153.76,134.15Z" fill="#edeeef"/>\n' +
    '	<path d="M153.81,100.22h-3v1h3v-1Zm-7,0h-3v1h3v-1Zm-7,0h-3v1h3v-1Zm-7,0h-3v1h3v-1Zm-3.19,3.29h-1v3h1v-3Zm0,7h-1v3h1v-3Zm0,7h-1v3h1v-3Zm0,7h-1v3h1v-3Zm0,7h-1v1.54h0a1.15,1.15,0,0,0,.56.61h.1l.11,0,.25-1a.13.13,0,0,1-.09-.1v-1.54Zm6.83,1.65h-3v1h3v-1Zm7,0h-3v1h3v-1Zm7,0h-3v1h3v-1Zm4.46-2h-1v1.92a.11.11,0,0,1-.05.08l.55.83a1.12,1.12,0,0,0,.47-.66h0v-1.92Zm0-7h-1v3h1v-3Zm0-7h-1v3h1v-3Zm0-7h-1v3h1v-3Zm0-7h-1v3h1v-3Z" fill="#dbdcdd"/>\n' +
    '	<path d="M115.8,134.15h-24a1.12,1.12,0,0,1-1.1-1.1V101.33a1.12,1.12,0,0,1,1.1-1.1h24.09a1.12,1.12,0,0,1,1.1,1.1v31.73A1.13,1.13,0,0,1,115.8,134.15Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M181.57,66H142.77a6.06,6.06,0,0,0-6.05,6.05v52.43a6.06,6.06,0,0,0,6.05,6.05h38.79a6.07,6.07,0,0,0,6-5.89V72.06A6.06,6.06,0,0,0,181.57,66Z" fill="#67c4f9" opacity="0.1" style="isolation:isolate"/>\n' +
    '	<path d="M181.57,126.3H142.77a1.81,1.81,0,0,1-1.81-1.81V72.06a1.81,1.81,0,0,1,1.81-1.81h38.79a1.81,1.81,0,0,1,1.81,1.81v52.43A1.86,1.86,0,0,1,181.57,126.3Z" fill="#fff"/>\n' +
    '	<path d="M259,31.76H21V10.22a4.83,4.83,0,0,1,4.82-4.84H254.18A4.83,4.83,0,0,1,259,10.22V31.76Z" fill="#fff" stroke="#edeeef" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M254.77,175H25.19A4.18,4.18,0,0,1,21,170.8V9.54a4.18,4.18,0,0,1,4.19-4.2H254.81A4.18,4.18,0,0,1,259,9.54V170.8A4.24,4.24,0,0,1,254.77,175Z" fill="none" stroke="#e2e6ed" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<path d="M198.51,17.17H81.45a.91.91,0,0,1-.85-1V11.36a.91.91,0,0,1,.85-1H198.51a.91.91,0,0,1,.85,1V16.2A.91.91,0,0,1,198.51,17.17Z" fill="none" stroke="#edeeef" stroke-miterlimit="10" stroke-width="0.5"/>\n' +
    '	<circle cx="244.15" cy="14.16" r="3.77" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="116.1" y="22.73" width="23.75" height="5.09" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<rect x="151.73" y="22.73" width="18.66" height="5.09" fill="#eff0f4" opacity="0.6" style="isolation:isolate"/>\n' +
    '	<rect x="113.1" y="31.35" width="29.75" height="0.85" fill="#00adf5" opacity="0.4" style="isolation:isolate"/>\n' +
    '	<rect x="209.93" y="39.21" width="20.36" height="8.48" fill="#00adf5" opacity="0.2" style="isolation:isolate"/>\n' +
    '	<rect x="182.69" y="39.21" width="20.36" height="8.48" fill="#00adf5" opacity="0.1" style="isolation:isolate"/>\n' +
    '	<path d="M181.57,126.3H142.77a1.81,1.81,0,0,1-1.81-1.81V72.06a1.81,1.81,0,0,1,1.81-1.81h38.79a1.81,1.81,0,0,1,1.81,1.81v52.43A1.86,1.86,0,0,1,181.57,126.3Z" fill="#fff" stroke="#67c4f9" stroke-miterlimit="10" stroke-width="1.1" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M168.66,93.92h-12a2.24,2.24,0,0,1-2.24-2.24V80.52a2.24,2.24,0,0,1,2.24-2.24h12a2.24,2.24,0,0,1,2.24,2.24V91.69A2.24,2.24,0,0,1,168.66,93.92Z" fill="#eff0f4" opacity="0.8" style="isolation:isolate"/>\n' +
    '	<path d="M170.9,84.6H154.41V80.52a2.24,2.24,0,0,1,2.24-2.24h12a2.24,2.24,0,0,1,2.24,2.24V84.6Z" fill="#e1e5ea"/>\n' +
    '	<path d="M165.32,84.16l2.51,1.48a.29.29,0,0,0,.44-.25V77.66a.45.45,0,0,0-.4-.45h-5.33a.42.42,0,0,0-.4.45V85.4a.29.29,0,0,0,.44.25l2.51-1.48C165.12,84.08,165.24,84.08,165.32,84.16Z" fill="#e1e5ea"/>\n' +
    '	<path d="M165.32,84.16l2.51,1.48a.29.29,0,0,0,.44-.25V77.66a.45.45,0,0,0-.4-.45h-5.33a.42.42,0,0,0-.4.45V85.4a.29.29,0,0,0,.44.25l2.51-1.48C165.12,84.08,165.24,84.08,165.32,84.16Z" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="1.1"/>\n' +
    '	<line x1="168.6" y1="108.3" x2="168.6" y2="104.28" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="166.59 105.28 168.6 103.27 170.61 105.28" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<line x1="168.6" y1="113.32" x2="168.6" y2="117.35" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="170.61 116.34 168.6 118.35 166.59 116.34" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<line x1="166.09" y1="110.81" x2="162.07" y2="110.81" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="163.07 112.82 161.06 110.81 163.07 108.8" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<line x1="171.11" y1="110.81" x2="175.14" y2="110.81" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '	<polyline points="174.13 108.8 176.14 110.81 174.13 112.82" fill="none" stroke="#67c4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>\n' +
    '</svg>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/toast/templates/messageContextTemplate.html',
    '<div class="toast-content">\n' +
    '    <ul class="toast-message-list">\n' +
    '        <li ng-repeat="message in _messagesArray_">\n' +
    '            <div toast-message="message">\n' +
    '            </div>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app-v2/toast/templates/toastsMessageTemplate.html',
    '<div class="toast-message-container">\n' +
    '    <div class="toast-body">\n' +
    '        <p class="message-text">{{message.text}}</p>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
