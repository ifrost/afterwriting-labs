define(function(require) {

    var Protoplast = require('p'),
        gd = require('utils/googledrive'),
        db = require('utils/dropbox'),
        $ = require('jquery'),
        saveAs = require('saveAs'),
        pdfmaker = require('utils/pdfmaker'),
        tree = require('utils/tree'),
        forms = require('utils/forms'),
        decorator = require('utils/decorator'),
        data = require('modules/data');

    var SaveController = Protoplast.Object.extend({

        saveFountainLocally: function() {
            forms.text('Select file name: ', data.data('fountain-filename') || 'screenplay.fountain', function (result) {
                data.parse();
                var blob = new Blob([data.script()], {
                    type: "text/plain;charset=utf-8"
                });
                data.data('fountain-filename', result.text);
                data.data('pdf-filename', result.text.split('.')[0] + '.pdf');
                saveAs(blob, result.text);
            });
        },

        saveFountainToDropbox: function() {
            this._saveToCloud({
                client: db,
                save_callback: function (selected, filename) {
                    data.parse();
                    var path = selected.data.path,
                        blob = new Blob([data.script()], {
                            type: "text/plain;charset=utf-8"
                        });
                    if (selected.data.isFolder) {
                        path += (path[path.length - 1] !== '/' ? '/' : '') + filename;
                    }
                    db.save(path, blob, function () {
                        if (filename) {
                            data.data('fountain-filename', filename);
                        }
                        this._fileSaved();
                    }.bind(this));
                }.bind(this),
                selected: data.data('db-path'),
                list_options: {
                    lazy: data.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.fountain'
            });
        },

        saveFountainToGoogleDrive: function() {
            this._saveToCloud({
                client: gd,
                save_callback: function (selected, filename) {
                    data.parse();
                    var blob = new Blob([data.script()], {
                        type: "text/plain;charset=utf-8"
                    });
                    gd.upload({
                        blob: blob,
                        convert: /\.gdoc$/.test(filename),
                        filename: filename,
                        callback: function (file) {
                            if (filename) {
                                data.data('fountain-filename', filename);
                            }
                            this._fileSaved();
                        }.bind(this),
                        parents: selected.data.isRoot ? [] : [selected.data],
                        fileid: selected.data.isFolder ? null : selected.data.id
                    });
                }.bind(this),
                selected: data.data('gd-fileid'),
                selected_parents: data.data('gd-parents'),
                list_options: {
                    writeOnly: true,
                    lazy: data.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.fountain'
            });
        },

        savePdfLocally: function() {
            forms.text('Select file name: ', data.data('pdf-filename') || 'screenplay.pdf', function (result) {
                pdfmaker.get_pdf(function (pdf) {
                    data.data('pdf-filename', result.text);
                    data.data('fountain-filename', result.text.split('.')[0] + '.fountain');
                    saveAs(pdf.blob, result.text);
                });
            });
        },

        savePdfToDropbox: function() {
            this._saveToCloud({
                client: db,
                save_callback: function (selected, filename) {
                    var path = selected.data.path;
                    if (selected.data.isFolder) {
                        path += (path[path.length - 1] !== '/' ? '/' : '') + filename;
                    }
                    data.parse();
                    pdfmaker.get_pdf(function (result) {
                        db.save(path, result.blob, function () {
                            if (filename) {
                                data.data('pdf-filename', filename);
                            }
                            this._fileSaved();
                        }.bind(this));
                    }.bind(this));
                }.bind(this),
                selected: data.data('db-pdf-path'),
                list_options: {
                    pdfOnly: true,
                    lazy: data.config.cloud_lazy_loading
                },
                default_filename: 'screenplay.pdf'
            });
        },

        savePdfToGoogleDrive: function() {
            this._saveToCloud({
                client: gd,
                save_callback: function (selected, filename) {
                    data.parse();
                    pdfmaker.get_pdf(function (pdf) {
                        gd.upload({
                            blob: pdf.blob,
                            filename: filename,
                            callback: function (file) {
                                if (filename) {
                                    data.data('pdf-filename', filename);
                                }
                                this._fileSaved();
                                data.data('gd-pdf-id', file.id);
                                var selected_parents = selected.parents.slice(0, selected.parents.length-2);
                                if (selected.type === 'default') {
                                    selected_parents.unshift(selected.id);
                                }
                                data.data('gd-pdf-parents', selected_parents.reverse());
                            }.bind(this),
                            convert: false,
                            parents: selected.data.isRoot ? [] : [selected.data],
                            fileid: selected.data.isFolder ? null : selected.data.id,
                        });
                    }.bind(this));
                }.bind(this),
                selected: data.data('gd-pdf-id'),
                selected_parents: data.data('gd-pdf-parents'),
                list_options: {
                    pdfOnly: true,
                    writeOnly: true,
                    lazy: data.config.cloud_lazy_loading
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