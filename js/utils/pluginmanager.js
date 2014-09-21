/* global define */
define(function(require){
	
	var logger = require('logger'),
		data = require('modules/data'),
		decorator = require('utils/decorator');
	
	var log = logger.get('pluginmanager');
	
	var module = {},
		current;
	
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

	module.switch_to = decorator(function (plugin) {
		if (plugin === current) {
			module.switch_to.lock = true;
			return;
		}

		log.info('Switching to: ' + plugin.name);

		if (current) {
			current.deactivate();
		}
		current = plugin;
		
		data.parse();
		
		current.activate();

		return current;
	});
	
	module.refresh = function() {
		if (current) {
			current.deactivate();
			current.activate();
		}
	};
	
	module.get_current = function() {
		return current;
	};

	return module;
});