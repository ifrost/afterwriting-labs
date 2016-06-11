define(function(require){
	var template = require('text!templates/plugins/info.hbs'),
      common = require('utils/common'),
      pm = require('utils/pluginmanager'),
		off = require('off');
	
	var plugin = pm.create_plugin('info', 'info', template);
	plugin.class = "active";
	
	plugin.download_clicked = off.signal();
	
	return plugin;
});