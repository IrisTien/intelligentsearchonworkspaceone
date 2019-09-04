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
