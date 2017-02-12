define(function(require) {

    var BaseUserHelper = require('acceptance/helper/user/base-user-helper');

    var ThemeUserHelper = BaseUserHelper.extend({

        /**
         * Click on the background to close the current content
         */
        back_to_main: function() {
            this.click(this.dom.theme.$background);
        },

        /**
         * Open plugin with given name
         * @param {string} name
         */
        open_plugin: function(name) {
            this.click(this.dom.theme.$plugin_menu_item(name));
        },

        /**
         * Open plugin with given name using top menu
         * @param {string} name
         */
        open_plugin_from_toolbar: function(name) {
            this.click(this.dom.theme.$toolbar(name));
        },

        /**
         * Close current content to show the main menu
         */
        close_content: function() {
            this.click(this.dom.theme.$close_icon);
        },

        /**
         * Click info icon (question mark) to expand section info
         * @param {string} section_name
         */
        click_info_icon: function(section_name) {
            this.click(this.dom.theme.$info_icon(section_name));
        },

        /**
         * Click expand icon to switch between narrow/expanded content
         */
        click_expand_icon: function() {
            this.click(this.dom.theme.$expand_icon);
        },

        /**
         * Click on a link to switch to given plugin
         * @param {string} plugin_name
         */
        click_switch_link: function(plugin_name) {
            this.click(this.dom.theme.$switch_link(plugin_name));
        }

    });

    return ThemeUserHelper;
});