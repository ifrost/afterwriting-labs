define(function(require) {

    var p = require('p');

    /**
     * Translates DOM element into meaningful UI descriptions
     */
    var DomHelper = p.extend({

        $background: '#back',

        $open_dropbox: '[open-action=dropbox]',

        $close_popup: '[name=jqi_state0_buttonCancel]',

        $confirm_popup: '[name=jqi_state0_buttonOpen]',

        $sync_button: '.auto-reload-icon',

        $auto_save_button: '.auto-save-icon',

        $button: function(label) {
            return $('button:contains("' + label + '")');
        },

        $plugin: function(name) {
            return '.menu-item.' + name;
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
        }

    });

    return DomHelper;
});