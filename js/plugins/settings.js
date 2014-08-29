/* global define */
define(function (require) {
	var pm = require('utils/pluginmanager'),
		data = require('utils/data');
	
	var plugin = pm.create_plugin('settings', 'setup');
	
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
	
	plugin.reset = function() {
		data.reset_config();
		data.script(data.script());
	};
	
	return plugin;
});