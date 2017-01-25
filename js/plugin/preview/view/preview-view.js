define(function(require) {

    var template = require('text!plugin/preview/view/preview.hbs'),
        $ = require('jquery'),
        Protoplast = require('p'),
        HandlebarComponent = require('utils/handlebar-component'),
        SectionViewMixin = require('aw-bubble/view/section-view-mixin'),
        PreviewViewPresenter = require('plugin/preview/view/preview-view-presenter'),
        pdfjs_viewer = require('utils/pdfjsviewer');
    
    return HandlebarComponent.extend([SectionViewMixin], {

        hbs: template,
        
        // DEBT: remove direct references in views? (+)
        scriptModel: {
            inject: 'script'
        },

        $meta: {
            presenter: PreviewViewPresenter
        },

        pdf: null,
        
        init: function() {
            Protoplast.utils.bind(this, 'pdf', this._renderPdf);
        },
        
        _renderPdf: function(result) {
            if (result) {
                $("#pdf-preview-iframe-container p").remove();
                if (this.scriptModel.config.pdfjs_viewer) {
                    pdfjs_viewer.from_blob(result.blob);
                }
                else {
                    $("#pdf-preview-iframe").attr('src', result.url).css('display', 'block');
                }
            } else {
                $("#pdf-preview-iframe").remove();
            }
        },
        
        show: function() {
            if (this.scriptModel.config.pdfjs_viewer) {
                $('#pdf-preview-iframe-container').hide();
                $('#pdf-preview-pdfjs-container').show();
            }
            else {
                $('#pdf-preview-iframe-container').show();
                $('#pdf-preview-pdfjs-container').hide();
            }

            $('#pdf-preview-iframe-container').html('<p>Loading preview...</p><embed id="pdf-preview-iframe" style="height: 100%; width: 100%; display:none"  type="application/pdf"></embed>');
        },
        
        hide: function() {
            this.pdf = null;
        },
        
        addInteractions: function() {
            this.root.style.height = '100%';

            $('#next').click(pdfjs_viewer.next);
            $('#prev').click(pdfjs_viewer.prev);
            $('#zoomin').click(pdfjs_viewer.zoomin);
            $('#zoomout').click(pdfjs_viewer.zoomout);
            pdfjs_viewer.set_container(document.getElementById('pdfjs-viewer'));
        }

    });

});
