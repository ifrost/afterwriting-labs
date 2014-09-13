/* global define */
define(function (require) {

	var PDFDocument = require('pdfkit'),
		fonts = require('utils/fonts'),
		blobstream = require('blobstream'),
		data = require('modules/data'),
		helper = require('utils/helper');

	var module = {};
	
	function initDoc() {
		var cfg = data.config;
		var options = {
			size: cfg.print().paper_size == "a4" ? 'A4' : 'LETTER'
		};
		var doc = new PDFDocument(options);
		doc.font(fonts.prime.normal);		
		doc.fontSize(12);
		return doc;
	}
	
	function finishDoc(doc, callback) {
		var stream = doc.pipe(blobstream());
		doc.end();
		stream.on('finish', function () {
			var url = stream.toBlobURL('application/pdf');
			var blob = stream.toBlob('application/pdf');
			callback({url: url, blob: blob});
		});
	}
	
	function generate(doc) {
		doc.text("Pchnąć w tę łódź jeża lub osiem skrzyń fig", 100, 160);
	}
	
	module.get_pdf = function (callback) {
		var doc = initDoc();
		generate(doc);		
		finishDoc(doc, callback);
	};

	return module;

});