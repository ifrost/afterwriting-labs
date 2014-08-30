/*global require*/
require.config({
	baseUrl: 'js',
	paths: {
		templates: '../templates/compiled',
		jquery: 'libs/jquery-1.11.1.min',
		handlebars: 'libs/handlebars',
		logger: 'libs/logger',
		saveAs: 'libs/FileSaver',
		jspdf: 'libs/jspdf',
		d3: 'libs/d3.min',
		modernizr: 'libs/modernizr',
		dropbox: 'libs/dropins'
	},
	shim: {
		handlebars: {
			exports: 'Handlebars'
		},
		logger: {
			exports: 'Logger'
		},
		saveAs: {
			exports: 'saveAs'
		},
		'jspdf': {
			exports: 'jsPDF'
		},
		modernizr: {
			exports: 'Modernizr'
		},
		dropbox: {
			exports: 'Dropbox'
		}

	}
});

require(['bootstrap', 'logger', 'utils/monitor', 'dev', 'utils/common',
         'utils/layout', 'utils/data',
         'plugins/info',
         'plugins/open',
         'plugins/settings',
         'plugins/editor',
         'plugins/save',
         'plugins/preview',
         'plugins/facts',
         'plugins/stats'
], function (bootstrap, logger, monitor, dev, common, layout, data, open) {
	var devmode = !! window.__devmode;

	// set up logger
	logger.setLevel(logger.DEBUG);
	logger.setHandler(function (messages, context) {
		if (logger.filter && logger.filter.indexOf(context.name) == -1) {
			return;
		}

		if (logger.disabled) {
			return;
		}

		var hdlr = console.log;

		// Prepend the logger's name to the log message for easy identification.
		if (context.name) {
			messages[0] = "[" + context.level.name + "] [" + (new Date().toTimeString()).split(' ')[0] + "] [" + context.name + "] " + messages[0];
		}

		// Delegate through to custom warn/error loggers if present on the console.
		if (context.level === logger.WARN) {
			hdlr = console.warn;
		} else if (context.level === logger.ERROR) {
			hdlr = console.error;
		} else if (context.level === logger.INFO) {
			hdlr = console.info;
		}

		// Support for IE8+ (and other, slightly more sane environments)
		Function.prototype.apply.call(hdlr, console, messages);
	});

	if (devmode) {
		dev.pre_init();
	}

	// main initialization
	var loaded_plugins = Array.prototype.splice.call(arguments, 0);
	logger.filter = null;
	bootstrap.init(loaded_plugins);

	if (data.config.load_last_opened) {
		open.open_last_used(true);
		layout.show_options();
	}

	monitor.init();

	var footer = 'version: <a href="http://www.imdb.com/title/tt1790885/" target="_blank"><span class="version">Zero</span>&nbsp;Dark Thrirty</a>';
	if (devmode) {
		footer += '<br /><span class="version">development version</span>';
	}
	layout.set_footer(footer);

});