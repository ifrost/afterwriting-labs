define(function (require) {
	var pm = require('utils/pluginmanager'),
		logger = require('logger');
	
	var log = logger.get('sample');
	var plugin = pm.create_plugin('sample', 'sample');
	
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