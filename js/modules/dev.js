define(['logger', 'utils/common', 'plugins/open', 'core/module'], function(logger, common, open, Module) {

    var DEV_PLUGIN;

    var Dev = Module.extend({

        name: 'dev',

        layout: {
            inject: 'layout'
        },

        prepare: function() {
            // set up logger
            logger.useDefaults();
            logger.setLevel(logger.DEBUG);
            logger.filter = null;

            common.data.static_path = '';
        },

        windup: function() {
            var footer = common.data.footer;
            footer += '<br /><span class="version">development version</span>';
            this.layout.set_footer(footer);

            //DEV_PLUGIN = require('plugins/editor');

            if (DEV_PLUGIN) {
                open.open_sample('big_fish');

                this.layout.switch_to(DEV_PLUGIN);

                this.layout.show_main();
                this.layout.open_content();
                this.layout.switch_to_plugin(DEV_PLUGIN.name);
            }
        }
    });

    return Dev.create();

});