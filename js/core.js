/*global define*/
define(['jquery', 'templates', 'logger', 'saveAs', 'utils/fountain', 'utils/layout', 'modernizr', 'utils/decorator', 'd3'], function ($, templates, logger, saveAs, fountain, layout, Modernizr, decorate, d3) {

	var log = logger.get('core');
	var module = {};
	var current;
	var tooltip;

	module.create_plugin = function (name, title) {
		return {
			is_plugin: true,
			activate: function () {},
			deactivate: function () {},
			context: {},
			init: function () {},
			data: {},
			name: name,
			title: title,
			class: 'inactive'
		};
	};

	module.switch_to = function (plugin) {
		if (plugin === current) {
			return;
		}

		log.info('Switching to: ' + plugin.name);

		if (current) {
			current.deactivate();
		}
		current = plugin;
		module.parsed = fountain.parse(_script, module.config);
		current.activate();

		layout.switch_to_plugin(plugin.name);
	};

	var _script = "";
	var _tempStorage = {};

	module.data = function (key, value) {
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

	module.config = {
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

	module.script = function (value) {
		if (arguments.length == 1) {
			_script = value;
			module.data('last', _script);
		}

		return _script;
	};

	module.show_main = function () {
		layout.close_content();
		layout.show_options();
	};

	module.init = function (modules) {
		var context = {
			plugins: []
		};

		var enrich = function (plugin) {
			d3.keys(plugin).forEach(function (property) {
				if (typeof (plugin[property]) === "function") {
					plugin[property] = decorate(plugin[property]);
				}
			});
		}

		var plugins = modules.filter(function (module) {
			return module && module.is_plugin;
		});

		module.plugins = [];
		plugins.forEach(function (plugin) {
			module.plugins[plugin.name] = plugin;
			enrich(plugin);
		});

		log.info('Initializing core. ' + plugins.length + ' plugins found.');

		plugins.forEach(function (plugin) {
			log.info('Initializing plugin: ' + plugin.name);
			var template_name = 'templates/plugins/' + plugin.name + '.hbs';
			if (templates.hasOwnProperty(template_name)) {
				var template = templates[template_name];
				var html = template(plugin.context);
				plugin.view = html;
			}
			context.plugins.push(plugin);
		});

		layout.init_layout(context);

		context.plugins.forEach(function (plugin) {
			$('.tool[plugin="' + plugin.name + '"], .menu-item[plugin="' + plugin.name + '"], a.switch[plugin="' + plugin.name + '"]').click(function () {
				module.switch_to(plugin);
			});
			plugin.init();
		});

		tooltip = $('#tooltip');

		if (module.loaded) {
			module.loaded();
		}
	};

	module.show_tooltip = function (text) {
		tooltip.css("visibility", "visible");
		tooltip.html(text);
	};

	module.move_tooltip = function (x, y) {
		tooltip.css("top", (y - 10) + "px").css("left", (x + 10) + "px");
	};

	module.hide_tooltip = function () {
		tooltip.css("visibility", "hidden");
	};

	module.lines_to_minutes = function (lines) {
		return lines / module.config.lines_per_page;
	};

	return module;
});