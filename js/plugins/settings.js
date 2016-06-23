define(function(require) {

    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/settings.hbs');

    var Settings = Plugin.extend({

        name: 'settings',

        title: 'setup',

        template: template,

        data: {
            inject: 'data'
        },

        open: {
            inject: 'open'
        }                 ,

        layout: {
            inject: 'layout'
        },

        get_config: function() {
            return this.data.config;
        },

        save: function() {
            this.data.save_config();
            this.data.script(this.data.script());
        },

        get_default_config: function() {
            return this.data.default_config;
        },

        windup: function() {
            if (this.data.config.load_last_opened) {
                this.open.open_last_used(true);
                this.layout.show_main();
            }
        }

    });

    return Settings.create();
});