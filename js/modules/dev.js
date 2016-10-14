define(['logger', 'utils/common', 'utils/pluginmanager', 'utils/layout', 'plugins/open'], function (logger, common, pm, layout, open) {
	var module = {};

	var DEV_PLUGIN;

	module.prepare = function () {
		// set up logger
		logger.useDefaults();
		logger.setLevel(logger.DEBUG);
		logger.filter = null;
    };

	module.windup = function () {
		var footer = common.data.footer;
		footer += '<br /><span class="version">development version</span>';
		layout.set_footer(footer);

		//DEV_PLUGIN = require('plugins/editor');

		if (DEV_PLUGIN) {
			open.open_sample('big_fish');

			pm.switch_to(DEV_PLUGIN);

			layout.show_main();
			layout.open_content();
			layout.switch_to_plugin(DEV_PLUGIN.name);
		}
	};

	return module;

});