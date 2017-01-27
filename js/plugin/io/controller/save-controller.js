define(function(require) {

    var Protoplast = require('p'),
        gd = require('utils/googledrive'),
        db = require('utils/dropbox'),
        $ = require('jquery'),
        saveAs = require('saveAs'),
        tree = require('utils/tree'),
        forms = require('utils/forms'),
        decorator = require('utils/decorator');
    
    var SaveController = Protoplast.Object.extend({

        scriptModel: {
            inject: 'script'
        },
        
        pdfController: {
            inject: 'pdf'
        },

        saveFountainLocally: function() {
            forms.text('Select file name: ', this.scriptModel.data('fountain-filename') || 'screenplay.fountain', function (result) {
                this.scriptModel.parse();
                var blob = new Blob([this.scriptModel.script()], {
                    type: "text/plain;charset=utf-8"
                });
                this.scriptModel.data('fountain-filename', result.text);
                this.scriptModel.data('pdf-filename', result.text.split('.')[0] + '.pdf');
                saveAs(blob, result.text);
            });
        },

        saveFountainToDropbox: function() {
            this._saveToCloud({
                client: db,
                save_callback: function (selected, filename) {
                    this.scriptModel.parse();
                    var path = selected.data.path,
                        blob = new Blob([this.scriptModel.script()], {
                            type: "text/plain;charset=utf-8"
                        });
                    if (selected.data.isFolder) {
                        path += (path[path.length - 1] !== '/' ? '/' : '') + filename;
                    }
                    db.save(path, blob, function () {
                        if (filename) {
                            this.scriptModel.data('fountain-filename', filename);
                        }
                        this._fileSaved();
                        this.dispatch('fountain-saved-to-dropbox', path);
                    }.bind(this));
                }.bind(this),
                selected: this.scriptModel.data('db-path'),
                list_options: {
                    lazy: this.scriptModel.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.fountain'
            });
        },

        saveFountainToGoogleDrive: function() {
            this._saveToCloud({
                client: gd,
                save_callback: function (selected, filename) {
                    this.scriptModel.parse();
                    var blob = new Blob([this.scriptModel.script()], {
                        type: "text/plain;charset=utf-8"
                    });
                    gd.upload({
                        blob: blob,
                        convert: /\.gdoc$/.test(filename),
                        filename: filename,
                        callback: function (file) {
                            if (filename) {
                                this.scriptModel.data('fountain-filename', filename);
                            }
                            this._fileSaved();
                            this.dispatch('fountain-saved-to-google-drive', file);
                        }.bind(this),
                        parents: selected.data.isRoot ? [] : [selected.data],
                        fileid: selected.data.isFolder ? null : selected.data.id
                    });
                }.bind(this),
                selected: this.scriptModel.data('gd-fileid'),
                selected_parents: this.scriptModel.data('gd-parents'),
                list_options: {
                    writeOnly: true,
                    lazy: this.scriptModel.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.fountain'
            });
        },

        savePdfLocally: function() {
            forms.text('Select file name: ', this.scriptModel.data('pdf-filename') || 'screenplay.pdf', function (result) {
                this.pdfController.getPdf(function (pdf) {
                    this.scriptModel.data('pdf-filename', result.text);
                    this.scriptModel.data('fountain-filename', result.text.split('.')[0] + '.fountain');
                    saveAs(pdf.blob, result.text);
                }.bind(this));
            }.bind(this));
        },

        savePdfToDropbox: function() {
            this._saveToCloud({
                client: db,
                save_callback: function (selected, filename) {
                    var path = selected.data.path;
                    if (selected.data.isFolder) {
                        path += (path[path.length - 1] !== '/' ? '/' : '') + filename;
                    }
                    this.scriptModel.parse();
                    this.pdfController.getPdf(function (result) {
                        db.save(path, result.blob, function () {
                            if (filename) {
                                this.scriptModel.data('pdf-filename', filename);
                            }
                            this._fileSaved();
                        }.bind(this));
                    }.bind(this));
                }.bind(this),
                selected: this.scriptModel.data('db-pdf-path'),
                list_options: {
                    pdfOnly: true,
                    lazy: this.scriptModel.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.pdf'
            });
        },

        savePdfToGoogleDrive: function() {
            this._saveToCloud({
                client: gd,
                save_callback: function (selected, filename) {
                    this.scriptModel.parse();
                    this.pdfController.getPdf(function (pdf) {
                        gd.upload({
                            blob: pdf.blob,
                            filename: filename,
                            callback: function (file) {
                                if (filename) {
                                    this.scriptModel.data('pdf-filename', filename);
                                }
                                this._fileSaved();
                                this.scriptModel.data('gd-pdf-id', file.id);
                                var selected_parents = selected.parents.slice(0, selected.parents.length-2);
                                if (selected.type === 'default') {
                                    selected_parents.unshift(selected.id);
                                }
                                this.scriptModel.data('gd-pdf-parents', selected_parents.reverse());
                            }.bind(this),
                            convert: false,
                            parents: selected.data.isRoot ? [] : [selected.data],
                            fileid: selected.data.isFolder ? null : selected.data.id,
                        });
                    }.bind(this));
                }.bind(this),
                selected: this.scriptModel.data('gd-pdf-id'),
                selected_parents: this.scriptModel.data('gd-pdf-parents'),
                list_options: {
                    pdfOnly: true,
                    writeOnly: true,
                    lazy: this.scriptModel.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.pdf'
            });
        },

        /**
         * Save to the cloud using options:
         *  client - cloud client (dropox/googledrive)
         *  list_options - options passed to the client's list call
         *  selected - selected item
         *  default_filename - default filename if none has been used before
         *  save_callback - function call to save the file
         */
        _saveToCloud: function (options) {
            options.list_options = options.list_options || {};
            options.list_options.before = function () {
                $.prompt('Please wait...');
            };
            options.list_options.after = $.prompt.close;
            options.client.list(function (root) {
                root = typeof root !== 'function' ? options.client.convert_to_jstree(root) : root;
                tree.show({
                    data: root,
                    selected: options.selected,
                    selected_parents: options.selected_parents,
                    filename: options.default_filename,
                    save: true,
                    info: 'Select a file to override or choose a folder to save as a new file.',
                    callback: function (selected, filename) {
                        $.prompt('Please wait...');
                        options.save_callback(selected, filename);
                    }
                });
            }, options.list_options);
        },

        /**
         * Display file saved message
         */
        _fileSaved: function() {
            $.prompt.close();
            $.prompt('File saved!');
        }

    });

    return SaveController;
});