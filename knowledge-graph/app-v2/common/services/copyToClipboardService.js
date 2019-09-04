(function(module) {
    'use strict';
    module.service('CopyToClipboardService', ['$window', '$document', function($window, $document) {
        function createNode(text, context) {
            var node = $document[0].createElement('textarea');
            node.style.position = 'absolute';
            node.style.fontSize = '12pt';
            node.style.border = '0';
            node.style.padding = '0';
            node.style.margin = '0';
            node.style.left = '-10000px';
            node.style.top = ($window.pageYOffset || $document[0].documentElement.scrollTop) + 'px';
            node.textContent = text;
            return node;
        }

        function copyNode(node) {
            try {
                $document[0].body.style.webkitUserSelect = 'initial';
                var selection = $document[0].getSelection();
                selection.removeAllRanges();
                var range = document.createRange();
                range.selectNodeContents(node);
                selection.addRange(range);
                node.select();
                node.setSelectionRange(0, 999999);

                try {
                    if (!$document[0].execCommand('copy')) {
                        return false;
                    }
                } finally {
                    selection.removeAllRanges();
                }
            } finally {
                $document[0].body.style.webkitUserSelect = '';
            }
            return true;
        }

        function copy(text, context) {
            var left = $window.pageXOffset || $document[0].documentElement.scrollLeft;
            var top = $window.pageYOffset || $document[0].documentElement.scrollTop;
            var node = createNode(text, context);
            $document[0].body.appendChild(node);
            var copied = copyNode(node);

            $window.scrollTo(left, top);
            $document[0].body.removeChild(node);
            return copied;
        }

        return {
            copy: copy
        };
    }]);
})(angular.module('com.vmware.greenbox.appCenter'));
