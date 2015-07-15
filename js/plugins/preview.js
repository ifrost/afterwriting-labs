define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		decorator = require('utils/decorator'),
		pdfmaker = require('utils/pdfmaker');
	
	var plugin = pm.create_plugin('preview', 'view');
	
	plugin.get_pdf = function(callback) {
		pdfmaker.get_pdf(callback);
	};

	plugin.get_pdfjs = function() {
		PDFJS.disableWebGL = false;
		pdfmaker.get_pdf(function(data){
			setTimeout(function(){

				var arrayBuffer, uint8array;
				var fileReader = new FileReader();
				fileReader.onload = function() {
					arrayBuffer = this.result;
					uint8array = new Uint8Array(arrayBuffer)

					PDFJS.getDocument(uint8array).then(function(pdf) {
						// Using promise to fetch the page
						pdf.getPage(2).then(function(page) {
							var scale = 1;
							var viewport = page.getViewport(scale);

							//
							// Prepare canvas using PDF page dimensions
							//
							var canvas = document.getElementById('pdf-canvas');
							var context = canvas.getContext('2d');
							canvas.height = viewport.height;
							canvas.width = viewport.width;

							//
							// Render PDF page into canvas context
							//
							var renderContext = {
								canvasContext: context,
								viewport: viewport
							};
							page.render(renderContext);
						});
					}).catch(function(error){
						console.log(error)
					});

				};
				fileReader.readAsArrayBuffer(data.blob);
			}, 100);
		});
	}

	plugin.refresh = decorator.signal();
	
	plugin.activate = function() {
		editor.synced.add(plugin.refresh);
		plugin.refresh();
	};
	
	plugin.deactivate = function() {
		editor.synced.remove(plugin.refresh);
	};
	
	return plugin;
});