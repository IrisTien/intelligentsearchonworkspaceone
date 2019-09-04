// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module){

    module.directive('dropdown', function () {

        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: { config: '=?dropdown', isActive: '=?dropdownControl' },
            controllerAs: '$dropdown',
            bindToController: true,
            controller: ['$scope', '$document', '$timeout', controller],
            link: postLink,
            templateUrl: 'components/dropdown/templates/dropdown.html'
        };

        function controller ($scope, $document, $timeout) {
            var $dropdown = this;
            //Hide the dropdown by default
            $dropdown.isActive = $dropdown.isActive || false;
            //Click away enabled by default
            if($dropdown.config === undefined){
                $dropdown.config = { closeOnClick: true };
            }

            $scope.$watch('$dropdown.isActive', function(value){
                if($dropdown.isActive){
                    $timeout(function(){
                        $document.bind('click', closeDropdown);
                    });
                }else{
                    $timeout(function(){
                        $document.unbind('click', closeDropdown);
                    });
                }
            });

            $dropdown.toggle = function () {
                $dropdown.isActive = !$dropdown.isActive;
            };

            $dropdown.setElement = function (element) {
                $dropdown.element = element;
            };

            //Close dropdown
            var closeDropdown = function( event ) {
                var element = $dropdown.element;
                if( event && element && element[0].contains(event.target) ) {
                    return;
                }
                $scope.$apply(function () {
                    $dropdown.isActive = false;
                });
            };
        }

        function postLink (scope, element, attrs, $dropdown) {
            $dropdown.setElement(element);
            element.bind('click', function(){
                scope.$apply(function(){
                    $dropdown.toggle();
                });
            });
        }

    });

    module.directive('dropdownPanel', function() {
        return {
            restrict: 'A',
            link: postLink,
            require: ['^dropdown']
        };

        function postLink (scope, element, attrs, controllers) {
            element.addClass('dropdown-panel');
            var $dropdown = controllers[0];
            if(!$dropdown.config.closeOnClick){
                element.bind('click', function(event){
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        }
    });

})(angular.module('com.vmware.workspace.components.dropdown', []));

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module){

	module.directive('frameDrawer', ['$timeout', function($timeout) {

        return {
            restrict: 'A',
            link: postLink,
            controller: ['$scope', '$element', controller],
            controllerAs: '$frameDrawer',
            scope: { isActive: '=drawerControl' },
            bindToController: true
        };

        function controller ($scope, $element) {
            var $frameDrawer = this;
            $frameDrawer.isActive = $frameDrawer.isActive || false;

            $scope.$watch('$frameDrawer.isActive', function(newValue) {
                if(newValue) {
                    $element.addClass('is-active');
                }else{
                    $element.removeClass('is-active');
                }
                //See https://jira-hzn.eng.vmware.com/browse/HW-52278
                //Force, repaint on drawer menu's sibling elements.
                $element.siblings().toggleClass('no-op');
            });
        }

        function postLink (scope, element, attrs, controllers) {
            var $frameDrawer = controllers;
            element.addClass('frame-drawer');

            //Close drawer on selecting
            element.bind('click', function(event) {
                if($(event.target).is('a')){
                    scope.$apply(function() {
                        $frameDrawer.isActive = false;
                    });
                }
            });
        }

    }]);

})(angular.module('com.vmware.workspace.components.frameDrawer', []));
/*
 * lineClampDirective:
 * This directive is intended to be a cross-browser solution to emulate
 * text-overflow: ellipsis support for multiline elements. As of writing this,
 * the only way to do this through CSS is using non-standard webkit or opera
 * vendor properties.
 *
 * Dependencies: 
 * lodash
 *
 * Usage:
 * Add the line-clamp attribute to your element and specify the content as well
 * as how many lines to allow before truncating.
 *
 * Example:
 * <p line-clamp content="text string" lines="2"></p>
 *
 * Notes:
 * The directive logic will execute each time the window resize event is triggered, but
 * will not execute if the element has CSS white-space: nowrap.
 * */

