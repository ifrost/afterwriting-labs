define(['logger', 'utils/common', 'plugins/open', 'core/module'], function(logger, common, open, Module) {
    
    var Test = Module.extend({

        name: 'test',

        layout: {
            inject: 'layout',
        },

        prepare: function() {
            // set up logger
            logger.useDefaults();
            logger.setLevel(logger.DEBUG);
            logger.filter = null;

            common.data.static_path = '';
        },

        windup: function() {
            var footer = '<span class="version">tester</span>';
            this.layout.set_footer(footer);

            var DEV_PLUGIN = require('plugins/dev/fquerysandbox');

            if (DEV_PLUGIN) {
                open.open_sample('printing_trouble');

                this.layout.switch_to(DEV_PLUGIN);

                this.layout.show_main();
                this.layout.open_content();
                this.layout.switch_to_plugin(DEV_PLUGIN.name);
            }

        }
    });

    return Test.create();

});