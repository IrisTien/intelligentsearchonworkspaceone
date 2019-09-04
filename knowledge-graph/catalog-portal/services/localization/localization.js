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
