define(['core', 'logger', 'utils/typewriter'], function (core, logger, typewriter) {
	var log = logger.get('preview');
	var plugin = core.create_plugin('preview', 'view');
	
	plugin.get_pdf = function() {
		return typewriter.get_pdf(core.parsed, core.config);
	};
	
	plugin.activate = function() {
		var pdf = plugin.get_pdf();
		plugin.data.pdf = pdf;
	};
		
	return plugin;
});