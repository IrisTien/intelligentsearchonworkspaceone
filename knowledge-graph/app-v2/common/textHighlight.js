(function(module) {
    'use strict';

    module.filter('highlight', function($sce) {
        return function(text, userNameSearchQuery) {
            var splitWords = userNameSearchQuery.split(" ");
            _.each(splitWords, function(phrase) {
                if (phrase) {
                    var regex = new RegExp('(\\b' + phrase + ')', 'gi');
                    if (regex.test(phrase)) {
                        text = text.replace(regex, '<em>$1</em>');
                    } else {
                        text = text.replace(phrase, '<em>' + phrase + '</em>');
                    }
                }
            });
            return $sce.trustAsHtml(text);
        };
    });
})(angular.module('com.vmware.greenbox.appCenter'));

