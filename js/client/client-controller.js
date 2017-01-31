var Protoplast = require('protoplast');

var fs = require('fs');
var stdio = require('stdio');

var ops = stdio.getopt({
    'source': {
        key: 'source',
        args: 1,
        description: 'Fountain screenplay to load',
        mandatory: true
    },
    'pdf': {
        key: 'pdf',
        args: '*',
        description: 'output PDF filename'
    },
    'config': {
        key: 'config',
        args: 1,
        description: 'configuration file'
    },
    'overwrite': {
        key: 'overwrite',
        args: 0,
        description: 'overwrite exiting files'
    }
});


function validate_options() {
    var i;

    if (ops.pdf === true) {
        i = ops.source.lastIndexOf('.');
        ops.pdf = ops.source.slice(0, i) + '.pdf';
    }

    if (ops.pdf === ops.source) {
        ops.pdf += '.pdf';
    }
}

function file_exits(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

function load_config(config, callback) {
    if (config) {
        console.log('Loading config...', config);
        fs.readFile(config, 'utf8', function (err, data) {
            if (err) {
                console.error('Cannot open config file', config);
                callback({});
            } else {
                callback(JSON.parse(data));
            }
        });
    } else {
        callback({});
    }
}

function validate_pdf(callback) {
    if (file_exits(ops.pdf) && !ops.overwrite) {
        stdio.question('File ' + ops.pdf + ' already exists. Do you want to overwrite it?', ['y','n'], function(err, decision){
            if (decision === 'y') {
                callback();
            }
        });
    }
    else {
        callback();
    }
}


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

    init: function() {
        validate_options();

        var self = this;
        console.info('Loading script:', ops.source);

        fs.readFile(ops.source, 'utf8', function (err, text) {
            if (err) {
                console.error('Cannot open script file', ops.source);
            } else {
                load_config(ops.config, function (config) {
                    self.settings.fromJSON(config);
                    self.scriptModel.script = text;
                    self.scriptModel.parse();

                    if (ops.pdf) {
                        validate_pdf(function () {
                            console.log('Generating PDF', ops.pdf);
                            self.pdfController.getPdf(function () {
                                console.log('Done!');
                                process.exit(0);
                            }, ops.pdf);
                        });
                    }
                });
            }
        });
    }

});

module.exports = ClientController;