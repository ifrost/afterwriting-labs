/* global define, ga */
define(function (require) {

	var logger = require('logger'), 
		open = require('plugins/open'), 
		save = require('plugins/save'),
		editor = require('plugins/editor'),
		preview = require('plugins/preview'), 
		facts = require('plugins/facts'), 
		stats = require('plugins/stats'), 
		settings = require('plugins/settings');
	
	var module = {};
	var log = logger.get('monitor');

	var track_event = function (category, action, label) {
		log.info('Event sent', category, action, label || '');
		ga('send', 'event', category, action, label);
	};

	var track_handler = function (category, action, label) {
		return function () {
			track_event(category, action, label);
		};
	};

	module.init = function () {

		open.activate.add(track_handler('navigation', 'open'));
		save.activate.add(track_handler('navigation', 'save'));
		editor.activate.add(track_handler('navigation', 'edit'));
		preview.activate.add(track_handler('navigation', 'preview'));
		facts.activate.add(track_handler('navigation', 'facts'));
		stats.activate.add(track_handler('navigation', 'stats'));
		settings.activate.add(track_handler('navigation', 'settings'));

		// open
		open.open_sample.add(function (result, args) {
			track_event('feature', 'open-sample', args[0]);
		});

		open.create_new.add(track_handler('feature', 'open-new'));
		open.open_file_dialog.add(track_handler('feature', 'open-file-dialog'));
		open.open_file.add(track_handler('feature', 'open-file-opened'));
		open.open_from_dropbox.add(track_handler('feature', 'open-dropbox'));
		open.open_last_used.add(function (startup) {
			track_event('feature', 'open-last-used', startup ? 'startup' : 'manual');
		});

		// save 
		save.save_as_fountain.add(track_handler('feature', 'save-fountain'));
		save.save_as_pdf.add(track_handler('feature', 'save-pdf'));
		save.dropbox_fountain.add(track_handler('feature', 'save-fountain-dropbox'));
		save.dropbox_pdf.add(track_handler('feature', 'save-pdf-dropbox'));

		// stats
		stats.goto.add(track_handler('feature', 'stats-scene-length-goto'));
		
		// settings
		settings.save.add(track_handler('feature', 'settings-save'));
		settings.save.add(function(){
			var c = settings.get_config();			
			track_event('settings', 'page-size-set', c.print().paper_size);
		});
		settings.reset.add(track_handler('feature', 'settings-reset'));

	};

	return module;
});