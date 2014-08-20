define(['core', 'logger','modernizr','utils/fountain'],function (core, logger, Modernizr, fountain) {
	var log = logger.get('data');
	var plugin = core.create_plugin('data', 'data');
	
	var _script = "";
	var _tempStorage = {};
	
	plugin.data = function (key, value) {
		if (Modernizr.localstorage) {
			if (arguments === 1) {
				return localStorage.getItem('com.afterwriting.labs.local-storage.' + key);
			} else {
				window.localStorage.setItem('com.afterwriting.labs.local-storage.' + key, value);
			}
		} else {
			if (arguments === 1) {
				return _tempStorage[key];
			} else {
				_tempStorage[key] = value;
			}
		}
	}

	plugin.script = function (value) {
		if (arguments.length == 1) {
			_script = value;
			plugin.parsed = fountain.parse(_script, plugin.config);
			plugin.data('last', _script);
		}

		return _script;
	};

	plugin.config = {
		paper_size: "a4",
		lines_per_page: 57,
		break_dialogue: true,
		show_page_numbers: true,
		text: {},
		print: {
			top_margin: 0.85,
			page_width: 8.27,
			left_margin: 1.5,
			right_margin: 1,
			font_width: 0.1,
			font_height: 0.1667,
			line_spacing: 1,
			page_number_top_margin: 0.5,
			title_page: {
				top_start: 3.5,
				draft_date: {
					x: 5.3,
					y: 8.2
				},
				date: {
					x: 5.3,
					y: 8.2
				},
				contact: {
					x: 5.3,
					y: 8.5
				},
				notes: {
					x: 1.5,
					y: 8.5,
				}
			},
			scene_heading: {
				feed: 1.5,
				max: 58
			},
			action: {
				feed: 1.5,
				max: 58
			},
			character: {
				feed: 3.5,
				max: 33
			},
			parenthetical: {
				feed: 3.0,
				max: 33
			},
			dialogue: {
				feed: 2.5,
				max: 33
			},
			transition: {
				feed: 0.0,
				max: 58
			},
			centered: {
				feed: 1.5,
				style: 'center',
				max: 58
			}
		}
	};
	
	return plugin;

});