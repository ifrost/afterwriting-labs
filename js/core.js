/*global define*/
define(['jquery', 'templates', 'logger', 'utils/layout', 'utils/decorator', 'd3'], function ($, templates, logger, layout, decorate, d3) {

	var log = logger.get('core');
	var module = {};
	var current;
	
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
		
		current.activate();

		layout.switch_to_plugin(plugin.name);
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
		
		if (module.loaded) {
			module.loaded();
		}
	};

	return module;
});