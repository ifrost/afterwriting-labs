define(['dependencies', 'logger', 'utils/layout', 'off', 'd3', 'jquery'], function (_, logger, layout, off, d3, $) {

	var log = logger.get('bootstrap'),
		module = {};

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
         off.decorate(plugin);
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