define(['core', 'logger'], function (core, logger) {
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
	
	return plugin;
});