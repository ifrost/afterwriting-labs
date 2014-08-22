define(['core', 'logger', 'utils/typewriter', 'utils/data'], function (core, logger, typewriter, data) {
	var log = logger.get('preview');
	var plugin = core.create_plugin('preview', 'view');
	
	plugin.get_pdf = function() {
		return typewriter.get_pdf(data.parsed, data.config);
	};
	
	plugin.activate = function() {
		var pdf = plugin.get_pdf();
		plugin.data.pdf = pdf;
	};
		
	return plugin;
});