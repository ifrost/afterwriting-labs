/* global define, Blob, window */
define(function (require) {
	
	var core = require('core'), 
		saveAs = require('saveAs'), 
		preview = require('plugins/preview'),
		Dropbox = require('dropbox'), 
		data = require('utils/data');
	
	var plugin = core.create_plugin('save', 'save');

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
		return Dropbox.isBrowserSupported() && window.location.protocol !== 'file:';
	};

	return plugin;
});