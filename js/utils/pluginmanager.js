define(function(require){
	
	var Handlebars = require('handlebars'),
      logger = require('logger'),
		data = require('modules/data'),
		off = require('off');
	
	var log = logger.get('pluginmanager');
	
	var module = {},
		current;
	
	module.create_plugin = function (name, title, template) {
      if (template) {
         template = Handlebars.compile(template);
      }
		return {
			is_plugin: true,
			activate: function () {},
			deactivate: function () {},
			context: {},
			init: function () {},
			data: {},
			name: name,
			title: title,
			class: 'inactive',
         template: template,
			log: logger.get('name')
		};
	};

	module.switch_to = off(function (plugin) {
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