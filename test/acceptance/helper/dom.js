define(function(require) {

    var p = require('p');

    /**
     * Translates DOM element into meaningful UI descriptions
     */
    var DomHelper = p.extend({

        $background: '#back',

        $create_new: '[open-action=new]',

        $open_dropbox: '[open-action=dropbox]',

        $close_popup: '[name=jqi_state0_buttonCancel]',

        $confirm_popup: '[name=jqi_state0_buttonOpen]',

        $sync_button: '.auto-reload-icon',

        $auto_save_button: '.auto-save-icon',

        $night_mode: 'input[data-id="night_mode"]',

        $close_icon: '.close-content',

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

        $file_link: function(file) {
            return $(document.getElementById('/' + file + '_anchor'));
        },

        get_active_plugin: function() {
            return $('.plugin-content.active').attr('plugin');
        },

        jstree_visible: function() {
            return !!$('.jstree-anchor').attr('id');
        },
        
        editor_content: function() {
            return $('.CodeMirror').get(0).CodeMirror.getValue();
        },

        is_night_mode: function() {
           return $('body').hasClass('night-mode');
        },
        
        clean_href: function(selector) {
            $(selector).attr('href', 'javascript:void(0)');
        }

    });

    return DomHelper;
});