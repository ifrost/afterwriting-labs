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

	var dropbox_save = function (save_callback, selected, options, default_filename) {
		db.list(function (root) {
			root = db.convert_to_jstree(root);
			tree.show({
				data: [root],
				selected: selected,
				filename: default_filename,
				save: true,
				info: 'Select a file to override or choose a folder to save as a new file.',
				callback: function (selected, filename) {
					$.prompt('Please wait');
					if (filename) {
						plugin.set_filename(filename);
					}
					save_callback(selected, filename);
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
		dropbox_save(function (selected, filename) {
			var path = selected.data.entry.path,
				blob = new Blob([data.script()], {
					type: "text/plain;charset=utf-8"
				});
			if (selected.data.isFolder) {
				path += '/' + filename;
			}
			db.save(path, blob, function(){
				if (filename) {
					data.data('fountain-filename', filename);
				}				
				file_saved();
				plugin.db_saved(path);
			});			
		}, data.data('db-path'), {}, 'screenplay.fountain');
	};

	plugin.dropbox_pdf = function () {
		dropbox_save(function (selected, filename) {
			var path = selected.data.entry.path;
			if (selected.data.isFolder) {
				path += '/' + filename;
			}
			data.parse();
			preview.get_pdf(function (result) {
				db.save(path, result.blob, function() {
					if (filename) {
						data.data('pdf-filename', filename);
					}
					file_saved();
					data.data('db-pdf-path', path);
				});
			});
		}, data.data('db-pdf-path'), {pdfOnly: true}, 'screenplay.pdf');
	};

	// GOOGLE DRIVE

	var google_drive_save = function (save_callback, selected, options, default_filename) {
		gd.auth(function () {
			gd.list(function (root) {
				root = gd.convert_to_jstree(root);
				tree.show({					
					data: [root],
					save: true,
					filename: default_filename,
					selected: selected,
					info: 'Select a file to override or choose a folder to save as a new file.',
					callback: function (selected, filename) {
						$.prompt('Please wait');
						if (filename) {
							plugin.set_filename(filename);
						}
						save_callback(selected, filename);
					}
				});
			}, options);
		});
	};

	plugin.google_drive_fountain = function () {
		google_drive_save(function (selected, filename) {
			data.parse();
			var blob = new Blob([data.script()], {
				type: "text/plain;charset=utf-8"
			});
			gd.upload({
				blob: blob,
				filename: filename,
				callback: function(file) {
					if (filename) {
						data.data('fountain-filename', filename);
					}
					file_saved();
					plugin.gd_saved(file);
				},
				convert: false,
				parents: selected.data.isRoot ? [] : [selected.data],
				fileid: selected.data.isFolder ? null : selected.data.id,
			});
		}, data.data('gd-fileid'), {}, 'screenplay.fountain');
	};

	plugin.google_drive_pdf = function () {
		google_drive_save(function (selected, filename) {
			data.parse();
			preview.get_pdf(function (pdf) {
				gd.upload({
					blob: pdf.blob,
					filename: filename,
					callback: function(file) {
						if (filename) {
							data.data('pdf-filename', filename);
						}
						file_saved();
						data.data('gd-pdf-id', file.id);
					},
					convert: false,
					parents: selected.data.isRoot ? [] : [selected.data],
					fileid: selected.data.isFolder ? null : selected.data.id,
				});
			});
		},  data.data('gd-pdf-id'), {pdfOnly: true}, 'screenplay.pdf');
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
		return data.data('filename');
	};

	plugin.set_filename = function (value) {
		data.data('filename', value);
	}

	plugin.get_filename = get_filename;

	return plugin;
});