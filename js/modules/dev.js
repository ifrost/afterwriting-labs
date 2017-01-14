define(['logger', 'utils/common', 'utils/pluginmanager', 'utils/layout'], function (logger, common, pm, layout, open) {
	var module = {};
    
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
	};

	return module;

});