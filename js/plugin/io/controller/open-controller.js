define(function(require) {

    var Protoplast = require('p'),
        db = require('utils/dropbox'),
        data = require('modules/data'),
        tree = require('utils/tree'),
        helper = require('utils/helper'),
        LastUsedInfo = require('plugin/io/model/last-used-info'),
        IoModel = require('plugin/io/model/io-model'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        samples = require('samples');
    
    var OpenController = Protoplast.Object.extend({
        
        themeController: {
            inject: ThemeController
        },
        
        ioModel: {
            inject: IoModel
        },
        
        init: function() {
            data.script.add(function () {
                var title = '';
                data.data('last-used-script', data.script());
                data.data('last-used-date', helper.format_date(new Date()));
                if (data.script()) {
                    var title_match;
                    var wait_for_non_empty = false;
                    data.script().split('\n').some(function (line) {
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
                data.data('last-used-title', title || 'No title');
            });

            if (data.data('last-used-date')) {
                data.data('filename', '');
                // log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
                this.ioModel.lastUsedInfo = LastUsedInfo.create();
                this.ioModel.lastUsedInfo.script = data.data('last-used-script');
                this.ioModel.lastUsedInfo.date = data.data('last-used-date');
                this.ioModel.lastUsedInfo.title = data.data('last-used-title');
            }

            if (data.config.load_last_opened) {
                this.openLastUsed();
            }
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

        openFromDropbox: function() {
            this._openFromCloud(db, this._openFromDropbox, function (selected) {
                db.load_file(selected.data.path, function (content) {
                    this._setScript(content);
                    data.data('db-path', selected.data.path);
                }.bind(this));
            }.bind(this));
        },

        _openFromCloud: function (client, back_callback, load_callback) {
            client.list(function (root) {
                root = typeof root !== 'function' ? client.convert_to_jstree(root) : root;
                tree.show({
                    info: 'Please select file to open.',
                    data: root,
                    label: 'Open',
                    search: !data.config.cloud_lazy_loading,
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
            }, {
                before: function () {
                    $.prompt('Please wait...');
                },
                after: $.prompt.close,
                lazy: data.config.cloud_lazy_loading
            });
        },

        _setScript: function(value) {
            this._clearLastOpened();
            // editor.set_sync(false);
            // editor.set_auto_save(false);
            data.script(value);
            this.themeController.clearSelectedSection();
        },

        _clearLastOpened: function() {
            // TODO
        }
        
    });

    return OpenController;
});