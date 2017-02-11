define(function(require) {

    var $ = require('jquery'),
        p = require('protoplast');

    /**
     * Translates DOM element into meaningful UI descriptions.
     * 
     * Selectors are prefixed with "$"
     */
    var DomHelper = p.extend({

        $background: '#back',

        $content: '.content',

        $create_new: '[open-action=new]',

        $open_local: '[open-action=open]',

        $open_dropbox: '[open-action=dropbox]',

        $open_googledrive: '[open-action=googledrive]',
        
        $open_sample: function(name) {
            return '[open-action=sample][value="' + name + '"]';
        },

        $open_last_used: '[open-action=last]',

        open_last_used_title: function() {
            return $(this.$open_last_used).text();
        },

        $dialog_message: '.jqimessage',

        $form_dialog: 'form.jqiform',

        dialog_message: function() {
            return $(this.$dialog_message).text();
        },

        $dialog_input: '.jqiform .text_input',

        dialog_input: function() {
            return $(this.$dialog_input).prop('value');
        },
        
        $save_fountain_locally: function(plugin) {
            return '[plugin=' + plugin + '] [action=save-fountain]';
        },

        $save_fountain_dropbox: function(plugin) {
            return '[plugin=' + plugin + '] [action=save-dropbox-fountain]';
        },

        $save_fountain_google_drive: function(plugin) {
            return '[plugin=' + plugin + '] [action=save-gd-fountain]';
        },

        $save_pdf_locally: function(plugin) {
            return '[plugin=' + plugin + '] [action=save-pdf]';
        },

        $save_pdf_dropbox: function(plugin) {
            return '[plugin=' + plugin + '] [action=save-dropbox-pdf]';
        },

        $save_pdf_google_drive: function(plugin) {
            return '[plugin=' + plugin + '] [action=save-gd-pdf]'
        },

        $close_popup: '[name=jqi_state0_buttonCancel]',

        $confirm_popup: '[name=jqi_state0_buttonOpen]',

        $sync_button: '.auto-reload-icon',

        $auto_save_button: '.auto-save-icon',

        $night_mode: 'input[data-id="night_mode"]',

        $close_icon: '.close-content',
        
        popup_with_message: function(message) {
            return $('.jqimessage p:contains(' + message + ')');
        },
        
        file_list_popup_with_node: function(name) {
            return $('.jstree a:contains(' + name + ')');
        },

        $info_icon: function(section_name) {
            return '.info-icon[section="' + section_name + '"]';
        },
        
        $expand_icon: '.expand',
        
        $switch_link: function(section_name) {
            return '.switch[section="' + section_name + '"]';
        },

        $stats: {
            value: {
                $page_balance: {
                    $page: '#stats-page-balance svg'
                }
            }
        },
        
        $info: {
            value: {
                $download_link: '#download-link'
            }
        },

        $button: function(label) {
            return $('button:contains("' + label + '")');
        },

        $plugin: function(name) {
            return '.menu-item.' + name;
        },

        $toolbar: function(name) {
            return '.tool.' + name;
        },

        $file_input: '#open-file',

        $file_link: function(file) {
            return "[aria-labelledby='/" + file + "_anchor'] a";
        },

        get_active_plugin: function() {
            return $('.plugin-content.active').attr('plugin');
        },

        jstree_visible: function() {
            return !!$('.jstree-anchor').attr('id');
        },

        is_visible: function(selector) {
            return $(selector).is(':visible');
        },
        
        editor_content: function() {
            return $('.CodeMirror').get(0).CodeMirror.getValue();
        },

        is_night_mode: function() {
           return $('body').hasClass('night-mode');
        },
        
        clean_href: function(selector) {
            $(selector).attr('href', 'javascript:void(0)');
        },

        content_size: function() {
            return {
                width: $(this.$content).width(),
                height: $(this.$content).height()
            }
        },

        window_size: function() {
            return {
                width: $(window).width(),
                height: $(window).height()
            }
        }

    });

    return DomHelper;
});