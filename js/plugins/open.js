define(['core', 'logger', 'templates', 'jquery', 'utils/layout'], function (core, logger, templates, $, layout) {
	var log = logger.get('open');
	var plugin = core.create_plugin('open', 'open');
	plugin.class = "active";

	plugin.load_sample = function (name) {
		var template_name = 'templates/samples/' + name + '.fountain';
		var text = templates[template_name]();
		core.script(text);
	}

	plugin.init = function () {
		log.info('open:init');
		$(document).ready(function () {
			$('a[open-action="open"]').click(function () {
				$("#open-file").click();
			});
			$("#open-file").change(function () {
				var selected_file = $('#open-file').get(0).files[0];
				//$("#filename").text(escape(selected_file.name));
				var fileReader = new FileReader();
				fileReader.onload = function () {
					log.info('File loaded. Size: ', this.result.length);
					core.script(this.result);
				};
				fileReader.readAsText(selected_file);
				layout.close_content();
				layout.show_options();
			});
			$('a[open-action="new"]').click(function () {
				core.script('');
				layout.close_content();
				layout.show_options();
			});
			$('a[open-action="sample"]').click(function () {
				var name = $(this).attr('value');
				plugin.load_sample(name);
				layout.close_content();
				layout.show_options();
			});
			$('a[open-action="dropbox"]').click(function () {
				Dropbox.choose({
					success: function (files) {
						$.ajax({
							url: files[0].link
						}).done(function (content) {
							core.script(content);
							layout.close_content();
							layout.show_options();
						});
					},
					linkType: 'direct',
					multiselect: false,
					extensions: ['*.fountain', '*.pdf']
				});
			});

		});
	};

	plugin.activate = function () {
		if (!(Dropbox.isBrowserSupported()) || window.location.protocol === 'file:') {
			$('a[open-action="dropbox"]').parent().hide()
		}
	};

	plugin.deactivate = function () {
		log.info('open:deactivate');
	};

	return plugin;
});