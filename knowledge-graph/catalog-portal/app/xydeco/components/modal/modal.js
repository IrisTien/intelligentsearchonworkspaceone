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
