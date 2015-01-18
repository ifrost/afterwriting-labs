define(function (require) {

	var $ = require('jquery');

	var module = {};

	module.show = function (options) {
		var buttons = {};
		buttons[options.label || 'Save'] = true;
		buttons['Cancel'] = false;
		$.prompt('<div id="jstree-parent"><div id="jstree"></div></div>', {
			buttons: buttons,
			submit: function (e, v, f, m) {
				if (v) {
					var selected = $('#jstree').jstree(true).get_selected(true);
					if (selected.length) {
						options.callback(selected[0]);
					}
					else {
						$.prompt("You didn't select anything.");
					}
					
				} else {
					$.prompt.close();
				}
			}
		});

		$('#jstree').jstree({
			core: {
				themes: {
					stripes: false
				},
				data: options.data
			}
		});


	};
	
	return module;

});