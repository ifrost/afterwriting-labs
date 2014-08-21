define(['logger', 'plugins/open', 'plugins/save', 'plugins/editor', 'plugins/preview', 'plugins/facts', 'plugins/stats'], function (logger, open, save, editor, preview, facts, stats) {

	var module = {};
	var log = logger.get('monitor');
	
	var track_event = function (category, action, label) {
		log.info('Event sent', category,action,label);
		ga('send', 'event', category, action, label);
	};

	var track_handler = function (category, action, label) {
		return function () {
			track_event(category, action, label);
		};
	};

	module.init = function () {

		// open
		open.activate.add(track_handler('plugin', 'opened', open.name));
		open.open_sample.add(function (result, args) {
			track_event(open.name, 'sample', args[0]);
		});

		open.create_new.add(track_handler(open.name, 'new'));
		open.open_file_dialog.add(track_handler(open.name, 'file-dialog'));
		open.open_file.add(track_handler(open.name, 'file-opened'));
		open.open_from_dropbox.add(track_handler(open.name, 'dropbox'));

		// save 
		save.activate.add(track_handler('plugin', 'opened', save.name));
		save.save_as_fountain.add(track_handler('save', 'dowload', 'fountain'));
		save.save_as_pdf.add(track_handler('save', 'dowload', 'pdf'));
		save.dropbox_fountain.add(track_handler('save', 'dropbox', 'fountain'));
		save.dropbox_pdf.add(track_handler('save', 'dropbox', 'pdf'));

		// editor
		editor.activate.add(track_handler('plugin', 'opened', editor.name));

		// preview
		preview.activate.add(track_handler('plugin', 'opened', preview.name));

		// facts
		facts.activate.add(track_handler('plugin', 'opened', facts.name));

		// stats
		stats.activate.add(track_handler('plugin', 'opened', stats.name));
		stats.goto.add(track_handler('stats', 'goto'));

	};

	return module;
});