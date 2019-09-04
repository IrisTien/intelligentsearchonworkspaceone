(function(module) {
try {
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/dropdown/templates/dropdown.html',
    '<div class="dropdown" ng-class="{\'is-active\' : $dropdown.isActive }" ng-transclude>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/message/templates/defaultMessageTemplate.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/message/templates/messageContextTemplate.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/templates/alert.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/templates/confirm.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/templates/modal.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/templates/spinner.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/rating/templates/rating.html',
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
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/spinner/templates/spinner.svg',
    '<svg class="spinner" width="100" height="100" viewBox="0 0 100 100" version="1.1"\n' +
    '    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <defs>\n' +
    '        <g id="svgdef-spinner-blade">\n' +
    '            <rect width="6" height="32" y="-48" x="-3"/>\n' +
    '        </g>\n' +
    '    </defs>\n' +
    '    <g transform="translate(50,50)" stroke="none">\n' +
    '        <use xlink:href="#svgdef-spinner-blade"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(30)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(60)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(90)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(120)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(150)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(180)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(210)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(240)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(270)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(300)"/>\n' +
    '        <use xlink:href="#svgdef-spinner-blade" transform="rotate(330)"/>\n' +
    '    </g>\n' +
    '</svg>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('greenbox.components.templates');
} catch (e) {
  module = angular.module('greenbox.components.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/tabs/templates/tabs.html',
    '<ul class="tabs"><li ng-class="{\'is-active\': tab.active}" ng-repeat="tab in routes">\n' +
    '    <a ng-href="{{::tab.href}}">{{::tab.key | i18n}}</a>\n' +
    '</li></ul>\n' +
    '');
}]);
})();
