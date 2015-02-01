define(function(require){
	var pm = require('utils/pluginmanager'),
		decorator = require('utils/decorator');
	
	var plugin = pm.create_plugin('info', 'info');
	plugin.class = "active";
	
	plugin.download_clicked = decorator.signal();
	
	return plugin;
});