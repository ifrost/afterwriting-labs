/* global define, setTimeout */
define(function (require) {

	var pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		decorator = require('utils/decorator'),
		gd = require('utils/googledrive'),
		$ = require('jquery'),
		cm = require('libs/codemirror/lib/codemirror');

	// codemirror plugins
	require('libs/codemirror/addon/selection/active-line');
	require('libs/codemirror/addon/hint/show-hint');
	require('libs/codemirror/addon/hint/anyword-hint');
	require('utils/fountain/cmmode');

	var plugin = pm.create_plugin('editor', 'write');
	var editor, last_content = '',
		active = false;

	plugin.data = {
		is_sync: false
	};

	plugin.synced = decorator.signal();

	plugin.create_editor = function (textarea) {
		editor = cm.fromTextArea(textarea, {
			mode: "fountain",
			lineNumbers: false,
			lineWrapping: true,
			styleActiveLine: true,
			extraKeys: {
				"Ctrl-Space": "autocomplete"
			}
		});

		editor.on('change', function () {
			data.script(editor.getValue());
		});
	};

	plugin.set_size = function (width, height) {
		editor.setSize(width, height);
		editor.refresh();
	};

	var save_state = function () {
		plugin.data.cursor = editor.getCursor();
		plugin.data.scroll_info = editor.getScrollInfo();
	};

	plugin.goto = function (line) {
		plugin.data.cursor = {
			ch: 0,
			line: line,
			xRel: 0
		};
		plugin.data.scroll_info = null;

		pm.switch_to(plugin);
	};

	plugin.sync_available = function () {
		return data.data('gd-fileid') || data.data('db-link');
	};

	plugin.is_sync = function () {
		return plugin.data.is_sync;
	};

	var confirm_sync = function (text, link) {
		$.prompt(text, {
			buttons: {
				'Open file in a new window': true,
				'Close': false
			},
			submit: function (e, v) {
				if (v) {
					window.open(link, '_blank');
				}
			}
		});
	}

	var handle_sync = function (content) {
		if (last_content != content) {
			last_content = content;
			data.script(content);
			data.parse();
			plugin.synced();
			if (active) {
				plugin.activate();
			}
		}
	};

	plugin.toggle_sync = function() {
		plugin.set_sync(!plugin.data.is_sync);
	};
	
	plugin.set_sync = function (value) {
		plugin.data.is_sync = value;
		if (editor) {			
			editor.setOption('readOnly', plugin.data.is_sync);
		}
		if (plugin.data.is_sync) {
			if (data.data('gd-fileid')) {
				confirm_sync('Content will be synced with Google Drive each 3 seconds', data.data('gd-link'));
				gd.sync(data.data('gd-fileid'), 3000, handle_sync);
			} else if (data.data('db-link')) {
				confirm_sync('Content will be synced with Dropbox each 3 seconds', data.data('db-link'));
				plugin.data.db_interval = setInterval(function () {
					$.ajax({
						url: data.data('db-link')
					}).done(handle_sync);
				}, 3000);
			}

		} else {
			gd.unsync();
			clearInterval(plugin.data.db_interval);
		}
	};

	plugin.activate = function () {
		active = true;
		setTimeout(function () {
			editor.setValue(data.script() || "");
			editor.focus();
			editor.refresh();

			if (plugin.data.cursor) {
				editor.setCursor(plugin.data.cursor);
			}

			if (plugin.data.scroll_info) {
				editor.scrollTo(plugin.data.scroll_info.left, plugin.data.scroll_info.top);
			} else if (plugin.data.cursor) {
				var scroll_to = editor.getScrollInfo();
				if (scroll_to.top > 0) {
					editor.scrollTo(0, scroll_to.top + scroll_to.clientHeight - editor.defaultTextHeight() * 2);
				}
			}

		}, 300);
	};

	plugin.deactivate = function () {
		active = false;
		save_state();
	};
	
	plugin.is_active = function() {
		return active;
	};

	return plugin;
});