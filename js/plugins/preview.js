define(function (require) {
	
	var template = require('text!templates/plugins/preview.hbs'),
      pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		off = require('off'),
		pdfjsviewer = require('utils/pdfjsviewer'),
		pdfmaker = require('utils/pdfmaker');
	
	var plugin = pm.create_plugin('preview', 'view', template);
	
	plugin.get_pdf = function(callback) {
		pdfmaker.get_pdf(callback);
	};

	plugin.refresh = off.signal();
	
	plugin.activate = function() {
		editor.synced.add(plugin.refresh);
		plugin.refresh();
	};
	
	plugin.deactivate = function() {
		editor.synced.remove(plugin.refresh);
	};
	
	return plugin;
});