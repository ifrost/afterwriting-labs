define(function (require) {

	var pm = require('utils/pluginmanager'),
		logger = require('logger'),
		templates = require('templates'),
		editor = require('plugins/editor'),
		data = require('modules/data'),
		helper = require('utils/helper'),
		decorator = require('utils/decorator'),
		$ = require('jquery'),
		gd = require('utils/googledrive'),
		db = require('utils/dropbox'),
		tree = require('utils/tree'),
		save = require('plugins/save'),
		layout = require('utils/layout');

	var log = logger.get('open');
	var plugin = pm.create_plugin('open', 'open');
	plugin.class = "active";

	var last_session_script;

	var set_script = function (value) {
		clear_last_opened();
		editor.set_sync(false);
		data.script(value);
		layout.show_main();
	};

	var clear_last_opened = function () {
		data.data('db-path', '');
		data.data('gd-link', '');
		data.data('gd-fileid', '');
		data.data('gd-pdf-id', '');
		data.data('db-pdf-path', '');
		data.data('fountain-filename', '');
		data.data('pdf-filename', '');
	};

	plugin.open_last_used = function (startup) {
		if (last_session_script_loaded) {
			set_script(last_session_script || '');
		}
		return startup;
	};

	plugin.open_file = function (selected_file) {
		var finished = decorator.signal();
		var fileReader = new FileReader();
		fileReader.onload = function () {
			var value = this.result;			
			set_script(value);
			finished(data.format);
		};
		fileReader.readAsText(selected_file);
		return finished;
	};

	plugin.open_file_dialog = decorator.signal();

	plugin.create_new = function () {
		set_script('');
	};

	plugin.open_sample = function (name) {
		var template_name = 'templates/samples/' + name + '.fountain';
		var text = templates[template_name]();
		set_script(text);
	};

	plugin.is_dropbox_available = function () {
		return window.location.protocol !== 'file:';
	};

	plugin.is_google_drive_available = function () {
		return window.gapi && window.location.protocol !== 'file:';
	};

	var open_from_cloud = function (client, back_callback, load_callback) {
		client.list(function (root) {
			root = client.convert_to_jstree(root);
			tree.show({
				info: 'Please select file to open.',
				data: [root],
				label: 'Open',
				search: true,
				callback: function (selected) {
					if (selected.data.isFolder) {
						$.prompt('Please select a file, not folder.', {
							buttons: {
								'Back': true,
								'Cancel': false
							},
							submit: function (v) {
								if (v) {
									back_callback();
								}
							}
						});
					} else {
						load_callback(selected);
					}
				}
			});
		}, {
			before: function () {
				$.prompt('Please wait...');
			},
			after: $.prompt.close
		});
	};

	plugin.open_from_dropbox = function () {
		var finished = decorator.signal();
		open_from_cloud(db, plugin.open_from_dropbox, function (selected) {
			db.load_file(selected.data.path, function (content) {
				set_script(content);
				data.data('db-path', selected.data.path);
				finished(data.format);
			});
		});
		return finished;
	};

	plugin.open_from_google_drive = function () {
		var finished = decorator.signal();
		open_from_cloud(gd, plugin.open_from_google_drive, function (selected) {
			gd.load_file(selected.data.id, function (content, link, fileid) {
				set_script(content);
				data.data('gd-link', link);
				data.data('gd-fileid', fileid);
				finished(data.format);
			});
		});
		return finished;
	};

	plugin.init = function () {
		log.info("Init: script handlers");
		data.script.add(function () {
			var title = '';
			data.data('last-used-script', data.script());
			data.data('last-used-date', helper.format_date(new Date()));
			if (data.script()) {
				var title_match;
				var wait_for_non_empty = false;
				data.script().split('\n').forEach(function (line) {
					title_match = line.match(/title\:(.*)/i);
					if (wait_for_non_empty) {
						title = line.trim().replace(/\*/g, '').replace(/_/g, '');
						wait_for_non_empty = !title;
					}
					if (title_match) {
						title = title_match[1].trim();
						wait_for_non_empty = !title;
					}
				});
			}
			data.data('last-used-title', title || 'No title');
		});
		save.gd_saved.add(function (item) {
			clear_last_opened();
			data.data('gd-link', item.alternateLink);
			data.data('gd-fileid', item.id);
			data.data('filename', '');
			if (editor.is_active) {
				editor.activate(); // refresj
			}
		});
		save.db_saved.add(function (path) {
			clear_last_opened();
			data.data('db-path', path);
			data.data('filename', '');
			if (editor.is_active) {
				editor.activate(); // refresh
			}
		});
	};

	plugin.context = {
		last_used: {}
	};

	var last_session_script_loaded = false;
	if (data.data('last-used-date')) {
		data.data('filename', '');
		log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
		plugin.context.last_used.script = data.data('last-used-script');
		plugin.context.last_used.date = data.data('last-used-date');
		plugin.context.last_used.title = data.data('last-used-title');
		last_session_script = data.data('last-used-script');
		last_session_script_loaded = true;
	}

	return plugin;
});