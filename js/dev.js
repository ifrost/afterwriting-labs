/* global define, setTimeout */
define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		common = require('utils/common'),
		open = require('plugins/open'),
		layout = require('utils/layout'),
		dev_plugin;
	
	//dev_plugin = require('plugins/plugin');
						 
	
	var module = {};

	module.pre_init = function() {
		common.data.static_path = '';	
	};
	
	module.init = function () {
		if (dev_plugin) {
			open.open_sample('big_fish');

			setTimeout(function () {
				pm.switch_to(dev_plugin);

				layout.show_options();
				layout.open_content();
				layout.switch_to_plugin(dev_plugin.name);
			}, 0);
			
		}
		layout.dev();
	};

	return module;
});