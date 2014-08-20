define(['core', 'logger', 'templates', 'dropbox'], function (core, logger, templates, Dropbox) {
	var log = logger.get('open');
	var plugin = core.create_plugin('open', 'open');
	plugin.class = "active";
	
	var set_script = function(value) {
		core.script(value);
		core.show_main();
	};

	plugin.open_file = function (selected_file) {
		var fileReader = new FileReader();
		fileReader.onload = function () {
			set_script(this.result);
		};
		fileReader.readAsText(selected_file);
	}

	plugin.create_new = function () {
		set_script('');
	}

	plugin.open_sample = function (name) {
		var template_name = 'templates/samples/' + name + '.fountain';
		var text = templates[template_name]();
		set_script(text);
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
					set_script(content);
				});
			},
			linkType: 'direct',
			multiselect: false,
			extensions: ['.fountain', '.txt']
		});
	};

	return plugin;
});