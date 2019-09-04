(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app/catalog/catalog.html',
    '<div class="catalog-main headered- view- frame" ng-class="{\'no-tabs-\':!appCenterCtrl.hasLaunchableApps}"\n' +
    '     filter-menu="catalogCtrl.filterConfig" on-select="catalogCtrl.filterByLabel(item)">\n' +
    '    <div frame-drawer hamburger-menu drawer-control="appCenterCtrl.drawerIsActive">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="drawer-overlay" ng-class="{\'is-active\':appCenterCtrl.drawerIsActive}" ng-click="appCenterCtrl.toggleDrawer()"></div>\n' +
    '\n' +
    '    <div class="frame-header">\n' +
    '        <div class="theme-portal-masthead">\n' +
    '            <div class="mobile- masthead" ng-class="{ \'search-\' : appCenterCtrl.searchMode }">\n' +
    '                <div class="mastheadContainer">\n' +
    '                    <div class="masthead-left">\n' +
    '                        <div>\n' +
    '                            <a class="iconic- link- button" ng-click="appCenterCtrl.toggleDrawer()">\n' +
    '                                <svg symbol="hamburger"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="masthead-center">\n' +
    '                        {{::\'appCenter.nav.myApps\' | i18n}}\n' +
    '                    </div>\n' +
    '                    <div class="masthead-right">\n' +
    '                        <a class="iconic- link- button" ng-click="appCenterCtrl.showSearch()">\n' +
    '                            <svg symbol="search"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-include="\'app/common/mobileSearchContainer.html\'"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="masthead-navigation-tabs" ng-show="appCenterCtrl.hasLaunchableApps" >\n' +
    '            <ul class="secondary- center- tabs">\n' +
    '                <!-- inline blocks: let the <li>s close themselves to suppress intervening whitespace -->\n' +
    '                <li>\n' +
    '                    <a ng-click="appCenterCtrl.launcher()">{{\'app.nav.tab.launcher\' | i18n }}</a>\n' +
    '                <li class="is-active">\n' +
    '                    <a ng-click="appCenterCtrl.catalog()">{{\'app.nav.tab.catalog\' | i18n }}</a>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <div class="headered- balanced- sidebarred- frame theme-portal-background" ng-class="{\'no-tabs-\':!appCenterCtrl.hasLaunchableApps}">\n' +
    '        <div class="frame-header appcenter-filter-bar">\n' +
    '            <div class="full-bleed- page">\n' +
    '                <div class="grid">\n' +
    '                    <div class="navigation-tabs-container catalog-margin">\n' +
    '                        <ul class="secondary- tabs">\n' +
    '                            <li>\n' +
    '                                <img src="app/graphics/launcher_inactive.svg" class="navigation-image">\n' +
    '                                <a ng-click="appCenterCtrl.launcher()">{{\'app.nav.tab.launcher\' | i18n }}</a>\n' +
    '                            </li>\n' +
    '                            <li class="is-active">\n' +
    '                                <img src="app/graphics/catalog_active.svg" class="navigation-image catalog-navigation-image">\n' +
    '                                <a ng-click="appCenterCtrl.catalog()">{{\'app.nav.tab.catalog\' | i18n }}</a>\n' +
    '                            </li>\n' +
    '                        </ul>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div>\n' +
    '            <div class="welcomeMessageContainer desktopOnly theme-portal-text">\n' +
    '                <div ng-if="!catalogCtrl.showNoSearchResultsMsg" class="welcomeMessage">{{::\'appCenter.welcomeMsg\' | i18n}}</div>\n' +
    '                <div class="desktopFilterBarContainer tabletPotraitOnly">\n' +
    '                    <div filter-bar="{ isDesktop: true }"\n' +
    '                         selected-item="catalogCtrl.appCenterContext.selectedCategory.name"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="frame-sidebar">\n' +
    '            <div class="vertically- scrollable- pane">\n' +
    '                <div ng-include="\'app/catalog/catalogMenu.html\'"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="vertically- scrollable- pane" infinite-scroll onend="catalogCtrl.getNextPage()">\n' +
    '            <div class="full-bleed- page catalog-items-container">\n' +
    '                <div class="grid">\n' +
    '                    <div class="mobileFilterBarContainer mobileOnly">\n' +
    '                        <div filter-bar selected-item="catalogCtrl.appCenterContext.selectedCategory.name"></div>\n' +
    '                    </div>\n' +
    '                    <div ng-if="catalogCtrl.showNoResultsMsg" class="noresultsmsg box">\n' +
    '                        <strong>{{\'appCenter.noAppsMsg\' | i18n}}</strong>\n' +
    '                    </div>\n' +
    '                    <div ng-if="catalogCtrl.showNoSearchResultsMsg" class="noresultsmsg box mobileOnly">\n' +
    '                        <strong>{{\'appCenter.noSearchResults\' | i18n}}</strong>\n' +
    '                    </div>\n' +
    '                    <div ng-if="catalogCtrl.showNoSearchResultsMsg" class="noresultsmsg box desktopOnly">\n' +
    '                        <strong>{{\'appCenter.noSearchResults\' | i18n}}</strong>\n' +
    '                    </div>\n' +
    '                    <div class="grid" no-touch>\n' +
    '                        <div class="MP-full-width- three- box"\n' +
    '                            ng-repeat="app in catalogCtrl.visibleCatalogApps track by app.appId">\n' +
    '                            <div catalog-item appdata="app" modalobj="$modal" is-loading="catalogCtrl.isLoading" device-status="deviceStatus"></div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div spinner ng-show="catalogCtrl.isLoading"></div>\n' +
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
  $templateCache.put('app/catalog/catalogDropdown.html',
    '<div ng-include="\'app/catalog/catalogMenu.html\'">\n' +
    '</div>\n' +
    '<div class="commonMenu" ng-include="\'app/common/commonMenu.html\'">\n' +
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
  $templateCache.put('app/catalog/catalogItem.html',
    '<div class="catalogitem" ng-click="catalogItemCtrl.details(catalogItemCtrl.app.appId)">\n' +
    '    <div class="box-module">\n' +
    '        <div ng-if="catalogItemCtrl.app.mgmtRequired" class="catalogitem-mgmtrequired-desktop">\n' +
    '            <svg symbol="lock"></svg>\n' +
    '        </div>\n' +
    '        <div class="simple- emblem">\n' +
    '            <div ng-show="catalogItemCtrl.app.imageLoaded" class="emblem-image" ng-style="{\'background-image\': catalogItemCtrl.app.backgroundImage,\'background-size\': catalogItemCtrl.app.backgroundSize}"></div>\n' +
    '        </div>\n' +
    '        <dl class="catalogitem-info">\n' +
    '            <dd class="catalogitem-name">\n' +
    '                <a>\n' +
    '                    <p line-clamp content="::catalogItemCtrl.app.name" lines="2"></p>\n' +
    '                </a>\n' +
    '            </dd>\n' +
    '            <dd class="catalogitem-type">\n' +
    '                {{::catalogItemCtrl.app.typeName | i18n:catalogItemCtrl.app.platformName}}\n' +
    '            </dd>\n' +
    '            <dd ng-if="catalogItemCtrl.app.mgmtRequired" class="catalogitem-mgmtrequired-mobile" id="mgmtRequired">\n' +
    '                <svg symbol="lock"></svg>\n' +
    '            </dd>\n' +
    '        </dl>\n' +
    '        <div install-button app="catalogItemCtrl.app" is-loading="catalogItemCtrl.isLoading"\n' +
    '             modal-obj="catalogItemCtrl.modal" device-status="catalogItemCtrl.deviceStatus"></div>\n' +
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
  $templateCache.put('app/catalog/catalogMenu.html',
    '<ul class="menu">\n' +
    '    <li class="menu-title theme-portal-text">\n' +
    '        <span>\n' +
    '            <svg symbol="browse"></svg>\n' +
    '        </span>\n' +
    '        <span class="menu-title-text">{{::\'appCenter.nav.browseBy\'|i18n}}</span>\n' +
    '    </li>\n' +
    '    <li ng-repeat="label in catalogCtrl.defaultLabels"\n' +
    '        ng-class="{\'is-selected\':catalogCtrl.appCenterContext.selectedCategory.name == label.name}" class="theme-portal-text">\n' +
    '        <a title="{{::label.name}}"\n' +
    '            ng-click="catalogCtrl.filterByLabel(label);">{{::label.name}}</a>\n' +
    '    </li>\n' +
    '    <li class="menu-hrule"></li>\n' +
    '    <li ng-repeat="category in catalogCtrl.appCategories"\n' +
    '        ng-class="{\'is-selected\':catalogCtrl.appCenterContext.selectedCategory.name == category.name}" class="theme-portal-text">\n' +
    '        <a title="{{::category.name}}"\n' +
    '            ng-click="catalogCtrl.filterByLabel(category);">{{::category.name}}</a>\n' +
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
  $templateCache.put('app/catalog/entitlementNotLoadedMsgTemplate.html',
    '<div ng-controller="EntitlementErrorController as entitlementErrCtr" class="message" ng-class="message.type + \'-\'">\n' +
    '    <i class="message-icon"></i>\n' +
    '    <button class="close- button" ng-click="close($index)"></button>\n' +
    '    <div id="more-details-error-info" ng-switch="message.argument" class="message-body typography">\n' +
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
  $templateCache.put('app/catalog/installAppButtonTemplate.html',
    '    <button class="full-width- button catalogitem-action installButton" type="button"\n' +
    '        ng-click="installAppCtrl.activateApp(installAppCtrl.app)"\n' +
    '        ng-disabled = "!installAppCtrl.app.appNeedToActivated && !installAppCtrl.app.isMdmApp"\n' +
    '        ng-class="{ \'hollow-\' : !installAppCtrl.app.appNeedToActivated || installAppCtl.app.isMdmApp,\n' +
    '    \'add-\': installAppCtrl.app.appNeedToActivated && installAppCtrl.app.installStatus != \'UPDATE\',\n' +
    '    \'update-\': installAppCtrl.app.installStatus == \'UPDATE\' }"\n' +
    '        stop-event="click">\n' +
    '        <span class="catalogitem-actiontext">{{ installAppCtrl.app.installAction | i18n }}</span>\n' +
    '    </button>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app/catalog/thinappMultiDeviceActivation.html',
    '<div modal class="thinapp-devices footered- modal scrollable- fullscreen-mobile-">\n' +
    '    <section class="dialog typography">\n' +
    '        <div class="dialog-body">\n' +
    '            <div>\n' +
    '                <div class="simple- emblem">\n' +
    '                    <div class="emblem-image" ng-style="{\'background-image\': ctrl.app.backgroundImage}">\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                 <h3>{{ctrl.app.name}}</h3>\n' +
    '                {{\'app.thinappMultiDeviceAct.heading\' | i18n:ctrl.app.name}}\n' +
    '            </div>\n' +
    '\n' +
    '            <table class="device-table">\n' +
    '                <thead>\n' +
    '                <tr>\n' +
    '                    <th>{{\'app.thinappMultiDeviceAct.tableColumn.deviceName\' | i18n }}</th>\n' +
    '                    <th>{{\'app.thinappMultiDeviceAct.tableColumn.requestStatus\' | i18n }}</th>\n' +
    '                    <th></th>\n' +
    '                </tr>\n' +
    '                </thead>\n' +
    '                <tbody ng-repeat="device in ctrl.deviceReqs">\n' +
    '                <tr>\n' +
    '                    <td>{{device.machineName}}</td>\n' +
    '                    <td>{{ctrl.getThinappRequestStatusMsg(device)}}</td>\n' +
    '                    <td class="action-column">\n' +
    '                        <button ng-click="ctrl.requestThinAppOnADevice(device.userDeviceId)" class="small- primary- button" id="perDeviceRequest" ng-show="ctrl.isRequestable(device)"> {{\'app.thinappMultiDeviceAct.button.request\' | i18n }}</button>\n' +
    '                        <div ng-show="!ctrl.isRequestable(device)"><img src="app/graphics/tick.svg"></div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                </tbody>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button large-" ng-click="ctrl.modal.cancel()">{{ \'button.cancel\' | i18n }}</button>\n' +
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
  $templateCache.put('app/catalog/vppInviteAccept.html',
    '<div modal class="headered- footered- modal medium-max-">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ message }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button" ng-click="modal.cancel()">{{ \'decline\' | i18n }}</button>\n' +
    '            <button class="primary- button" ng-click="modal.close(true)">{{ \'appCenter.acceptInvite\' | i18n }}</button>\n' +
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
  $templateCache.put('app/common/about.html',
    '<div class="usersettings headered- view- frame theme-portal-background">\n' +
    '    <div class="frame-header">\n' +
    '        <div class="theme-portal-masthead">\n' +
    '            <div class="mobile- masthead">\n' +
    '                <div class="masthead-left">\n' +
    '                    <a class="iconic- link- button" ng-click="::appCenterCtrl.backAction()">\n' +
    '                        <svg symbol="mobile-back-arrow"></svg>\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="vertically- scrollable- backdrop- pane">\n' +
    '        <div class="page">\n' +
    '            <article class="typography">\n' +
    '                <header>\n' +
    '                    <div class="usersettings-title">{{ \'app.about.heading\' | i18n }}</div>\n' +
    '                </header>\n' +
    '                <section>\n' +
    '                    <p>\n' +
    '                        {{\'app.about.copyright\' | i18n }}\n' +
    '                    </p>\n' +
    '                </section>\n' +
    '                <nav>\n' +
    '                    <ul class="menu">\n' +
    '                        <li><a class="external-link" target="_blank" ng-href="{{\'app.about.patentsLink\' | i18n}}">{{\'app.about.button.label.patents\' | i18n}}</a></li>\n' +
    '                        <li><a ng-if="isOnPrem" class="external-link" target="_blank" ng-href="{{\'app.about.licenseAgreementLink\' | i18n}}">{{\'app.about.button.label.licenseAgreement\' | i18n}}</a></li>\n' +
    '                        <li><a ng-if="!isOnPrem" class="external-link" target="_blank" ng-href="{{\'app.about.saasLicenseAgreementLink\' | i18n}}">{{\'app.about.button.label.licenseAgreement\' | i18n}}</a></li>\n' +
    '                    </ul>\n' +
    '                </nav>\n' +
    '            </article>\n' +
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
  $templateCache.put('app/common/aboutDialog.html',
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
  $templateCache.put('app/common/appInstallConfirmPrompt.html',
    '<div modal class="headered- footered- modal medium-max-">\n' +
    '    <section class="dialog typography">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="message"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button installPrompt-action" ng-click="modal.cancel()">\n' +
    '                <span class="button-text">{{ \'appCenter.cancel\' | i18n }}</span>\n' +
    '            </button>\n' +
    '            <button class="primary- button installPrompt-action" ng-click="modal.close(true)">\n' +
    '                <span class="button-text">{{ \'appCenter.install\' | i18n }}</span>\n' +
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
  $templateCache.put('app/common/appStoreBanner.html',
    '<div ng-controller="AppBannerController as appBannerCtrl" class="message" ng-class="message.type + \'-\'">\n' +
    '    <button class="close- button" ng-click="close($index)"></button>\n' +
    '    <div class="message-body typography">\n' +
    '        <p>\n' +
    '            <img src="app/graphics/logo_white.svg" class="appstore-banner"/>\n' +
    '            <a class="button small-" ng-href="{{::appBannerCtrl.appStoreInstallLink}}">{{ ::\'app.banner.install\' | i18n }}</a>\n' +
    '            <a ng-if="appBannerCtrl.showOpen" class="button small-" href="javascript:;" ng-click="appBannerCtrl.openWorkspaceOneApp()">{{ ::\'app.banner.open\' | i18n }}</a>\n' +
    '        </p>\n' +
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
  $templateCache.put('app/common/branding.html',
    '<div branding="appCenterCtrl.branding">\n' +
    '    .masthead-logo {\n' +
    '    <span ng-if="$branding.brandNameAndImages.logoUrl">\n' +
    '        background-image: url({{ $branding.brandNameAndImages.logoUrl }});\n' +
    '    </span>\n' +
    '    }\n' +
    '    .theme-portal-masthead {\n' +
    '        background-color: {{ $branding.portalBranding.mastheadBackgroundColor }};\n' +
    '        color: {{ $branding.portalBranding.mastheadForegroundColor }};\n' +
    '    }\n' +
    '    .theme-portal-background, .theme-portal-background.frame {\n' +
    '        background-color: {{ $branding.portalBranding.backgroundColor }};\n' +
    '    }\n' +
    '    .theme-portal-background {\n' +
    '    <span ng-if="$branding.portalBranding.backgroundImageUrl">\n' +
    '        <!--for browsers that don\'t support multiple bg images, skip the overlays-->\n' +
    '        background-image: url({{ $branding.portalBranding.backgroundImageUrl }});\n' +
    '    </span>\n' +
    '    }\n' +
    '    html.multiplebgs .theme-portal-background {\n' +
    '    <span ng-if="$branding.portalBranding.backgroundHighlightUrl ||\n' +
    '                $branding.portalBranding.backgroundPatternUrl ||\n' +
    '                $branding.portalBranding.backgroundImageUrl">\n' +
    '        <!--for browsers that support multiple bg images, show the overlays-->\n' +
    '        background-image:\n' +
    '            url({{ $branding.portalBranding.backgroundHighlightUrl }}),\n' +
    '            url({{ $branding.portalBranding.backgroundPatternUrl }}),\n' +
    '            url({{ $branding.portalBranding.backgroundImageUrl }});\n' +
    '    </span>\n' +
    '    }\n' +
    '    .theme-portal-text {\n' +
    '        color: {{ $branding.portalBranding.foregroundColor }};\n' +
    '    <span ng-if="$branding.portalBranding.letteringEffect===\'letterpress\'">\n' +
    '        text-shadow: 1px 1px rgba(255, 255, 255, 0.5);\n' +
    '    </span>\n' +
    '    <span ng-if="$branding.portalBranding.letteringEffect===\'emboss\'">\n' +
    '        text-shadow: 1px 1px rgba(0, 0, 0, 0.5);\n' +
    '    </span>\n' +
    '    <span ng-if="$branding.portalBranding.letteringEffect===\'none\'">\n' +
    '        text-shadow: none;\n' +
    '    </span>\n' +
    '    }\n' +
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
  $templateCache.put('app/common/changePassword.html',
    '<div ng-controller="ChangePasswordController as ctrl" class="password-page-mobile headered- view- frame theme-portal-background">\n' +
    '        <div class="frame-header">\n' +
    '            <div class="theme-portal-masthead">\n' +
    '                <div class="mobile- masthead">\n' +
    '                    <div class="masthead-left">\n' +
    '                        <a class="iconic- link- button" ng-click="::appCenterCtrl.backAction()">\n' +
    '                            <svg symbol="mobile-back-arrow"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                    <div class="masthead-center">\n' +
    '                        <h3>{{:: \'app.changePassword.title\' | i18n }}</h3>\n' +
    '                    </div>\n' +
    '                    <div class="masthead-right">\n' +
    '                        <button class="iconic- link- button password-save-button" ng-click="::ctrl.changePasswordConfirm($event)" ng-disabled="changePasswordForm.$invalid">\n' +
    '                            <span>{{::\'button.save\' | i18n}}</span>\n' +
    '                        </button>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    <div class="vertically- scrollable- backdrop- pane">\n' +
    '        <div class="page">\n' +
    '            <article>\n' +
    '                <section class="input-fields-container">\n' +
    '                    <div class="error-messages">\n' +
    '                        <svg ng-show="ctrl.showErrors || ctrl.errorMessage" class="warning-ico" symbol="warning"></svg>\n' +
    '                        <div>\n' +
    '                            <span class="server-errors" ng-show="ctrl.showErrors" ng-repeat="error in ctrl.errorMessages">{{ error.description }}&nbsp;</span>\n' +
    '                            <span class="mismatch-error" ng-show="ctrl.errorMessage">{{ctrl.errorMessage}}</span>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <form name="changePasswordForm" novalidate>\n' +
    '                        <div class="input-field-holder">\n' +
    '                            <input type="password" class="input-field" ng-model="ctrl.currentPassword" placeholder="{{:: \'app.changePassword.enterCurrentPassword\' | i18n}}" required>\n' +
    '                        </div>\n' +
    '                        <div class="input-field-holder new-password-label">\n' +
    '                            <p>NEW</p>\n' +
    '                        </div>\n' +
    '                        <div class="input-field-holder">\n' +
    '                            <input type="password" class="input-field" ng-class="{\'error\' : ctrl.errorMessage}" ng-model="ctrl.newPassword" placeholder="{{:: \'app.changePassword.enterNewPassword\' | i18n}}" required>\n' +
    '                        </div>\n' +
    '                        <div class="input-field-holder">\n' +
    '                            <input type="password" class="input-field" ng-class="{\'error\' : ctrl.errorMessage}" ng-model="ctrl.confirmNewPassword" placeholder="{{:: \'app.changePassword.confirmNewPassword\' | i18n}}" required>\n' +
    '                        </div>\n' +
    '                    </form>\n' +
    '                </section>\n' +
    '                <div ng-show="ctrl.policies" class="policy-container">\n' +
    '                    <div class="password-policy">\n' +
    '                        <p>{{:: \'app.passwordPolicy.passwordRequirements\' | i18n}}</p>\n' +
    '                        <p ng-bind-html="ctrl.policyString"></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </article>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div spinner ng-show="ctrl.isLoading"></div>\n' +
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
  $templateCache.put('app/common/changePasswordDialog.html',
    '<div modal class="headered- footered- modal medium-max-">\n' +
    '    <div class="change-password-popup" ng-controller="ChangePasswordController as ctrl">\n' +
    '        <section class="dialog">\n' +
    '            <form name="changePasswordForm" novalidate>\n' +
    '                <header class="dialog-header">\n' +
    '                    <div class="form-row lock-icon">\n' +
    '                        <svg symbol="lock"></svg>\n' +
    '                    </div>\n' +
    '                    <div class="form-row">\n' +
    '                        <h3>{{:: \'app.changePassword.title\' | i18n}}</h3>\n' +
    '                    </div>\n' +
    '                </header>\n' +
    '                <section class="dialog-body">\n' +
    '                    <div class="form-fields-holder">\n' +
    '                        <p class="form-row form-label">{{:: \'app.changePassword.enterCurrentPassword\' | i18n}}</p>\n' +
    '                        <input class="form-row input-field" type="password" autocapitalize="off" autocorrect="off" ng-model="ctrl.currentPassword" required>\n' +
    '                    </div>\n' +
    '                    <div class="form-fields-holder">\n' +
    '                        <p class="form-row form-label">{{:: \'app.changePassword.enterNewPassword\' | i18n}}</p>\n' +
    '                        <input class="form-row input-field" type="password" autocapitalize="off" autocorrect="off" ng-model="ctrl.newPassword" required>\n' +
    '                    </div>\n' +
    '                    <div class="form-fields-holder">\n' +
    '                        <p class="form-row form-label">{{:: \'app.changePassword.repeatNewPassword\' | i18n}}</p>\n' +
    '                        <input class="form-row input-field" type="password" autocapitalize="off" autocorrect="off" ng-model="ctrl.confirmNewPassword" required>\n' +
    '                    </div>\n' +
    '                    <p class="error-messages mismatch-error" ng-show="changePasswordForm.$error.unique">{{:: \'app.setAppPassword.error.passwordsNoMatch\' | i18n}}</p>\n' +
    '                    <p class="error-messages" ng-show="ctrl.showErrors" ng-repeat="error in ctrl.errorMessages">{{error.description}}</p>\n' +
    '                </section>\n' +
    '                <footer class="dialog-actions">\n' +
    '                    <button class="link- button" ng-click="ctrl.closePasswordForm()">{{ \'button.close\' | i18n }}</button>\n' +
    '                    <button class="primary- button" id="change-password-button" ng-click="ctrl.changePasswordConfirm($event)" ng-disabled="changePasswordForm.$invalid">{{:: \'app.changePassword.title\' | i18n }}</button>\n' +
    '                </footer>\n' +
    '            </form>\n' +
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
  $templateCache.put('app/common/commonMenu.html',
    '<ul class="menu">\n' +
    '    <li ng-show="!appCenterCtrl.isAWJade && appCenterCtrl.user.adminUser" class="desktopOnly"><a ng-click="appCenterCtrl.adminConsole($event)">{{\'userInfo.adminConsole\'  | i18n}}</a></li>\n' +
    '    <li class="desktopOnly"><a ng-click="appCenterCtrl.about($event, true)">{{\'userInfo.about\'  | i18n}}</a></li>\n' +
    '    <li class="mobileOnly"><a ng-click="appCenterCtrl.about($event, false)">{{\'userInfo.about\'  | i18n}}</a></li>\n' +
    '    <li ng-show="!appCenterCtrl.isAWJade"><a ng-click="appCenterCtrl.preferences($event)">{{\'userInfo.preferences\'  | i18n}}</a></li>\n' +
    '    <li><a ng-click="appCenterCtrl.openDevices($event)">{{\'userInfo.devices\'  | i18n}}</a></li>\n' +
    '    <li ng-show="appCenterCtrl.showRemoveAccountLink"><a ng-click="appCenterCtrl.unEnrollConfirm($event)">{{\'userInfo.removeAccount\' | i18n}}</a></li>\n' +
    '    <li class="desktopOnly account-link"><a ng-click="appCenterCtrl.openProfile($event)">{{\'userInfo.account\' | i18n}}</a></li>\n' +
    '    <li ng-show="appCenterCtrl.passwordChangeEnabled" class="mobileOnly password-link"><a ng-click="appCenterCtrl.changePassword($event)">{{\'userInfo.password\' | i18n}}</a></li>\n' +
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
  $templateCache.put('app/common/confirmLogout.html',
    '<div modal class="headered- footered- modal medium-max-">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ \'app.logout.title\' | i18n }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ \'app.logout.confirm.msg\' | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="primary- button large-" ng-click="appCenterCtrl.continueSignout($event);">{{ \'userInfo.signout\' | i18n }}</button>\n' +
    '            <button ng-click="$modal.cancel();" class="link- button"> {{\'button.cancel\' | i18n }}</button>\n' +
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
  $templateCache.put('app/common/devicesDialog.html',
    '<div modal class="thinapp-devices footered- modal scrollable- fullscreen-mobile-">\n' +
    '    <section class="dialog" ng-controller="DevicesController as ctrl">\n' +
    '        <div class="dialog-body typography userDevices">\n' +
    '            <h3>{{\'app.devices.heading\' | i18n }}</h3>\n' +
    '            <div class="desktopOnly">\n' +
    '                <table>\n' +
    '                    <thead>\n' +
    '                    <tr>\n' +
    '                        <th>{{\'app.devices.tableColumn.deviceName\' | i18n }}</th>\n' +
    '                        <th>{{\'app.devices.tableColumn.lastLoginTime\' | i18n }}</th>\n' +
    '                        <th></th>\n' +
    '                    </tr>\n' +
    '                    </thead>\n' +
    '                    <tbody ng-if="ctrl.devices.length > 0 && !ctrl.isLoading" ng-repeat="device in ctrl.devices">\n' +
    '                        <tr>\n' +
    '                            <td><img ng-if="device.iconName != \'\'" class="device-icon" src="app/graphics/{{device.iconName}}">&nbsp;&nbsp;{{device.machineName}}</td>\n' +
    '                            <td>{{device.lastLoginTime | date:\'medium\'}}</td>\n' +
    '                            <td>\n' +
    '                                <button ng-click="ctrl.unlinkDevice(device, $event)" class="small- primary- button" ng-show="device.osFamily == \'Windows\'"> {{\'app.devices.unlinkDevice\' | i18n }}</button>\n' +
    '                            </td>\n' +
    '                        </tr>\n' +
    '                    </tbody>\n' +
    '                    <tbody ng-if="ctrl.devices.length < 1 && !ctrl.isLoading" >\n' +
    '                    <tr>\n' +
    '                        <td colspan="3">\n' +
    '                            <div class="text-center">\n' +
    '                                <br/><br/><br/>\n' +
    '                                <strong>{{"app.devices.emptyDeviceListTitle" | i18n}}</strong>\n' +
    '                                <br/><br/>\n' +
    '                                <p>{{\'app.devices.emptyDeviceListMessage\' | i18n}}</p>\n' +
    '                                <br/><br/><br/><br/><br/><br/>\n' +
    '                            </div>\n' +
    '                        </td>\n' +
    '                    </tr>\n' +
    '                    </tbody>\n' +
    '                </table>\n' +
    '            </div>\n' +
    '            <div class="mobileOnly">\n' +
    '                <table>\n' +
    '                    <thead>\n' +
    '                    <tr>\n' +
    '                        <th>{{\'app.devices.tableColumn.deviceName\' | i18n }}</th>\n' +
    '                    </tr>\n' +
    '                    </thead>\n' +
    '                    <tbody ng-if="ctrl.devices.length > 0 && !ctrl.isLoading" ng-repeat="device in ctrl.devices">\n' +
    '                        <tr>\n' +
    '                            <td>\n' +
    '                                <div>\n' +
    '                                    <div>\n' +
    '                                        <img ng-if="device.iconName != \'\'" class="device-icon" src="app/graphics/{{device.iconName}}">&nbsp;&nbsp;{{device.machineName}}\n' +
    '                                    </div>\n' +
    '                                    <div>\n' +
    '                                        <span class="lastLoginTimeLabel">{{\'app.devices.tableColumn.lastLoginTime\' | i18n }}:</span>{{device.lastLoginTime | date:\'medium\'}}\n' +
    '                                    </div>\n' +
    '                                    <div class="unlinkDeviceBtn">\n' +
    '                                        <button ng-click="ctrl.unlinkDevice(device, $event)" class="small- primary- button" ng-show="device.osFamily == \'Windows\'"> {{\'app.devices.unlinkDevice\' | i18n }}</button>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                            </td>\n' +
    '                        </tr>\n' +
    '                    </tbody>\n' +
    '                    <tbody ng-if="ctrl.devices.length < 1 && !ctrl.isLoading" >\n' +
    '                    <tr>\n' +
    '                        <td>\n' +
    '                            <div class="text-center">\n' +
    '                                <br/><br/><br/>\n' +
    '                                <strong>{{"app.devices.emptyDeviceListTitle" | i18n}}</strong>\n' +
    '                                <br/><br/>\n' +
    '                                <p>{{\'app.devices.emptyDeviceListMessage\' | i18n}}</p>\n' +
    '                                <br/><br/><br/><br/><br/><br/>\n' +
    '                            </div>\n' +
    '                        </td>\n' +
    '                    </tr>\n' +
    '                    </tbody>\n' +
    '                </table>\n' +
    '            </div>\n' +
    '            <div spinner ng-show="ctrl.isLoading" ></div>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button large-" ng-click="$modal.close(true);">{{ \'button.cancel\' | i18n }}</button>\n' +
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
  $templateCache.put('app/common/directives/desktopFilterMenuTemplate.html',
    '<div class="desktopFilterMenuContainer desktopOnly dropdown-panel dropdown-arrow dropdown-arrow-right" stop-event="click">\n' +
    '    <div class="dropdown-arrow dropdown-arrow-right">\n' +
    '        <svg class="border" symbol="components/dropdown/graphics/arrow.svg"></svg>\n' +
    '        <svg class="bg" symbol="components/dropdown/graphics/arrow.svg"></svg>\n' +
    '    </div>\n' +
    '    <div list-view items="$filter.config.items" select-item="$filter.selectItem(item)"\n' +
    '         default-item="$filter.config.defaultItem">\n' +
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
  $templateCache.put('app/common/directives/filterBarTemplate.html',
    '<div class="mobileFilterBar" ng-class="{\'starred-\': $filterBar.config.favEnabled}">\n' +
    '    <div class="filterFavorite" ng-show="$filterBar.config.favEnabled" ng-click="$filterBar.toggleFavorite()"\n' +
    '         ng-class="{ \'is-active\' : $filterBar.config.isFavorited}" >\n' +
    '        <svg symbol="star"></svg>\n' +
    '    </div>\n' +
    '    <div ng-class="{ \'dropdown\': $filterBar.config.isDesktop, \'is-active\': !isClosed }" ng-click="$filterBar.toggle()" class="filterDropdown">\n' +
    '        <div class="filterName">\n' +
    '            <span>{{$filterBar.selectedItem}}</span>\n' +
    '        </div>\n' +
    '        <div class="filterIcon">\n' +
    '            <a class="iconic- link- button" ng-if="!$filterBar.config.isDesktop">\n' +
    '                <svg symbol="carat-right"></svg>\n' +
    '            </a>\n' +
    '            <a class="iconic- link- button" ng-if="$filterBar.config.isDesktop">\n' +
    '                <svg symbol="carat-down"></svg>\n' +
    '            </a>\n' +
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
  $templateCache.put('app/common/directives/filterMenuTemplate.html',
    '<div class="mobileFilterMenuContainer mobileOnly" ng-show="!$filter.config.closeFilterMenu">\n' +
    '    <div class=" headered- view- frame theme-portal-background">\n' +
    '        <div class="frame-header">\n' +
    '            <div class="theme-portal-masthead">\n' +
    '                <div class="mobile- masthead">\n' +
    '                    <div class="masthead-left">\n' +
    '                        <a class="iconic- link- button" ng-click="$filter.close()">\n' +
    '                            <svg symbol="mobile-back-arrow"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                    <div class="masthead-center">\n' +
    '                        <span>{{::\'appCenter.nav.filter\' | i18n}}</span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="headered- frame">\n' +
    '            <div class="vertically- scrollable- backdrop- pane">\n' +
    '                <div class="page">\n' +
    '                    <div list-view items="$filter.config.items" select-item="$filter.selectItem(item)"\n' +
    '                            default-item="$filter.config.defaultItem">\n' +
    '\n' +
    '                    </div>\n' +
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
  $templateCache.put('app/common/directives/hamburgerMenu.html',
    '<div class="headered- hamburgermenu" ng-class="{\'footered-\': !appCenterCtrl.isWebClip}">\n' +
    '    <div class="hamburgermenu-header">\n' +
    '        <svg class="userinfo-avatar" symbol="avatar"></svg><!--\n' +
    '        --><span class="userinfo-name" title="{{appCenterCtrl.user.firstName + \' \' +appCenterCtrl.user.lastName}}">\n' +
    '            {{ appCenterCtrl.user.firstName + \' \' +appCenterCtrl.user.lastName }}\n' +
    '        </span>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="vertically- scrollable- pane">\n' +
    '        <div class="commonMenu" ng-include="\'app/common/commonMenu.html\'"></div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="hamburgermenu-footer" ng-show="appCenterCtrl.showSignoutLinkInMobile">\n' +
    '        <a class="signout-link" ng-click="appCenterCtrl.signout($event)">{{\'userInfo.signout\' | i18n}}</a>\n' +
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
  $templateCache.put('app/common/directives/listView.html',
    '<ul class="menu theme-portal-text">\n' +
    '    <li ng-repeat="item in $listView.items">\n' +
    '        <a title="{{::item.name}}" ng-click="$listView.selectLabel(item);">\n' +
    '            <span class="menu-item-name" style="float: left">{{::item.name}}</span>\n' +
    '            <span ng-show="$listView.config.selectedItem.name == item.name" style="float: right"><svg symbol="checkmark"></svg></span>\n' +
    '        </a>\n' +
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
  $templateCache.put('app/common/enrollModal.html',
    '<div modal class="headered- footered- modal medium-max-">\n' +
    '    <section class="dialog typography">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ \'installStatus.enrollDevice\' | i18n:name }}</p>\n' +
    '            <a href class="link- privacy-page-text" ng-click="appCenterCtrl.openPrivacyPage($event, privacyUrl)">{{ \'installStatus.enrollDevice.learnMore\' | i18n }} <svg class="symbol" symbol="carat-down"></svg></a>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button installPrompt-action" ng-click="modal.cancel()">\n' +
    '                <span class="button-text">{{ \'appCenter.cancel\' | i18n }}</span>\n' +
    '            </button>\n' +
    '            <button class="primary- button installPrompt-action" ng-click="modal.close(true)">\n' +
    '                <span class="button-text">{{ \'appCenter.proceed\' | i18n }}</span>\n' +
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
  $templateCache.put('app/common/eulaModal.html',
    '<div modal class="headered- footered- modal scrollable- fullscreen-mobile-">\n' +
    '    <section class="dialog typography">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ title }}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p ng-bind-html="message"></p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button large-" ng-click="modal.cancel()">{{ \'decline\' | i18n }}</button>\n' +
    '            <button class="primary- button large-" ng-click="modal.close(true)">{{ \'accept\' | i18n }}</button>\n' +
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
  $templateCache.put('app/common/header.html',
    '<div class="desktop- masthead">\n' +
    '    <div class="masthead-left">\n' +
    '        <div class="contained- image masthead-logo"></div>\n' +
    '    </div>\n' +
    '    <div class="masthead-center">\n' +
    '        <span class="input- bar">\n' +
    '            <label>\n' +
    '                <svg symbol="search"></svg>\n' +
    '            </label>\n' +
    '            <input search-input class="search- input" type="text" ng-model="appCenterCtrl.searchText"\n' +
    '                   ng-model-options="{ debounce: 1000 }" control="appCenterCtrl.desktopSearchInputControl" placeholder="{{\'appCenter.searchApps\' | i18n }}">\n' +
    '            <button class="iconic- button clear-search" type="button" ng-click="appCenterCtrl.clearDesktopSearchText()" ng-show="appCenterCtrl.searchText">\n' +
    '                <svg symbol="circle-x"></svg>\n' +
    '            </button>\n' +
    '        </span>\n' +
    '    </div>\n' +
    '    <div ng-hide="!!appCenterCtrl.horizon && !appCenterCtrl.horizon.showUserInfo" class="masthead-right">\n' +
    '        <div dropdown class="right- dropdown userinfo">\n' +
    '            <div class="dropdown-toggle">\n' +
    '                <svg class="userinfo-avatar" symbol="avatar"></svg><!--\n' +
    '                --><span class="userinfo-name" title="{{appCenterCtrl.user.firstName + \' \' +appCenterCtrl.user.lastName}}">{{appCenterCtrl.user.firstName + \' \' +appCenterCtrl.user.lastName}}</span><!--\n' +
    '                --><svg id="dropdown-carat" symbol="carat-down"></svg>\n' +
    '            </div>\n' +
    '            <div dropdown-panel>\n' +
    '                <div class="dropdown-arrow dropdown-arrow-right">\n' +
    '                    <svg class="border" symbol="components/dropdown/graphics/arrow.svg"></svg>\n' +
    '                    <svg class="bg" symbol="components/dropdown/graphics/arrow.svg"></svg>\n' +
    '                </div>\n' +
    '                <ul class="menu">\n' +
    '                    <li>{{::appCenterCtrl.user.emailAddress}}</li>\n' +
    '                    <li class="menu-hrule"></li>\n' +
    '                </ul>\n' +
    '                <div ng-include="\'app/common/commonMenu.html\'">\n' +
    '                </div>\n' +
    '                <ul class="menu" ng-show="!appCenterCtrl.isWebClip">\n' +
    '                    <li><a ng-click="appCenterCtrl.signout($event)" id="signout-link">{{\'userInfo.signout\'  | i18n}}</a></li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '\n' +
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
  $templateCache.put('app/common/mobileSearchContainer.html',
    '<div class="searchContainer ng-hide-animate" ng-show="appCenterCtrl.searchMode">\n' +
    '    <span class="inputContainer">\n' +
    '        <span class="icon-left"><svg symbol="search"></svg></span>\n' +
    '        <input search-input id="searchInput" class="search- input" type="search" ng-model="appCenterCtrl.searchText"\n' +
    '               ng-model-options="{ debounce: 250 }" autocapitalize="off" autocorrect="off"\n' +
    '               placeholder="{{\'appCenter.searchApps\' | i18n }}" control="appCenterCtrl.mobileSearchInputControl">\n' +
    '        <span class="icon-right" ng-show="appCenterCtrl.searchText" ng-click="appCenterCtrl.clearSearch()"><svg symbol="circle-x"></svg></span>\n' +
    '    </span>\n' +
    '    <a class="close" ng-click="appCenterCtrl.closeSearch()">{{::\'button.cancel\'|i18n}}</a>\n' +
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
  $templateCache.put('app/common/passwordVaultBanner.html',
    '<div ng-controller="PasswordVaultBannerController as passwordVaultBannerCtrl" class="message" ng-class="message.type + \'-\'">\n' +
    '    <button class="close- button" ng-click="close($index)"></button>\n' +
    '    <div class="message-body typography passwordvault-banner">\n' +
    '        <p>\n' +
    '            <svg symbol="info"></svg>\n' +
    '            {{ ::\'app.passwordVault.banner.msg\' | i18n }}\n' +
    '            <a class="button small-" href="javascript:;" ng-click="passwordVaultBannerCtrl.installPasswordVaultPlugin()">{{ ::\'app.passwordVault.banner.button.install\' | i18n }}</a>\n' +
    '        </p>\n' +
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
  $templateCache.put('app/common/privateAppInstructionsModal.html',
    '<div modal class="footered- modal medium-max-">\n' +
    '    <section class="dialog typography">\n' +
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
    '            <p class="tutorialLink" ng-click="modal.open(\'app/common/privateAppTutorialModal.html\', { modal: modal })">{{\'appCenter.internalApp.watchTutorial\' | i18n}}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button installPrompt-action" ng-click="modal.cancel()">\n' +
    '                <span class="button-text">{{ \'appCenter.cancel\' | i18n }}</span>\n' +
    '            </button>\n' +
    '            <button class="primary- button installPrompt-action" ng-click="modal.close(true)">\n' +
    '                <span class="button-text">{{ \'appCenter.install\' | i18n }}</span>\n' +
    '            </button>\n' +
    '        </footer>\n' +
    '    </section>\n' +
    '</div>\n' +
    '<style type="text/css">\n' +
    '    .instructionsTitle {\n' +
    '        font-weight: bold;\n' +
    '        padding-bottom: 15px;\n' +
    '    }\n' +
    '    .tutorialLink {\n' +
    '        text-align: center;\n' +
    '        color: #4990C2;\n' +
    '    }\n' +
    '</style>\n' +
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
  $templateCache.put('app/common/privateAppTutorialModal.html',
    '<div modal class="modal fixed-height- fullscreen-mobile- small-desktop-">\n' +
    '    <section class="dialog typography">\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="tutorialImageHeader">\n' +
    '                <p ng-click="modal.close()">{{\'appCenter.done\' | i18n}}</p></div>\n' +
    '            <div class="tutorialImage">\n' +
    '                <video autoplay muted loop controls webkit-playsinline\n' +
    '                       poster="app/images/trust_private_app_poster.png" preload="auto">\n' +
    '                    <source src="app/images/trust_private_app_tutorial.mp4" type="video/mp4">\n' +
    '                </video>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '<style>\n' +
    '    .tutorialImageHeader {\n' +
    '        height: 10%;\n' +
    '    }\n' +
    '    .tutorialImageHeader p {\n' +
    '        float: right;\n' +
    '        color: #4990C2;\n' +
    '    }\n' +
    '    .tutorialImage {\n' +
    '        height: 90%;\n' +
    '    }\n' +
    '    video {\n' +
    '        display: block;\n' +
    '        max-height:90%;\n' +
    '        margin: 0 auto;\n' +
    '    }\n' +
    '</style>');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.appcenter.templates');
} catch (e) {
  module = angular.module('greenbox.appcenter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('app/common/profileDialog.html',
    '<div modal class="headered- footered- new medium-max-">\n' +
    '    <div class="change-password-popup" ng-controller="ChangePasswordController as ctrl">\n' +
    '        <section class="dialog">\n' +
    '                <header class="dialog-header">\n' +
    '                    <div class="form-row">\n' +
    '                        <h3>{{:: \'userInfo.account\' | i18n}}</h3>\n' +
    '                    </div>\n' +
    '                    <button class="form-row right-icon button link-" ng-click="ctrl.closePasswordForm()">\n' +
    '                        <svg class="close-ico" symbol="close"></svg>\n' +
    '                    </button>\n' +
    '                </header>\n' +
    '                <section class="dialog-body">\n' +
    '                    <div class="left-container" ng-class="{\'reduce-width\' : ctrl.showPasswordForm}">\n' +
    '                        <div class="profile-container">\n' +
    '                            <p class="user-name profile-value">{{:: ctrl.userInfo.firstName }}&nbsp;{{:: ctrl.userInfo.lastName }}</p>\n' +
    '                            <p ng-if="ctrl.userInfo.emailAddress">\n' +
    '                                <span class="label">{{:: \'app.changePassword.label.email\' | i18n}}</span>\n' +
    '                                <span class="profile-value">{{:: ctrl.userInfo.emailAddress }}</span></p>\n' +
    '                            <p ng-if="ctrl.userInfo.phoneNumber">\n' +
    '                                <span class="label">{{:: \'app.changePassword.label.phone\' | i18n}}</span>\n' +
    '                                <span class="profile-value">{{:: ctrl.userInfo.phoneNumber }}</span></p>\n' +
    '                            <p>\n' +
    '                                <a ng-if="ctrl.userInfo.changePasswordAllowed" class="iconic- link- button change-password-link" ng-click="ctrl.togglePasswordForm()">\n' +
    '                                    <span>{{::\'app.changePassword.title\' | i18n}}</span>\n' +
    '                                </a>\n' +
    '                            </p>\n' +
    '                        </div>\n' +
    '                        <div ng-show="ctrl.showPasswordForm && ctrl.policies" class="policy-container">\n' +
    '                            <div class="password-policy">\n' +
    '                                <p>{{:: \'app.passwordPolicy.passwordRequirements\' | i18n}}</p>\n' +
    '                                <p ng-bind-html="ctrl.policyString"></p>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div ng-show="ctrl.showPasswordForm" class="password-container">\n' +
    '                        <form name="changePasswordForm" novalidate>\n' +
    '                            <div class="error-messages">\n' +
    '                                <svg ng-show="ctrl.showErrors || ctrl.errorMessage" class="warning-ico" symbol="warning"></svg>\n' +
    '                                <div>\n' +
    '                                    <span class="server-errors" ng-show="ctrl.showErrors" ng-repeat="error in ctrl.errorMessages">{{ error.description }}&nbsp;</span>\n' +
    '                                    <span class="mismatch-error" ng-show="ctrl.errorMessage">{{ctrl.errorMessage}}</span>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="divider">\n' +
    '                                <div class="form-fields-holder">\n' +
    '                                    <input class="form-row input-field" type="password" ng-model="ctrl.currentPassword" placeholder="{{:: \'app.changePassword.enterCurrentPassword\' | i18n}}" required>\n' +
    '                                </div>\n' +
    '                                <div class="form-fields-holder new-password-label">\n' +
    '                                    <p>NEW</p>\n' +
    '                                </div>\n' +
    '                                <div class="form-fields-holder">\n' +
    '                                    <input class="form-row input-field" ng-class="{\'error\' : ctrl.errorMessage}" type="password" ng-model="ctrl.newPassword" placeholder="{{:: \'app.changePassword.enterNewPassword\' | i18n}}" required>\n' +
    '                                </div>\n' +
    '                                <div class="form-fields-holder no-margin">\n' +
    '                                    <input class="form-row input-field" ng-class="{\'error\' : ctrl.errorMessage}" type="password" ng-model="ctrl.confirmNewPassword" placeholder="{{:: \'app.changePassword.confirmNewPassword\' | i18n}}" required>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </form>\n' +
    '                    </div>\n' +
    '                </section>\n' +
    '                <footer class="dialog-actions">\n' +
    '                    <button class="button link- close-button" ng-class="{\'move-left\' : ctrl.showPasswordForm}" ng-click="ctrl.closePasswordForm()">{{:: \'button.close\' | i18n }}</button>\n' +
    '                    <button class="button link- password-save-button" ng-show="ctrl.showPasswordForm" ng-click="ctrl.changePasswordConfirm($event)" ng-disabled="changePasswordForm.$invalid">{{:: \'button.save\' | i18n }}</button>\n' +
    '                </footer>\n' +
    '        </section>\n' +
    '        <div spinner ng-show="ctrl.isLoading"></div>\n' +
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
  $templateCache.put('app/common/unenrollWarning.html',
    '<div modal class="headered- footered- modal medium-max-">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>{{ \'appCenter.device.unEnrollWarningTitle\' | i18n}}</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ \'appCenter.device.mdmUnEnrollMessage\' | i18n}}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button" ng-click="$modal.cancel()">{{ \'appCenter.cancel\' | i18n }}</button>\n' +
    '            <button class="primary- button" ng-click="appCenterCtrl.unEnrollCallback();$modal.close(true)">{{ \'appCenter.proceed\' | i18n }}</button>\n' +
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
  $templateCache.put('app/details/details.html',
    '<div modal-context class="details-main headered- view- frame theme-portal-background">\n' +
    '    <div class="frame-header">\n' +
    '        <div class="theme-portal-masthead">\n' +
    '            <div class="mobile- masthead">\n' +
    '                <div class="masthead-left">\n' +
    '                    <a class="iconic- link- button" ng-click="::detailsCtrl.backAction()">\n' +
    '                        <svg symbol="mobile-back-arrow"></svg>\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="headered- frame">\n' +
    '        <div class="frame-header">\n' +
    '            <div class="details-filter-bar">\n' +
    '                <div class="page- grid">\n' +
    '                    <div class="four- box has-overflow">\n' +
    '                        <a class="iconic- link- button" ng-click="::detailsCtrl.backAction()">\n' +
    '                            <svg symbol="arrow-left"></svg>\n' +
    '                            <span>{{::\'app.details.link.back\' | i18n}}</span>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="vertically- scrollable- backdrop- pane">\n' +
    '            <div class="page">\n' +
    '                <article class="appdetails typography">\n' +
    '                    <header>\n' +
    '                        <div class="media">\n' +
    '                            <div class="media-image">\n' +
    '                                <div class="simple- emblem borderless-">\n' +
    '                                    <div class="emblem-image"\n' +
    '                                         ng-style="{\'background-image\':(\'url(\'+ detailsCtrl.iconStyle+\')\')}">\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="media-body">\n' +
    '                                <h2>{{ ::detailsCtrl.name }}</h2>\n' +
    '                                <ul class="list">\n' +
    '                                    <li ng-if="::detailsCtrl.subType">\n' +
    '                                        {{::\'app.details.label.type\' | i18n}}&nbsp;{{::detailsCtrl.appSubType}}\n' +
    '                                    </li>\n' +
    '                                    <li ng-if="::(detailsCtrl.version || detailsCtrl.size || detailsCtrl.price)">\n' +
    '                                        <ul class="inline- list">\n' +
    '                                            <li ng-if="::detailsCtrl.version">\n' +
    '                                                {{::\'app.details.label.version\' | i18n}}:&nbsp; {{ ::detailsCtrl.version }}\n' +
    '                                            </li>\n' +
    '                                            <li ng-if="::detailsCtrl.size">\n' +
    '                                                {{\n' +
    '                                                    ::(detailsCtrl.size/1000000).toPrecision(3)\n' +
    '                                                }}{{\n' +
    '                                                    ::\'app.details.abbrev.megabytes\' | i18n\n' +
    '                                                }}\n' +
    '                                            </li>\n' +
    '                                            <li ng-if="::detailsCtrl.price">\n' +
    '                                                {{ ::detailsCtrl.price }}\n' +
    '                                            </li>\n' +
    '                                        </ul>\n' +
    '                                    </li>\n' +
    '                                </ul>\n' +
    '                                <div ng-if="::detailsCtrl.installStatus" class="appdetails-action">\n' +
    '                                    <div install-button app="detailsCtrl" is-loading="detailsCtrl.isLoading"\n' +
    '                                         modal-obj="$modal" normal-width="true"></div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </header>\n' +
    '                    <nav ng-if="::detailsCtrl.reviews.length">\n' +
    '                        <ul class="button- bar">\n' +
    '                            <li class="large- hollow- button is-selected">\n' +
    '                                {{::\'app.details.nav.details\' | i18n}}\n' +
    '                            </li>\n' +
    '                            <li class="large- hollow- button">\n' +
    '                                {{::\'app.details.nav.reviews\' | i18n}}\n' +
    '                            </li>\n' +
    '                        </ul>\n' +
    '                    </nav>\n' +
    '                    <section ng-if="::detailsCtrl.mgmtRequired" id="mgmtRequired" >\n' +
    '                            <svg symbol="lock"></svg>\n' +
    '                            <span>{{::\'app.details.needsDeviceEnrollment\' | i18n}}</span>\n' +
    '                    </section>\n' +
    '                    <section ng-if="::detailsCtrl.screenshots.length" id="screenshots">\n' +
    '                        <ul class="grid appdetails-screenshots">\n' +
    '                            <li class="four- box" ng-repeat="item in ::detailsCtrl.screenshots">\n' +
    '                                <div class="contained- square- image"\n' +
    '                                    style="background-image: url({{item.href}})" ng-click="detailsCtrl.goToSlide($index)"></div>\n' +
    '                            </li>\n' +
    '                        </ul>\n' +
    '                    </section>\n' +
    '                    <section ng-if="detailsCtrl.screenshots.length == 0" id = "noScreenshots">\n' +
    '                        <h3>{{::\'app.details.label.screenshots\' | i18n}}</h3>\n' +
    '                        <div>{{::\'app.details.noScreenshots\' | i18n}}</div>\n' +
    '                    </section>\n' +
    '                    <section ng-if="::detailsCtrl.descriptionHTML" id="description">\n' +
    '                        <h3>{{::\'app.details.label.description\' | i18n}}</h3>\n' +
    '                        <div ng-bind-html="::detailsCtrl.descriptionHTML"></div>\n' +
    '                    </section>\n' +
    '                    <section ng-if="!detailsCtrl.descriptionHTML && !detailsCtrl.isLoading" id="pt-detail-nodescription">\n' +
    '                        <h3>{{::\'app.details.label.description\' | i18n}}</h3>\n' +
    '                        <div>{{::\'app.details.noDescription\' | i18n}}</div>\n' +
    '                    </section>\n' +
    '                    <section ng-if="::detailsCtrl.categories.length || detailsCtrl.version || detailsCtrl.size">\n' +
    '                        <h3>{{::\'app.details.label.information\' | i18n}}</h3>\n' +
    '                        <dl class="compact- description- list">\n' +
    '                            <dt ng-if="::detailsCtrl.categories.length">\n' +
    '                                {{::\'app.details.label.category\' | i18n}}</dt>\n' +
    '                            <dd ng-if="::detailsCtrl.categories.length">\n' +
    '                                <ul class="comma- list">\n' +
    '                                    <li ng-repeat="cat in ::detailsCtrl.categories">{{cat}}</li>\n' +
    '                                </ul>\n' +
    '                            </dd>\n' +
    '                            <dt ng-if="detailsCtrl.version">{{::\'app.details.label.version\' | i18n}}</dt>\n' +
    '                            <dd ng-if="detailsCtrl.version">{{::detailsCtrl.version}}</dd>\n' +
    '                            <dt ng-if="detailsCtrl.size">{{::\'app.details.label.size\' | i18n}}</dt>\n' +
    '                            <dd ng-if="detailsCtrl.size">    {{\n' +
    '                                    ::(detailsCtrl.size/1000000).toPrecision(3)\n' +
    '                                }}{{\n' +
    '                                    ::\'app.details.abbrev.megabytes\' | i18n\n' +
    '                                }}</dd>\n' +
    '                            <dt ng-if="detailsCtrl.price">{{::\'app.details.label.price\' | i18n}}</dt>\n' +
    '                            <dd ng-if="detailsCtrl.price">{{::detailsCtrl.price}}</dd>\n' +
    '                        </dl>\n' +
    '                    </section>\n' +
    '                    <section ng-if="detailsCtrl.showRequirement">\n' +
    '                        <h3>{{::\'app.details.label.requirement\' | i18n}}</h3>\n' +
    '                        <dl>\n' +
    '                            <!--For ThinApp-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'THINAPP\'">\n' +
    '                                <span>{{::\'app.details.thinapp.requirement\' | i18n}}</span>\n' +
    '                            </dd>\n' +
    '\n' +
    '                            <!--For XenApp-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'XENAPP\'">\n' +
    '                                <span ng-click="preventCloseOnClick($event)" ng-bind-html="detailsCtrl.xenAppTooltip" ></span>\n' +
    '                            </dd>\n' +
    '\n' +
    '                            <!--For XenAppDeliveryGroup-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'XENAPPDELIVERYGROUP\'">\n' +
    '                                <span ng-click="preventCloseOnClick($event)" ng-bind-html="detailsCtrl.xenAppDeliveryGroupTooltip" ></span>\n' +
    '                            </dd>\n' +
    '\n' +
    '                            <!--For ViewDesktop-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'VIEWPOOL\'">\n' +
    '                                <span ng-click="preventCloseOnClick($event)" ng-bind-html="detailsCtrl.viewDesktopTooltip" ></span>\n' +
    '                            </dd>\n' +
    '\n' +
    '                            <!--For ViewApp-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'VIEWAPP\'">\n' +
    '                                <span ng-click="preventCloseOnClick($event)" ng-bind-html="detailsCtrl.viewAppTooltip" ></span>\n' +
    '                            </dd>\n' +
    '\n' +
    '                            <!--For DesktoneDesktop-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'DESKTONEDESKTOP\'">\n' +
    '                                <span ng-click="preventCloseOnClick($event)" ng-bind-html="detailsCtrl.desktoneTooltip"></span>\n' +
    '                            </dd>\n' +
    '\n' +
    '                            <!--For DesktoneApplication-->\n' +
    '                            <dd ng-if="detailsCtrl.subType === \'DESKTONEAPPLICATION\'">\n' +
    '                                <span ng-click="preventCloseOnClick($event)" ng-bind-html="detailsCtrl.daasAppTooltip"></span>\n' +
    '                            </dd>\n' +
    '                        </dl>\n' +
    '\n' +
    '                    </section>\n' +
    '\n' +
    '                </article>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div spinner ng-show="detailsCtrl.isLoading"></div>\n' +
    '\n' +
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
  $templateCache.put('app/details/zoomedImageCarousel.html',
    '<div modal class="modal fixed-height- fullscreen-mobile- medium-desktop- zoomedImageCarousel">\n' +
    '    <section class="dialog typography">\n' +
    '        <div class="dialog-body">\n' +
    '            <div class="carouselHeader theme-portal-masthead">\n' +
    '                <a class="iconic- link- button" ng-click="modal.close()">\n' +
    '                    {{ ::\'appCenter.done\' | i18n }}\n' +
    '                </a>\n' +
    '            </div>\n' +
    '            <div class="zoomedImageCarouselSlides">\n' +
    '                <ul rn-carousel rn-carousel-index="carouselIndex">\n' +
    '                    <li ng-repeat="image in screenshots">\n' +
    '                        <div class="slide-img" ng-style="{\'background-image\' : \'url(\' + image.href + \')\'}"></div>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '            <div class="carouselFooter">\n' +
    '                <div rn-carousel-indicators ng-if="screenshots.length > 1" slides="screenshots" rn-carousel-index="carouselIndex"></div>\n' +
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
  $templateCache.put('app/launcher/appDownloadDialog.html',
    '<div modal class="dialog centered-">\n' +
    '    <div class="dialog-body typography">\n' +
    '        <div class="dialog-info-icon">\n' +
    '            <svg symbol="info"></svg>\n' +
    '        </div>\n' +
    '        <h3>{{\'myapps.launch.openApp\' | i18n:app.name}}</h3>\n' +
    '        <p ng-bind-html="description">\n' +
    '        </p>\n' +
    '        <p>\n' +
    '            <button ng-click="$modal.close(true);" class="link- button"> {{\'button.cancel\' | i18n }}</button>\n' +
    '            <button ng-click="launcherItemCtrl.appInstalled(app.subType);" class="primary- button"> {{\'button.openApp\' | i18n }}</button>\n' +
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
  $templateCache.put('app/launcher/desktop/launchDesktopDialog.html',
    '<div modal>\n' +
    '    <div class="dialog centered-" ng-controller="DesktopLaunchController as ctrl">\n' +
    '        <div class="dialog-body typography">\n' +
    '            <div class="dialog-info-icon">\n' +
    '                <svg symbol="info"></svg>\n' +
    '            </div>\n' +
    '            <h3>{{\'myapps.launch.openApp\' | i18n:app.name}}</h3>\n' +
    '            <p>\n' +
    '                {{\'myapps.launch.view.selectPreferredLaunchClient\' | i18n }}\n' +
    '            </p>\n' +
    '            <p>\n' +
    '                {{\'myapps.launch.view.preferredClient.changeLaunchPrefTip\' | i18n }}\n' +
    '            </p>\n' +
    '            <p>\n' +
    '                <ul class="centered- list">\n' +
    '                    <li>\n' +
    '                        <input type="radio" ng-model="ctrl.preferredClient" value="NATIVE" id="native">\n' +
    '                        <label for="native">{{\'myapps.launch.view.preferredClient.horizonView\' | i18n }}&nbsp;<span ng-if="ctrl.preferredClient == \'NATIVE\'">{{\'myapps.launch.view.preferredClient.isDefault\' | i18n }}</span></label>\n' +
    '                    </li>\n' +
    '                    <li>\n' +
    '                        <input type="radio" ng-model="ctrl.preferredClient" value="BROWSER" id="browser">\n' +
    '                        <label for="browser">{{\'myapps.launch.view.preferredClient.browser\' | i18n }}&nbsp;<span ng-if="ctrl.preferredClient == \'BROWSER\'">{{\'myapps.launch.view.preferredClient.isDefault\' | i18n }}</span></label>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '                <div ng-if="ctrl.preferredClient == \'BROWSER\'">\n' +
    '                    {{\'myapps.launch.view.preferredClient.byBrowser.description\' | i18n }}\n' +
    '                </div>\n' +
    '                <div ng-if="ctrl.showInstallViewClientMsg()" ng-bind-html="ctrl.byViewClientDescription"></div>\n' +
    '            </p>\n' +
    '            <p>\n' +
    '                <button class="link- button" ng-click="$modal.close(true);">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button ng-click="ctrl.launchByPreference();" class="primary- button"> {{\'button.openHorizonView\' | i18n }}</button>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <!--\n' +
    '        <div class="dialog-footer">\n' +
    '            <input type="checkbox">Do not show this message again</input>\n' +
    '        </div>\n' +
    '        -->\n' +
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
  $templateCache.put('app/launcher/desktop/launchViewClientDialog.html',
    '<div modal>\n' +
    '    <div class="dialog centered-" ng-controller="DesktopLaunchController as ctrl">\n' +
    '        <div class="dialog-body typography">\n' +
    '            <div class="dialog-info-icon">\n' +
    '                <svg symbol="info"></svg>\n' +
    '            </div>\n' +
    '            <h3>{{\'myapps.launch.openApp\' | i18n:app.name}}</h3>\n' +
    '            <p ng-bind-html="ctrl.byViewClientDescription"></p>\n' +
    '            <p>\n' +
    '                <button class="link- button" ng-click="$modal.close(true);">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button ng-click="ctrl.launchByViewClient();" class="primary- button"> {{\'button.openHorizonView\' | i18n }}</button>\n' +
    '            </p>\n' +
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
  $templateCache.put('app/launcher/launcher.html',
    '<div class="launcher-main headered- view- frame" filter-menu="launcherCtrl.filterConfig" on-select="launcherCtrl.filterByLabel(item)">\n' +
    '    <div frame-drawer hamburger-menu drawer-control="appCenterCtrl.drawerIsActive">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="drawer-overlay" ng-class="{\'is-active\':appCenterCtrl.drawerIsActive}" ng-click="appCenterCtrl.toggleDrawer()"></div>\n' +
    '\n' +
    '    <div class="frame-header">\n' +
    '        <div class="theme-portal-masthead">\n' +
    '            <div class="mobile- masthead" ng-class="{ \'search-\' : appCenterCtrl.searchMode }">\n' +
    '                <div class="mastheadContainer">\n' +
    '                    <div class="masthead-left">\n' +
    '                        <div dropdown>\n' +
    '                            <a class="iconic- link- button" ng-click="appCenterCtrl.toggleDrawer()">\n' +
    '                                <svg symbol="hamburger"></svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="masthead-center">\n' +
    '                        {{::\'appCenter.nav.myApps\' | i18n}}\n' +
    '                    </div>\n' +
    '                    <div class="masthead-right">\n' +
    '                        <a class="iconic- link- button" ng-click="appCenterCtrl.showSearch()">\n' +
    '                            <svg symbol="search"></svg>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-include="\'app/common/mobileSearchContainer.html\'"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="masthead-navigation-tabs">\n' +
    '            <ul class="secondary- center- tabs">\n' +
    '                <!-- inline blocks: let the <li>s close themselves to suppress intervening whitespace -->\n' +
    '                <li class="is-active">\n' +
    '                    <a ng-click="appCenterCtrl.launcher()">{{\'app.nav.tab.launcher\' | i18n }}</a>\n' +
    '                <li>\n' +
    '                    <a ng-click="appCenterCtrl.catalog()">{{\'app.nav.tab.catalog\' | i18n }}</a>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="headered- frame">\n' +
    '        <div class="frame-header appcenter-filter-bar">\n' +
    '            <div class="full-bleed- page">\n' +
    '                <div class="grid">\n' +
    '                    <div class="navigation-tabs-container catalog-margin">\n' +
    '                        <ul class="secondary- tabs">\n' +
    '                            <li class="is-active">\n' +
    '                                <img src="app/graphics/launcher_active.svg" class="navigation-image">\n' +
    '                                <a ng-click="appCenterCtrl.launcher()">{{\'app.nav.tab.launcher\' | i18n }}</a>\n' +
    '                            </li>\n' +
    '                            <li>\n' +
    '                                <img src="app/graphics/catalog_inactive.svg" class="navigation-image catalog-navigation-image">\n' +
    '                                <a ng-click="appCenterCtrl.catalog()">{{\'app.nav.tab.catalog\' | i18n }}</a>\n' +
    '                            </li>\n' +
    '                        </ul>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="vertically- scrollable- pane theme-portal-background" infinite-scroll onend="launcherCtrl.getNextPage()">\n' +
    '            <div class="full-bleed- page theme-portal-text">\n' +
    '                <div class="base- grid launcher-items-container">\n' +
    '                    <div class="welcomeMessageContainer desktopOnly">\n' +
    '                        <div ng-if="!launcherCtrl.showNoSearchResultsMsg" class="welcomeMessage">{{launcherCtrl.welcomeMessage}}</div>\n' +
    '                        <div class="desktopFilterBarContainer">\n' +
    '                            <div filter-bar="{ isDesktop: true, favEnabled: true, isFavorited: launcherCtrl.isFilteredByFav}"\n' +
    '                                 selected-item="launcherCtrl.selectedCategory.name"\n' +
    '                                 on-favorite="launcherCtrl.toggleFilterByFav()"></div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="mobileFilterBarContainer mobileOnly">\n' +
    '                        <div filter-bar="{ isDesktop: false, favEnabled: true, isFavorited: launcherCtrl.isFilteredByFav}"\n' +
    '                             selected-item="launcherCtrl.selectedCategory.name"\n' +
    '                             on-favorite="launcherCtrl.toggleFilterByFav()">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div ng-if="launcherCtrl.showNoSearchResultsMsg" class="noresultsmsg box mobileOnly">\n' +
    '                        <strong>{{\'appCenter.noSearchResults\' | i18n}}</strong>\n' +
    '                    </div>\n' +
    '                    <div ng-if="launcherCtrl.showNoSearchResultsMsg" class="noresultsmsg box desktopOnly">\n' +
    '                        <strong>{{\'appCenter.noSearchResults\' | i18n}}</strong>\n' +
    '                    </div>\n' +
    '                    <div ng-if="launcherCtrl.showNoFavoritedAppsMsg" class="noresultsmsg box no-favorites">\n' +
    '                        <div>\n' +
    '                            <svg symbol="star"></svg>\n' +
    '                        </div>\n' +
    '                        <strong>{{\'myapps.noFavAppsMsg\' | i18n}}</strong>\n' +
    '                    </div>\n' +
    '                    <div ng-if="launcherCtrl.showNoAppsMsg" class="noresultsmsg box">\n' +
    '                        <div><no-apps-msg message="{{launcherCtrl.noAppsMsgHtml}}"></no-apps-msg></div>\n' +
    '                    </div>\n' +
    '                    <div launcher-item class="two- box"\n' +
    '                         ng-repeat="app in launcherCtrl.visibleLauncherApps track by app.appId"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div spinner ng-show="launcherCtrl.isLoading"></div>\n' +
    '\n' +
    '    <div id="launch-progress-container">\n' +
    '        <div spinner></div>\n' +
    '    </div>\n' +
    '\n' +
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
  $templateCache.put('app/launcher/launcherContextDialog.html',
    '<div class="launcheritem-details-dialog invisible" ng-controller="LauncherItemContextDialogController as dialogCtrl">\n' +
    '    <button class="dialog-close text- button" ng-click="close()">\n' +
    '        <svg symbol="close"></svg>\n' +
    '    </button>\n' +
    '        <div class="info-container">\n' +
    '            <div class="simple- emblem">\n' +
    '                <div class="emblem-image" ng-style="{\'background-image\':(\'url(\'+ app.icon+\')\')}"></div>\n' +
    '            </div>\n' +
    '\n' +
    '            <h3 class="app-name">{{app.name}}</h3>\n' +
    '            <dl>\n' +
    '                <dt>{{::\'app.details.label.type\' | i18n}}</dt>\n' +
    '                <dd>{{\'app.details.label.type.\'+app.subType | i18n}}</dd>\n' +
    '                <dt ng-if="app.version">{{::\'app.details.label.version\' | i18n}}</dt>\n' +
    '                <dd ng-if="app.version">{{app.version}}</dd>\n' +
    '                <dt ng-if="app.subType === \'THINAPP\'">{{::\'app.details.label.packageName\' | i18n}}</dt>\n' +
    '                <dd ng-if="app.subType === \'THINAPP\'">{{app.optionalAppInfo.packageName}}</dd>\n' +
    '            </dl>\n' +
    '        </div>\n' +
    '        <div class="dialog-text">\n' +
    '            <dl>\n' +
    '                <!--For ThinApp-->\n' +
    '                <dt ng-if="dialogCtrl.hasAppRequirements && !launcherItemCtrl.isHorizon">\n' +
    '                    {{::\'app.details.label.requirement\' | i18n}}</dt>\n' +
    '                <dd ng-if="app.subType === \'THINAPP\'">\n' +
    '                    <span>{{::\'app.details.thinapp.requirement\' | i18n}}</span>\n' +
    '                </dd>\n' +
    '\n' +
    '                <!--For XenApp-->\n' +
    '                <dd ng-if="app.subType === \'XENAPP\'">\n' +
    '                    <span ng-click="preventCloseOnClick($event)" ng-bind-html="dialogCtrl.xenAppTooltip" ></span>\n' +
    '                </dd>\n' +
    '\n' +
    '                <!--For XenAppDeliveryGroup-->\n' +
    '                <dd ng-if="app.subType === \'XENAPPDELIVERYGROUP\'">\n' +
    '                    <span ng-click="preventCloseOnClick($event)" ng-bind-html="dialogCtrl.xenAppDeliveryGroupTooltip" ></span>\n' +
    '                </dd>\n' +
    '\n' +
    '                <!--For ViewDesktop-->\n' +
    '                <dd ng-if="app.subType === \'VIEWPOOL\' && !launcherItemCtrl.isHorizon">\n' +
    '                    <span ng-click="preventCloseOnClick($event)" ng-bind-html="dialogCtrl.viewDesktopTooltip" ></span>\n' +
    '                </dd>\n' +
    '\n' +
    '                <!--For ViewApp-->\n' +
    '                <dd ng-if="app.subType === \'VIEWAPP\' && !launcherItemCtrl.isHorizon">\n' +
    '                    <span ng-click="preventCloseOnClick($event)" ng-bind-html="dialogCtrl.viewAppTooltip" ></span>\n' +
    '                </dd>\n' +
    '\n' +
    '                <!--For DesktoneDesktop-->\n' +
    '                <dd ng-if="app.subType === \'DESKTONEDESKTOP\' && !launcherItemCtrl.isHorizon">\n' +
    '                    <span ng-click="preventCloseOnClick($event)" ng-bind-html="dialogCtrl.desktoneTooltip"></span>\n' +
    '                </dd>\n' +
    '\n' +
    '                <!--For DesktoneApplication-->\n' +
    '                <dd ng-if="app.subType === \'DESKTONEAPPLICATION\' && !launcherItemCtrl.isHorizon">\n' +
    '                    <span ng-click="preventCloseOnClick($event)" ng-bind-html="dialogCtrl.daasAppTooltip"></span>\n' +
    '                </dd>\n' +
    '            </dl>\n' +
    '            <div class="app-description">\n' +
    '                <span ng-if="app.description.length > 0" ng-bind-html="app.description"></span>\n' +
    '                <div><a class="link" ng-click="dialogCtrl.appDetails(app);">{{::\'app.details.label.seeFullDetails\' | i18n}}</a></div>\n' +
    '            </div>\n' +
    '\n' +
    '            <div ng-if="app.categories.length > 0"><dt>{{::\'app.details.label.category\' | i18n}}</dt><dd><span class="app-labels" ng-repeat="category in app.categories"><span>{{category}}</span>{{$last ? \'\' : \', \'}}</span></dd></div>\n' +
    '\n' +
    '        </div>\n' +
    '        <div class="dialog-actions">\n' +
    '            <ul class="actions">\n' +
    '                <!-- inline blocks: let the <li>s close themselves to suppress intervening whitespace -->\n' +
    '                <li>\n' +
    '                    <a class="hideApp" ng-click="dialogCtrl.hideApp(app, launcherCtrl.visibleLauncherApps, $index, $event);close();">\n' +
    '                        <svg symbol="trash" ng-class="{\'filled-\' : app.favorite}"></svg>\n' +
    '                    </a>\n' +
    '                <li>\n' +
    '                    <a class="favorite" ng-click="toggleFavorite(app, $event, launcherCtrl.isFilteredByFav, launcherCtrl.visibleLauncherApps, $index)">\n' +
    '                        <svg symbol="star" ng-class="{\'filled-\' : app.favorite}"></svg>\n' +
    '                    </a>\n' +
    '                <li ng-show="app.usePerAppPassword">\n' +
    '                    <a ng-click="openSetAppPasswordDialog($event)">\n' +
    '                        <svg symbol="set-password"></svg>\n' +
    '                    </a>\n' +
    '            </ul>\n' +
    '            <ul>\n' +
    '                <li class="button launch-btn" ng-show="!app.isViewResource || (app.isViewResource && launcherItemCtrl.isAWJade) || (app.isViewResource && launcherItemCtrl.isHorizon)">\n' +
    '                    <a ng-click="launcherItemCtrl.launchApp(launcherItemCtrl.app, $event)">{{::\'myapps.dialog.openApp\' | i18n}}</a>\n' +
    '            </ul>\n' +
    '            <ul class="launch-options" ng-show="app.isViewResource && !launcherItemCtrl.isAWJade && !launcherItemCtrl.isHorizon">\n' +
    '                <li class="small- button launch-btn" ng-show="app.viewClientLaunchSupported">\n' +
    '                    <a ng-click="launcherItemCtrl.openWithViewClient(launcherItemCtrl.app, $event)">\n' +
    '                        {{::\'myapps.dialog.openAppWithViewClient\' | i18n}}\n' +
    '                    </a>\n' +
    '                <li class="small- button is-disabled" ng-show="!app.viewClientLaunchSupported">\n' +
    '                    {{::\'myapps.dialog.openAppWithViewClient\' | i18n}}\n' +
    '\n' +
    '                <li class="small- launch-link link" ng-show="app.viewBrowserLaunchSupported">\n' +
    '                    <a ng-click="launcherItemCtrl.openWithBrowser(launcherItemCtrl.app, $event)" ng-show="launcherItemCtrl.isViewOptionSupported(launcherItemCtrl.app, \'BROWSER\')">\n' +
    '                        {{::\'myapps.dialog.openAppWithBrowser\' | i18n}}\n' +
    '                    </a>\n' +
    '                <li class="small- launch-link link is-disabled" ng-show="!app.viewBrowserLaunchSupported">\n' +
    '                    {{::\'myapps.dialog.openAppWithBrowser\' | i18n}}\n' +
    '\n' +
    '            </ul>\n' +
    '        </div>\n' +
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
  $templateCache.put('app/launcher/launcherDropdown.html',
    '<div ng-include="\'app/launcher/launcherMenu.html\'">\n' +
    '</div>\n' +
    '<div class="commonMenu" ng-include="\'app/common/commonMenu.html\'">\n' +
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
  $templateCache.put('app/launcher/launcherItem.html',
    '<div class="launcheritem">\n' +
    '    <div class="emblem large-"\n' +
    '         contextdialog="{uris:{\'contextdialogTemplate\':(true)}, scope:{app:launcherItemCtrl.app}}"\n' +
    '         contextdialogTemplate="app/launcher/launcherContextDialog.html"\n' +
    '         ng-click="launcherItemCtrl.launchApp(launcherItemCtrl.app, $event)" >\n' +
    '        <a>\n' +
    '            <div class="emblem-image" hm-hold="launcherItemCtrl.triggerContextdialog()"\n' +
    '                 style="background-image: url(\'{{::launcherItemCtrl.app.icon}}\')">\n' +
    '            </div>\n' +
    '            <h3 class="emblem-title" title="{{::launcherItemCtrl.app.name}}"\n' +
    '                line-clamp content="::launcherItemCtrl.app.name" lines="2"></h3>\n' +
    '        </a>\n' +
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
  $templateCache.put('app/launcher/launcherMenu.html',
    '<ul class="menu">\n' +
    '    <li class="menu-title">{{::\'myapp.nav.filterby\'|i18n}}</li>\n' +
    '    <li ng-class="{\'is-selected\':launcherCtrl.selectedCategory.name === \'All apps\' && !launcherCtrl.isFilteredByFav}">\n' +
    '        <a ng-click="launcherCtrl.resetFilter()">{{::\'myapp.nav.allApps\'|i18n}}</a>\n' +
    '    </li>\n' +
    '    <li ng-class="{\'is-selected\':launcherCtrl.isFilteredByFav}">\n' +
    '        <a class="favFilter" ng-click="launcherCtrl.toggleFilterByFav();">{{::\'myapp.nav.favorites\'|i18n}}</a>\n' +
    '    </li>\n' +
    '    <li ng-show="launcherCtrl.appCategories.length > 0" class="menu-hrule"></li>\n' +
    '    <li ng-show="launcherCtrl.appCategories.length > 0" class="menu-title">{{::\'myapp.nav.categories\'|i18n}}</li>\n' +
    '    <li ng-repeat="category in launcherCtrl.appCategories"\n' +
    '        ng-class="{\'is-selected\':launcherCtrl.selectedCategory.name == category.name}">\n' +
    '        <a title="{{::category.name}}"\n' +
    '           ng-click="launcherCtrl.filterByLabel(category);">{{::category.name}}</a>\n' +
    '    </li>\n' +
    '    <li class="menu-hrule"></li>\n' +
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
  $templateCache.put('app/launcher/launchPasswordDialog.html',
    '<div modal>\n' +
    '    <div class="dialog centered-" ng-controller="LaunchPasswordController as ctrl">\n' +
    '        <div class="dialog-body typography launch-password-dialog" ng-class="{fade: ctrl.processing}">\n' +
    '            <div spinner class="spinner" ng-show="ctrl.processing"></div>\n' +
    '            <h3>{{\'app.launchPassword.heading\' | i18n}}</h3>\n' +
    '            <p>\n' +
    '                {{\'app.launchPassword.view.instruction\' | i18n:app.name}}\n' +
    '            </p>\n' +
    '            <div class="error-messages">\n' +
    '                {{ctrl.errMsg}}\n' +
    '            </div>\n' +
    '            <div>\n' +
    '                <div class="centered- list">\n' +
    '                    <div class="form-fields-holder">\n' +
    '                        <input type="text" ng-model="ctrl.userName" class="input-field" disabled>\n' +
    '                    </div>\n' +
    '                    <div class="form-fields-holder">\n' +
    '                        <input type="password" ng-model="ctrl.pwd" placeholder="{{\'app.launchPassword.label.password\' | i18n}}" class="input-field password-field" ng-keypress="ctrl.handleEnter($event)">\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <p>\n' +
    '                <button class="link- button" ng-click="ctrl.handleCancel();">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button ng-click="ctrl.getLaunchUrls();" class="primary- button" tabindex="0" ng-disabled="ctrl.pwd == \'\'"> {{\'app.launchPassword.button.label.signin\' | i18n }}</button>\n' +
    '            </p>\n' +
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
  $templateCache.put('app/launcher/passwordvault/installPasswordVaultExtensionDialog.html',
    '<div modal>\n' +
    '    <div class="dialog centered-" ng-controller="InstallPasswordVaultExtensionController as ctrl">\n' +
    '        <div class="dialog-body typography">\n' +
    '            <div class="dialog-info-icon">\n' +
    '                <svg symbol="info"></svg>\n' +
    '            </div>\n' +
    '            <h3>{{\'myapps.launch.openApp\' | i18n:app.name}}</h3>\n' +
    '            <p ng-bind-html="ctrl.extensionDescription"></p>\n' +
    '            <p>\n' +
    '                <button class="link- button" ng-click="modal.close(true);">{{\'button.cancel\' | i18n }}</button>\n' +
    '                <button ng-click="ctrl.openApp();" class="primary- button">{{\'button.openApp\' | i18n }}</button>\n' +
    '            </p>\n' +
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
  $templateCache.put('app/launcher/setAppPassword.html',
    '<div modal class="thinapp-devices footered- modal scrollable- fullscreen-mobile-">\n' +
    '    <div ng-controller="SetAppPasswordController as ctrl">\n' +
    '        <form name="appAuthForm" novalidate class="form-horizontal">\n' +
    '            <section class="dialog typography">\n' +
    '                <div class="dialog-body setAppPassword">\n' +
    '                    <div>\n' +
    '                       <h3>{{\'app.setAppPassword.heading\' | i18n:ctrl.app.name}}</h3>\n' +
    '                        <p>{{ "app.setAppPassword.instruction" | i18n}}</p>\n' +
    '                    </div>\n' +
    '                    <div class="error-text" ng-show="appAuthForm.$error.unique">{{ "app.setAppPassword.error.passwordsNoMatch" | i18n}}</div>\n' +
    '                    <fieldset>\n' +
    '                        <div class="form-group">\n' +
    '                            <label>{{\'app.setAppPassword.label.password\' | i18n }}</label>\n' +
    '                            <input class="input-large" id="password1" type="password" ng-model="ctrl.password1" required ng-minlength="3" />\n' +
    '                        </div>\n' +
    '                        <div class="form-group">\n' +
    '                            <label>{{\'app.setAppPassword.label.confirmPassword\' | i18n }}</label>\n' +
    '                            <input class="input-large" id="password2" type="password" ng-model="ctrl.password2" required ng-minlength="3" />\n' +
    '                        </div>\n' +
    '                    </fieldset>\n' +
    '                </div>\n' +
    '                <footer class="dialog-actions">\n' +
    '                    <button class="link- button large-" ng-click="$modal.cancel()">{{ \'button.cancel\' | i18n }}</button>\n' +
    '                    <button class="primary- button large-" ng-click="ctrl.setAppPassword($event)" ng-disabled="appAuthForm.$invalid">{{ \'button.save\' | i18n }}</button>\n' +
    '                </footer>\n' +
    '            </section>\n' +
    '        </form>\n' +
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
  $templateCache.put('app/notify/templates/defaultMessageTemplate.html',
    '<div class="message" ng-class="message.type + \'-\'">\n' +
    '    <i ng-show="message.type === \'info\'" class="message-icon"></i>\n' +
    '    <button ng-show="message.type === \'info\'" class="close- button" ng-click="close($index)"></button>\n' +
    '    <div class="message-body typography">\n' +
    '        <p>{{message.text}}</p>\n' +
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
  $templateCache.put('app/notify/templates/messageContextTemplate.html',
    '<ul class="message-queue">\n' +
    '    <li ng-repeat="message in _messagesArray_">\n' +
    '        <div notify-message="message">\n' +
    '        </div>\n' +
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
  $templateCache.put('app/preferences/preferences.html',
    '<div modal-context class="details-main headered- view- frame theme-portal-background">\n' +
    '    <div class="frame-header">\n' +
    '        <div class="theme-portal-masthead">\n' +
    '            <div class="mobile- masthead">\n' +
    '                <div class="masthead-left">\n' +
    '                    <a class="iconic- link- button" ng-click="::preferencesCtrl.backAction()">\n' +
    '                       <svg symbol="mobile-back-arrow"></svg>\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="headered- frame">\n' +
    '        <div class="frame-header">\n' +
    '            <div class="details-filter-bar">\n' +
    '                <div class="page- grid">\n' +
    '                    <div class="four- box has-overflow">\n' +
    '                        <a class="iconic- link- button" ng-click="::preferencesCtrl.backAction()">\n' +
    '                            <svg symbol="arrow-left"></svg>\n' +
    '                            <span>{{::\'app.details.link.back\' | i18n}}</span>\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="vertically- scrollable- backdrop- pane">\n' +
    '            <div class="page">\n' +
    '                <div class="media">\n' +
    '                    <div class="media-image">\n' +
    '                        <img src="app/graphics/vmware-view.svg">\n' +
    '                    </div>\n' +
    '                    <div class="media-body typography">\n' +
    '                        <p>{{\'myapps.launch.view.selectPreferredLaunchClient\' | i18n }}</p>\n' +
    '                        <p>\n' +
    '                            <fieldset>\n' +
    '                                <input type="radio" ng-model="preferencesCtrl.preferredClient" value="NATIVE" id="native">\n' +
    '                                <label>{{\'myapps.launch.view.preferredClient.horizonView\' | i18n }}&nbsp;<span ng-if="preferencesCtrl.preferredClient == \'NATIVE\'">{{\'myapps.launch.view.preferredClient.isDefault\' | i18n }}</span></label>\n' +
    '                                <br/>\n' +
    '                                <input type="radio" ng-model="preferencesCtrl.preferredClient" value="BROWSER" id="browser">\n' +
    '                                <label>{{\'myapps.launch.view.preferredClient.browser\' | i18n }}&nbsp;<span ng-if="preferencesCtrl.preferredClient == \'BROWSER\'">{{\'myapps.launch.view.preferredClient.isDefault\' | i18n }}</span></label>\n' +
    '                            </fieldset>\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="actions">\n' +
    '                    <ul class="right-to-left- actions">\n' +
    '                        <li><button ng-click="preferencesCtrl.saveLaunchDesktopPreference();" class="primary- button"> {{\'button.save\' | i18n }}</button></li>\n' +
    '                    </ul>\n' +
    '                </div>\n' +
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
  $templateCache.put('app/settings/settings.html',
    '<div class="usersettings headered- view- frame">\n' +
    '    <div spinner ng-show="settingsCtrl.isLoading"></div>\n' +
    '    <div class="frame-header">\n' +
    '        <div class="theme-portal-masthead">\n' +
    '            <div class="mobile- masthead">\n' +
    '                <div class="masthead-left">\n' +
    '                    <a class="iconic- link- button" ng-click="::settingsCtrl.backAction()">\n' +
    '                        <svg symbol="mobile-back-arrow"></svg>\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="vertically- scrollable- backdrop- pane">\n' +
    '        <div class="page">\n' +
    '            <article>\n' +
    '                <header>\n' +
    '                    <div class="usersettings-title">{{::\'app.settings.label.settings\' | i18n}}</div>\n' +
    '                </header>\n' +
    '                <section>\n' +
    '                    <div class="media">\n' +
    '                        <div class="media-image">\n' +
    '                            <svg symbol="avatar"></svg>\n' +
    '                        </div>\n' +
    '                        <div class="media-body">\n' +
    '                            <ul>\n' +
    '                                <li class="usersettings-name">{{ settingsCtrl.firstName + \' \' +settingsCtrl.lastName}}</li>\n' +
    '                                <li class="usersettings-email">{{::settingsCtrl.emailAddress}}</li>\n' +
    '                            </ul>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </section>\n' +
    '                <nav>\n' +
    '                    <ul class="menu">\n' +
    '                        <li>\n' +
    '                            {{::\'app.settings.managedDevices\' | i18n }} ({{::settingsCtrl.numOfManagedDevices}})\n' +
    '                        </li>\n' +
    '                    </ul>\n' +
    '                </nav>\n' +
    '            </article>\n' +
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
  $templateCache.put('app/xydeco/components/actions/examples/actions-demo.html',
    '<p>Left-to-Right (default):</p>\n' +
    '<ul class="actions">\n' +
    '    <li><button class="primary- button">One</button></li>\n' +
    '    <li><button class="button">Two</button></li>\n' +
    '    <li><button class="link- button">Three</button></li>\n' +
    '</ul>\n' +
    '\n' +
    '<p>Right-to-Left:</p>\n' +
    '<ul class="right-to-left- actions">\n' +
    '    <li><button class="primary- button">One</button></li>\n' +
    '    <li><button class="button">Two</button></li>\n' +
    '    <li><button class="link- button">Three</button></li>\n' +
    '</ul>\n' +
    '\n' +
    '<p>Top-to-Bottom:</p>\n' +
    '<ul class="top-to-bottom- actions">\n' +
    '    <li><button class="primary- button">One</button></li>\n' +
    '    <li><button class="button">Two</button></li>\n' +
    '    <li><button class="link- button">Three</button></li>\n' +
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
  $templateCache.put('app/xydeco/components/box/examples/box-demo.html',
    '<div class="eight- grid">\n' +
    '    <p><%= p.0 %></p>\n' +
    '    <div class="four- box"><p><%= p.1 %></p></div>\n' +
    '    <div class="four- box"><p><%= p.2 %></p></div>\n' +
    '    <div class="two- box"><p><%= p.3 %></p></div>\n' +
    '    <div class="two- box"><p><%= p.4 %></p></div>\n' +
    '    <div class="one- box"><p><%= p.5 %></p></div>\n' +
    '    <div class="one- box"><p><%= p.6 %></p></div>\n' +
    '    <div class="one- box"><p><%= p.7 %></p></div>\n' +
    '    <div class="one- box"><p><%= p.8 %></p></div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '  p { text-align: justify; }\n' +
    '  .box { height: 8em; }\n' +
    '  .box:hover { background-color: rgba(255,0,0,0.2); }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/box/examples/box-module-demo.html',
    '<section class="typography">\n' +
    '    <div class="eight- xy- grid">\n' +
    '        <div class="three- box">\n' +
    '            <p class="box-module"><%= p.1 %></p>\n' +
    '        </div>\n' +
    '        <div class="remainder- box">\n' +
    '            <p><%= p.2 %></p>\n' +
    '        </div>\n' +
    '        <p><%= p.3 %></p>\n' +
    '        <div class="right- three- box">\n' +
    '            <p class="box-module"><%= p.4 %></p>\n' +
    '        </div>\n' +
    '        <div class="remainder- box">\n' +
    '            <p><%= p.5 %></p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</section>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '  .box:hover { background-color: rgba(255,0,0,0.2); }\n' +
    '  .box-module { background: #ccc; padding: .5em; }\n' +
    '  p { text-align: justify; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/box/examples/remainder-box-demo.html',
    '<div class="ten- grid">\n' +
    '    <p class="two- left- box"><%= s.0 %>\n' +
    '    <p class="two- right- box"><%= s.1 %>\n' +
    '    <p class="remainder- box"><%= p.2 %>\n' +
    '</div>\n' +
    '<style>\n' +
    'p { text-align: justify; }\n' +
    '.box:hover { background-color: rgba(255,0,0,0.2); }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/box/examples/remainder-subgrid-demo.html',
    '<div class="ten- grid">\n' +
    '    <p class="two- left- box"><%= s.0 %></p>\n' +
    '    <p class="two- right- box"><%= s.1 %></p>\n' +
    '    <div class="remainder- box">\n' +
    '        <!-- up to the remaining (6) columns -->\n' +
    '        <div class="grid">\n' +
    '            <p class="three- box"><%= p.2 %></p>\n' +
    '            <p class="three- box"><%= p.3 %></p>\n' +
    '            <p><%= p.4 %></p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    'p { text-align: justify; }\n' +
    '.box:hover { background-color: rgba(255,0,0,0.2); }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/basic-buttons.html',
    '<p>\n' +
    '    <button>Button</button>\n' +
    '    <button class="is-hovered">Hover</button>\n' +
    '    <button class="is-active">Active</button>\n' +
    '    <button class="is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="danger- button">Danger</button>\n' +
    '    <button class="danger- button is-hovered">Hover</button>\n' +
    '    <button class="danger- button is-active">Active</button>\n' +
    '    <button class="danger- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="safe- button">Safe</button>\n' +
    '    <button class="safe- button is-hovered">Hover</button>\n' +
    '    <button class="safe- button is-active">Active</button>\n' +
    '    <button class="safe- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="primary- button">Primary</button>\n' +
    '    <button class="primary- button is-hovered">Hover</button>\n' +
    '    <button class="primary- button is-active">Active</button>\n' +
    '    <button class="primary- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="hollow- button">Hollow</button>\n' +
    '    <button class="hollow- button is-hovered">Hover</button>\n' +
    '    <button class="hollow- button is-active">Active</button>\n' +
    '    <button class="hollow- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="hollow- safe- button">Safe</button>\n' +
    '    <button class="hollow- safe- button is-hovered">Hover</button>\n' +
    '    <button class="hollow- safe- button is-active">Active</button>\n' +
    '    <button class="hollow- safe- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="hollow- danger- button">Danger</button>\n' +
    '    <button class="hollow- danger- button is-hovered">Hover</button>\n' +
    '    <button class="hollow- danger- button is-active">Active</button>\n' +
    '    <button class="hollow- danger- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="hollow- primary- button">Primary</button>\n' +
    '    <button class="hollow- primary- button is-hovered">Hover</button>\n' +
    '    <button class="hollow- primary- button is-active">Active</button>\n' +
    '    <button class="hollow- primary- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/button-badge.html',
    '<button class="hollow- safe- button">\n' +
    '    <span class="button-text">INSTALL</span>\n' +
    '    <span class="button-badge">?</span>\n' +
    '</button>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/button-bar.html',
    '<ul class="tool- bar">\n' +
    '    <li class="button"><i class="grid- glyph"></i>\n' +
    '    <li class="button is-selected"><i class="list- glyph"></i>\n' +
    '    <li class="button"><i class="columns- glyph"></i>\n' +
    '    <li class="button"><i class="coverflow- glyph"></i>\n' +
    '</ul>\n' +
    '<button><i class="move- glyph"></i> Move</button>\n' +
    '<ul class="button- bar">\n' +
    '    <!-- Note: Do NOT close the <li> tags -->\n' +
    '    <li class="button">First Menu\n' +
    '    <li class="button is-selected">Selected Menu\n' +
    '    <li class="button">Third Menu\n' +
    '</ul>\n' +
    '<br>\n' +
    '<ul class="small- tool- bar">\n' +
    '    <li class="button"><i class="grid- glyph"></i>\n' +
    '    <li class="button is-selected"><i class="list- glyph"></i>\n' +
    '    <li class="button"><i class="columns- glyph"></i>\n' +
    '    <li class="button"><i class="coverflow- glyph"></i>\n' +
    '</ul>\n' +
    '<button class="small- button"><i class="move- glyph"></i> Move</button>\n' +
    '<ul class="small- button- bar">\n' +
    '    <!-- Note: Do NOT close the <li> tags -->\n' +
    '    <li class="button">First Menu\n' +
    '    <li class="button is-selected">Selected Menu\n' +
    '    <li class="button">Third Menu\n' +
    '</ul>\n' +
    '<br>\n' +
    '<ul class="x-small- tool- bar">\n' +
    '    <li class="button"><i class="grid- glyph"></i>\n' +
    '    <li class="button is-selected"><i class="list- glyph"></i>\n' +
    '    <li class="button"><i class="columns- glyph"></i>\n' +
    '    <li class="button"><i class="coverflow- glyph"></i>\n' +
    '</ul>\n' +
    '<div class="x-small- tool- bar"><!-- If you don\'t use <ul>,\n' +
    '    be careful with the whitespace --><button>\n' +
    '        <i class="reverse-play- glyph"></i>\n' +
    '    </button><button>\n' +
    '        <i class="play- glyph"></i>\n' +
    '    </button></div>\n' +
    '<button class="x-small- button"><i class="move- glyph"></i> Move</button>\n' +
    '<ul class="x-small- button- bar">\n' +
    '    <!-- Note: Do NOT close the <li> tags -->\n' +
    '    <li class="button">First Menu\n' +
    '    <li class="button is-selected">Selected Menu\n' +
    '    <li class="button">Third Menu\n' +
    '</ul>\n' +
    '<br>\n' +
    '<ul class="button- bar">\n' +
    '    <li class="button">Default\n' +
    '    <li class="button is-disabled">Disabled\n' +
    '    <li class="safe- button">Safe\n' +
    '    <li class="danger- button">Danger\n' +
    '    <li class="primary- button">Primary\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/button-sizes.html',
    '<p>\n' +
    '    <button class="x-small- button">X-Small</button>\n' +
    '    <button class="small- button">Small</button>\n' +
    '    <button class="medium- button">Medium</button>\n' +
    '    <button class="large- button">Large</button>\n' +
    '    <button class="x-large- button">X-Large</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="x-small- safe- button">X-Small</button>\n' +
    '    <button class="small- safe- button">Small</button>\n' +
    '    <button class="medium- safe- button">Medium</button>\n' +
    '    <button class="large- safe- button">Large</button>\n' +
    '    <button class="x-large- safe- button">X-Large</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="x-small- primary- button">X-Small</button>\n' +
    '    <button class="small- primary- button">Small</button>\n' +
    '    <button class="medium- primary- button">Medium</button>\n' +
    '    <button class="large- primary- button">Large</button>\n' +
    '    <button class="x-large- primary- button">X-Large</button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/directional-buttons.html',
    '<p>\n' +
    '    <button class="previous- button">Previous</button>\n' +
    '    <button class="button">Current</button>\n' +
    '    <button class="next- button">Next</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="previous- button is-disabled">Previous</button>\n' +
    '    <button class="button">Current</button>\n' +
    '    <button class="next- primary- button">Next</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="previous- safe- button">Safety</button>\n' +
    '    <button>Current</button>\n' +
    '    <button class="next- danger- button">Caution</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="previous- safe- button is-disabled">Safety</button>\n' +
    '    <button class="next- danger- button is-disabled">Caution</button>\n' +
    '    <button class="next- primary- button is-disabled">Next</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="x-small- previous- button">Back</button>\n' +
    '    <button class="x-small- next- button">Forward</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="small- previous- button">Back</button>\n' +
    '    <button class="small- next- button">Forward</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="medium- previous- button">Back</button>\n' +
    '    <button class="medium- next- button">Forward</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="large- previous- button">Back</button>\n' +
    '    <button class="large- next- button">Forward</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="x-large- previous- button">Back</button>\n' +
    '    <button class="x-large- next- button">Forward</button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/full-width-buttons.html',
    '<p>\n' +
    '    <button class="full-width- button">Full Width Button</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="block- button">Block Button</button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/iconic-buttons.html',
    '<center>\n' +
    '    View in Styleboard and set display width\n' +
    '    to 320px to see buttons collapse\n' +
    '</center>\n' +
    '<p>\n' +
    '    <button class="iconic- button">\n' +
    '        <i class="reload- glyph"></i>\n' +
    '    </button>\n' +
    '    <button class="iconic- button">\n' +
    '        <i class="app-center- glyph"></i><span class="button-text">App Center</span>\n' +
    '    </button>\n' +
    '    <button class="iconic- button">\n' +
    '        <span class="button-text">Now Playing</span><i class="right- glyph"></i>\n' +
    '    </button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="x-small- collapsible- iconic- button">\n' +
    '        <i class="move- glyph"></i><span class="button-text">Move</span>\n' +
    '    </button>\n' +
    '    <button class="small- collapsible- iconic- button">\n' +
    '        <i class="move- glyph"></i><span class="button-text">Move</span>\n' +
    '    </button>\n' +
    '    <button class="medium- collapsible- iconic- button">\n' +
    '        <i class="move- glyph"></i><span class="button-text">Move</span>\n' +
    '    </button>\n' +
    '    <button class="large- collapsible- iconic- button">\n' +
    '        <i class="move- glyph"></i><span class="button-text">Move</span>\n' +
    '    </button>\n' +
    '    <button class="x-large- collapsible- iconic- button">\n' +
    '        <i class="move- glyph"></i><span class="button-text">Move</span>\n' +
    '    </button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="x-small- collapsible- iconic- primary- button">\n' +
    '        <span class="button-text">Settings</span><i class="gear- glyph"></i>\n' +
    '    </button>\n' +
    '    <button class="small- collapsible- iconic- primary- button">\n' +
    '        <span class="button-text">Settings</span><i class="gear- glyph"></i>\n' +
    '    </button>\n' +
    '    <button class="medium- collapsible- iconic- primary- button">\n' +
    '        <span class="button-text">Settings</span><i class="gear- glyph"></i>\n' +
    '    </button>\n' +
    '    <button class="large- collapsible- iconic- primary- button">\n' +
    '        <span class="button-text">Settings</span><i class="gear- glyph"></i>\n' +
    '    </button>\n' +
    '    <button class="x-large- collapsible- iconic- primary- button">\n' +
    '        <span class="button-text">Settings</span><i class="gear- glyph"></i>\n' +
    '    </button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/inline-buttons.html',
    '<section class="typography">\n' +
    '    <p><%= s.0 %>\n' +
    '        <button class="inline- button">Button</button>\n' +
    '        <%= s.1 %>\n' +
    '        <a class="inline- button">Anchor</a>\n' +
    '        <%= phr.2 %>\n' +
    '        <button class="inline- iconic- danger- button">\n' +
    '            <i class="star- glyph"></i>\n' +
    '            <span class="button-text">Three</span>\n' +
    '        </button>\n' +
    '        <button class="inline- button">Different</button>\n' +
    '        <a class="inline- primary- button">Buttons</a>\n' +
    '        <%= s.3 %>\n' +
    '    </p>\n' +
    '    <div style="text-align:right">\n' +
    '        <a class="link- button">Cancel</a>\n' +
    '        <button class="primary- button">Done</button>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/link-buttons.html',
    '<p>\n' +
    '    <button class="link- button">Link</button>\n' +
    '    <button class="link- button is-hovered">Hover</button>\n' +
    '    <button class="link- button is-active">Active</button>\n' +
    '    <button class="link- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="link- danger- button">Danger Link</button>\n' +
    '    <button class="link- danger- button is-hovered">Hover</button>\n' +
    '    <button class="link- danger- button is-active">Active</button>\n' +
    '    <button class="link- danger- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="link- safe- button">Safe Link</button>\n' +
    '    <button class="link- safe- button is-hovered">Hover</button>\n' +
    '    <button class="link- safe- button is-active">Active</button>\n' +
    '    <button class="link- safe- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="link- primary- button">Primary Link</button>\n' +
    '    <button class="link- primary- button is-hovered">Hover</button>\n' +
    '    <button class="link- primary- button is-active">Active</button>\n' +
    '    <button class="link- primary- button is-disabled">Disabled</button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/loading-buttons.html',
    '<p>\n' +
    '    <button class="previous- button is-loading">Previous</button>\n' +
    '    <button class="button is-loading">Button</button>\n' +
    '    <button class="next- button is-loading">Next</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="previous- primary- button is-loading">Previous</button>\n' +
    '    <button class="primary- button is-loading">Primary</button>\n' +
    '    <button class="next- primary- button is-loading">Next</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="previous- danger- button is-loading">Previous</button>\n' +
    '    <button class="danger- button is-loading">Danger</button>\n' +
    '    <button class="next- danger- button is-loading">Next</button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="previous- safe- button is-loading">Previous</button>\n' +
    '    <button class="safe- button is-loading">Safe</button>\n' +
    '    <button class="next- safe- button is-loading">Next</button>\n' +
    '</p>\n' +
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
  $templateCache.put('app/xydeco/components/button/examples/multiline-buttons.html',
    '<p>\n' +
    '    <button>\n' +
    '        <span class="button-text">This text is too long to fit in this button</span>\n' +
    '    </button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="multiline- button">\n' +
    '        <span class="button-text">So we can make it a multiline button\n' +
    '            and add as much text as we\'d like.</span>\n' +
    '        </button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="primary- button">\n' +
    '        <span class="button-text">The primary button font is larger</span>\n' +
    '    </button>\n' +
    '</p>\n' +
    '<p>\n' +
    '    <button class="multiline- primary- button">\n' +
    '        <span class="button-text">But when we wrap the text, it still aligns\n' +
    '            with standard buttons.\n' +
    '        </span>\n' +
    '    </button>\n' +
    '</p>\n' +
    '<style>\n' +
    'button { width: 16em; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/dialog/examples/basic-dialog.html',
    '<section class="dialog">\n' +
    '    <header class="dialog-header">\n' +
    '        <h3><%= h %></h3>\n' +
    '    </header>\n' +
    '    <div class="dialog-body">\n' +
    '        <p><%= s %></p>\n' +
    '    </div>\n' +
    '    <footer class="dialog-actions">\n' +
    '        <button class="link- button">Cancel</button>\n' +
    '        <button class="primary- button">Ok</button>\n' +
    '    </footer>\n' +
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
  $templateCache.put('app/xydeco/components/dropdown/examples/dropdown-menu.html',
    '<div ng-controller="DropdownMenuDemo as demo" class="dropdownExample">\n' +
    '    <div class="typography">\n' +
    '      <p>Second dropdown has closeOnClick false, so the dropdown panel does not close when clicked inside it.</p>\n' +
    '      <p>\n' +
    '          Dropdown can be programatically toggled by registering a model property to the dropdown.\n' +
    '          This is done by passing the model property to the dropdown-control attribute on dropdown directive.\n' +
    '      </p>\n' +
    '    </div>\n' +
    '\n' +
    '    <div dropdown>\n' +
    '        <button><%= btn %></button>\n' +
    '        <ul class="menu" dropdown-panel>\n' +
    '          <li><%= phr[0] %></li>\n' +
    '          <li><%= phr[1] %></li>\n' +
    '          <li><%= phr[2] %></li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '\n' +
    '    <div dropdown="demo.config" dropdown-control=\'demo.isOpen\'>\n' +
    '        <button><%= btn %></button>\n' +
    '        <ul class="menu" dropdown-panel>\n' +
    '          <svg class="border" symbol="components/dropdown/graphics/arrow.svg"></svg>\n' +
    '          <svg class="bg" symbol="components/dropdown/graphics/arrow.svg"></svg>\n' +
    '          <li>Menu item 1</li>\n' +
    '          <li>Menu item 2</li>\n' +
    '          <li>Menu item 3</li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '\n' +
    '    <div>\n' +
    '        <button ng-click="demo.toggle()">Toggle second dropdown</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<style>\n' +
    '    .dropdown{\n' +
    '        display: inline-block;\n' +
    '    }\n' +
    '\n' +
    '    .dropdownExample div{\n' +
    '      margin: 10px;\n' +
    '    }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/dropdown/templates/dropdown.html',
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
  $templateCache.put('app/xydeco/components/emblem/examples/emblem-examples.html',
    '<div class="grid">\n' +
    '    <div class="two- box">\n' +
    '        <div class="highlighted- emblem">\n' +
    '            <a href="#"> <!-- surrounds the clickable area -->\n' +
    '                <div class="emblem-image"\n' +
    '                     style="background-image: url(components/emblem/examples/AirwatchBrowser.png)">\n' +
    '                </div>\n' +
    '                <h3 class="emblem-title"><%= h.1 %></h3>\n' +
    '                <span class="emblem-status"><%= phr.1 %></span>\n' +
    '            </a>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="two- box">\n' +
    '        <div class="emblem">\n' +
    '            <a href="#"> <!-- surrounds the clickable area -->\n' +
    '                <div class="emblem-image"\n' +
    '                     style="background-image: url(components/emblem/examples/BoxNet.gif)">\n' +
    '                </div>\n' +
    '                <h3 class="emblem-title"><%= h.2 %></h3>\n' +
    '                <span class="emblem-status"><%= phr.2 %></span>\n' +
    '            </a>\n' +
    '            <span class="emblem-flag"><%= w.2 %></span>\n' +
    '            <div class="emblem-favorite">\n' +
    '                <svg class="filled- symbol" symbol="components/rating/graphics/star.svg"></svg>\n' +
    '            </div>\n' +
    '            <div class="emblem-badge">\n' +
    '                <svg symbol="components/emblem/examples/virtual-app.svg"></svg>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/balanced-frame.html',
    '<div class="headered- balanced- sidebarred- frame">\n' +
    '    <div class="frame-header">\n' +
    '        <h3><%= h.0 %></h3>\n' +
    '    </div>\n' +
    '    <div class="frame-sidebar">\n' +
    '        <ul class="menu">\n' +
    '            <li><a href="#"><%= phr.0 %></a></li>\n' +
    '            <li><a href="#"><%= phr.1 %></a></li>\n' +
    '            <li><a href="#"><%= phr.2 %></a></li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '    <div class="vertically- scrollable- pane">\n' +
    '        <div class="page typography">\n' +
    '            <p><%= p.1 %></p>\n' +
    '            <p><%= p.2 %></p>\n' +
    '            <p><%= p.3 %></p>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/basic-frame.html',
    '<div class="frame">\n' +
    '  <div class="vertically- scrollable- pane typography">\n' +
    '    <p><%= p.1 %>\n' +
    '    <p><%= p.2 %>\n' +
    '    <p><%= p.3 %>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<!-- demo style -->\n' +
    '<style> .frame { border: 4px solid #456; } </style>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/footered-frame.html',
    '<section class="headered- footered- frame">\n' +
    '  <header><h1><%= h %></h1></header>\n' +
    '  <div class="vertically- scrollable- pane">\n' +
    '    <p><%= p.1 %>\n' +
    '    <p><%= p.2 %>\n' +
    '    <p><%= p.3 %>\n' +
    '  </div>\n' +
    '  <footer><%= s %></footer>\n' +
    '</section>\n' +
    '<!-- demo style -->\n' +
    '<style>\n' +
    '  .frame { border: 4px solid #456; }\n' +
    '  h1 { font-size: inherit; margin: 0 }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/frame-body.html',
    '<div class="headered- footered- frame">\n' +
    '  <div class="frame-body">\n' +
    '    <h1 class="frame-header"><%= h %></h1>\n' +
    '    <div class="vertically- scrollable- pane typography">\n' +
    '      <p><%= p.1 %>\n' +
    '      <p><%= p.2 %>\n' +
    '      <p><%= p.3 %>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="frame-footer"><%= s %></div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '  .frame { border: 4px solid #456; }\n' +
    '  h1 { font-size: inherit; margin: 0 }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/frame-drawer.html',
    '<div class="headered- frame">\n' +
    '    <div frame-drawer drawer-control="openDrawer">\n' +
    '        <ul class="menu">\n' +
    '            <li><a href="#"><%= phr.0 %></a></li>\n' +
    '            <li><a href="#"><%= phr.1 %></a></li>\n' +
    '            <li><a href="#"><%= phr.2 %></a></li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '    <div class="frame-header">\n' +
    '        <h3><%= h.0 %></h3>\n' +
    '    </div>\n' +
    '    <div class="vertically- scrollable- pane typography">\n' +
    '        <p><span checkbox ng-model="openDrawer">Open</span></p>\n' +
    '        <p><%= p.1 %></p>\n' +
    '        <p><%= p.2 %></p>\n' +
    '        <p><%= p.3 %></p>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/frame-sidebar.html',
    '<div class="headered- sidebarred- frame">\n' +
    '    <div class="frame-header">\n' +
    '        <h3><%= h.0 %></h3>\n' +
    '    </div>\n' +
    '    <div class="frame-sidebar">\n' +
    '        <ul class="menu">\n' +
    '            <li><a href="#"><%= phr.0 %></a></li>\n' +
    '            <li><a href="#"><%= phr.1 %></a></li>\n' +
    '            <li><a href="#"><%= phr.2 %></a></li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '    <div class="vertically- scrollable- pane typography">\n' +
    '        <p><%= p.1 %></p>\n' +
    '        <p><%= p.2 %></p>\n' +
    '        <p><%= p.3 %></p>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/headered-frame.html',
    '<section class="headered- frame">\n' +
    '  <header>\n' +
    '    <h1><%= h %>\n' +
    '  </header>\n' +
    '  <div class="vertically- scrollable- pane typography">\n' +
    '    <p><%= p.1 %>\n' +
    '    <p><%= p.2 %>\n' +
    '    <p><%= p.3 %>\n' +
    '  </div>\n' +
    '</section>\n' +
    '<!-- demo style -->\n' +
    '<style>\n' +
    '  .frame { border: 4px solid #456; }\n' +
    '  h1 { font-size: inherit; margin: 0 }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/overlaid-frame.html',
    '<div class="headered- overlaid- frame">\n' +
    '              <h1 class="frame-header"><%= h %></h1>\n' +
    '              <div class="vertically- scrollable- pane typography">\n' +
    '                <p><%= p.1 %>\n' +
    '                <p><%= p.2 %>\n' +
    '                <p><%= p.3 %>\n' +
    '              </div>\n' +
    '              <div class="frame-overlay"><%= s %></div>\n' +
    '            </div>\n' +
    '            <!-- demo style -->\n' +
    '            <style>\n' +
    '              .frame { border: 4px solid #456; }\n' +
    '              h1 { font-size: inherit; margin: 0 }\n' +
    '              .frame-overlay { background: rgba(200,200,200,0.5); }\n' +
    '            </style>\n' +
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
  $templateCache.put('app/xydeco/components/frame/examples/split-frame.html',
    '<div class="headered- frame">\n' +
    '  <header>A split frame</header>\n' +
    '  <div class="horizontal- frame-split">\n' +
    '    <div class="pane typography">\n' +
    '        <p><%= p.1 %>\n' +
    '        <p><%= p.2 %>\n' +
    '    </div>\n' +
    '    <div class="pane typography">\n' +
    '        <p><%= p.3 %>\n' +
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
  $templateCache.put('app/xydeco/components/glyph/template.html',
    '<!doctype html>\n' +
    '<html>\n' +
    '	<head>\n' +
    '		<meta charset="utf-8">\n' +
    '		<title><%= fontBaseName %></title>\n' +
    '		<style>\n' +
    '		body {\n' +
    '			margin:0;\n' +
    '			padding:10px 20px;\n' +
    '			background:#fff;\n' +
    '			color:#000;\n' +
    '			}\n' +
    '		h1, div, footer {\n' +
    '			font-family:"Helvetica Neue", Arial, sans-serif;\n' +
    '			}\n' +
    '		h1 {\n' +
    '			margin:0 0 20px;\n' +
    '			font-size:32px;\n' +
    '			font-weight:normal;\n' +
    '            clear: both;\n' +
    '			}\n' +
    '		.icons {\n' +
    '			margin-bottom:40px;\n' +
    '			}\n' +
    '		.icons__item {\n' +
    '			line-height:2em;\n' +
    '			cursor:pointer;\n' +
    '            white-space: nowrap;\n' +
    '            /* background: #d8d8d8; */\n' +
    '            margin: 0 1em 1em 0;\n' +
    '            float: left;\n' +
    '            width: 12em;\n' +
    '			}\n' +
    '		.icons__item i {\n' +
    '			display:inline-block;\n' +
    '			width:32px;\n' +
    '			text-align:center;\n' +
    '            font-size: 16px;\n' +
    '			}\n' +
    '		.icons__item:hover i {\n' +
    '           text-shadow: 1px 1px 0 rgba(255,255,255,.80), -1px -1px 2px rgba(50,50,50,0.20);\n' +
    '        }\n' +
    '		footer {\n' +
    '			margin-top:40px;\n' +
    '			font-size:14px;\n' +
    '			color:#999;\n' +
    '			}\n' +
    '\n' +
    '		<%= styles %>\n' +
    '		</style>\n' +
    '	</head>\n' +
    '	<body>\n' +
    '		<h1><%= fontBaseName %></h1>\n' +
    '\n' +
    '		<div class="icons" id="icons">\n' +
    '			<% for (var glyphIdx = 0; glyphIdx < glyphs.length; glyphIdx++) { var glyph = glyphs[glyphIdx] %>\n' +
    '				<div class="icons__item" data-name="<%= glyph %>"><i class="<%= classPrefix %><%= glyph %>- <%= baseClass %>"></i> <%= classPrefix %><%= glyph %>-</div>\n' +
    '			<% } %>\n' +
    '		</div>\n' +
    '\n' +
    '		<% if (addLigatures) { %>\n' +
    '		<div class="ligature-icons" style="display:none">\n' +
    '			<% for (var glyphIdx = 0; glyphIdx < glyphs.length; glyphIdx++) { var glyph = glyphs[glyphIdx]; %>\n' +
    '				<%= glyph %>\n' +
    '			<% } %>\n' +
    '		</div>\n' +
    '		<% } %>\n' +
    '\n' +
    '		<h1>Usage</h1>\n' +
    '		<pre><code>&lt;i class=&quot;<%= classPrefix %><span id="name">name</span>-<%= baseClass ? \' \' + baseClass : \'\' %>&quot;&gt;&lt;/i&gt;</code></pre>\n' +
    '		<% if (addLigatures) { %>\n' +
    '		<pre><code>&lt;i class=&quot;ligature-icons&quot;&gt;<span id="name2">name</span>&lt;/i&gt;</code></pre>\n' +
    '		<% } %>\n' +
    '\n' +
    '		<footer>Generated by <a href="https://github.com/sapegin/grunt-webfont">grunt-webfont</a>.</footer>\n' +
    '\n' +
    '		<script>\n' +
    '		(function() {\n' +
    '			document.getElementById(\'icons\').onclick = function(e) {\n' +
    '				e = e || window.event;\n' +
    '				var name = e.target.getAttribute(\'data-name\') || e.target.parentNode.getAttribute(\'data-name\');\n' +
    '				document.getElementById(\'name\').innerHTML = name;\n' +
    '				document.getElementById(\'name2\').innerHTML = name;\n' +
    '			}\n' +
    '		})();\n' +
    '		</script>\n' +
    '	</body>\n' +
    '</html>\n' +
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
  $templateCache.put('app/xydeco/components/grid/examples/basic-grid.html',
    '<div class="eight- grid">\n' +
    '    <div class="eight- box">8</div>\n' +
    '    <div class="seven- box">7</div>\n' +
    '    <div class="one- box">1</div>\n' +
    '    <div class="six- box">6</div>\n' +
    '    <div class="two- box">2</div>\n' +
    '    <div class="five- box">5</div>\n' +
    '    <div class="three- box">3</div>\n' +
    '    <div class="four- box">4</div>\n' +
    '    <div class="two- box">2</div>\n' +
    '    <div class="one- box">1</div>\n' +
    '    <div class="one- box">1</div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '.box { font-size: 24px; text-align: center; background: #ccc; }\n' +
    '.box:nth-child(even) { background: #999; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/grid/examples/grid-br.html',
    '<div class="eight- grid">\n' +
    '    <div class="four- box">4</div>\n' +
    '    <div class="two- box">2</div>\n' +
    '    <br class="grid-br">\n' +
    '    <div class="four- right- box">4r</div>\n' +
    '    <div class="two- right- box">2r</div>\n' +
    '    <br class="grid-br">\n' +
    '    <div class="one- box">1</div>\n' +
    '    <div class="one- right- box">1r</div>\n' +
    '    <div class="two- right- box">2r</div>\n' +
    '    <div class="two- box">2</div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '.box { font-size: 24px; text-align: center; background: #ccc; }\n' +
    '.box:nth-child(even) { background: #999; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/grid/examples/grid-row.html',
    '<div class="eight- grid">\n' +
    '    <div class="row- grid">\n' +
    '        <div class="four- box">4</div>\n' +
    '        <div class="two- box">2</div>\n' +
    '    </div>\n' +
    '    <div class="row- grid">\n' +
    '        <div class="four- right- box">4r</div>\n' +
    '        <div class="two- right- box">2r</div>\n' +
    '    </div>\n' +
    '    <div class="row- grid">\n' +
    '        <div class="one- box">1</div>\n' +
    '        <div class="one- right- box">1r</div>\n' +
    '        <div class="two- right- box">2r</div>\n' +
    '        <div class="two- box">2</div>\n' +
    '    </div>\n' +
    '    <div class="reduced- row- grid">\n' +
    '        <div class="four- box">4</div>\n' +
    '        <div class="two- box">2</div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '.box { font-size: 24px; text-align: center; background: #ccc; }\n' +
    '.box:nth-child(even) { background: #999; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/grid/examples/grid-rule.html',
    '<div class="eight- grid typography">\n' +
    '    <p class="box"><%= p.0 %></p>\n' +
    '    <hr class="grid-rule">\n' +
    '    <p class="four- box"><%= p.1 %></p>\n' +
    '    <p class="four- box"><%= p.2 %></p>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    'p { text-align: justify; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/grid/examples/nested-grid.html',
    '<div class="nine- grid">\n' +
    '    <div class="four- grid">\n' +
    '        <p class="two- box">2</p>\n' +
    '        <p class="two- box">2</p>\n' +
    '        <p class="four- box">4</p>\n' +
    '    </div>\n' +
    '    <div class="four- right- grid">\n' +
    '        <p class="four- box">4</p>\n' +
    '        <p class="two- box">2</p>\n' +
    '        <p class="two- box">2</p>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    '.box { font-size: 24px; text-align: center; background: #ccc; }\n' +
    '.box:nth-child(even) { background: #999; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/image/examples/basic-image.html',
    '<div class="grid">\n' +
    '    <div class="grid-row">\n' +
    '        <div class="three- box">\n' +
    '            <div class="image"></div>image (sd- landscape-)\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="filled- image"></div>filled- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="contained- image"></div>contained- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="tiled- image"></div>tiled- image\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="grid-row">\n' +
    '        <div class="three- box">\n' +
    '            <div class="square- image"></div>square- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="sd- image"></div>sd- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="hd- image"></div>hd- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="cinema- image"></div>cinema- image\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="grid-row">\n' +
    '        <div class="three- box">\n' +
    '            <div class="portrait- image"></div>portrait- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="hd- portrait- image"></div>hd- portrait- image\n' +
    '        </div>\n' +
    '        <div class="three- box">\n' +
    '            <div class="cinema- portrait- image"></div>cinema- portrait- image\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<style>\n' +
    '.image { background-image: url(graphics/tiger.svg); }\n' +
    '.image.tiled- { background-size: 50px; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/list/examples/description-list.html',
    '<dl class="description- list">\n' +
    '    <dt class="list-term"><%= w.0 %></dt>\n' +
    '    <dd class="list-description"><%= s.0 %></dd>\n' +
    '    <dt><%= w.1 %></dt>\n' +
    '    <dd><%= s.2 %></dd>\n' +
    '    <dd><%= s.3 %></dd>\n' +
    '    <dt class="list-item"><%= s.3 %></dt>\n' +
    '</dl>\n' +
    '\n' +
    '<dl class="compact- description- list">\n' +
    '    <dt class="list-term"><%= w.0 %></dt>\n' +
    '    <dd class="list-description"><%= s.0 %></dd>\n' +
    '    <dt><%= w.1 %></dt>\n' +
    '    <dd><%= s.2 %></dd>\n' +
    '    <dd><%= s.3 %></dd>\n' +
    '    <dt class="list-item"><%= s.3 %></dt>\n' +
    '</dl>\n' +
    '<!-- demo styles -->\n' +
    '<style>\n' +
    'dl + dl { margin-top: 2em; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/message/examples/externalMessageTemplate.html',
    '<div class="message">\n' +
    '    <!-- A Dialog inside the message -->\n' +
    '    <div class="dialog typography">\n' +
    '        <div class="dialog-header">\n' +
    '            <h3>{{message.type}}:&nbsp;{{message.text}}</h3>\n' +
    '        </div>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{message.info}}</p>\n' +
    '        </div>\n' +
    '        <div class="dialog-actions">\n' +
    '            <button class="link- button" ng-click="close($index, false)">Cancel</button>\n' +
    '            <button class="primary- button" ng-click="close($index)">Ok</button>\n' +
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
  $templateCache.put('app/xydeco/components/message/examples/message.html',
    '<div message-context class="pane">\n' +
    '    <div ng-controller="MessageDemo as demo">\n' +
    '        <div>\n' +
    '            <p><button  ng-click="$message.show([demo.error])">\n' +
    '                Show error Message </button></p>\n' +
    '            <p><button  ng-click="$message.show([demo.success])">\n' +
    '                Show success Message </button></p>\n' +
    '            <p><button  ng-click="$message.show([demo.warning])">\n' +
    '                Show warning Message </button></p>\n' +
    '            <p><button  ng-click="$message.show([demo.info])">\n' +
    '                Show info Message </button></p>\n' +
    '            <p><button  ng-click="$message.show([demo.untyped])">\n' +
    '                Show uncategorized Message </button></p>\n' +
    '            <p><button  ng-click="$message.show(demo.all)">\n' +
    '                Show several Messages</button></p>\n' +
    '            <p><button  ng-click="$message.show([demo.custom])">\n' +
    '                Show Message with custom template</button></p>\n' +
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
  $templateCache.put('app/xydeco/components/message/templates/defaultMessageTemplate.html',
    '<div class="message" ng-class="message.type + \'-\'">\n' +
    '    <i class="message-icon"></i>\n' +
    '    <button class="close- button" ng-click="close($index)"></button>\n' +
    '    <div class="message-body typography">\n' +
    '        <p>{{message.text}}</p>\n' +
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
  $templateCache.put('app/xydeco/components/message/templates/messageContextTemplate.html',
    '<ul class="message-queue">\n' +
    '    <li ng-repeat="message in _messagesArray_">\n' +
    '        <div message="message">\n' +
    '        </div>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/confirm-modal.html',
    '<div modal-context class="pane" ng-controller="ConfirmModalDemo as demo">\n' +
    '    <p ng-hide="demo.deleted"><%= p %></p>\n' +
    '    <button class="danger- button" ng-click="demo.action()">Delete</button>\n' +
    '    <p ng-show="demo.cancelled">Whew! That was close.</p>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/contextual-modal.html',
    '<div class="pane" ng-controller="ModalDemo as demo">\n' +
    '  <div id="context" modal-context>\n' +
    '    <p id="inside"><%= p.2 %></p>\n' +
    '    <button ng-click="$modal.open(demo.externalTemplate, {message: \'<%= s %>\'})"><%= btn %></button>\n' +
    '  </div>\n' +
    '  <p id="outside"><%= p.1 %></p>\n' +
    '</div>\n' +
    '<!-- styling for demo only -->\n' +
    '<style>\n' +
    '#context { border: 1px solid red; position: absolute; top: 0; left: 50%; height: 100%; width: 50%; }\n' +
    '#inside  { margin: 50px auto; }\n' +
    '#outside { position: absolute; bottom: 50px; left: 25%; width: 50%; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/controller-modal.html',
    '<div modal-context class="pane">\n' +
    '  <div ng-controller="ControllerModalDemo as demo">\n' +
    '    <button ng-click="demo.say()">Say Something</button>\n' +
    '  </div>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/controllerModalTemplate.html',
    '<div modal class="headered- footered- modal">\n' +
    '    <section class="dialog typography" ng-controller="InnerController as inner">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>Modal Dialog</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ demo.messages[demo.counter] }}</p>\n' +
    '            <p>Outer controller count: {{ demo.counter }}</p>\n' +
    '            <p>Inner controller count: {{ inner.counter }} (resets on modal.open)</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button" ng-click="$modal.close()">Cancel</button>\n' +
    '            <button class="safe- button" ng-click="inner.increment()">Increment</button>\n' +
    '            <button class="primary- button" ng-click="$modal.close(true)">Ok</button>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/external-modal.html',
    '<div modal-context class="pane">\n' +
    '  <div ng-controller="ModalDemo as demo">\n' +
    '    <div ng-repeat="m in demo.messages">\n' +
    '      <input ng-model="m">\n' +
    '      <button ng-click="$modal.open(demo.externalTemplate, {message: m})">Message {{$index}}</button>\n' +
    '    </div>\n' +
    '  </div>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/inline-modal.html',
    '<div modal-context class="pane">\n' +
    '    <div ng-controller="ModalDemo as demo">\n' +
    '        <div ng-repeat="m in demo.messages">\n' +
    '            <input ng-model="m">\n' +
    '            <button ng-click="$modal.open(\'myDialog\', {message: m})">Message {{$index}}</button>\n' +
    '        </div>\n' +
    '        <button ng-click="$modal.open(\'myDialog\', {title: \'Oops!\'})">No Message</button>\n' +
    '    </div>\n' +
    '    <!-- the modal template itself, in the DOM but hidden -->\n' +
    '    <div modal="myDialog" class="headered- footered- modal">\n' +
    '        <div class="dialog typography">\n' +
    '            <div class="dialog-header">\n' +
    '                <h3 ng-if="!title">Modal Dialog</h3>\n' +
    '                <h3 ng-if="title">{{ title }}</h3>\n' +
    '            </div>\n' +
    '            <div class="dialog-body">\n' +
    '                <p ng-if="!message">There was no message.</p>\n' +
    '                <p ng-if="message">{{ message }}</p>\n' +
    '            </div>\n' +
    '            <div class="dialog-actions">\n' +
    '                <button class="link- button" ng-click="$modal.close()">Cancel</button>\n' +
    '                <button class="primary- button" ng-click="$modal.close()">Ok</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '  </div>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/message-modal.html',
    '<div modal-context message-context class="pane">\n' +
    '  <div ng-controller="MessageModalDemo as demo">\n' +
    '      <button ng-click="$modal.open(demo.externalTemplate, this)">Open Modal</button>\n' +
    '  </div>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/messageModalTemplate.html',
    '<div modal class="headered- footered- modal">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>Modal Dialog</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <div ng-repeat="message in demo.messages">\n' +
    '                <button ng-click="$message.show([message])">Message {{$index}}</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button" ng-click="$modal.close()">Cancel</button>\n' +
    '            <button class="primary- button" ng-click="$modal.close(true)">Ok</button>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/modalTemplate.html',
    '<div modal class="headered- footered- modal">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header">\n' +
    '            <h3>Modal Dialog</h3>\n' +
    '        </header>\n' +
    '        <div class="dialog-body">\n' +
    '            <p>{{ message }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <button class="link- button" ng-click="$modal.close()">Cancel</button>\n' +
    '            <button class="primary- button" ng-click="$modal.close(true)">Ok</button>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/promise-modal.html',
    '<div modal-context class="pane" ng-controller="PromiseModalDemo as demo">\n' +
    '    <span class="swatch" ng-style="{\'background-color\': demo.selectedColor}"></span>\n' +
    '    <button ng-click="demo.choose()">Choose Color</span>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/promiseModalTemplate.html',
    '<div modal class="headered- footered- modal">\n' +
    '    <div class="dialog">\n' +
    '        <div class="dialog-header">\n' +
    '            <h3>Select Color</h3>\n' +
    '        </div>\n' +
    '        <div class="dialog-body">\n' +
    '            <ul class="list">\n' +
    '                <li>\n' +
    '                    <input type="radio" ng-model="color" value="#ff0000">\n' +
    '                    <span class="swatch" style="background-color: #ff0000"></span>\n' +
    '                    Red\n' +
    '                </li>\n' +
    '                <li>\n' +
    '                    <input type="radio" ng-model="color" value="#00ff00">\n' +
    '                    <span class="swatch" style="background-color: #00ff00"></span>\n' +
    '                    Green\n' +
    '                </li>\n' +
    '                <li>\n' +
    '                    <input type="radio" ng-model="color" value="#0000ff">\n' +
    '                    <span class="swatch" style="background-color: 0000ff"></span>\n' +
    '                    Blue\n' +
    '                </li>\n' +
    '                <li>\n' +
    '                    <input type="radio" ng-model="color" value="">\n' +
    '                    <span class="swatch"></span>\n' +
    '                    None\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '        <div class="dialog-actions">\n' +
    '            <ul class="right-to-left- actions">\n' +
    '                <li>\n' +
    '                    <button class="primary- button" ng-click="$modal.close(color)">\n' +
    '                        Select\n' +
    '                    </button>\n' +
    '                </li>\n' +
    '                <li>\n' +
    '                    <button class="link- button" ng-click="$modal.cancel()">\n' +
    '                        Cancel\n' +
    '                    </button>\n' +
    '                </li>\n' +
    '            </ul>\n' +
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
  $templateCache.put('app/xydeco/components/modal/examples/scroll-modal.html',
    '<div modal-context class="pane">\n' +
    '    <button ng-click="$modal.open(\'scrollDialog\')">Long Dialog</button>\n' +
    '    <!-- the modal template itself, in the DOM but hidden -->\n' +
    '    <div modal="scrollDialog" class="scrollable- headered- footered- modal">\n' +
    '        <div class="dialog typography">\n' +
    '            <div class="dialog-header">\n' +
    '                <h3>Long Modal Dialog</h3>\n' +
    '            </div>\n' +
    '            <div class="dialog-body">\n' +
    '                <p><%= p.0 %></p>\n' +
    '                <p><%= p.1 %></p>\n' +
    '                <p><%= p.2 %></p>\n' +
    '                <p><%= p.3 %></p>\n' +
    '                <p><%= p.4 %></p>\n' +
    '                <p><%= p.5 %></p>\n' +
    '            </div>\n' +
    '            <div class="dialog-actions">\n' +
    '                <button class="primary- button" ng-click="$modal.close()">Ok</button>\n' +
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
  $templateCache.put('app/xydeco/components/modal/templates/alert.html',
    '<div modal="modal-alert" class="footered- mini- modal">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header" ng-show="title">\n' +
    '            <h4 ng-show="title">{{ title | i18n }}</h4>\n' +
    '        </header>\n' +
    '        <div class="dialog-body typography">\n' +
    '            <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <ul class="right-to-left- actions">\n' +
    '                <li><button class="primary- button" ng-click="$modal.close()">\n' +
    '                    {{ ok | i18n }}\n' +
    '                </button></li>\n' +
    '            </ul>\n' +
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
  $templateCache.put('app/xydeco/components/modal/templates/confirm.html',
    '<div modal="modal-confirmation" class="footered- mini- modal">\n' +
    '    <section class="dialog">\n' +
    '        <header class="dialog-header" ng-show="title">\n' +
    '            <h4 ng-show="title">{{ title | i18n }}</h4>\n' +
    '        </header>\n' +
    '        <div class="dialog-body typography">\n' +
    '            <p ng-show="message">{{ message | i18n }}</p>\n' +
    '        </div>\n' +
    '        <footer class="dialog-actions">\n' +
    '            <ul class="right-to-left- actions">\n' +
    '                <li><button class="primary- button" ng-click="$modal.close()">\n' +
    '                    {{ ok | i18n }}\n' +
    '                </button></li>\n' +
    '                <li><button class="link- button" ng-click="$modal.cancel()">\n' +
    '                    {{ cancel | i18n }}\n' +
    '                </button></li>\n' +
    '            </ul>\n' +
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
  $templateCache.put('app/xydeco/components/modal/templates/modal.html',
    '<div class="modal">\n' +
    '    <div class="modal-window-overlay"></div>\n' +
    '    <div class="modal-overlay"></div>\n' +
    '    <div class="modal-frame">\n' +
    '        <div class="modal-pane" ng-transclude></div>\n' +
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
  $templateCache.put('app/xydeco/components/modal/templates/spinner.html',
    '<div modal="modal-spinner" class="mini- modal">\n' +
    '    <section class="dialog">\n' +
    '        <div class="dialog-body typography">\n' +
    '            <h4 ng-show="title">{{ title | i18n }}</h4>\n' +
    '            <p ng-show="message">{{ message | i18n }}</p>\n' +
    '            <div class="center- spinner"></div>\n' +
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
  $templateCache.put('app/xydeco/components/rating/examples/rating.html',
    '<p>No stars: <span rating="0"></span></p>\n' +
    '<p>One star: <span rating="1"></span></p>\n' +
    '<p>Two stars: <span rating="2"></span></p>\n' +
    '<p>Three stars: <span rating="6/2"></span></p>\n' +
    '<p>Four stars: <span rating="2*2"></span></p>\n' +
    '<p>Five stars: <span rating="5"></span></p>\n' +
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
  $templateCache.put('app/xydeco/components/rating/templates/rating.html',
    '<span class="rating">\n' +
    '    <svg class="symbol" symbol="components/rating/graphics/star.svg"\n' +
    '        ng-class="{\'filled-\' : val <= rating}"\n' +
    '        ng-repeat="val in $rating.values"></svg>\n' +
    '</span>\n' +
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
  $templateCache.put('app/xydeco/components/spinner/examples/spinner-colors.html',
    '<div>Default size of spinner is small. First spinner has a class large atached to it.</div>\n' +
    '<div><svg spinner class="large"></svg></div>\n' +
    '<div class="red"><svg spinner></svg></div>\n' +
    '<div class="white"><svg spinner></svg></div>\n' +
    '\n' +
    '<style>\n' +
    '.spinner { margin: 20px; }\n' +
    '.red { color: red; }\n' +
    '.white { background: #333; color: white; }\n' +
    '</style>\n' +
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
  $templateCache.put('app/xydeco/components/symbol/examples/symbol-directive.html',
    '<p>\n' +
    '    Symbols can be preloaded into the DOM\n' +
    '    <svg symbol="circle.svg" />\n' +
    '    or loaded dynamically on first reference\n' +
    '    <svg symbol="components/symbol/examples/square.svg" />\n' +
    '</p>\n' +
    '<p style="font-size: 20px">\n' +
    '    <svg symbol="components/symbol/examples/plus.svg" />\n' +
    '    <svg symbol="components/symbol/examples/grid.svg" />\n' +
    '</p>\n' +
    '\n' +
    '<!-- the symbol can be defined anywhere in the DOM: -->\n' +
    '<svg style="display: none">\n' +
    '    <defs>\n' +
    '        <symbol id="svg-symbol-circle" viewBox="0 0 100 100">\n' +
    '            <circle cx="50" cy="50" r="45"/>\n' +
    '        </symbol>\n' +
    '    </defs>\n' +
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
  $templateCache.put('app/xydeco/components/symbol/examples/symbol.html',
    '<p style="color: blue">\n' +
    '    Symbols such as this one\n' +
    '    <svg class="symbol"><use xlink:href="#svg-symbol-circle" /></svg>\n' +
    '    take on the color of the surrounding text.\n' +
    '</p>\n' +
    '\n' +
    '\n' +
    '<!-- the symbol can be defined anywhere in the DOM: -->\n' +
    '<svg style="display: none">\n' +
    '    <defs>\n' +
    '        <symbol id="svg-symbol-circle" viewBox="0 0 100 100">\n' +
    '            <circle cx="50" cy="50" r="45"/>\n' +
    '        </symbol>\n' +
    '    </defs>\n' +
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
  $templateCache.put('app/xydeco/components/tabs/examples/nav-tabs.html',
    '<div class="pane">\n' +
    '    <ul class="primary- tabs">\n' +
    '        <li><a>One</a>\n' +
    '        </li><li class="is-active"><a>Two</a>\n' +
    '        </li><li><a>Three</a></li></ul>\n' +
    '    <ul class="secondary- tabs">\n' +
    '        <li><a>Cat</a>\n' +
    '        </li><li><a>Dog</a>\n' +
    '        </li><li class="is-active"><a>Lizard</a></li></ul>\n' +
    '    <div class="typography">\n' +
    '        <h2><%= h %></h2>\n' +
    '        <ul class="tertiary- tabs">\n' +
    '            <li><a>Red</a>\n' +
    '            </li><li><a>Blue</a>\n' +
    '            </li><li class="is-active"><a>Green</a></li></ul>\n' +
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
  $templateCache.put('app/xydeco/components/tabs/templates/tabs.html',
    '<ul class="tabs"><li ng-class="{\'is-active\': tab.active}" ng-repeat="tab in routes">\n' +
    '    <a ng-href="{{::tab.href}}">{{::tab.key | i18n}}</a>\n' +
    '</li></ul>\n' +
    '');
}]);
})();
