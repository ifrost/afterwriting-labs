define(['dependencies', 'logger', 'utils/layout', 'utils/decorator', 'd3', 'jquery'], function (_, logger, layout, decorator, d3, $) {

	var log = logger.get('bootstrap'),
		module = {};

	var decorate_all_properties = function (plugin) {
		d3.keys(plugin).forEach(function (property) {
			if (typeof (plugin[property]) === "function" && ! (plugin[property].decorated)) {
				plugin[property] = decorator(plugin[property]);
			}
		});
	};

	module.init = function (modules) {
		modules = Array.prototype.splice.call(modules, 0);

		log.info('Modules preparation.');
		modules.forEach(function (module) {
			if (module.prepare && typeof (module.prepare) === 'function') {
				module.prepare();
			}
		});

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

		log.info('Bootstrapping: ' + plugins.length + ' plugins found.');

		plugins.forEach(function (plugin) {
			log.info('Initializing plugin: ' + plugin.name);
			plugin.init();
		});

		plugins.forEach(function (plugin) {
         plugin.view = plugin.template(plugin.context);
			context.plugins.push(plugin);
		});

		log.info('Initializing layout');
		$('#loader').remove();
		layout.init_layout(context);

		log.info('Modules windup.');
		modules.forEach(function (module) {
			if (module.windup && typeof (module.windup) === 'function') {
				module.windup();
			}
		});

		log.info('Bootstrapping finished.');
	};

	return module;
});