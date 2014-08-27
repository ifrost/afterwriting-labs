define(['core', 'logger', 'utils/data'], function (core, logger, data) {
	var log = logger.get('settings');
	var plugin = core.create_plugin('settings', 'setup');
	
	plugin.init = function() {
		log.info('settings:init');
	};
	
	plugin.activate = function() {
		log.info('settings:activate');
	};
	
	plugin.deactivate = function() {
		log.info('settings:deactivate');
	};
	
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