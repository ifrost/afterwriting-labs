/*global define*/
define(function (require) {

	var templates = require('templates'),
		logger = require('logger'),
		layout = require('utils/layout'),
		decorator = require('utils/decorator'),
		d3 = require('d3'),
		data = require('utils/data');

	var log = logger.get('bootstrap'),
		module = {};
	
	var decorate_all_properties = function (plugin) {
		d3.keys(plugin).forEach(function (property) {
			if (typeof (plugin[property]) === "function" && !(plugin[property].decorated)) {
				plugin[property] = decorator(plugin[property]);
			}
		});
	};

	module.init = function (modules) {
		data.load_config();

		var context = {
			plugins: []
		};

		var plugins = modules.filter(function (module) {
			return module && module.is_plugin;
		});

		module.plugins = [];
		plugins.forEach(function (plugin) {
			module.plugins[plugin.name] = plugin;
			decorate_all_properties(plugin);
		});

		plugins.forEach(function (plugin) {
			plugin.init();
		});

		log.info('Bootstrapping: ' + plugins.length + ' plugins found.');

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

		log.info('Initializing layout');
		layout.init_layout(context);

		log.info('Bootstrapping finished.');
		if (module.loaded) {
			module.loaded();
		}
	};

	return module;
});