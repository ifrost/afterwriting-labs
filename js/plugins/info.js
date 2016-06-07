define(function(require){
	var template = require('text!templates_raw/plugins/info.hbs'),
      common = require('utils/common'),
      pm = require('utils/pluginmanager'),
		decorator = require('utils/decorator');
	
	var plugin = pm.create_plugin('info', 'info', template);
	plugin.class = "active";
	
	plugin.download_clicked = decorator.signal();
	
	return plugin;
});