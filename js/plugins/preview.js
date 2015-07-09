define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		decorator = require('utils/decorator'),
		pdfmaker = require('utils/pdfmaker');
	
	var plugin = pm.create_plugin('preview', 'view');
	
	plugin.get_pdf = function(callback) {
		PDFJS.disableWebGL = false;
		pdfmaker.get_pdf(function(data){
			setTimeout(function(){
				PDFJS.getDocument(data.url).then(function(pdf) {
					// Using promise to fetch the page
					pdf.getPage(2).then(function(page) {
						var scale = 1.1;
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
						callback(data);
					});
				}).catch(function(error){
					console.log(error)
				});
			}, 100);
		});
	};
	
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