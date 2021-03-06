var Protoplast = require('protoplast');

var fs = require('fs');
var stdio = require('stdio');
var path = require('path');

var ClientController = Protoplast.Object.extend({

    scriptModel: {
        inject: 'script'
    },

    settings: {
        inject: 'settings'
    },

    pdfController: {
        inject: 'pdf'
    },

    options: {
        inject: 'options'
    },

    configLoader: {
        inject: 'configLoader'
    },

    awrequire: null,

    $create: function(awrequire) {
        this.awrequire = awrequire;
    },

    init: function() {

        console.info('Loading script:', this.options.ops.source);

        this._readFile(this.options.ops.source, function(text) {
            this.configLoader.loadFromFile(this.options.ops.config, this.options.ops.setting, function (config) {       
                this.settings.fromJSON(config);
                this.scriptModel.script = text;

                if (this.options.ops.pdf) {
                    this._validatePdf(function () {
                        console.log('Generating PDF', this.options.ops.pdf);

                        var customFonts;
                        if (this.options.ops.fonts) {
                            var fileName = this.options.ops.fonts;
                            if (!path.isAbsolute(fileName) && !fileName.startsWith('.')) {
                                fileName = "." + path.sep + fileName;
                            }
                            if (fileName.endsWith('.js')) {
                                fileName = fileName.slice(0, -3);
                            }
                            customFonts = this.awrequire(fileName);
                        }

                        this.pdfController.getPdf(function () {
                            console.log('Done!');
                            process.exit(0);
                        }, this.options.ops.pdf, customFonts);

                    }.bind(this));
                }
            }.bind(this));
        }.bind(this));
    },

    _readFile: function(path, callback) {
        fs.readFile(path, 'utf8', function (err, text) {
            if (err) {
                console.error('Cannot open script file', path);
            } else {
                callback(text);
            }
        });
    },

    _fileExists: function(path) {
        try {
            fs.statSync(path);
            return true;
        } catch (e) {
            return false;
        }
    },

    _validatePdf: function(callback) {
        if (this._fileExists(this.options.ops.pdf) && !this.options.ops.overwrite) {
            stdio.question('File ' + this.options.ops.pdf + ' already exists. Do you want to overwrite it?', ['y','n'], function(err, decision){
                if (decision === 'y') {
                    callback();
                }
            });
        }
        else {
            callback();
        }
    }

});

module.exports = ClientController;