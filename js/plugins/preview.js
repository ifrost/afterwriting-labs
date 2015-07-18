define(function (require) {
	
	var pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		decorator = require('utils/decorator'),
		pdfmaker = require('utils/pdfmaker');
	
	var plugin = pm.create_plugin('preview', 'view');
	
	plugin.get_pdf = function(callback) {
		pdfmaker.get_pdf(callback);
	};

	var page = 1, numPages = 1, zoom = 1.15, pdf;

	plugin.prev = function() {
		page -= 1;
		if (page < 1) {
			page = 0;
		}
		plugin.get_pdfjs();
	};

	plugin.next = function() {
		page += 1;
		if (page > numPages) {
			page = numPages;
		}
		plugin.get_pdfjs();
	};

	plugin.zoomin = function() {
		zoom *= 1.2;
		plugin.get_pdfjs();
	};

	plugin.zoomout = function() {
		zoom /= 1.2;
		plugin.get_pdfjs();
	};

	function _render(pdf) {
		numPages = pdf.numPages;

		pdf.getPage(page).then(function(page) {
			var scale = zoom;
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
			context.clearRect(0, 0, canvas.width, canvas.height);
			page.render(renderContext);
		});
};

plugin.get_pdfjs = function() {
		PDFJS.disableWebGL = false;

		if (pdf) {
			_render(pdf);
			return;
		}

		pdfmaker.get_pdf(function(data){

			var arrayBuffer, uint8array;
			var fileReader = new FileReader();
			fileReader.onload = function() {
				arrayBuffer = this.result;
				uint8array = new Uint8Array(arrayBuffer);

				PDFJS.getDocument(uint8array).then(function(pdfFile) {
					// Using promise to fetch the page
					pdf = pdfFile;
					_render(pdf);
				}).catch(function(error){
				console.log(error)
				});
			};
			fileReader.readAsArrayBuffer(data.blob);

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