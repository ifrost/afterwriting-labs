/* global define, Blob, window */
define(function (require) {
	
	var pm = require('utils/pluginmanager'), 
		saveAs = require('saveAs'), 
		preview = require('plugins/preview'),
		data = require('modules/data');
	
	var plugin = pm.create_plugin('save', 'save');

	plugin.data = {
		filename: "screenplay"
	};

	plugin.save_as_fountain = function () {
		var blob = new Blob([data.script()], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, plugin.data.filename + '.fountain');
	};

	plugin.save_as_pdf = function () {
		preview.get_pdf().output('save', plugin.data.filename + '.pdf');
	};

	plugin.dropbox_fountain = function () {
		var encoded = window.btoa(data.script());
		var uri = 'data:text/plain;base64,' + encoded;
		Dropbox.save(uri, plugin.data.filename + '.fountain');
	};

	plugin.dropbox_pdf = function () {
		var uri = preview.get_pdf().output("datauristring");
		Dropbox.save(uri, plugin.data.filename + '.pdf');
	};

	plugin.is_dropbox_available = function () {
		return window.Dropbox !== undefined && Dropbox.isBrowserSupported() && window.location.protocol !== 'file:';
	};
	
	plugin.activate = function() {
		plugin.data.filename = 'screenplay';
		var title_token = data.get_title_page_token('title');
		if (title_token) {
			plugin.data.filename = title_token.text.replace(/[^a-zA-Z0-9]/g,' ').split('\n').join(' ').replace(/\s+/g, ' ').trim();
		}
	};

	return plugin;
});