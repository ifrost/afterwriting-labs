define(['core', 'logger', 'utils/typewriter'], function (core, logger, typewriter) {
	var log = logger.get('preview');
	var plugin = core.create_plugin('preview', 'view');
		
	plugin.get_pdf = function() {
		return typewriter.get_pdf(core.parsed, core.config);
	};
	
	plugin.activate = function() {
		log.info('PDF activated');
		var pdf = plugin.get_pdf();
		document.getElementById("pdf-preview-iframe").src = pdf.output("datauristring");
	};
	
	plugin.deactivate = function() {
		log.info('PDF deactivated');
	}
	
	return plugin;
});