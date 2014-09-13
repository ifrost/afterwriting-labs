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
		pdfkit: 'libs/pdfkit',
		blobstream: 'libs/blob-stream-v0.1.2'
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
		}
	}
});