(function(module){
    'use strict';

    module.directive('lineClamp', ['$timeout', '$window', function($timeout, $window) {
        return {
            link: link,
            replace: true,
            restrict: 'A',
            scope: {
                content: '=',
                lines: '='
            },
            template: '<p>{{::content}}</p>'
        };

        function link($scope, element) {
            var w = angular.element($window),
                options = {
                    content: $scope.content.trim(),
                    lines: $scope.lines
                },
                debouncedClamp = _.debounce(function() {
                    clamp(element[0], options);
                }, 100),
                ELLIPSIS = '\u2026';

            w.bind('resize', debouncedClamp);

            $scope.$on('$destroy', function() {
                w.unbind('resize', debouncedClamp);
            });

            // Using $timeout to give it time to bind the value to the template.
            $timeout(debouncedClamp, 0, false);

            function clamp(elt, options) {
                // If nowrap, text is forced to overflow horizontally and we have
                // no way to know where to truncate, so let the webview handle it.
                if (window.getComputedStyle(elt).whiteSpace === 'nowrap') {
                    elt.textContent = options.content;
                    return;
                }

                var content = options.content,
                    eltHeight = elt.scrollHeight,
                    maxHeight = getMaxHeight(elt, options.lines),
                    length;

                // No truncation needed
                if (eltHeight <= maxHeight) {
                    return;
                }

                // Truncate by character until the height does not exceed maxHeight.
                for (length = content.length; length && elt.scrollHeight > maxHeight; --length) {
                    content = content.substring(0, length);
                    elt.textContent = content.trim() + ELLIPSIS;
                }
            }

            // Get the minimum among explicit values and the calculated
            // value based on lines to clamp.
            function getMaxHeight(elt, lines) {
                var lineHeight = getLineHeight(elt),
                    maxHeight = lines * lineHeight,
                    computedStyle = window.getComputedStyle(elt),
                    cssHeight = parseFloat(computedStyle.height),
                    cssMaxHeight = parseFloat(computedStyle.maxHeight),
                    possibleValues = [maxHeight],
                    errorMargin;

                if (!isNaN(cssHeight)) {
                    possibleValues.push(cssHeight);
                }
                if (!isNaN(cssMaxHeight)) {
                    possibleValues.push(cssMaxHeight);
                }

                // Take the most restrictive (smallest) value as the maxHeight.
                maxHeight = Math.min.apply(Math, possibleValues);

                // Account for font rendering where the actual height of the
                // first line can be greater than the lineHeight value.
                errorMargin = Math.max(lineHeight / 4.0, 1); // 25% is arbitrary but seems to be a be a good baseline.

                return maxHeight + errorMargin;
            }

            // If the lineHeight is available as a number use that,
            // else calculate it manually.
            function getLineHeight(elt) {
                var lineHeightCss = window.getComputedStyle(elt).lineHeight,
                    lineHeightValue = parseFloat(lineHeightCss);

                return isNaN(lineHeightValue) ? calculateLineHeight(elt) : lineHeightValue;
            }

            // Calculate the local line height by cloning the element to create
            // a duplicate context, appending a new line and comparing the height
            // difference.
            function calculateLineHeight(elt) {
                var clone = elt.cloneNode(),
                    height1, height2;

                elt.appendChild(clone);

                clone.innerHTML = '<br />';
                height1 = clone.scrollHeight;
                clone.innerHTML = '<br /><br />';
                height2 = clone.scrollHeight;

                elt.removeChild(clone);

                return height2 - height1;
            }
        }
    }]);
})( angular.module("com.vmware.workspace.components.lineClamp", []) );
// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {
    module.directive('messageContext', ['$http', '$compile', '$templateCache', '$log', '$templateRequest', 'Localization',
        function ($http, $compile, $templateCache, $log, $templateRequest, Localization) {
            return {
                restrict: 'AE',
                scope: true,
                controllerAs: '$message',
                bindToController: true,
                controller: function ($scope, $element) {
                    var $message = this;
                    var TEMPLATE_URL = "components/message/templates/messageContextTemplate.html";
                    $scope._messagesArray_ = [];
                    $templateRequest(TEMPLATE_URL)
                        .then( function(templateData){
                            $compile(angular.element(templateData))($scope, function (clonedElement) {
                                angular.element($element).append(clonedElement);
                            });
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + TEMPLATE_URL + ' [' + e.message + ']');
                        });

                    function show (messagesArray) {
                        if(!angular.isArray(messagesArray) && angular.isObject(messagesArray)){
                            messagesArray = [messagesArray];
                        }
                        $scope._messagesArray_ = messagesArray;
                        $scope.close = close;
                    };

                    function info(messageKey, params, templateUrl) {
                        showMessage("info", messageKey, params, templateUrl);
                    }

                    function error(messageKey, params, templateUrl) {
                        showMessage("error", messageKey, params, templateUrl);
                    }

                    function warning(messageKey, params, templateUrl) {
                        showMessage("warning", messageKey, params, templateUrl);
                    }

                    function success(messageKey, params, templateUrl){
                        showMessage("success", messageKey, params, templateUrl);
                    }

                    function showMessage(messageType, message, params, templateUrl) {
                        var msg = {};
                        msg.type = messageType;
                        msg.text = Localization.getLocalizedString(message, params ? params : []);
                        if (templateUrl) {
                            msg.templateUrl = templateUrl;
                        }

                        show(msg);
                    }

                    // Close a message dialog.
                    function close (index) {
                        if (index >= 0 && angular.isArray($scope._messagesArray_)){
                            $scope._messagesArray_.splice(index, 1);
                        }
                    };

                    $message.info = info;
                    $message.error = error;
                    $message.warning = warning;
                    $message.success = success;
                    $message.show = show;
                    $message.close = close;
                },
                link : function($scope, element) {
                    element.addClass('message-context');
                }
            };
        }]);
    module.directive('message',   ['$templateCache', '$http', '$compile', '$log', '$templateRequest',
        function ($templateCache, $http, $compile, $log, $templateRequest) {
            return {
                restrict: 'AE',
                require: '^messageContext',
                scope: false,
                transclude: true,
                replace: true,
                link: function ($scope, element, attrs, message) {
                    var DEFAULT_TEMPLATE_URL = "components/message/templates/defaultMessageTemplate.html",
                        url = $scope.message.templateUrl || DEFAULT_TEMPLATE_URL;
                    var template = $templateCache.get(url);
                    $templateRequest(url)
                        .then( function(templateData){
                            populateDialog(angular.element(templateData));
                        })
                        .catch( function(e) {
                            $log.error('Failed to load template: ' + url + ' [' + e.message + ']');
                        });
                    function populateDialog(template){
                        $compile(template)($scope, function (clonedElement) {
                            element.append(clonedElement);
                        });
                    };

                }
            };
        }]);
})(angular.module('com.vmware.workspace.components.message', []));

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    var activeClass = 'is-active';

    module.directive('modalContext', [
        '$compile', '$templateRequest', '$log', '$timeout', '$animate', '$q', 'Localization',
        function ($compile, $templateRequest, $log, $timeout, $animate, $q, Localization) {
            return {
                restrict: 'AE',
                scope: true,
                controller: controller,
                link: postLink,
                controllerAs: '$modal',
                bindToController: true
            };

            function controller($scope, $element) {
                var $modal = this,
                    modals = {}, // all loaded modal templates: {name -> {element, linkFn}, ... }
                    PUSH = 'PUSH',
                    POP = 'POP',
                    MOVE = 'MOVE';
                $scope.stack = [];  // pending activation requests: [{name: '...', options: {}], ...]

                $scope.$watchCollection('stack',
                    function (newStack, oldStack) {

                        var delta = findChange(newStack,oldStack),
                            newActivation = delta.newActivation,
                            newRequest = delta.newRequest,
                            oldActivation = delta.oldActivation,
                            oldRequest = delta.oldRequest;

                        switch (delta.change) {
                            case PUSH:
                                if(oldActivation)
                                    hide(oldActivation.element);
                                if(newActivation && newRequest)
                                    activate(newActivation.element, newActivation.linkFn, newRequest.options);
                                    break;
                            case POP:
                                if(oldActivation && oldRequest)
                                    deactivate(oldActivation.element, oldRequest.options);
                                if(newActivation)
                                    show(newActivation.element);
                                break;
                            case MOVE:
                            default:
                                if(oldActivation && oldRequest)
                                    deactivate(oldActivation.element, oldRequest.options);
                                if(newActivation && newRequest)
                                    activate(newActivation.element, newActivation.linkFn, newRequest.options);
                        }

                        function findChange(newStack, oldStack){

                            var delta = {},
                                oldStackLength = oldStack && oldStack.length?oldStack.length: 0,
                                newStackLength = newStack && newStack.length?newStack.length: 0,
                                oldName,
                                newName;

                            delta.oldRequest =  oldStackLength ? oldStack[oldStackLength - 1 ] : undefined;
                            delta.newRequest =  newStackLength ? newStack[newStackLength - 1 ] : undefined;
                            oldName = delta.oldRequest && delta.oldRequest.name;
                            newName = delta.newRequest &&  delta.newRequest.name;
                            delta.oldActivation = oldName && modals[oldName];
                            delta.newActivation = newName && modals[newName];

                            if(newStackLength > oldStackLength)
                                delta.change = PUSH;
                            if(newStackLength < oldStackLength)
                                delta.change = POP;
                            if(newStackLength === oldStackLength)
                                delta.change = MOVE;

                            return delta;
                        }
                    });

                // Interface provided to templates and other controllers/directives

                $modal.open = open;
                $modal.close = close;
                $modal.cancel = cancel;
                $modal.register = register;
                $modal.finalize = finalize;

                $modal.confirm = standardModal({
                    templateUrl: 'components/modal/templates/confirm.html',
                    params: {
                        ok: 'modal.confirm.ok',
                        cancel: 'modal.confirm.cancel'
                    }
                });

                $modal.spinner = standardModal({
                    templateUrl: 'components/modal/templates/spinner.html',
                    params: {
                    }
                });

                $modal.alert = standardModal({
                    templateUrl: 'components/modal/templates/alert.html',
                    params: {
                        ok: 'modal.alert.ok'
                    }
                });

                // The modal currently open or requested to open.
                function current () {
                    return $scope.stack.length && $scope.stack[$scope.stack.length - 1] || null;
                }

                // Request a modal be opened.
                function request (name, options, deferred) {
                    $scope.stack.push({name: name, options: options, deferred: deferred});
                }

                // Close the current modal.
                function close ( value ) {
                    var activation = $scope.stack.pop(),
                        deferred = activation.deferred;

                    if ( deferred ) {
                        deferred.resolve( value );
                    }
                }

                // Cancel the current modal.
                function cancel ( reason ) {
                    var activation = $scope.stack.pop(),
                        deferred = activation.deferred;

                    if ( deferred ) {
                        deferred.reject( reason );
                    }
                }

                // Register a modal with the context (allowing reuse).
                function register (name, element, linkFn) {
                    name = name || 0;
                    modals[name] = {element: element, linkFn: linkFn};
                }

                // Open the modal, passing scope parameter bindings.
                //   open( options )
                //   open( url, paramsOrScope [,options] )
                function open (urlOrOptions, paramsOrScope, moreOptions) {
                    var options = angular.isString( urlOrOptions ) ?
                            { templateUrl: urlOrOptions, params: paramsOrScope } : urlOrOptions,
                        passScope = paramsOrScope && typeof paramsOrScope.$new === 'function';

                    options = options || {modal: 0};

                    if (passScope) {
                        options.params = {};
                        options.scope = paramsOrScope;
                    }

                    if (moreOptions) {
                        options = angular.extend( {}, options, moreOptions );
                    }

                    return load(options);
                }

                // Load the modal template, or find it if already loaded, and request it be opened.
                function load (options) {
                    var url = options.templateUrl,
                        template = url || options.template,
                        name = options.modal || url || 0,
                        existing = modals[name],
                        deferred = $q.defer();

                    function buildModal(html) {
                        var template = angular.element(html);

                        $element.append( template );
                        $modal.register( name, template, $compile(template) );
                        request(name, options, deferred);
                    }

                    if ( existing ) {
                        request(name, options, deferred);
                    } else if ( url ) {
                        // otherwise, load and compile it asynchronously
                        $templateRequest(url)
                            .then(buildModal)
                        .catch( function(reason) {
                            $log.error('Failed to load template: ' + url + ' [' + reason + ']');
                        });
                    } else if(template) {
                        buildModal(template);
                    }
                    else {
                        $log.error('No such template: ' + name);
                    }

                    return deferred.promise;
                }

                // Bind parameters to a modal element's scope and display it.
                function activate (element, linkFn, options) {
                    if( !element ) return;
                    var params = options.params,
                        scope = linkFn ? (options.scope || $scope).$new() : element.scope();

                    angular.forEach( params || {}, function (value, key) {
                        scope[key] = value;
                    });

                    if( linkFn ) {
                        scope.$modalOptions = options;
                        linkFn(scope);
                    } else {
                        finalize( element, options );
                    }
                }

                // called by modal's postlink to finish opening the modal
                function finalize (element, options) {
                    invoke( options.onReady );
                    show( element );
                }

                // Hide the modal and clean up the bindings.
                function deactivate (element, options) {
                    if( !element ) return;
                    var scope = element.scope(),
                        params = options.params;

                    $animate.removeClass(element, activeClass)
                    .then( function () {
                        // wait until animation finishes to remove parameters
                        angular.forEach( params || {}, function (value, key) {
                            delete scope[key];
                        });
                    });

                }

                function show(element) {
                    if( !element ) return;
                    $animate.addClass( element, activeClass );
                }

                function hide(element) {
                    if( !element ) return;
                    $animate.removeClass( element, activeClass );
                }

                function invoke( fn ) {
                    if ( fn ) {
                        fn.call( $modal );
                    }
                }

                function standardModal( defaultOptions ) {
                    return function ( messageOrParams, optionalOptions ) {
                        var params = angular.isObject(messageOrParams) ?
                                messageOrParams : { message: messageOrParams },
                            options = angular.extend( {}, defaultOptions, optionalOptions || {} );

                        options.params = angular.extend( {}, defaultOptions.params, params );

                        return $modal.open( options );
                    }
                }
            }

            function postLink(scope, element) {
                element.addClass('modal-context');
            }
        }]);


    module.directive('modal',
        function () {
            return {
                restrict: 'AE',
                require: '^modalContext',
                scope: false, // an inherited scope is constructed by load()
                transclude: true,
                replace: true,
                link: postLink,
                templateUrl: 'components/modal/templates/modal.html'
            };

            function postLink( scope, element, attrs, $modal ) {
                var name = attrs['modal'],
                    options = scope.$modalOptions;

                if( name ) {
                    $modal.register( name, element );
                }

                if( options ) {
                    // the modal is being linked as part of an activation
                    $modal.finalize( element, options );
                }
            }

            // TODO: listeners for closing the modal on click-away, (ESC) keypress

        });

})( angular.module('com.vmware.workspace.components.modal', ['com.vmware.workspace.services.localization']));

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

