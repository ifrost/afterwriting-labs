define(['core', 'logger', 'jquery', 'saveAs', 'plugins/preview'], function (core, logger, $, saveAs, preview) {
	var log = logger.get('save');
	var plugin = core.create_plugin('save', 'save');

	plugin.data = {
		filename: "screenplay"
	};
	
	plugin.init = function () {
		$(document).ready(function () {
			$('a[action="save-fountain"]').click(function () {
				var blob = new Blob([core.script()], {
					type: "text/plain;charset=utf-8"
				});
				saveAs(blob, plugin.data.filename + '.fountain');
			});
			$('a[action="save-dropbox-fountain"]').click(function () {
				var encoded = window.btoa(core.script());
				var uri = 'data:text/plain;base64,' + encoded;
				Dropbox.save(uri, plugin.data.filename + '.fountain');
			});
			
			$('a[action="save-pdf"]').click(function () {
				preview.get_pdf().output('save', plugin.data.filename + '.pdf');
			});	
			$('a[action="save-dropbox-pdf"]').click(function () {
				var uri = preview.get_pdf().output("datauristring");
				Dropbox.save(uri, plugin.data.filename + '.pdf');
			});	
			$('#save-filename').keyup(function(){
				plugin.data.filename = $(this).val();
			});
		});
	};

	plugin.activate = function () {
		if (!(Dropbox.isBrowserSupported()) || window.location.protocol === 'file:') {
			$('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().hide();
		}
		$('#save-filename').val(plugin.data.filename);
	};

	plugin.deactivate = function () {
		log.info('save:deactivate');
	};

	return plugin;
});