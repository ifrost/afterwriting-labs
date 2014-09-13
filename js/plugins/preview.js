/* global define */
define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		pdfmaker = require('utils/pdfmaker');
	
	var plugin = pm.create_plugin('preview', 'view');
	
	plugin.get_pdf = function(callback) {
		pdfmaker.get_pdf(callback);
	};
	
	return plugin;
});