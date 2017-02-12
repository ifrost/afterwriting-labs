define(function(require) {

    var BaseUserHelper = require('acceptance/helper/user/base-user-helper');

    var SettingsUserHelper = BaseUserHelper.extend({

        /**
         * Select checkbox for night mode
         */
        select_night_mode: function() {
            this.click(this.dom.settings.$night_mode);
        }
        
    });

    return SettingsUserHelper;
});