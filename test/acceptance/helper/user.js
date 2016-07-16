define(function(require) {

    var $ = require('jquery'),
        p = require('protoplast');

    /**
     * Performs user actions
     */
    var User = p.extend({

        $create: function(browser, dom) {
            this.browser = browser;
            this.dom = dom;
        },

        click: function(selector) {
            $(selector).click();
            this.browser.tick(20000);
        },

        back_to_main: function() {
            this.click(this.dom.$background);
        },

        open_plugin: function(name) {
            this.click(this.dom.$plugin(name));
        },

        open_from_dropbox: function() {
            this.click(this.dom.$open_dropbox);
        },

        close_popup: function() {
            this.click(this.dom.$close_popup);
        },

        confirm_popup: function() {
            this.click(this.dom.$confirm_popup);
        },

        select_file: function(file) {
            this.click(this.dom.$file_link(file));
        },

        click_button: function(label) {
            this.click(this.dom.$button(label));
        },

        turn_sync_on: function() {
            this.click(this.dom.$sync_button);
            this.click_button('OK');
        },

        turn_sync_off: function() {
            this.click(this.dom.$sync_button);
        },

        turn_auto_save_on: function() {
            this.click(this.dom.$auto_save_button);
        },

        sync_keep_content: function() {
            this.click_button('Keep content');
        },

        sync_reload_content_before_sync: function() {
            this.click_button('Load version before sync');
        },

        set_editor_content: function(content) {
            $('.CodeMirror').get(0).CodeMirror.setValue(content);
        },

        select_night_mode: function() {
            this.click(this.dom.$night_mode);
        }

    });

    return User;

});