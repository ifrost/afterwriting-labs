define(function (require) {

	var $ = require('jquery');

	var module = {};

	module.show = function (options) {
		var buttons = {};
		buttons[options.label || 'Save'] = true;
		buttons['Cancel'] = false;
		var info = '<p>' + options.info + '</p>';
		$.prompt(info + '<div id="jstree-parent"><div id="jstree"></div></div>', {
			buttons: buttons,
			submit: function (e, v, f, m) {
				if (v) {
					var selected = $('#jstree').jstree(true).get_selected(true);
					if (selected.length) {
						options.callback(selected[0]);
					} else {
						$.prompt("You didn't select anything.");
					}

				} else {
					$.prompt.close();
				}
			}
		});

		$('#jstree').jstree({
			plugins: ['types'],
			core: {
				data: options.data,
			},
			types: {
				"default": {
					"valid_children": ["default", "file"],
					"icon": "aw-jstree-folder"
				},
				"file": {
					"icon": "aw-jstree-file"
				}
			}
		}).on('ready.jstree', function () {
			if (options.selected) {
				$('#jstree').jstree(true).select_node(options.selected);
				var parent_top = $('#jstree-parent').position().top
				var element_top = $('#jstree li[id="' + options.selected + '"').position().top;
				var parent_half_height = $('#jstree-parent').height() / 2;
				$('#jstree-parent').scrollTop(element_top - parent_top - parent_half_height);
			}
		});

	};

	return module;

});