define(function (require) {
	var template = require('text!templates_raw/plugins/settings.hbs'),
      pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		layout = require('utils/layout'),
		open = require('plugins/open');

	var plugin = pm.create_plugin('settings', 'setup', template);

	plugin.get_config = function () {
		return data.config;
	};

	plugin.save = function () {
		data.save_config();
		data.script(data.script());
	};

	plugin.get_default_config = function () {
		return data.default_config;
	};

	plugin.windup = function () {
		if (data.config.load_last_opened) {
			open.open_last_used(true);
			layout.show_main();
		}
	};

	return plugin;
});