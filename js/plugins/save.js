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

	var dropbox_save = function (save_callback, selected, options) {
		db.list(function (root) {
			root = db.convert_to_jstree(root);
			tree.show({
				data: [root],
				selected: selected,
				info: 'Select a file to override or choose a folder to save as a new file.',
				callback: function (selected) {
					$.prompt('Please wait');
					save_callback(selected);
				}
			});
		}, options || {});
	};

	var file_saved = function () {
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
			db.save(path, blob, function(){
				file_saved();
				plugin.db_saved(path);
			});			
		}, data.data('db-path'));
	};

	plugin.dropbox_pdf = function () {
		dropbox_save(function (selected) {
			var path = selected.data.entry.path;
			if (selected.data.isFolder) {
				path += '/' + get_filename() + '.pdf';
			}
			data.parse();
			preview.get_pdf(function (result) {
				db.save(path, result.blob, function() {
					file_saved();
					data.data('db-pdf-path', path);
				});
			});
		}, data.data('db-pdf-path'), {pdfOnly: true});
	};

	// GOOGLE DRIVE

	var google_drive_save = function (save_callback, selected, options) {
		gd.auth(function () {
			gd.list(function (root) {
				root = gd.convert_to_jstree(root);
				tree.show({
					data: [root],
					selected: selected,
					info: 'Select a file to override or choose a folder to save as a new file.',
					callback: function (selected) {
						$.prompt('Please wait');
						save_callback(selected);
					}
				});
			}, options || {});
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
				callback: function(file) {
					file_saved();
					plugin.gd_saved(file);
				},
				convert: false,
				parents: selected.data.isRoot ? [] : [selected.data],
				fileid: selected.data.isFolder ? null : selected.data.id,
			});
		}, data.data('gd-fileid'));
	};

	plugin.google_drive_pdf = function () {
		google_drive_save(function (selected) {
			data.parse();
			preview.get_pdf(function (data) {
				gd.upload({
					blob: data.blob,
					filename: get_filename() + '.pdf',
					callback: function(file) {
						file_saved();
						data.data('gd-pdf-id', file.id);
					},
					convert: false,
					parents: selected.data.isRoot ? [] : [selected.data],
					fileid: selected.data.isFolder ? null : selected.data.id,
				});
			});
		},  data.data('gd-pdf-id'), {pdfOnly: true});
	};

	plugin.gd_saved = decorator.signal();
	plugin.db_saved = decorator.signal();

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