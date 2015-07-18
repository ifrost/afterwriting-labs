/* global PDFJS */
define(function(require){

    PDFJS.disableWebGL = false;

    var base_zoom = 1.15;

    var viewer = {
        page: 1,
        numPages: 1,
        zoom: base_zoom,
        pdf: null
    };

    viewer.from_blob = function(blob) {
        var arrayBuffer, uint8array,
            fileReader = new FileReader();

        fileReader.onload = function() {
            arrayBuffer = this.result;
            uint8array = new Uint8Array(arrayBuffer);

            PDFJS.getDocument(uint8array).then(function(pdfFile) {
                viewer.set_pdf(pdfFile);
            }).catch(function(error){
                console.log(error)
            });
        };
        fileReader.readAsArrayBuffer(blob);
    };

    viewer.set_pdf = function(pdf) {
        viewer.pdf = pdf;
        viewer.numPages = pdf.numPages;
        viewer.render();
    };

    viewer.prev = function() {
        viewer.page -= 1;
        if (viewer.page < 1) {
            viewer.page = 0;
        }
        viewer.render();
    };

    viewer.next = function() {
        viewer.page += 1;
        if (viewer.page > viewer.numPages) {
            viewer.page = viewer.numPages;
        }
        viewer.render();
    };

    viewer.zoomin = function() {
        viewer.zoom *= base_zoom;
        viewer.render();
    };

    viewer.zoomout = function() {
        viewer.zoom /= base_zoom;
        viewer.render();
    };

    viewer.render = function() {
        viewer.pdf.getPage(viewer.page).then(function(page) {
            var viewport = page.getViewport(viewer.zoom);

            var canvas = document.getElementById('pdf-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            context.clearRect(0, 0, canvas.width, canvas.height);
            page.render(renderContext);
        });
    };

    return viewer;
});