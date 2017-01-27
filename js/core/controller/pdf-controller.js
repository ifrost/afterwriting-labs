define(function(require) {

    var Protoplast = require('p'),
        pdfmaker = require('utils/pdfmaker');

    var PdfController = Protoplast.extend({
        
        appModel: {
            inject: 'appModel'
        },
        
        fontFixEnabled: {
            computed: ['appModel.urlParams.fontFix'],
            value: function() {
                return this.appModel.urlParams.fontFix;
            }
        },

        getPdf: function(callback, filePath) {
            pdfmaker.get_pdf(callback, filePath);
        }
        
    });

    return PdfController;
});