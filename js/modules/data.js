/* global define, localStorage, window */
define(function (require) {
	
	var Modernizr = require('modernizr'),
		fparser = require('utils/fountain/parser'),
		fliner = require('utils/fountain/liner'), 
		decorator = require('utils/decorator');

	var plugin = {};
	var _tempStorage = {};

	plugin.data = function (key, value) {
		if (Modernizr.localstorage) {
			if (arguments.length === 1) {
				return window.localStorage.getItem('com.afterwriting.labs.local-storage.' + key);
			} else {
				window.localStorage.setItem('com.afterwriting.labs.local-storage.' + key, value);
			}
		} else {
			if (arguments.length === 1) {
				return _tempStorage[key];
			} else {
				_tempStorage[key] = value;
			}
		}
	};

	plugin.script = decorator.property();
	
	plugin.parse = decorator(function() {
		plugin.parsed = fparser.parse(plugin.script(), plugin.config);
		plugin.parsed.lines = fliner.line(plugin.parsed.tokens, plugin.config);
	});
	
	plugin.get_title_page_token = function(type) {
		var result = null;
		if (plugin.parsed && plugin.parsed.title_page) {
			plugin.parsed.title_page.forEach(function(token){
				if (token.is(type)) {
					result = token;
				}
			});
		}
		return result;
	};

	var print_profiles = {
		"a4": {
			paper_size: "a4",
			lines_per_page: 58,
			top_margin: 1.0,
			page_width: 8.27,
			page_height: 11.7,
			left_margin: 1.5,
			right_margin: 1,
			font_width: 0.1,
			font_height: 0.1667,
			line_spacing: 1,
			page_number_top_margin: 0.5,
			dual_max_factor: 0.75,
			title_page: {
				top_start: 3.5,
				left_side: ['notes', 'copyright'],
				right_side: ['draft date', 'date', 'contact']
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
				feed: 3.7,
				max: 33
			},
			parenthetical: {
				feed: 3.1,
				max: 35
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
			},
			synopsis: {
				feed: 0.5,
				max: 58,
				italic: true,
				color: '#888888',
				padding: 0,
				feed_with_last_section: true
			},
			section: {
				feed: 0.5,
				max: 58,
				color: '#555555',
				level_indent: 0.2
			},
			note: {
				color: '#888888',
				italic: true
			}
			
		},
	};

	print_profiles.usletter = JSON.parse(JSON.stringify(print_profiles.a4));
	var letter  = print_profiles.usletter;
	letter.paper_size = 'letter';
	letter.lines_per_page = 54;
	letter.page_width = 8.5;
	letter.page_height = 11;
	letter.scene_heading.max = 60;
	letter.action.max = 60;
	letter.character.max = 35;
	letter.parenthetical.max = 38;
	letter.dialogue.max = 35;
	letter.transition.max = 60;
	letter.centered.max = 60;
	letter.synopsis.max = 60;
	letter.section.max = 60;

	plugin.default_config = {
		show_background_image: true,
		embolden_scene_headers: false,
		show_page_numbers: true,
		split_dialogue: true,
		print_title_page: true,
		text: {},
		print_profile: "a4",
		load_last_opened: false,
		double_space_between_scenes: false,
		print_sections: false,
		print_synopsis: false,
		number_sections: false,
		use_dual_dialogue: true,
		stats_keep_last_scene_time: true,
		stats_who_with_who_max: 10,
		print_notes: false,
		print_header: '',
		print_footer: ''
	};

	plugin.default_config.print = function () {
		return print_profiles[plugin.config.print_profile];
	};

	plugin.save_config = function () {
		plugin.data('config', JSON.stringify(plugin.config));
	};

	plugin.reset_config = function () {
		plugin.data('config', JSON.stringify({}));
		plugin.load_config();
	};

	plugin.load_config = function () {
		plugin.config = Object.create(plugin.default_config);		
		var overrides;
		try {
			overrides = JSON.parse(plugin.data('config'));
		}
		catch (error) {
			overrides = {};
		}
		for (var attrname in overrides) {
			plugin.config[attrname] = overrides[attrname];
		}
	};
	
	plugin.prepare = function() {
		plugin.load_config();
	};

	return plugin;

});