'use strict';

(function (module) {

    module.directive('rating', function () {
        return {
            restrict: 'A',
            scope: { rating: "=" },
            controller: controller,
            controllerAs: '$rating',
            bindAsController: true,
            replace: true,
            templateUrl: 'components/rating/templates/rating.html'
        }
    });

    function controller ($scope) {
        var $rating = this;

        $rating.values = [1, 2, 3, 4, 5];
    }

})( angular.module("com.vmware.workspace.components.rating", []) );

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    module.directive('spinner', [ function () {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            templateUrl: 'components/spinner/templates/spinner.svg',
            templateNamespace: 'svg'
        };
    }]);

})( angular.module('com.vmware.workspace.components.spinner', []));

// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {

    // String used to prefix all SVG <symbol> #ids
    var symbolPrefix = 'svg-symbol-';

    // SVG <defs> element where dynamically loaded symbols are injected
    var svgDefinitions;

    // SVGs that have been loaded or requested to be loaded
    var svgRequested = {};

    // Template for creating SVG definitions block
    var svgDefsTemplate = '<svg style="display:none"><defs></defs></svg>';

    module.directive('symbol', ['$compile', '$templateRequest', '$log', function ( $compile, $templateRequest, $log ) {
        return {
            restrict: 'A',
            scope: {},
            controller: controller,
            controllerAs: '$symbol',
            bindAsController: true,
            link: postLink,
            replace: true,
            template: '<svg class="symbol"><use xlink:href="{{$symbol.href}}" /></svg>',
            templateNamespace: 'svg'
        };

        function controller ($scope) {
            $symbol = this;

            $symbol.loadTemplate = loadTemplate;

            function loadTemplate( url, element ) {
                var id = generateSymbolId( url ),
                    loaded = svgRequested[id] || document.getElementById( id );

                $symbol.href = '#' + id;

                if ( url && !loaded ) {
                    // load and compile it asynchronously
                    svgRequested[id] = true;
                    $templateRequest( url )
                    .then( function( svg ) {
                        var el = angular.element(svg)[0],
                            ns = el.namespaceURI,
                            children = Array.prototype.slice.call(el.children),
                            viewBox = el.getAttribute('viewBox'),
                            symbol = document.createElementNS(ns, 'symbol');

                        symbol.id = id;
                        symbol.setAttribute('viewBox', viewBox);
                        _.forEach(children, function (child) {
                            symbol.appendChild(child);
                        });

                        injectSymbol(symbol);
                    })
                    .catch( function(reason) {
                        $log.error('Failed to load template: ' + url + ' [' + reason + ']');
                    });
                }
            }
        }

        function postLink ( scope, element, attrs, $symbol ) {
            var url = attrs.symbol;

            $symbol.loadTemplate( url, element );
        }

        function generateSymbolId ( url ) {
            var path = url.split('/'),
                last = path.pop(),
                name = last.replace(/[^a-zA-Z0-9-].*$/, '');

            return symbolPrefix + name;
        }

        function injectSymbol ( symbol ) {
            var defs = svgDefinitions || createDefinitionsElement();

            defs.appendChild(symbol);
        }

        function createDefinitionsElement () {
            var body = document.body,
                svg = angular.element(svgDefsTemplate)[0];

            svgDefinitions = svg.children[0];
            body.appendChild(svg);

            return svgDefinitions;
        }
    }]);

})( angular.module('com.vmware.workspace.components.symbol', []));

