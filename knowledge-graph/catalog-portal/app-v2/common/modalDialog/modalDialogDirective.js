// Project Horizon
// (c) 2013-2015 VMware, Inc. All rights reserved.
// VMware Confidential.

(function(module) {
    var activeClass = 'is-active';

    module.directive('modalDialog', [
        '$compile', '$templateRequest', '$log', '$animate', '$timeout', '$q', 'UtilService',
        function($compile, $templateRequest, $log, $animate, $timeout, $q, UtilService) {
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
                $scope.stack = []; // pending activation requests: [{name: '...', options: {}], ...]

                $scope.$watchCollection('stack',
                    function(newStack, oldStack) {
                        var delta = findChange(newStack, oldStack),
                            newActivation = delta.newActivation,
                            newRequest = delta.newRequest,
                            oldActivation = delta.oldActivation,
                            oldRequest = delta.oldRequest;

                        switch (delta.change) {
                            case PUSH:
                                if (oldActivation) {
                                    hide(oldActivation.element);
                                }
                                if (newActivation && newRequest) {
                                    activate(newActivation.element, newActivation.linkFn, newRequest.options);
                                }
                                break;
                            case POP:
                                if (oldActivation && oldRequest) {
                                    deactivate(oldActivation.element, oldRequest.options);
                                }
                                if (newActivation) {
                                    show(newActivation.element);
                                }
                                break;
                            default:
                                if (oldActivation && oldRequest) {
                                    deactivate(oldActivation.element, oldRequest.options);
                                }
                                if (newActivation && newRequest) {
                                    activate(newActivation.element, newActivation.linkFn, newRequest.options);
                                }
                        }

                        function findChange(newStack, oldStack) {
                            var delta = {},
                                oldStackLength = oldStack && oldStack.length ? oldStack.length : 0,
                                newStackLength = newStack && newStack.length ? newStack.length : 0,
                                oldName,
                                newName;

                            delta.oldRequest = oldStackLength ? oldStack[oldStackLength - 1] : undefined;
                            delta.newRequest = newStackLength ? newStack[newStackLength - 1] : undefined;
                            oldName = delta.oldRequest && delta.oldRequest.name;
                            newName = delta.newRequest && delta.newRequest.name;
                            delta.oldActivation = oldName && modals[oldName];
                            delta.newActivation = newName && modals[newName];

                            if (newStackLength > oldStackLength) {
                                delta.change = PUSH;
                            } else if (newStackLength < oldStackLength) {
                                delta.change = POP;
                            } else if (newStackLength === oldStackLength) {
                                delta.change = MOVE;
                            }

                            return delta;
                        }
                    });

                // Interface provided to templates and other controllers/directives

                $modal.open = open;
                $modal.close = close;
                $modal.cancel = cancel;
                $modal.register = register;
                $modal.finalize = finalize;

                var isHubApp = UtilService.isHub();

                $modal.confirm = standardModal({
                    templateUrl: isHubApp ? 'app-v2/common/modalDialog/hub-templates/confirm.html' : 'app-v2/common/modalDialog/templates/confirm.html',
                    params: {
                        ok: 'modal.confirm.ok',
                        cancel: 'modal.confirm.cancel'
                    }
                });

                $modal.spinner = standardModal({
                    templateUrl: 'app-v2/common/modalDialog/templates/spinner.html',
                    params: {
                    }
                });

                $modal.alert = standardModal({
                    templateUrl: isHubApp ? 'app-v2/common/modalDialog/hub-templates/alert.html' : 'app-v2/common/modalDialog/templates/alert.html',
                    params: {
                        ok: 'modal.alert.ok'
                    }
                });

                // The modal currently open or requested to open.
                function current() {
                    return $scope.stack.length && $scope.stack[$scope.stack.length - 1] || null;
                }

                // Request a modal be opened.
                function request(name, options, deferred) {
                    $scope.stack.push({name: name, options: options, deferred: deferred});
                }

                // Close the current modal.
                function close(value) {
                    var activation = $scope.stack.pop(),
                        deferred;

                    if (activation) {
                        deferred = activation.deferred;
                    }

                    if (deferred) {
                        deferred.resolve(value);
                    }
                }

                // Cancel the current modal.
                function cancel(reason) {
                    var activation = $scope.stack.pop(),
                        deferred = activation.deferred;

                    if (deferred) {
                        deferred.reject(reason);
                    }
                }

                // Register a modal with the context (allowing reuse).
                function register(name, element, linkFn) {
                    name = name || 0;
                    modals[name] = {element: element, linkFn: linkFn};
                }

                // Open the modal, passing scope parameter bindings.
                //   open( options )
                //   open( url, paramsOrScope [,options] )
                function open(urlOrOptions, paramsOrScope, moreOptions) {
                    var options = angular.isString(urlOrOptions) ?
                        {templateUrl: urlOrOptions, params: paramsOrScope} : urlOrOptions,
                        passScope = paramsOrScope && typeof paramsOrScope.$new === 'function';

                    options = options || {modal: 0};

                    if (passScope) {
                        options.params = {};
                        options.scope = paramsOrScope;
                    }

                    if (moreOptions) {
                        options = angular.extend({}, options, moreOptions);
                    }

                    return load(options);
                }

                // Load the modal template, or find it if already loaded, and request it be opened.
                function load(options) {
                    var url = options.templateUrl,
                        template = url || options.template,
                        name = options.modal || url || 0,
                        existing = modals[name],
                        deferred = $q.defer();

                    function buildModal(html) {
                        var template = angular.element(html);
                        //Do not clear out the current modal if new modal is going to be opened on top of current one.
                        if (options && options.params && !options.params.modalOverAModal) {
                            $element.find('div.modal-container').remove();
                            //this will clear all the modal reference
                            $scope.stack.pop();
                        }
                        //if its used in html tag, append to body
                        if ($element.is('html')) {
                            $element.find('body').append(template);
                        } else {
                            $element.append(template);
                        }
                        $modal.register(name, template, $compile(template));
                        request(name, options, deferred);
                    }

                    if (url) {
                        // otherwise, load and compile it asynchronously
                        $templateRequest(url)
                            .then(buildModal)
                            .catch(function(reason) {
                                $log.error('Failed to load template: ' + url + ' [' + reason + ']');
                            });
                    } else if (template) {
                        buildModal(template);
                    } else {
                        $log.error('No such template: ' + name);
                    }

                    return deferred.promise;
                }

                // Bind parameters to a modal element's scope and display it.
                function activate(element, linkFn, options) {
                    if (!element) {
                        return;
                    }
                    var params = options.params,
                        scope = linkFn ? (options.scope || $scope).$new() : element.scope();

                    angular.forEach(params || {}, function(value, key) {
                        scope[key] = value;
                    });

                    if (linkFn) {
                        scope.$modalOptions = options;
                        linkFn(scope);
                    } else {
                        finalize(element, options);
                    }
                }

                // called by modal's postlink to finish opening the modal
                function finalize(element, options) {
                    invoke(options.onReady);
                    show(element);
                }

                // Hide the modal and clean up the bindings.
                function deactivate(element, options) {
                    if (!element) {
                        return;
                    }
                    var scope = element.scope(),
                        params = options.params;

                    $animate.removeClass(element, activeClass)
                        .then(function() {
                            // wait until animation finishes to remove parameters
                            angular.forEach(params || {}, function(value, key) {
                                delete scope[key];
                            });
                        });
                }

                function show(element) {
                    if (!element) {
                        return;
                    }
                    // in order for modal to animate in (either fadein or slide) in the active class needs to be added after the
                    // modal is appended to the DOM
                    $timeout(function() {
                        $animate.addClass(element, activeClass);
                    }, 10);
                }

                function hide(element) {
                    if (!element) {
                        return;
                    }
                    $animate.removeClass(element, activeClass);
                }

                function invoke(fn) {
                    if (fn) {
                        fn.call($modal);
                    }
                }

                function standardModal(defaultOptions) {
                    return function(messageOrParams, optionalOptions) {
                        var params = angular.isObject(messageOrParams) ?
                            messageOrParams : {message: messageOrParams},
                            options = angular.extend({}, defaultOptions, optionalOptions || {});

                        options.params = angular.extend({}, defaultOptions.params, params);

                        return $modal.open(options);
                    };
                }
            }

            function postLink(scope, element) {
                element.addClass('modal-dialog');
            }
        }]);

    module.directive('modalNew',
        function() {
            return {
                restrict: 'AE',
                require: '^modalDialog',
                scope: false, // an inherited scope is constructed by load()
                transclude: true,
                replace: true,
                link: postLink,
                templateUrl: 'app-v2/common/modalDialog/templates/modal.html'
            };

            function postLink(scope, element, attrs, $modal) {
                var name = attrs['modal-new'],
                    options = scope.$modalOptions;

                if (name) {
                    $modal.register(name, element);
                }

                if (options) {
                    // the modal is being linked as part of an activation
                    $modal.finalize(element, options);
                }

                element.bind("click", function(e) {
                    e.stopPropagation();
                });
            }

            // TODO: listeners for closing the modal on click-away, (ESC) keypress
        });
})(angular.module('com.vmware.greenbox.appCenter'));
