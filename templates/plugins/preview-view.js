define(function(require) {

    var template = require('text!templates/plugins/preview.hbs'),
        $ = require('jquery'),
        HandlebarComponent = require('utils/handlebar-component'),
        data = require('modules/data'),
        pdfjs_viewer = require('utils/pdfjsviewer');
    
    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            this.root.style.height = '100%';

            var preview = this.plugin;

            $('#next').click(pdfjs_viewer.next);
            $('#prev').click(pdfjs_viewer.prev);
            $('#zoomin').click(pdfjs_viewer.zoomin);
            $('#zoomout').click(pdfjs_viewer.zoomout);
            pdfjs_viewer.set_container(document.getElementById('pdfjs-viewer'));

            preview.refresh.add(function() {
                if (data.config.pdfjs_viewer) {
                    $('#pdf-preview-iframe-container').hide();
                    $('#pdf-preview-pdfjs-container').show();
                }
                else {
                    $('#pdf-preview-iframe-container').show();
                    $('#pdf-preview-pdfjs-container').hide();
                }

                $('#pdf-preview-iframe-container').html('<p>Loading preview...</p><embed id="pdf-preview-iframe" style="height: 100%; width: 100%; display:none"  type="application/pdf"></embed>');

                setTimeout(function() {
                    preview.get_pdf(function (result) {
                        $("#pdf-preview-iframe-container p").remove();
                        if (data.config.pdfjs_viewer) {
                            pdfjs_viewer.from_blob(result.blob);
                        }
                        else {
                            $("#pdf-preview-iframe").attr('src', result.url).css('display', 'block');
                        }
                    });
                }, 0);

            });
            preview.deactivate.add(function() {
                $("#pdf-preview-iframe").remove();
            });
        }

    });

});
