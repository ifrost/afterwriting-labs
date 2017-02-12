define(function(require) {

    var BaseUserHelper = require('acceptance/helper/user/base-user-helper');

    var PopupUserHelper = BaseUserHelper.extend({

        /**
         * Click on confirm button on the current popup
         */
        confirm_popup: function() {
            this.click(this.dom.popup.$confirm_popup);
        },

        /**
         * Select file with a given file name
         * @param {string} filename
         */
        select_file: function(filename) {
            this.click(this.dom.popup.$file_link(filename));
        },

        /**
         * Click on a button to keep current content after auto-reload is disabled
         */
        sync_keep_content: function() {
            this.click_button('Keep content');
        },

        /**
         * Click on a button to revert editor's content to the one befre auto-reload was enabled
         */
        sync_reload_content_before_sync: function() {
            this.click_button('Load version before sync');
        }
        
    });

    return PopupUserHelper;
});