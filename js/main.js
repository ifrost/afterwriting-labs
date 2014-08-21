/*global require*/
require.config({
	baseUrl: 'js',
	paths: {
		templates: '../templates/compiled',
		jquery: 'libs/jquery-1.11.1',
		handlebars: 'libs/handlebars',
		slidebars: 'libs/slidebars',
		logger: 'libs/logger',
		'jquery-ui': 'libs/jquery-ui-1.10.3',
		saveAs: 'libs/FileSaver',
		jspdf: 'libs/jspdf',
		d3: 'libs/d3.min',
		modernizr: 'libs/modernizr',
		dropbox: 'libs/dropins',
	},
	shim: {
		handlebars: {
			exports: 'Handlebars'
		},
		logger: {
			exports: 'Logger'
		},
		'jquery-ui': {
			exports: "$",
			deps: ['jquery']
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

require(['core', 'logger', 'utils/monitor', 
         'jquery-ui', 'utils/layout',
         'plugins/open',
         'plugins/editor',
         'plugins/preview',
         'plugins/save',
         'plugins/facts',
         'plugins/stats',
         'plugins/data',
         'dev',
], function (core, logger, monitor) {
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
	
	// main initialization
	var loaded_plugins = Array.prototype.splice.call(arguments, 0);
	logger.filter = null;
	core.init(loaded_plugins);
	monitor.init();
});
