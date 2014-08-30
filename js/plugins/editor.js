/* global define, setTimeout */
define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		data = require('utils/data'),
		cm = require('libs/codemirror/lib/codemirror');
	
	// codemirror plugins
	require('libs/codemirror/addon/selection/active-line');
    require('libs/codemirror/addon/hint/show-hint');
	require('libs/codemirror/addon/hint/anyword-hint');
	require('utils/fountain/cmmode');
	
	var plugin = pm.create_plugin('editor', 'edit');
	var editor;

	plugin.data = {};

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

	plugin.activate = function () {

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
		save_state();
	};

	return plugin;
});