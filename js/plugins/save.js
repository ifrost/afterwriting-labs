/* global define, Blob, window */
define(function (require) {

	var pm = require('utils/pluginmanager'),
		saveAs = require('saveAs'),
		preview = require('plugins/preview'),
		gd = require('utils/googledrive'),
		$ = require('jquery'),
		tree = require('utils/tree'),
		data = require('modules/data');

	var plugin = pm.create_plugin('save', 'save');

	plugin.save_as_fountain = function () {
		data.parse();
		var blob = new Blob([data.script()], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, get_filename() + '.fountain');
	};

	plugin.save_as_pdf = function () {
		var blob = preview.get_pdf(function (data) {
			saveAs(data.blob, get_filename() + '.pdf');
		});
	};

	plugin.dropbox_fountain = function () {
		data.parse();
		var encoded = window.btoa(data.script());
		var uri = 'data:text/plain;base64,' + encoded;
		Dropbox.save(uri, get_filename() + '.fountain');
	};

	plugin.dropbox_pdf = function () {
		var uri = preview.get_pdf(function (data) {
			Dropbox.save(data.url, get_filename() + '.pdf');
		});
	};

	plugin.google_drive_fountain = function () {
		data.parse();
		google_drive_start();
		var blob = new Blob([data.script()], {
			type: "text/plain;charset=utf-8"
		});
		gd.save(blob, get_filename() + '.fountain', google_drive_saved);
	};

	plugin.google_drive_pdf = function () {
		gd.list(function (root) {
			root = gd.convert_to_jstree(root);
			tree.show({
				data: [root],
				callback: function (selected) {
					google_drive_start();
					var uri = preview.get_pdf(function (data) {
						gd.save(data.blob, get_filename() + '.pdf', google_drive_saved, selected.isRoot ? [] : [selected]);
					});
				}
			});
		}, true);

	};

	function google_drive_start() {
		$.prompt('Please wait', {
			title: 'Saving to Google Drive',
			buttons: []
		});
	}

	function google_drive_saved(data) {
		$.prompt.close();
		$.prompt('Saved as: ' + data.title, {
			title: 'File saved!',
			buttons: {
				'Open in Google Drive': true,
				'Close': false
			},
			submit: function (e, v, f, m) {
				if (v) {
					window.open(data.alternateLink, '_blank');
				}
			}
		});
	}

	plugin.is_dropbox_available = function () {
		return window.Dropbox !== undefined && Dropbox.isBrowserSupported() && window.location.protocol !== 'file:';
	};

	plugin.is_google_drive_available = function () {
		return window.gapi && window.location.protocol !== 'file:';
	};

	function get_filename() {
		var title_token = data.get_title_page_token('title'),
			name = 'screenplay';
		if (title_token) {
			name = title_token.text.replace(/[^a-zA-Z0-9]/g, ' ').split('\n').join(' ').replace(/\s+/g, ' ').trim();
		}
		return name || 'screenplay';
	};

	plugin.get_filename = get_filename;

	return plugin;
});