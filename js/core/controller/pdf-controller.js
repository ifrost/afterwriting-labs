define(function(require) {

    var Protoplast = require('p'),
        data = require('modules/data'),
        pdfmaker = require('utils/pdfmaker'),
        textstats = require('utils/textstats');

    var PdfController = Protoplast.Object.extend({

        appModel: {
            inject: 'appModel'
        },

        getPdf: function(callback, filePath) {
            pdfmaker.get_pdf(
                {
                    callback: callback,
                    filepath: filePath,
                    print: data.config.print(),
                    config: data.config,
                    parsed: data.parsed,
                    hooks: {before_script: this._fontFix}
                });
        },

        _fontFix: function(doc) {
            if (this.appModel.urlParams.fontFix) {
                var unicode_sample = textstats.get_characters(data.script());
                unicode_sample.forEach(function(character) {
                    doc.format_text(character, 0, 0, {color: '#eeeeee'});
                })
            }
        }

    });

    return PdfController;
});