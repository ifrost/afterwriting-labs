/* global define */
define(['logger', 'utils/common', 'utils/pluginmanager', 'utils/layout', 'plugins/open'], function (logger, common, pm, layout, open) {
	var module = {};


	module.prepare = function () {
		// set up logger
		logger.useDefaults();
		logger.setLevel(logger.DEBUG);
		logger.filter = null;

		common.data.static_path = '';
	};

	module.windup = function () {
		var footer = '<span class="version">tester</span>';
		layout.set_footer(footer);
	};

	return module;

});