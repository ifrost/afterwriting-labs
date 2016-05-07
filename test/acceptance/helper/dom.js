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

        $plugin: function(name) {
            return '.menu-item.' + name;
        },

        get_active_plugin: function() {
            return $('.plugin-content.active').attr('plugin');
        },

        jstree_visible: function() {
            return !!$('.jstree-anchor').attr('id');
        },
        
        editor_content: function() {
            return $('.CodeMirror-code pre span').map(function(i, elem){return $(elem).text()}).toArray().join('\n');
        },

    });

    return DomHelper;
});