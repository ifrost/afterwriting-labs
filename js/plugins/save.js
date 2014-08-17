define(['core', 'logger', 'jquery', 'saveAs', 'plugins/preview'], function (core, logger, $, saveAs, preview) {
	var log = logger.get('save');
	var plugin = core.create_plugin('save', 'save');

	plugin.init = function () {
		$(document).ready(function () {
			$('a[action="save-fountain"]').click(function () {
				var blob = new Blob([core.script()], {
					type: "text/plain;charset=utf-8"
				});
				saveAs(blob, 'screenplay.fountain');
			});
			$('a[action="save-pdf"]').click(function () {
				preview.get_pdf().output('save', 'screenplay.pdf');
			});			
		});
	};

	plugin.activate = function () {
		log.info('save:activate');
	};

	plugin.deactivate = function () {
		log.info('save:deactivate');
	};

	return plugin;
});