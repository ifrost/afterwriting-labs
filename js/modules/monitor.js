/*jshint -W069 */
define(function (require) {

	var logger = require('logger'),
		info = require('plugins/info'),
		open = require('plugins/open'),
		save = require('plugins/save'),
		editor = require('plugins/editor'),
		stats = require('plugins/stats'),
		layout = require('utils/layout');

	var module = {};
	var log = logger.get('monitor');

	var track_event = function (category, action, label) {
		if (window.ga) {
			log.info('Event sent', category, action, label || '');
			ga('send', 'event', category, action, label);
		} else {
			log.debug('Event not sent:', category, action, label || '', ' [Google Analytics not loaded.]');
		}
	};

	var track_handler = function (category, action, label) {
		return function () {
			track_event(category, action, label);
		};
	};

	module.prepare = function () {
		if (window.location.protocol !== 'file:') {
			(function (i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function () {
					(i[r].q = i[r].q || []).push(arguments);
				};
				i[r].l = 1 * new Date();
				a = s.createElement(o);
				m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m);
			})(window, document, 'script', 'http://www.google-analytics.com/analytics.js', 'ga');

			ga('create', 'UA-53953908-1', 'auto');
			ga('send', 'pageview');
		}
	};

	module.windup = function () {
		// layout stats
		layout.scopes.toolbar_switch_to.add(function (plugin) {
			track_event('navigation', plugin.name, 'toolbar');
		});
		layout.scopes.main_switch_to.add(function (plugin) {
			track_event('navigation', plugin.name, 'main');
		});
		layout.scopes.switcher_switch_to.add(function (plugin) {
			track_event('navigation', plugin.name, 'switcher');
		});
		layout.scopes.toolbar_close_content.add(function (plugin) {
			track_event('navigation', 'toolbar-close', plugin.name);
		});
		layout.scopes.back_close_content.add(function (plugin) {
			track_event('navigation', 'back-close', plugin.name);
		});
		layout.info_opened.add(function (section) {
			track_event('feature', 'help', section);
		});
		layout.toggle_expand.add(track_handler('feature', 'expand'));

		// info
		info.download_clicked.add(track_handler('feature', 'download'));

		// open
		open.open_sample.add(function (result, args) {
			track_event('feature', 'open-sample', args[0]);
		});

		open.create_new.add(track_handler('feature', 'open-new'));
		open.open_file_dialog.add(track_handler('feature', 'open-file-dialog'));
		open.open_file.add(function (format) {
			track_event('feature', 'open-file-opened', format);
		});
		open.open_from_dropbox.add(function (format) {
			track_event('feature', 'open-dropbox', format);
		});
		open.open_from_google_drive.add(function (format) {
			track_event('feature', 'open-googledrive', format);
		});
		open.open_last_used.add(function (startup) {
			track_event('feature', 'open-last-used', startup === true ? 'startup' : 'manual');
		});
		
		// editor
		editor.synced.add(function(cloud){
			track_event('feature', 'sync', cloud);
		});

		// save 
		save.save_as_fountain.add(track_handler('feature', 'save-fountain'));
		save.save_as_pdf.add(track_handler('feature', 'save-pdf'));
		save.dropbox_fountain.add(track_handler('feature', 'save-fountain-dropbox'));
		save.google_drive_fountain.add(track_handler('feature', 'save-fountain-googledrive'));
		save.dropbox_pdf.add(track_handler('feature', 'save-pdf-dropbox'));
		save.google_drive_pdf.add(track_handler('feature', 'save-pdf-googledrive'));

		// stats
		stats.goto.add(track_handler('feature', 'stats-scene-length-goto'));

	};

	return module;
});