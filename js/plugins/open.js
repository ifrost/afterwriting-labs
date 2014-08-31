/* global define, window, FileReader */
define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		logger = require('logger'),
		templates = require('templates'), 
		Dropbox = require('dropbox'), 
		data = require('modules/data'), 
		helper = require('utils/helper'), 
		$ = require('jquery'), 
		layout = require('utils/layout');
	
	var log = logger.get('open');
	var plugin = pm.create_plugin('open', 'open');
	plugin.class = "active";

	var last_session_script;
	
	var set_script = function (value) {
		data.script(value);
		layout.show_main();
	};

	plugin.open_last_used = function (startup) {
		if (last_session_script) {
			set_script(last_session_script);
		}
		return startup;
	};

	plugin.open_file = function (selected_file) {
		var fileReader = new FileReader();
		fileReader.onload = function () {
			set_script(this.result);
		};
		fileReader.readAsText(selected_file);
	};

	plugin.open_file_dialog = function () {
		// view action
	};

	plugin.create_new = function () {
		set_script('');
	};

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
			extensions: ['.fountain','.spmd', '.txt']
		});
	};

	plugin.init = function () {
		log.info("Init: script handlers");
		data.script.add(function () {
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
		});
	};

	plugin.context = {
		last_used: {}
	};

	if (data.data('last-used-date')) {
		log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
		plugin.context.last_used.script = data.data('last-used-script');
		plugin.context.last_used.date = data.data('last-used-date');
		plugin.context.last_used.title = data.data('last-used-title');
		last_session_script = data.data('last-used-script');
	}

	return plugin;
});