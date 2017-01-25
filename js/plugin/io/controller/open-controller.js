define(function(require) {

    var Protoplast = require('p'),
        db = require('utils/dropbox'),
        gd = require('utils/googledrive'),
        local = require('utils/local'),
        tree = require('utils/tree'),
        helper = require('utils/helper'),
        EditorController = require('plugin/editor/controller/editor-controller'),
        LastUsedInfo = require('plugin/io/model/last-used-info'),
        IoModel = require('plugin/io/model/io-model'),
        SaveController = require('plugin/io/controller/save-controller'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        samples = require('samples');
    
    var OpenController = Protoplast.Object.extend({
        
        scriptModel: {
            inject: 'script'
        },
        
        themeController: {
            inject: ThemeController
        },
        
        ioModel: {
            inject: IoModel
        },

        saveController: {
            inject: SaveController
        },
        
        editorController:{
            inject: EditorController
        },

        settingsModel: {
            inject: 'settings'
        },

        init: function() {

            this.saveController.on('fountain-saved-to-google-drive', this._savedToGoogleDrive);
            this.saveController.on('fountain-saved-to-dropbox', this._savedToDropbox);

            this.scriptModel.bindScript(function () {
                var title = '';
                this.scriptModel.data('last-used-script', this.scriptModel.script());
                this.scriptModel.data('last-used-date', helper.format_date(new Date()));
                if (this.scriptModel.script()) {
                    var title_match;
                    var wait_for_non_empty = false;
                    this.scriptModel.script().split('\n').some(function (line) {
                        title_match = line.match(/title\:(.*)/i);
                        if (wait_for_non_empty) {
                            title = line.trim().replace(/\*/g, '').replace(/_/g, '');
                            wait_for_non_empty = !title;
                        }
                        if (title_match) {
                            title = title_match[1].trim();
                            wait_for_non_empty = !title;
                        }
                        return title && !wait_for_non_empty;
                    });
                }
                this.scriptModel.data('last-used-title', title || 'No title');
            }.bind(this));

            if (this.scriptModel.data('last-used-date')) {
                this.scriptModel.data('filename', '');
                // log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
                this.ioModel.lastUsedInfo = LastUsedInfo.create();
                this.ioModel.lastUsedInfo.script = this.scriptModel.data('last-used-script');
                this.ioModel.lastUsedInfo.date = this.scriptModel.data('last-used-date');
                this.ioModel.lastUsedInfo.title = this.scriptModel.data('last-used-title');
            }

            Protoplast.utils.bind(this, 'settingsModel.values.userSettingsLoaded', this._openLastUsedOnStartup);
        },

        createNew: function() {
            this._setScript('');
        },

        openSample: function(name) {
            var file_name = 'samples/' + name + '.fountain';
            var text = samples[file_name]();
            this._setScript(text);
        },

        openLastUsed: function() {
            if (this.ioModel.lastUsedInfo) {
                this._setScript(this.ioModel.lastUsedInfo.script);
            }
        },

        openFile: function(selectedFile) {
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function () {
                var value = this.result;
                self._setScript(value);
                local.local_file(selectedFile);
            };
            fileReader.readAsText(selectedFile);
        },

        openFromDropbox: function() {
            this._openFromCloud(db, this._openFromDropbox, function (selected) {
                db.load_file(selected.data.path, function (content) {
                    this._setScript(content);
                    this.scriptModel.data('db-path', selected.data.path);
                    // this.dispatch('opened-from-dropbox', data.format);
                }.bind(this));
            }.bind(this));
        },

        openFromGoogleDrive: function () {
            this._openFromCloud(gd, this.openFromGoogleDrive, function (selected) {
                gd.load_file(selected.data.id, function (content, link, fileid) {
                    this._setScript(content);
                    this.scriptModel.data('gd-link', link);
                    this.scriptModel.data('gd-fileid', fileid);
                    this.scriptModel.data('gd-parents', selected.parents.slice(0, selected.parents.length-2).reverse());
                    // this.dispatch('opened-from-google-drive', data.format);
                }.bind(this));
            }.bind(this));
        },

        _openLastUsedOnStartup: function() {
            if (this.scriptModel.config && this.scriptModel.config.load_last_opened) {
                this.openLastUsed();
            }
        },

        _savedToGoogleDrive: function(item) {
            this._clearLastOpened();
            this.scriptModel.data('gd-link', item.alternateLink);
            this.scriptModel.data('gd-fileid', item.id);
            this.scriptModel.data('filename', '');
            // TODO: needed?
            // if (editor.is_active) {
            //     editor.activate(); // refresj
            // }
        },

        _savedToDropbox: function(path) {
            this._clearLastOpened();
            this.scriptModel.data('db-path', path);
            this.scriptModel.data('filename', '');
            // TODO: needed?
            // if (editor.is_active) {
            //     editor.activate(); // refresh
            // }
        },

        _openFromCloud: function (client, back_callback, load_callback) {
            client.list(function (root) {
                root = typeof root !== 'function' ? client.convert_to_jstree(root) : root;
                tree.show({
                    info: 'Please select file to open.',
                    data: root,
                    label: 'Open',
                    search: !this.scriptModel.config.cloud_lazy_loading,
                    callback: function (selected) {
                        if (selected.data.isFolder) {
                            $.prompt('Please select a file, not folder.', {
                                buttons: {
                                    'Back': true,
                                    'Cancel': false
                                },
                                submit: function (v) {
                                    if (v) {
                                        back_callback();
                                    }
                                }
                            });
                        } else {
                            load_callback(selected);
                        }
                    }
                });
            }.bind(this), {
                before: function () {
                    $.prompt('Please wait...');
                },
                after: $.prompt.close,
                lazy: this.scriptModel.config.cloud_lazy_loading
            });
        },

        _setScript: function(value) {
            this._clearLastOpened();
            // DEBT: remove dependency to editor (++)
            this.editorController.cleanUp();
            this.scriptModel.script(value);
            this.themeController.clearSelectedSection();
        },

        _clearLastOpened: function() {
            this.scriptModel.format = undefined;
            this.scriptModel.data('db-path', '');
            this.scriptModel.data('gd-link', '');
            this.scriptModel.data('gd-fileid', '');
            this.scriptModel.data('gd-pdf-id', '');
            this.scriptModel.data('db-pdf-path', '');
            this.scriptModel.data('fountain-filename', '');
            this.scriptModel.data('pdf-filename', '');
            local.local_file(null);
        }
        
    });

    return OpenController;
});