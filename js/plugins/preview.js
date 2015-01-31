/* global define */
define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		data = require('modules/data'),
		decorator = require('utils/decorator'),
		pdfmaker = require('utils/pdfmaker');
	
	var plugin = pm.create_plugin('preview', 'view');
	
	plugin.get_pdf = function(callback) {
		pdfmaker.get_pdf(callback);
	};
	
	plugin.refresh = decorator.signal();		
	
	plugin.activate = function() {
		editor.synced.add(plugin.refresh);
		plugin.refresh();
	};
	
	plugin.deactivate = function() {
		editor.synced.remove(plugin.refresh);
	};
	
	return plugin;
});