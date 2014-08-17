define(['core', 'logger', 'jquery', 'utils/layout',
		'libs/codemirror/lib/codemirror',
		'libs/codemirror/addon/selection/active-line',
        'libs/codemirror/addon/hint/show-hint',
		'libs/codemirror/addon/hint/anyword-hint'
], function (core, logger, $, layout, cm) {
	var log = logger.get('editor');
	var plugin = core.create_plugin('editor', 'write');
	var editor, ready = false;

	plugin.data = {

	};

	var createEditor = function () {
		editor = cm.fromTextArea($('#editor-textarea').get(0), {
			mode: "text",
			lineNumbers: false,
			lineWrapping: true,
			styleActiveLine: true,
			extraKeys: {
				"Ctrl-Space": "autocomplete",
			}
		});

		var editor_content = $('.plugin-content[plugin="editor"]')
		editor.setSize("700px", editor_content.height() - 100);
		editor.refresh();

		editor.on('change', function () {
			core.script(editor.getValue());
		});

		ready = true;
	};
	
	var save_state = function() {
		plugin.data.cursor = editor.getCursor();
		plugin.data.scroll_info = editor.getScrollInfo();
	}
	
	plugin.goto = function(line) {
		plugin.data.cursor = {ch: 0, line: line, xRel: 0};
		plugin.data.scroll_info = null; //editor.charCoords(plugin.data.cursor);	
		
		core.switch_to(plugin);
		layout.switch_to_plugin(plugin.name);
	}

	plugin.activate = function () {
		if (!ready) {
			createEditor();
		}

		setTimeout(function () {
			editor.setValue(core.script() || "");
			editor.focus();
			editor.refresh();

			if (plugin.data.cursor) {
				editor.setCursor(plugin.data.cursor)
			}
			
			if (plugin.data.scroll_info) {
				editor.scrollTo(plugin.data.scroll_info.left, plugin.data.scroll_info.top);
			}
			else if (plugin.data.cursor) {
				var scroll_to = editor.getScrollInfo();				
				if (scroll_to.top > 0) {
					editor.scrollTo(0, scroll_to.top + scroll_to.clientHeight - editor.defaultTextHeight() * 2);
				}
				
				//var coords = editor.cursorCoords(plugin.data.cursor);
//				var scroll_to = editor.getScrollInfo();				
//				editor.scrollIntoView({
//					left: 0,
//					right: 0,
//					top: scroll_to.top + 20,
//					bottom: scroll_to.top + 20
//				});
				//var margin = editor.getScrollInfo().clientHeight - editor.defaultTextHeight() * 10;
				//console.log(margin);
				//editor.scrollIntoView({line: plugin.data.cursor.line, ch: 0}, margin);
			}			


		}, 300);
	};

	plugin.deactivate = function () {
		save_state();
	};

	return plugin;
});