/* global define */
define(function(require){
	var pm = require('utils/pluginmanager');
	
	var plugin = pm.create_plugin('info', 'info');
	plugin.class = "active";
	
	return plugin;
});