define(['logger','modernizr','utils/fountain', 'utils/decorator'],function (logger, Modernizr, fountain, decorator) {
	var log = logger.get('data');
	
	var plugin = {};
	var _tempStorage = {};
	
	plugin.data = function (key, value) {
		if (Modernizr.localstorage) {
			if (arguments.length === 1) {				
				return localStorage.getItem('com.afterwriting.labs.local-storage.' + key);
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
	}

	plugin.script = decorator.property();
	plugin.script.add(function(script){
		plugin.parsed = fountain.parse(script, plugin.config);
	});
	
	var print_profiles = {
		"a4": {
			paper_size: "a4",
			lines_per_page: 57,
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
	print_profiles.usletter = Object.create(print_profiles.a4);
	print_profiles.usletter.paper_size = "letter";
	print_profiles.usletter.lines_per_page = 56;

	plugin.default_config = {
		show_background_image: true,
		embolden_scene_headers: false,
		show_page_numbers: true,
		break_dialogue: true,
		print_title_page: true,		
		text: {},
		print_profile: "a4",
		load_last_opened: false,
		double_space_between_scenes: false,
	};
	
	plugin.default_config.print = function() {
		return print_profiles[plugin.config.print_profile];
	};

	plugin.save_config = function() {
		plugin.data('config', JSON.stringify(plugin.config));
	};
	
	plugin.reset_config = function() {
		plugin.data('config', JSON.stringify({}));
		plugin.load_config();
	};
	
	plugin.load_config = function() {
		plugin.config = Object.create(plugin.default_config);
		var overrides = JSON.parse(plugin.data('config')) || {};
		for (var attrname in overrides) { plugin.config[attrname] = overrides[attrname]; }		
	};
	
	return plugin;

});