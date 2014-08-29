/* global define */
define(function (require) {
	
	var core = require('core'),
		typewriter = require('utils/typewriter'),
		data = require('utils/data');
	
	var plugin = core.create_plugin('preview', 'view');
	
	plugin.get_pdf = function() {
		return typewriter.get_pdf(data.parsed, data.config);
	};
	
	plugin.activate = function() {
		var pdf = plugin.get_pdf();
		plugin.data.pdf = pdf;
	};
		
	return plugin;
});