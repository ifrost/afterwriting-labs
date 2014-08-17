define(['core', 'logger'], function (core, logger) {
	var log = logger.get('sample');
	var plugin = core.create_plugin('sample', 'sample');
	
	plugin.init = function() {
		log.info('sample:init');
	};
	
	plugin.activate = function() {
		log.info('sample:activate');
	};
	
	plugin.deactivate = function() {
		log.info('sample:deactivate');
	};
	
	return plugin;
});