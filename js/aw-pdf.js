(function(window) {
    var config = require.config({
        baseUrl: 'js',
        paths: {
            samples: '../samples/compiled',
            templates: '../templates',
            test_screenplays: '../test/data/test_screenplays',
            jquery: '../node_modules/jquery/dist/jquery',
            handlebars: '../node_modules/handlebars/dist/handlebars',
            logger: 'libs/logger',
            saveAs: '../node_modules/file-saver/FileSaver',
            d3: '../node_modules/d3/d3',
            modernizr: 'libs/modernizr',
            pdfkit: 'libs/pdfkit',
            impromptu: 'libs/jquery-impromptu.min',
            jstree: '../node_modules/jstree/dist/jstree',
            cookie: 'libs/jquery.cookie',
            dropbox: 'libs/dropbox.min',
            protoplast: '../node_modules/protoplast/dist/protoplast',
            acceptance: '../test/acceptance',
            off: '../node_modules/off/off',
            text: '../node_modules/text/text',
            Blob: 'libs/Blob',
            'es6-promise': '../node_modules/es6-promise/dist/es6-promise.min'
        },
        shim: {
            handlebars: {
                exports: 'Handlebars'
            },
            logger: {
                exports: 'Logger'
            },
            saveAs: {
                exports: 'saveAs'
            },
            modernizr: {
                exports: 'Modernizr'
            },
            dropbox: {
                exports: 'Dropbox'
            },
            Blob: {
                exports: 'Blob'
            }
        }
    });

    window.AWPDF = {
        loaded: false,
        init: function() {
            this.data.init_default_config();
            this.data.config = Object.create(this.data.default_config);
            this.loaded = true;
            if (this.ready_callback) {
                this.ready_callback(this);
            }
        },
        setScript: function(text) {
            this.data.script(text);
            this.data.parse();
        },
        getPdf: function(callback) {
            this.pdfmaker.get_pdf(this.data, callback);
        },
        ready: function(callback) {
            if (this.loaded) {
                callback(this);
            }
            else {
                this.ready_callback = callback;
            }
        }
    };

    require.config(config);
    require(['modules/data', 'utils/fountain/parser', 'utils/pdfmaker', 'utils/pdfjsviewer', 'saveAs'], function(data, parser, pdfmaker, pdfjsviewer, saveAs) {

        window.AWPDF.data = data;
        window.AWPDF.parser = parser;
        window.AWPDF.pdfmaker = pdfmaker;
        window.AWPDF.pdfjsviewer = pdfjsviewer;
        window.AWPDF.saveAs = saveAs;
        window.AWPDF.init();
    });
})(window);