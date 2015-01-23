/* global define, Blob, window */
define(function (require) {

	var pm = require('utils/pluginmanager'),
		saveAs = require('saveAs'),
		preview = require('plugins/preview'),
		gd = require('utils/googledrive'),
		db = require('utils/dropbox'),
		$ = require('jquery'),
		tree = require('utils/tree'),
		decorator = require('utils/decorator'),
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

	// DROPBOX

	var dropbox_save = function (save_callback) {
		db.list(function (root) {
			root = db.convert_to_jstree(root);
			tree.show({
				data: [root],
				info: 'Select a file to override or choose a folder to save as a new file.',
				callback: function (selected) {
					$.prompt('Please wait');
					save_callback(selected);
				}
			});
		});
	};

	var dropbox_saved = function () {
		$.prompt.close();
		$.prompt('File saved!');
	}

	plugin.dropbox_fountain = function () {
		data.parse();
		dropbox_save(function (selected) {
			var path = selected.data.entry.path,
				blob = new Blob([data.script()], {
					type: "text/plain;charset=utf-8"
				});
			if (selected.data.isFolder) {
				path += '/' + get_filename() + '.fountain';
			}
			db.save(path, blob, dropbox_saved);
		});
	};

	plugin.dropbox_pdf = function () {
		dropbox_save(function (selected) {
			var path = selected.data.entry.path;
			if (selected.data.isFolder) {
				path += '/' + get_filename() + '.pdf';
			}
			data.parse();
			preview.get_pdf(function (data) {
				db.save(path, data.blob, dropbox_saved);
			});
		});
	};

	// GOOGLE DRIVE

	var google_drive_save = function (save_callback) {
		gd.auth(function () {
			gd.list(function (root) {
				root = gd.convert_to_jstree(root);
				tree.show({
					data: [root],
					info: 'Select a file to override or choose a folder to save as a new file.',
					callback: function (selected) {
						$.prompt('Please wait');
						save_callback(selected);
					}
				});
			});
		});
	};

	plugin.google_drive_fountain = function () {
		google_drive_save(function (selected) {
			data.parse();
			var blob = new Blob([data.script()], {
				type: "text/plain;charset=utf-8"
			});
			gd.upload({
				blob: blob,
				filename: get_filename() + '.fountain',
				callback: google_drive_saved,
				parents: selected.data.isRoot ? [] : [selected.data],
				fileid: selected.data.isFolder ? null : selected.data.id,
			});
		});
	};

	plugin.google_drive_pdf = function () {
		google_drive_save(function (selected) {
			data.parse();
			preview.get_pdf(function (data) {
				gd.upload({
					blob: data.blob,
					filename: get_filename() + '.pdf',
					callback: google_drive_saved,
					parents: selected.data.isRoot ? [] : [selected.data],
					fileid: selected.data.isFolder ? null : selected.data.id,
				});
			});
		});
	};

	plugin.gd_saved = decorator.signal();

	function google_drive_saved(data) {
		$.prompt.close();
		plugin.gd_saved(data);
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
		return window.location.protocol !== 'file:';
	};

	plugin.is_google_drive_available = function () {
		return window.gapi && window.location.protocol !== 'file:';
	};

	function get_filename() {
		if (!data.data('filename')) {
			var title_token = data.get_title_page_token('title'),
				name = 'screenplay';
			if (title_token) {
				name = title_token.text.replace(/[^a-zA-Z0-9]/g, ' ').split('\n').join(' ').replace(/\s+/g, ' ').trim();
			}
			data.data('filename', name || 'screenplay');
		}
		return data.data('filename');
	};

	plugin.set_filename = function (value) {
		data.data('filename', value);
	}

	plugin.get_filename = get_filename;

	return plugin;
});