define(function(require) {

    var BaseDomHelper = require('acceptance/helper/dom/base-dom-helper');

    var SettingsDomHelper = BaseDomHelper.extend({

        /**
         * Night mode checkbox
         */
        $night_mode: 'input[data-id="night_mode"]'

    });

    return SettingsDomHelper;
});