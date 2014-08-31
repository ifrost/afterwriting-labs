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
