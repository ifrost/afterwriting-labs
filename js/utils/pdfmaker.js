/* global define */
define(function (require) {

	var PDFDocument = require('pdfkit'),
		fonts = require('utils/fonts'),
		blobstream = require('blobstream');

	var module = {};
	
	function initDoc() {
		var doc = new PDFDocument();
		doc.font(fonts.prime.normal);		
		doc.fontSize(12);
		return doc;
	}
	
	function finishDoc(doc, callback) {
		var stream = doc.pipe(blobstream());
		doc.end();
		stream.on('finish', function () {
			var url = stream.toBlobURL('application/pdf');
			callback(url);
		});
	}
	
	function generate(doc) {
		doc.text("Pchnąć w tę łódź jeża lub osiem skrzyń fig", 100, 160);
	}
	
	module.get_pdf_url = function (callback) {
		var doc = initDoc();
		generate(doc);		
		finishDoc(doc, callback);
	};

	return module;

});