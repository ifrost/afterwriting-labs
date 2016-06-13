define(function(require) {
    
    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/settings.hbs'),
        data = require('modules/data'),
        layout = require('plugins/layout'),
        open = require('plugins/open');

    var plugin = Plugin.create('settings', 'setup', template);

    plugin.get_config = function() {
        return data.config;
    };

    plugin.save = function() {
        data.save_config();
        data.script(data.script());
    };

    plugin.get_default_config = function() {
        return data.default_config;
    };

    plugin.windup = function() {
        if (data.config.load_last_opened) {
            open.open_last_used(true);
            layout.show_main();
        }
    };

    return plugin;
});