// Project Horizon
// (c) 2013-2014 VMware, Inc. All rights reserved.
// VMware Confidential.

(function (module) {
    'use strict';
    module.directive('tabs', [ function () {
        return {
            restrict: 'AE',
            scope: true,
            templateUrl: 'components/tabs/templates/tabs.html',
            replace: true,
            link: function(scope,el){
                scope.$watchCollection("routes",function(newRoutes){
                    if(!newRoutes ||  newRoutes.length === 0){
                        el.addClass("ng-hide");
                    }else {
                        el.removeClass("ng-hide");
                    }
                }) ;
            }
        };
    }]);
})( angular.module("com.vmware.workspace.components.tabs", []) );

// (c) 2014 VMware, Inc.  All rights reserved.
(function (module) {
    'use strict'
    module.provider('Localization', function localization() {
        var l10nMap = {};
        this.setL10nMap = function (localeMap) {
            l10nMap = localeMap;
        }

        this.$get = function Localization() {

            var localize = {
                getLocalizedString: function (i18nKey, params) {
                    var result = l10nMap[i18nKey] || i18nKey;
                    // Inject parameters into i18nString
                    if (result != i18nKey && params && params.length > 0) {
                        for (var index = 0; index < params.length; index++) {
                            var target = '{' + (index) + '}';
                            result = result.replace(target, params[index]);
                        }
                    }
                    return result;
                }
            };
            return localize;
        };
    });


    module.filter('i18n', ['Localization', function (Localization) {
        return function (key) {
            // Optional parameters passed into the filter are present in the arguments
            var params = [].splice.call(arguments, 1, arguments.length - 1);
            // Get the translated string for key and optional parameters
            return Localization.getLocalizedString(key, params);
        };
    }]);

    //Directive to place HTML as localized strings parameter. Work for one parameter only for now.
    //Usage: <span i18n="messageKey"><input type=text/ ng-model="controller.inputValueWithinText"></span>
    module.directive('i18n',['Localization', function(Localization){
        return {
            restrict: 'AE',
            compile: function(element, attributes){
                var splitedText = Localization.getLocalizedString(attributes.i18n, []).split("{0}");
                if (splitedText.length > 0){
                    element.prepend(splitedText[0]);
                    if (splitedText.length > 1){
                        element.append(splitedText[1]);
                    }
                }
            }
        };
    }]);

})(angular.module('com.vmware.workspace.services.localization', []));
