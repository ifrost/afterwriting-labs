/* global define */
define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		typewriter = require('utils/typewriter'),
		data = require('modules/data');
	
	var plugin = pm.create_plugin('preview', 'view');
	
	plugin.get_pdf = function() {
		return typewriter.get_pdf(data.parsed, data.config);
	};
	
	plugin.activate = function() {
		var pdf = plugin.get_pdf();
		plugin.data.pdf = pdf;
	};
		
	return plugin;
});