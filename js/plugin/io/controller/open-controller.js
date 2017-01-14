define(function(require) {

    var Protoplast = require('p'),
        data = require('modules/data'),
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