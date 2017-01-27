define(function(require) {

    var Protoplast = require('p');

    var PreviewController = Protoplast.extend({
        
        pdfContoller: {
            inject: 'pdf'
        },
        
        getPdf: function(callback) {
            this.pdfContoller.getPdf(callback);
        }
        
    });

    return PreviewController;
});