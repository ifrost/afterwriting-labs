define(['core', 'logger', 'templates', 'dropbox', 'utils/data', 'utils/helper'], function (core, logger, templates, Dropbox, data, helper) {
	var log = logger.get('open');
	var plugin = core.create_plugin('open', 'open');
	plugin.class = "active";

	var set_script = function (value) {
		data.script(value);
		core.show_main();
	};

	plugin.open_last_used = function () {
		var last_used;
		if (last_used = data.data('last-used-script')) {
			set_script(last_used);
		}
	};

	plugin.open_file = function (selected_file) {
		var fileReader = new FileReader();
		fileReader.onload = function () {
			set_script(this.result);
		};
		fileReader.readAsText(selected_file);
	}

	plugin.open_file_dialog = function () {
		// view action
	};

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

	plugin.init = function () {
		log.info("open:init");
		data.script.add(function () {
			if (data.script()) {
				data.data('last-used-title', 'No title');
				data.parsed.title_page.forEach(function (token) {
					if (token.type === 'title') {
						var title = token.text;
						title = title.split('\n')[0].replace(/\*/g, '').replace(/_/g, '').replace(/\n/g, ' / ');
						data.data('last-used-title', title);
					}
				});
				data.data('last-used-script', data.script());
				data.data('last-used-date', helper.format_date(new Date()));
			}
		});
	};

	plugin.context = {
		last_used: {}
	};

	if (data.data('last-used-script')) {
		log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
		plugin.context.last_used.script = data.data('last-used-script');
		plugin.context.last_used.date = data.data('last-used-date');
		plugin.context.last_used.title = data.data('last-used-title');
	}

	return plugin;
});