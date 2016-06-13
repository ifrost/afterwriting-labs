define(function(require) {

    var logger = require('logger'),
        data = require('modules/data'),
        off = require('off'),
        Plugin = require('core/plugin');

    var log = logger.get('pluginmanager');

    var module = {},
        current;

    module.create_plugin = function(name, title, template) {
        return Plugin.create(name, title, template);
    };

    module.switch_to = off(function(plugin) {
        if (plugin === current) {
            module.switch_to.lock = true;
            return;
        }

        log.info('Switching to: ' + plugin.name);

        if (current) {
            current.deactivate();
        }
        current = plugin;

        data.parse();

        current.activate();

        return current;
    });

    module.refresh = function() {
        if (current) {
            current.deactivate();
            current.activate();
        }
    };

    module.get_current = function() {
        return current;
    };

    return module;
});