define(['core', 'logger', 'templates', 'dropbox'], function (core, logger, templates, Dropbox) {
	var log = logger.get('open');
	var plugin = core.create_plugin('open', 'open');
	plugin.class = "active";

	plugin.open_file = function (selected_file) {
		var fileReader = new FileReader();
		fileReader.onload = function () {
			log.info('File loaded. Size: ', this.result.length);
			core.script(this.result);
		};
		fileReader.readAsText(selected_file);
	}

	plugin.create_new = function () {
		core.script('');
	}

	plugin.open_sample = function (name) {
		var template_name = 'templates/samples/' + name + '.fountain';
		var text = templates[template_name]();
		core.script(text);
	};

	plugin.is_dropbox_available = function () {
		return Dropbox.isBrowserSupported() && window.location.protocol !== 'file:';
	};

	plugin.open_from_dropbox = function () {
		Dropbox.choose({
			success: function (files) {
				$.ajax({
					url: files[0].link
				}).done(function (content) {
					core.script(content);
				});
			},
			linkType: 'direct',
			multiselect: false,
			extensions: ['.fountain', '.txt']
		});
	};

	return plugin;
});